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
  flippedTiles: Set<string>;

  // Actions
  selectTile: (index: number) => void;
  swapWithSelected: (index: number) => void;
  handleTileClick: (index: number) => void;
  dragSwap: (fromIndex: number, toIndex: number) => void;
  flipTile: (tileId: string) => void;
  shuffleTiles: () => void;
  reset: () => void;

  // Helpers
  getTileAtPosition: (position: number) => Tile | undefined;
  getTilesInArrangement: (arrangement: string[]) => Tile[];
  isTileFlipped: (tileId: string) => boolean;
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
  const [flippedTiles, setFlippedTiles] = useState<Set<string>>(new Set());

  // Check solution status
  // For double-sided puzzles, also check if flip state is correct
  const solutionStatus = useMemo(() => {
    const arrangementCheck = checkSolution(
      currentArrangement,
      puzzle.solutionA,
      puzzle.solutionB
    );

    // For double-sided puzzles, solution A requires no flipped tiles
    // and solution B requires all tiles flipped
    if (puzzle.requiresFlip) {
      const allFlipped = puzzle.tiles.every((t) => flippedTiles.has(t.id));
      const noneFlipped = flippedTiles.size === 0;

      return {
        solvedA: arrangementCheck.solvedA && noneFlipped,
        solvedB: arrangementCheck.solvedB && allFlipped,
        solved:
          (arrangementCheck.solvedA && noneFlipped) ||
          (arrangementCheck.solvedB && allFlipped),
      };
    }

    return arrangementCheck;
  }, [currentArrangement, puzzle, flippedTiles]);

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

  // Check if a tile is flipped
  const isTileFlipped = useCallback(
    (tileId: string): boolean => flippedTiles.has(tileId),
    [flippedTiles]
  );

  // Flip a tile
  const flipTile = useCallback((tileId: string) => {
    setFlippedTiles((prev) => {
      const next = new Set(prev);
      if (next.has(tileId)) {
        next.delete(tileId);
      } else {
        next.add(tileId);
      }
      return next;
    });
    setMoveCount((prev) => prev + 1);
  }, []);

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
    setFlippedTiles(new Set());
  }, [puzzle]);

  // Reset to initial shuffled state
  const reset = useCallback(() => {
    setCurrentArrangement(initialArrangement);
    setMoveCount(0);
    setSelectedTileIndex(null);
    setFlippedTiles(new Set());
  }, [initialArrangement]);

  return {
    currentArrangement,
    selectedTileIndex,
    solvedA: solutionStatus.solvedA,
    solvedB: solutionStatus.solvedB,
    solved: solutionStatus.solved,
    moveCount,
    puzzle,
    flippedTiles,
    selectTile,
    swapWithSelected,
    handleTileClick,
    dragSwap,
    flipTile,
    shuffleTiles,
    reset,
    getTileAtPosition,
    getTilesInArrangement,
    isTileFlipped,
  };
}
