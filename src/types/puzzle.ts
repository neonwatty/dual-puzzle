// Color tile data
export interface ColorData {
  type: 'color';
  color: string; // hex color
}

// Line tile data - edges have connection points
export type EdgePosition = 'a' | 'b'; // a = 1/3 from start, b = 2/3 from start
export type Edge = 'top' | 'right' | 'bottom' | 'left';

export interface ConnectionPoint {
  edge: Edge;
  position: EdgePosition;
}

export interface LinePath {
  from: ConnectionPoint;
  to: ConnectionPoint;
  style?: 'straight' | 'curved';
}

export interface LineData {
  type: 'lines';
  paths: LinePath[];
}

// Pixel art tile data - small grid of colored pixels
export interface PixelData {
  type: 'pixels';
  grid: string[][]; // 2D array of hex colors (e.g., 4x4 grid)
}

// Double-sided tile data - two different visuals
export interface DoubleSidedData {
  type: 'double-sided';
  faceA: ColorData | PixelData;
  faceB: ColorData | PixelData;
}

// Union type for tile content
export type TileContent = ColorData | LineData | PixelData | DoubleSidedData;

// A single puzzle tile
export interface Tile {
  id: string;
  content: TileContent;
}

// The puzzle definition
export interface Puzzle {
  id: string;
  name: string;
  gridSize: number; // 3 for 3x3
  tiles: Tile[];
  solutionA: string[]; // tile IDs in order for arrangement A
  solutionB: string[]; // tile IDs in order for arrangement B
  imageA: string; // Description/name of what arrangement A depicts
  imageB: string; // Description/name of what arrangement B depicts
  // For double-sided puzzles: which face to show for each solution
  requiresFlip?: boolean;
}

// Game state
export interface GameState {
  puzzle: Puzzle;
  currentArrangement: string[]; // tile IDs in current positions
  selectedTileIndex: number | null; // for click-swap mode
  solvedA: boolean;
  solvedB: boolean;
  moveCount: number;
  // For double-sided puzzles
  flippedTiles?: Set<string>; // tile IDs that are showing face B
}

// Helper type for getting tile at position
export type TileAtPosition = (position: number) => Tile | undefined;
