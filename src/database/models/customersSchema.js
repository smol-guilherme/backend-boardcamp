import Joi from "joi";

const date = new Date().toISOString().substring(0,10);

const clientSchema = Joi.object({
  name: Joi.string().min(1).required(),
  phone: Joi.string().pattern(/[0-9]{10,11}/).required(),
  cpf: Joi.string().pattern(/[0-9]{11}/).required(),
  birthday: Joi.date().max(date).required(),
});

export default clientSchema;