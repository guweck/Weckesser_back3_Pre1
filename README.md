# Adoptme – Backend (Coderhouse Backend III)
Alumno: Gustavo Weckesser

Proyecto base del curso con:

- **Swagger** documentando el módulo **Users** en `/api/docs`  
- **Tests funcionales** (Mocha + Chai + Supertest) para **adoption.router.js**  
- **Imagen Docker** publicada en **Docker Hub**

---

## 🔗 Imagen en Docker Hub

- Repositorio: `gweckesser/adoptme-backend`  
- Etiquetas: `latest`, `1.0.0`  
- Enlace: https://hub.docker.com/r/gweckesser/adoptme-backend

---

## 📦 Requisitos

- Node.js 18+ (solo si vas a correr en modo local)
- Docker Desktop (para ejecutar en contenedor)
- Variables de entorno necesarias:
  - `MONGO_URL` (obligatoria) – cadena de conexión a MongoDB Atlas o local
  - `PORT` (opcional) – por defecto **8080**
  CREDENCIALES EN EL TEXTO DE LA ENTREGA (PLATAFORMA CODERHOUSE)


## ▶️ Ejecución local (sin Docker)

```bash
npm ci
npm start
```
- API: http://localhost:8080  
- Swagger: http://localhost:8080/api/docs  
- Healthcheck: http://localhost:8080/health

---

## 🧪 Testing

Tests funcionales del **router de Adoptions** con **Mocha + Chai + Supertest**.

```bash
npm test
```

Casos cubiertos (esperado: **6 passing**):

- `GET  /api/adoptions` → lista (200)
- `POST /api/adoptions/:uid/:pid` → adopción OK (200) **y luego** `GET /api/adoptions/:aid` → 200
- `POST /api/adoptions/:uid/:pid` → **404** con `uid` inexistente
- `POST /api/adoptions/:uid/:pid` → **404** con `pid` inexistente
- `POST /api/adoptions/:uid/:pid` → **400** si la pet ya está adoptada
- `GET  /api/adoptions/:aid` → **404** con `aid` inexistente

---

## 🐳 Ejecutar con Docker (usando Atlas)

1) CONTENIDO DE LOS ARCHIVOS .env y .env.docker en el texto de la entrega. Ambos archivos se crean en la raíz del proyecto

2) Levantar el contenedor desde la **imagen de Docker Hub**:

> PowerShell (Windows):

```powershell
docker rm -f adoptme 2>$null
docker run --name adoptme `
  --env-file .\.env.docker `
  -p 8080:8080 `
  gweckesser/adoptme-backend:latest
```

> Bash (Linux / macOS):

```bash
docker rm -f adoptme 2>/dev/null
docker run --name adoptme   --env-file ./.env.docker   -p 8080:8080   gweckesser/adoptme-backend:latest
```

- API: http://localhost:8080  
- Swagger: http://localhost:8080/api/docs

Para detener y borrar el contenedor:
```bash
docker rm -f adoptme
```

---

## 🧱 Construir imagen localmente (opcional)

Si se prefiere construir la imagen a partir del código fuente:

```bash
docker build -t adoptme-backend:local .
docker run --name adoptme-local   --env-file ./.env.docker   -p 8080:8080   adoptme-backend:local
```

---

## 🐙 Opción B: Docker Compose (Mongo local) – ideal para corrección sin Atlas

Si no se desea usar Atlas, se puede levantar un Mongo local junto con la app.  
Crear **`docker-compose.yml`** en la raíz con el siguiente contenido:

```yaml
version: "3.9"

services:
  mongo:
    image: mongo:6
    container_name: adoptme-mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  adoptme:
    image: gweckesser/adoptme-backend:latest
    container_name: adoptme
    environment:
      MONGO_URL: "mongodb://mongo:27017/adoptme"
      PORT: "8080"
    ports:
      - "8080:8080"
    depends_on:
      - mongo
    restart: unless-stopped

volumes:
  mongo_data:
```

Levantar todo:

```bash
docker compose up -d
```

- API: http://localhost:8080  
- Swagger: http://localhost:8080/api/docs

Para apagar los servicios:
```bash
docker compose down
```

---

## 📚 Módulos documentados

- **Users** → Documentado con Swagger en `/api/docs`
- **Adoptions** → Tests funcionales (Mocha + Chai + Supertest)

---

## 📝 Notas

- El logger está configurado y disponible; revisar `/loggerTest` para ver niveles.
- No se incluye `.env` por seguridad. Usar `.env.docker` para pruebas con Docker.
- La app escucha por defecto en `PORT=8080` si la variable no está seteada.

---

¡Gracias por revisar el proyecto! 😊
