# -------- Etapa 1: deps (con toolchain para compilar bcrypt) --------
FROM node:20-alpine AS deps
WORKDIR /app

# Copiar solo manifest para aprovechar cache
COPY package.json package-lock.json* ./

# Toolchain para node-gyp (bcrypt) y deps de PRODUCCIÓN
RUN apk add --no-cache python3 make g++ \
  && npm ci --omit=dev

# -------- Etapa 2: runner (imagen final mínima) --------
FROM node:20-alpine AS runner
WORKDIR /app

# Entorno de ejecución por defecto
ENV NODE_ENV=production \
    PORT=8080

# curl para el HEALTHCHECK
RUN apk add --no-cache curl

# Copiar node_modules ya compilados (de prod) y código con dueño "node"
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --chown=node:node . .

# Crear carpetas necesarias (por si tu app escribe ahí)
RUN mkdir -p uploads logs

# Ejecutar como usuario no-root (más seguro)
USER node

EXPOSE 8080

# Healthcheck de la API (requiere endpoint /health)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -fsS http://localhost:8080/health || exit 1

# Arranque
CMD ["npm","start"]
