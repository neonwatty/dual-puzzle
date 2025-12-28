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
 * Line Continuation Puzzle
 *
 * 9 tiles with geometric line paths that form two different patterns:
 * - Solution A: "Flow" - creates a flowing wave-like pattern
 * - Solution B: "Grid" - creates a structured grid pattern
 *
 * Each tile has line segments that connect edge points.
 * Edge points are at positions 'a' (1/3) and 'b' (2/3) on each edge.
 *
 * Grid positions:
 * 0 1 2
 * 3 4 5
 * 6 7 8
 */

const tiles: Tile[] = [
  // t0: Horizontal line through middle (a-a)
  lineTile('t0', [path('left', 'a', 'right', 'a')]),

  // t1: Vertical line through middle (a-a)
  lineTile('t1', [path('top', 'a', 'bottom', 'a')]),

  // t2: Corner: top-a to right-a (curve)
  lineTile('t2', [path('top', 'a', 'right', 'a')]),

  // t3: Corner: left-a to bottom-a (curve)
  lineTile('t3', [path('left', 'a', 'bottom', 'a')]),

  // t4: Corner: bottom-a to right-a (curve)
  lineTile('t4', [path('bottom', 'a', 'right', 'a')]),

  // t5: Corner: left-a to top-a (curve)
  lineTile('t5', [path('left', 'a', 'top', 'a')]),

  // t6: Cross pattern (horizontal + vertical)
  lineTile('t6', [
    path('left', 'a', 'right', 'a'),
    path('top', 'a', 'bottom', 'a'),
  ]),

  // t7: Diagonal: top-a to bottom-b
  lineTile('t7', [path('top', 'a', 'bottom', 'b')]),

  // t8: Diagonal: top-b to bottom-a
  lineTile('t8', [path('top', 'b', 'bottom', 'a')]),
];

export const lineContinuationPuzzle: Puzzle = {
  id: 'line-continuation-1',
  name: 'Line Flow',
  gridSize: 3,
  tiles,

  // Solution A: Creates a flowing S-curve pattern
  // ┌──────┐
  // │  ┌───┘
  // └──┘
  solutionA: ['t2', 't0', 't3', 't1', 't6', 't1', 't5', 't0', 't4'],

  // Solution B: Creates a different connected pattern
  // ┌──┬──┐
  // │  │  │
  // └──┴──┘
  solutionB: ['t2', 't3', 't2', 't5', 't6', 't3', 't5', 't4', 't4'],

  imageA: 'S-Curve Flow',
  imageB: 'Connected Grid',
};
