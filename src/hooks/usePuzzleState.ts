import { useState, useCallback, useMemo } from 'react';
import type { Puzzle, Tile } from '../types/puzzle';
import { shuffleUntilUnsolved } from '../utils/shuffle';
import { checkSolution, swapTiles } from '../utils/checkSolution';

export interface UsePuzzleStateReturn {
  // State
  currentArrangement: string[];
  selectedTileIndex: number | null;
  solvedA: boolean;
  solvedB: boolean;
  solved: boolean;
  moveCount: number;
  puzzle: Puzzle;

  // Actions
  selectTile: (index: number) => void;
  swapWithSelected: (index: number) => void;
  handleTileClick: (index: number) => void;
  dragSwap: (fromIndex: number, toIndex: number) => void;
  shuffleTiles: () => void;
  reset: () => void;

  // Helpers
  getTileAtPosition: (position: number) => Tile | undefined;
  getTilesInArrangement: (arrangement: string[]) => Tile[];
}

export function usePuzzleState(puzzle: Puzzle): UsePuzzleStateReturn {
  const initialArrangement = useMemo(
    () =>
      shuffleUntilUnsolved(
        puzzle.tiles.map((t) => t.id),
        puzzle.solutionA,
        puzzle.solutionB
      ),
    [puzzle]
  );

  const [currentArrangement, setCurrentArrangement] =
    useState<string[]>(initialArrangement);
  const [selectedTileIndex, setSelectedTileIndex] = useState<number | null>(
    null
  );
  const [moveCount, setMoveCount] = useState(0);

  // Check solution status
  const solutionStatus = useMemo(
    () => checkSolution(currentArrangement, puzzle.solutionA, puzzle.solutionB),
    [currentArrangement, puzzle.solutionA, puzzle.solutionB]
  );

  // Get tile by ID
  const getTileById = useCallback(
    (id: string): Tile | undefined => puzzle.tiles.find((t) => t.id === id),
    [puzzle.tiles]
  );

  // Get tile at a specific position in current arrangement
  const getTileAtPosition = useCallback(
    (position: number): Tile | undefined => {
      const tileId = currentArrangement[position];
      return tileId ? getTileById(tileId) : undefined;
    },
    [currentArrangement, getTileById]
  );

  // Get tiles in a specific arrangement order
  const getTilesInArrangement = useCallback(
    (arrangement: string[]): Tile[] => {
      return arrangement
        .map((id) => getTileById(id))
        .filter((t): t is Tile => t !== undefined);
    },
    [getTileById]
  );

  // Select a tile for swap mode
  const selectTile = useCallback((index: number) => {
    setSelectedTileIndex(index);
  }, []);

  // Swap selected tile with another
  const swapWithSelected = useCallback(
    (index: number) => {
      if (selectedTileIndex === null || selectedTileIndex === index) {
        setSelectedTileIndex(null);
        return;
      }

      setCurrentArrangement((prev) => swapTiles(prev, selectedTileIndex, index));
      setMoveCount((prev) => prev + 1);
      setSelectedTileIndex(null);
    },
    [selectedTileIndex]
  );

  // Handle tile click (for click-to-swap mode)
  const handleTileClick = useCallback(
    (index: number) => {
      if (selectedTileIndex === null) {
        selectTile(index);
      } else {
        swapWithSelected(index);
      }
    },
    [selectedTileIndex, selectTile, swapWithSelected]
  );

  // Drag and drop swap
  const dragSwap = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    setCurrentArrangement((prev) => swapTiles(prev, fromIndex, toIndex));
    setMoveCount((prev) => prev + 1);
    setSelectedTileIndex(null);
  }, []);

  // Shuffle tiles
  const shuffleTiles = useCallback(() => {
    setCurrentArrangement(
      shuffleUntilUnsolved(
        puzzle.tiles.map((t) => t.id),
        puzzle.solutionA,
        puzzle.solutionB
      )
    );
    setMoveCount(0);
    setSelectedTileIndex(null);
  }, [puzzle]);

  // Reset to initial shuffled state
  const reset = useCallback(() => {
    setCurrentArrangement(initialArrangement);
    setMoveCount(0);
    setSelectedTileIndex(null);
  }, [initialArrangement]);

  return {
    currentArrangement,
    selectedTileIndex,
    solvedA: solutionStatus.solvedA,
    solvedB: solutionStatus.solvedB,
    solved: solutionStatus.solved,
    moveCount,
    puzzle,
    selectTile,
    swapWithSelected,
    handleTileClick,
    dragSwap,
    shuffleTiles,
    reset,
    getTileAtPosition,
    getTilesInArrangement,
  };
}
