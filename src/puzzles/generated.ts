import type { Puzzle } from '../types/puzzle';
import { matchImages, createPuzzleFromMatch } from '../utils/imageMatcher';

/**
 * Example: Generate a puzzle from two hand-designed 12x12 images
 *
 * This demonstrates the algorithm:
 * 1. Define two distinct images
 * 2. Run the matching algorithm
 * 3. Get tiles that can form both images
 */

// Colors
const _ = '#1e293b'; // background
const R = '#ef4444'; // red
const B = '#3b82f6'; // blue
const Y = '#facc15'; // yellow

/**
 * Image A: A simple "X" pattern (12x12)
 */
const imageA: string[][] = [
  [R, R, _, _, _, _, _, _, _, _, R, R],
  [R, R, R, _, _, _, _, _, _, R, R, R],
  [_, R, R, R, _, _, _, _, R, R, R, _],
  [_, _, R, R, R, _, _, R, R, R, _, _],
  [_, _, _, R, R, R, R, R, R, _, _, _],
  [_, _, _, _, R, R, R, R, _, _, _, _],
  [_, _, _, _, R, R, R, R, _, _, _, _],
  [_, _, _, R, R, R, R, R, R, _, _, _],
  [_, _, R, R, R, _, _, R, R, R, _, _],
  [_, R, R, R, _, _, _, _, R, R, R, _],
  [R, R, R, _, _, _, _, _, _, R, R, R],
  [R, R, _, _, _, _, _, _, _, _, R, R],
];

/**
 * Image B: A simple "O" pattern (12x12)
 */
const imageB: string[][] = [
  [_, _, _, R, R, R, R, R, R, _, _, _],
  [_, _, R, R, R, R, R, R, R, R, _, _],
  [_, R, R, R, _, _, _, _, R, R, R, _],
  [R, R, R, _, _, _, _, _, _, R, R, R],
  [R, R, _, _, _, _, _, _, _, _, R, R],
  [R, R, _, _, _, _, _, _, _, _, R, R],
  [R, R, _, _, _, _, _, _, _, _, R, R],
  [R, R, _, _, _, _, _, _, _, _, R, R],
  [R, R, R, _, _, _, _, _, _, R, R, R],
  [_, R, R, R, _, _, _, _, R, R, R, _],
  [_, _, R, R, R, R, R, R, R, R, _, _],
  [_, _, _, R, R, R, R, R, R, _, _, _],
];

/**
 * Image C: Up Arrow (12x12)
 */
const imageC: string[][] = [
  [_, _, _, _, _, B, B, _, _, _, _, _],
  [_, _, _, _, B, B, B, B, _, _, _, _],
  [_, _, _, B, B, B, B, B, B, _, _, _],
  [_, _, B, B, B, B, B, B, B, B, _, _],
  [_, B, B, B, B, B, B, B, B, B, B, _],
  [B, B, B, B, B, B, B, B, B, B, B, B],
  [_, _, _, _, B, B, B, B, _, _, _, _],
  [_, _, _, _, B, B, B, B, _, _, _, _],
  [_, _, _, _, B, B, B, B, _, _, _, _],
  [_, _, _, _, B, B, B, B, _, _, _, _],
  [_, _, _, _, B, B, B, B, _, _, _, _],
  [_, _, _, _, B, B, B, B, _, _, _, _],
];

/**
 * Image D: Down Arrow (12x12)
 */
const imageD: string[][] = [
  [_, _, _, _, B, B, B, B, _, _, _, _],
  [_, _, _, _, B, B, B, B, _, _, _, _],
  [_, _, _, _, B, B, B, B, _, _, _, _],
  [_, _, _, _, B, B, B, B, _, _, _, _],
  [_, _, _, _, B, B, B, B, _, _, _, _],
  [_, _, _, _, B, B, B, B, _, _, _, _],
  [B, B, B, B, B, B, B, B, B, B, B, B],
  [_, B, B, B, B, B, B, B, B, B, B, _],
  [_, _, B, B, B, B, B, B, B, B, _, _],
  [_, _, _, B, B, B, B, B, B, _, _, _],
  [_, _, _, _, B, B, B, B, _, _, _, _],
  [_, _, _, _, _, B, B, _, _, _, _, _],
];

/**
 * Image E: Smiley Face (12x12)
 */
const imageE: string[][] = [
  [_, _, _, Y, Y, Y, Y, Y, Y, _, _, _],
  [_, _, Y, Y, Y, Y, Y, Y, Y, Y, _, _],
  [_, Y, Y, Y, Y, Y, Y, Y, Y, Y, Y, _],
  [Y, Y, Y, _, _, Y, Y, _, _, Y, Y, Y],
  [Y, Y, Y, _, _, Y, Y, _, _, Y, Y, Y],
  [Y, Y, Y, Y, Y, Y, Y, Y, Y, Y, Y, Y],
  [Y, Y, Y, Y, Y, Y, Y, Y, Y, Y, Y, Y],
  [Y, Y, _, Y, Y, Y, Y, Y, Y, _, Y, Y],
  [Y, Y, Y, _, Y, Y, Y, Y, _, Y, Y, Y],
  [_, Y, Y, Y, _, _, _, _, Y, Y, Y, _],
  [_, _, Y, Y, Y, Y, Y, Y, Y, Y, _, _],
  [_, _, _, Y, Y, Y, Y, Y, Y, _, _, _],
];

/**
 * Image F: Sad Face (12x12)
 */
const imageF: string[][] = [
  [_, _, _, Y, Y, Y, Y, Y, Y, _, _, _],
  [_, _, Y, Y, Y, Y, Y, Y, Y, Y, _, _],
  [_, Y, Y, Y, Y, Y, Y, Y, Y, Y, Y, _],
  [Y, Y, Y, _, _, Y, Y, _, _, Y, Y, Y],
  [Y, Y, Y, _, _, Y, Y, _, _, Y, Y, Y],
  [Y, Y, Y, Y, Y, Y, Y, Y, Y, Y, Y, Y],
  [Y, Y, Y, Y, Y, Y, Y, Y, Y, Y, Y, Y],
  [Y, Y, Y, _, Y, Y, Y, Y, _, Y, Y, Y],
  [Y, Y, _, Y, Y, Y, Y, Y, Y, _, Y, Y],
  [_, Y, Y, Y, _, _, _, _, Y, Y, Y, _],
  [_, _, Y, Y, Y, Y, Y, Y, Y, Y, _, _],
  [_, _, _, Y, Y, Y, Y, Y, Y, _, _, _],
];

// Generate puzzles using the matching algorithm
let xoPuzzle: Puzzle;
let arrowPuzzle: Puzzle;
let facePuzzle: Puzzle;

try {
  // X vs O puzzle
  const xoMatch = matchImages(imageA, imageB, 3);
  xoPuzzle = createPuzzleFromMatch(xoMatch, 'X Pattern', 'O Pattern', 'generated-xo') as Puzzle;
  console.log(`X/O Puzzle - Average similarity: ${(xoMatch.totalSimilarity * 100).toFixed(1)}%`);

  // Arrow puzzle
  const arrowMatch = matchImages(imageC, imageD, 3);
  arrowPuzzle = createPuzzleFromMatch(arrowMatch, 'Up Arrow', 'Down Arrow', 'generated-arrow') as Puzzle;
  console.log(`Arrow Puzzle - Average similarity: ${(arrowMatch.totalSimilarity * 100).toFixed(1)}%`);

  // Face puzzle
  const faceMatch = matchImages(imageE, imageF, 3);
  facePuzzle = createPuzzleFromMatch(faceMatch, 'Happy Face', 'Sad Face', 'generated-face') as Puzzle;
  console.log(`Face Puzzle - Average similarity: ${(faceMatch.totalSimilarity * 100).toFixed(1)}%`);
} catch (e) {
  console.error('Failed to generate puzzles:', e);
  // Fallback puzzles
  xoPuzzle = {
    id: 'generated-xo',
    name: 'X ↔ O',
    gridSize: 3,
    tiles: [],
    solutionA: [],
    solutionB: [],
    imageA: 'X Pattern',
    imageB: 'O Pattern',
  };
  arrowPuzzle = { ...xoPuzzle, id: 'generated-arrow', name: 'Arrow' };
  facePuzzle = { ...xoPuzzle, id: 'generated-face', name: 'Face' };
}

export { xoPuzzle, arrowPuzzle, facePuzzle };
