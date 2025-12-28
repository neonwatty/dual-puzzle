import { colorBlockPuzzle } from './colorBlock';
import { lineContinuationPuzzle } from './lineContinuation';
import { connectedLinesPuzzle } from './connectedLines';
import { pixelArtPuzzle } from './pixelArt';
import { doubleSidedPuzzle } from './doubleSided';
import type { Puzzle } from '../types/puzzle';

export const puzzles: Record<string, Puzzle> = {
  'color-block-1': colorBlockPuzzle,
  'line-continuation-1': lineContinuationPuzzle,
  'connected-lines-1': connectedLinesPuzzle,
  'pixel-art-1': pixelArtPuzzle,
  'double-sided-1': doubleSidedPuzzle,
};

export const puzzleList: Puzzle[] = [
  colorBlockPuzzle,
  connectedLinesPuzzle,
  pixelArtPuzzle,
  doubleSidedPuzzle,
];

export {
  colorBlockPuzzle,
  lineContinuationPuzzle,
  connectedLinesPuzzle,
  pixelArtPuzzle,
  doubleSidedPuzzle,
};
