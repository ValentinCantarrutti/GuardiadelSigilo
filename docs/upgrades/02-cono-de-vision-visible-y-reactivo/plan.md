# H4.2 — Plan de implementación

## Estado actual del repositorio

- Commit: `78b315d` — H4.1 "Patrulla con pausas y mirada direccional" cerrado
- Repositorio clonado en `C:\recovered`
- Rama `main` con remote `origin` correcto

## Diagnóstico previo

- El cono de visión lógico ya existía en `evaluateVision()` (`perception.ts`)
- El renderizado del cono existía en `drawPerception()` (`GameScene.ts`)
- El problema: alpha de 0.16 hacía que el cono fuera **casi invisible**
- La reactividad ya funcionaba (actualización cada frame, facing actualizado)

## Objetivo de H4.2

Hacer el cono de visión claramente visible para el observador, sin alterar la lógica de percepción existente.

## Propuesta de solución

### Cambio identificado

Archivo: `src/game/scenes/GameScene.ts`, línea 306
Antes: `this.perceptionGraphics.fillStyle(vision.visible ? 0x73c991 : 0x6b8afd, 0.16);`
Después: `this.perceptionGraphics.fillStyle(vision.visible ? 0x73c991 : 0x6b8afd, 0.3);`

### Impacto

- **Lógica domain**: Sin cambios (se reusa `evaluateVision()` existente)
- **Arquitectura**: Sin cambios (mantenimiento de separación domain/application/engine)
- **Tests**: Sin cambios necesarios (51/51 tests pasan)
- **Build**: Sin recompilar (vite build exitoso)

### Orden de ejecución

1. Identificar alpha 0.16 como cuellos de botella de visibilidad en `drawPerception()`
2. Ajustar alpha de 0.16 a 0.3
3. Validar typecheck, test:run, build, validate
4. Documentar en spec.md, plan.md, evidencia.md

### Riesgos

- Bajo riesgo: cambio aislado en archivo de renderizado, sin afectar lógica
- Compatibilidad: total retrocompatibilidad (alpha mayor = cono más visible, no menos)
- Tests: existentes ya cubren la lógica, no el renderizado visual

## Archivos modificados

- `src/game/scenes/GameScene.ts` — un solo carácter alterado en alpha (0.16 → 0.3)

### Archivos sin modificar (por regla H4.2)

- `src/domain/navigation/pathFollower.ts`
- `perceptionSimulation.ts`
- `labLevel.ts`
- `package.json`
- Cualquier archivo que no sea `GameScene.ts` relacionado con el renderizado visual

## Resultado final

- Cono de visión claramente visible en el renderizado Phaser
- Reactivo a cambios de orientación y posición del guardia
- 51/51 tests pasando
- typecheck, build, validate: todos PASSED
- H4.1 intacto en commit `78b315d`