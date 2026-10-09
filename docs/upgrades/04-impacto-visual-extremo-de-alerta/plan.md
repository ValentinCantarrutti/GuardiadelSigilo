# H4.4 — Plan de implementación

## Diagnóstico

- H4.1 cerrado en `78b315d` (patrulla con pausas y mirada direccional)
- H4.2 cerrado en `8dc9490` (cono de visión visible y reactivo)
- H4.3 cerrado en `58ea4a2` (animaciones por estado y transición)
- Repositorio limpio con commits validados
- Los datos de percepción ya existen completamente: `frame.vision.visible`, `frame.vision.reason`, `frame.state.soundEvent`

## Objetivo de H4.4

Implementar un efecto visual de alerta intensa en la capa visual (`GameScene.ts`) cuándo el guardia ve al jugador, usando únicamente la señal `vision.visible` que ya existe en el resultado de percepción.

## Solución identificada

### Cambio realizado

Archivo: `src/game/scenes/GameScene.ts`, función `updatePerception()`, despúes de `this.drawPerception(frame.vision)`:

```typescript
// H4.4: Efecto visual de alerta intensa cuándo el guardia ve al jugador
if (frame.vision.visible) {
  this.guard.setFillStyle(0xff0000);
} else {
  this.guard.setFillStyle(0x6b8afd);
}
```

### Impacto

- **Lógica domain**: Sin cambios (se reusa `frame.vision.visible` ya calculado por `evaluateVision()`)
- **Arquitectura**: Sin cambios (mantenimiento de separación domain/application/engine)
- **Tests**: 51/51 tests pasan (no se requieren nuevos tests para este cambio visual)
- **Build**: Vite build exitoso sin errores
- **H4.1, H4.2, H4.3**: Intactos en sus commits respectivos

### Orden de ejecución

1. Confirmar que `frame.vision.visible` está disponible después de `updatePerceptionSimulation()` y `drawPerception()`
2. Agregar una condición if/else para cambiar el fill style del guardia
3. Validar que typecheck, test:run, build y validate sigan pasando
4. Documentar el cambio en spec.md, plan.md y evidencia.md

### Riesgos

- Bajo riesgo: condición aislada de una sola línea en archivo de renderizado
- Compatibilidad: total retrocompatibilidad (color rojo = alerta, color azul = normal)
- Tests: los 51 tests existentes siguen pasando sin modificaciones

### Archivos modificados

- `src/game/scenes/GameScene.ts` — una condición if/else añadida en `updatePerception()`

### Archivos sin modificar (por regla H4.4)

- `src/domain/navigation/pathFollower.ts`
- `perceptionSimulation.ts`
- `labLevel.ts`
- `perception.ts`
- `package.json`

### Resultado final

- Guardia rojo cuándo ve al jugador (`vision.visible === true`)
- Guardia azul normal cuándo no ve al jugador (`vision.visible === false`)
- Cono de visión ya cambia color automáticamente en `drawPerception` según visibilidad
- 51/51 tests passing
- typecheck, build, validate: todos PASSED
- H4.1, H4.2, H4.3 preservados en sus commits