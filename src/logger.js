const winston = require('winston');
const path = require('path');
const logDirectory = path.join(__dirname, 'logs');

const errorFilter = winston.format((info) => {
  if (info.status && info.status !== 500) {
    return false;
  }
  return info;
});

const logger = winston.createLogger({
  level: 'error',
  format: winston.format.combine(
    errorFilter(),
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      const logMessage = stack ? `${message}\nStack trace: ${stack}` : message;
      return `${timestamp} [${level.toUpperCase()}]: ${logMessage}`;
    })
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDirectory, 'error.log'),
      level: 'error',
    }),
  ],
});

module.exports = logger;
