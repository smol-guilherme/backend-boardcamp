import gamesSchema from "../database/models/gamesSchema.js";
import rentalsSchema from "../database/models/rentalsSchema.js";
import customersSchema from "../database/models/customersSchema.js";
import categoriesSchema from "../database/models/categoriesSchema.js";
import idSchema from "../database/models/idSchema.js";

const schema = {
  games: gamesSchema,
  rentals: rentalsSchema,
  customers: customersSchema,
  categories: categoriesSchema,
  id: idSchema,
};

export default async function validateEntry(req, res, next) {
  const validationData = res.locals.validationData || {};
  let queryDataArray = [];
  try {
    if (res.locals.needsValidation) {
      if (validationData.hasOwnProperty("length")) {
        for (const data of validationData) {
          const response = await invokeValidation(data, res.locals.reqPath);
          queryDataArray = queryDataArray.concat(Object.values(response));
        }
      } else {
        const response = await invokeValidation(
          validationData,
          res.locals.reqPath
        );
        queryDataArray = Object.values(response);
      }
      res.locals.queryData = queryDataArray;
      next();
    } else {
      next();
    }
  } catch (err) {
    if (err.details[0].type === "string.empty" || err.details[0].type === "date.base") {
      res.status(400).send(err.details[0].message);
      return;
    }
    res.status(422).send(err.details[0].message);
    return;
  }
}

async function validate(data, schema) {
  const response = await schema.validateAsync(data, {
    abortEarly: false,
  });
  return response;
}

async function invokeValidation(data, reqPath) {
  let validationSchema;
  if (Object.keys(data).length === 1 && Object.keys(data)[0] === "customerId") {
    validationSchema = schema.id;
  } else {
    validationSchema = schema[reqPath];
  }
  const response = await validate(data, validationSchema);
  if (response.hasOwnProperty("pricePerDay")) {
    response.pricePerDay *= 100;
  }
  return response;
}
