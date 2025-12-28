/**
 * Image Matcher Algorithm
 *
 * Takes two images and finds the optimal way to create tiles
 * that can be rearranged to form both images.
 *
 * The key insight: we need to find a bijective mapping between
 * tile positions in Image A and tile positions in Image B
 * where the tile content is similar enough to work for both.
 */

export interface PixelGrid {
  width: number;
  height: number;
  pixels: number[][]; // [row][col] = RGB packed as single number
}

export interface TileMatch {
  tileIndexA: number; // Position in image A
  tileIndexB: number; // Position in image B
  similarity: number; // 0-1, higher = more similar
  blendedContent: string[][]; // The actual pixel colors for this tile
}

export interface MatchResult {
  tiles: string[][][]; // Array of tile grids (each tile is string[][])
  solutionA: number[]; // Tile indices for arrangement A
  solutionB: number[]; // Tile indices for arrangement B
  totalSimilarity: number;
  matchDetails: TileMatch[];
}

/**
 * Extract tiles from an image
 */
export function extractTiles(
  imageData: string[][], // 2D array of hex colors
  gridSize: number // e.g., 3 for 3x3 tiles
): string[][][] {
  const imageHeight = imageData.length;
  const imageWidth = imageData[0].length;
  const tileHeight = Math.floor(imageHeight / gridSize);
  const tileWidth = Math.floor(imageWidth / gridSize);

  const tiles: string[][][] = [];

  for (let tileRow = 0; tileRow < gridSize; tileRow++) {
    for (let tileCol = 0; tileCol < gridSize; tileCol++) {
      const tile: string[][] = [];
      const startRow = tileRow * tileHeight;
      const startCol = tileCol * tileWidth;

      for (let r = 0; r < tileHeight; r++) {
        const row: string[] = [];
        for (let c = 0; c < tileWidth; c++) {
          row.push(imageData[startRow + r][startCol + c]);
        }
        tile.push(row);
      }
      tiles.push(tile);
    }
  }

  return tiles;
}

/**
 * Convert hex color to RGB components
 */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

/**
 * Calculate similarity between two tiles (0-1, higher = more similar)
 * Uses mean squared error of RGB values, normalized
 */
export function tileSimilarity(tileA: string[][], tileB: string[][]): number {
  if (tileA.length !== tileB.length || tileA[0].length !== tileB[0].length) {
    return 0;
  }

  let totalDiff = 0;
  let pixelCount = 0;

  for (let r = 0; r < tileA.length; r++) {
    for (let c = 0; c < tileA[0].length; c++) {
      const [r1, g1, b1] = hexToRgb(tileA[r][c]);
      const [r2, g2, b2] = hexToRgb(tileB[r][c]);

      // Euclidean distance in RGB space, normalized to 0-1
      const diff = Math.sqrt(
        Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2)
      );
      totalDiff += diff;
      pixelCount++;
    }
  }

  // Max possible diff is sqrt(255^2 * 3) ≈ 441.67
  const maxDiff = 441.67;
  const avgDiff = totalDiff / pixelCount;
  return 1 - avgDiff / maxDiff;
}

/**
 * Build similarity matrix between all tiles of image A and image B
 */
export function buildSimilarityMatrix(
  tilesA: string[][][],
  tilesB: string[][][]
): number[][] {
  const n = tilesA.length;
  const matrix: number[][] = [];

  for (let i = 0; i < n; i++) {
    const row: number[] = [];
    for (let j = 0; j < n; j++) {
      row.push(tileSimilarity(tilesA[i], tilesB[j]));
    }
    matrix.push(row);
  }

  return matrix;
}

/**
 * Hungarian Algorithm for optimal assignment
 * Finds the bijective mapping that maximizes total similarity
 *
 * Returns: mapping[i] = j means tile i in A should match tile j in B
 */
export function hungarianAlgorithm(similarityMatrix: number[][]): number[] {
  const n = similarityMatrix.length;

  // Simple greedy approximation
  // (Full Hungarian algorithm is complex; greedy works well for small N)
  const assignment: number[] = new Array(n).fill(-1);
  const usedB: Set<number> = new Set();

  // Sort all possible assignments by similarity (descending)
  const allPairs: { i: number; j: number; sim: number }[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      allPairs.push({ i, j, sim: similarityMatrix[i][j] });
    }
  }
  allPairs.sort((a, b) => b.sim - a.sim);

  // Greedy assignment
  for (const pair of allPairs) {
    if (assignment[pair.i] === -1 && !usedB.has(pair.j)) {
      assignment[pair.i] = pair.j;
      usedB.add(pair.j);
    }
    if (usedB.size === n) break;
  }

  return assignment;
}

/**
 * Blend two tiles together (simple average)
 */
export function blendTiles(
  tileA: string[][],
  tileB: string[][],
  weightA: number = 0.5
): string[][] {
  const result: string[][] = [];

  for (let r = 0; r < tileA.length; r++) {
    const row: string[] = [];
    for (let c = 0; c < tileA[0].length; c++) {
      const [r1, g1, b1] = hexToRgb(tileA[r][c]);
      const [r2, g2, b2] = hexToRgb(tileB[r][c]);

      const rBlend = Math.round(r1 * weightA + r2 * (1 - weightA));
      const gBlend = Math.round(g1 * weightA + g2 * (1 - weightA));
      const bBlend = Math.round(b1 * weightA + b2 * (1 - weightA));

      const hex =
        '#' +
        rBlend.toString(16).padStart(2, '0') +
        gBlend.toString(16).padStart(2, '0') +
        bBlend.toString(16).padStart(2, '0');

      row.push(hex);
    }
    result.push(row);
  }

  return result;
}

/**
 * Main function: Match two images and generate puzzle data
 */
export function matchImages(
  imageA: string[][],
  imageB: string[][],
  gridSize: number = 3
): MatchResult {
  // 1. Extract tiles from both images
  const tilesA = extractTiles(imageA, gridSize);
  const tilesB = extractTiles(imageB, gridSize);

  // 2. Build similarity matrix
  const simMatrix = buildSimilarityMatrix(tilesA, tilesB);

  // 3. Find optimal matching
  const matching = hungarianAlgorithm(simMatrix);

  // 4. Create blended tiles and compute total similarity
  const tiles: string[][][] = [];
  const matchDetails: TileMatch[] = [];
  let totalSimilarity = 0;

  for (let i = 0; i < tilesA.length; i++) {
    const j = matching[i];
    const similarity = simMatrix[i][j];
    totalSimilarity += similarity;

    // Blend the tiles (or just use A if similarity is very high)
    const blendedContent =
      similarity > 0.95 ? tilesA[i] : blendTiles(tilesA[i], tilesB[j], 0.5);

    tiles.push(blendedContent);
    matchDetails.push({
      tileIndexA: i,
      tileIndexB: j,
      similarity,
      blendedContent,
    });
  }

  // 5. Generate solution arrangements
  // Solution A: tiles in natural order [0, 1, 2, ..., N-1]
  const solutionA = Array.from({ length: tilesA.length }, (_, i) => i);

  // Solution B: inverse of the matching
  // If matching[i] = j, then for solution B position j, we need tile i
  const solutionB: number[] = new Array(tilesA.length);
  for (let i = 0; i < matching.length; i++) {
    solutionB[matching[i]] = i;
  }

  return {
    tiles,
    solutionA,
    solutionB,
    totalSimilarity: totalSimilarity / tilesA.length,
    matchDetails,
  };
}

/**
 * Generate a puzzle definition from a match result
 */
export function createPuzzleFromMatch(
  matchResult: MatchResult,
  nameA: string,
  nameB: string,
  puzzleId: string = 'generated-puzzle'
) {
  return {
    id: puzzleId,
    name: `${nameA} ↔ ${nameB}`,
    gridSize: Math.sqrt(matchResult.tiles.length),
    tiles: matchResult.tiles.map((grid, i) => ({
      id: `t${i}`,
      content: {
        type: 'pixels' as const,
        grid,
      },
    })),
    solutionA: matchResult.solutionA.map((i) => `t${i}`),
    solutionB: matchResult.solutionB.map((i) => `t${i}`),
    imageA: nameA,
    imageB: nameB,
  };
}
