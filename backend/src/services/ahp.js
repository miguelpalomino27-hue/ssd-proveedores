/**
 * Modulo AHP (Analytic Hierarchy Process - Saaty, 1980)
 * -------------------------------------------------------
 * Calcula los pesos (prioridades) de los criterios de decision a partir
 * de una matriz de comparacion por pares, y valida la consistencia del
 * juicio del decisor mediante la Razon de Consistencia (CR).
 *
 * Referencia metodologica: Saaty, T. L. (1980). The Analytic Hierarchy
 * Process. McGraw-Hill.
 */

// Indice Aleatorio (RI) tabulado por Saaty para matrices de orden 1 a 10.
const RANDOM_INDEX = [0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];

/**
 * Valida que la matriz sea cuadrada, reciproca (a_ji = 1/a_ij) y con
 * diagonal principal igual a 1.
 */
function validarMatriz(matriz) {
  const n = matriz.length;
  if (n === 0) throw new Error('La matriz de comparacion no puede estar vacia');

  for (const fila of matriz) {
    if (fila.length !== n) {
      throw new Error('La matriz de comparacion debe ser cuadrada (n x n)');
    }
  }

  for (let i = 0; i < n; i++) {
    if (Math.abs(matriz[i][i] - 1) > 1e-9) {
      throw new Error(`La diagonal principal debe ser 1 (fila ${i} tiene ${matriz[i][i]})`);
    }
    for (let j = 0; j < n; j++) {
      if (matriz[i][j] <= 0) {
        throw new Error('Todos los valores de la matriz deben ser positivos');
      }
      // Tolerancia relativa (no absoluta): los analistas suelen ingresar
      // reciprocos truncados a pocos decimales (p. ej. 0.3333 en vez de
      // 1/3 exacto). Una tolerancia demasiado estricta (1e-6) rechaza
      // matrices legitimas por redondeo manual, asi que se acepta un
      // desvio de hasta 0.5% respecto del reciproco exacto.
      const reciproco = 1 / matriz[j][i];
      const desvioRelativo = Math.abs(matriz[i][j] - reciproco) / reciproco;
      if (desvioRelativo > 0.005) {
        throw new Error(
          `La matriz no es reciproca: a[${i}][${j}]=${matriz[i][j]} debe ser aproximadamente 1/a[${j}][${i}]=${reciproco.toFixed(4)}`
        );
      }
    }
  }
  return n;
}

/**
 * Normaliza columnas y promedia filas: metodo del vector propio aproximado
 * (media geometrica normalizada), ampliamente usado como aproximacion
 * practica al metodo del autovector principal de Saaty.
 */
function calcularPesos(matriz) {
  const n = validarMatriz(matriz);

  // 1. Suma de cada columna
  const sumaColumnas = new Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      sumaColumnas[j] += matriz[i][j];
    }
  }

  // 2. Matriz normalizada
  const normalizada = matriz.map((fila) =>
    fila.map((valor, j) => valor / sumaColumnas[j])
  );

  // 3. Vector de pesos = promedio de cada fila de la matriz normalizada
  const pesos = normalizada.map((fila) => fila.reduce((a, b) => a + b, 0) / n);

  return pesos;
}

/**
 * Calcula lambda_max, el Indice de Consistencia (CI) y la Razon de
 * Consistencia (CR = CI / RI). Saaty recomienda aceptar la matriz solo si
 * CR <= 0.10 (10%).
 */
function calcularConsistencia(matriz, pesos) {
  const n = matriz.length;

  // Vector resultante de A * w
  const Aw = matriz.map((fila) =>
    fila.reduce((suma, valor, j) => suma + valor * pesos[j], 0)
  );

  // lambda_max = promedio de (Aw_i / w_i)
  const lambdas = Aw.map((valor, i) => valor / pesos[i]);
  const lambdaMax = lambdas.reduce((a, b) => a + b, 0) / n;

  const CI = (lambdaMax - n) / (n - 1 || 1);
  const RI = RANDOM_INDEX[n - 1] ?? 1.49;
  const CR = RI === 0 ? 0 : CI / RI;

  return {
    lambdaMax: Number(lambdaMax.toFixed(4)),
    CI: Number(CI.toFixed(4)),
    RI,
    CR: Number(CR.toFixed(4)),
    esConsistente: CR <= 0.1,
  };
}

/**
 * Punto de entrada del modulo: recibe la matriz de comparacion por pares
 * y los nombres de los criterios, y devuelve pesos + metricas de
 * consistencia.
 */
function ejecutarAHP(matriz, nombresCriterios) {
  if (nombresCriterios && nombresCriterios.length !== matriz.length) {
    throw new Error('El numero de nombres de criterios no coincide con el orden de la matriz');
  }

  const pesos = calcularPesos(matriz);
  const consistencia = calcularConsistencia(matriz, pesos);

  const resultado = pesos.map((peso, i) => ({
    criterio: nombresCriterios ? nombresCriterios[i] : `C${i + 1}`,
    peso: Number(peso.toFixed(4)),
  }));

  return { pesos: resultado, consistencia };
}

module.exports = { ejecutarAHP, calcularPesos, calcularConsistencia, validarMatriz, RANDOM_INDEX };
