import Joi from 'joi';

export const createUserValidator = {
  body: Joi.object({
    name: Joi.string().min(2).required(),
    email: Joi.string().required(),
    role: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
  })
};

export const updateUserValidator = {
  params: Joi.object({
    userId: Joi.string().required()
  }),
  body: Joi.object({
    name: Joi.string().min(2).optional(),
    email: Joi.string().optional(),
    role: Joi.string().optional(),
    assignedStores: Joi.array().items(Joi.string()).optional(),
    isActive: Joi.boolean().optional()
  })
};
