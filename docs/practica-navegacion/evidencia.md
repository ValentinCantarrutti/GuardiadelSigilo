# Evidencia — Práctica de navegación

## 1. Identificación

- Repositorio: `https://github.com/ValentinCantarrutti/GuardiadelSigilo`
- Variante elegida: B — evitar zonas expuestas.
- Commit inicial: `65e3de52ca78213e00d3b42674fcfb799492e197`.
- Commit final: pendiente; debe registrarse después de la revisión y del commit humano.
- Rama de trabajo: `main`.

## 2. Estado previo y cambios locales

Durante el trabajo se identificaron modificaciones en:

- `src/application/simulation/navigationDemo.ts`
- `src/domain/navigation/search.ts`
- `src/game/scenes/GameScene.ts`
- `tests/navigation/search.test.ts`

También aparecieron dos archivos sin seguimiento:

- `output.txt`
- `perfil_b_zonas_expuestas.patch`

Estos archivos no deben eliminarse ni agregarse al commit sin revisar su contenido y decidir expresamente qué hacer con ellos.

La carpeta `docs/practica-navegacion/` contiene los documentos de esta práctica. Su estado previo debe contrastarse con el historial y el estado inicial del repositorio si se necesita demostrar cuándo fue creada.

## 3. Validación ejecutada

Se ejecutó:

```bat
npm run validate
```

Resultado observado en la última ejecución:

- `npm run typecheck`: completado correctamente, sin errores de TypeScript.
- `npm run test:run`: 7 archivos de prueba aprobados y 57 pruebas aprobadas.
- `npm run build`: compilación de producción completada correctamente.
- Vite mostró una advertencia de tamaño: el archivo JavaScript generado supera los 500 kB después de la minificación. La advertencia no impidió la compilación.

Esta validación se ejecutó después de incorporar la prueba del consumidor para el perfil B. La revisión final del diff y de los documentos todavía está pendiente. Se deberá repetir la validación antes de cerrar la entrega si se realizan nuevos cambios.

## 4. Contrato y fixture de comparación

Fixture de referencia:

- Cuadrícula: `5 × 3`.
- Inicio: `(0,1)`.
- Objetivo: `(4,1)`.
- Celdas libres con costo unitario.
- Movimientos cardinales.
- El camino incluye el inicio y el objetivo.
- La cantidad de pasos se calcula como el número de movimientos entre celdas consecutivas.
- El costo acumulado no incluye el costo de la celda inicial.

La ruta directa esperada tiene 4 pasos y costo unitario 4. Las rutas concretas y las métricas de exploración de BFS y A* deben anotarse a partir de una ejecución verificable; no se registran aquí como si se hubiera capturado una salida independiente.

## 5. Evidencia de la variante B

### B-AC1 — Evitar zonas expuestas

La prueba automatizada comprueba que, en el mapa abierto, A* con el perfil B prefiere una ruta de 6 pasos y costo ponderado 6, evitando las celdas expuestas, frente a la ruta directa de 4 pasos y costo ponderado 16.

La máscara de exposición es fija: `(1,1)`, `(2,1)` y `(3,1)`. Entrar en una celda expuesta tiene costo 5; entrar en una celda normal tiene costo 1. La celda inicial no suma costo.

### B-AC2 — Perfil desactivado

La prueba automatizada comprueba que A* sin el perfil conserva la ruta directa de 4 pasos y costo 4. Las celdas expuestas no se convierten en obstáculos.

### B-AC3 — Integración con el consumidor y caso inicial igual al objetivo

La prueba automatizada del consumidor comprueba que el perfil B puede pasarse a través de `calculateRoute` y que produce una ruta de costo ponderado 6, mientras que el perfil desactivado conserva la ruta directa de costo 4.

Las pruebas también cubren el caso de inicio igual al objetivo: la ruta tiene cero pasos y costo ponderado cero cuando se utiliza A* con el perfil.

BFS mantiene su comportamiento de búsqueda por pasos y no recibe el perfil B. La revisión final del diff debe confirmar que la integración no introduce cambios fuera del alcance previsto.

## 6. Comparación conceptual de algoritmos

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

Con costos unitarios y una pila que inserta los vecinos en orden inverso para explorar primero el primer vecino listado, DFS visita la rama `S → A → C → X → G`, que requiere 4 pasos. BFS puede encontrar `S → B → D → G`, que requiere 3 pasos.

Conclusión: DFS encuentra un camino, pero no garantiza que sea el de menor cantidad de pasos.

### Dijkstra

Aristas de referencia:

- `S → A = 1`
- `A → G = 9`
- `S → B = 3`
- `B → G = 3`

La primera ruta encontrada hacia G a través de A tiene costo 10. Al explorar la alternativa a través de B, el mejor costo conocido para G se actualiza de 10 a 6. La ruta final es `S → B → G`, con costo 6.

Conclusión: la cantidad de acciones no basta para comparar rutas con costos variables. Dijkstra optimiza el costo acumulado y se documenta conceptualmente, sin incorporarlo como una implementación nueva.

## 7. Matriz de criterios y evidencia

| Criterio | Evidencia prevista | Estado |
|---|---|---|
| BASE-01 — Estado inicial y auditoría | `git status`, rama y hash inicial | Hash inicial y rama registrados; completar la evidencia del estado inicial |
| BASE-02 — BFS/A* en fixture común | Pruebas y salida de ejecución reproducible | Parcial; falta registrar una salida independiente |
| BASE-03 — Trazas conceptuales DFS/Dijkstra | Sección 6 de este documento | Documentado; revisar contra la especificación |
| BASE-04 — Casos normales y límite | Pruebas existentes y ejecución final | Pendiente de revisión específica |
| BASE-05 — Decisión humana y planificación | `spec.md` y `plan.md` | Documentado; aprobación humana pendiente |
| BASE-06 — Una sola variante | Cambios del perfil B | Pendiente de revisión final del diff |
| BASE-07 — Pruebas, regresión y validación | `npm run validate` y revisión del diff | Validación aprobada; falta repetición final si se realizan cambios |
| BASE-08 — Documentación y versión final | Tres documentos y commit final | Pendiente |
| B-AC1 — Ruta que evita exposición | Prueba del perfil B | Cubierto por la suite ejecutada |
| B-AC2 — Perfil desactivado | Prueba de A* unitario | Cubierto por la suite ejecutada |
| B-AC3 — Integración y regresión | Prueba del consumidor y revisión del alcance | Prueba ejecutada; revisión final del diff pendiente |

## 8. Registro de trabajo y decisiones

1. Se seleccionó la variante B: evitar zonas expuestas.
2. Se ajustó la búsqueda A* para usar costos de entrada diferenciados, manteniendo gratuito el inicio.
3. Se expuso el perfil opcional desde el consumidor de simulación.
4. Se ampliaron las pruebas de navegación para cubrir el perfil B y los casos asociados.
5. Se revisó la escena para retirar los controles e indicadores temporales del perfil B y mantener la interfaz de juego original.
6. La última validación ejecutada terminó con 57 pruebas aprobadas y compilación correcta.
7. Se prepararon los documentos de especificación, plan y evidencia.
8. Queda pendiente la revisión integral de los cambios, la confirmación de los criterios y la decisión humana sobre el commit.

## 9. Revisión final pendiente

Ejecutar y registrar la salida real de:

```bat
git branch --show-current
git rev-parse HEAD
git status --short
git diff --check
git diff --stat
npm run validate
```

Revisar el diff para confirmar que:

- BFS conserva su comportamiento.
- El perfil B solo modifica el costo de navegación previsto.
- El costo de la celda inicial sigue siendo cero.
- La heurística de A* sigue siendo compatible con el costo mínimo de entrada.
- No se alteran percepción, memoria ni máquina de estados.
- La escena no incluye controles de prueba no solicitados.
- No se eliminan ni incluyen archivos locales sin decisión expresa.
- Los tres documentos reflejan el estado final real.
- Los casos normales y límite exigidos por la práctica están cubiertos y documentados.

Después de esa revisión, la persona responsable decidirá qué archivos incluir en el commit. Registrar el hash final únicamente después de crearlo. No publicar ni hacer `push` sin la decisión correspondiente.

## 10. Limitaciones y conclusión

La última validación observada fue satisfactoria: 57 pruebas aprobadas, verificación de tipos correcta y compilación de producción completada, con una advertencia no bloqueante de tamaño del bundle.

La variante B utiliza una máscara fija de celdas expuestas y costos estáticos. No modela detección dinámica ni modifica la percepción o la memoria del guardia.

Antes de entregar, es necesario revisar el diff completo, confirmar los casos límite, registrar la evidencia reproducible pendiente y completar los datos de la versión final. La aprobación y publicación definitivas corresponden a la persona responsable del repositorio.