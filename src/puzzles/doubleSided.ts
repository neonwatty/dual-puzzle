import type { Puzzle, Tile, DoubleSidedData, ColorData } from '../types/puzzle';

// Colors for Face A (Ocean theme - blues and greens)
const oceanColors = [
  '#0ea5e9', // sky-500
  '#06b6d4', // cyan-500
  '#14b8a6', // teal-500
  '#0d9488', // teal-600
  '#0891b2', // cyan-600
  '#0284c7', // sky-600
  '#22d3ee', // cyan-400
  '#2dd4bf', // teal-400
  '#38bdf8', // sky-400
];

// Colors for Face B (Sunset theme - reds and oranges)
const sunsetColors = [
  '#f97316', // orange-500
  '#ef4444', // red-500
  '#f59e0b', // amber-500
  '#dc2626', // red-600
  '#ea580c', // orange-600
  '#d97706', // amber-600
  '#fb923c', // orange-400
  '#f87171', // red-400
  '#fbbf24', // amber-400
];

// Create a double-sided tile
function doubleTile(id: string, colorA: string, colorB: string): Tile {
  return {
    id,
    content: {
      type: 'double-sided',
      faceA: { type: 'color', color: colorA } as ColorData,
      faceB: { type: 'color', color: colorB } as ColorData,
    } as DoubleSidedData,
  };
}

/**
 * Double-Sided Puzzle
 *
 * Each tile has two faces - tap/click to flip
 * - Face A (default): Ocean theme colors
 * - Face B (flipped): Sunset theme colors
 *
 * Solution A: All tiles showing Face A, arranged to form ocean gradient
 * Solution B: All tiles showing Face B, arranged to form sunset gradient
 *
 * The player must both FLIP the tiles and ARRANGE them correctly.
 */

const tiles: Tile[] = oceanColors.map((oceanColor, i) =>
  doubleTile(`t${i}`, oceanColor, sunsetColors[i])
);

export const doubleSidedPuzzle: Puzzle = {
  id: 'double-sided-1',
  name: 'Flip & Arrange',
  gridSize: 3,
  tiles,
  requiresFlip: true,

  // Solution A: Ocean theme - gradient arrangement
  // Light cyan top-left to dark teal bottom-right
  solutionA: ['t6', 't7', 't0', 't8', 't1', 't2', 't4', 't5', 't3'],

  // Solution B: Sunset theme - different gradient
  // Orange top to red bottom
  solutionB: ['t2', 't0', 't4', 't1', 't3', 't5', 't8', 't6', 't7'],

  imageA: 'Ocean Waves',
  imageB: 'Sunset Sky',
};
