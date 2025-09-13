FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
# build tools para compilar bcrypt
RUN apk add --no-cache python3 make g++ \
  && npm ci

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Puerto por defecto que usa app.js si no hay PORT
EXPOSE 8080
# Variables que deberías inyectar en runtime:
# - PORT (opcional)
# - MONGO_URL (obligatoria)
# - JWT_SECRET / etc (según tu app)
CMD ["npm","start"]
