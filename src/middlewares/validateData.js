import gamesSchema from "../database/models/gamesSchema.js";
import rentalsSchema from "../database/models/rentalsSchema.js";
import customersSchema from "../database/models/customersSchema.js";
import categoriesSchema from "../database/models/categoriesSchema.js";
import idSchema from "../database/models/idSchema.js";

const schema = {
  games: gamesSchema ,
  rentals: rentalsSchema ,
  customers: customersSchema ,
  categories: categoriesSchema ,
  id: idSchema ,
};

export default async function validateEntry(req, res, next) {
  // console.log(res.locals.validationData);
  if(res.locals.needsValidation) {
    try {
      const response = await validate(res.locals.validationData, schema[res.locals.reqPath]);
      if(response.hasOwnProperty('pricePerDay')) {
        response.pricePerDay*=100;
      }
      res.locals.queryData = Object.values(response);
      next();
    } catch(err) {
      console.log(err);
      if(err.details[0].type === 'string.empty') {
        res.status(400).send(err.details[0].message);
        return;
      }
      res.status(422).send(err);
      return;
    }
  } else {
    next();
  }
}

async function validate(data, schema) {
  const response = await schema.validateAsync(data, {
    abortEarly: false,
  });
  return response;
}