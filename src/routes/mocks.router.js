import { Router } from 'express';
import { generarUsuarios, generarPets } from '../mocks/mocking.js';
import { usersService, petsService } from '../services/index.js';

const router = Router();

/**
 * GET /api/mocks/mockingpets
 * Genera 100 mascotas mock (no persiste), formato similar a Mongo./
router.get('/mockingpets', async (req, res) => {
  const qty = Number.parseInt(req.query.qty ?? '100', 10);
  const payload = generarPets(Number.isFinite(qty) && qty > 0 ? qty : 100);
  res.json({ status: 'success', payload });
});

/**
 * GET /api/mocks/mockingusers
 * Genera N usuarios mock (no persiste) con password 'coder123' encriptada.
 * Por consigna, devolver 50 por defecto.
 * Permite override: /api/mocks/mockingusers?qty=NN
 */
router.get('/mockingusers', async (req, res, next) => {
  try {
    const qty = Number.parseInt(req.query.qty ?? '50', 10);
    const count = Number.isFinite(qty) && qty > 0 ? qty : 50;
    const payload = await generarUsuarios(count);
    res.json({ status: 'success', payload });
  } catch (err) { next(err); }
});

/**
 * POST /api/mocks/generateData
 * Body JSON: { users: number, pets: number }
 * Inserta en la base de datos la cantidad indicada.
 * Requiere conexión a Mongo configurada en src/app.js (URL DE MONGO).
 */
router.post('/generateData', async (req, res, next) => {
  try {
    const users = Number.parseInt(req.body?.users ?? '0', 10);
    const pets = Number.parseInt(req.body?.pets ?? '0', 10);

    if (!Number.isFinite(users) || users < 0 || !Number.isFinite(pets) || pets < 0) {
      return res.status(400).json({ status: 'error', error: 'Parámetros inválidos: users, pets' });
    }

    // Generar documentos
    const [usuarios, mascotas] = await Promise.all([
      generarUsuarios(users),
      (async () => generarPets(pets))()
    ]);

    // Remover _id mock para que Mongo genere su propio _id en insert
    const usuariosToInsert = usuarios.map(({ _id, ...doc }) => doc);
    const mascotasToInsert = mascotas.map(({ _id, ...doc }) => doc);

    // Insertar en paralelo vía Repos/DAOs
    const createdUsers = await Promise.all(usuariosToInsert.map(u => usersService.create(u)));
    const createdPets = await Promise.all(mascotasToInsert.map(p => petsService.create(p)));

    res.status(201).json({
      status: 'success',
      inserted: {
        users: createdUsers.length,
        pets: createdPets.length
      }
    });
  } catch (err) { next(err); }
});

export default router;
