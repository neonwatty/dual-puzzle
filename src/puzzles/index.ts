import { colorBlockPuzzle } from './colorBlock';
import { lineContinuationPuzzle } from './lineContinuation';
import type { Puzzle } from '../types/puzzle';

export const puzzles: Record<string, Puzzle> = {
  'color-block-1': colorBlockPuzzle,
  'line-continuation-1': lineContinuationPuzzle,
};

export const puzzleList: Puzzle[] = [colorBlockPuzzle, lineContinuationPuzzle];

export { colorBlockPuzzle, lineContinuationPuzzle };
