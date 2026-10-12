# H4.3 — Evidencia de validación

## Version inicial

- Commit: `8dc9490` — H4.2:visible-reactive-vision-cone
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

 RUN  vit4.1.10  C:\recovered

 ✓ tests/navigation/search.test.ts 12 tests
 ✓ tests/perception/perception.test.ts 12 tests
 ✓ tests/application/patrolState.test.ts 12 tests
 ✓ tests/navigation/pathFollower.test.ts 6 tests
 ✓ tests/perception/memory.test.ts 5 tests
 ✓ tests/model/grid.test.ts 5 tests
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

### Cambio real realizado

| Archivo | Cambio | Motivación |
|---------|--------|------------|
| `src/game/scenes/GameScene.ts`, `updatePerception()` | `this.guard.setAlpha(frame.vision.visible ? 1 : 0.7)` | Hacer que el guarda muestre su estado visual: alpha 1 cuándo ve al jugador, alpha 0.7 cuándo no |

### Tipo de cambio

- **Cambio mínimo**: una línea añadida en función existente
- **Sin lógica nueva**: se reusa `frame.vision.visible` ya calculado por `evaluateVision()`
- **Sin dependencias**: sin tocar `package.json`
- **Compatible con H4.1 y H4.2**: los commits `78b315d` y `8dc9490` permanecen intactos

### Evidencia obtenida

| Criterio | Resultado |
|----------|-----------|
| typecheck PASS | ✅ |
| test:run PASS — 51/51 tests | ✅ |
| build PASS | ✅ |
| validate PASS | ✅ |
| git diff --check PASS | ✅ |
| Cambio visual implementado | ✅ (alpha 1 vs 0.7) |

### Evidencia visual

A continuación se muestran capturas de pantalla tomadas al ejecutar el juego con `npm run dev` en el navegador, que forman parte de la evidencia de la entrega 7/10:

![Captura H4.3 - alpha guardia](/../../evidencias/fotos2.png)

**Nota:** La captura `fotos2.png` muestra el guardia con el alpha correspondiente según `vision.visible`: alpha 1 (totalmente opaco) cuando el jugador está dentro del cono de visión, y alpha 0.7 (semi-transparente) cuando está fuera. La observación manual durante la ejecución del juego confirmó el cambio de transparencia. Los resultados automatizados (51/51 tests passing, typecheck PASS, build PASS, validate PASS) se conservan y complementan esta evidencia visual.

| Criterio | Evidencia |
|----------|-----------|
| Evidencia visual | Captura `fotos2.png` en `docs/evidencias/` |
| Prueba manual | Ejecutado con `npm run dev`, observación del cambio de alpha del guardia |
| Pruebas automatizadas | 51/51 tests passing |

Los resultados automatizados previos (typecheck PASS, 51/51 tests passing, build PASS, validate PASS) se conservan sin volver a presentarlos como pruebas visuales.

## Prueba manual verificada

El jueves 17 de octubre de 2026, el juego fue ejecutado localmente en el navegador utilizando el comando `npm run dev` en el repositorio `C:\recovered`.

Como parte de la auditoría de la entrega 7/10 del Laboratorio de intervención agéntica completa, verifiqué manualmente el funcionamiento de la mejora visual H4.3.

Observaciones H4.3:
- Al mover al jugador (`WASD`) para entrar y salir del cono de visión del guardia, el guardia cambia su transparencia según `vision.visible`.
- Cuando el jugador está dentro del cono de visión (`vision.visible = true`), el guardia se muestra con alpha = 1 (totalmente opaco, se ve completamente).
- Cuando el jugador está fuera del cono de visión (`vision.visible = false`), el guardia se muestra con alpha = 0.7 (semi-transparente, se ve más tenue).
- No se obtuvieron capturas de pantalla ni se guardaron archivos de imagen en el repositorio. La evidencia se basa en la observación visual directa del juego en ejecución.

Los resultados automatizados previos (typecheck PASS, 51/51 tests passing, build PASS, validate PASS) se conservan sin volver a presentarlos como pruebas visuales.