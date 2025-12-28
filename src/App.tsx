import { useState, useEffect } from 'react';
import { Board } from './components/Board';
import { TargetPreview } from './components/TargetPreview';
import { GameControls } from './components/GameControls';
import { WinModal } from './components/WinModal';
import { usePuzzleState } from './hooks/usePuzzleState';
import { puzzleList } from './puzzles';
import type { Puzzle } from './types/puzzle';

function PuzzleGame({ puzzle, onChangePuzzle }: { puzzle: Puzzle; onChangePuzzle: () => void }) {
  const {
    puzzle: currentPuzzle,
    currentArrangement,
    selectedTileIndex,
    solvedA,
    solvedB,
    solved,
    moveCount,
    handleTileClick,
    dragSwap,
    flipTile,
    isTileFlipped,
    shuffleTiles,
    reset,
    getTileAtPosition,
    getTilesInArrangement,
  } = usePuzzleState(puzzle);

  const [showWinModal, setShowWinModal] = useState(false);
  const [winImage, setWinImage] = useState('');

  // Show win modal when solved
  useEffect(() => {
    if (solved && !showWinModal) {
      const image = solvedA ? currentPuzzle.imageA : currentPuzzle.imageB;
      setWinImage(image);
      const timer = setTimeout(() => setShowWinModal(true), 300);
      return () => clearTimeout(timer);
    }
  }, [solved, solvedA, currentPuzzle.imageA, currentPuzzle.imageB, showWinModal]);

  const handlePlayAgain = () => {
    setShowWinModal(false);
    shuffleTiles();
  };

  // Dynamic instructions based on puzzle type
  const getInstructions = () => {
    if (currentPuzzle.requiresFlip) {
      return (
        <>
          <p>Click to select, click again to swap. Double-click to flip.</p>
          <p className="mt-1">Flip all tiles and arrange for the second solution!</p>
        </>
      );
    }
    return (
      <>
        <p>Click two tiles to swap them, or drag and drop.</p>
        <p className="mt-1">This puzzle has two solutions!</p>
      </>
    );
  };

  return (
    <>
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">{currentPuzzle.name}</h1>
        <p className="text-slate-400">
          Arrange the tiles to match either pattern
        </p>
      </header>

      {/* Target previews */}
      <div className="flex gap-6 mb-8">
        <TargetPreview
          gridSize={currentPuzzle.gridSize}
          arrangement={currentPuzzle.solutionA}
          getTilesInArrangement={getTilesInArrangement}
          label={currentPuzzle.imageA}
          isSolved={solvedA}
        />
        <TargetPreview
          gridSize={currentPuzzle.gridSize}
          arrangement={currentPuzzle.solutionB}
          getTilesInArrangement={getTilesInArrangement}
          label={currentPuzzle.imageB}
          isSolved={solvedB}
        />
      </div>

      {/* Main puzzle board */}
      <div className="mb-8">
        <Board
          gridSize={currentPuzzle.gridSize}
          arrangement={currentArrangement}
          getTileAtPosition={getTileAtPosition}
          selectedTileIndex={selectedTileIndex}
          onTileClick={handleTileClick}
          onDragSwap={dragSwap}
          onFlipTile={currentPuzzle.requiresFlip ? flipTile : undefined}
          isTileFlipped={isTileFlipped}
        />
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-4">
        <GameControls
          onShuffle={shuffleTiles}
          onReset={reset}
          moveCount={moveCount}
          isSolved={solved}
        />
        <button
          onClick={onChangePuzzle}
          className="px-4 py-2 rounded-lg font-medium text-sm bg-indigo-600 hover:bg-indigo-500 text-white transition-all"
        >
          Next Puzzle
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-8 text-center text-slate-500 text-sm max-w-md">
        {getInstructions()}
      </div>

      {/* Win modal */}
      <WinModal
        isOpen={showWinModal}
        solvedImage={winImage}
        moveCount={moveCount}
        onPlayAgain={handlePlayAgain}
        onClose={() => setShowWinModal(false)}
      />
    </>
  );
}

function App() {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const currentPuzzle = puzzleList[puzzleIndex];

  const handleNextPuzzle = () => {
    setPuzzleIndex((prev) => (prev + 1) % puzzleList.length);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      {/* Key forces remount when puzzle changes */}
      <PuzzleGame
        key={currentPuzzle.id}
        puzzle={currentPuzzle}
        onChangePuzzle={handleNextPuzzle}
      />
    </div>
  );
}

export default App;
