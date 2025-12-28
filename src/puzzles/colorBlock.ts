import type { Puzzle, Tile, ColorData } from '../types/puzzle';

// Create a color tile
function colorTile(id: string, color: string): Tile {
  return {
    id,
    content: { type: 'color', color } as ColorData,
  };
}

/**
 * Color Block Puzzle
 *
 * 9 unique colored tiles that form two different patterns:
 * - Solution A: Rainbow gradient (warm top-left to cool bottom-right)
 * - Solution B: 90-degree rotation creates a vertical gradient effect
 *
 * Grid positions:
 * 0 1 2
 * 3 4 5
 * 6 7 8
 */
export const colorBlockPuzzle: Puzzle = {
  id: 'color-block-1',
  name: 'Color Blocks',
  gridSize: 3,
  tiles: [
    colorTile('t0', '#ef4444'), // Red
    colorTile('t1', '#f97316'), // Orange
    colorTile('t2', '#eab308'), // Yellow
    colorTile('t3', '#84cc16'), // Lime
    colorTile('t4', '#14b8a6'), // Teal
    colorTile('t5', '#3b82f6'), // Blue
    colorTile('t6', '#6366f1'), // Indigo
    colorTile('t7', '#a855f7'), // Purple
    colorTile('t8', '#ec4899'), // Pink
  ],
  // Solution A: Rainbow reading order (row by row)
  // Red    Orange  Yellow
  // Lime   Teal    Blue
  // Indigo Purple  Pink
  solutionA: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8'],

  // Solution B: 90-degree clockwise rotation
  // Indigo Lime    Red
  // Purple Teal    Orange
  // Pink   Blue    Yellow
  solutionB: ['t6', 't3', 't0', 't7', 't4', 't1', 't8', 't5', 't2'],

  imageA: 'Horizontal Rainbow',
  imageB: 'Vertical Rainbow',
};
