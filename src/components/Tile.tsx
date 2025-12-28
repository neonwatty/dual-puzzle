import { useRef } from 'react';
import type { Tile as TileType, ColorData, LineData } from '../types/puzzle';

interface TileProps {
  tile: TileType;
  index: number;
  isSelected: boolean;
  isDragging?: boolean;
  isPreview?: boolean;
  onClick?: () => void;
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
  onClick,
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

  const renderContent = () => {
    if (tile.content.type === 'color') {
      const colorData = tile.content as ColorData;
      return (
        <div
          className="w-full h-full rounded-lg"
          style={{ backgroundColor: colorData.color }}
        />
      );
    }

    if (tile.content.type === 'lines') {
      const lineData = tile.content as LineData;
      return <LineTileContent data={lineData} />;
    }

    return null;
  };

  const baseClasses = `
    aspect-square rounded-lg transition-all duration-150 overflow-hidden
    ${isPreview ? '' : 'cursor-pointer hover:scale-105'}
    ${isSelected ? 'ring-4 ring-white ring-offset-2 ring-offset-slate-900 scale-105' : ''}
    ${isDragging ? 'opacity-50' : 'opacity-100'}
  `;

  return (
    <div
      ref={dragRef}
      className={baseClasses}
      draggable={!isPreview}
      onClick={!isPreview ? onClick : undefined}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {renderContent()}
    </div>
  );
}

// Line tile renderer (for MVP2)
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
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    );
  });

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full text-indigo-400"
      preserveAspectRatio="xMidYMid meet"
    >
      <rect width="100" height="100" fill="#1e293b" />
      {paths}
    </svg>
  );
}
