import joi from 'joi';
import { joinedArray } from '../middlewares/validate.js';

const Joi = joi.extend(joinedArray);

export default {
  create: {
    body: Joi.object({
      name: Joi.string().required().max(255),
      email: Joi.string().email().lowercase().required(),
      roleId: Joi.number().integer().required(),
      shopId: Joi.number().integer().required(),
    }),
  },
  list: {
    query: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100)
        .default(20),
    }),
  },
};
