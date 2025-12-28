import { arraysEqual } from './shuffle';

export interface SolutionCheck {
  solvedA: boolean;
  solvedB: boolean;
  solved: boolean;
}

/**
 * Check if the current arrangement matches either solution
 */
export function checkSolution(
  currentArrangement: string[],
  solutionA: string[],
  solutionB: string[]
): SolutionCheck {
  const solvedA = arraysEqual(currentArrangement, solutionA);
  const solvedB = arraysEqual(currentArrangement, solutionB);

  return {
    solvedA,
    solvedB,
    solved: solvedA || solvedB,
  };
}

/**
 * Swap two elements in an array (returns new array)
 */
export function swapTiles(
  arrangement: string[],
  indexA: number,
  indexB: number
): string[] {
  const result = [...arrangement];
  [result[indexA], result[indexB]] = [result[indexB], result[indexA]];
  return result;
}
