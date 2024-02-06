const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    // format: winston.format.json(),
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
        winston.format.prettyPrint(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'app.log' }),
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        level: 'info',
        format: winston.format.combine(winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)),
    }));
}

module.exports = logger;