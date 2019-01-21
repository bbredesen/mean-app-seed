import winston from 'winston';

export const log = winston.createLogger({
  level : 'verbose',
  transports: [
    new winston.transports.Console({
      handleExceptions : true,
      format : winston.format.combine(
        winston.format.splat(),
        winston.format.colorize(),
        winston.format.printf(info => `[${info.level}] ${info.message}` )
      )
    }),
  ]
});

export default log;
