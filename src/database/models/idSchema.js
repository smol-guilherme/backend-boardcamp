import Joi from "joi";

const queryIdSchema = Joi.object({
  customerId: Joi.string().pattern(/[0-9]{1,}/).required()
});

export default queryIdSchema;