import joi from 'joi';
import { joinedArray } from '../middlewares/validate.js';

const Joi = joi.extend(joinedArray);

export default {
  generate: {
    body: Joi.object({
      title: Joi.string(),
      input: Joi.object({
        num_inference_steps: Joi.number().integer(),
        enable_safety_checker: Joi.boolean(),
        sync_mode: Joi.boolean(),
        prompt_optimizer: Joi.boolean(),
      }).unknown(),
    }),
  },
};
