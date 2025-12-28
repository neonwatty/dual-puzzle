/**
 * Image Matcher Algorithm
 *
 * Takes two images and finds the optimal way to create tiles
 * that can be rearranged to form both images.
 *
 * The key insight: we need to find a bijective mapping between
 * tile positions in Image A and tile positions in Image B
 * where the tile content is similar enough to work for both.
 *
 * Enhanced with color normalization to make any two images work together.
 */

export interface PixelGrid {
  width: number;
  height: number;
  pixels: number[][]; // [row][col] = RGB packed as single number
}

export interface ColorHistogram {
  r: number[]; // 256 bins for red channel
  g: number[]; // 256 bins for green channel
  b: number[]; // 256 bins for blue channel
  totalPixels: number;
}

export interface NormalizationOptions {
  method: 'histogram' | 'palette' | 'luminance';
  paletteSize?: number; // For palette method, default 16
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
export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16),
    parseInt(h.substring(2, 4), 16),
    parseInt(h.substring(4, 6), 16),
  ];
}

/**
 * Convert RGB to hex color
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return (
    '#' +
    Math.round(Math.max(0, Math.min(255, r))).toString(16).padStart(2, '0') +
    Math.round(Math.max(0, Math.min(255, g))).toString(16).padStart(2, '0') +
    Math.round(Math.max(0, Math.min(255, b))).toString(16).padStart(2, '0')
  );
}

/**
 * Calculate luminance of an RGB color (0-255)
 */
export function getLuminance(r: number, g: number, b: number): number {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/**
 * Extract color histogram from an image
 */
export function extractHistogram(image: string[][]): ColorHistogram {
  const r = new Array(256).fill(0);
  const g = new Array(256).fill(0);
  const b = new Array(256).fill(0);
  let totalPixels = 0;

  for (const row of image) {
    for (const pixel of row) {
      const [rVal, gVal, bVal] = hexToRgb(pixel);
      r[rVal]++;
      g[gVal]++;
      b[bVal]++;
      totalPixels++;
    }
  }

  return { r, g, b, totalPixels };
}

/**
 * Build cumulative distribution function from histogram
 */
function buildCDF(histogram: number[], totalPixels: number): number[] {
  const cdf = new Array(256).fill(0);
  let cumsum = 0;
  for (let i = 0; i < 256; i++) {
    cumsum += histogram[i];
    cdf[i] = cumsum / totalPixels;
  }
  return cdf;
}

/**
 * Create a mapping to match one histogram to another using histogram matching
 */
function createHistogramMapping(
  sourceCDF: number[],
  targetCDF: number[]
): number[] {
  const mapping = new Array(256).fill(0);

  for (let srcVal = 0; srcVal < 256; srcVal++) {
    const srcCdfVal = sourceCDF[srcVal];
    // Find the target value with the closest CDF value
    let bestMatch = 0;
    let bestDiff = Math.abs(targetCDF[0] - srcCdfVal);

    for (let tgtVal = 1; tgtVal < 256; tgtVal++) {
      const diff = Math.abs(targetCDF[tgtVal] - srcCdfVal);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestMatch = tgtVal;
      }
    }
    mapping[srcVal] = bestMatch;
  }

  return mapping;
}

/**
 * Apply histogram matching to transform image A's colors to match image B's distribution
 */
export function matchHistograms(
  source: string[][],
  target: string[][]
): string[][] {
  const sourceHist = extractHistogram(source);
  const targetHist = extractHistogram(target);

  // Build CDFs for each channel
  const sourceCdfR = buildCDF(sourceHist.r, sourceHist.totalPixels);
  const sourceCdfG = buildCDF(sourceHist.g, sourceHist.totalPixels);
  const sourceCdfB = buildCDF(sourceHist.b, sourceHist.totalPixels);

  const targetCdfR = buildCDF(targetHist.r, targetHist.totalPixels);
  const targetCdfG = buildCDF(targetHist.g, targetHist.totalPixels);
  const targetCdfB = buildCDF(targetHist.b, targetHist.totalPixels);

  // Create mappings for each channel
  const mappingR = createHistogramMapping(sourceCdfR, targetCdfR);
  const mappingG = createHistogramMapping(sourceCdfG, targetCdfG);
  const mappingB = createHistogramMapping(sourceCdfB, targetCdfB);

  // Apply mappings to source image
  const result: string[][] = [];
  for (const row of source) {
    const newRow: string[] = [];
    for (const pixel of row) {
      const [r, g, b] = hexToRgb(pixel);
      newRow.push(rgbToHex(mappingR[r], mappingG[g], mappingB[b]));
    }
    result.push(newRow);
  }

  return result;
}

/**
 * Extract dominant colors from an image using k-means clustering
 */
export function extractPalette(
  image: string[][],
  paletteSize: number = 16
): string[] {
  // Collect all unique colors with their frequency
  const colorCounts = new Map<string, number>();
  for (const row of image) {
    for (const pixel of row) {
      colorCounts.set(pixel, (colorCounts.get(pixel) || 0) + 1);
    }
  }

  // If we have fewer unique colors than palette size, return all of them
  const uniqueColors = Array.from(colorCounts.keys());
  if (uniqueColors.length <= paletteSize) {
    return uniqueColors;
  }

  // Simple k-means initialization: pick colors with highest frequency
  const sortedByFreq = Array.from(colorCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([color]) => color);

  // Initialize centroids with most frequent colors
  let centroids: [number, number, number][] = sortedByFreq
    .slice(0, paletteSize)
    .map((hex) => hexToRgb(hex));

  // K-means iterations
  const allPixels: [number, number, number][] = [];
  for (const row of image) {
    for (const pixel of row) {
      allPixels.push(hexToRgb(pixel));
    }
  }

  for (let iter = 0; iter < 10; iter++) {
    // Assign pixels to nearest centroid
    const clusters: [number, number, number][][] = centroids.map(() => []);

    for (const pixel of allPixels) {
      let bestCluster = 0;
      let bestDist = Infinity;

      for (let c = 0; c < centroids.length; c++) {
        const dist =
          Math.pow(pixel[0] - centroids[c][0], 2) +
          Math.pow(pixel[1] - centroids[c][1], 2) +
          Math.pow(pixel[2] - centroids[c][2], 2);
        if (dist < bestDist) {
          bestDist = dist;
          bestCluster = c;
        }
      }
      clusters[bestCluster].push(pixel);
    }

    // Update centroids
    centroids = clusters.map((cluster, i) => {
      if (cluster.length === 0) return centroids[i];
      const sum = cluster.reduce(
        (acc, pixel) => [acc[0] + pixel[0], acc[1] + pixel[1], acc[2] + pixel[2]],
        [0, 0, 0]
      );
      return [
        Math.round(sum[0] / cluster.length),
        Math.round(sum[1] / cluster.length),
        Math.round(sum[2] / cluster.length),
      ] as [number, number, number];
    });
  }

  return centroids.map(([r, g, b]) => rgbToHex(r, g, b));
}

/**
 * Find a shared palette between two images
 */
export function findSharedPalette(
  imageA: string[][],
  imageB: string[][],
  paletteSize: number = 16
): string[] {
  // Extract palettes from both images
  const paletteA = extractPalette(imageA, paletteSize);
  const paletteB = extractPalette(imageB, paletteSize);

  // Merge and re-cluster to find shared palette
  const allColors = [...paletteA, ...paletteB];

  // K-means on combined palette
  let centroids: [number, number, number][] = allColors
    .slice(0, paletteSize)
    .map((hex) => hexToRgb(hex));

  const allRgb = allColors.map((hex) => hexToRgb(hex));

  for (let iter = 0; iter < 10; iter++) {
    const clusters: [number, number, number][][] = centroids.map(() => []);

    for (const pixel of allRgb) {
      let bestCluster = 0;
      let bestDist = Infinity;

      for (let c = 0; c < centroids.length; c++) {
        const dist =
          Math.pow(pixel[0] - centroids[c][0], 2) +
          Math.pow(pixel[1] - centroids[c][1], 2) +
          Math.pow(pixel[2] - centroids[c][2], 2);
        if (dist < bestDist) {
          bestDist = dist;
          bestCluster = c;
        }
      }
      clusters[bestCluster].push(pixel);
    }

    centroids = clusters.map((cluster, i) => {
      if (cluster.length === 0) return centroids[i];
      const sum = cluster.reduce(
        (acc, pixel) => [acc[0] + pixel[0], acc[1] + pixel[1], acc[2] + pixel[2]],
        [0, 0, 0]
      );
      return [
        Math.round(sum[0] / cluster.length),
        Math.round(sum[1] / cluster.length),
        Math.round(sum[2] / cluster.length),
      ] as [number, number, number];
    });
  }

  return centroids.map(([r, g, b]) => rgbToHex(r, g, b));
}

/**
 * Remap an image to use only colors from a given palette
 */
export function remapToPalette(
  image: string[][],
  palette: string[]
): string[][] {
  const paletteRgb = palette.map((hex) => hexToRgb(hex));

  const result: string[][] = [];
  for (const row of image) {
    const newRow: string[] = [];
    for (const pixel of row) {
      const [r, g, b] = hexToRgb(pixel);

      // Find nearest palette color
      let bestColor = palette[0];
      let bestDist = Infinity;

      for (let i = 0; i < paletteRgb.length; i++) {
        const [pr, pg, pb] = paletteRgb[i];
        const dist =
          Math.pow(r - pr, 2) + Math.pow(g - pg, 2) + Math.pow(b - pb, 2);
        if (dist < bestDist) {
          bestDist = dist;
          bestColor = palette[i];
        }
      }

      newRow.push(bestColor);
    }
    result.push(newRow);
  }

  return result;
}

/**
 * Normalize both images to have similar luminance distribution
 */
export function normalizeLuminance(
  imageA: string[][],
  imageB: string[][]
): { normalizedA: string[][]; normalizedB: string[][] } {
  // Calculate average luminance for each image
  let lumSumA = 0,
    countA = 0;
  let lumSumB = 0,
    countB = 0;

  for (const row of imageA) {
    for (const pixel of row) {
      const [r, g, b] = hexToRgb(pixel);
      lumSumA += getLuminance(r, g, b);
      countA++;
    }
  }

  for (const row of imageB) {
    for (const pixel of row) {
      const [r, g, b] = hexToRgb(pixel);
      lumSumB += getLuminance(r, g, b);
      countB++;
    }
  }

  const avgLumA = lumSumA / countA;
  const avgLumB = lumSumB / countB;
  const targetLum = (avgLumA + avgLumB) / 2;

  // Adjust each image toward target luminance
  const adjustImage = (
    image: string[][],
    currentAvg: number
  ): string[][] => {
    const factor = targetLum / currentAvg;
    const result: string[][] = [];

    for (const row of image) {
      const newRow: string[] = [];
      for (const pixel of row) {
        const [r, g, b] = hexToRgb(pixel);
        newRow.push(
          rgbToHex(
            Math.min(255, r * factor),
            Math.min(255, g * factor),
            Math.min(255, b * factor)
          )
        );
      }
      result.push(newRow);
    }

    return result;
  };

  return {
    normalizedA: adjustImage(imageA, avgLumA),
    normalizedB: adjustImage(imageB, avgLumB),
  };
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

/**
 * Enhanced matching with color normalization
 *
 * This allows any two images to work together by normalizing their
 * color distributions before matching.
 */
export function matchImagesWithNormalization(
  imageA: string[][],
  imageB: string[][],
  gridSize: number = 3,
  options: NormalizationOptions = { method: 'palette', paletteSize: 8 }
): MatchResult {
  let normalizedA: string[][];
  let normalizedB: string[][];

  switch (options.method) {
    case 'histogram':
      // Match image A's histogram to image B's, then average
      const aToB = matchHistograms(imageA, imageB);
      const bToA = matchHistograms(imageB, imageA);
      // Use histogram-matched versions
      normalizedA = aToB;
      normalizedB = bToA;
      break;

    case 'palette':
      // Find shared palette and remap both images
      const paletteSize = options.paletteSize || 8;
      const sharedPalette = findSharedPalette(imageA, imageB, paletteSize);
      normalizedA = remapToPalette(imageA, sharedPalette);
      normalizedB = remapToPalette(imageB, sharedPalette);
      break;

    case 'luminance':
      // Normalize luminance only
      const lumResult = normalizeLuminance(imageA, imageB);
      normalizedA = lumResult.normalizedA;
      normalizedB = lumResult.normalizedB;
      break;

    default:
      normalizedA = imageA;
      normalizedB = imageB;
  }

  // Now run the standard matching algorithm on normalized images
  return matchImages(normalizedA, normalizedB, gridSize);
}

/**
 * Analyze how well two images can be matched
 * Returns metrics about the quality of the potential dual-puzzle
 */
export function analyzeMatchQuality(
  imageA: string[][],
  imageB: string[][]
): {
  rawSimilarity: number;
  histogramSimilarity: number;
  paletteSimilarity: number;
  recommendedMethod: 'none' | 'histogram' | 'palette' | 'luminance';
} {
  const gridSize = 3;

  // Raw matching (no normalization)
  const rawResult = matchImages(imageA, imageB, gridSize);

  // With histogram normalization
  const histResult = matchImagesWithNormalization(imageA, imageB, gridSize, {
    method: 'histogram',
  });

  // With palette normalization
  const paletteResult = matchImagesWithNormalization(imageA, imageB, gridSize, {
    method: 'palette',
    paletteSize: 8,
  });

  const scores = [
    { method: 'none' as const, score: rawResult.totalSimilarity },
    { method: 'histogram' as const, score: histResult.totalSimilarity },
    { method: 'palette' as const, score: paletteResult.totalSimilarity },
  ];

  const best = scores.reduce((a, b) => (a.score > b.score ? a : b));

  return {
    rawSimilarity: rawResult.totalSimilarity,
    histogramSimilarity: histResult.totalSimilarity,
    paletteSimilarity: paletteResult.totalSimilarity,
    recommendedMethod: best.method,
  };
}
