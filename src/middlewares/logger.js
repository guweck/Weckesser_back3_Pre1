import { buildLogger } from '../utils/logger.js';

const logger = buildLogger();

export function addLogger(req, _res, next) {
    req.logger = logger;
    req.logger.http(`${req.method} ${req.originalUrl}`);
    next();
}
