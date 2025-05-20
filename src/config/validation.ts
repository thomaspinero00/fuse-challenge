import Joi from 'joi';
export const validationSchema = Joi.object({
  //System
  NODE_ENV: Joi.string().valid('dev', 'production').required(),
  APP_PORT: Joi.number().default(8080),
  API_TOKEN: Joi.string().required(),
  DEFAULT_USER_ID: Joi.string().required(),

  // MongoDb
  MONGODB_READ_WRITE_URI: Joi.string().required(),

  // AWS
  AWS_ACCESS_KEY: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_REGION: Joi.string().required(),
  AWS_ACCOUNT_ID: Joi.string().required(),
  AWS_SES_SENDER_EMAIL: Joi.string().required(),

  // Redis
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),

  // Vendor API
  VENDOR_API_KEY: Joi.string().required(),
  VENDOR_URI: Joi.string().required(),
});
