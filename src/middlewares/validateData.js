import gameSchema from "../database/models/gameSchema.js";
import rentSchema from "../database/models/rentSchema.js";
import clientSchema from "../database/models/clientSchema.js";
import categorySchema from "../database/models/categorySchema.js";

export default async function validateEntry(req, res, next) {
  let entrySchema;
  try {
    const response = await entrySchema.validateAsync(data, {
      abortEarly: false,
    });
    next();
    return response;
  } catch (err) {
    console.log(err);
    return null;
  }
}