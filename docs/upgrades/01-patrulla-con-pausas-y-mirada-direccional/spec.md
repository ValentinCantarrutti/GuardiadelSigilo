# H4.1 — Patrulla con pausas y mirada direccional

## Specificación

Implementar un módulo de patrulla cíclica con las siguientes características:

### Waypoints explícitos (5 puntos)

1. `{x: 1, y: 1}`
2. `{x: 1, y: 9}`
3. `{x: 10, y: 1}`
4. `{x: 20, y: 9}`
5. `{x: 27, y: 17}` = GUARD_START (waypoint inicial)

### Ciclo obligatorio

La patrulla comienza en el waypoint 5 y sigue el ciclo:

**5 → 1 → 2 → 3 → 4 → 5 → ...**

### Pausa de 1 segundo

Después de completar una ruta hacia un waypoint, la patrulla espera 1000 ms antes de comenzar hacia el siguiente waypoint en el ciclo.

### Dirección direccional

La dirección de movimiento se deriva de `PathFollowerResult.direction`. Si `direction` es `null` porque no hubo movimiento durante un frame, se conserva la última dirección válida.

### Rutas inalcanzables

Si el algoritmo A* no encuentra una ruta:

- No se teletransporta la patrulla
- No se marca la ruta como completada
- No se avanza artificialmente al siguiente waypoint

### Reglas de implementación

- Módulo aislado: `src/application/simulation/patrolState.ts`
- No modificar `src/domain/navigation/pathFollower.ts`
- No modificar `perceptionSimulation.ts`
- No modificar `labLevel.ts`
- No modificar `package.json`
- No introducir dependencias
- Sin estado global
- Configuración de waypoints explícita y separada del mapa
- Utilizar el A* existente (`findPathAStar`) para obtener la ruta completa entre waypoints
- Convertir correctamente la ruta de `GridPoint[]` a `Vector2[]`
- Consumir la ruta incrementalmente mediante `advanceAlongPath`
- Usar el resultado `completed` de `advanceAlongPath` para detectar que se terminó la ruta completa
- La pausa debe ser estado interno de la patrulla, no un `setTimeout` que deje lógica global suelta
- La patrulla debe ser independiente de H4.2, H4.3, H4.4 y H4.5

## Evidencia de validación

Ver los archivos `plan.md` y `evidencia.md` para detalles de los tests validados, build results y matriz de criterio-evidencia.