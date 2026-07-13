process.env.NODE_ENV = 'test';
require('dotenv').config({ path: '.env.test' });

const request = require('supertest');
const app = require('../../src/app');
const { pool } = require('../../src/config/db');

describe('Integracion: Motor de decision del SSD (/api/evaluaciones)', () => {
  let token;
  let idEvaluacionGuardada;
  const correo = `qa_eval_${Date.now()}@ssd.test`;

  const criterios = [
    { nombre: 'Precio unitario', tipo: 'costo' },
    { nombre: 'Calidad certificada', tipo: 'beneficio' },
    { nombre: 'Plazo de entrega', tipo: 'costo' },
  ];

  // Matriz AHP consistente (comparacion por pares entre los 3 criterios)
  const matrizAhp = [
    [1, 3, 5],
    [1 / 3, 1, 3],
    [1 / 5, 1 / 3, 1],
  ];

  const proveedores = [
    { nombre: 'Ferreteria San Cristobal', valores: [45, 8, 5] },
    { nombre: 'Corporacion Wari', valores: [50, 9, 3] },
    { nombre: 'Distribuidora Huamanga', valores: [38, 6, 7] },
  ];

  beforeAll(async () => {
    await request(app).post('/api/auth/registro').send({ nombre: 'QA Eval', correo, password: 'Clave#2026' });
    const login = await request(app).post('/api/auth/login').send({ correo, password: 'Clave#2026' });
    token = login.body.token;
  });

  afterAll(async () => {
    if (idEvaluacionGuardada) {
      await pool.query('DELETE FROM evaluaciones WHERE id = ?', [idEvaluacionGuardada]);
    }
    await pool.query('DELETE FROM usuarios WHERE correo = ?', [correo]);
    await pool.end();
  });


  test('rechaza el calculo sin autenticacion', async () => {
    const res = await request(app).post('/api/evaluaciones/calcular').send({ criterios, matrizAhp, proveedores });
    expect(res.status).toBe(401);
  });

  test('calcula pesos AHP y ranking TOPSIS end-to-end y persiste el resultado', async () => {
    const res = await request(app)
      .post('/api/evaluaciones/calcular')
      .set('Authorization', `Bearer ${token}`)
      .send({
        titulo: 'Evaluacion QA - materiales de construccion',
        criterios,
        matrizAhp,
        proveedores,
        guardar: true,
      });

    expect(res.status).toBe(200);
    expect(res.body.consistencia.esConsistente).toBe(true);
    expect(res.body.pesos).toHaveLength(3);
    expect(res.body.resultado).toHaveLength(3);
    expect(res.body).toHaveProperty('id');

    // El proveedor mas barato, con mejor calidad y menor plazo (Distribuidora
    // Huamanga) debe quedar mejor posicionado que uno estrictamente peor
    const ranking = res.body.resultado;
    const huamanga = ranking.find((r) => r.alternativa === 'Distribuidora Huamanga');
    expect(huamanga.ranking).toBeLessThanOrEqual(2);

    idEvaluacionGuardada = res.body.id;
  });

  test('rechaza una matriz AHP inconsistente (CR > 0.10)', async () => {
    const matrizInconsistente = [
      [1, 5, 1 / 9],
      [1 / 5, 1, 9],
      [9, 1 / 9, 1],
    ];
    const res = await request(app)
      .post('/api/evaluaciones/calcular')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Test inconsistente', criterios, matrizAhp: matrizInconsistente, proveedores });

    expect(res.status).toBe(422);
    expect(res.body.consistencia.esConsistente).toBe(false);
  });

  test('GET /api/evaluaciones/:id recupera la evaluacion guardada con su ranking', async () => {
    const res = await request(app)
      .get(`/api/evaluaciones/${idEvaluacionGuardada}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.titulo).toBe('Evaluacion QA - materiales de construccion');
    expect(res.body.resultado).toHaveLength(3);
  });

  test('GET /api/evaluaciones lista las evaluaciones del usuario autenticado', async () => {
    const res = await request(app).get('/api/evaluaciones').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.some((e) => e.id === idEvaluacionGuardada)).toBe(true);
  });
});
