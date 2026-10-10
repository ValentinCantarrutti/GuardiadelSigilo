# H4.5 — Plan de implementación

## Diagnóstico

- H4.1 cerrado en `78b315d` (patrulla con pausas y mirada direccional)
- H4.2 cerrado en `8dc9490` (cono de visión visible y reactivo)
- H4.3 cerrado en `58ea4a2` (animaciones por estado y transición)
- H4.4 cerrado en `c90a61d` (impacto visual extremo de alerta)
- Repositorio limpio con commits validados
- La cámara usa configuración por defecto de Phaser, sin zoom ni efectos configurados

## Objetivo de H4.5

Implementar un efecto de zoom dinámico de tensión en la capa visual (`GameScene.ts`) cuándo el guardia ve al jugador, usando la señal `frame.vision.visible` que ya existe en el resultado de percepción.

## Solución identificada

### Cambio realizado

Archivo: `src/game/scenes/GameScene.ts`, función `updatePerception()`, después de la lógica H4.4:

```typescript
// H4.5: Zoom dinámico de tensión cuándo el guardia ve al jugador
this.cameras.main.setZoom(frame.vision.visible ? 1.1 : 1.0);
```

### Impacto

- **Lógica domain**: Sin cambios (se reusa `frame.vision.visible` ya calculado por `evaluateVision()`)
- **Arquitectura**: Sin cambios (mantenimiento de separación domain/application/engine)
- **Tests**: 51/51 tests pasan (cambio visual puramente en la capa de renderizado)
- **Build**: Vite build exitoso sin errores
- **H4.1–H4.4**: Intactos en sus commits respectivos

### Orden de ejecución

1. Confirmar que `frame.vision.visible` está disponible después de `drawPerception()` y H4.4
2. Agregar `this.cameras.main.setZoom(frame.vision.visible ? 1.1 : 1.0)` en `updatePerception()`
3. Validar que typecheck, test:run, build y validate sigan pasando
4. Documentar el cambio en spec.md, plan.md y evidencia.md

### Riesgos

- Bajo riesgo: llamada a `setZoom()` existente en Phaser, parámetros fijos (1.0 y 1.1)
- Compatibilidad: total retrocompatibilidad (zoom 1.1 = tensión, zoom 1.0 = normal)
- Tests: los 51 tests existentes siguen pasando sin modificaciones
- HUD: sin afectar — el HUD está en capas superiores y no se escala con el zoom de cámara en esta configuración

### Archivos modificados

- `src/game/scenes/GameScene.ts` — una línea añadida en `updatePerception()`

### Archivos sin modificar (por regla H4.5)

- `src/domain/navigation/pathFollower.ts`
- `perceptionSimulation.ts`
- `labLevel.ts`
- `perception.ts`
- `package.json`

### Resultado final

- Cámara zoom 1.1× cuándo el guardia ve al jugador (`vision.visible === true`)
- Cámara zoom 1.0× cuándo el guardia no ve al jugador (`vision.visible === false`)
- Efecto sutil sin sacudidas (`shake`), usando zoom escalado
- 51/51 tests passing
- typecheck, build, validate: todos PASSED
- H4.1, H4.2, H4.3, H4.4 preservados en sus commits

### Plugins futuros (no implementados en esta versión)

- Zoom adaptativo basado en la razón de visión (out-of-range, outside-cone, etc.)
- Transiciones suaves de zoom con animación
- Vignette o efecto de oscurecimiento perimetral cuándo hay tensión