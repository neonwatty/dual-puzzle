import { colorBlockPuzzle } from './colorBlock';
import { pixelArtPuzzle, heartPuzzle, crossPuzzle } from './pixelArt';
import { doubleSidedPuzzle } from './doubleSided';
import { xoPuzzle, arrowPuzzle, facePuzzle, crossColorPuzzle } from './generated';
import type { Puzzle } from '../types/puzzle';

export const puzzles: Record<string, Puzzle> = {
  'color-block-1': colorBlockPuzzle,
  'pixel-art-1': pixelArtPuzzle,
  'pixel-heart-1': heartPuzzle,
  'pixel-cross-1': crossPuzzle,
  'double-sided-1': doubleSidedPuzzle,
  'generated-xo': xoPuzzle,
  'generated-arrow': arrowPuzzle,
  'generated-face': facePuzzle,
  'generated-cross-color': crossColorPuzzle,
};

// Main puzzle list for the game - prioritize generated puzzles
export const puzzleList: Puzzle[] = [
  xoPuzzle,           // Generated: X vs O
  arrowPuzzle,        // Generated: Up vs Down arrow
  facePuzzle,         // Generated: Happy vs Sad face
  crossColorPuzzle,   // Generated: Cross-color with normalization
  colorBlockPuzzle,   // Simple colors
  pixelArtPuzzle,     // Manual: Arrow right/down
  doubleSidedPuzzle,  // Flip mechanic
];

export {
  colorBlockPuzzle,
  pixelArtPuzzle,
  heartPuzzle,
  crossPuzzle,
  doubleSidedPuzzle,
  xoPuzzle,
  arrowPuzzle,
  facePuzzle,
  crossColorPuzzle,
};
