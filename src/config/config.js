const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    MONGO_URL: Joi.string().required(),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN_MINUTES: Joi.string().required(),NODE_ENV: Joi.string().valid('production', 'development').required(),
    PORT: Joi.string().default(3000),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoUrl: envVars.MONGO_URL,
  jwt: {
    secret: envVars.JWT_SECRET,
    expireInMinute: envVars.JWT_EXPIRES_IN_MINUTES,
  }
};
