const { ejecutarAHP, validarMatriz, calcularPesos } = require('../../src/services/ahp');

describe('Modulo AHP - validacion de matriz', () => {
  test('lanza error si la matriz no es cuadrada', () => {
    const matriz = [
      [1, 2],
      [0.5, 1, 3],
    ];
    expect(() => validarMatriz(matriz)).toThrow(/cuadrada/);
  });

  test('lanza error si la diagonal principal no es 1', () => {
    const matriz = [
      [2, 2],
      [0.5, 1],
    ];
    expect(() => validarMatriz(matriz)).toThrow(/diagonal/);
  });

  test('lanza error si la matriz no es reciproca', () => {
    const matriz = [
      [1, 3],
      [2, 1],
    ];
    expect(() => validarMatriz(matriz)).toThrow(/reciproca/);
  });

  test('acepta una matriz valida 3x3', () => {
    const matriz = [
      [1, 3, 5],
      [1 / 3, 1, 3],
      [1 / 5, 1 / 3, 1],
    ];
    expect(() => validarMatriz(matriz)).not.toThrow();
  });
});

describe('Modulo AHP - calculo de pesos', () => {
  test('los pesos de una matriz identidad (todo igual importancia) son uniformes', () => {
    const matriz = [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ];
    const pesos = calcularPesos(matriz);
    pesos.forEach((p) => expect(p).toBeCloseTo(1 / 3, 5));
  });

  test('los pesos siempre suman 1', () => {
    const matriz = [
      [1, 5, 3, 7],
      [1 / 5, 1, 1 / 2, 3],
      [1 / 3, 2, 1, 4],
      [1 / 7, 1 / 3, 1 / 4, 1],
    ];
    const pesos = calcularPesos(matriz);
    const suma = pesos.reduce((a, b) => a + b, 0);
    expect(suma).toBeCloseTo(1, 5);
  });

  test('el criterio dominante en la matriz recibe el mayor peso', () => {
    // El criterio 1 es fuertemente preferido sobre los demas
    const matriz = [
      [1, 9, 9],
      [1 / 9, 1, 1],
      [1 / 9, 1, 1],
    ];
    const pesos = calcularPesos(matriz);
    expect(pesos[0]).toBeGreaterThan(pesos[1]);
    expect(pesos[0]).toBeGreaterThan(pesos[2]);
  });
});

describe('Modulo AHP - consistencia (CR)', () => {
  test('una matriz perfectamente consistente tiene CR cercano a 0', () => {
    // Ejemplo classico de matriz consistente: a_ij * a_jk = a_ik
    const matriz = [
      [1, 2, 4],
      [1 / 2, 1, 2],
      [1 / 4, 1 / 2, 1],
    ];
    const { consistencia } = ejecutarAHP(matriz, ['Precio', 'Calidad', 'Plazo']);
    expect(consistencia.CR).toBeLessThan(0.01);
    expect(consistencia.esConsistente).toBe(true);
  });

  test('detecta una matriz inconsistente (CR > 0.10)', () => {
    // Juicios contradictorios: A > B > C pero C > A
    const matriz = [
      [1, 5, 1 / 9],
      [1 / 5, 1, 9],
      [9, 1 / 9, 1],
    ];
    const { consistencia } = ejecutarAHP(matriz, ['A', 'B', 'C']);
    expect(consistencia.CR).toBeGreaterThan(0.1);
    expect(consistencia.esConsistente).toBe(false);
  });

  test('devuelve un peso etiquetado por cada criterio en el orden dado', () => {
    const matriz = [
      [1, 2, 4],
      [1 / 2, 1, 2],
      [1 / 4, 1 / 2, 1],
    ];
    const { pesos } = ejecutarAHP(matriz, ['Precio', 'Calidad', 'Plazo']);
    expect(pesos.map((p) => p.criterio)).toEqual(['Precio', 'Calidad', 'Plazo']);
    expect(pesos[0].peso).toBeGreaterThan(pesos[2].peso);
  });
});
