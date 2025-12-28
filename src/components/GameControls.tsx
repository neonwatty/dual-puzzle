interface GameControlsProps {
  onShuffle: () => void;
  onReset: () => void;
  moveCount: number;
  isSolved: boolean;
}

export function GameControls({
  onShuffle,
  onReset,
  moveCount,
  isSolved,
}: GameControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      {/* Move counter */}
      <div className="text-slate-400 text-sm">
        Moves: <span className="font-mono text-white">{moveCount}</span>
      </div>

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={onShuffle}
          disabled={isSolved}
          className={`
            px-4 py-2 rounded-lg font-medium text-sm transition-all
            ${isSolved
              ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
              : 'bg-slate-700 hover:bg-slate-600 text-white'
            }
          `}
        >
          Shuffle
        </button>
        <button
          onClick={onReset}
          className="px-4 py-2 rounded-lg font-medium text-sm bg-slate-700 hover:bg-slate-600 text-white transition-all"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
