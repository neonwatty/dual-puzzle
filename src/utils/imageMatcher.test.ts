import { describe, it, expect } from 'vitest';
import {
  extractTiles,
  tileSimilarity,
  buildSimilarityMatrix,
  hungarianAlgorithm,
  matchImages,
  hexToRgb,
  rgbToHex,
  getLuminance,
  extractHistogram,
  matchHistograms,
  extractPalette,
  findSharedPalette,
  remapToPalette,
  normalizeLuminance,
  matchImagesWithNormalization,
  analyzeMatchQuality,
} from './imageMatcher';

describe('imageMatcher', () => {
  // Simple 4x4 test images (will be split into 2x2 tiles)
  const R = '#ff0000';
  const B = '#0000ff';
  const _ = '#000000';

  const simpleImageA = [
    [R, R, B, B],
    [R, R, B, B],
    [_, _, _, _],
    [_, _, _, _],
  ];

  const simpleImageB = [
    [_, _, _, _],
    [_, _, _, _],
    [R, R, B, B],
    [R, R, B, B],
  ];

  describe('extractTiles', () => {
    it('extracts correct number of tiles', () => {
      const tiles = extractTiles(simpleImageA, 2);
      expect(tiles.length).toBe(4); // 2x2 grid = 4 tiles
    });

    it('extracts tiles with correct dimensions', () => {
      const tiles = extractTiles(simpleImageA, 2);
      expect(tiles[0].length).toBe(2); // 2 rows per tile
      expect(tiles[0][0].length).toBe(2); // 2 cols per tile
    });

    it('extracts correct tile content', () => {
      const tiles = extractTiles(simpleImageA, 2);
      // Top-left tile should be all R
      expect(tiles[0]).toEqual([
        [R, R],
        [R, R],
      ]);
      // Top-right tile should be all B
      expect(tiles[1]).toEqual([
        [B, B],
        [B, B],
      ]);
    });
  });

  describe('tileSimilarity', () => {
    it('returns 1 for identical tiles', () => {
      const tile = [
        [R, R],
        [R, R],
      ];
      expect(tileSimilarity(tile, tile)).toBe(1);
    });

    it('returns value between 0 and 1 for different tiles', () => {
      const tileA = [
        [R, R],
        [R, R],
      ];
      const tileB = [
        [B, B],
        [B, B],
      ];
      const sim = tileSimilarity(tileA, tileB);
      expect(sim).toBeGreaterThan(0);
      expect(sim).toBeLessThan(1);
    });
  });

  describe('buildSimilarityMatrix', () => {
    it('creates correct size matrix', () => {
      const tilesA = extractTiles(simpleImageA, 2);
      const tilesB = extractTiles(simpleImageB, 2);
      const matrix = buildSimilarityMatrix(tilesA, tilesB);

      expect(matrix.length).toBe(4);
      expect(matrix[0].length).toBe(4);
    });
  });

  describe('hungarianAlgorithm', () => {
    it('finds valid assignment', () => {
      const matrix = [
        [1.0, 0.5, 0.2],
        [0.3, 0.9, 0.4],
        [0.1, 0.2, 0.8],
      ];
      const assignment = hungarianAlgorithm(matrix);

      // Should be a valid permutation (each value 0-2 appears exactly once)
      expect(assignment.length).toBe(3);
      expect(new Set(assignment).size).toBe(3);
      assignment.forEach((v) => {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThan(3);
      });
    });

    it('prefers higher similarity matches', () => {
      // Diagonal has highest similarities
      const matrix = [
        [1.0, 0.1, 0.1],
        [0.1, 1.0, 0.1],
        [0.1, 0.1, 1.0],
      ];
      const assignment = hungarianAlgorithm(matrix);

      // Optimal assignment should be identity: [0, 1, 2]
      expect(assignment).toEqual([0, 1, 2]);
    });
  });

  describe('matchImages', () => {
    it('produces valid puzzle data', () => {
      const result = matchImages(simpleImageA, simpleImageB, 2);

      expect(result.tiles.length).toBe(4);
      expect(result.solutionA.length).toBe(4);
      expect(result.solutionB.length).toBe(4);
      expect(result.totalSimilarity).toBeGreaterThan(0);
    });

    it('solutionA and solutionB are valid permutations', () => {
      const result = matchImages(simpleImageA, simpleImageB, 2);

      // Both solutions should contain indices 0-3 exactly once
      expect(new Set(result.solutionA).size).toBe(4);
      expect(new Set(result.solutionB).size).toBe(4);
    });
  });

  // Tests for color normalization functions
  describe('hexToRgb', () => {
    it('converts hex to RGB correctly', () => {
      expect(hexToRgb('#ff0000')).toEqual([255, 0, 0]);
      expect(hexToRgb('#00ff00')).toEqual([0, 255, 0]);
      expect(hexToRgb('#0000ff')).toEqual([0, 0, 255]);
      expect(hexToRgb('#808080')).toEqual([128, 128, 128]);
    });

    it('handles hex without #', () => {
      expect(hexToRgb('ff0000')).toEqual([255, 0, 0]);
    });
  });

  describe('rgbToHex', () => {
    it('converts RGB to hex correctly', () => {
      expect(rgbToHex(255, 0, 0)).toBe('#ff0000');
      expect(rgbToHex(0, 255, 0)).toBe('#00ff00');
      expect(rgbToHex(0, 0, 255)).toBe('#0000ff');
      expect(rgbToHex(128, 128, 128)).toBe('#808080');
    });

    it('clamps values to 0-255', () => {
      expect(rgbToHex(300, -50, 128)).toBe('#ff0080');
    });
  });

  describe('getLuminance', () => {
    it('calculates luminance correctly', () => {
      // Pure white has max luminance
      expect(getLuminance(255, 255, 255)).toBeCloseTo(255);
      // Pure black has zero luminance
      expect(getLuminance(0, 0, 0)).toBe(0);
      // Green contributes most to luminance
      expect(getLuminance(0, 255, 0)).toBeGreaterThan(getLuminance(255, 0, 0));
      expect(getLuminance(0, 255, 0)).toBeGreaterThan(getLuminance(0, 0, 255));
    });
  });

  describe('extractHistogram', () => {
    it('creates histogram with correct structure', () => {
      const image = [
        ['#ff0000', '#ff0000'],
        ['#00ff00', '#0000ff'],
      ];
      const hist = extractHistogram(image);

      expect(hist.r.length).toBe(256);
      expect(hist.g.length).toBe(256);
      expect(hist.b.length).toBe(256);
      expect(hist.totalPixels).toBe(4);
    });

    it('counts colors correctly', () => {
      const image = [
        ['#ff0000', '#ff0000'],
        ['#ff0000', '#ff0000'],
      ];
      const hist = extractHistogram(image);

      expect(hist.r[255]).toBe(4); // 4 red pixels with R=255
      expect(hist.g[0]).toBe(4); // 4 red pixels with G=0
      expect(hist.b[0]).toBe(4); // 4 red pixels with B=0
    });
  });

  describe('extractPalette', () => {
    it('returns correct number of colors', () => {
      const image = [
        ['#ff0000', '#00ff00', '#0000ff', '#ffff00'],
        ['#ff00ff', '#00ffff', '#ffffff', '#000000'],
      ];
      const palette = extractPalette(image, 4);
      expect(palette.length).toBeLessThanOrEqual(4);
    });

    it('returns all unique colors if fewer than palette size', () => {
      const image = [
        ['#ff0000', '#ff0000'],
        ['#00ff00', '#00ff00'],
      ];
      const palette = extractPalette(image, 8);
      expect(palette.length).toBe(2);
    });
  });

  describe('findSharedPalette', () => {
    it('creates palette from both images', () => {
      const imageA = [
        ['#ff0000', '#ff0000'],
        ['#ff0000', '#ff0000'],
      ];
      const imageB = [
        ['#0000ff', '#0000ff'],
        ['#0000ff', '#0000ff'],
      ];
      const palette = findSharedPalette(imageA, imageB, 4);

      // Should have colors influenced by both images
      expect(palette.length).toBeLessThanOrEqual(4);
    });
  });

  describe('remapToPalette', () => {
    it('maps all pixels to palette colors', () => {
      const image = [
        ['#ff0000', '#ff1010'],
        ['#0000ff', '#1010ff'],
      ];
      const palette = ['#ff0000', '#0000ff'];
      const result = remapToPalette(image, palette);

      // All pixels should be one of the palette colors
      for (const row of result) {
        for (const pixel of row) {
          expect(palette).toContain(pixel);
        }
      }
    });

    it('maps to nearest color', () => {
      const image = [['#fe0000']]; // Very close to red
      const palette = ['#ff0000', '#0000ff'];
      const result = remapToPalette(image, palette);

      expect(result[0][0]).toBe('#ff0000');
    });
  });

  describe('normalizeLuminance', () => {
    it('balances luminance between images', () => {
      const bright = [
        ['#ffffff', '#ffffff'],
        ['#ffffff', '#ffffff'],
      ];
      const dark = [
        ['#404040', '#404040'],
        ['#404040', '#404040'],
      ];

      const { normalizedA, normalizedB } = normalizeLuminance(bright, dark);

      // After normalization, the bright image should be darker
      const [r1] = hexToRgb(normalizedA[0][0]);
      expect(r1).toBeLessThan(255);

      // And the dark image should be brighter
      const [r2] = hexToRgb(normalizedB[0][0]);
      expect(r2).toBeGreaterThan(64);
    });
  });

  describe('matchHistograms', () => {
    it('transforms source to match target distribution', () => {
      const source = [
        ['#400000', '#400000'],
        ['#400000', '#400000'],
      ];
      const target = [
        ['#c00000', '#c00000'],
        ['#c00000', '#c00000'],
      ];

      const result = matchHistograms(source, target);

      // Source should become brighter to match target
      const [r] = hexToRgb(result[0][0]);
      expect(r).toBeGreaterThan(64); // Original was 64 (0x40)
    });
  });

  describe('matchImagesWithNormalization', () => {
    const Y = '#ffff00';
    const G = '#00ff00';

    const imageWithYellow = [
      [Y, Y, Y, Y],
      [Y, Y, Y, Y],
      [_, _, _, _],
      [_, _, _, _],
    ];

    const imageWithGreen = [
      [_, _, _, _],
      [_, _, _, _],
      [G, G, G, G],
      [G, G, G, G],
    ];

    it('produces valid result with palette normalization', () => {
      const result = matchImagesWithNormalization(
        imageWithYellow,
        imageWithGreen,
        2,
        { method: 'palette', paletteSize: 4 }
      );

      expect(result.tiles.length).toBe(4);
      expect(result.solutionA.length).toBe(4);
      expect(result.solutionB.length).toBe(4);
    });

    it('produces valid result with histogram normalization', () => {
      const result = matchImagesWithNormalization(
        imageWithYellow,
        imageWithGreen,
        2,
        { method: 'histogram' }
      );

      expect(result.tiles.length).toBe(4);
      expect(result.totalSimilarity).toBeGreaterThan(0);
    });

    it('produces valid result with luminance normalization', () => {
      const result = matchImagesWithNormalization(
        imageWithYellow,
        imageWithGreen,
        2,
        { method: 'luminance' }
      );

      expect(result.tiles.length).toBe(4);
      expect(result.totalSimilarity).toBeGreaterThan(0);
    });
  });

  describe('analyzeMatchQuality', () => {
    it('returns comparison of all methods', () => {
      const imageA = [
        [R, R, R, R, R, R],
        [R, R, R, R, R, R],
        [B, B, B, B, B, B],
        [B, B, B, B, B, B],
        [_, _, _, _, _, _],
        [_, _, _, _, _, _],
      ];

      const imageB = [
        [_, _, _, _, _, _],
        [_, _, _, _, _, _],
        [R, R, R, R, R, R],
        [R, R, R, R, R, R],
        [B, B, B, B, B, B],
        [B, B, B, B, B, B],
      ];

      const quality = analyzeMatchQuality(imageA, imageB);

      expect(quality.rawSimilarity).toBeGreaterThan(0);
      expect(quality.histogramSimilarity).toBeGreaterThan(0);
      expect(quality.paletteSimilarity).toBeGreaterThan(0);
      expect(['none', 'histogram', 'palette', 'luminance']).toContain(
        quality.recommendedMethod
      );
    });
  });
});
