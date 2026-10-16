**Estado:** Validación técnica ejecutada; revisión y aceptación humana pendientes
**Variante:** B - evitar zonas expuestas
**Spec:** `docs/practica-navegacion/spec.md`
**Plan:** `docs/practica-navegacion/plan.md`
**Repositorio:** `https://github.com/ValentinCantarrutti/GuardiadelSigilo`
**Último commit publicado de referencia:** `b34e385` - `Completa evidencia y casos limite de navegacion`
# Evidencia: práctica de navegación — 7 al 14/10/2026

## 1. Objetivo

Registrar la evidencia disponible para la práctica de navegación del laboratorio Guardia de Sigilo.

Este documento distingue entre:

- evidencia de implementación;
- resultados de pruebas;
- resultados de validación técnica;
- limitaciones conocidas;
- revisión y decisión humana.

La existencia de una prueba o de una referencia a un archivo no implica automáticamente que todos los criterios estén aprobados.

## 2. Archivos relevantes

| Archivo | Responsabilidad documentada |
|---|---|
| `src/domain/navigation/search.ts` | Implementación de la búsqueda y lógica de navegación. |
| `src/application/simulation/navigationDemo.ts` | Función de simulación que utiliza `calculateRoute` y permite configurar la variante B. |
| `src/game/scenes/GameScene.ts` | Integración de la navegación en la escena del juego. |
| `tests/navigation/search.test.ts` | Pruebas de búsqueda, costos y casos límite. |
| `tests/navigation/comparison.evidence.test.ts` | Prueba del escenario de comparación BFS/A*. |

Los archivos anteriores son las referencias de la práctica. Las afirmaciones de esta evidencia deben contrastarse con su contenido real si la implementación vuelve a cambiar.

## 3. Evidencia de comparación BFS/A*

### 3.1. Escenario

Se utiliza un mapa abierto de `5 × 3`.

- Inicio: `(0,1)`.
- Destino: `(4,1)`.
- Variante B: desactivada.
- Recorrido directo esperado: cuatro movimientos.

### 3.2. Resultados registrados

| Métrica | BFS | A* |
|---|---:|---:|
| Resultado | Ruta encontrada | Ruta encontrada |
| Pasos | 4 | 4 |
| Costo total | 4 | 4 |
| Nodos expandidos | 12 | 5 |
| Frontera máxima | 4 | 9 |

Estos resultados documentan una ejecución del escenario de referencia.

La comparación muestra que ambos algoritmos encuentran una ruta de cuatro pasos y costo cuatro. En esta ejecución, A* expande menos nodos, aunque alcanza una frontera máxima mayor. No se generaliza esta diferencia a todos los mapas.

### 3.3. Evidencia reproducible

La comparación está asociada a:

- `tests/navigation/comparison.evidence.test.ts`;
- la implementación de búsqueda en `src/domain/navigation/search.ts`;
- la función de simulación en `src/application/simulation/navigationDemo.ts`.

La prueba se ejecutó mediante `npm.cmd run validate`. Los resultados registrados corresponden a esa ejecución; la revisión final del diff y la decisión humana siguen pendientes.

## 4. Evidencia de la variante B

### 4.1. Configuración

- Costo normal: `1`.
- Costo de las celdas expuestas `(1,1)`, `(2,1)` y `(3,1)`: `5`.
- Costo de la celda inicial: `0`.
- La variante se puede activar o desactivar mediante el parámetro correspondiente.

### 4.2. Resultados esperados en el escenario de referencia

Con la variante desactivada:

- recorrido directo: cuatro pasos;
- costo total: `4`.

Con la variante activada:

- recorrido directo: cuatro pasos;
- costo total: `16`;
- alternativa: seis pasos;
- costo total de la alternativa: `6`.

La variante debe permitir elegir la ruta de menor costo, aunque implique más movimientos.

### 4.3. Alcance de la integración

La función `calculateRoute` de `src/application/simulation/navigationDemo.ts` permite configurar `profileB`.

Sin embargo, `src/game/scenes/GameScene.ts` llama a `calculateRoute` sin activar ese parámetro.

Por lo tanto, la evidencia de la variante B en la función de simulación no demuestra que la variante esté activa durante el juego. Esta limitación debe conservarse en la evaluación.

## 5. Evidencia de casos límite

Las pruebas de `tests/navigation/search.test.ts` contemplan los siguientes escenarios:

| Caso | Comportamiento esperado |
|---|---|
| Ruta válida | Devuelve una ruta cuando existe un recorrido. |
| Inicio igual al destino | Devuelve una ruta válida sin movimientos y con costo cero. |
| Destino inalcanzable | Informa que no existe una ruta válida. |
| Inicio inválido | Rechaza la posición inicial inválida. |
| Destino inválido | Rechaza la posición de destino inválida. |
| Optimalidad de A* | Comprueba el costo esperado en el escenario de prueba. |
| Variante B activada | Comprueba el comportamiento con costos diferenciados. |
| Variante B desactivada | Comprueba que se mantienen los costos normales. |
| Costo inicial | Comprueba que no se cobra la celda inicial. |
| BFS sin variante | Comprueba que BFS conserva su comportamiento esperado. |

La suite se ejecutó mediante `npm.cmd run validate`: 8 archivos y 58 pruebas aprobadas. La revisión final de los documentos y la decisión humana siguen pendientes.

## 6. Evidencia conceptual: DFS y Dijkstra

La documentación conceptual debe diferenciar estos algoritmos de la implementación principal verificada.

- **DFS:** explora una rama hasta donde puede y retrocede cuando es necesario. No garantiza la ruta de menor costo.
- **Dijkstra:** busca caminos de menor costo acumulado con costos no negativos.
- **BFS:** encuentra rutas con el menor número de movimientos cuando todos los movimientos tienen el mismo costo.
- **A*:** combina el costo acumulado con una heurística para orientar la exploración.

Estas explicaciones son evidencia documental. No constituyen por sí mismas evidencia de que DFS o Dijkstra estén implementados o ejecutándose en el juego.

## 7. Validación técnica

### 7.1. Validación final ejecutada

En la ejecución más reciente de `npm.cmd run validate`, la salida observada fue:

| Comprobación | Resultado |
|---|---|
| TypeScript (`tsc --noEmit`) | Correcto |
| Vitest | 8 archivos aprobados; 58 pruebas aprobadas |
| Vite build | Compilación de producción completada |
| JavaScript generado | `1,498.02 kB`; gzip `345.56 kB` |
| Advertencia de Vite | Paquete minificado superior a `500 kB`; no bloqueó el build |

El comando encadena typecheck, pruebas y build. Al terminar correctamente, las tres comprobaciones finalizaron sin errores bloqueantes.

### 7.2. Comparación registrada por la prueba

En el fixture común de `tests/navigation/comparison.evidence.test.ts`:

| Métrica | BFS | A* |
|---|---:|---:|
| Estado | success | success |
| Pasos | 4 | 4 |
| Costo | 4 | 4 |
| Nodos expandidos | 12 | 5 |
| Frontera máxima | 4 | 9 |

Estos resultados corresponden a ese escenario concreto; no demuestran que A* expanda siempre menos nodos en todos los mapas.

### 7.3. Alcance y revisión humana

Las pruebas de la variante B cubren costos ponderados, activación y desactivación del perfil, preservación del comportamiento de BFS y el consumidor `calculateRoute`. No constituyen una prueba de integración de la variante B dentro de la escena jugable. `GameScene.ts` no activa el perfil B por defecto.

La validación automatizada pasó. La revisión del diff y la decisión humana de aceptación deben registrarse por separado.