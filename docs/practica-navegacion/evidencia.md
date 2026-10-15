# Evidencia — Práctica de navegación

## 1. Identificación

- Repositorio: `https://github.com/ValentinCantarrutti/GuardiadelSigilo`
- Variante elegida: B — evitar zonas expuestas.
- Rama de trabajo: `main`.
- Commit inicial: `65e3de52ca78213e00d3b42674fcfb799492e197`.
- Commit de implementación publicado: `b007fd86208c02bd964ca3441282fc9d229efaf2`.
- Commit final de entrega: registrar el hash que devuelva `git rev-parse HEAD` después de guardar y confirmar esta versión de la evidencia.

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

- `npm run typecheck`: completado correctamente, sin errores de TypeScript.
- `npm run test:run`: 7 archivos de prueba aprobados y 57 pruebas aprobadas.
- `npm run build`: compilación de producción completada correctamente.
- Vite mostró una advertencia por el tamaño de un archivo JavaScript generado, superior a 500 kB después de la minificación. La advertencia no impidió completar la compilación.

Esta validación se ejecutó después de incorporar la prueba del consumidor para el perfil B. Si se modifica algún archivo después de esa ejecución, se deberá volver a ejecutar la validación antes de cerrar la entrega.

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

La ruta directa de referencia tiene 4 pasos y costo 4 cuando el perfil B está desactivado. Con el perfil activado, la ruta directa atraviesa las tres celdas expuestas y tiene costo ponderado 16.

La ruta alternativa comprobada por la prueba automatizada del perfil B tiene 6 pasos y costo ponderado 6. No se consignan cantidades de nodos explorados ni tiempos de ejecución porque no se registró una salida verificable de esas métricas.

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

BFS mantiene su búsqueda por cantidad de pasos y no recibe el perfil B. La validación automatizada se ejecutó correctamente; la revisión final del diff debe confirmar que no haya cambios ajenos al alcance acordado.

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

## 7. Matriz de criterios y evidencia

| Criterio | Evidencia | Estado |
|---|---|---|
| BASE-01 — Estado inicial y auditoría | Hash inicial, rama y commits registrados | Parcial: no se conserva aquí una captura completa del estado inicial |
| BASE-02 — BFS/A* en fixture común | Pruebas automatizadas y contrato del fixture | Parcial: no se adjuntó una salida independiente con las rutas y métricas de ambos algoritmos |
| BASE-03 — Trazas conceptuales DFS/Dijkstra | Sección 6 | Documentado |
| BASE-04 — Casos normales y límite | Suite de pruebas de navegación | Parcial: verificar la cobertura específica exigida por la consigna |
| BASE-05 — Decisión humana y planificación | `spec.md` y `plan.md` | Documentado; conservar la aprobación humana si se exige como evidencia |
| BASE-06 — Una sola variante | Cambios del perfil B | Pendiente de revisión integral del diff |
| BASE-07 — Pruebas, regresión y validación | Última ejecución de `npm run validate` | Aprobada en la ejecución registrada |
| BASE-08 — Documentación y versión final | Tres documentos y commit de entrega | Completar el hash final después del último commit |
| B-AC1 — Ruta que evita exposición | Prueba automatizada del perfil B | Cubierto por la suite ejecutada |
| B-AC2 — Perfil desactivado | Prueba de A* sin ponderación | Cubierto por la suite ejecutada |
| B-AC3 — Integración y regresión | Prueba de `calculateRoute` y caso de inicio igual al objetivo | Cubierto por las pruebas ejecutadas; revisión final del diff pendiente |

## 8. Registro de trabajo y decisiones

1. Se seleccionó la variante B: evitar zonas expuestas.
2. Se ajustó A* para contemplar costos de entrada diferenciados, manteniendo gratuito el inicio.
3. Se expuso el perfil opcional desde el consumidor de simulación.
4. Se ampliaron las pruebas para cubrir el perfil B, el perfil desactivado y el caso de inicio igual al objetivo.
5. Se revisó la escena para retirar controles e indicadores temporales del perfil B y mantener la interfaz de juego original.
6. La última validación registrada terminó con 57 pruebas aprobadas, verificación de tipos correcta y compilación de producción exitosa.
7. Se prepararon la especificación, el plan y la evidencia.
8. El commit de implementación `b007fd86208c02bd964ca3441282fc9d229efaf2` fue publicado en la rama `main`.
9. La versión final de la evidencia debe quedar incluida en un commit y su hash debe registrarse después de crearlo.

## 9. Revisión final

Antes de cerrar la entrega, ejecutar en la terminal del proyecto:

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

Después de guardar este documento, registrar el hash del commit final. No afirmar que se ejecutaron comprobaciones nuevas hasta contar con su salida real.

## 10. Limitaciones y conclusión

La última validación registrada fue satisfactoria: 57 pruebas aprobadas, verificación de tipos correcta y compilación de producción completada, con una advertencia no bloqueante sobre el tamaño del bundle.

La variante B utiliza una máscara fija de celdas expuestas y costos estáticos. No modela detección dinámica ni modifica la percepción o la memoria del guardia.

Quedan como limitaciones de la evidencia la falta de una salida independiente con métricas de exploración de BFS/A*, la revisión integral final del diff y la confirmación específica de todos los casos límite requeridos por la consigna.

La decisión final sobre la versión que se entrega corresponde a la persona responsable del repositorio.