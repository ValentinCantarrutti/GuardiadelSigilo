**Estado:** Pendiente de revisión y aceptación humana
**Variante:** B — evitar zonas expuestas
**Spec:** `docs/practica-navegacion/spec.md`
**Evidencia:** `docs/practica-navegacion/evidencia.md`
**Repositorio:** `https://github.com/ValentinCantarrutti/GuardiadelSigilo`
**Último commit publicado de referencia:** `b34e385` — `Completa evidencia y casos limite de navegacion`
**Commit actual observado durante la revisión:** `89ce872`
# Plan de implementación — Práctica de navegación

## 1. Objetivo

Organizar la inspección, verificación y documentación de la práctica de navegación del laboratorio Guardia de Sigilo.

El trabajo debe ser incremental y trazable: primero se comprende el estado existente, después se verifican los requisitos, se ejecutan las pruebas pertinentes y finalmente se registra la evidencia y la decisión humana.

No se deben inventar archivos, resultados, pruebas ni comportamientos. Tampoco se deben realizar cambios ajenos al alcance sin una justificación documentada.

## 2. Estado inicial y precauciones

### 2.1. Línea base

La práctica dispone de una implementación de búsqueda con BFS y A*, pruebas automatizadas y una función de simulación que permite evaluar una variante de costos.

Se debe revisar el estado real del repositorio antes de intervenir y diferenciar los resultados heredados de los obtenidos después de cada cambio.

### 2.2. Validación técnica registrada

La ejecución final de `npm.cmd run validate` completó correctamente:

- TypeScript: `tsc --noEmit` sin errores.
- Vitest: 8 archivos y 58 pruebas aprobadas.
- Vite: build de producción completado.
- Advertencia no bloqueante: paquete JavaScript minificado de `1,498.02 kB`, gzip de `345.56 kB`, por encima del umbral de `500 kB`.

La salida corresponde a la ejecución realizada después de los cambios documentales pendientes.
### 2.3. Precauciones

- No instalar dependencias nuevas sin necesidad y autorización.
- No publicar secretos ni datos personales.
- No modificar áreas fuera del alcance.
- No declarar pruebas aprobadas sin haberlas ejecutado.
- No confundir una prueba unitaria con la verificación de una mecánica dentro del juego.
- No realizar un commit o push adicional hasta completar la revisión y contar con autorización expresa.

## 3. Requisitos comunes: BASE-01 a BASE-08

Esta sección sigue la misma numeración que `spec.md` y `evidencia.md`.

### BASE-01 — Exploración y línea base

**Acciones**

1. Revisar la implementación de búsqueda y sus dependencias.
2. Localizar la función de simulación y el punto de integración con la escena.
3. Revisar las pruebas existentes antes de modificarlas.
4. Registrar qué comportamiento ya existía y qué cambios se introdujeron para la práctica.

**Resultado esperado**

Una descripción verificable de los archivos relevantes, la responsabilidad de cada uno y el estado inicial.

**Criterio de cierre**

Los archivos citados en la documentación existen y su función se corresponde con la descripción.

### BASE-02 — Comparación BFS/A*

**Acciones**

1. Utilizar el escenario común de `5 × 3`.
2. Establecer inicio `(0,1)` y destino `(4,1)`.
3. Ejecutar BFS y A* con la variante B desactivada.
4. Registrar ruta, pasos, costo y métricas disponibles.
5. Comparar los resultados sin generalizar más allá del escenario probado.

**Resultado esperado**

Una comparación reproducible que muestre que ambos algoritmos encuentran el recorrido de referencia.

**Criterio de cierre**

Los resultados están respaldados por una prueba identificable y no solo por una descripción narrativa.

### BASE-03 — Algoritmos conceptuales

**Acciones**

1. Documentar DFS.
2. Documentar Dijkstra.
3. Explicar sus diferencias con BFS y A*.
4. Separar las explicaciones conceptuales de las funcionalidades realmente implementadas.

**Resultado esperado**

Una explicación correcta de las estrategias de exploración y de sus garantías, sin afirmar que DFS o Dijkstra forman parte del flujo ejecutable si no existe evidencia.

**Criterio de cierre**

La documentación distingue entre teoría, implementación y pruebas.

### BASE-04 — Casos comunes y límites

**Acciones**

1. Comprobar una ruta válida.
2. Comprobar inicio igual al destino.
3. Comprobar un destino inalcanzable.
4. Comprobar un inicio inválido.
5. Comprobar un destino inválido.
6. Revisar que los resultados de error no se interpreten como rutas válidas.

**Resultado esperado**

Cobertura documentada de los principales casos límite.

**Criterio de cierre**

Cada escenario se relaciona con una prueba o evidencia identificable.

### BASE-05 — Decisión humana

**Acciones**

1. Revisar los cambios.
2. Examinar las salidas de validación.
3. Leer las limitaciones conocidas.
4. Determinar si la entrega satisface los criterios.
5. Registrar la decisión y las observaciones pendientes.

**Resultado esperado**

Una decisión humana explícita, separada de los resultados automáticos.

**Criterio de cierre**

La documentación no afirma aprobación hasta que la revisión esté efectivamente registrada.

### BASE-06 — Trazabilidad

**Acciones**

1. Relacionar cada requisito con sus criterios de aceptacion.
2. Identificar los archivos, pruebas y evidencias que respaldan cada criterio.
3. Registrar explicitamente los criterios que siguen pendientes.

**Resultado esperado**

Una relacion verificable entre requisitos, implementacion y evidencia.

**Criterio de cierre**

Los documentos permiten localizar el respaldo de cada criterio sin confundir una descripcion con una prueba ejecutada.

### BASE-07 — Validacion reproducible

**Acciones**

1. Registrar el comando de validacion ejecutado.
2. Conservar los resultados observados y las advertencias relevantes.
3. Repetir la validacion cuando los cambios posteriores puedan afectar sus resultados.

**Resultado esperado**

Un registro fiel de las pruebas y de la compilacion realizadas sobre la version evaluada.

**Criterio de cierre**

Los resultados documentados corresponden a una ejecucion identificable y no se presentan como garantia de una version posterior sin volver a validarla.

### BASE-08 — Integridad del alcance

**Acciones**

1. Distinguir las pruebas unitarias de la integracion dentro del juego.
2. Documentar las limitaciones conocidas de la variante B.
3. Evitar declarar funcionalidades integradas o aprobadas sin evidencia suficiente.

**Resultado esperado**

Una descripcion honesta del alcance implementado y de lo que todavia no se ha verificado.

**Criterio de cierre**

La documentacion deja claro que `GameScene.ts` no activa la variante B en la llamada actual y mantiene pendiente la decision humana final.
## 4. Incremento 1 — Variante B

### Objetivo

Verificar el comportamiento de los costos de entrada configurables.

### Configuración

- costo normal: `1`;
- costo de las celdas expuestas `(1,1)`, `(2,1)` y `(3,1)`: `5`;
- costo de la celda inicial: `0`, porque no se cobra por ingresar a ella;
- variante B: activable o desactivable.

### Acciones

1. Revisar cómo se calculan los costos de entrada.
2. Confirmar que la celda inicial no se cobre.
3. Ejecutar el escenario con la variante desactivada.
4. Ejecutar el escenario con la variante activada.
5. Comparar el recorrido directo con la alternativa de menor costo.
6. Registrar los resultados y relacionarlos con las pruebas.

### Resultados esperados

Con la variante desactivada, el recorrido directo tiene cuatro pasos y costo `4`.

Con la variante activada, el recorrido directo tiene cuatro pasos y costo `16`, mientras que la alternativa de seis pasos tiene costo `6`.

### Criterios de aceptación

- **B-AC1:** el cálculo del costo respeta los costos de entrada y no cobra la celda inicial.
- **B-AC2:** la variante desactivada conserva los costos normales.
- **B-AC3:** en el escenario de referencia, la variante activada permite elegir la ruta de menor costo total, aunque sea más larga.

El caso de inicio igual al destino pertenece a `BASE-AC3`, no a un criterio adicional de la variante B.

## 5. Incremento 2 — Integración y alcance de la variante

### Objetivo

Distinguir la disponibilidad de la variante en la función de simulación de su activación dentro del juego.

### Acciones

1. Revisar la firma de `calculateRoute` en `src/application/simulation/navigationDemo.ts`.
2. Confirmar el comportamiento del parámetro `profileB`.
3. Revisar la llamada a `calculateRoute` desde `src/game/scenes/GameScene.ts`.
4. Documentar el estado de integración sin ampliar el alcance automáticamente.

### Limitación conocida

La función de simulación permite activar la variante mediante su parámetro `profileB`. La escena `GameScene.ts` llama a `calculateRoute` sin activar ese parámetro.

Por lo tanto, no debe afirmarse que la variante B esté activa en el juego. Su verificación mediante la función de simulación y las pruebas no equivale a una demostración de que esté habilitada en la escena jugable.

### Criterio de cierre

La documentación describe con precisión qué se verificó y qué queda fuera de la integración actual.

## 6. Incremento 3 — Validación y criterios comunes

### Objetivo

Ejecutar las comprobaciones técnicas y registrar la evidencia de la versión final.

### Acciones

1. Ejecutar `npm.cmd run validate`.
2. Registrar la salida real de TypeScript, Vitest y Vite.
3. Verificar el resultado de las pruebas de navegación.
4. Confirmar que la prueba de comparación de BFS/A* sigue correspondiéndose con el escenario descrito.
5. Ejecutar `git diff --check`.
6. Revisar que los documentos no tengan referencias rotas ni afirmaciones sin respaldo.
7. Registrar advertencias y limitaciones.

### Criterios de aceptación

- **BASE-AC1:** exploración documentada.
- **BASE-AC2:** comparación reproducible.
- **BASE-AC3:** casos límite cubiertos por pruebas o evidencia identificable.
- **BASE-AC4:** explicación conceptual correcta.
- **BASE-AC5:** validación técnica registrada sobre la versión evaluada.
- **BASE-AC6:** limitaciones y decisión humana documentadas.

### Validación final

Se ejecutó `npm.cmd run validate` y finalizaron correctamente typecheck, pruebas y build: 8 archivos de prueba, 58 pruebas aprobadas y compilación de producción completada. Vite informó una advertencia no bloqueante por el tamaño del paquete JavaScript (`1,498.02 kB`, gzip `345.56 kB`).

La comparación del fixture común registró:

- BFS: 4 pasos, costo 4, 12 nodos expandidos y frontera máxima 4.
- A*: 4 pasos, costo 4, 5 nodos expandidos y frontera máxima 9.

Estos valores describen el fixture probado, no un resultado universal para cualquier mapa. La revisión del diff y la decisión humana siguen siendo pasos separados.
## 7. Trazabilidad

La matriz de trazabilidad se encuentra en `docs/practica-navegacion/evidencia.md`.

Debe permitir identificar, para cada requisito y criterio:

- qué se esperaba;
- dónde se implementa o documenta;
- qué prueba o evidencia lo respalda;
- cuál fue el resultado observado;
- qué limitación permanece.

Una referencia a un archivo no demuestra por sí sola que un requisito esté satisfecho. La evidencia debe respaldar la afirmación concreta.

## 8. Registro de trabajo

El registro debe conservar una cronología breve y verificable.

Para cada intervención, registrar:

1. qué se inspeccionó o modificó;
2. por qué era necesario;
3. qué prueba o comando se ejecutó;
4. qué resultado produjo;
5. qué limitaciones quedaron pendientes.

Distinguir entre cambios de implementación, cambios de pruebas y cambios de documentación.

No atribuir a una ejecución anterior resultados que no fueron observados en ella.

## 9. Revisión final

Antes de considerar cerrada la práctica:

- revisar la consistencia entre `spec.md`, `plan.md` y `evidencia.md`;
- verificar que los identificadores BASE y B coincidan entre los documentos;
- comprobar que cada afirmación de validación tenga un resultado real;
- confirmar las limitaciones de integración de la variante B;
- revisar el diff completo;
- obtener la decisión humana expresa.

Si alguna validación no puede ejecutarse, debe registrarse como pendiente, no como aprobada.

## 10. Entrega

La entrega debe incluir:

- `docs/practica-navegacion/spec.md`;
- `docs/practica-navegacion/plan.md`;
- `docs/practica-navegacion/evidencia.md`;
- las pruebas y cambios de implementación pertinentes;
- los resultados reproducibles de validación;
- la revisión final y las limitaciones conocidas.

No realizar un commit o push adicional hasta que la revisión final esté completa y exista autorización expresa. La existencia de commits anteriores debe registrarse por separado del estado de aceptación de esta revisión.
