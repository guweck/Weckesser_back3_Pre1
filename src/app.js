// src/app.js
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';

import { addLogger } from './middlewares/logger.js';

import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './docs/swaggers.js';

const app = express();

const PORT = Number(process.env.PORT || process.env.PUERTO || 8080);
const MONGO_URL = process.env.MONGO_URL ?? process.env.MONGO_URI;

if (!MONGO_URL) {
  console.error('Falta MONGO_URL/MONGO_URI en .env');
  process.exit(3);
}

// ----------------------- Middlewares base -----------------------
app.use(express.json());
app.use(cookieParser());
app.use(addLogger); // adjunta req.logger y loguea cada request (nivel http)

// ----------------------- Swagger (condicional) ------------------
// Habilitar Swagger si estamos fuera de producción O si forzamos con SWAGGER_ENABLED=true
const isProd = String(process.env.NODE_ENV).toLowerCase() === 'production';
const swaggerEnabled = process.env.SWAGGER_ENABLED === 'true' || !isProd;

if (swaggerEnabled) {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
  console.log('Swagger UI habilitado en /api/docs');
} else {
  console.log('Swagger UI deshabilitado (NODE_ENV=production y SWAGGER_ENABLED!=true)');
}

// ----------------------------- Routers --------------------------
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter);

// ------------------- Endpoints utilitarios ----------------------
app.get('/loggerTest', (req, res) => {
  const log = req.logger;
  log.debug('DEBUG: mensaje de depuración');
  log.http('HTTP: request de ejemplo');
  log.info('INFO: algo informativo');
  log.warning('WARNING: algo no ideal, pero seguimos');
  log.error('ERROR: algo falló');
  log.fatal('FATAL: fallo crítico');

  res.json({
    status: 'ok',
    message:
      'Logs enviados. Revisá consola (dev) o errors.log (prod para error/fatal).',
  });
});

// Healthcheck básico (útil para orquestadores / monitoreo)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Forzar un error para validar el middleware de errores y el logger
app.get('/errorTest', (_req, _res) => {
  throw new Error('Error intencional');
});

// ----------------- Middleware de errores global -----------------
app.use((err, req, res, _next) => {
  if (req?.logger) {
    req.logger.error('Unhandled error', { message: err?.message, stack: err?.stack });
  } else {
    console.error(err);
  }
  const status = err?.status || 500;
  res.status(status).json({ status: 'error', error: err?.message || 'Internal Server Error' });
});

// ----------------------- Conexión a Mongo -----------------------
mongoose
  .connect(MONGO_URL)
  .then(() => console.log('MongoDB conectado'))
  .catch((err) => {
    console.error('Error conectando a Mongo:', err);
    process.exit(1);
  });

// ----------------------- Arranque del server --------------------
app.listen(PORT, () => console.log(`Listening on ${PORT}`));

export default app;
