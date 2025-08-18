# Adoptme – Entrega 1 (Mocks & generateData)

Proyecto base tomado de **RecursosBackend-Adoptme** y extendido para cumplir la **Entrega Nº1** de Backend 3 (Coderhouse).

- Router `mocks.router.js` montado en **`/api/mocks`**
- `GET /api/mocks/mockingpets` (migrado desde la consigna previa)
- `GET /api/mocks/mockingusers` (50 por defecto; mock, _no persiste_)
- `POST /api/mocks/generateData` (genera e **inserta en BD** usuarios y mascotas)

Los mocks de **usuarios** incluyen:
- `password` = **coder123** (bcrypt hash)
- `role` ∈ `{user, admin}`
- `pets` = `[]`
- Formato “tipo Mongo” (con `_id` simulado en respuestas mock; al persistir, el `_id` lo genera Mongo)

---

## Requisitos

- **Node.js 18+** (recomendado)
- **MongoDB** (Atlas o local)
- Archivo **`.env`** enviado al profesor con la entrega.

---


El servidor escucha en: **http://localhost:${PORT}** (por defecto `8080`).

