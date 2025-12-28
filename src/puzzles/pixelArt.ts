import type { Puzzle, Tile, PixelData } from '../types/puzzle';

// Colors
const _ = '#1e293b'; // background (slate-800)
const R = '#ef4444'; // red
const Y = '#facc15'; // yellow
const B = '#3b82f6'; // blue

// Create a pixel tile
function pixelTile(id: string, grid: string[][]): Tile {
  return {
    id,
    content: { type: 'pixels', grid } as PixelData,
  };
}

/**
 * Pixel Art Puzzle: Arrow Directions
 *
 * 9 tiles that form either:
 * - Solution A: Arrow pointing RIGHT (→)
 * - Solution B: Arrow pointing DOWN (↓)
 *
 * The trick: tiles are designed so a 90° rotation of the arrangement
 * transforms the arrow direction.
 *
 * 12x12 pixel canvas (3x3 tiles, each 4x4 pixels)
 *
 * RIGHT Arrow:        DOWN Arrow:
 *     ██                ████
 *     ████              ████
 * ████████████      ████████████
 * ████████████      ████████████
 *     ████              ████
 *     ██                ████
 */

const arrowTiles: Tile[] = [
  // t0: Top-left (empty for right arrow, has top of down arrow)
  pixelTile('t0', [
    [_, _, _, _],
    [_, _, _, _],
    [_, _, Y, Y],
    [_, _, Y, Y],
  ]),

  // t1: Top-center (right arrow shaft top / down arrow point)
  pixelTile('t1', [
    [_, _, _, _],
    [_, _, _, _],
    [Y, Y, Y, Y],
    [Y, Y, Y, Y],
  ]),

  // t2: Top-right (empty for right arrow, has top of down arrow)
  pixelTile('t2', [
    [_, _, _, _],
    [_, _, _, _],
    [Y, Y, _, _],
    [Y, Y, _, _],
  ]),

  // t3: Middle-left (right arrow shaft)
  pixelTile('t3', [
    [_, _, Y, Y],
    [_, _, Y, Y],
    [Y, Y, Y, Y],
    [Y, Y, Y, Y],
  ]),

  // t4: Center (full block - arrow body)
  pixelTile('t4', [
    [Y, Y, Y, Y],
    [Y, Y, Y, Y],
    [Y, Y, Y, Y],
    [Y, Y, Y, Y],
  ]),

  // t5: Middle-right (right arrow point / down arrow shaft)
  pixelTile('t5', [
    [Y, Y, Y, Y],
    [Y, Y, Y, Y],
    [Y, Y, _, _],
    [Y, Y, _, _],
  ]),

  // t6: Bottom-left (empty for right arrow)
  pixelTile('t6', [
    [_, _, Y, Y],
    [_, _, Y, Y],
    [_, _, _, _],
    [_, _, _, _],
  ]),

  // t7: Bottom-center (right arrow shaft bottom / down arrow point)
  pixelTile('t7', [
    [Y, Y, Y, Y],
    [Y, Y, Y, Y],
    [_, _, _, _],
    [_, _, _, _],
  ]),

  // t8: Bottom-right (empty for right arrow)
  pixelTile('t8', [
    [Y, Y, _, _],
    [Y, Y, _, _],
    [_, _, _, _],
    [_, _, _, _],
  ]),
];

/**
 * Second puzzle: Heart vs Diamond
 *
 * Uses the same constraint - tiles form two different shapes.
 */
const shapeTiles: Tile[] = [
  // Row 0
  pixelTile('s0', [
    [_, R, R, _],
    [R, R, R, R],
    [R, R, R, R],
    [R, R, R, R],
  ]),

  pixelTile('s1', [
    [_, _, _, _],
    [R, R, R, R],
    [R, R, R, R],
    [R, R, R, R],
  ]),

  pixelTile('s2', [
    [_, R, R, _],
    [R, R, R, R],
    [R, R, R, R],
    [R, R, R, R],
  ]),

  // Row 1
  pixelTile('s3', [
    [R, R, R, R],
    [R, R, R, R],
    [_, R, R, R],
    [_, _, R, R],
  ]),

  pixelTile('s4', [
    [R, R, R, R],
    [R, R, R, R],
    [R, R, R, R],
    [R, R, R, R],
  ]),

  pixelTile('s5', [
    [R, R, R, R],
    [R, R, R, R],
    [R, R, R, _],
    [R, R, _, _],
  ]),

  // Row 2
  pixelTile('s6', [
    [_, _, _, R],
    [_, _, _, _],
    [_, _, _, _],
    [_, _, _, _],
  ]),

  pixelTile('s7', [
    [R, R, R, R],
    [_, R, R, _],
    [_, _, _, _],
    [_, _, _, _],
  ]),

  pixelTile('s8', [
    [R, _, _, _],
    [_, _, _, _],
    [_, _, _, _],
    [_, _, _, _],
  ]),
];

/**
 * Third puzzle: Simple icons using fewer, bolder designs
 */
const iconTiles: Tile[] = [
  // These tiles form a PLUS sign in one arrangement
  // and an X sign in another arrangement

  // t0: Top-left quadrant
  pixelTile('i0', [
    [_, _, B, B],
    [_, _, B, B],
    [B, B, B, B],
    [B, B, B, B],
  ]),

  // t1: Top-center
  pixelTile('i1', [
    [B, B, B, B],
    [B, B, B, B],
    [B, B, B, B],
    [B, B, B, B],
  ]),

  // t2: Top-right quadrant
  pixelTile('i2', [
    [B, B, _, _],
    [B, B, _, _],
    [B, B, B, B],
    [B, B, B, B],
  ]),

  // t3: Middle-left
  pixelTile('i3', [
    [B, B, B, B],
    [B, B, B, B],
    [_, _, B, B],
    [_, _, B, B],
  ]),

  // t4: Center
  pixelTile('i4', [
    [B, B, B, B],
    [B, B, B, B],
    [B, B, B, B],
    [B, B, B, B],
  ]),

  // t5: Middle-right
  pixelTile('i5', [
    [B, B, B, B],
    [B, B, B, B],
    [B, B, _, _],
    [B, B, _, _],
  ]),

  // t6: Bottom-left
  pixelTile('i6', [
    [_, _, B, B],
    [_, _, B, B],
    [_, _, _, _],
    [_, _, _, _],
  ]),

  // t7: Bottom-center
  pixelTile('i7', [
    [B, B, B, B],
    [B, B, B, B],
    [_, _, _, _],
    [_, _, _, _],
  ]),

  // t8: Bottom-right
  pixelTile('i8', [
    [B, B, _, _],
    [B, B, _, _],
    [_, _, _, _],
    [_, _, _, _],
  ]),
];

// Export the arrow puzzle as the main one (most visually distinct)
export const pixelArtPuzzle: Puzzle = {
  id: 'pixel-art-1',
  name: 'Pixel Arrows',
  gridSize: 3,
  tiles: arrowTiles,

  // Solution A: Arrow pointing RIGHT
  // Layout:
  // [t0] [t1] [t2]    _  ██  _
  // [t3] [t4] [t5]   ██ ████ ██→
  // [t6] [t7] [t8]    _  ██  _
  solutionA: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8'],

  // Solution B: Arrow pointing DOWN (90° rotation effect)
  // Rearrange tiles so columns become rows
  // [t0] [t3] [t6]    _  ██  _
  // [t1] [t4] [t7]   ██ ████ ██
  // [t2] [t5] [t8]    _  ██↓ _
  solutionB: ['t0', 't3', 't6', 't1', 't4', 't7', 't2', 't5', 't8'],

  imageA: 'Arrow Right',
  imageB: 'Arrow Down',
};

// Heart puzzle as alternative
export const heartPuzzle: Puzzle = {
  id: 'pixel-heart-1',
  name: 'Pixel Heart',
  gridSize: 3,
  tiles: shapeTiles,

  solutionA: ['s0', 's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8'],
  // Reversed creates a different perspective
  solutionB: ['s8', 's7', 's6', 's5', 's4', 's3', 's2', 's1', 's0'],

  imageA: 'Heart',
  imageB: 'Inverted Heart',
};

// Plus/Cross puzzle
export const crossPuzzle: Puzzle = {
  id: 'pixel-cross-1',
  name: 'Pixel Cross',
  gridSize: 3,
  tiles: iconTiles,

  solutionA: ['i0', 'i1', 'i2', 'i3', 'i4', 'i5', 'i6', 'i7', 'i8'],
  solutionB: ['i8', 'i7', 'i6', 'i5', 'i4', 'i3', 'i2', 'i1', 'i0'],

  imageA: 'Plus Sign',
  imageB: 'Rotated Plus',
};
