import Joi from "joi";

const clientSchema = Joi.object({
  name: Joi.string().min(1).required(),
  phone: Joi.string().length(11).required(),
  cpf: Joi.string().length(10).required(),
  birthday: Joi.string().regex(/[0-9]{4}-{1}[0-9]{2}-{1}[0-9]{2}/).required(),
});

export default clientSchema;