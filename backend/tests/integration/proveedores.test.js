process.env.NODE_ENV = 'test';
require('dotenv').config({ path: '.env.test' });

const request = require('supertest');
const app = require('../../src/app');
const { pool } = require('../../src/config/db');

describe('Integracion: Autenticacion (/api/auth)', () => {
  const correoUnico = `qa_${Date.now()}@ssd.test`;

  afterAll(async () => {
    await pool.query('DELETE FROM usuarios WHERE correo = ?', [correoUnico]);
  });

  test('POST /api/auth/registro crea un usuario nuevo', async () => {
    const res = await request(app).post('/api/auth/registro').send({
      nombre: 'QA Tester',
      correo: correoUnico,
      password: 'Clave#2026',
    });
    expect(res.status).toBe(201);
    expect(res.body.correo).toBe(correoUnico);
  });

  test('POST /api/auth/registro rechaza correo duplicado', async () => {
    const res = await request(app).post('/api/auth/registro').send({
      nombre: 'QA Tester 2',
      correo: correoUnico,
      password: 'OtraClave#1',
    });
    expect(res.status).toBe(409);
  });

  test('POST /api/auth/login devuelve un token JWT valido', async () => {
    const res = await request(app).post('/api/auth/login').send({
      correo: correoUnico,
      password: 'Clave#2026',
    });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  test('POST /api/auth/login rechaza credenciales invalidas', async () => {
    const res = await request(app).post('/api/auth/login').send({
      correo: correoUnico,
      password: 'ClaveIncorrecta',
    });
    expect(res.status).toBe(401);
  });
});

describe('Integracion: CRUD de proveedores (/api/proveedores)', () => {
  let token;
  let idCreado;
  const correo = `qa_prov_${Date.now()}@ssd.test`;

  beforeAll(async () => {
    await request(app).post('/api/auth/registro').send({
      nombre: 'QA Proveedores',
      correo,
      password: 'Clave#2026',
    });
    const login = await request(app).post('/api/auth/login').send({ correo, password: 'Clave#2026' });
    token = login.body.token;
  });

  afterAll(async () => {
    if (idCreado) await pool.query('DELETE FROM proveedores WHERE id = ?', [idCreado]);
    await pool.query('DELETE FROM usuarios WHERE correo = ?', [correo]);
  });

  test('rechaza acceso sin token (401)', async () => {
    const res = await request(app).get('/api/proveedores');
    expect(res.status).toBe(401);
  });

  test('GET /api/proveedores devuelve un arreglo de proveedores activos', async () => {
    const res = await request(app).get('/api/proveedores').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0); // datos del seed.sql
  });

  test('POST /api/proveedores crea un nuevo proveedor valido', async () => {
    const res = await request(app)
      .post('/api/proveedores')
      .set('Authorization', `Bearer ${token}`)
      .send({
        razon_social: 'Proveedor de Prueba QA S.A.C.',
        ruc: '20999999999',
        rubro: 'Materiales de construccion',
        telefono: '066000000',
        direccion: 'Av. Test 123',
      });
    expect(res.status).toBe(201);
    expect(res.body.razon_social).toBe('Proveedor de Prueba QA S.A.C.');
    idCreado = res.body.id;
  });

  test('POST /api/proveedores rechaza RUC con formato invalido', async () => {
    const res = await request(app)
      .post('/api/proveedores')
      .set('Authorization', `Bearer ${token}`)
      .send({ razon_social: 'Invalido', ruc: '123' });
    expect(res.status).toBe(400);
  });

  test('PUT /api/proveedores/:id actualiza los datos del proveedor', async () => {
    const res = await request(app)
      .put(`/api/proveedores/${idCreado}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        razon_social: 'Proveedor QA Actualizado S.A.C.',
        ruc: '20999999999',
        rubro: 'Ferreteria',
        telefono: '066111111',
        direccion: 'Av. Test 456',
      });
    expect(res.status).toBe(200);
    expect(res.body.razon_social).toBe('Proveedor QA Actualizado S.A.C.');
  });

  test('DELETE /api/proveedores/:id realiza borrado logico', async () => {
    const res = await request(app)
      .delete(`/api/proveedores/${idCreado}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);

    const listado = await request(app).get('/api/proveedores').set('Authorization', `Bearer ${token}`);
    const sigueActivo = listado.body.some((p) => p.id === idCreado);
    expect(sigueActivo).toBe(false);
  });

  test('GET /api/proveedores/:id con id inexistente devuelve 404', async () => {
    const res = await request(app).get('/api/proveedores/999999').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});

// Cierra el pool de conexiones una unica vez, tras finalizar todos los
// describe de este archivo (evita el error "Pool is closed" que ocurria
// al cerrar el pool compartido dentro de cada describe individual).
afterAll(async () => {
  await pool.end();
});
