import Joi from 'joi';

// Register validator
export const registerValidator = {
  body: Joi.object({
    name: Joi.string().trim().required().messages({
      'any.required': 'Name is required',
      'string.empty': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
      'any.required': 'Email is required',
      'string.empty': 'Email is required',
      'string.email': 'Email is invalid'
    }),
    password: Joi.string().min(8).required().messages({
      'any.required': 'Password is required',
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters'
    }),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Confirm password is required'
    })
  })
};

// Login validator
export const loginValidator = {
  body: Joi.object({
    email: Joi.string().email().required().messages({
      'any.required': 'Email is required',
      'string.empty': 'Email is required',
      'string.email': 'Email is invalid'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Password is required',
      'string.empty': 'Password is required'
    })
  })
};
