# Evidencia — Práctica de navegación

## 1. Identificación

- Repositorio: `https://github.com/ValentinCantarrutti/GuardiadelSigilo`
- Variante elegida: B — evitar zonas expuestas.
- Rama de trabajo: `main`.
- Commit inicial: `65e3de52ca78213e00d3b42674fcfb799492e197`.
- Commit de implementación publicado: `b007fd86208c02bd964ca3441282fc9d229efaf2`.
- Commit final de entrega: registrar el hash definitivo después de confirmar esta versión de la evidencia.

## 2. Archivos involucrados

Los cambios de implementación y pruebas corresponden a:

- `src/application/simulation/navigationDemo.ts`
- `src/domain/navigation/search.ts`
- `src/game/scenes/GameScene.ts`
- `tests/navigation/search.test.ts`

La documentación de esta práctica está en:

- `docs/practica-navegacion/spec.md`
- `docs/practica-navegacion/plan.md`
- `docs/practica-navegacion/evidencia.md`

También existen dos archivos locales sin seguimiento:

- `output.txt`
- `perfil_b_zonas_expuestas.patch`

No se agregan ni eliminan como parte de esta entrega sin revisar primero su contenido y decidir expresamente qué hacer con ellos.

## 3. Validación ejecutada

Se ejecutó `npm run validate`.

Resultado observado en la última ejecución registrada:

- Verificación de tipos mediante `tsc --noEmit`: completada correctamente.
- Vitest: 7 archivos de prueba aprobados y 57 pruebas aprobadas.
- Compilación de producción con Vite: completada correctamente.
- Vite mostró una advertencia por el tamaño de un archivo JavaScript generado, superior a 500 kB después de la minificación. La advertencia no impidió completar la compilación.

Posteriormente se ejecutó una prueba temporal independiente para registrar rutas y métricas de BFS y A*. Esa prueba terminó correctamente: 1 archivo y 1 prueba aprobados.

La prueba temporal se utiliza como evidencia de la comparación y no forma parte de la suite permanente. Después de registrar sus resultados, debe eliminarse el archivo `tests/navigation/comparison.evidence.test.ts`.

Si se modifica algún archivo de implementación después de la validación general, se deberá volver a ejecutar `npm run validate` antes de cerrar la entrega.

## 4. Contrato y fixture de comparación

Fixture de referencia:

- Cuadrícula: `5 × 3`.
- Inicio: `(0,1)`.
- Objetivo: `(4,1)`.
- Movimientos cardinales.
- Las celdas normales tienen costo de entrada 1.
- Las celdas expuestas tienen costo de entrada 5 con el perfil B.
- La celda inicial no suma costo.
- La ruta incluye el inicio y el objetivo.
- La cantidad de pasos corresponde a los movimientos entre celdas consecutivas.

La ruta directa tiene 4 pasos y costo 4 cuando el perfil B está desactivado. Con el perfil activado, atravesar las tres celdas expuestas produce un costo ponderado de 16.

La ruta alternativa del perfil B tiene 6 pasos y costo ponderado 6. Evita las celdas expuestas utilizando la fila `y=0`.

## 5. Evidencia de la variante B

### B-AC1 — Evitar zonas expuestas

La implementación utiliza una máscara fija de celdas expuestas:

- `(1,1)`
- `(2,1)`
- `(3,1)`

Con el perfil B activado, A* asigna costo de entrada 5 a esas celdas y costo 1 a las celdas normales. La celda inicial no suma costo.

La prueba automatizada comprueba que, en el mapa de referencia, A* elige una ruta de 6 pasos y costo ponderado 6, evitando las celdas expuestas, en lugar de la ruta directa de 4 pasos y costo ponderado 16.

### B-AC2 — Perfil desactivado

La prueba automatizada comprueba que A* sin el perfil B conserva la ruta directa de 4 pasos y costo 4. Las celdas expuestas siguen siendo transitables: el perfil cambia el costo de navegación, no convierte esas celdas en obstáculos.

### B-AC3 — Integración con el consumidor y caso inicial igual al objetivo

La prueba del consumidor comprueba que `calculateRoute` permite pasar el perfil B a A* y que la ruta resultante tiene costo ponderado 6. Con el perfil desactivado, la ruta directa conserva costo 4.

También se cubre el caso en el que el inicio y el objetivo coinciden: A* devuelve una ruta de cero pasos y costo ponderado cero.

BFS mantiene su búsqueda por cantidad de pasos y no recibe el perfil B. La comparación independiente registrada a continuación permite contrastar sus resultados con los de A* en un fixture común.

## 6. Comparación reproducible de BFS y A*

### 6.1 Configuración

- Cuadrícula abierta: `5 × 3`.
- Inicio: `(0,1)`.
- Objetivo: `(4,1)`.
- Algoritmos ejecutados: BFS, A* normal y A* con perfil B.
- Origen de los datos: salida real de Vitest de la prueba temporal `tests/navigation/comparison.evidence.test.ts`.
- Resultado de la prueba temporal: 1 archivo aprobado y 1 prueba aprobada.

### 6.2 Resultados observados

| Métrica | BFS | A* normal | A* perfil B |
|---|---:|---:|---:|
| Estado | `success` | `success` | `success` |
| Pasos | 4 | 4 | 6 |
| Costo total | 4 | 4 | 6 |
| Costo ponderado informado | No informado | 4 | 6 |
| Nodos expandidos | 12 | 5 | 7 |
| Frontera máxima | 4 | 9 | 5 |

### 6.3 Rutas obtenidas

**BFS:**

`(0,1) → (1,1) → (2,1) → (3,1) → (4,1)`

**A* normal:**

`(0,1) → (1,1) → (2,1) → (3,1) → (4,1)`

**A* con perfil B:**

`(0,1) → (0,0) → (1,0) → (2,0) → (3,0) → (4,0) → (4,1)`

### 6.4 Interpretación

BFS y A* normal encontraron la ruta directa de cuatro pasos. En este escenario, A* normal expandió 5 nodos, frente a los 12 de BFS.

Con el perfil B, A* seleccionó una ruta de seis pasos y costo ponderado 6, evitando las celdas expuestas. La ruta directa tiene costo ponderado 16 con ese perfil.

Los resultados ilustran dos objetivos distintos: BFS encuentra una ruta según la cantidad de pasos, mientras que A* puede considerar el costo acumulado y seleccionar una alternativa menos costosa aunque sea más larga.

Estas métricas corresponden exclusivamente al fixture descrito. No constituyen una medición general del rendimiento de los algoritmos en todos los mapas del juego.

## 7. Comparación conceptual de algoritmos

### DFS

Grafo de referencia:

- `S: [A, B]`
- `A: [C]`
- `C: [X]`
- `X: [G]`
- `B: [D, E]`
- `D: [G]`
- `E: []`
- `G: []`

Con costos unitarios y una pila que inserta los vecinos en orden inverso para explorar primero el primer vecino listado, DFS visita la rama `S → A → C → X → G`, de 4 pasos. BFS puede encontrar `S → B → D → G`, de 3 pasos.

Conclusión: DFS encuentra un camino, pero no garantiza que tenga la menor cantidad de pasos.

### Dijkstra

Aristas de referencia:

- `S → A = 1`
- `A → G = 9`
- `S → B = 3`
- `B → G = 3`

La ruta `S → A → G` tiene costo 10. La alternativa `S → B → G` tiene costo 6, por lo que es la ruta de menor costo acumulado.

Conclusión: con costos variables, la cantidad de pasos no basta para comparar rutas. Dijkstra optimiza el costo acumulado. En esta práctica se documenta conceptualmente, sin incorporarlo como una implementación nueva.

## 8. Matriz de criterios y evidencia

| Criterio | Evidencia | Estado |
|---|---|---|
| BASE-01 — Estado inicial y auditoría | Hash inicial, rama y commits registrados | Parcial: no se conserva aquí una captura completa del estado inicial |
| BASE-02 — BFS/A* en fixture común | Prueba temporal ejecutada y métricas registradas en la sección 6 | Documentado con resultados observados |
| BASE-03 — Trazas conceptuales DFS/Dijkstra | Sección 7 | Documentado |
| BASE-04 — Casos normales y límite | Suite de pruebas de navegación | Suite aprobada; confirmar la cobertura específica exigida por la consigna |
| BASE-05 — Decisión humana y planificación | `spec.md` y `plan.md` | Documentado; conservar la aprobación humana si se exige como evidencia |
| BASE-06 — Una sola variante | Cambios del perfil B | Pendiente de revisión integral del diff |
| BASE-07 — Pruebas, regresión y validación | Última ejecución de `npm run validate` | Aprobada en la ejecución registrada |
| BASE-08 — Documentación y versión final | Tres documentos y commit de entrega | Completar el hash después del commit definitivo |
| B-AC1 — Ruta que evita exposición | Prueba automatizada del perfil B | Cubierto por la suite ejecutada |
| B-AC2 — Perfil desactivado | Prueba de A* sin ponderación | Cubierto por la suite ejecutada |
| B-AC3 — Integración y regresión | Prueba de `calculateRoute` y caso de inicio igual al objetivo | Cubierto por las pruebas ejecutadas; revisión final del diff pendiente |

## 9. Registro de trabajo y decisiones

1. Se seleccionó la variante B: evitar zonas expuestas.
2. Se ajustó A* para contemplar costos de entrada diferenciados, manteniendo gratuito el inicio.
3. Se expuso el perfil opcional desde el consumidor de simulación.
4. Se ampliaron las pruebas para cubrir el perfil B, el perfil desactivado y el caso de inicio igual al objetivo.
5. Se revisó la escena para retirar controles e indicadores temporales del perfil B y mantener la interfaz de juego original.
6. La última validación general registrada terminó con 57 pruebas aprobadas, verificación de tipos correcta y compilación de producción exitosa.
7. Se prepararon la especificación, el plan y la evidencia.
8. El commit de implementación `b007fd86208c02bd964ca3441282fc9d229efaf2` fue publicado en la rama `main`.
9. Se ejecutó una prueba temporal de comparación de algoritmos y se registraron sus rutas y métricas en la sección 6.
10. La prueba temporal debe eliminarse antes de la entrega definitiva.
11. La evidencia final debe quedar incluida en un commit publicado y su hash debe registrarse después de crearlo.

## 10. Revisión final

Antes de cerrar la entrega, ejecutar en la terminal del proyecto, una línea por vez:

```bat
git branch --show-current
git rev-parse HEAD
git status --short
git diff --check
git diff --stat
npm run validate
```

Revisar que:

- BFS conserve su comportamiento.
- El perfil B modifique únicamente el costo de navegación previsto.
- La celda inicial siga teniendo costo cero.
- La heurística de A* siga siendo admisible con el costo mínimo de entrada.
- No se alteren percepción, memoria ni máquina de estados.
- La escena no incluya controles de prueba no solicitados.
- Los archivos locales sin seguimiento no se agreguen ni eliminen sin una decisión expresa.
- Los tres documentos reflejen el estado real de la entrega.
- Los casos normales y límite exigidos estén cubiertos y documentados.
- La prueba temporal de comparación se haya eliminado.
- El diff final no contenga modificaciones ajenas al alcance acordado.

Después de guardar este documento y realizar la revisión, registrar el hash del commit definitivo. No afirmar que se ejecutaron comprobaciones nuevas hasta contar con su salida real.

## 11. Criterios comunes de aceptación

### BASE-01 — Estado inicial y auditoría

Se registran el repositorio, la rama y los hashes de referencia. La evidencia disponible no incluye una captura completa del estado inicial; este punto queda parcialmente documentado.

### BASE-02 — Comparación reproducible de BFS y A*

La comparación utiliza un mapa común, el mismo inicio y el mismo objetivo. La salida observada registra rutas, pasos, costos, nodos expandidos y frontera máxima. Los resultados se limitan al fixture de la sección 6.

### BASE-03 — Comparación conceptual

Las secciones 7 documentan ejemplos de DFS y Dijkstra y explican la diferencia entre encontrar un camino, minimizar pasos y minimizar costo.

### BASE-04 — Casos normales y límite

La suite general registró 57 pruebas aprobadas. La cobertura específica debe contrastarse con todos los casos requeridos en la consigna antes de declarar este criterio completamente cerrado.

### BASE-05 — Decisión humana y planificación

La especificación y el plan documentan el alcance de la variante B. La decisión de entrega permanece a cargo de la persona responsable del repositorio.

### BASE-06 — Alcance del cambio

La revisión final del diff debe comprobar que los cambios se limitan a la navegación acordada, sus pruebas y la documentación, sin alterar percepción, memoria ni máquina de estados.

### BASE-07 — Validación y regresión

La última ejecución general registrada de `npm run validate` fue satisfactoria. Si se cambia código de implementación después de esa ejecución, se requiere una nueva validación.

### BASE-08 — Documentación y versión final

La especificación, el plan y la evidencia deben quedar versionados en la rama `main`. El hash definitivo se completa después del último commit y de su publicación.

## 12. Limitaciones y conclusión

La última validación general registrada fue satisfactoria: 57 pruebas aprobadas, verificación de tipos correcta y compilación de producción completada, con una advertencia no bloqueante sobre el tamaño del bundle.

La comparación temporal adicional registró resultados concretos para BFS, A* normal y A* con perfil B en un mapa abierto de `5 × 3`. Los resultados muestran que A* normal encontró la ruta directa con menos nodos expandidos que BFS, mientras que el perfil B eligió una ruta más larga para evitar las celdas expuestas y reducir el costo ponderado.

La variante B utiliza una máscara fija de celdas expuestas y costos estáticos. No modela detección dinámica ni modifica la percepción o la memoria del guardia.

Quedan como limitaciones de la evidencia la ausencia de una captura completa del estado inicial, la comprobación final de todos los casos límite exigidos y la revisión integral del diff. Estos puntos no deben declararse completados sin la evidencia correspondiente.

La decisión final sobre la versión que se entrega corresponde a la persona responsable del repositorio.