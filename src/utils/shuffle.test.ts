import { describe, it, expect } from 'vitest';
import { shuffle, shuffleUntilUnsolved, arraysEqual } from './shuffle';

describe('shuffle', () => {
  it('returns an array of the same length', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input);
    expect(result.length).toBe(input.length);
  });

  it('contains all the same elements', () => {
    const input = ['a', 'b', 'c', 'd'];
    const result = shuffle(input);
    expect(result.sort()).toEqual(input.sort());
  });

  it('does not mutate the original array', () => {
    const input = [1, 2, 3, 4, 5];
    const copy = [...input];
    shuffle(input);
    expect(input).toEqual(copy);
  });
});

describe('arraysEqual', () => {
  it('returns true for equal arrays', () => {
    expect(arraysEqual([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(arraysEqual(['a', 'b'], ['a', 'b'])).toBe(true);
    expect(arraysEqual([], [])).toBe(true);
  });

  it('returns false for different arrays', () => {
    expect(arraysEqual([1, 2, 3], [1, 2, 4])).toBe(false);
    expect(arraysEqual([1, 2, 3], [3, 2, 1])).toBe(false);
    expect(arraysEqual([1, 2], [1, 2, 3])).toBe(false);
  });
});

describe('shuffleUntilUnsolved', () => {
  it('returns an arrangement different from both solutions', () => {
    const tiles = ['a', 'b', 'c', 'd'];
    const solutionA = ['a', 'b', 'c', 'd'];
    const solutionB = ['d', 'c', 'b', 'a'];

    // Run multiple times to ensure consistency
    for (let i = 0; i < 10; i++) {
      const result = shuffleUntilUnsolved(tiles, solutionA, solutionB);
      expect(arraysEqual(result, solutionA)).toBe(false);
      expect(arraysEqual(result, solutionB)).toBe(false);
    }
  });

  it('contains all the original tile IDs', () => {
    const tiles = ['t1', 't2', 't3', 't4'];
    const solutionA = ['t1', 't2', 't3', 't4'];
    const solutionB = ['t4', 't3', 't2', 't1'];

    const result = shuffleUntilUnsolved(tiles, solutionA, solutionB);
    expect(result.sort()).toEqual(tiles.sort());
  });
});
