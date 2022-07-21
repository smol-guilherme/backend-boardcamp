import validationHandler from "../handlers/validationHandler.js";

export default function pathHandlerMiddleware(req, res, next) {
  res.locals.reqPath = req.path.replace(/^\//, "");
  let queryParams;
  let validationFlag;
  res.locals.needsValidation = false;


  switch (res.locals.reqPath) {
    case "health":
      res.status(200).send("OK");
      return;
    // PODE TER QUERY STRING
    case "rentals/metrics":
    case "rentals":
      validationFlag = validationHandler(req.params, req.body);
      if(validationFlag) {
        res.locals.needsValidation = validationFlag;

      } else {

      }
      break;
    case "customers":
      validationFlag = validationHandler(req.params, req.body);
      if(validationFlag) {
        res.locals.needsValidation = validationFlag;

      } else {

      }
      break;
    // NÃO TEM QUERY STRING
    case "games":
      validationFlag = validationHandler(req.params, req.body);
      if(validationFlag) {
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
        queryParams = 'SELECT g.*, (SELECT name as "categoryName" FROM categories WHERE id=g."categoryId") FROM games AS g;';
      }
      break;
    case "categories":
      validationFlag = validationHandler(req.params, req.body);
      if(validationFlag) {
        res.locals.needsValidation = validationFlag;
        res.locals.validationData = req.body;
        queryParams = 'INSERT INTO categories (name) SELECT $1 WHERE NOT EXISTS (SELECT name FROM categories WHERE name ILIKE $1)';
      } else {
        queryParams = 'SELECT * FROM categories ORDER BY id;';
      }
      break;
    default:
      res.status(404).send("PAGE NOT FOUND or UNABLE TO PROCESS REQUEST");
      return;
  }
  res.locals.queryParams = queryParams;
  next();
}
