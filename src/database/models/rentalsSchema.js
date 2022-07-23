import Joi from "joi";

const rentSchema = Joi.object({
  customerId: Joi.number().required(),
  gameId: Joi.number().min(1).required(),
  daysRented: Joi.number().min(1).required(),
});

export default rentSchema;