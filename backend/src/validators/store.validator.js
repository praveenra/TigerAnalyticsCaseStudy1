import Joi from 'joi';

export const createStoreValidator = {
  body: Joi.object({
    name: Joi.string().min(2).required(),
    city: Joi.string().optional().allow(''),
    state: Joi.string().optional().allow(''),
    currency: Joi.string().optional().allow(''),
    country: Joi.string().optional().allow(''),
    isActive: Joi.boolean().optional().allow('')
  })
};

export const updateStoreValidator = {
  params: Joi.object({
    storeId: Joi.string().required()
  }),
  body: Joi.object({
    name: Joi.string().min(2).optional(),
    city: Joi.string().optional().allow(''),
    state: Joi.string().optional().allow(''),
    currency: Joi.string().optional().allow(''),
    country: Joi.string().optional().allow(''),
    isActive: Joi.boolean().optional().allow('')
  })
};
