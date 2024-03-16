import { config } from 'dotenv';
import * as fs from 'fs';
import path from 'path';
config({ path: `.env` });

//set all env defaults values here
export const CREDENTIALS = process.env.CREDENTIALS == 'true';
export const {
  NODE_ENV = 'development',
  PORT = 3000,
  TLS_ENABLE,
  DB_PATH,
  TEST_DB_PATH,
  SECRET_KEY,
  ACTUAl_SECRET_KEY,
  LOG_DIR,
  LOGGER_LEVEL,
  ORIGIN
} = process.env;

export const getConfig = () => {
  const data = {
    TLS: {
      key: fs.readFileSync(
        path.join(__dirname, '../sslKeys/private.key'),
        'utf8'
      ),
      cert: fs.readFileSync(
        path.join(__dirname, '../sslKeys/certificate.crt'),
        'utf8'
      ),
      ca: fs.readFileSync(path.join(__dirname, '../sslKeys/ca_bundle.crt'))
    }
  };
  switch (process.env.NODE_ENV) {
    case 'development':
      return {
        ...data,
        domain: 'http://dev1.salesc2.com.s3-website-us-east-1.amazonaws.com',
        callbackUrl:
          'http://dev1.salesc2.com.s3-website-us-east-1.amazonaws.com/signup'
      };
    case 'production':
      return {
        ...data,
        domain: 'https://app.salesc2.com',
        callbackUrl: 'https://app.salesc2.com/signup'
      };
    case 'staging':
      return {
        ...data,
        domain: 'https://stage-app.salesc2.com',
        callbackUrl: 'https://stage-app.salesc2.com/signup'
      };
    default:
      return {
        ...data
      };
  }
};

export { config };
