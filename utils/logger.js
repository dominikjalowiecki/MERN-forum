const winston = require('winston');
const env = process.env.NODE_ENV || 'development';

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4
};

const level = () => {
    return (env === 'development') ? 'debug' : 'http';
};

const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white'
};

winston.addColors(colors);

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    )
);

const options = {
    console: {
        format: winston.format.combine(
            winston.format.colorize({ all: true }),
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
            winston.format.printf(
                (info) => `${info.timestamp} ${info.level}: ${info.message}`,
            )
        )
    },
    error: {
        level: 'error',
        filename: 'logs/error.log',
        handleExceptions: true
    },
    all: {
        filename: 'logs/all.log',
        maxsize: 5242880, // 5MB,
        maxFiles: 5
    }
}

const transports = [];

if(env !== 'production') transports.push(new winston.transports.Console(options.console));
else transports.push(
    new winston.transports.File(options.error),
    new winston.transports.File(options.all)
);

const logger = winston.createLogger({
    level: level(),
    levels,
    transports
});

module.exports = logger