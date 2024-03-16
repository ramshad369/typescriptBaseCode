import winston, { Logger } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { LOGGER_LEVEL, LOG_DIR } from '../config';

// Define your severity levels.
// With them, You can create log files,
// see or hide levels based on the running ENV.
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// This method set the current severity based on
// the current NODE_ENV: show all the log levels
// if the server was run in development mode; otherwise,
// if it was run in production, show only warn and error messages.
const level = () => {
  return LOGGER_LEVEL || 'debug';
};

// Define different colors for each level.
// Colors make the log message more visible,
// adding the ability to focus or ignore messages.
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white'
};

// Tell winston that you want to link the colors
// defined above to the severity levels.
winston.addColors(colors);

// Chose the aspect of your log customizing the log format.
const format = winston.format.combine(
  // Add the message timestamp with the preferred format
  winston.format.timestamp(),
  // Tell Winston that the logs must be colored
  // winston.format.colorize({ all: true }),
  // Define the format of the message showing the timestamp, the level and the message
  winston.format.printf(
    (info: any) => `${info.timestamp} ${info.level}: ${info.message}`
  ),
  winston.format.errors(),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  // Add the message timestamp with the preferred format
  winston.format.timestamp(),
  // Tell Winston that the logs must be colored
  winston.format.colorize({ all: true }),
  // Define the format of the message showing the timestamp, the level and the message
  winston.format.printf(
    (info: any) => `${info.timestamp} ${info.level}: ${info.message}`
  ),
  winston.format.errors()
);

const loggerDir = './' + (LOG_DIR || 'logs') + '/info';

const rotateTransport: DailyRotateFile = new DailyRotateFile({
  filename: 'info',
  extension: '.log',
  dirname: loggerDir,
  datePattern: 'YYYY-MM-DD',
  // frequency: '1m', // it depends on datePattern eg. YYYY-MM-DD-HH-mm
  maxFiles: '10',
  auditFile: loggerDir + '/auditFile.json',
  json: true,
  handleExceptions: true,
  // colorize: false,
  format: format
});
rotateTransport.on(
  'rotate',
  function (oldFilename: string, newFilename: string) {
    // do something fun
    console.log(oldFilename, newFilename);
  }
);

// Define which transports the logger must use to print out messages.
// In this example, we are using three different transports
const transports = [
  // Allow the use the console to print the messages
  new winston.transports.Console({
    level: 'debug',
    format: consoleFormat
  }),
  // Allow to print all the error level messages inside the error.log file
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error'
  }),
  // Allow to print all the error message inside the all.log file
  // (also the error log that are also printed inside the error.log(
  // new winston.transports.File({ filename: 'logs/all.log' })

  // add rotate transport
  rotateTransport
];

const exceptionHandlers = [
  new winston.transports.File({ filename: 'logs/exceptions.log' })
];

// Create the logger instance that has to be exported
// and used to log messages.
const logger: Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
  exceptionHandlers
});

export default logger;
