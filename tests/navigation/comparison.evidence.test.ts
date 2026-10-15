
import { it, expect } from "vitest";
import { createGridMap, type GridPoint } from "../../src/domain/model/grid";
import { findPathAStar, findPathBfs } from "../../src/domain/navigation/search";

it("registra la comparación BFS y A* en el fixture común", () => {
  const map = createGridMap(5, 3, []);
  const start: GridPoint = { x: 0, y: 1 };
  const goal: GridPoint = { x: 4, y: 1 };

  for (const [name, result] of [
    ["BFS", findPathBfs(map, start, goal)],
    ["A*", findPathAStar(map, start, goal)],
  ] as const) {
    console.log(`COMPARACION ${name}:`, JSON.stringify({
      status: result.status,
      path: result.path,
      steps: result.path.length - 1,
      cost: result.totalCost,
      expandedNodes: result.expandedNodes,
      maximumFrontier: result.maximumFrontier,
    }));

    expect(result.status).toBe("success");
    expect(result.path.length - 1).toBe(4);
    expect(result.totalCost).toBe(4);
  }
});
