const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const customFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(
    label({ label: 'TodoApp' }),
    timestamp(),
    customFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'app.log' })
  ]
});

module.exports = logger;
