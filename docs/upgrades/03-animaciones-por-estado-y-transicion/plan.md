# H4.3 — Plan de implementación

## Diagnóstico

- H4.1 cerrado en `78b315d` (patrulla con pausas y mirada direccional)
- H4.2 cerrado en `8dc9490` (cono de visión visible y reactivo)
- Repositorio limpio sin commits pendientes
- La lógica de percepción ya existe completamente en `src/domain/perception/perception.ts`

## Objetivo de H4.3

Implementar representaciones visuales mínimas de los estados del guardia en la capa visual (`GameScene.ts`), reutilizando datos existentes sin crear nueva lógica de comportamiento.

## Solución identificada

### Cambio realizado

Archivo: `src/game/scenes/GameScene.ts`, función `updatePerception()`, línea después de `this.drawPerception(frame.vision)`:

```
this.guard.setAlpha(frame.vision.visible ? 1 : 0.7);
```

### Impacto

- **Lógica domain**: Sin cambios (se reusa `evaluateVision()` existente)
- **Arquitectura**: Sin cambios (mantenimiento de separación domain/application/engine)
- **Tests**: 51/51 tests pasan (no se requieren nuevos tests para este cambio visual)
- **Build**: Vite build exitoso sin errores
- **H4.1 y H4.2**: Intactos en sus commits respectivos

### Orden de ejecución

1. Identificar que `GameScene.updatePerception()` ya tenía acceso a `frame.vision.visible`
2. Agregar una línea para cambiar el alpha del guardia basado en la visibilidad
3. Validar que typecheck, test:run, build y validate sigan pasando
4. Documentar el cambio en spec.md, plan.md y evidencia.md

### Riesgos

- Bajo riesgo: cambio aislado de una sola línea en archivo de renderizado
- Compatibilidad: total retrocompatibilidad (alpha mayor = más visible, alpha menor = más transparente)
- Tests: los 51 tests existentes siguen pasando sin modificaciones

### Archivos modificados

- `src/game/scenes/GameScene.ts` — una sola línea añadida

### Archivos sin modificar (por regla H4.3)

- `src/domain/navigation/pathFollower.ts`
- `perceptionSimulation.ts`
- `labLevel.ts`
- `perception.ts`
- `package.json`

### Resultado final

- Alpha del guardia cambia automáticamente según visibilidad del jugador
- 51/51 tests passing
- typecheck, build, validate: todos PASSED
- H4.1 e H4.2 intactos en sus commits respectivos
- Documentación completa creada