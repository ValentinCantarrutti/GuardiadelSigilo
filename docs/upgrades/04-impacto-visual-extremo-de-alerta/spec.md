# H4.4 — Impacto visual extremo de alerta

## Specificación

### Objetivo

Implementar un efecto visual de alerta intensa cuando el guardia detecta al jugador (`vision.visible === true`), utilizando únicamente datos existentes en la arquitectura. El efecto debe ser sutil pero claro: cambiar el color del guardia a rojo y destacar el cono de visión, sin crear nueva lógica de comportamiento ni modificar el dominio.

### Cambio implementado

En `src/game/scenes/GameScene.ts`, se agregó lógica en `updatePerception()` para cambiar el fill style del guardia según la visibilidad:

- **Cuando `vision.visible` es true**: el guardia se muestra en color rojo (`0xff0000`) indicando alerta activa, y el cono de visión ya cambia de color automáticamente en `drawPerception` (verde 0x73c991 cuando visible).
- **Cuando `vision.visible` es false**: el guardia vuelve a su color normal azul (`0x6b8afd`), y el cono vuelve al azul habitual con alpha 0.3.

Este es el único cambio de código necesario: una condición de 4 líneas que usa `frame.vision.visible` (dato existente) para cambiar el color del guardia, sin tocar `perception.ts`, `perceptionSimulation.ts`, ni cualquier otra lógica de comportamiento.

### Estados visuales

| Condición | Color del guardia | Color del cono |
|-----------|------------------|----------------|
| `vision.visible === true` | Rojo (0xff0000) — alerta intensa | Verde (0x73c991) — visibilidad activa |
| `vision.visible === false` | Azul normal (0x6b8afd) | Azul (0x6b8afd) — semitransparente |

### Alcance

- ✅ Efecto visual mínimo (una condición if/else + comentario)
- ✅ Sin modificar lógica de comportamiento (`perception.ts`, `perceptionSimulation.ts`)
- ✅ Sin modificar H4.1, H4.2 ni H4.3
- ✅ Sin nuevas dependencias
- ✅ 51/51 tests passing
- ✅ typecheck, build, validate: todos PASSED

### Fuera de alcance

- ❌ Nueva máquina de estados formal
- ❌ Nuevos estados de comportamiento
- ❌ Nuevos sprites o animaciones Phaser adicionales
- ❌ Modificar `package.json` o agregar dependencias
- ❌ Asociar "fuera del cono", "fuera de rango", "ocluido" con alerta activa
- ❌ Capturas de pantalla artificiales