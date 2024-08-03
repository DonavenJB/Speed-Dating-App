const path = require("path");
const { createLogger, format, transports } = require("winston");
const Mask = require("./mask");

const level = process.env.NODE_LOGGING_LEVEL || "info";

const logger = createLogger({
  level,
  format: format.combine(
    format.timestamp(),
    format.json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.resolve(__dirname, "..", "..", "..", "..", "masked.log") })
  ]
});

const maskedLogger = new Mask(logger);

module.exports = {
  logger: logger,
  maskedLogger: maskedLogger
};
