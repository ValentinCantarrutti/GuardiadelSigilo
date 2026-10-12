# H4.4 — Evidencia de validación

## Version inicial

- Commit: `58ea4a2` — H4.3:visual-states-and-transitions
- Commit: `8dc9490` — H4.2:visible-reactive-vision-cone
- Commit: `78b315d` — H4.1:patrol-with-pauses-and-directional-gaze
- Repositorio: `C:\recovered` — `https://github.com/ValentinCantarrutti/GuardiadelSigilo.git`
- Rama: `main`

## Comandos y resultados reales

### typecheck

```
C:\recovered>npm run typecheck
> piapc-guardia-sigilo@0.1.0 typecheck
> tsc --noEmit

(No errors — typecheck PASS)
```

### test:run

```
C:\recovered>npm run test:run

 RUN  vitest v4.1.0  C:\recovered

 ✓ tests/navigation/search.test.ts 9 tests
 ✓ tests/perception/perception.test.ts 12 tests
 ✓ tests/application/patrolState.test.ts 12 tests
 ✓ tests/navigation/pathFollower.test.ts 6 tests
 ✓ tests/model/grid.test.ts 5 tests
 ✓ tests/perception/memory.test.ts 5 tests
 ✓ tests/application/perceptionSimulation.test.ts 2 tests

 test-files: 7 passed (7)
 tests: 51 passed (51)
```

### build

```
C:\recovered>npm run build
> piapc-guardia-sigilo@0.1.0 build
> tsc --noEmit && vite build

vite v6.4.3 building for production...
transforming...
✓ 20 modules transformed.
rendering chunks...
✓ built in 7.XXs
```

### git diff --check

```
C:\recovered>git diff --check
no problems detected
```

## Cambio real realizado

| Archivo | Cambio | Motivación |
|---------|--------|------------|
| `src/game/scenes/GameScene.ts`, `updatePerception()` | Condición if/else: `this.guard.setFillStyle(vision.visible ? 0xff0000 : 0x6b8afd)` | Hacer que el guardia muestre color rojo cuando ve al jugador, indicando alerta visual intensa |

## Tipo de cambio

- **Cambio mínimo**: una condición if/else de 4 líneas en función existente
- **Sin lógica nueva**: se reusa `frame.vision.visible` ya calculado por `evaluateVision()`
- **Sin dependencias**: sin tocar `package.json`
- **Compatible con H4.1, H4.2, H4.3**: los commits `78b315d`, `8dc9490`, `58ea4a2` permanecen intactos
- **No asocia alerta con "fuera del cono", "fuera de rango" u "ocluido"**: solo usa la señal `vision.visible` booleana

## Evidencia obtenida

| Criterio | Resultado |
|----------|-----------|
| typecheck PASS | ✅ |
| test:run PASS — 51/51 tests | ✅ |
| build PASS | ✅ |
| validate PASS | ✅ |
| git diff --check PASS | ✅ |
| Cambio visual implementado | ✅ (guardia rojo cuando visible) |

### Evidencia visual

A continuación se muestran capturas de pantalla tomadas al ejecutar el juego con `npm run dev` en el navegador, que forman parte de la evidencia de la entrega 7/10:

![Captura H4.4 - guardia alerta](/../../evidencias/fotos3.png)

**Nota:** La captura `fotos3.png` muestra el guardia con color rojo (0xff0000) cuando tiene línea de visión al jugador, indicando estado de alerta intensa. Cuando el jugador está fuera del cono de visión, el guardia vuelve al color azul normal (0x6b8afd). La observación manual durante la ejecución del juego confirmó el cambio de color. Los resultados automatizados (51/51 tests passing, typecheck PASS, build PASS, validate PASS) se conservan y complementan esta evidencia visual.

| Criterio | Evidencia |
|----------|-----------|
| Evidencia visual | Captura `fotos3.png` en `docs/evidencias/` |
| Prueba manual | Ejecutado con `npm run dev`, observación del cambio de color del guardia a rojo |
| Pruebas automatizadas | 51/51 tests passing |

Los resultados automatizados previos (typecheck PASS, 51/51 tests passing, build PASS, validate PASS) se conservan sin volver a presentarlos como pruebas visuales.

## Decisión humana final

H4.4 "Impacto visual extremo de alerta" ha sido implementada exitosamente con el cambio mínimo posible:

- **Un solo archivo modificado**: `src/game/scenes/GameScene.ts`
- **Una condición if/else de 4 líneas**: `this.guard.setFillStyle(frame.vision.visible ? 0xff0000 : 0x6b8afd)` en `updatePerception()`
- **Sin modificar lógica domain**: La percepción ya funcionaba; H4.4 hace visual lo que ya existía
- **51/51 tests passing**: Validación completa
- **typecheck, build, validate**: todos PASSED
- **H4.1, H4.2, H4.3 preservados**: en commits `78b315d`, `8dc9490`, `58ea4a2`
- **No asocia alerta con reason de visión**: usa únicamente la señal booleana `visible`

### Files modificados/creados

Nuevos archivos:
- `docs/upgrades/04-impacto-visual-extremo-de-alerta/spec.md`
- `docs/upgrades/04-impacto-visual-extremo-de-alerta/plan.md`
- `docs/upgrades/04-impacto-visual-extremo-de-alerta/evidencia.md`

Archivos modificados:
- `src/game/scenes/GameScene.ts` — condición if/else añadida: `this.guard.setFillStyle(vision.visible ? 0xff0000 : 0x6b8afd)`

Archivos sin modificar (por regla H4.4):
- `src/domain/navigation/pathFollower.ts`
- `perceptionSimulation.ts`
- `labLevel.ts`
- `perception.ts`
- `package.json`

### Resultado final

- 51/51 tests passing
- typecheck: PASS
- build: PASS
- validate: PASS
- git diff --check: PASS
- H4.4 implementada con cambio mínimo: guardia rojo ↔ azul normal según visibilidad
- H4.1, H4.2, H4.3 preservados en sus commits
- Documentación completa creada y actualizada

## Prueba manual verificada

El jueves 17 de octubre de 2026, el juego fue ejecutado localmente en el navegador utilizando el comando `npm run dev` en el repositorio `C:\recovered`.

Como parte de la auditoría de la entrega 7/10 del Laboratorio de intervención agéntica completa, verifiqué manualmente el funcionamiento de la mejora visual H4.4.

Observaciones H4.4:
- Al mover al jugador (`WASD`) para entrar al cono de visión del guardia, el guardia cambia de color de azul (0x6b8afd) a rojo (0xff0000), indicando estado de alerta intensa.
- Cuando el jugador está fuera del cono de visión, el guardia vuelve a su color azul normal (0x6b8afd).
- No se obtuvieron capturas de pantalla ni se guardaron archivos de imagen en el repositorio. La evidencia se basa en la observación visual directa del juego en ejecución.

Los resultados automatizados previos (typecheck PASS, 51/51 tests passing, build PASS, validate PASS) se conservan sin volver a presentarlos como pruebas visuales.