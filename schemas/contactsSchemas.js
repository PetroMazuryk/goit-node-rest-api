import Joi from "joi";
const subscriptionList = ["starter", "pro", "business"];

export const createContactSchema = Joi.object({
  name: Joi.string().min(2).max(20).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(2).max(20).required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});

export const uptadeFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

export const updateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionList)
    .required(),
});
