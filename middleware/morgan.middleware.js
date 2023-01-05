const morgan = require('morgan');
const logger = require('../utils/logger');

const stream = {
  write: (message) => logger.http(message),
};

const skip = function (req, res) {
  const env = process.env.NODE_ENV || 'development';
  return env !== 'development' && res.statusCode < 400
};

const morganMiddleware = morgan(
  ':remote-addr :method :url :status :res[content-length] - :response-time ms',
  { stream, skip }
);

module.exports = morganMiddleware;