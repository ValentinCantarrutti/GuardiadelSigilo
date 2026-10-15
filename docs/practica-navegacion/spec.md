# Spec: práctica de navegación — 7 al 14/10/2026

**Estado:** Borrador para revisión y aprobación humana
**Repositorio:** https://github.com/ValentinCantarrutti/GuardiadelSigilo
**Commit inicial:** 65e3de52ca78213e00d3b42674fcfb799492e197
**Variante elegida:** B — evitar zonas expuestas
**Rutas relevantes:** `src/domain/navigation/search.ts`, `src/application/simulation/navigationDemo.ts`, `tests/navigation/` y el consumidor real de navegación, por confirmar durante la revisión del código.
**Comandos de referencia:** `npm run validate`, `npm run typecheck` y `npm run test:run`, sujetos a la confirmación de su definición en `package.json`.

## 1. Objetivo

Comparar BFS y A* sobre un fixture común y verificar una única mejora de navegación: preferir rutas que eviten zonas expuestas, manteniendo el contrato previo y separando búsqueda, seguimiento y decisión.

La mejora debe conectarse con una entrada de navegación o simulación existente. Una prueba aislada del algoritmo no demuestra por sí sola la integración con el consumidor.

## 2. Alcance

- Explorar el repositorio y registrar las capacidades existentes.
- Establecer la línea base y comparar BFS y A* con el mismo fixture.
- Completar las trazas conceptuales de DFS y Dijkstra, sin implementarlos.
- Verificar los casos comunes y sus límites.
- Adaptar esta especificación al contrato real del proyecto.
- Aprobar la especificación y el plan antes de autorizar modificaciones adicionales de código.
- Implementar o verificar únicamente la variante B.
- Comprobar la integración con el consumidor real.
- Ejecutar las pruebas y la validación final.
- Revisar el diff, registrar las limitaciones y preparar la entrega.

## 3. Fuera de alcance

- Implementar DFS o Dijkstra.
- Desarrollar las variantes A o C.
- Modificar la FSM, la percepción, la memoria, los sensores o los controles del guardia.
- Agregar dependencias, un editor de mapas, una interfaz nueva o un motor nuevo.
- Rehacer capacidades que ya existen sin una incompatibilidad demostrada.
- Eliminar cambios previos, corregir fallos ajenos a la práctica sin autorización o modificar pruebas para ocultar errores.
- Crear commits o publicar automáticamente.

## 4. Decisión humana: variante B

Se selecciona **evitar zonas expuestas** mediante una máscara fija de tres celdas:

- `(1,1)`
- `(2,1)`
- `(3,1)`

El costo de entrada es:

- Celda normal: `1`.
- Celda expuesta: `5`, equivalente a un costo base de `1` más una penalización de `4`.

La celda inicial no suma costo. La máscara expresa una preferencia de navegación, no un conjunto de obstáculos ni una probabilidad de detección.

La mejora no consulta si el jugador está oculto, no cambia la percepción o memoria del guardia y no modifica la FSM.

Antes de aprobar la implementación, se debe comprobar que la representación del costo y la configuración del perfil sean compatibles con las capacidades reales del repositorio.

## 5. Contrato común de navegación

- El mapa se representa mediante una cuadrícula.
- El origen de coordenadas está en la esquina superior izquierda.
- Solo se permiten movimientos cardinales, sin diagonales.
- El camino incluye el inicio y el objetivo cuando existe una ruta válida.
- Los pasos corresponden a aristas recorridas: `pasos = path.length - 1`.
- `totalCost`, si el contrato utiliza ese campo para representar los pasos, debe coincidir con la cantidad de movimientos.
- `weightedCost`, si está disponible, suma los costos de entrada de las celdas posteriores al inicio. No cobra la celda inicial.
- BFS conserva su semántica unitaria y no se presenta como un algoritmo que minimiza costos ponderados.
- A* debe usar una heurística compatible con los costos reales. La distancia Manhattan es admisible cuando el costo mínimo de entrada es `1` y solo se permiten movimientos cardinales.
- El inicio igual al objetivo debe producir un éxito inequívoco, cero movimientos y costo ponderado cero si este último campo está disponible.
- Los extremos inválidos y la ausencia de ruta deben distinguirse según el contrato existente.
- No se debe imponer un nuevo formato de retorno solo para copiar un ejemplo. Se documentará el comportamiento real y se verificará que los resultados sean inequívocos.

## 6. Fixture común para BFS y A*

El fixture de referencia es una cuadrícula abierta de `5 × 3`:

- Coordenadas válidas: `x = 0..4`, `y = 0..2`.
- Inicio: `S = (0,1)`.
- Meta: `G = (4,1)`.
- Todas las celdas son transitables.
- Costo de entrada unitario.
- Movimientos: arriba, abajo, izquierda y derecha.
- No se permiten diagonales.

La ruta directa contiene cinco puntos y cuatro movimientos. Con costos unitarios, su costo es `4`.

BFS y A* deben ejecutarse con el mismo mapa, inicio y meta. Se registrarán el estado, la ruta, los pasos, el costo y las métricas de exploración que la implementación exponga.

Si una métrica no está disponible, se registrará como no disponible; no se agregará instrumentación obligatoria ni se inventarán resultados.

### Comparación ya registrada

Existe una prueba de comparación en `tests/navigation/comparison.evidence.test.ts`. En una ejecución previamente observada, los resultados fueron:

| Métrica | BFS | A* |
|---|---:|---:|
| Estado | `success` | `success` |
| Movimientos | 4 | 4 |
| Costo unitario | 4 | 4 |
| Nodos expandidos | 12 | 5 |
| Frontera máxima | 4 | 9 |

Ambos resultados registraron la ruta directa desde `(0,1)` hasta `(4,1)`.

Estos valores pertenecen a esa ejecución y a ese fixture. Antes de considerarlos evidencia definitiva, se debe conservar la prueba correspondiente, verificar su salida y registrar su estado en Git. No deben generalizarse a otros mapas.

## 7. Casos comunes y límites

### 7.1 Ruta válida

Utilizar dos coordenadas válidas conectadas por celdas transitables. Verificar el estado de éxito y que cada movimiento del camino sea cardinal y válido.

### 7.2 Inicio igual a meta

Usar la misma coordenada para inicio y meta. El resultado debe representar éxito, un camino de un solo punto y cero movimientos. Si se informa costo ponderado, debe ser cero.

### 7.3 Destino inaccesible

En el fixture común, bloquear `(2,0)`, `(2,1)` y `(2,2)`, manteniendo libre el objetivo.

El resultado debe indicar que no existe ruta. No debe confundirse con un extremo inválido.

### 7.4 Inicio inválido

Usar `(-1,1)` como inicio y una meta válida. Registrar el resultado que establece el contrato real.

### 7.5 Meta inválida

Usar `(5,1)` como meta y un inicio válido. Registrar el resultado que establece el contrato real.

Los cinco casos deben contrastarse con las pruebas existentes. Si un resultado no cumple el contrato, conservar la reproducción y consultar antes de ampliar el alcance.

## 8. Variante B: requisitos y criterios de aceptación

### B-01 — Máscara fija

Utilizar la máscara expuesta definida en esta especificación. Las tres celdas siguen siendo transitables y su costo de entrada es `5`. Las celdas normales tienen costo de entrada `1`.

No consultar el estado de ocultamiento del jugador ni modificar sensores, percepción o memoria.

### B-02 — Búsqueda ponderada

Reutilizar A* y las capacidades de navegación existentes, o realizar la adaptación mínima que la exploración justifique.

Mantener la heurística Manhattan admisible con costo mínimo de entrada `1`. Conservar BFS y el caso unitario anterior.

### B-03 — Consumidor existente

Conectar el perfil mediante la entrada de navegación o simulación que se confirme en el repositorio. La prueba debe invocar el consumidor real o una prueba de integración de ese consumidor.

No crear una interfaz nueva ni modificar la FSM para seleccionar el perfil.

### B-04 — Desactivación del perfil

Al desactivar la penalización, la búsqueda debe utilizar los costos unitarios actuales. No debe reutilizar accidentalmente costos o resultados de una ejecución anterior.

### B-AC1 — Preferencia por la ruta sin exposición

En el fixture abierto de `5 × 3`, con inicio `(0,1)`, meta `(4,1)` y perfil B:

- La ruta directa tiene cuatro movimientos y costo ponderado `16`.
- La ruta preferida tiene seis movimientos, costo ponderado `6` y no atraviesa ninguna de las tres celdas expuestas.
- Se acepta el rodeo superior o inferior; no se exige una ruta única en caso de empate.

El costo `16` de la ruta directa corresponde a tres entradas expuestas de costo `5` y una entrada normal de costo `1`. El costo `6` del rodeo corresponde a seis entradas normales de costo `1`.

### B-AC2 — Perfil desactivado

Con la penalización desactivada:

- La ruta directa tiene cuatro movimientos y costo `4`.
- Las celdas expuestas siguen siendo transitables.
- El resultado no depende de costos obsoletos del perfil anterior.

### B-AC3 — Integración y regresión

Una prueba reproducible del consumidor existente debe demostrar que:

- Con el perfil B activado, se obtiene el rodeo esperado.
- Con el perfil desactivado, se conserva el comportamiento unitario.
- BFS conserva su comportamiento anterior.
- No se modifican la percepción, la memoria ni la FSM.

No se considerará demostrado este criterio mediante una prueba exclusiva de la función de búsqueda.

## 9. Comparaciones conceptuales

### DFS

Grafo dirigido y orden de vecinos:

- `S: [A,B]`
- `A: [C]`
- `C: [X]`
- `X: [G]`
- `B: [D,E]`
- `D: [G]`
- `E: []`
- `G: []`

Con vecinos apilados en orden inverso para visitar primero el primero de la lista, DFS sigue la traza `S → A → C → X → G`, de cuatro pasos.

BFS puede encontrar `S → B → D → G`, de tres pasos. DFS no garantiza la ruta con menos pasos porque prioriza la profundidad según el orden de exploración, no la distancia mínima.

### Dijkstra

Aristas y costos:

- `S → A = 1`
- `A → G = 9`
- `S → B = 3`
- `B → G = 3`

Traza:

1. Extraer `S=0`: descubrir `A=1` y `B=3`.
2. Extraer `A=1`: asignar provisionalmente `G=10`.
3. Extraer `B=3`: mejorar el costo de `G` a `6`.
4. Extraer la entrada válida de `G`: la ruta final es `S → B → G`, de costo `6`.

No se debe terminar al descubrir por primera vez G: una ruta alternativa todavía puede mejorar el costo. Ambas rutas tienen dos acciones, pero costos diferentes.

Estas trazas son ejercicios conceptuales. No deben presentarse como ejecuciones del código del proyecto.

## 10. Requisitos comunes de la práctica

- **BASE-01 — Exploración y línea base:** identificar búsqueda, seguimiento, consumidor y pruebas; registrar repositorio, commit inicial, cambios previos, comandos y validación de referencia.
- **BASE-02 — Comparación:** contrastar BFS y A* sobre el mismo fixture, registrando rutas y métricas reales disponibles.
- **BASE-03 — Algoritmos:** documentar las trazas conceptuales de DFS y Dijkstra sin implementarlos.
- **BASE-04 — Casos límite:** verificar ruta válida, inicio igual a meta, destino inaccesible y extremos inválidos.
- **BASE-05 — Decisión humana:** adaptar esta especificación al repositorio, seleccionar un solo anexo y aprobar spec y plan antes de implementar.
- **BASE-06 — Implementación:** desarrollar únicamente la variante B aprobada, reutilizar capacidades existentes y revisar cada incremento.
- **BASE-07 — Verificación:** ejecutar pruebas enfocadas, prueba del consumidor, validación completa y revisión del diff.
- **BASE-08 — Entrega:** preparar los tres documentos, la URL y el commit final identificable.

### Criterios comunes de aceptación

- **BASE-AC1 — Evidencia inicial:** repositorio, commit, capas, cambios previos, comandos y resultados iniciales identificados, distinguiendo observaciones de supuestos.
- **BASE-AC2 — Comparación y trazas:** BFS y A* obtienen rutas válidas de cuatro pasos y costo unitario `4` en el fixture común; se documentan las métricas disponibles y las conclusiones de DFS y Dijkstra.
- **BASE-AC3 — Casos límite:** inicio igual a meta representa éxito de costo cero; la barrera completa representa ausencia de ruta; los extremos inválidos se distinguen según el contrato documentado.
- **BASE-AC4 — Aprobación y decisión:** spec y plan revisados antes de los cambios adicionales; una decisión humana y su contraste con el código quedan registrados; solo se desarrolla la variante B.
- **BASE-AC5 — Verificación final:** los criterios de B tienen pruebas reproducibles, existe evidencia del consumidor, la validación y el diff se revisan y no se introducen regresiones nuevas.
- **BASE-AC6 — Entrega identificable:** los tres documentos, la URL y el commit final identifican la misma versión entregada; los cambios de código y pruebas requeridos están en ese commit.

## 11. Verificación y entrega

El comando principal previsto es:

```bat
npm run validate
```

Antes de ejecutarlo, confirmar su definición en `package.json`. Registrar la salida real de tipos, pruebas y compilación. Ejecutar la validación después de los últimos cambios de código, pruebas y documentación que formen parte de la entrega.

La evidencia se registra en `docs/practica-navegacion/evidencia.md` e incluye:

- Estado inicial y commit de referencia.
- Exploración mínima y rutas comprobadas.
- Comparación BFS/A* y métricas disponibles.
- Trazas conceptuales de DFS y Dijkstra.
- Casos normales y límites.
- Pruebas de la variante B y de su consumidor.
- Decisiones humanas y registro resumido de intervención.
- Validación final, revisión del diff y limitaciones.

La entrega final requiere:

- URL del repositorio individual.
- Hash del commit final.
- `spec.md`, `plan.md` y `evidencia.md` completos y coherentes.
- Código y pruebas requeridos incorporados al commit que se entrega.

La persona responsable revisará los cambios y decidirá si crea el commit y publica la versión final. No se declarará aprobada una comprobación que no tenga evidencia verificable.

## 12. Estado actual de aceptación

Estos estados reflejan el conocimiento disponible al redactar la especificación. Deben actualizarse después de la verificación final.

- **BASE-01:** rutas candidatas identificadas; falta completar y confirmar los datos iniciales de la versión final.
- **BASE-02:** existe una prueba de comparación con resultados previamente observados; falta confirmar su conservación y registrar la evidencia definitiva.
- **BASE-03:** trazas conceptuales documentadas; comprobar que estén también registradas en la evidencia final.
- **BASE-04:** hay pruebas de casos límite según el historial del proyecto; comprobar cada caso en la validación final.
- **BASE-05:** la variante B está seleccionada; registrar la aprobación humana de spec y plan antes de cualquier modificación adicional.
- **BASE-06:** revisar qué capacidades ya están implementadas y qué cambios son realmente necesarios.
- **BASE-07:** la validación anterior registró 57 pruebas aprobadas y compilación exitosa; repetirla después de los cambios finales.
- **BASE-08:** el último commit publicado identificado es `b34e385`; confirmar el commit final que incluya toda la entrega.
- **B-AC1:** hay resultados de comparación BFS/A* en el fixture unitario, pero falta demostrar el rodeo ponderado con costo `6` y la ruta directa de costo `16`.
- **B-AC2:** verificar la desactivación del perfil y su comportamiento unitario.
- **B-AC3:** falta confirmar mediante evidencia una prueba del consumidor real con el perfil activado y desactivado.

No se consideran satisfechos los criterios únicamente porque estén escritos en esta especificación. La aprobación final depende de la ejecución, la revisión humana y la evidencia correspondiente.

## 13. Limitaciones

La variante B utiliza una máscara fija y costos estáticos. No modela visión dinámica, probabilidades, coberturas reales ni conocimiento del guardia.

Las métricas de exploración dependen de la implementación y del fixture. Solo se registrarán si se obtienen de resultados verificables.

Si el código existente presenta una incompatibilidad con esta especificación, debe documentarse y consultarse antes de ampliar el alcance. No se debe ocultar una limitación ni modificar los criterios para simular un cumplimiento que no fue demostrado.
