# H4.1 — Plan de implementación

## Estado actual del repositorio

- Repositorio clonado en `C:\recovered` con commit `d14c564 Initial commit`
- Rama `main` y remote `origin` correctos
- No se modificaron archivos `src/domain/`, `labLevel.ts`, `package.json`, `perceptionSimulation.ts`

## Componentes afectados

### Nuevo archivo

- `src/application/simulation/patrolState.ts` — Módulo de estado de patrulla (219 líneas)

### Nuevos tests

- `tests/application/patrolState.test.ts` — 12 tests validados

## Decisiones de diseño

1. **Waypoints explícitos**: Los 5 waypoints están definidos como constantes `GridPoint[]`, separados del mapa del nivel.

2. **Ciclo 5→1→2→3→4→5**: El índice del waypoint actual avanza usando `(currentIndex + 1) % 5`.

3. **Pausa interna**: El estado de pausa se maneja con un acumulador de milisegundos dentro del módulo `patrolState`, sin usar `setTimeout` global.

4. **Dirección conservada**: Cuando `advanceAlongPath` devuelve `direction: null`, se conserva la última dirección válida en `lastValidDirection`.

5. **Rutas inalcanzables**: Si `findPathAStar` retorna `status !== "success"`, la ruta se descarta y el estado permanece unchanged (sin teletransporte, sin marcar como completado).

## Orden de ejecución

1. Crear `patrolState.ts` con la lógica de estado
2. Crear `patrolState.test.ts` con tests unitarios
3. Validar con `npm run typecheck`, `npm run test:run`, `npm run build`
4. Generar documentación en `docs/upgrades/01-patrulla-con-pausas-y-mirada-direccional/`

## Riesgos identificados

- TypeScript type inference para `GridPoint` en llamadas a `findPathAStar` — requiere `as GridPoint` en 5 lugares
- El comportamiento de pausa debe probarse exhaustivamente en condiciones de borde
- El manejo de rutas inalcanzables debe probarse con mapas que realmente bloqueen todos los paths