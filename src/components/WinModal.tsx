interface WinModalProps {
  isOpen: boolean;
  solvedImage: string;
  moveCount: number;
  onPlayAgain: () => void;
  onClose: () => void;
}

export function WinModal({
  isOpen,
  solvedImage,
  moveCount,
  onPlayAgain,
  onClose,
}: WinModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-slate-800 rounded-2xl p-8 max-w-sm mx-4 text-center shadow-2xl animate-bounce-in">
        {/* Celebration icon */}
        <div className="text-6xl mb-4">🎉</div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-2">
          Puzzle Solved!
        </h2>

        {/* Details */}
        <p className="text-slate-300 mb-1">
          You completed: <span className="text-indigo-400 font-medium">{solvedImage}</span>
        </p>
        <p className="text-slate-400 text-sm mb-6">
          in <span className="font-mono text-white">{moveCount}</span> moves
        </p>

        {/* Buttons */}
        <div className="flex gap-3 justify-center">
          <button
            onClick={onPlayAgain}
            className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
          >
            Play Again
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
