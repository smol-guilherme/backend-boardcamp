import Joi from "joi";

const categorySchema = Joi.object({
  name: Joi.string().min(1).required()
});

export default categorySchema;