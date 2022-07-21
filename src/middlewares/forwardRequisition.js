import validationHandler from "../handlers/validationHandler.js";

export default function pathHandlerMiddleware(req, res, next) {
  res.locals.reqPath = req.path.replaceAll(/\//g, "").replace(/[0-9]+/, "");
  // const id = req.query.customerId;
  // console.log(Object.keys(req.query));
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
      console.log('inside rentals');
      validationFlag = validationHandler(req.query, req.body);
      if(validationFlag) {
        res.locals.needsValidation = validationFlag;

      } else {
        queryParams = 'SELECT * FROM rentals ORDER BY id;';
      }
      break;
    case "customers":
      console.log('bzz');
      // console.log(req);
      console.log(req.query, req.body, req.params);
      validationFlag = validationHandler(req.query, req.body);
      // console.log(validationFlag);
      if(validationFlag) {
        res.locals.needsValidation = validationFlag;
        res.locals.validationData = req.body;
        // if(Object.keys(params).length===0) {
        //   res.locals.validationData.push({...req.query.customerId});
        // }
        console.log(res.locals.validationData);
        console.log('into if');
        queryParams = 'INSERT INTO customers (name, phone, cpf, birthday) SELECT $1, $2, $3, $4 WHERE NOT EXISTS (SELECT cpf FROM customers WHERE cpf=$3::VARCHAR)';
      } else {
        queryParams = 'SELECT * FROM customers ORDER BY id;';
      }
      break;
    // NÃO TEM QUERY STRING
    case "games":
      validationFlag = validationHandler(req.query, req.body);
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
      validationFlag = validationHandler(req.query, req.body);
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
