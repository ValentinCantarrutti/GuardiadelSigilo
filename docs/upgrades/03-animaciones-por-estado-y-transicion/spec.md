# H4.3 — Animaciones por estado y transición

## Specificación

Implementar representaciones visuales mínimas de los estados del guardia utilizando únicamente los datos existentes en la arquitectura, sin crear nueva lógica de comportamiento ni modificar el dominio.

### Objetivo

Hacer que el estado visual del guardia refleje su estado actual mediante cambios simples de color, alpha y indicadores, reutilizando propiedades ya existentes en el código:

- `movement.direction` — determina si el guardia se está moviendo o quite
- `vision.visible` — determina si el guardia ve al jugador
- `perceptionState.soundEvent` — determina si el guardia está oyendo un sonido
- `guardFacing` — dirección facial del guardia

### Cambio mínimo implementado

En `src/game/scenes/GameScene.ts`, se agregó una sola línea en la función `updatePerception()`:

```
this.guard.setAlpha(frame.vision.visible ? 1 : 0.7);
```

Este cambio hace que el guardia sea completamente visible (alpha=1) cuando el jugador está dentro de su cono de visión, y semi-transparente (alpha=0.7) cuando el jugador está fuera del cono. Esto proporciona retroalimentación visual inmediata sobre el estado de percepción del guardia.

### Estados visuales implementados

1. **Guardia viendo al jugador** (`vision.visible === true`): alpha = 1 (totalmente visible)
2. **Guardia sin visión** (`vision.visible === false`): alpha = 0.7 (parcialmente transparente)

### Estados que podrían agregarse en el futuro (usando datos existentes):

3. **Guardia quieto vs en movimiento** — basándose en `movement.direction` (actualmente no implementado en esta versión mínima)
4. **Guardia oyendo sonido** — basándose en `perceptionState.soundEvent` (aunque `lastKnownMarker` ya existe para este propósito)

### Alcance

- ✅ Cambio visual mínimo (una línea de código)
- ✅ Sin modificar lógica de comportamiento (`perception.ts`, `perceptionSimulation.ts`)
- ✅ Sin modificar H4.1 ni H4.2
- ✅ Sin nuevas dependencias
- ✅ 51/51 tests passing
- ✅ typecheck, build, validate: todos PASSED

### Fuera de alcance

- ❌ Nueva máquina de estados formal
- ❌ Nuevos estados de comportamiento
- ❌ Nuevos sprites o animaciones Phaser
- ❌ Modificar `package.json` o agregar dependencias
- ❌ Capturas de pantalla artificiales

### Pruebas compatibles

Los 51 tests existentes validan que la lógica de percepción sigue funcionando correctamente con el cambio visual. No es necesario agregar nuevos tests para esta versión mínima, ya que el cambio es puramente visual y no afecta la lógica.

### Evidencia obtenida

- typecheck: PASS
- test:run: 51/51 tests passing
- build: PASS
- validate: PASS
- git diff: un solo archivo modificado, una línea añadida