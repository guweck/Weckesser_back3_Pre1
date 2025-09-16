import { expect } from 'chai';
import request from 'supertest';
import mongoose from 'mongoose';

// IMPORTAR app.js para que arranque el server con el PORT del .env
import '../src/app.js';

const BASE = `http://localhost:${process.env.PORT || 8080}`;
const api = request.agent(BASE);

// ---- helpers robustos ----
const normalizeId = (val) => {
    if (!val) return undefined;
    if (typeof val === 'string') return val;
    if (typeof val === 'object') {
    // soporta { _id }, { id }, o el propio objeto serializado
    return String(val._id ?? val.id ?? val);
    }
    return String(val);
};

const registerUser = async (overrides = {}) => {
    const body = {
        first_name: 'Test',
        last_name: 'User',
        email: `test_${Date.now()}@example.com`,
        password: 'coder123',
        ...overrides,
    };

    const r = await api.post('/api/sessions/register').send(body);
    expect([200, 201]).to.include(r.status);

  // payload puede ser un string (id) o un objeto con _id
    const payload = r.body?.payload ?? r.body?.user ?? r.body;
    const _id = normalizeId(payload);
    return { _id };
};

const createPet = async (overrides = {}) => {
    const body = {
        name: `Firulais_${Date.now()}`,
        specie: 'dog',
        birthDate: '2020-01-01',
        ...overrides,
    };

    const r = await api.post('/api/pets').send(body);
    expect([200, 201]).to.include(r.status);

    const payload = r.body?.payload ?? r.body;
    const _id = normalizeId(payload);
    return { _id };
};

// Util para comparar ids aunque vengan como objeto o string
const toId = (v) => normalizeId(v);

describe('Adoptions router (functional)', function () {
    this.timeout(20000);

    it('GET /api/adoptions -> 200 y devuelve lista', async () => {
        const r = await api.get('/api/adoptions');
        expect(r.status).to.equal(200);

        const list = Array.isArray(r.body?.payload) ? r.body.payload : (Array.isArray(r.body) ? r.body : []);
        expect(list).to.be.an('array');
    });

    it('POST adopta y luego GET por :aid funciona', async () => {
        const user = await registerUser();
        const pet = await createPet();

        const adopt = await api.post(`/api/adoptions/${user._id}/${pet._id}`);
        expect([200, 201]).to.include(adopt.status);
        // mensaje tiende a ser "Pet adopted", pero no lo hacemos estricto
        expect(adopt.body).to.be.an('object');

        // listar y encontrar la adopción recién creada
        const listResp = await api.get('/api/adoptions');
        expect(listResp.status).to.equal(200);
        const list = Array.isArray(listResp.body?.payload) ? listResp.body.payload : [];
        const found = list.find(a => toId(a.owner) === user._id && toId(a.pet) === pet._id);

        expect(found, 'No se encontró la adopción recién creada').to.exist;

        // GET /api/adoptions/:aid
        const one = await api.get(`/api/adoptions/${found._id}`);
        expect(one.status).to.equal(200);
        const payload = one.body?.payload ?? one.body;
        expect(toId(payload._id)).to.equal(String(found._id));
    });

    it('POST con uid inexistente -> 404', async () => {
        const pet = await createPet();
        const fakeUid = new mongoose.Types.ObjectId().toString();
        const r = await api.post(`/api/adoptions/${fakeUid}/${pet._id}`);
        expect(r.status).to.equal(404);
    });

    it('POST con pid inexistente -> 404', async () => {
        const user = await registerUser();
        const fakePid = new mongoose.Types.ObjectId().toString();
        const r = await api.post(`/api/adoptions/${user._id}/${fakePid}`);
        expect(r.status).to.equal(404);
    });

    it('POST sobre pet ya adoptada -> 400', async () => {
        const u1 = await registerUser();
        const u2 = await registerUser();
        const pet = await createPet();

        const r1 = await api.post(`/api/adoptions/${u1._id}/${pet._id}`);
        expect([200, 201]).to.include(r1.status);

        const r2 = await api.post(`/api/adoptions/${u2._id}/${pet._id}`);
        expect(r2.status).to.equal(400);
    });

    it('GET /api/adoptions/:aid inexistente -> 404', async () => {
        const fakeAid = new mongoose.Types.ObjectId().toString();
        const r = await api.get(`/api/adoptions/${fakeAid}`);
        expect(r.status).to.equal(404);
    });
});
