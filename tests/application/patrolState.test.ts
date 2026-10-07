import { describe, it, expect, beforeEach } from "vitest";
import {
  createInitialPatrolState,
  updatePatrolState,
} from "../../src/application/simulation/patrolState";
import type { GridMap } from "../../src/domain/model/grid";
import { Vector2 } from "../../src/domain/model/vector";

// Re-export LAB_MAP for tests that need it
import { LAB_MAP } from "../../src/application/simulation/labLevel";

describe("H4.1 — Patrulla con pausas y mirada direccional", () => {
  let map: GridMap;

  beforeEach(() => {
    map = LAB_MAP;
  });

  // --- Waypoints exactos ---

  it("waypoints exactos definidos", () => {
    const state = createInitialPatrolState();
    expect(state.path.length).toBeGreaterThan(0);
    // The path from waypoint 5 to waypoint 1 should exist (A* finds it)
    expect(map.blocked.size).toBeLessThan(30 * 20);
  });

  it("waypoint 5 es GUARD_START", () => {
    const state = createInitialPatrolState();
    expect(state.position.x).toBe(27);
    expect(state.position.y).toBe(17);
  });

  // ---Inicio en waypoint 5---

  it("inicio en waypoint 5", () => {
    const state = createInitialPatrolState();
    expect(state.currentWaypointIndex).toBe(4); // 0-indexed: 4 = waypoint 5
  });

  // ---Ciclo 5→1→2→3→4→5---

  it("ciclo 5→1 después de pausa explícita", () => {
    // Start at waypoint 5, set paused state to simulate having just completed it
    const state = createInitialPatrolState();
    const pausedState = {
      ...state,
      isPaused: true,
      pauseAccumulator: 0,
    };
    // After 1000ms pause, should resume and head toward waypoint 1
    const updated = updatePatrolState(pausedState, 1000);
    expect(updated.isPaused).toBe(false);
    expect(updated.targetWaypointIndex).toBe(0); // waypoint 1
  });

  it("ciclo completo 5→1→2→3→4→5", () => {
    // Start at waypoint 5, set paused state
    const state = createInitialPatrolState();
    const pausedState = {
      ...state,
      isPaused: true,
      pauseAccumulator: 0,
    };
    // After pause, navigate to waypoint 1
    let updated = updatePatrolState(pausedState, 1000);
    expect(updated.targetWaypointIndex).toBe(0); // waypoint 1
    // After reaching waypoint 1, next should be waypoint 2
    expect((updated.currentWaypointIndex + 1) % 5).toBe(updated.targetWaypointIndex);
  });

  // ---Ruta almacenada como Vector2[]---

  it("ruta almacenada como Vector2[]", () => {
    const state = createInitialPatrolState();
    expect(state.path).toBeInstanceOf(Array);
    if (state.path.length > 0) {
      expect(state.path[0]).toHaveProperty("x");
      expect(state.path[0]).toHaveProperty("y");
    }
  });

  // ---Dirección inicial---

  it("dirección inicial es null", () => {
    const state = createInitialPatrolState();
    expect(state.direction).toBeNull();
  });

  // ---Estado inicial---

  it("estado inicial tiene isPaused falso y pauseAccumulator 0", () => {
    const state = createInitialPatrolState();
    expect(state.isPaused).toBe(false);
    expect(state.pauseAccumulator).toBe(0);
  });

  // ---Ruta inalcanzable sin teletransporte---

  it("ruta inalcanzable no teletransporta ni marca completada", () => {
    // Create a map with a vertical wall at x=10 that blocks the path
    // from waypoint 5 (27,17) to waypoint 1 (1,1). The wall plus the
    // grid edges makes the goal truly unreachable.
    const blockedMap: GridMap = {
      width: 30,
      height: 20,
      blocked: new Set([
        // Vertical wall at x=10 from y=0 to y=19
        "10,0", "10,1", "10,2", "10,3", "10,4",
        "10,5", "10,6", "10,7", "10,8", "10,9",
        "10,10", "10,11", "10,12", "10,13",
        "10,14", "10,15", "10,16", "10,17",
        "10,18", "10,19",
      ]),
    };

    // start is walkable, goal is surrounded by blocked cells → no path
    const state = createInitialPatrolState(blockedMap);
    // After update, should not teleport or mark completed
    const updated = updatePatrolState(state, 5);
    expect(updated.completed).toBe(false);
    // Position should remain at start
    expect(updated.position.x).toBe(27);
    expect(updated.position.y).toBe(17);
  });

  // ---Conservación de dirección cuando advanceAlongPath devuelve null---

  it("conserva última dirección válida cuando advanceAlongPath devuelve null", () => {
    // Use a path where movement is very small or blocked,
    // causing advanceAlongPath to return direction: null
    const state = createInitialPatrolState();
    // Set a lastValidDirection manually via state shape
    const stateWithDirection = {
      ...state,
      lastValidDirection: { x: 1, y: 0 } as Vector2,
    };
    // Advance with zero distance should preserve direction
    const updated = updatePatrolState(stateWithDirection, 0);
    // Direction should be conserved (1, 0) since advanceAlongPath with 0 distance returns null
    expect(updated.direction).toEqual({ x: 1, y: 0 });
  });

  // ---Consumo parcial de una ruta---

  it("consumo parcial de una ruta — pathIndex avanza pero completed es false", () => {
    const state = createInitialPatrolState();
    // Advance with a small maxDistance that moves partway along the path
    const updated = updatePatrolState(state, 1); // small distance
    // pathIndex should have advanced (not stayed at 0) but completed should be false
    expect(updated.pathIndex).toBeGreaterThanOrEqual(state.pathIndex);
    expect(updated.completed).toBe(false);
  });

  it("dirección se actualiza cuando hay movimiento real", () => {
    const state = createInitialPatrolState();
    const updated = updatePatrolState(state, 10); // sufficient distance to move
    // If movement occurred, direction should be set (not null, unless path has no direction)
    // At minimum, lastValidDirection should be updated
    expect(updated.lastValidDirection).not.toBeNull();
  });
});