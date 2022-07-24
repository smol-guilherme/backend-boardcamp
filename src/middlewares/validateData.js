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
  const hasIdRegex = /[0-9]$/;
  const validationData = res.locals.validationData || {};
  let validationSchema;
  console.log(req.path, 'before test with', validationData, 'as params');
  // console.log(res.locals.needsValidation, 'after true');
  if(Object.keys(validationData).length === 1) {
    console.log('Im Id schema ');
    validationSchema = schema.id
  } else {
    validationSchema = schema[res.locals.reqPath];
  }
  if(res.locals.needsValidation) {
    try {
      const response = await validate(validationData, validationSchema);
      if(response.hasOwnProperty('pricePerDay')) {
        response.pricePerDay*=100;
      }
      res.locals.queryData = Object.values(response);
      console.log('next');
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