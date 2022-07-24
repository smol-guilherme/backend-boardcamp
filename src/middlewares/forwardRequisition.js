import handleRentalData from "../handlers/rentalHandlers.js";
import validationDataHandler from "../handlers/validateDataHandler.js";
import validationHandler from "../handlers/validationHandler.js";

export default function pathHandlerMiddleware(req, res, next) {
  res.locals.reqPath = req.path.replaceAll(/\//g, " ").replace(/[0-9]+/, "").replaceAll(/\B\s/g,"").trim();
  res.locals.reqParams = req.path.replaceAll(/\D+/g, "")
  let queryParams;
  let validationFlag;
  let response;
  let indexes;
  let reqParams;

  
  if(res.locals.reqParams.length !== 0) {
    reqParams = { customerId: res.locals.reqParams }
  } else {
    reqParams = req.params;
  }
  const reqDataArray = [req.query, req.body, reqParams];
  res.locals.needsValidation = false;


  switch (res.locals.reqPath) {
    case "health":
      res.status(200).send("OK");
      return;
    case "rentals return":
    case "rentals":
      response = handleRentalData(reqDataArray, req.method);
      queryParams = response.queryString;
      validationFlag = response.flag;
      res.locals.needsValidation = validationFlag;
      indexes = response.opIndex;
      if(validationFlag) {
        if(indexes.length > 0 && indexes.length > 1) {
          res.locals.validationData = validationDataHandler(indexes, reqDataArray);
        } else {
          res.locals.validationData = reqDataArray[indexes[0]];
        }
      }
      break;
    case "customers":
      response = validationHandler(reqDataArray);
      validationFlag = response.flag;
      indexes = response.indexArray;
      if (validationFlag) {
        res.locals.needsValidation = validationFlag;
        response = validationDataHandler(indexes, reqDataArray, req.method)
        queryParams = response.queryString;
        res.locals.validationData = response.data;
      } else {
        queryParams = `SELECT * FROM customers ORDER BY id;`;
      }
      break;
    case "games":
      response = validationHandler(reqDataArray);
      validationFlag = response.flag;
      if (validationFlag) {
        res.locals.needsValidation = validationFlag;
        res.locals.validationData = req.body;
        queryParams = `
        INSERT INTO
          games (name, image, "stockTotal", "categoryId", "pricePerDay") 
        SELECT $1, $2, $3, $4, $5 
        WHERE 
          NOT EXISTS (SELECT name FROM games WHERE name ILIKE $1)
        AND
          EXISTS (SELECT id FROM categories WHERE id=$4);
        `;
      } else {
        queryParams = `
        SELECT 
          g.*, 
          (
            SELECT name AS "categoryName"
            FROM categories 
            WHERE id=g."categoryId"
          ) 
          FROM games AS g;`;
      }
      break;
    case "categories":
      response = validationHandler(reqDataArray);
      validationFlag = response.flag;
      if (validationFlag) {
        res.locals.needsValidation = validationFlag;
        res.locals.validationData = req.body;
        queryParams = `INSERT INTO categories (name) SELECT $1 WHERE NOT EXISTS (SELECT name FROM categories WHERE name ILIKE $1)`;
      } else {
        queryParams = `SELECT * FROM categories ORDER BY id;`;
      }
      break;
    default:
      res.status(404).send("PAGE NOT FOUND or UNABLE TO PROCESS REQUEST");
      return;
  }
  res.locals.queryParams = queryParams;
  next();
}
