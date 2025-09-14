# -------- Etapa 1: deps (con toolchain para compilar bcrypt) --------
FROM node:20-alpine AS deps
WORKDIR /app

# Copiar solo archivos que afectan a la instalación
COPY package.json package-lock.json* ./

# Toolchain para node-gyp (bcrypt) y deps de PRODUCCIÓN
RUN apk add --no-cache python3 make g++ \
  && npm ci --omit=dev

# -------- Etapa 2: runner (imagen final mínima) --------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production \
    PORT=8080

# Copiar node_modules ya compilados (solo prod)
COPY --from=deps /app/node_modules ./node_modules

# Copiar el resto del código
COPY . .

# Crear carpetas y dar permisos para logs/subidas
RUN mkdir -p uploads \
  && chown -R node:node /app

# Ejecutar como usuario no-root (más seguro??)
USER node

EXPOSE 8080

# Arranque
CMD ["npm","start"]
