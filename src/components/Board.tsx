import { useState } from 'react';
import { Tile } from './Tile';
import type { Tile as TileType } from '../types/puzzle';

interface BoardProps {
  gridSize: number;
  arrangement: string[];
  getTileAtPosition: (position: number) => TileType | undefined;
  selectedTileIndex: number | null;
  onTileClick: (index: number) => void;
  onDragSwap: (fromIndex: number, toIndex: number) => void;
  onFlipTile?: (tileId: string) => void;
  isTileFlipped?: (tileId: string) => boolean;
}

export function Board({
  gridSize,
  arrangement,
  getTileAtPosition,
  selectedTileIndex,
  onTileClick,
  onDragSwap,
  onFlipTile,
  isTileFlipped,
}: BoardProps) {
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggingIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (toIndex: number) => {
    if (draggingIndex !== null && draggingIndex !== toIndex) {
      onDragSwap(draggingIndex, toIndex);
    }
    setDraggingIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggingIndex(null);
    setDragOverIndex(null);
  };

  const gridTemplateColumns = `repeat(${gridSize}, minmax(0, 1fr))`;

  return (
    <div
      className="grid gap-2 p-4 bg-slate-800 rounded-xl shadow-2xl w-72 sm:w-80 md:w-96"
      style={{ gridTemplateColumns }}
      onDragEnd={handleDragEnd}
    >
      {arrangement.map((_, index) => {
        const tile = getTileAtPosition(index);
        if (!tile) return null;

        const isSelected = selectedTileIndex === index;
        const isDragging = draggingIndex === index;
        const isDragOver = dragOverIndex === index && draggingIndex !== index;

        return (
          <div
            key={tile.id}
            className={`
              transition-transform duration-150
              ${isDragOver ? 'scale-95 opacity-70' : ''}
            `}
          >
            <Tile
              tile={tile}
              index={index}
              isSelected={isSelected}
              isDragging={isDragging}
              isFlipped={isTileFlipped?.(tile.id) ?? false}
              onClick={() => onTileClick(index)}
              onFlip={onFlipTile ? () => onFlipTile(tile.id) : undefined}
              onDragStart={handleDragStart}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={handleDrop}
            />
          </div>
        );
      })}
    </div>
  );
}
