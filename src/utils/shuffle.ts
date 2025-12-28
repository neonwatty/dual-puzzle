/**
 * Fisher-Yates shuffle algorithm
 * Returns a new shuffled array without mutating the original
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Shuffle that guarantees the result is different from both solutions
 * Keeps shuffling until the arrangement doesn't match either solution
 */
export function shuffleUntilUnsolved(
  tileIds: string[],
  solutionA: string[],
  solutionB: string[],
  maxAttempts = 100
): string[] {
  let result = shuffle(tileIds);
  let attempts = 0;

  while (
    attempts < maxAttempts &&
    (arraysEqual(result, solutionA) || arraysEqual(result, solutionB))
  ) {
    result = shuffle(tileIds);
    attempts++;
  }

  return result;
}

/**
 * Check if two arrays have equal elements in the same order
 */
export function arraysEqual<T>(a: T[], b: T[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((val, idx) => val === b[idx]);
}
