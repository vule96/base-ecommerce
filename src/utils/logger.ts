import chalk from 'chalk';
import { resolve } from 'path';
import { createLogger, format, Logger as LoggerType, transports } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { env } from '~/config';

const errorColor = chalk.red.bold;
const warningColor = chalk.yellow.bold;
const successColor = chalk.green.bold;
const infoColor = chalk.white;
const httpColor = chalk.magenta;

const logFolderPath = env.LOG_FOLDER_PATH;
const maxLogSize = parseInt(env.LOG_FILE_MAX_SIZE, 10); // 10MB
const appName = env.APP_NAME;

if (!logFolderPath || !appName) {
  throw new Error('Required environment variables are missing.');
}

const customLevels = {
  error: 0,
  warning: 1,
  info: 2,
  success: 3,
  http: 4
};

const timestampFormat = format.timestamp({
  format: 'DD-MMM-YYYY HH:mm:ss.SSS'
});

const simpleOutputFormat = format.printf((log) => {
  return `${log['timestamp']}\t${log.level}: ${log.message}`;
});

const coloredOutputFormat = format.printf((log) => {
  let color = infoColor;

  switch (log.level) {
    case 'error':
      color = errorColor;
      break;
    case 'warning':
      color = warningColor;
      break;
    case 'success':
      color = successColor;
      break;
    case 'http':
      color = httpColor;
      break;
  }

  return `${log['timestamp']}\t${color(log.message)}`;
});

const fileFormat = format.combine(timestampFormat, simpleOutputFormat);
const consoleFormat = format.combine(timestampFormat, coloredOutputFormat);

const rotateTransport = new DailyRotateFile({
  filename: resolve(logFolderPath, `${appName}-%DATE%.log`),
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '10m',
  maxFiles: '14d',
  format: fileFormat
});

const loggerConfig = createLogger({
  levels: customLevels,
  transports: [
    new transports.File({
      level: 'error',
      filename: resolve(logFolderPath, 'error.log'),
      maxsize: maxLogSize,
      format: fileFormat
    }),
    new transports.File({
      level: 'success',
      filename: resolve(logFolderPath, 'combined.log'),
      maxsize: maxLogSize,
      format: fileFormat
    }),
    new transports.Console({
      level: 'http',
      format: consoleFormat,
      handleExceptions: true
    }),
    rotateTransport
  ],
  exceptionHandlers: [
    new transports.File({
      filename: resolve(logFolderPath, 'exceptions.log'),
      format: fileFormat
    }),
    new transports.Console({
      // Log exceptions to console for debugging
      format: consoleFormat,
      handleExceptions: true
    })
  ]
});

const logger = {
  error: (message: string): LoggerType => loggerConfig.error(message),
  warning: (message: string): LoggerType => loggerConfig.warning(message),
  info: (message: string): LoggerType => loggerConfig.info(message),
  success: (message: string): LoggerType => loggerConfig.log('success', message),
  http: (message: string): LoggerType => loggerConfig.log('http', message)
};

export default logger;
