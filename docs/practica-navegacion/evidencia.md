# Evidencia de la práctica de navegación

## 1. Identificación

- **Repositorio:** https://github.com/ValentinCantarrutti/GuardiadelSigilo
- **Variante trabajada:** B — evitar zonas expuestas.
- **Rama:** `main`.
- **Commit inicial de referencia:** `65e3de52ca78213e00d3b42674fcfb799492e197`.
- **Commit de implementación:** `b007fd86208c02bd964ca3441282fc9d229efaf2`.
- **Commit publicado de referencia:** `b34e385`.
- **Especificación:** `docs/practica-navegacion/spec.md`.
- **Plan:** `docs/practica-navegacion/plan.md`.

## 2. Archivos relevantes

- `src/domain/navigation/search.ts`: algoritmos BFS y A*, costos de entrada, reconstrucción de caminos y estados de resultado.
- `src/application/simulation/navigationDemo.ts`: consumidor de aplicación `calculateRoute`, que permite seleccionar algoritmo y activar el perfil B.
- `src/game/scenes/GameScene.ts`: consumidor de navegación del juego.
- `tests/navigation/search.test.ts`: pruebas de algoritmos, casos límite y perfil B.
- `tests/navigation/comparison.evidence.test.ts`: comparación reproducible de BFS y A*.
- `docs/practica-navegacion/spec.md`: criterios y alcance.
- `docs/practica-navegacion/plan.md`: planificación.
- `docs/practica-navegacion/evidencia.md`: registro de resultados y limitaciones.

## 3. Comparación BFS y A*

Se utilizó una grilla abierta de 5 × 3, inicio `(0,1)`, objetivo `(4,1)`, movimientos cardinales y costo unitario por paso.

| Métrica | BFS | A* normal |
|---|---:|---:|
| Estado | success | success |
| Pasos | 4 | 4 |
| Costo | 4 | 4 |
| Nodos expandidos | 12 | 5 |
| Frontera máxima | 4 | 9 |

Ambos algoritmos encontraron el camino directo:

`(0,1) → (1,1) → (2,1) → (3,1) → (4,1)`

Los resultados registrados proceden de `tests/navigation/comparison.evidence.test.ts`. En este escenario, A* expandió menos nodos; su frontera máxima fue mayor.

## 4. Variante B: evitar zonas expuestas

El perfil B asigna costo de entrada 5 a las celdas `(1,1)`, `(2,1)` y `(3,1)`, y costo 1 al resto. Las celdas siguen siendo transitables. La celda inicial no se cobra.

### Ruta directa en el corredor

En el mapa de prueba donde solo está disponible la fila central:

- Estado: `success`.
- Pasos: 4.
- Costo por pasos: 4.
- Costo ponderado: 16.

La ruta directa sigue siendo la única disponible, por lo que el algoritmo la conserva aunque atraviese las celdas expuestas.

### Ruta alternativa en la grilla abierta

Con el perfil B activado:

- Estado: `success`.
- Pasos: 6.
- Costo por pasos: 6.
- Costo ponderado: 6.
- La ruta evita las tres celdas expuestas de la fila central.

Al desactivar el perfil B, A* vuelve a la ruta directa de 4 pasos y costo ponderado 4.

### Contrato de BFS

Solicitar el perfil B con BFS no cambia el algoritmo: conserva el camino directo de 4 pasos y no devuelve `weightedCost`.

## 5. Casos límite verificados

Las pruebas de `tests/navigation/search.test.ts` comprueban:

- Camino válido y transitable en BFS y A*.
- Costo óptimo en la grilla de desvío.
- Inicio igual al objetivo: camino de una celda y costo cero.
- Inicio inválido: estado `invalid-start`.
- Objetivo inválido: estado `invalid-goal`.
- Objetivo inalcanzable por una columna completamente bloqueada: estado `unreachable`, camino vacío y costo nulo.
- Comparación del costo de A* con BFS.
- Selección de ruta con perfil B activado y desactivado.
- Exclusión de la celda inicial del costo ponderado.
- Compatibilidad del perfil B con el consumidor `calculateRoute`.

## 6. Comparaciones conceptuales

### DFS

En el grafo conceptual `S → A → C → X → G` y `S → B → D → G`, DFS puede encontrar primero la ruta de 4 pasos `S-A-C-X-G`, mientras que BFS encuentra la ruta de 3 pasos `S-B-D-G` si el orden de vecinos es el indicado. El ejemplo ilustra que DFS no garantiza el camino de menor cantidad de pasos.

### Dijkstra

En el grafo conceptual con aristas `S→A = 1`, `A→G = 9`, `S→B = 3` y `B→G = 3`, la ruta de menor costo es `S-B-G`, con costo 6. Aunque la ruta por A puede descubrir inicialmente un costo 10 para G, Dijkstra debe conservar la mejor alternativa conocida.

Estos ejemplos son comparaciones conceptuales documentadas, no resultados de pruebas automatizadas del proyecto.

## 7. Validación reproducible

Comando ejecutado:

`npm run validate`

Resultado registrado:

- TypeScript (`tsc --noEmit`): correcto.
- Vitest: 8 archivos de prueba aprobados.
- Pruebas aprobadas: 58.
- Compilación Vite de producción: correcta.
- Advertencia no bloqueante: el archivo JavaScript generado supera los 500 kB sin minificar.

La salida de la prueba de comparación registra:

- BFS: 4 pasos, costo 4, 12 nodos expandidos, frontera máxima 4.
- A* normal: 4 pasos, costo 4, 5 nodos expandidos, frontera máxima 9.

## 8. Integración y alcance real

`GameScene.ts` invoca `calculateRoute` para calcular y dibujar una ruta, y usa el resultado para actualizar los puntos de recorrido del guardia.

La llamada actual de `GameScene.ts` no proporciona el argumento `profileB`; por lo tanto, la escena utiliza el valor predeterminado `false`. El perfil B está implementado en el algoritmo y disponible a través de `calculateRoute`, con cobertura automatizada, pero **no está activado como opción seleccionable en la escena del juego**.

Esta limitación se registra explícitamente para no afirmar una integración visual que todavía no existe.

## 9. Registro de trabajo y decisión humana

- Se revisaron el algoritmo de búsqueda, el consumidor de simulación y las pruebas existentes.
- Se seleccionó la variante B para incorporar costos de entrada por zonas expuestas.
- Se verificaron las condiciones normales, los casos límite y la compatibilidad con BFS.
- Se incorporó una prueba de comparación reproducible entre BFS y A*.
- Se prepararon la especificación y el plan para su revisión humana.
- Se ejecutó la validación completa y se registraron los resultados.

La especificación y el plan actuales se revisan después de la implementación ya existente. Por ello, este documento no presenta esa aprobación documental como si hubiera ocurrido antes de los cambios de código.

## 10. Limitaciones y cierre

- El perfil B no tiene todavía un control propio en la interfaz del juego.
- Las métricas comparativas registradas corresponden a los escenarios de prueba documentados; no deben extrapolarse a todos los mapas.
- La advertencia de tamaño del bundle queda registrada, pero no bloquea la compilación.
- La validación automatizada pasó con 58 pruebas.
- La revisión final debe confirmar que el diff no contiene archivos temporales innecesarios, que la documentación está limpia y que el commit final se publica en `main`.

**URL del repositorio:** https://github.com/ValentinCantarrutti/GuardiadelSigilo
