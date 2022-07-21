import Joi from "joi";

const queryIdSchema = Joi.object({
  name: Joi.number().precision(0).required()
});

export default queryIdSchema;