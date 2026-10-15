# Plan de implementación — Práctica de navegación

# Plan — práctica de navegación

**Estado:** Borrador para revisión humana
**Variante:** B — evitar zonas expuestas
**Spec:** `docs/practica-navegacion/spec.md`
**Repositorio:** `https://github.com/ValentinCantarrutti/GuardiadelSigilo`

## 1. Objetivo

Completar y verificar la variante B de la práctica de navegación, comparando BFS y A*, comprobando los casos comunes y conectando la preferencia por evitar zonas expuestas con un consumidor existente.

La prioridad es conservar el comportamiento anterior, reutilizar las capacidades existentes y documentar únicamente resultados comprobados. No se implementarán otras variantes ni se reconstruirán sistemas que ya funcionen.

## 2. Estado inicial y precauciones

Antes de continuar, comprobar desde la raíz del repositorio:

```bat
git branch --show-current
git rev-parse HEAD
git status --short
git diff --check
git diff --stat
```

El último commit publicado identificado durante el trabajo es `b34e385` (`Completa evidencia y casos limite de navegacion`). Confirmar el commit actual antes de utilizarlo como referencia definitiva.

Se registró previamente una validación con 57 pruebas aprobadas y compilación exitosa. Ese resultado corresponde al estado validado entonces y debe repetirse al cerrar la práctica.

Existe una prueba de comparación BFS/A* en `tests/navigation/comparison.evidence.test.ts`. Su ejecución registró cuatro movimientos para ambos algoritmos en el fixture abierto de 5 × 3. Antes de continuar, comprobar su estado en Git y decidir si corresponde conservarla como parte de la entrega.

También se observaron los archivos sin seguimiento `output.txt` y `perfil_b_zonas_expuestas.patch`. Revisarlos antes de decidir su destino. No borrarlos, incorporarlos ni publicarlos automáticamente.

**Regla de autorización:** antes de modificar código, verificar qué requisitos ya están implementados. Si una capacidad existe y satisface la especificación, conservarla y completar su evidencia en lugar de duplicarla.

## 3. Referencia común: BASE-01 a BASE-04

Estos requisitos son parte de la práctica, independientemente de la variante B.

### BASE-01 — Exploración y línea base

- Identificar las capas de búsqueda, seguimiento, consumidor y pruebas mediante rutas y símbolos reales.
- Registrar el repositorio, la rama, el commit inicial y los cambios previos.
- Confirmar los comandos de prueba y validación en `package.json` y en las instrucciones del proyecto.
- Distinguir hechos comprobados, supuestos y limitaciones.

**Evidencia:** tabla de capas y rutas, estado inicial de Git y resultado de la validación de referencia disponible.

### BASE-02 — Comparación BFS/A*

Utilizar el fixture común de 5 × 3 definido en la especificación:

- Inicio: `(0,1)`.
- Meta: `(4,1)`.
- Todas las celdas libres, costo unitario y movimientos cardinales.
- Registrar estado, ruta, cantidad de movimientos, costo, nodos expandidos y frontera máxima cuando esas métricas estén disponibles.

La ruta directa contiene cinco puntos y cuatro movimientos. El costo unitario esperado es 4.

En una ejecución previamente registrada, BFS y A* encontraron esa ruta. BFS expandió 12 nodos y A* expandió 5; la frontera máxima registrada fue 4 para BFS y 9 para A*. Estos datos corresponden exclusivamente a ese fixture y deben contrastarse con la prueba conservada y su salida real.

Si una métrica no está disponible, documentar la limitación. No agregar instrumentación innecesaria ni inventar valores.

### BASE-03 — DFS y Dijkstra conceptuales

Completar y documentar las trazas provistas por la guía, sin implementar algoritmos nuevos.

- DFS: explicar por qué la primera ruta encontrada puede no ser la de menos movimientos.
- Dijkstra: completar los costos `G=10` y luego `G=6`; documentar la ruta `S → B → G`, de costo total 6, y explicar por qué encontrar inicialmente una ruta hacia G no permite finalizar antes de comparar los costos.

### BASE-04 — Casos comunes y límites

Verificar con el contrato real del repositorio:

1. Ruta válida entre dos puntos.
2. Inicio igual a meta: éxito inequívoco y costo de movimientos 0.
3. Destino libre pero inaccesible por una barrera que bloquee la columna central.
4. Inicio inválido `(-1,1)`.
5. Meta inválida `(5,1)`.

No confundir un destino inaccesible con coordenadas inválidas. No imponer un nuevo formato de resultado si el contrato existente representa estos casos de otra manera, siempre que la diferencia sea inequívoca.

## 4. Incremento 1 — Verificar el contrato y la variante B

**Archivos previstos, sujetos a la exploración:**

- `src/domain/navigation/search.ts`
- `tests/navigation/search.test.ts`
- `tests/navigation/comparison.evidence.test.ts`, si se conserva.

**Trabajo:**

1. Revisar el contrato actual de BFS y A*, el cálculo del costo y la heurística.
2. Comprobar cómo se representa la máscara de celdas expuestas y si ya existe una configuración equivalente.
3. Verificar que entrar en una celda normal cueste 1 y entrar en una celda expuesta cueste 5.
4. Verificar que la celda inicial no sume costo.
5. Comprobar que Manhattan sea admisible porque el costo mínimo de entrada es 1.
6. Verificar el caso normal, el rodeo preferido, la desactivación del perfil y el inicio igual a meta.
7. Mantener BFS con su comportamiento unitario anterior.

**Criterios:**

- `B-AC1`: con el perfil B, A* encuentra un camino válido de seis movimientos, costo ponderado 6, que evita las tres celdas expuestas. La ruta directa tiene cuatro movimientos y costo ponderado 16.
- `B-AC2`: con la penalización desactivada, la ruta directa tiene cuatro movimientos y costo 4; la máscara no bloquea celdas.
- `B-AC4`: inicio igual a meta tiene costo de movimientos 0 y costo ponderado 0, si el resultado expone este último campo.
- BFS conserva su semántica y las pruebas anteriores continúan pasando.

Los costos ponderados suman los costos de entrada de las celdas posteriores al inicio. `totalCost`, cuando representa cantidad de movimientos, equivale a `path.length - 1`; no confundir ambos campos.

**Verificación:** utilizar las pruebas enfocadas confirmadas en `package.json`. Si no existe un comando específico, utilizar el comando de pruebas documentado y registrar el resultado real.

**Condición para avanzar:** criterios comprobados, diff revisado y ausencia de regresiones nuevas. Si la capacidad ya existe, no modificar la implementación sin una necesidad demostrada.

## 5. Incremento 2 — Integración con el consumidor existente

**Archivos candidatos, sujetos a la exploración:**

- `src/application/simulation/navigationDemo.ts`
- El consumidor real identificado en el repositorio.
- La prueba de integración existente o una prueba acotada en la carpeta de pruebas correspondiente.

**Trabajo:**

1. Identificar cómo el consumidor solicita actualmente una ruta.
2. Verificar si puede seleccionar explícitamente el perfil B mediante una configuración existente o una adaptación mínima.
3. Confirmar que el perfil B produce el rodeo esperado desde el consumidor, no solo desde la función de búsqueda aislada.
4. Confirmar que el modo unitario o perfil desactivado conserva el comportamiento previo.
5. Revisar que no se alteren la percepción, la memoria, la FSM ni los controles.
6. No agregar interfaces, indicadores, dependencias ni refactorizaciones ajenas a la variante.

**Criterios:**

- `B-AC3`: una prueba reproducible invoca el consumidor real y demuestra el resultado con el perfil B y sin él.
- `BASE-AC5`: la integración respeta el contrato anterior y no introduce regresiones.
- La evidencia identifica la ruta y el símbolo del consumidor efectivamente probado.

**Verificación:** ejecutar las pruebas de integración pertinentes y registrar el comando y su salida. Si la integración ya existe y cumple el contrato, conservarla y demostrarla mediante evidencia.

**Condición para avanzar:** el consumidor utiliza la configuración de navegación de forma comprobable. Si requiere cambios fuera del alcance, detenerse y consultar.

## 6. Incremento 3 — Validación final, revisión y evidencia

**Archivos previstos:**

- `docs/practica-navegacion/spec.md`
- `docs/practica-navegacion/plan.md`
- `docs/practica-navegacion/evidencia.md`
- Las pruebas y los archivos de implementación autorizados en los incrementos anteriores.

**Trabajo:**

1. Completar la matriz de criterios comunes y de la variante B.
2. Registrar las trazas conceptuales de DFS y Dijkstra.
3. Ejecutar las pruebas enfocadas y la validación completa después de los cambios finales.
4. Revisar `git diff --check`, `git diff --stat`, `git status --short` y el diff de cada archivo modificado.
5. Comprobar que la documentación distingue los resultados históricos de los resultados de la última ejecución.
6. Identificar limitaciones o criterios no demostrados, sin declararlos aprobados.
7. Verificar que los tres documentos, las pruebas y la implementación requerida estén en el commit que se entregará.
8. Dejar el commit y la publicación final a decisión humana.

**Comandos de revisión:**

```bat
git diff --check
git diff --stat
git status --short
npm run validate
```

Ejecutar los comandos desde la raíz del repositorio y registrar sus resultados reales. Si la validación falla, conservar el error y determinar si es previo o causado por los cambios de la práctica.

**Criterios:**

- `BASE-AC1` a `BASE-AC4`: exploración, comparación, casos comunes y decisión documentados con evidencia.
- `B-AC1` a `B-AC3`: mejora de la variante B, perfil desactivado e integración demostrados.
- `BASE-AC5`: validación final y diff revisados.
- `BASE-AC6`: entrega identificable mediante URL, commit final y
