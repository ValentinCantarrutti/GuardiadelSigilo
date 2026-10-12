# H4.2 — Evidencia de validación

## Version inicial

- Commit: `78b315d` — H4.1 "Patrulla con pausas y mirada direccional"
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

 ✓ tests/perception/perception.test.ts 12 tests
 ✓ tests/navigation/search.test.ts 9 tests
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

### Evidencia de los criterios de aceptación

| Criterio | Resultado |
|----------|-----------|
| typecheck PASS | ✅ Pasó sin errores |
| test:run PASS — 51/51 tests | ✅ Todas las pruebas pasan |
| build PASS | ✅ Vite build exitoso |
| validate PASS | ✅ Los tres pasos concatenados pasan |
| git diff --check PASS | ✅ Sin problemas de formato |
| Cambio mínimo H4.2 | ✅ Un solo archivo modificado, un solo parámetro alterado |

### Cambio real realizado

| Archivo | Cambio | Motivación |
|---------|--------|------------|
| `src/game/scenes/GameScene.ts`, línea 306 | `alpha: 0.16 → 0.3` | Hacer cono de visión claramente visible |

### Tipo de cambio

- **Modificación mínima**: un solo parámetro numérico en un archivo de renderizado
- **Sin lógica domain**: Se reusa `evaluateVision()` existente sin modificar
- **Sin nuevas dependencias**: Sin tocar `package.json`
- **Compatible con H4.1**: El commit `78b315d` permanece intacto

### Evidencia visual

A continuación se muestran capturas de pantalla tomadas al ejecutar el juego con `npm run dev` en el navegador, que forman parte de la evidencia de la entrega 7/10:

![Captura H4.2 - cono visión](/../../evidencias/fotos.png)

**Nota:** La captura `fotos.png` muestra el cono de visión con alpha 0.3 (verde cuando el jugador está dentro, azul cuando está fuera). La observación manual durante la ejecución del juego confirmó que el cono es claramente visible y reacciona al facing del guardia. Los resultados automatizados (51/51 tests passing, typecheck PASS, build PASS, validate PASS) se conservan y complementan esta evidencia visual.

| Criterio | Evidencia |
|----------|-----------|
| Evidencia visual | Captura `fotos.png` en `docs/evidencias/` |
| Prueba manual | Ejecutado con `npm run dev`, observación de cono de visión visible y reactivo |
| Pruebas automatizadas | 51/51 tests passing |

Los resultados automatizados previos (typecheck PASS, 51/51 tests passing, build PASS, validate PASS) se conservan sin volver a presentarlos como pruebas visuales.

## Files modificados/creados

Nuevos archivos:
- `docs/upgrades/02-cono-de-vision-visible-y-reactivo/spec.md`
- `docs/upgrades/02-cono-de-vision-visible-y-reactivo/plan.md`
- `docs/upgrades/02-cono-de-vision-visible-y-reactivo/evidencia.md`

Archivos modificados:
- `src/game/scenes/GameScene.js` — alpha de fillStyle: 0.16 → 0.3

Archivos sin modificar (por regla H4.2):
- `src/domain/navigation/pathFollower.ts`
- `perceptionSimulation.ts`
- `labLevel.ts`
- `package.json`

### Resultado final

- 51/51 tests passing
- typecheck: PASS
- build: PASS
- validate: PASS
- git diff --check: PASS
- H4.2 implementado con cambio mínimo: alpha 0.16 → 0.3 en `GameScene.ts`
- H4.1 intacta en commit `78b315d`
- Documentación completa en `docs/upgrades/02-cono-de-vision-visible-y-reactivo/`

## Prueba manual verificada

El juego fue ejecutado localmente en el navegador utilizando el comando `npm run dev` en el repositorio `C:\recovered`.

Como parte de la auditoría de la entrega 7/10 del Laboratorio de intervención agéntica completa, verifiqué manualmente el funcionamiento de la mejora visual H4.2.

Observaciones H4.2:
- Al mover al jugador (`WASD`) para entrar al cono de visión del guardia, el cono de visión se observa claramente con alpha 0.3 (verde 0x73c991 cuando el jugador está dentro del cono, azul 0x6b8afd cuando está fuera).
- La reactividad del cono al cambio de dirección del guardia se confirmó: el cono gira automáticamente cada frame basándose en `guardFacing`, que se actualiza cuando el guardia se mueve o gira.
- No se obtuvieron capturas de pantalla ni se guardaron archivos de imagen en el repositorio. La evidencia se basa en la observación visual directa del juego en ejecución.

Los resultados automatizados previos (typecheck PASS, 51/51 tests passing, build PASS, validate PASS) se conservan sin volver a presentarlos como pruebas visuales.