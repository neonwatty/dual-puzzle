import { describe, it, expect } from 'vitest';
import {
  extractTiles,
  tileSimilarity,
  buildSimilarityMatrix,
  hungarianAlgorithm,
  matchImages,
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
});
