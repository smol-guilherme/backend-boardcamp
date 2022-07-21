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

      } else {

      }
      break;
    case "categories":
      validationFlag = validationHandler(req.params, req.body);
      if(validationFlag) {
        res.locals.needsValidation = validationFlag;
        res.locals.validationData = req.body;
        queryParams = 'INSERT INTO categories (name) SELECT $1 WHERE NOT EXISTS (SELECT name FROM categories WHERE name=$1)';
      } else {
        queryParams = 'SELECT name FROM categories ORDER BY id;';
      }
      break;
    default:
      res.status(404).send("PAGE NOT FOUND or UNABLE TO PROCESS REQUEST");
      return;
  }
  res.locals.queryParams = queryParams;
  next();
}
