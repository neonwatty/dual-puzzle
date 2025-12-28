import { Tile } from './Tile';
import type { Tile as TileType } from '../types/puzzle';

interface TargetPreviewProps {
  gridSize: number;
  arrangement: string[];
  getTilesInArrangement: (arrangement: string[]) => TileType[];
  label: string;
  isSolved: boolean;
}

export function TargetPreview({
  gridSize,
  arrangement,
  getTilesInArrangement,
  label,
  isSolved,
}: TargetPreviewProps) {
  const tiles = getTilesInArrangement(arrangement);
  const gridTemplateColumns = `repeat(${gridSize}, minmax(0, 1fr))`;

  return (
    <div
      className={`
        relative p-3 rounded-xl transition-all duration-300
        ${isSolved
          ? 'bg-green-900/50 ring-2 ring-green-400'
          : 'bg-slate-800/50'
        }
      `}
    >
      {/* Label */}
      <div className="text-center mb-2">
        <span
          className={`
            text-sm font-medium
            ${isSolved ? 'text-green-400' : 'text-slate-400'}
          `}
        >
          {label}
        </span>
      </div>

      {/* Mini grid */}
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns }}
      >
        {tiles.map((tile, index) => (
          <div key={`${tile.id}-${index}`} className="w-6 h-6 sm:w-8 sm:h-8">
            <Tile
              tile={tile}
              index={index}
              isSelected={false}
              isPreview={true}
            />
          </div>
        ))}
      </div>

      {/* Solved indicator */}
      {isSolved && (
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg
            className="w-4 h-4 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
