import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

// Utilidad para role aleatorio
function randomRole() {
  return Math.random() < 0.15 ? 'admin' : 'user'; 
}

/**
 * Genera un documento de usuario con formato "tipo Mongo".
 * Password fija "coder123" encriptada.
 */
export async function generarUsuario() {
  const first_name = faker.person.firstName();
  const last_name = faker.person.lastName();
  const email = faker.internet.email({ firstName: first_name, lastName: last_name }).toLowerCase();
  const password = await bcrypt.hash('coder123', 10);
  const role = randomRole();
  const pets = []; // array de refs vacío

  // _id simulado para /mockingusers (solo mock). 
  const _id = faker.database.mongodbObjectId();

  return { _id, first_name, last_name, email, password, role, pets };
}

export async function generarUsuarios(n = 1) {
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push(await generarUsuario());
  }
  return out;
}

/**
 * Genera un documento de mascota (sin owner y sin adopted).
 */
export function generarPet() {
  const name = faker.animal.petName();
  const specie = faker.helpers.arrayElement(['dog', 'cat', 'hamster', 'bird', 'turtle', 'rabbit']);
  const birthDate = faker.date.past({ years: 10 });
  const adopted = false;
  const image = faker.image.urlPicsumPhotos();
  const _id = faker.database.mongodbObjectId();
  return { _id, name, specie, birthDate, adopted, image };
}

export function generarPets(n = 1) {
  return Array.from({ length: n }, () => generarPet());
}
