import Joi from "joi";

const gameSchema = Joi.object({
  name: Joi.string().min(1).required(),
  image: Joi.string().required(),
  stockTotal: Joi.number().precision(0).min(1).required(),
  categoryId: Joi.number().precision(0).required(),
  pricePerDay: Joi.number().precision(2).required()
});

export default gameSchema;