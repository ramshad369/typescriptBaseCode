import { DB_PATH, TEST_DB_PATH, NODE_ENV } from '../config';
import mongoose, { ConnectOptions } from 'mongoose';
import Logger from '../core/logger';

let url = '';

export const dbConnection = () => {
  if (NODE_ENV == 'test' && TEST_DB_PATH) {
    url = TEST_DB_PATH;
  } else if (NODE_ENV != 'test' && DB_PATH) {
    url = DB_PATH;
  } else {
    throw new Error('Environment variables not set for DB Connection!');
  }
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  };

  if (NODE_ENV !== 'production') {
    mongoose.set('debug', true);
  }

  // here is your global setting
  mongoose.set('strictQuery', false);
  mongoose.set('runValidators', true);
  mongoose.connect(url, options as ConnectOptions);

  mongoose.connection.on('open', function () {
    Logger.info('OPEN CONNECTION to mongo server.');
  });

  mongoose.connection.on('connected', function () {
    Logger.info('CONNECTED to mongo server.');
  });

  mongoose.connection.on('disconnected', function () {
    throw new Error('DIS-CONNECTED from MONGO SERVER!');
  });

  mongoose.connection.on('close', function () {
    throw new Error('CLOSE CONNECTION to MONGO SERVER!');
  });

  mongoose.connection.on('error', function (err) {
    Logger.error('ERROR CONNECTION to mongo server!');
    throw err;
  });
};
