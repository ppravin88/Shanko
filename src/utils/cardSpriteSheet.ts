import { Rank, Suit } from '../types';

/**
 * Card Sprite Sheet Utility
 * Provides utilities for generating and using card sprite sheets
 * This can be used to export cards as a single image for better performance
 */

export interface SpriteSheetConfig {
  cardWidth: number;
  cardHeight: number;
  columns: number;
  rows: number;
  padding: number;
}

export const DEFAULT_SPRITE_CONFIG: SpriteSheetConfig = {
  cardWidth: 80,
  cardHeight: 112,
  columns: 13, // 13 ranks
  rows: 5,     // 4 suits + joker
  padding: 2
};

/**
 * Calculate sprite position for a given card
 */
export function getSpritePosition(
  rank: Rank,
  suit: Suit | null,
  config: SpriteSheetConfig = DEFAULT_SPRITE_CONFIG
): { x: number; y: number } {
  const rankOrder = [
    Rank.TWO, Rank.THREE, Rank.FOUR, Rank.FIVE, Rank.SIX,
    Rank.SEVEN, Rank.EIGHT, Rank.NINE, Rank.TEN,
    Rank.JACK, Rank.QUEEN, Rank.KING, Rank.ACE
  ];
  
  const suitOrder = [Suit.HEARTS, Suit.DIAMONDS, Suit.CLUBS, Suit.SPADES];
  
  let col = 0;
  let row = 0;
  
  if (rank === Rank.JOKER) {
    col = 0;
    row = 4; // Last row for jokers
  } else {
    col = rankOrder.indexOf(rank);
    row = suit ? suitOrder.indexOf(suit) : 0;
  }
  
  const x = col * (config.cardWidth + config.padding);
  const y = row * (config.cardHeight + config.padding);
  
  return { x, y };
}

/**
 * Get CSS background-position for sprite sheet
 */
export function getSpriteCSSPosition(
  rank: Rank,
  suit: Suit | null,
  config: SpriteSheetConfig = DEFAULT_SPRITE_CONFIG
): string {
  const { x, y } = getSpritePosition(rank, suit, config);
  return `-${x}px -${y}px`;
}

/**
 * Calculate total sprite sheet dimensions
 */
export function getSpriteSheetDimensions(
  config: SpriteSheetConfig = DEFAULT_SPRITE_CONFIG
): { width: number; height: number } {
  const width = config.columns * (config.cardWidth + config.padding) - config.padding;
  const height = config.rows * (config.cardHeight + config.padding) - config.padding;
  return { width, height };
}

/**
 * Generate sprite sheet metadata for export
 * This can be used to generate a JSON file for sprite sheet tools
 */
export function generateSpriteSheetMetadata(
  config: SpriteSheetConfig = DEFAULT_SPRITE_CONFIG
): Record<string, { x: number; y: number; width: number; height: number }> {
  const metadata: Record<string, { x: number; y: number; width: number; height: number }> = {};
  
  const ranks = [
    Rank.TWO, Rank.THREE, Rank.FOUR, Rank.FIVE, Rank.SIX,
    Rank.SEVEN, Rank.EIGHT, Rank.NINE, Rank.TEN,
    Rank.JACK, Rank.QUEEN, Rank.KING, Rank.ACE
  ];
  
  const suits = [Suit.HEARTS, Suit.DIAMONDS, Suit.CLUBS, Suit.SPADES];
  
  // Add regular cards
  for (const suit of suits) {
    for (const rank of ranks) {
      const key = `${rank}_${suit}`;
      const { x, y } = getSpritePosition(rank, suit, config);
      metadata[key] = {
        x,
        y,
        width: config.cardWidth,
        height: config.cardHeight
      };
    }
  }
  
  // Add joker
  const { x, y } = getSpritePosition(Rank.JOKER, null, config);
  metadata['JOKER'] = {
    x,
    y,
    width: config.cardWidth,
    height: config.cardHeight
  };
  
  // Add card back
  metadata['CARD_BACK'] = {
    x: config.cardWidth + config.padding,
    y: 4 * (config.cardHeight + config.padding),
    width: config.cardWidth,
    height: config.cardHeight
  };
  
  return metadata;
}

/**
 * Export sprite sheet metadata as JSON
 */
export function exportSpriteSheetMetadata(
  config: SpriteSheetConfig = DEFAULT_SPRITE_CONFIG
): string {
  const metadata = generateSpriteSheetMetadata(config);
  const dimensions = getSpriteSheetDimensions(config);
  
  return JSON.stringify({
    meta: {
      version: '1.0',
      size: dimensions,
      format: 'RGBA8888'
    },
    frames: metadata
  }, null, 2);
}
