# H4.5 — Cámara dinámica de tensión

## Specificación

### Objetivo

Implementar un efecto de zoom dinámico sutil en la cámara del juego cuándo el guardia detecta al jugador (`vision.visible === true`), utilizando la señal existente `frame.vision.visible` sin crear nueva lógica de comportamiento ni modificar el dominio.

### Cambio implementado

En `src/game/scenes/GameScene.ts`, se agregó una sola línea en la función `updatePerception()` después de los cambios H4.4:

```
this.cameras.main.setZoom(frame.vision.visible ? 1.1 : 1.0);
```

Este cambio hace lo siguiente:
- **Cuando `vision.visible` es true**: la cámara aplica un zoom de 1.1 (10% de aumento), proporcionando retroalimentación visual sutil de que el guardia tiene línea de visión directa al jugador.
- **Cuando `vision.visible` es false**: la cámara retorna a zoom 1.0 (normal), sin efecto de tensión.

### Alcance

- ✅ Efecto visual mínimo (una línea de código + comentario)
- ✅ Usa señal existente `frame.vision.visible` (ya calculada por `evaluateVision()`)
- ✅ Sin modificar lógica de comportamiento (`perception.ts`, `perceptionSimulation.ts`)
- ✅ Sin modificar H4.1, H4.2, H4.3, H4.4
- ✅ Sin nuevas dependencias
- ✅ 51/51 tests passing
- ✅ typecheck, build, validate: todos PASSED

### Fuera de alcance

- ❌ `shake()` u otros efectos de sacudida de cámara
- ❌ Nueva máquina de estados formal
- ❌ Nuevos estados de comportamiento
- ❌ Modificar `package.json` o agregar dependencias
- ❌ Cambiar lógica de percepción o domain
- ❌ Capturas de pantalla artificiales