# H4.2 — Cono de visión visible y reactivo

## Specificación

Implementar la hace que el cono de visión del guardia sea claramente visible en el renderizado gráfico y reactivo a los cambios de orientación y posición.

### Antecedentes

La lógica de percepción ya existía en:
- `src/domain/perception/perception.ts` — `evaluateVision()` con detección de cono FOV, rango y oclusión
- `src/application/simulation/perceptionSimulation.ts` — `updatePerceptionSimulation()` que integra la percepción
- `src/game/scenes/GameScene.ts` — `drawPerception()` que ya dibujaba el cono usando `Phaser.GameObjects.Graphics`

### Qué H4.2 agrega

El cono de visión lógico ya existía, pero su representación visual era **casi invisible** debido a un alpha de 0.16 en el relleno. H4.2 consiste en hacer el cono **claramente visible** aumentando el alpha y asegurando que sea **reactivo** a la orientación del guardia.

### Cambio mínimo realizado

En `src/game/scenes/GameScene.ts`, línea 306: aumenté el alpha del relleno del cono de `0.16` a `0.3`, haciendo que el cono sea claramente visible en el renderizado, manteniendo la lógica de percepción sin modificaciones.

### Características de la implementación

- **Orientación reactiva**: El cono gira automáticamente cada frame basándose en `this.guardFacing`, que se actualiza en `updateGuardMovement()` cuando el guardia se mueve o cambia de dirección
- **Actualización cada frame**: `drawPerception()` se llama en el loop `update()` de Phaser, por lo que el cono siempre refleja la posición y facing actual del guardia
- **Indicador visual de estado**: El cono cambia de color según `vision.visible` — verde (`0x73c991`) cuando el jugador está dentro del cono, azul (`0x6b8afd`) cuando está fuera
- **Sin duplicar lógica de FOV**: Se reutiliza completamente `evaluateVision()` existente en `perception.ts`; H4.2 solo afecta el renderizado visual
- **Aislado de H4.1**: La mejora no toca `src/domain/`, `perceptionSimulation.ts`, `labLevel.ts` ni `package.json`

### Alcance H4.2

- ✅ Hacer cono visual claramente visible (alpha 0.16 → 0.3)
- ✅ Mantener reactividad al facing del guardia
- ✅ Sin modificar lógica de percepción domain
- ✅ Sin nuevas dependencias
- ✅ Compatibilidad con H4.1 intacta

### Fuera de alcance H4.2

- ❌ Nueva lógica de cono FOV (ya existe en `perception.ts`)
- ❌ Cambio de configuración de FOV dinámica
- ❌ Modificar `package.json` o agregar dependencias
- ❌ Cambiar H4.1
- ❌ Screenshots o evidencia visual real (no disponible en este entorno)

### Pruebas posibles (arquitectura existente)

Las pruebas existentes de percepción (`tests/perception/perception.test.ts`, 12 tests) validan la lógica subyacente. Se podrían agregar pruebas de integración que validen:

1. Que el cono se oriente correctamente cuando `guardFacing` cambia
2. Que el cono se actualice cada frame en el loop `update()`
3. Que el color del cono cambie entre visible/oculto según `vision.reason`

### Criterios de aceptación

1. El cono es claramente visible (alpha 0.3 en lugar de 0.16)
2. El cono se orienta según el facing actual del guardia cada frame
3. El color del cono cambia entre verde/azul según visibilidad
4. `npm run typecheck` pasa
5. `npm run test:run` pasa (51/51 tests)
6. `npm run build` pasa
7. `npm run validate` pasa