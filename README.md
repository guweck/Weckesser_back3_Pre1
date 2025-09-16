CODERHOUSE - Módulo BACKEND III
ENTREGA FINAL
Alumno Gustavo Weckesser
# Adoptme – Backend API (Coderhouse Backend III)

API backend del proyecto **Adoptme**. Incluye:
- **Swagger** con documentación del módulo **Users** en `/api/docs`.
- **Testing funcional** con **Mocha + Chai + Supertest** sobre el router de **Adoptions**  
  _(última corrida local/CI: **6 passing**)_.  
- Imagen **Docker** pública lista para correr en local.

> **Credenciales**: los archivos `.env` y `.env.docker` **NO SE INCLUYEN**. Son requeridos. Crearlos en la raíz del proyecto.
> En la entrega (comentario del envío) se adjuntan los valores para que el corrector pueda ejecutar.
> Abajo hay plantillas con los nombres de variables.

---

## Quick start (local)

1) Clonar el repo y crear `.env` en la raíz (ver plantilla más abajo).  
2) Instalar dependencias y levantar:

```bash
npm ci
npm start
```

- API viva: <http://localhost:8080>
- Swagger: <http://localhost:8080/api/docs>
- Healthcheck: <http://localhost:8080/health>

---

## Tests (Supertest)

```bash
npm test
```

Casos cubiertos (esperado: **6 passing**):

- `GET  /api/adoptions` → lista
- `POST /api/adoptions/:uid/:pid` → adopción OK
- `POST /api/adoptions/:uid/:pid` → **404** con `uid` inexistente
- `POST /api/adoptions/:uid/:pid` → **404** con `pid` inexistente
- `POST /api/adoptions/:uid/:pid` → **400** sobre pet ya adoptada
- `GET  /api/adoptions/:aid` → **404** con `aid` inexistente

---

## 🐳 Ejecutar con Docker (usando Atlas)

> Requiere **Docker Desktop**. El corrector puede usar la imagen publicada o
> construir localmente. En ambos casos necesita las variables de entorno.

### Opción A — Usar imagen publicada

1) Crear `.env.docker` en la raíz (plantilla más abajo).  
2) Ejecutar:

```powershell
docker run --name adoptme ^
  --env-file .\.env.docker ^
  -p 8080:8080 ^
  gweckesser/adoptme-backend:latest
```

### Opción B — Construir localmente y correr

```powershell
docker build -t adoptme-backend:local .
docker run --name adoptme --env-file .\.env.docker -p 8080:8080 adoptme-backend:local
```

Para detener/borrar si el nombre ya existe:

```powershell
docker rm -f adoptme
```

---

## 🔐 Variables de entorno (plantillas)

### `.env` (para `npm start`)

```ini
MONGO_URL=mongodb+srv://<USER>:<PASS>@cluster0.xxxxxx.mongodb.net/adoptme?retryWrites=true&w=majority&appName=Cluster0
PORT=8080
```

### `.env.docker` (para `docker run`)

```ini
MONGO_URL=mongodb+srv://<USER>:<PASS>@cluster0.xxxxxx.mongodb.net/adoptme?retryWrites=true&w=majority&appName=Cluster0
PORT=8080
```

> En la entrega se comparten los valores reales para `<USER>` y `<PASS>`.
> Si el corrector prefiere no usar Atlas, se puede levantar Mongo local y
> apuntar `MONGO_URL` a `mongodb://mongo:27017/adoptme` (ver README original para Compose).

---

## Stack / Notas

- Node.js 18+ (probado 20.x).
- **Mongoose 6**, **Express 4**, **Winston** para logging, **compression** activo en producción.
- Swagger se habilita por defecto en local en `/api/docs`.
- Endpoints utilitarios: `/health` y `/loggerTest`.

---

## 🔗 Enlaces

- **Repositorio**: <https://github.com/guweck/Weckesser_back3_Pre1>
- **Docker Hub**: <https://hub.docker.com/r/gweckesser/adoptme-backend>

---

## ✅ Criterios de corrección cubiertos

- Swagger con endpoints documentados (al menos 3 detallados) → **sí**.
- Tests funcionales con Supertest (≥ 3 rutas incluyendo un POST) → **sí** (**6 passing**).
- Imagen en Docker Hub pública → **sí** (`gweckesser/adoptme-backend:latest`).
- Mocks de datos disponibles en el módulo correspondiente → **sí**.
