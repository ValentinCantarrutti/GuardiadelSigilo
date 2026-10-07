import { Vector2 } from "../../domain/model/vector";
import {
  PathFollowerResult,
  advanceAlongPath,
} from "../../domain/navigation/pathFollower";
import {
  findPathAStar,
} from "../../domain/navigation/search";
import type { GridMap, GridPoint } from "../../domain/model/grid";
import { LAB_MAP } from "./labLevel";

// Waypoints explicitly defined (1-indexed per specification)
// Index 0 → waypoint 1: {x:1, y:1}
// Index 1 → waypoint 2: {x:1, y:9}
// Index 2 → waypoint 3: {x:10, y:1}
// Index 3 → waypoint 4: {x:20, y:9}
// Index 4 → waypoint 5: {x:27, y:17} = GUARD_START
const WAYPOINTS: readonly GridPoint[] = [
  { x: 1, y: 1 },
  { x: 1, y: 9 },
  { x: 10, y: 1 },
  { x: 20, y: 9 },
  { x: 27, y: 17 },
];

// Navigation cycle: 5 → 1 → 2 → 3 → 4 → 5
// Internal mapping: index 4 = waypoint 5, index 0 = waypoint 1, etc.
// Cycle order: (currentIndex + 1) % 5 gives the next waypoint index
//   4 → 0 (5→1), 0 → 1 (1→2), 1 → 2 (2→3), 2 → 3 (3→4), 3 → 4 (4→5)

// Default maximum distance per frame for movement
const DEFAULT_MAX_DISTANCE = 5;

/**
 * Patrol state representing the patrol's position, path, and cycle state.
 * No global state; all data is encapsulated.
 */
export type PatrolState = {
  /** Current position in world coordinates */
  position: Vector2;
  /** Index of the waypoint the patrol is currently at/standing on (0-4) */
  currentWaypointIndex: number;
  /** Index of the waypoint the patrol is navigating toward (0-4) */
  targetWaypointIndex: number;
  /** Full path as Vector2[] from current position to target waypoint */
  path: Vector2[];
  /** Current index within the path for advanceAlongPath */
  pathIndex: number;
  /** Movement direction this frame (null if no movement during this frame) */
  direction: Vector2 | null;
  /** Last valid direction conserved when advanceAlongPath returns null */
  lastValidDirection: Vector2 | null;
  /** Whether the patrol is in the 1-second pause after completing a waypoint */
  isPaused: boolean;
  /** Accumulated pause time in milliseconds */
  pauseAccumulator: number;
  /** Whether the current path segment is completed */
  completed: boolean;
};

/**
 * Create initial patrol state.
 * Starts at waypoint 5 (GUARD_START), first target is waypoint 1.
 */
export function createInitialPatrolState(
  map: GridMap = LAB_MAP,
): PatrolState {
  // Patrol always starts at waypoint 5 (GUARD_START)
  const startIndex = 4;

  // First target is waypoint 1 (index 0) — cycle: 5 → 1
  const firstTargetIndex = 0;

  // Compute initial path from waypoint 5 to waypoint 1 using A*
  const searchResult = findPathAStar(map, { x: 27, y: 17 } as GridPoint, WAYPOINTS[firstTargetIndex] as GridPoint);
  const initialPath = searchResult.status === "success" && searchResult.path && searchResult.path.length > 0
    ? searchResult.path.map((gp): Vector2 => ({ x: gp.x, y: gp.y }))
    : [];

  return {
    position: { x: 27, y: 17 },
    currentWaypointIndex: startIndex,
    targetWaypointIndex: firstTargetIndex,
    path: initialPath ?? [],
    pathIndex: 0,
    direction: null,
    lastValidDirection: null,
    isPaused: false,
    pauseAccumulator: 0,
    completed: initialPath === null ? true : false,
  };
}



/**
 * Advance the patrol state by one frame.
 * Calls advanceAlongPath incrementally and handles pause logic.
 */
export function updatePatrolState(
  state: PatrolState,
  maxDistance: number = DEFAULT_MAX_DISTANCE,
): PatrolState {
  // ---------- PAUSE STATE ----------
  if (state.isPaused) {
    const newAccumulator = state.pauseAccumulator + maxDistance;
    if (newAccumulator >= 1000) {
      // Resume after 1000 ms pause
      // Keep current waypoint index unchanged, only update target
      const newCurrent = state.currentWaypointIndex;
      // Keep targeting the same waypoint we were before the pause
      const newNext = state.targetWaypointIndex;

      // Compute new path from current position (at waypoint) to the target waypoint
  const searchResult = findPathAStar(LAB_MAP, { x: state.position.x, y: state.position.y } as GridPoint, WAYPOINTS[newNext] as GridPoint);
    const newPath = searchResult.status === "success" && searchResult.path && searchResult.path.length > 0
      ? searchResult.path.map((gp): Vector2 => ({ x: gp.x, y: gp.y }))
      : [];

      return {
        position: state.position,
        currentWaypointIndex: newCurrent,
        targetWaypointIndex: newNext,
        path: newPath ?? [],
        pathIndex: 0,
        direction: null,
        lastValidDirection: state.direction, // conserve direction across pause
        isPaused: false,
        pauseAccumulator: 0,
        completed: false,
      };
    }
    return {
      ...state,
      pauseAccumulator: newAccumulator,
    };
  }

  // ---------- NAVIGATING STATE ----------
  // If path is empty or index is out of bounds, recompute path
  if (state.path.length === 0 || state.pathIndex >= state.path.length) {
    const searchResult = findPathAStar(LAB_MAP, { x: state.position.x, y: state.position.y } as GridPoint, WAYPOINTS[state.targetWaypointIndex] as GridPoint);
    const newPath = searchResult.status === "success" && searchResult.path && searchResult.path.length > 0
      ? searchResult.path.map((gp): Vector2 => ({ x: gp.x, y: gp.y }))
      : [];
    if (newPath.length === 0) {
      // Unreachable: do not teleport, do not mark completed, do not advance
      return {
        ...state,
        completed: false,
      };
    }
    return {
      ...state,
      path: newPath,
      pathIndex: 0,
    };
  }

  // Advance along the current path incrementally
  const result: PathFollowerResult = advanceAlongPath(
    state.position,
    state.path,
    state.pathIndex,
    maxDistance,
  );

  // Direction logic: if advanceAlongPath returns null, conserve last valid direction
  const newDirection = result.direction !== null ? result.direction : state.lastValidDirection;
  const newLastValidDirection = result.direction !== null ? result.direction : state.lastValidDirection;

  // If the path segment is completed, enter pause state
  if (result.completed) {
    // The waypoint we just reached becomes the current waypoint
    const newCurrent = state.targetWaypointIndex;
    // Next waypoint in cycle: 5→1→2→3→4→5
    const newNext = (newCurrent + 1) % 5;

      const searchResult = findPathAStar(LAB_MAP, { x: result.position.x, y: result.position.y } as GridPoint, WAYPOINTS[newNext] as GridPoint);
      const newPath = searchResult.status === "success" && searchResult.path && searchResult.path.length > 0
        ? searchResult.path.map((gp): Vector2 => ({ x: gp.x, y: gp.y }))
        : [];

    return {
      position: result.position,
      currentWaypointIndex: newCurrent,
      targetWaypointIndex: newNext,
      path: newPath ?? [],
      pathIndex: 0,
      direction: newDirection,
      lastValidDirection: newLastValidDirection,
      isPaused: true,
      pauseAccumulator: 0,
      completed: false,
    };
  }

  // Path not yet completed — return updated state
  return {
    position: result.position,
    currentWaypointIndex: state.currentWaypointIndex,
    targetWaypointIndex: state.targetWaypointIndex,
    path: state.path,
    pathIndex: result.nextWaypoint,
    direction: newDirection,
    lastValidDirection: newLastValidDirection,
    isPaused: false,
    pauseAccumulator: 0,
    completed: result.completed,
  };
}

