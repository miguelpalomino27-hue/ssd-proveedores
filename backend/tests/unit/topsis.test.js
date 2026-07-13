const { ejecutarTOPSIS } = require('../../src/services/topsis');

describe('Modulo TOPSIS', () => {
  test('lanza error si los pesos no suman 1', () => {
    const matriz = [
      [100, 8, 5],
      [120, 9, 3],
    ];
    expect(() =>
      ejecutarTOPSIS(matriz, [0.5, 0.5, 0.5], ['costo', 'beneficio', 'costo'], ['P1', 'P2'])
    ).toThrow(/pesos deben sumar 1/);
  });

  test('lanza error si hay menos de 1 alternativa', () => {
    expect(() => ejecutarTOPSIS([], [0.5, 0.5], ['costo', 'beneficio'])).toThrow(/alternativa/);
  });

  test('un proveedor dominante en todos los criterios beneficio obtiene ranking 1', () => {
    // 3 proveedores, 2 criterios de tipo beneficio: calidad y garantia (meses)
    const matriz = [
      [7, 12], // Proveedor A - mediocre
      [9, 24], // Proveedor B - el mejor en ambos
      [5, 6], // Proveedor C - el peor
    ];
    const pesos = [0.5, 0.5];
    const tipos = ['beneficio', 'beneficio'];
    const resultado = ejecutarTOPSIS(matriz, pesos, tipos, ['A', 'B', 'C']);

    const primero = resultado.find((r) => r.ranking === 1);
    expect(primero.alternativa).toBe('B');
  });

  test('un proveedor con menor costo (criterio tipo costo) es favorecido', () => {
    // 2 proveedores, 1 criterio precio (costo, menor es mejor)
    const matriz = [[100], [200]];
    const pesos = [1];
    const tipos = ['costo'];
    const resultado = ejecutarTOPSIS(matriz, pesos, tipos, ['Barato', 'Caro']);

    const primero = resultado.find((r) => r.ranking === 1);
    expect(primero.alternativa).toBe('Barato');
  });

  test('el coeficiente de cercania esta siempre entre 0 y 1', () => {
    const matriz = [
      [250, 8, 15],
      [300, 9, 10],
      [180, 6, 20],
      [220, 7, 12],
    ];
    const pesos = [0.5, 0.3, 0.2];
    const tipos = ['costo', 'beneficio', 'costo'];
    const resultado = ejecutarTOPSIS(matriz, pesos, tipos);
    resultado.forEach((r) => {
      expect(r.coeficienteCercania).toBeGreaterThanOrEqual(0);
      expect(r.coeficienteCercania).toBeLessThanOrEqual(1);
    });
  });

  test('asigna un ranking unico y consecutivo del 1 al N', () => {
    const matriz = [
      [250, 8, 15],
      [300, 9, 10],
      [180, 6, 20],
    ];
    const pesos = [0.5, 0.3, 0.2];
    const tipos = ['costo', 'beneficio', 'costo'];
    const resultado = ejecutarTOPSIS(matriz, pesos, tipos);
    const rankings = resultado.map((r) => r.ranking).sort((a, b) => a - b);
    expect(rankings).toEqual([1, 2, 3]);
  });
});
