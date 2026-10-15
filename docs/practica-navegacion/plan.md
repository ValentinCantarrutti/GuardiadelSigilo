# Plan de implementación — Práctica de navegación

## 1. Objetivo

Implementar y verificar la variante B — evitar zonas expuestas — de forma incremental, manteniendo el contrato previo de navegación y sin modificar percepción, memoria ni máquina de estados.

## 2. Estado inicial y precauciones

- Repositorio: `ValentinCantarrutti/GuardiadelSigilo`.
- Rama y commit inicial: registrar mediante `git branch --show-current` y `git rev-parse HEAD`.
- Estado previo: revisar `git status --short` y `git diff` antes de modificar archivos.
- Validación de referencia observada durante el trabajo: `npm run validate` completó correctamente; 7 archivos de prueba y 56 pruebas aprobadas, además de compilación exitosa. Volver a ejecutar al finalizar para confirmar el estado definitivo.
- Existen modificaciones locales previas y archivos sin seguimiento. No descartarlos ni incorporarlos automáticamente al commit.

## 3. Incrementos

### Incremento 1 — Contrato y costo de navegación

**Ámbito:** `src/domain/navigation/search.ts` y `tests/navigation/search.test.ts`.

Tareas:

1. Revisar el contrato existente de BFS y A*.
2. Mantener el comportamiento de BFS.
3. Incorporar el costo estático de las celdas expuestas para A*.
4. Asegurar que la celda inicial no sume costo.
5. Mantener la heurística Manhattan con costo mínimo de entrada igual a 1.
6. Cubrir ruta directa, desvío preferido, perfil desactivado e inicio igual al objetivo.

Criterios:

- BFS conserva su comportamiento anterior.
- A* con perfil B prefiere evitar las celdas expuestas.
- El perfil desactivado conserva el costo unitario.
- Las celdas expuestas siguen siendo transitables.

Verificación:

```bat
npm run typecheck
npm run test:run
```

### Incremento 2 — Integración con la simulación

**Ámbito:** `src/application/simulation/navigationDemo.ts` y consumidor existente.

Tareas:

1. Exponer la configuración del perfil mediante la función de cálculo de rutas existente.
2. Conservar el comportamiento predeterminado cuando el perfil está desactivado.
3. Verificar que el consumidor pueda solicitar el perfil B sin introducir una nueva interfaz o máquina de estados.
4. Comprobar que percepción y memoria permanecen fuera del alcance del cambio.
5. Revisar la escena del juego para evitar controles o indicadores de prueba que no formen parte de la entrega solicitada.

Criterios:

- La integración usa el consumidor existente.
- No se altera la prioridad de percepción, la memoria ni los estados del guardia.
- Las rutas sin perfil mantienen el comportamiento anterior.

Verificación:

```bat
npm run typecheck
npm run test:run
```

### Incremento 3 — Regresión, evidencia y cierre

**Ámbito:** pruebas, documentación y revisión final del diff.

Tareas:

1. Ejecutar los casos normales y límite definidos en la especificación.
2. Ejecutar las pruebas de los consumidores y la suite completa.
3. Ejecutar la validación y compilación final.
4. Revisar los cambios con `git diff --check`, `git diff --stat` y `git status --short`.
5. Registrar resultados reales, decisiones humanas, limitaciones y evidencia en `evidencia.md`.
6. Confirmar que los tres documentos están completos y versionados.
7. Obtener el hash final después de que la persona responsable decida realizar el commit.

Criterios:

- La validación final termina correctamente.
- No se incorporan cambios fuera de alcance.
- Los resultados documentados coinciden con las salidas reales.
- No se inventan capturas, métricas, commits ni pruebas.

## 4. Comandos de revisión

Desde la raíz del repositorio:

```bat
git branch --show-current
git rev-parse HEAD
git status --short
git diff --check
git diff --stat
npm run validate
```

Para revisar cambios de archivos concretos:

```bat
git diff -- src/domain/navigation/search.ts
git diff -- src/application/simulation/navigationDemo.ts
git diff -- src/game/scenes/GameScene.ts
git diff -- tests/navigation/search.test.ts
```

Si Git abre un paginador y aparece `(END)`, pulsar `q` para volver a la terminal.

## 5. Riesgos y mitigaciones

- **Regresión de BFS:** conservar las pruebas anteriores y verificar que el perfil no cambie su resultado.
- **Costo inicial incorrecto:** comprobar que el inicio no se cobra y que inicio igual a objetivo cuesta cero.
- **Heurística no admisible:** usar distancia Manhattan con costo mínimo de entrada igual a 1.
- **Cambios fuera de alcance:** no tocar la máquina de estados, percepción ni memoria.
- **Pérdida de trabajo previo:** no sobrescribir archivos ajenos a la práctica ni limpiar modificaciones existentes.
- **Evidencia incompleta:** registrar únicamente resultados observados en la terminal y pruebas ejecutadas.

## 6. Decisión de cierre

La implementación se considera candidata a entrega cuando los criterios de aceptación están cubiertos, `npm run validate` termina correctamente, el diff ha sido revisado y `evidencia.md` refleja el estado real.

La decisión final de aprobar, crear el commit y publicarlo corresponde a la persona responsable del repositorio.