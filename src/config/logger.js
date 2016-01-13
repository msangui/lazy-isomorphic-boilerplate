import winston from 'winston';
const DailyRotateFile = require('winston-daily-rotate-file');

const logger = new (winston.Logger)({
    transports: [
        new (DailyRotateFile)({
            name: 'info-file',
            filename: 'logs/filelog-info.log',
            level: 'info'
        }),
        new (DailyRotateFile)({
            name: 'error-file',
            filename: 'logs/filelog-error.log',
            level: 'error'
        })
    ]
});

export default logger;
