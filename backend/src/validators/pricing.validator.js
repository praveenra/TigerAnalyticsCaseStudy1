import Joi from 'joi';

export const createPricingValidator = {
  body: Joi.object({
    storeId: Joi.string().required().messages({
      'any.required': 'Store ID is required',
      'string.empty': 'Store ID cannot be empty'
    }),
    sku: Joi.string().required().messages({
      'any.required': 'SKU is required',
      'string.empty': 'SKU cannot be empty'
    }),
    productName: Joi.string().required().messages({
      'any.required': 'Product Name is required',
      'string.empty': 'Product Name cannot be empty'
    }),
    price: Joi.number().positive().required().messages({
      'any.required': 'Price is required',
      'number.base': 'Price must be a number',
      'number.positive': 'Price must be positive'
    }),
    effectiveDate: Joi.date().required().messages({
      'any.required': 'Effective Date is required',
      'date.base': 'Effective Date must be a valid date'
    })
  })
};

export const updatePricingValidator = {
  params: Joi.object({
    id: Joi.string().required().messages({
      'any.required': 'Pricing ID is required',
      'string.empty': 'Pricing ID cannot be empty'
    })
  }),
  body: Joi.object({
    storeId: Joi.string().optional(),
    sku: Joi.string().optional(),
    productName: Joi.string().optional(),
    price: Joi.number().positive().optional().messages({
      'number.base': 'Price must be a number',
      'number.positive': 'Price must be positive'
    }),
    effectiveDate: Joi.date().optional(),
    isActive: Joi.boolean().optional()
  })
};
