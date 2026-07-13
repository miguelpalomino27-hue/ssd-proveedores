/**
 * Modulo TOPSIS (Technique for Order of Preference by Similarity to
 * Ideal Solution - Hwang & Yoon, 1981)
 * -------------------------------------------------------
 * Ordena un conjunto de alternativas (proveedores) segun su cercania a
 * una solucion ideal positiva y su lejania de una solucion ideal
 * negativa, dado un conjunto de criterios ponderados (pesos obtenidos
 * por AHP) y su naturaleza (beneficio o costo).
 *
 * Referencia metodologica: Hwang, C. L., & Yoon, K. (1981). Multiple
 * Attribute Decision Making: Methods and Applications. Springer-Verlag.
 */

/**
 * matrizDecision: array de alternativas, cada una un array de valores
 *   numericos por criterio. Ej: [[precio, calidad, plazo], ...]
 * pesos: array de pesos por criterio (deben sumar ~1, provienen de AHP)
 * tipos: array de 'beneficio' | 'costo' por criterio
 * nombresAlternativas: opcional, para identificar cada fila en el resultado
 */
function ejecutarTOPSIS(matrizDecision, pesos, tipos, nombresAlternativas) {
  const m = matrizDecision.length; // numero de alternativas (proveedores)
  const n = pesos.length; // numero de criterios

  if (m === 0) throw new Error('Debe existir al menos una alternativa (proveedor)');
  if (tipos.length !== n) throw new Error('El numero de tipos debe coincidir con el numero de pesos');
  for (const fila of matrizDecision) {
    if (fila.length !== n) {
      throw new Error('Cada alternativa debe tener un valor por cada criterio ponderado');
    }
  }
  const sumaPesos = pesos.reduce((a, b) => a + b, 0);
  if (Math.abs(sumaPesos - 1) > 0.02) {
    throw new Error(`Los pesos deben sumar 1 (suma actual: ${sumaPesos.toFixed(4)})`);
  }

  // 1. Normalizacion vectorial de la matriz de decision
  const normas = new Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    let suma = 0;
    for (let i = 0; i < m; i++) suma += matrizDecision[i][j] ** 2;
    normas[j] = Math.sqrt(suma);
  }
  const normalizada = matrizDecision.map((fila) =>
    fila.map((valor, j) => (normas[j] === 0 ? 0 : valor / normas[j]))
  );

  // 2. Matriz normalizada ponderada
  const ponderada = normalizada.map((fila) => fila.map((valor, j) => valor * pesos[j]));

  // 3. Solucion ideal positiva (A+) y negativa (A-)
  const idealPositivo = [];
  const idealNegativo = [];
  for (let j = 0; j < n; j++) {
    const columna = ponderada.map((fila) => fila[j]);
    if (tipos[j] === 'beneficio') {
      idealPositivo.push(Math.max(...columna));
      idealNegativo.push(Math.min(...columna));
    } else {
      idealPositivo.push(Math.min(...columna));
      idealNegativo.push(Math.max(...columna));
    }
  }

  // 4. Distancias euclidianas a A+ y A-
  const distanciaPositiva = ponderada.map((fila) =>
    Math.sqrt(fila.reduce((suma, valor, j) => suma + (valor - idealPositivo[j]) ** 2, 0))
  );
  const distanciaNegativa = ponderada.map((fila) =>
    Math.sqrt(fila.reduce((suma, valor, j) => suma + (valor - idealNegativo[j]) ** 2, 0))
  );

  // 5. Coeficiente de cercania relativa (CC*): 0 (peor) a 1 (mejor)
  const resultado = matrizDecision.map((_, i) => {
    const dPos = distanciaPositiva[i];
    const dNeg = distanciaNegativa[i];
    const cercania = dPos + dNeg === 0 ? 0 : dNeg / (dPos + dNeg);
    return {
      alternativa: nombresAlternativas ? nombresAlternativas[i] : `A${i + 1}`,
      distanciaPositiva: Number(dPos.toFixed(4)),
      distanciaNegativa: Number(dNeg.toFixed(4)),
      coeficienteCercania: Number(cercania.toFixed(4)),
    };
  });

  // 6. Ordenar de mayor a menor cercania y asignar ranking
  resultado.sort((a, b) => b.coeficienteCercania - a.coeficienteCercania);
  resultado.forEach((r, idx) => (r.ranking = idx + 1));

  return resultado;
}

module.exports = { ejecutarTOPSIS };
