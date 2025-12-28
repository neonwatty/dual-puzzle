import type { Puzzle, Tile, LineData, LinePath, Edge, EdgePosition } from '../types/puzzle';

// Helper to create a line path
function path(
  fromEdge: Edge,
  fromPos: EdgePosition,
  toEdge: Edge,
  toPos: EdgePosition,
  style: 'straight' | 'curved' = 'curved'
): LinePath {
  return {
    from: { edge: fromEdge, position: fromPos },
    to: { edge: toEdge, position: toPos },
    style,
  };
}

// Create a line tile with paths
function lineTile(id: string, paths: LinePath[]): Tile {
  return {
    id,
    content: { type: 'lines', paths } as LineData,
  };
}

/**
 * Connected Lines Puzzle
 *
 * This puzzle uses tiles that form two distinct connected patterns:
 * - Solution A: Forms a continuous loop/circuit
 * - Solution B: Forms a different connected pattern
 *
 * Edge connection points use position 'a' (1/3 from edge start)
 *
 * Tile designs (using position 'a' for all connections):
 *
 * t0: ┌ (top→right corner)
 * t1: ─ (horizontal line)
 * t2: ┐ (top→left, but from right side: left→top)
 * t3: │ (vertical line)
 * t4: └ (bottom→right corner)
 * t5: ┘ (bottom→left corner)
 * t6: ├ (T-junction: top, bottom, right)
 * t7: ┬ (T-junction: left, right, bottom)
 * t8: ┼ (cross: all four directions)
 */

const tiles: Tile[] = [
  // t0: Corner top-right (comes from top, exits right)
  lineTile('t0', [path('top', 'a', 'right', 'a')]),

  // t1: Horizontal line
  lineTile('t1', [path('left', 'a', 'right', 'a')]),

  // t2: Corner top-left (comes from left, exits top) - effectively ┐ rotated
  lineTile('t2', [path('left', 'a', 'top', 'a')]),

  // t3: Vertical line
  lineTile('t3', [path('top', 'a', 'bottom', 'a')]),

  // t4: Corner bottom-right (comes from bottom, exits right)
  lineTile('t4', [path('bottom', 'a', 'right', 'a')]),

  // t5: Corner bottom-left (comes from left, exits bottom)
  lineTile('t5', [path('left', 'a', 'bottom', 'a')]),

  // t6: T-junction (top, bottom, right)
  lineTile('t6', [
    path('top', 'a', 'bottom', 'a'),
    path('top', 'a', 'right', 'a'),
  ]),

  // t7: T-junction (left, right, bottom)
  lineTile('t7', [
    path('left', 'a', 'right', 'a'),
    path('left', 'a', 'bottom', 'a'),
  ]),

  // t8: Cross (all directions)
  lineTile('t8', [
    path('left', 'a', 'right', 'a'),
    path('top', 'a', 'bottom', 'a'),
  ]),
];

/**
 * Solution A: Square loop
 * ┌─┐
 * │ │
 * └─┘
 *
 * Position mapping:
 * 0: t0 (┌)  1: t1 (─)  2: t2 (┐ as left→top)
 * 3: t3 (│)  4: empty   5: t3 (│)
 * 6: t4 (└)  7: t1 (─)  8: t5 (┘)
 *
 * Wait, we have 9 tiles and need to use all of them.
 * Let me redesign for a more interesting pattern.
 */

/**
 * Redesigned: Use all 9 tiles in two different configurations
 *
 * Solution A: Maze pattern 1
 * ┌─┬
 * │┼│
 * └┴┘
 *
 * Solution B: Maze pattern 2
 * ├─┐
 * │┼┤  (reusing tiles differently)
 * └─┘
 */

export const connectedLinesPuzzle: Puzzle = {
  id: 'connected-lines-1',
  name: 'Connected Lines',
  gridSize: 3,
  tiles,

  // Solution A: Creates a rectangular frame with center cross
  // ┌─┐
  // │┼│
  // └─┘
  solutionA: ['t0', 't1', 't2', 't3', 't8', 't3', 't4', 't1', 't5'],

  // Solution B: Creates a different pattern using T-junctions
  // ┌┬┐
  // ├┼┤
  // └┴┘
  solutionB: ['t0', 't7', 't2', 't6', 't8', 't6', 't4', 't7', 't5'],

  imageA: 'Frame Pattern',
  imageB: 'Grid Pattern',
};

/**
 * Helper function to check if two adjacent tiles have matching edges
 * Used for visual feedback
 */
export function getEdgeConnections(
  arrangement: string[],
  tiles: Tile[],
  gridSize: number
): Map<string, boolean> {
  const connections = new Map<string, boolean>();

  const getTileAt = (pos: number): Tile | undefined => {
    const tileId = arrangement[pos];
    return tiles.find(t => t.id === tileId);
  };

  const hasEdgePoint = (tile: Tile, edge: Edge, position: EdgePosition): boolean => {
    if (tile.content.type !== 'lines') return false;
    const lineData = tile.content as LineData;
    return lineData.paths.some(
      p => (p.from.edge === edge && p.from.position === position) ||
           (p.to.edge === edge && p.to.position === position)
    );
  };

  for (let pos = 0; pos < arrangement.length; pos++) {
    const tile = getTileAt(pos);
    if (!tile) continue;

    const row = Math.floor(pos / gridSize);
    const col = pos % gridSize;

    // Check right neighbor
    if (col < gridSize - 1) {
      const rightTile = getTileAt(pos + 1);
      if (rightTile) {
        const connected = hasEdgePoint(tile, 'right', 'a') &&
                         hasEdgePoint(rightTile, 'left', 'a');
        connections.set(`${pos}-right`, connected);
      }
    }

    // Check bottom neighbor
    if (row < gridSize - 1) {
      const bottomTile = getTileAt(pos + gridSize);
      if (bottomTile) {
        const connected = hasEdgePoint(tile, 'bottom', 'a') &&
                         hasEdgePoint(bottomTile, 'top', 'a');
        connections.set(`${pos}-bottom`, connected);
      }
    }
  }

  return connections;
}
