**Estado:** Pendiente de revisión y aceptación humana
**Variante:** B - evitar zonas expuestas
**Plan:** `docs/practica-navegacion/plan.md`
**Evidencia:** `docs/practica-navegacion/evidencia.md`
**Repositorio:** `https://github.com/ValentinCantarrutti/GuardiadelSigilo`
**Último commit publicado de referencia:** `b34e385` - `Completa evidencia y casos limite de navegacion`
**Commit inicial:** `65e3de52ca78213e00d3b42674fcfb799492e197`
**Rutas relevantes:** `src/domain/navigation/search.ts`, `src/application/simulation/navigationDemo.ts` y `tests/navigation/`.
**Validación:** `npm.cmd run validate`.
# Spec: práctica de navegación — 7 al 14/10/2026

## Estado del documento

Especificación de la práctica de navegación del laboratorio Guardia de Sigilo. Este documento describe el comportamiento esperado, los criterios de aceptación y las limitaciones conocidas.

La implementación y la documentación deben evaluarse por separado: que un criterio esté especificado o documentado no implica, por sí solo, que esté aprobado.

## 1. Objetivo

Documentar y verificar la navegación del laboratorio mediante BFS y A*, contemplar casos límite y comparar ambos algoritmos con una variante opcional de costos para determinadas celdas.

La práctica debe mantener una relación trazable entre:

- requisito;
- especificación;
- implementación;
- prueba o evidencia;
- resultado de validación;
- revisión y decisión humana.

## 2. Alcance

Esta práctica comprende:

- inspección de la implementación existente;
- comparación de BFS y A*;
- verificación de rutas y costos;
- pruebas de casos límite;
- incorporación y comprobación de una variante opcional de costos;
- documentación de algoritmos conceptuales complementarios;
- registro de validación y limitaciones.

## 3. Fuera de alcance

No se considera parte de esta práctica:

- rediseñar el juego completo;
- modificar la arquitectura general sin necesidad demostrada;
- incorporar dependencias sin autorización;
- cambiar la mecánica de sigilo;
- publicar cambios adicionales sin revisión;
- afirmar que una característica funciona en el juego si solo fue comprobada mediante una función o prueba aislada.

## 4. Variante B: costos de entrada

La variante B permite asignar un costo mayor a determinadas celdas transitables.

Configuración de referencia:

- costo normal: `1`;
- costo de las celdas expuestas `(1,1)`, `(2,1)` y `(3,1)`: `5`;
- la celda inicial no se cobra como costo de entrada;
- la variante debe poder activarse o desactivarse explícitamente.

El objetivo es comprobar que la búsqueda puede preferir un recorrido más largo cuando su costo total resulta menor.

La variante debe conservar el comportamiento normal cuando está desactivada.

## 5. Contrato de navegación

La búsqueda recibe un mapa, un punto inicial y un destino, y debe devolver un resultado que permita determinar si existe una ruta.

Cuando existe una ruta, el resultado debe permitir verificar:

- el punto inicial y el destino;
- la secuencia de celdas;
- la cantidad de pasos;
- el costo total;
- los datos de exploración disponibles, como nodos expandidos y tamaño máximo de la frontera.

Cuando no existe una ruta, el resultado debe indicar el fallo sin presentar una ruta válida ficticia.

La celda inicial no se incluye en la suma de costos de entrada. Los costos se acumulan al ingresar a las celdas posteriores.

## 6. Escenario común de comparación

Se utiliza un mapa abierto de `5 × 3`, con:

- inicio: `(0,1)`;
- destino: `(4,1)`;
- recorrido directo esperado: cuatro movimientos.

### 6.1. Comparación con costos normales

Con la variante B desactivada, el recorrido directo tiene:

- pasos: `4`;
- costo total: `4`.

En la ejecución registrada, BFS y A* encuentran una ruta de cuatro pasos y costo cuatro.

Datos registrados:

| Métrica | BFS | A* |
|---|---:|---:|
| Resultado | Ruta encontrada | Ruta encontrada |
| Pasos | 4 | 4 |
| Costo | 4 | 4 |
| Nodos expandidos | 12 | 5 |
| Frontera máxima | 4 | 9 |

Estos datos corresponden al escenario y a la ejecución documentados; no constituyen una afirmación de que A* siempre expanda menos nodos en cualquier mapa.

### 6.2. Comparación con la variante B

Con la variante B activada, las celdas expuestas tienen costo `5` y el resto de las celdas transitables tiene costo `1`.

En el escenario de referencia:

- el recorrido directo tiene cuatro movimientos y costo `16`;
- una alternativa de seis movimientos evita las celdas expuestas y tiene costo `6`.

El resultado esperado es que una búsqueda que optimiza el costo seleccione la alternativa de menor costo, aunque tenga más pasos.

Esta comparación debe comprobarse con una prueba reproducible. La existencia de esta variante en una función de simulación no significa que esté activada en la escena jugable.

## 7. Casos comunes y límites

### BASE-04: casos de navegación

Se deben contemplar los siguientes escenarios:

1. **Ruta válida:** existe una ruta entre inicio y destino.
2. **Inicio igual al destino:** la búsqueda devuelve una ruta válida sin movimientos y con costo cero.
3. **Destino inalcanzable:** un bloqueo impide llegar al destino y la búsqueda informa que no hay ruta.
4. **Inicio inválido:** la búsqueda rechaza una posición inicial inválida.
5. **Destino inválido:** la búsqueda rechaza una posición de destino inválida.

Los casos de inicio y destino inválidos deben tratarse de manera controlada, sin producir una ruta válida ficticia.

## 8. Requisitos de la variante B

### B-01 — Costos configurables

Las celdas expuestas deben tener costo de entrada `5`; las celdas normales deben conservar costo `1`.

### B-02 — Activación opcional

La variante B debe poder activarse y desactivarse explícitamente.

### B-03 — Comparación de rutas

Con la variante activada, la búsqueda debe poder preferir una ruta de mayor longitud y menor costo total cuando el escenario lo justifique.

### B-AC1 — Cálculo de costos

La suma de costos debe coincidir con las celdas ingresadas durante el recorrido, sin cobrar la celda inicial.

### B-AC2 — Variante desactivada

Al desactivar la variante, la navegación debe conservar los costos normales y el comportamiento de referencia.

### B-AC3 — Evitación de celdas expuestas

En el escenario de comparación especificado, con la variante activada, la ruta elegida debe evitar el recorrido directo más caro y obtener el costo esperado de `6`.

El caso de inicio igual al destino pertenece a los criterios comunes de navegación y no constituye un criterio B adicional.

## 9. Algoritmos conceptuales complementarios

La documentación debe incluir una explicación conceptual de DFS y Dijkstra, diferenciándolos de los algoritmos que se verifican directamente en la comparación principal.

- **DFS:** explora una rama antes de retroceder. No garantiza encontrar la ruta más corta en cantidad de pasos ni la de menor costo.
- **Dijkstra:** prioriza los caminos de menor costo acumulado y es apropiado cuando los costos de las aristas son no negativos.
- **BFS:** explora por niveles y encuentra una ruta con el menor número de movimientos cuando todos los movimientos tienen el mismo costo.
- **A*:** utiliza el costo acumulado y una heurística para orientar la búsqueda. La optimalidad depende de las condiciones de la implementación y de la heurística.

Los ejemplos conceptuales no deben presentarse como funcionalidades implementadas si no hay evidencia de código y pruebas que las respalden.

## 10. Requisitos comunes

### BASE-01 — Exploración de la implementación

Identificar los archivos responsables de la búsqueda, su integración con la simulación y las pruebas existentes antes de proponer cambios.

### BASE-02 — Comparación BFS/A*

Comparar los resultados de BFS y A* en un escenario reproducible, registrando la ruta, los pasos, el costo y las métricas de exploración disponibles.

### BASE-03 — Algoritmos conceptuales

Documentar DFS y Dijkstra y explicar sus diferencias con BFS y A* sin atribuir a la implementación capacidades no verificadas.

### BASE-04 — Casos comunes y límites

Verificar ruta válida, inicio igual al destino, destino inalcanzable e inicio o destino inválidos.

### BASE-05 — Decisión humana

Registrar las limitaciones detectadas y dejar explícita la decisión humana sobre la aceptación de la entrega. La documentación automática no reemplaza esa revisión.

### BASE-06 — Trazabilidad

Relacionar requisitos, criterios de aceptación, archivos, pruebas y evidencias.

### BASE-07 — Validación reproducible

Registrar los comandos ejecutados, sus resultados y las advertencias relevantes. Las validaciones deben repetirse después de los cambios que puedan afectarlas.

### BASE-08 — Integridad del alcance

No afirmar que se verificó una característica de juego si solo se comprobó una función aislada. No ocultar limitaciones ni presentar una validación anterior como si fuera la validación final.

## 11. Criterios de aceptación comunes

### BASE-AC1 — Exploración documentada

La documentación identifica los archivos relevantes y describe el comportamiento observado sin inventar componentes.

### BASE-AC2 — Comparación reproducible

La comparación BFS/A* presenta un escenario común, resultados medibles y una explicación de sus diferencias.

### BASE-AC3 — Casos límite

Los casos de ruta válida, inicio igual al destino, destino inalcanzable y posiciones inválidas están cubiertos por pruebas o evidencia identificable.

### BASE-AC4 — Explicación conceptual

DFS y Dijkstra están explicados correctamente y diferenciados de la implementación verificada.

### BASE-AC5 — Validación técnica

Se registran los resultados de los comandos de validación ejecutados sobre la versión evaluada.

### BASE-AC6 — Revisión humana y limitaciones

Se documentan las limitaciones conocidas y se identifica la decisión humana pendiente o realizada. No se presenta la entrega como aprobada si esa decisión no está registrada.

## 12. Validación técnica

Se ejecutó `npm.cmd run validate`. La salida registró:

- `tsc --noEmit`: correcto.
- Vitest: 8 archivos de prueba aprobados y 58 pruebas aprobadas.
- Vite: build de producción completado.
- Advertencia no bloqueante: el paquete JavaScript minificado fue de `1,498.02 kB` (gzip `345.56 kB`), por encima del umbral de `500 kB`.

La prueba de comparación en el fixture común registró para BFS 4 pasos, costo 4, 12 nodos expandidos y frontera máxima 4; para A*, 4 pasos, costo 4, 5 nodos expandidos y frontera máxima 9. Las métricas dependen del escenario evaluado.
## 13. Limitaciones conocidas

- La variante B está disponible a través de la función de simulación `calculateRoute` con el parámetro correspondiente.
- `GameScene.ts` llama a `calculateRoute` sin activar ese parámetro; por tanto, no debe afirmarse que la variante B esté activa durante el juego.
- Los resultados de la comparación corresponden al mapa de referencia y no permiten generalizar el rendimiento a todos los escenarios.
- Las métricas de nodos expandidos y frontera máxima dependen del escenario y de la implementación.
- La advertencia de tamaño de Vite debe quedar documentada aunque la compilación termine correctamente.

## 14. Revisión y aceptación

La validación automatizada de la versión revisada finalizó correctamente. Antes de declarar aceptada la entrega, corresponde:

1. revisar el diff completo de los cambios documentales;
2. comprobar la coherencia entre requisitos, pruebas y evidencias;
3. confirmar las limitaciones de integración de la variante B;
4. registrar la decisión humana final.

**Estado:** validación automatizada completada; revisión final del diff y decisión humana pendientes. No se declara una aprobación humana que todavía no fue expresada.