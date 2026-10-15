# Especificación — Práctica de navegación

## 1. Objetivo

Comparar BFS y A* sobre un mapa de cuadrícula y adaptar la navegación para preferir rutas que eviten zonas expuestas, sin convertir esas zonas en obstáculos ni modificar el sistema de percepción del guardia.

## 2. Alcance

- Verificar el contrato existente de búsqueda de caminos.
- Comparar BFS y A* en un escenario controlado.
- Documentar conceptualmente DFS y Dijkstra, sin implementarlos.
- Incorporar el perfil B mediante el consumidor de navegación existente.
- Agregar pruebas normales, casos límite y pruebas del consumidor.
- Registrar validación, cambios, evidencia y limitaciones.

Quedan fuera de alcance las modificaciones de la máquina de estados, la percepción, la memoria del guardia, los sensores, las dependencias y la publicación automática.

## 3. Decisión humana

Se elige la **variante B: evitar zonas expuestas**.

La máscara de exposición es fija y contiene las celdas `(1,1)`, `(2,1)` y `(3,1)`. Entrar en una celda expuesta cuesta 5; entrar en una celda normal cuesta 1. La celda inicial no suma costo.

Las zonas expuestas son una preferencia de navegación, no obstáculos. El perfil no consulta si el jugador está oculto ni modifica la percepción o la memoria.

La decisión se limita al costo de las celdas recorridas. No se incorporan sensores dinámicos ni cambios en la máquina de estados.

## 4. Contrato de navegación

- El mapa se representa mediante una cuadrícula.
- El origen de coordenadas está en la esquina superior izquierda.
- Solo se permiten movimientos cardinales; no hay diagonales.
- El camino incluye el inicio y el objetivo.
- La cantidad de pasos corresponde a las aristas recorridas, no a la cantidad de puntos del camino.
- BFS conserva su comportamiento de búsqueda por cantidad de pasos.
- A* utiliza distancia Manhattan y el costo mínimo de entrada de una celda es 1.
- Los extremos inválidos deben producir el resultado definido por el contrato existente.
- Si el inicio coincide con el objetivo, el costo es 0.
- Si no existe una ruta, el resultado debe indicar que no se encontró camino.

## 5. Fixture común BFS/A*

Se utiliza una cuadrícula de `5 × 3`, con todas las celdas libres y costo unitario.

- Inicio: `S = (0,1)`.
- Objetivo: `G = (4,1)`.
- Movimientos: arriba, abajo, izquierda y derecha.

En este escenario, la ruta directa tiene 4 pasos y costo 4. La ruta exacta y las métricas de exploración se registrarán según los resultados reales de ejecución; no se inferirán métricas que la implementación no exponga.

## 6. Casos límite

1. **Ruta válida:** inicio y objetivo distintos, conectados por celdas transitables.
2. **Inicio igual al objetivo:** camino de un solo punto, cero pasos y costo cero.
3. **Objetivo inaccesible:** bloquear `(2,0)`, `(2,1)` y `(2,2)` manteniendo libre el objetivo.
4. **Inicio inválido:** `(-1,1)`.
5. **Objetivo inválido:** `(5,1)`.

Cada caso debe contrastarse con el contrato real del repositorio y las pruebas existentes.

## 7. Variante B: criterios de aceptación

### B-AC1 — Preferencia por rutas seguras

En el fixture abierto, A* con perfil B debe evitar las celdas expuestas. Se espera una ruta de 6 pasos y costo ponderado 6, en lugar de la ruta directa de 4 pasos y costo ponderado 16.

### B-AC2 — Perfil desactivado

Con el perfil desactivado, A* debe conservar la ruta directa de 4 pasos y costo 4. Las celdas expuestas siguen siendo transitables.

### B-AC3 — Integración y regresión

La simulación debe poder calcular rutas con el perfil configurado sin incorporar una nueva máquina de estados ni modificar percepción o memoria. BFS debe conservar su comportamiento original.

## 8. Comparaciones conceptuales

### DFS

Grafo dirigido de ejemplo, con vecinos en el orden indicado:

- `S: [A,B]`
- `A: [C]`
- `C: [X]`
- `X: [G]`
- `B: [D,E]`
- `D: [G]`
- `E: []`
- `G: []`

DFS apila los vecinos en orden inverso para visitar primero el primero de la lista. La traza esperada hasta encontrar el objetivo es `S → A → C → X → G`, con 4 pasos. BFS puede encontrar `S → B → D → G`, con 3 pasos. DFS no garantiza la ruta con menos pasos.

### Dijkstra

Aristas y costos:

- `S → A = 1`
- `A → G = 9`
- `S → B = 3`
- `B → G = 3`

Dijkstra obtiene inicialmente `A=1` y `B=3`. Al procesar A, asigna provisionalmente `G=10`; al procesar B, mejora el costo de G a 6. La ruta final es `S → B → G`, costo 6.

Ambas rutas tienen dos acciones, pero costos diferentes. BFS prioriza la cantidad de pasos y no reemplaza a Dijkstra en grafos con costos variables.

## 9. Verificación

Comando principal:

```bat
npm run validate
```

Este comando ejecuta el chequeo de tipos, las pruebas y la compilación de producción. Los resultados definitivos deben registrarse en `evidencia.md` después de la última modificación.

## 10. Limitaciones

El perfil B utiliza una máscara fija y costos estáticos. No representa detección real, cambios de visibilidad ni conocimiento del guardia. Las métricas se documentarán únicamente cuando estén disponibles en los resultados reales de la implementación.

La aprobación de esta especificación y de su plan corresponde a la persona responsable del proyecto antes de considerar definitiva la implementación.

## 11. Criterios comunes de aceptación

- **BASE-01 — Contrato:** quedan definidos el mapa, las coordenadas, los movimientos permitidos y el formato del resultado.
- **BASE-02 — Comparación:** BFS y A* se contrastan con el mismo mapa, inicio y objetivo. Las rutas y métricas se registran únicamente cuando se obtienen de una ejecución verificable.
- **BASE-03 — Algoritmos:** se documentan las diferencias entre BFS, A*, DFS y Dijkstra, sin afirmar que DFS o Dijkstra están implementados.
- **BASE-04 — Casos límite:** se verifican ruta válida, inicio igual al objetivo, objetivo inaccesible y extremos inválidos.
- **BASE-05 — Decisión humana:** la variante B se selecciona explícitamente y las zonas expuestas son preferencias de costo, no obstáculos.
- **BASE-06 — Revisión de cambios:** se revisa el diff para detectar modificaciones fuera del alcance, regresiones o cambios no autorizados.
- **BASE-07 — Validación reproducible:** se ejecuta `npm run validate` y se registran los resultados reales.
- **BASE-08 — Entrega:** se registran repositorio, rama, commit final y limitaciones pendientes.

### Estado de aceptación

BASE-01: documentado; requiere revisión final del contrato.  
BASE-02: parcial; falta adjuntar una comparación independiente de las rutas BFS y A*.  
BASE-03: documentado conceptualmente.  
BASE-04: cubierto por pruebas existentes; confirmar los casos contra la salida de la suite.  
BASE-05: decisión de variante B documentada.  
BASE-06: requiere revisión final del diff.  
BASE-07: validación ejecutada con 57 pruebas aprobadas y compilación exitosa.  
BASE-08: registrar el hash del commit definitivo después de cerrar los cambios.

Estos estados no sustituyen la revisión humana ni implican que una comprobación pendiente ya se haya realizado.