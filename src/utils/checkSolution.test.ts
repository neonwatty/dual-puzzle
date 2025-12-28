import { describe, it, expect } from 'vitest';
import { checkSolution, swapTiles } from './checkSolution';

describe('checkSolution', () => {
  const solutionA = ['a', 'b', 'c', 'd'];
  const solutionB = ['d', 'c', 'b', 'a'];

  it('detects when arrangement matches solution A', () => {
    const result = checkSolution(['a', 'b', 'c', 'd'], solutionA, solutionB);
    expect(result.solvedA).toBe(true);
    expect(result.solvedB).toBe(false);
    expect(result.solved).toBe(true);
  });

  it('detects when arrangement matches solution B', () => {
    const result = checkSolution(['d', 'c', 'b', 'a'], solutionA, solutionB);
    expect(result.solvedA).toBe(false);
    expect(result.solvedB).toBe(true);
    expect(result.solved).toBe(true);
  });

  it('detects when arrangement matches neither solution', () => {
    const result = checkSolution(['a', 'c', 'b', 'd'], solutionA, solutionB);
    expect(result.solvedA).toBe(false);
    expect(result.solvedB).toBe(false);
    expect(result.solved).toBe(false);
  });
});

describe('swapTiles', () => {
  it('swaps two tiles correctly', () => {
    const arrangement = ['a', 'b', 'c', 'd'];
    const result = swapTiles(arrangement, 0, 3);
    expect(result).toEqual(['d', 'b', 'c', 'a']);
  });

  it('does not mutate the original array', () => {
    const arrangement = ['a', 'b', 'c', 'd'];
    const copy = [...arrangement];
    swapTiles(arrangement, 0, 1);
    expect(arrangement).toEqual(copy);
  });

  it('handles swapping the same index (no-op)', () => {
    const arrangement = ['a', 'b', 'c'];
    const result = swapTiles(arrangement, 1, 1);
    expect(result).toEqual(['a', 'b', 'c']);
  });
});
