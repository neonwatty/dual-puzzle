import { useRef } from 'react';
import type {
  Tile as TileType,
  ColorData,
  LineData,
  PixelData,
  DoubleSidedData,
} from '../types/puzzle';

interface TileProps {
  tile: TileType;
  index: number;
  isSelected: boolean;
  isDragging?: boolean;
  isPreview?: boolean;
  isFlipped?: boolean;
  onClick?: () => void;
  onFlip?: () => void;
  onDragStart?: (index: number) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (index: number) => void;
}

export function Tile({
  tile,
  index,
  isSelected,
  isDragging = false,
  isPreview = false,
  isFlipped = false,
  onClick,
  onFlip,
  onDragStart,
  onDragOver,
  onDrop,
}: TileProps) {
  const dragRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    if (isPreview) return;
    e.dataTransfer.setData('text/plain', String(index));
    e.dataTransfer.effectAllowed = 'move';
    onDragStart?.(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (isPreview) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    onDragOver?.(e);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (isPreview) return;
    e.preventDefault();
    onDrop?.(index);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (isPreview || !onFlip) return;
    e.stopPropagation();
    onFlip();
  };

  const renderContent = () => {
    if (tile.content.type === 'color') {
      return <ColorTileContent data={tile.content as ColorData} />;
    }

    if (tile.content.type === 'lines') {
      return <LineTileContent data={tile.content as LineData} />;
    }

    if (tile.content.type === 'pixels') {
      return <PixelTileContent data={tile.content as PixelData} />;
    }

    if (tile.content.type === 'double-sided') {
      const data = tile.content as DoubleSidedData;
      const face = isFlipped ? data.faceB : data.faceA;

      return (
        <div className="relative w-full h-full">
          {face.type === 'color' && <ColorTileContent data={face} />}
          {face.type === 'pixels' && <PixelTileContent data={face} />}
          {/* Flip indicator */}
          {!isPreview && (
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-white/20 rounded-full flex items-center justify-center pointer-events-none">
              <span className="text-[8px] text-white/60">↻</span>
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  const baseClasses = `
    aspect-square rounded-lg transition-all duration-150 overflow-hidden
    ${isPreview ? '' : 'cursor-pointer hover:scale-105'}
    ${isSelected ? 'ring-4 ring-white ring-offset-2 ring-offset-slate-900 scale-105' : ''}
    ${isDragging ? 'opacity-50' : 'opacity-100'}
    ${isFlipped ? 'ring-2 ring-amber-400/50' : ''}
  `;

  return (
    <div
      ref={dragRef}
      className={baseClasses}
      draggable={!isPreview}
      onClick={!isPreview ? onClick : undefined}
      onDoubleClick={handleDoubleClick}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {renderContent()}
    </div>
  );
}

// Color tile renderer
function ColorTileContent({ data }: { data: ColorData }) {
  return (
    <div
      className="w-full h-full rounded-lg pointer-events-none"
      style={{ backgroundColor: data.color }}
    />
  );
}

// Pixel art tile renderer
function PixelTileContent({ data }: { data: PixelData }) {
  const gridSize = data.grid.length;

  return (
    <div
      className="w-full h-full grid pointer-events-none"
      style={{
        gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        gridTemplateRows: `repeat(${gridSize}, 1fr)`,
      }}
    >
      {data.grid.flat().map((color, i) => (
        <div key={i} style={{ backgroundColor: color }} />
      ))}
    </div>
  );
}

// Line tile renderer
function LineTileContent({ data }: { data: LineData }) {
  const getEdgePoint = (
    edge: 'top' | 'right' | 'bottom' | 'left',
    position: 'a' | 'b'
  ): [number, number] => {
    const offset = position === 'a' ? 33.3 : 66.6;
    switch (edge) {
      case 'top':
        return [offset, 0];
      case 'right':
        return [100, offset];
      case 'bottom':
        return [offset, 100];
      case 'left':
        return [0, offset];
    }
  };

  const paths = data.paths.map((path, i) => {
    const [x1, y1] = getEdgePoint(path.from.edge, path.from.position);
    const [x2, y2] = getEdgePoint(path.to.edge, path.to.position);

    // Calculate control point for curved paths
    const cx = 50;
    const cy = 50;

    const d =
      path.style === 'curved'
        ? `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`
        : `M ${x1} ${y1} L ${x2} ${y2}`;

    return (
      <path
        key={i}
        d={d}
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
    );
  });

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full text-cyan-400 pointer-events-none"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect width="100" height="100" fill="#1e293b" />
      {paths}
    </svg>
  );
}
