import Joi from 'joi';
export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid('dev', 'prod', 'production', 'debug', 'test').required(),
  APP_PORT: Joi.number().default(8080),

  // MongoDb
  MONGODB_READ_WRITE_URI: Joi.string().required(),

  // AWS
  AWS_ACCESS_KEY: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  AWS_REGION: Joi.string().required(),
  AWS_ACCOUNT_ID: Joi.string().required(),
  AWS_SES_SENDER_EMAIL: Joi.string().required(),

  DEFAULT_USER_ID: Joi.string().required(),
});
