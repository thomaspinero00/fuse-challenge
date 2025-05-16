export const configuration = () => {
  return {
    // Generals
    NODE_ENV: process.env.NODE_ENV || 'dev',
    APP_PORT: process.env.APP_PORT || 8080,

    // Mongodb
    MONGODB_READ_WRITE_URI: process.env.MONGODB_READ_WRITE_URI,

    // AWS
    AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCOUNT_ID: process.env.AWS_ACCOUNT_ID,
    AWS_SES_SENDER_EMAIL: process.env.AWS_SES_SENDER_EMAIL,

    DEFAULT_USER_ID: process.env.DEFAULT_USER_ID,

    // Vendor API
    VENDOR_API_KEY: process.env.VENDOR_API_KEY,
    VENDOR_URI: process.env.VENDOR_URI,
  };
};
