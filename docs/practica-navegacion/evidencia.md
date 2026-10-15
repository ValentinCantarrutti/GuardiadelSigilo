# Evidencia — Práctica de navegación

## 1. Identificación

- Repositorio: https://github.com/ValentinCantarrutti/GuardiadelSigilo
- Variante elegida: B — evitar zonas expuestas.
- Rama de trabajo: `main`.
- Commit inicial: `65e3de52ca78213e00d3b42674fcfb799492e197`.
- Commit de implementación publicado: `b007fd86208c02bd964ca3441282fc9d229efaf2`.
- Último commit publicado antes de esta actualización: `5a76c7fcbe6a51ffe13f6dcacd7468b502773058`.
- Enlace al último commit publicado: https://github.com/ValentinCantarrutti/GuardiadelSigilo/commit/5a76c7fcbe6a51ffe13f6dcacd7468b502773058.
- El hash definitivo de esta versión se registrará después de revisar y publicar los cambios.

## 2. Archivos involucrados

Los cambios de implementación y pruebas corresponden a:

- `src/application/simulation/navigationDemo.ts`
- `src/domain/navigation/search.ts`
- `src/game/scenes/GameScene.ts`
- `tests/navigation/search.test.ts`

La documentación de la práctica está en:

- `docs/practica-navegacion/spec.md`
- `docs/practica-navegacion/plan.md`
- `docs/practica-navegacion/evidencia.md`

Existen además dos archivos locales sin seguimiento:

- `output.txt`
- `perfil_b_zonas_expuestas.patch`

`output.txt` está vacío. El archivo `.patch` contiene diferencias de código. Ninguno forma parte de los archivos preparados para esta entrega.

## 3. Validación ejecutada

Se ejecutó `npm run validate`.

Resultado observado en la última ejecución:

- Verificación de tipos con `tsc --noEmit`: completada correctamente.
- Vitest: 7 archivos de prueba aprobados y 57 pruebas aprobadas.
- Compilación de producción con Vite: completada correctamente.
- Vite mostró una advertencia porque un archivo JavaScript generado supera los 500 kB después de la minificación. La advertencia no impidió completar la compilación.

También se ejecutó una prueba temporal independiente para registrar rutas y métricas de BFS y A*. El resultado observado fue 1 archivo y 1 prueba aprobados. Esa prueba temporal no forma parte de la suite permanente.

La validación anterior corresponde al estado del proyecto en el momento de su ejecución. Si se modifica algún archivo de implementación o pruebas, se debe volver a ejecutar `npm run validate` antes de cerrar la entrega.

## 4. Contrato y fixture de comparación

Fixture de referencia:

- Cuadrícula: `5 × 3`.
- Inicio: `(0,1)`.
- Objetivo: `(4,1)`.
- Movimientos cardinales.
- Costo de entrada de las celdas normales: 1.
- Costo de entrada de las celdas expuestas con el perfil B: 5.
- La celda inicial no suma costo.
- La ruta incluye el inicio y el objetivo.
- La cantidad de pasos corresponde a los movimientos entre celdas consecutivas.

La ruta directa tiene 4 pasos. Con el perfil B desactivado, su costo es 4. Con el perfil activado, atravesar las tres celdas expuestas produce un costo ponderado de 16.

La ruta alternativa del perfil B tiene 6 pasos y costo ponderado 6. Evita las celdas expuestas utilizando la fila `y=0`.

## 5. Evidencia de la variante B

### B-AC1 — Evitar zonas expuestas

La implementación utiliza una máscara fija de celdas expuestas:

- `(1,1)`
- `(2,1)`
- `(3,1)`

Con el perfil B activado, A* asigna costo de entrada 5 a esas celdas y costo 1 a las celdas normales. La celda inicial no suma costo.

La prueba automatizada comprueba que A* elige una ruta de 6 pasos y costo ponderado 6, evitando las celdas expuestas, en lugar de la ruta directa de 4 pasos y costo ponderado 16.

### B-AC2 — Perfil desactivado

La prueba automatizada comprueba que A* sin el perfil B conserva la ruta directa de 4 pasos y costo 4. Las celdas expuestas siguen siendo transitables: el perfil cambia el costo de navegación, no convierte esas celdas en obstáculos.

### B-AC3 — Integración con el consumidor y caso inicial igual al objetivo

La prueba del consumidor comprueba que `calculateRoute` permite pasar el perfil B a A* y que la ruta resultante tiene costo ponderado 6. Con el perfil desactivado, la ruta directa conserva costo 4.

También se cubre el caso en el que el inicio y el objetivo coinciden: A* devuelve una ruta de una sola celda, cero pasos y costo ponderado cero.

BFS mantiene su búsqueda por cantidad de pasos y no recibe el perfil B.

## 6. Comparación de BFS y A*

### 6.1 Configuración

- Cuadrícula abierta: `5 × 3`.
- Inicio: `(0,1)`.
- Objetivo: `(4,1)`.
- Algoritmos comparados: BFS, A* normal y A* con perfil B.
- Origen de los datos: salida observada de la prueba temporal `tests/navigation/comparison.evidence.test.ts`.
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

**BFS**

`(0,1) → (1,1) → (2,1) → (3,1) → (4,1)`

**A* normal**

`(0,1) → (1,1) → (2,1) → (3,1) → (4,1)`

**A* con perfil B**

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

Conclusión: DFS puede encontrar un camino, pero no garantiza que tenga la menor cantidad de pasos.

### Dijkstra

Aristas de referencia:

- `S → A = 1`
- `A → G = 9`
- `S → B = 3`
- `B → G = 3`

La ruta `S → A → G` tiene costo 10. La alternativa `S → B → G` tiene costo 6, por lo que es la ruta de menor costo acumulado.

Conclusión: con costos variables, la cantidad de pasos no basta para comparar rutas. Dijkstra optimiza el costo acumulado. En esta práctica se documenta conceptualmente, sin incorporarlo como una implementación nueva.

## 8. Registro de trabajo y decisiones

1. Se seleccionó la variante B: evitar zonas expuestas.
2. Se ajustó A* para contemplar costos de entrada diferenciados, manteniendo gratuito el inicio.
3. Se expuso el perfil opcional desde el consumidor de simulación.
4. Se ampliaron las pruebas para cubrir el perfil B, el perfil desactivado y el caso de inicio igual al objetivo.
5. Se revisó la escena para retirar controles e indicadores temporales del perfil B y mantener la interfaz de juego original.
6. Se ejecutó la validación general: 57 pruebas aprobadas, verificación de tipos correcta y compilación de producción exitosa.
7. Se prepararon la especificación, el plan y la evidencia.
8. El commit de implementación `b007fd86208c02bd964ca3441282fc9d229efaf2` fue publicado en la rama `main`.
9. Se ejecutó una prueba temporal de comparación de algoritmos y se registraron sus rutas y métricas en la sección 6.
10. La prueba temporal se utilizó para la comparación y no forma parte de la suite permanente.
11. El commit `5a76c7fcbe6a51ffe13f6dcacd7468b502773058` corresponde a la última versión publicada antes de esta actualización de la evidencia.

## 9. Revisión final

Comprobaciones que deben realizarse antes de cerrar la entrega:

- Confirmar que BFS conserve su comportamiento.
- Confirmar que el perfil B modifique únicamente el costo de navegación previsto.
- Confirmar que la celda inicial siga teniendo costo cero.
- Revisar que la heurística de A* siga siendo admisible con el costo mínimo de entrada.
- Verificar que no se hayan alterado percepción, memoria ni máquina de estados.
- Verificar que la escena no incluya controles de prueba no solicitados.
- Confirmar que los archivos temporales no se agreguen a la entrega.
- Confirmar que la especificación, el plan y la evidencia reflejen el estado real.
- Verificar que los casos normales y límite exigidos estén cubiertos y documentados.
- Confirmar que la prueba temporal de comparación no forme parte de la suite permanente.
- Revisar el diff final para descartar modificaciones ajenas al alcance acordado.

Comandos de revisión:

```bat
git branch --show-current
git rev-parse HEAD
git status --short
git diff --check
git diff --stat
npm run validate
```

No se debe afirmar que se ejecutaron comprobaciones nuevas hasta contar con su salida real. Si se modifica algún archivo de implementación o pruebas, se debe repetir la validación antes de entregar.

## 10. Criterios comunes de aceptación

### BASE-01 — Contrato de navegación

La especificación define la cuadrícula, las coordenadas, los movimientos cardinales, el formato del camino y el costo de la ruta. La revisión final del contrato debe quedar respaldada por los documentos versionados.

### BASE-02 — Comparación de BFS y A*

La sección 6 registra las rutas y métricas obtenidas en una ejecución temporal de comparación sobre el mismo mapa, inicio y objetivo. Los resultados corresponden únicamente al fixture documentado.

### BASE-03 — Comparación conceptual de algoritmos

La sección 7 describe DFS y Dijkstra y los contrasta con BFS, sin afirmar que se hayan implementado como algoritmos nuevos.

### BASE-04 — Casos límite

Las pruebas permanentes cubren ruta válida, inicio igual al objetivo, objetivo inaccesible e inicio y objetivo inválidos. Los extremos inválidos se comprueban con las coordenadas `(-1,1)` y `(5,1)`. El caso inaccesible usa una cuadrícula de `5 × 3`, con las celdas `(2,0)`, `(2,1)` y `(2,2)` bloqueadas, inicio `(0,1)` y objetivo `(4,1)`. La última validación registrada aprobó las 57 pruebas.

### BASE-05 — Decisión humana

La variante B fue seleccionada explícitamente. Las zonas expuestas modifican el costo de navegación, pero no se convierten en obstáculos.

### BASE-06 — Revisión de cambios

Antes de cerrar la entrega, la revisión del diff debe confirmar que los cambios se limitan al perfil de navegación, sus pruebas y la documentación, sin modificar percepción, memoria ni máquina de estados.

### BASE-07 — Validación reproducible

La última ejecución registrada de `npm run validate` completó el chequeo de tipos, las 57 pruebas y la compilación de producción. Vite emitió una advertencia no bloqueante por el tamaño del archivo JavaScript generado.

### BASE-08 — Entrega y versión final

Repositorio: https://github.com/ValentinCantarrutti/GuardiadelSigilo. Rama: `main`. Último commit publicado registrado: `5a76c7fcbe6a51ffe13f6dcacd7468b502773058`. Cuando se publique la versión definitiva, se actualizarán el hash y el enlace para que correspondan al commit realmente entregado.

La aprobación definitiva queda sujeta a la revisión humana del diff, a la validación final y a que la evidencia publicada corresponda con el commit entregado.

## 11. Limitaciones y conclusión

La última validación general registrada fue satisfactoria: 57 pruebas aprobadas, verificación de tipos correcta y compilación de producción completada, con una advertencia no bloqueante sobre el tamaño del bundle.

La comparación temporal adicional registró resultados concretos para BFS, A* normal y A* con perfil B en un mapa abierto de `5 × 3`. Los resultados muestran que A* normal encontró la ruta directa con menos nodos expandidos que BFS, mientras que el perfil B eligió una ruta más larga para evitar las celdas expuestas y reducir el costo.

La documentación no reemplaza la revisión del diff ni la validación reproducible. Antes de considerar terminada la práctica, se deben comprobar los cambios finales, repetir `npm run validate` si hubo modificaciones posteriores a la última validación y registrar el hash del commit publicado.
