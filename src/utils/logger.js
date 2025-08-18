import { createLogger, format, transports, addColors } from 'winston';

const customLevels = {
    levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
    },
    colors: {
    fatal: 'bold bgRed white', // <- bgRed ✅
    error: 'red',
    warning: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'cyan',
    },
};

addColors(customLevels.colors);

const consoleDevFormat = format.combine(
    format.colorize({ all: true }),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    format.errors({ stack: true }),
    format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const rest = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    const base = `[${timestamp}] ${level}: ${message}`;
    return stack ? `${base}\n${stack}${rest}` : `${base}${rest}`;
    })
);

const consoleProdFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    format.errors({ stack: true }),
    format.printf(({ timestamp, level, message, stack, ...meta }) => {
    const rest = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    const base = `[${timestamp}] ${level}: ${message}`;
    return stack ? `${base}\n${stack}${rest}` : `${base}${rest}`;
    })
);

export function buildLogger(env = process.env.NODE_ENV || 'development') {
    const isProd = env === 'production';

    if (!isProd) {
    return createLogger({
        levels: customLevels.levels,
        level: 'debug',
        format: consoleDevFormat,
        transports: [new transports.Console({ level: 'debug' })],
        exitOnError: false,
    });
}

    return createLogger({
    levels: customLevels.levels,
    level: 'info',
    format: consoleProdFormat,
    transports: [
        new transports.Console({ level: 'info' }),
        new transports.File({
        filename: 'errors.log',
        level: 'error',
        format: format.combine(
            format.timestamp(),
            format.errors({ stack: true }),
            format.json()
            ),
        }),
    ],
    exitOnError: false,
    });
}
