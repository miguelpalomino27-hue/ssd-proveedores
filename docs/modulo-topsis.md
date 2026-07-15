# Módulo TOPSIS

## Propósito
El módulo TOPSIS del backend calcula un ranking de proveedores a partir de una matriz de decisión y un conjunto de pesos de criterios obtenidos previamente mediante AHP. El objetivo es ordenar a las alternativas según su cercanía a una solución ideal positiva y su lejanía de una solución ideal negativa.

## Dónde se implementa
- Servicio matemático: [backend/src/services/topsis.js](../backend/src/services/topsis.js)
- Integración con la evaluación: [backend/src/controllers/evaluacionController.js](../backend/src/controllers/evaluacionController.js)
- Pruebas unitarias: [backend/tests/unit/topsis.test.js](../backend/tests/unit/topsis.test.js)

## Entrada esperada
La función `ejecutarTOPSIS(matrizDecision, pesos, tipos, nombresAlternativas)` recibe:

- `matrizDecision`: arreglo de arreglos numéricos, donde cada fila representa una alternativa (proveedor) y cada columna un criterio.
- `pesos`: arreglo con los pesos de cada criterio. En el flujo actual deben sumar aproximadamente 1.
- `tipos`: arreglo que indica si cada criterio es de tipo `beneficio` o `costo`.
- `nombresAlternativas`: opcional, utilizado para etiquetar cada alternativa en la salida.

### Ejemplo
```js
const matrizDecision = [
  [100, 8, 5],
  [120, 9, 3],
  [90, 7, 6],
];

const pesos = [0.5, 0.3, 0.2];
const tipos = ['costo', 'beneficio', 'beneficio'];
```

## Proceso interno
El algoritmo ejecuta los siguientes pasos:

1. Validación de entrada
   - Debe existir al menos una alternativa.
   - El número de tipos debe coincidir con el número de pesos.
   - Cada alternativa debe tener un valor para cada criterio.
   - Los pesos deben sumar 1, con una tolerancia de 0.02.

2. Normalización vectorial
   - Se normaliza cada criterio dividiendo cada valor por la raíz cuadrada de la suma de cuadrados de la columna.

3. Ponderación
   - Cada valor normalizado se multiplica por el peso del criterio correspondiente.

4. Soluciones ideales
   - Para criterios de tipo `beneficio`, la solución ideal positiva es el máximo valor ponderado y la negativa el mínimo.
   - Para criterios de tipo `costo`, la solución ideal positiva es el mínimo valor ponderado y la negativa el máximo.

5. Distancias euclidianas
   - Se calculan las distancias de cada alternativa a la solución ideal positiva y negativa.

6. Coeficiente de cercanía
   - Se obtiene el coeficiente de cercania relativa $CC^*$, definido como:

$$
CC^* = \frac{d^-}{d^+ + d^-}
$$

   - El valor resultante está entre 0 y 1.
   - Un valor más alto indica una mejor alternativa.

7. Ranking
   - Las alternativas se ordenan de mayor a menor coeficiente de cercanía y se asigna un ranking del 1 al N.

## Salida
Cada alternativa devuelve un objeto con:

- `alternativa`: nombre de la alternativa o `A1`, `A2`, etc.
- `distanciaPositiva`
- `distanciaNegativa`
- `coeficienteCercania`
- `ranking`

## Integración con el flujo de evaluación
El endpoint de evaluaciones llama primero al módulo AHP para obtener los pesos y luego al módulo TOPSIS para ordenar a los proveedores. El controlador prepara la matriz de decisión con los valores de los proveedores, ejecuta el algoritmo y devuelve el ranking junto con los pesos y la consistencia del AHP.

## Pruebas
El módulo cuenta con pruebas unitarias en [backend/tests/unit/topsis.test.js](../backend/tests/unit/topsis.test.js) que cubren:
- validación de pesos;
- validación de alternativas;
- prioridad de proveedores dominantes;
- tratamiento de criterios de costo;
- rango del coeficiente de cercanía;
- asignación de ranking único.
