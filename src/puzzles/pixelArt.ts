import type { Puzzle, Tile, PixelData } from '../types/puzzle';

// Colors for gradient puzzle
const _ = '#1e293b'; // background (slate-800)
const B = '#3b82f6'; // blue
const P = '#a855f7'; // purple
const W = '#ffffff'; // white

// Create a pixel tile
function pixelTile(id: string, grid: string[][]): Tile {
  return {
    id,
    content: { type: 'pixels', grid } as PixelData,
  };
}

/**
 * Pixel Art Puzzle
 *
 * 9 tiles, each is a 4x4 pixel grid.
 * Together they form a 12x12 pixel image.
 *
 * This puzzle uses gradient tiles that form different patterns
 * when arranged differently:
 * - Solution A: Gradient flows from top-left (bright) to bottom-right (dark)
 * - Solution B: Gradient flows from bottom-right (bright) to top-left (dark)
 */

// Gradient tiles that form different patterns
const gradientTiles: Tile[] = [
  // t0: Gradient corner (top-left bright)
  pixelTile('t0', [
    [W, W, B, B],
    [W, B, B, P],
    [B, B, P, P],
    [B, P, P, _],
  ]),

  // t1: Gradient top (bright top)
  pixelTile('t1', [
    [B, W, W, B],
    [B, B, B, B],
    [P, B, B, P],
    [P, P, P, P],
  ]),

  // t2: Gradient corner (top-right bright)
  pixelTile('t2', [
    [B, B, W, W],
    [P, B, B, W],
    [P, P, B, B],
    [_, P, P, B],
  ]),

  // t3: Gradient left (bright left)
  pixelTile('t3', [
    [W, B, P, _],
    [W, B, P, P],
    [W, B, P, P],
    [W, B, P, _],
  ]),

  // t4: Center (all mid-tone)
  pixelTile('t4', [
    [B, B, B, B],
    [B, P, P, B],
    [B, P, P, B],
    [B, B, B, B],
  ]),

  // t5: Gradient right (bright right)
  pixelTile('t5', [
    [_, P, B, W],
    [P, P, B, W],
    [P, P, B, W],
    [_, P, B, W],
  ]),

  // t6: Gradient corner (bottom-left bright)
  pixelTile('t6', [
    [B, P, P, _],
    [B, B, P, P],
    [W, B, B, P],
    [W, W, B, B],
  ]),

  // t7: Gradient bottom (bright bottom)
  pixelTile('t7', [
    [P, P, P, P],
    [P, B, B, P],
    [B, B, B, B],
    [B, W, W, B],
  ]),

  // t8: Gradient corner (bottom-right bright)
  pixelTile('t8', [
    [_, P, P, B],
    [P, P, B, B],
    [P, B, B, W],
    [B, B, W, W],
  ]),
];

export const pixelArtPuzzle: Puzzle = {
  id: 'pixel-art-1',
  name: 'Pixel Gradients',
  gridSize: 3,
  tiles: gradientTiles,

  // Solution A: Normal arrangement - gradient flows from top-left to bottom-right
  solutionA: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8'],

  // Solution B: 180-degree rotation - gradient flows from bottom-right to top-left
  solutionB: ['t8', 't7', 't6', 't5', 't4', 't3', 't2', 't1', 't0'],

  imageA: 'Sunset Gradient',
  imageB: 'Sunrise Gradient',
};
