import { Card, Rank, Suit } from '../types';
import { generateId } from '../utils';

export class DeckManager {
  /**
   * Creates and shuffles multiple decks based on player count
   * 2-4 players: 2 decks (112 cards)
   * 5-6 players: 3 decks (168 cards)
   * 7-8 players: 4 decks (224 cards)
   */
  static createDecks(playerCount: number): Card[] {
    if (playerCount < 2 || playerCount > 8) {
      throw new Error('Player count must be between 2 and 8');
    }

    const deckCount = this.getDeckCount(playerCount);
    const cards: Card[] = [];

    for (let deckIndex = 0; deckIndex < deckCount; deckIndex++) {
      cards.push(...this.createSingleDeck(deckIndex));
    }

    return this.shuffle(cards);
  }

  /**
   * Determines the number of decks needed based on player count
   */
  private static getDeckCount(playerCount: number): number {
    if (playerCount <= 4) return 2;
    if (playerCount <= 6) return 3;
    return 4;
  }

  /**
   * Creates a single 56-card deck (52 standard cards + 4 Jokers)
   */
  private static createSingleDeck(deckIndex: number): Card[] {
    const cards: Card[] = [];

    // Add standard cards (13 ranks × 4 suits = 52 cards)
    const standardRanks = [
      Rank.TWO, Rank.THREE, Rank.FOUR, Rank.FIVE, Rank.SIX,
      Rank.SEVEN, Rank.EIGHT, Rank.NINE, Rank.TEN,
      Rank.JACK, Rank.QUEEN, Rank.KING, Rank.ACE
    ];

    for (const suit of Object.values(Suit)) {
      for (const rank of standardRanks) {
        cards.push({
          id: generateId(),
          rank,
          suit,
          deckIndex
        });
      }
    }

    // Add 4 Jokers
    for (let i = 0; i < 4; i++) {
      cards.push({
        id: generateId(),
        rank: Rank.JOKER,
        suit: null,
        deckIndex
      });
    }

    return cards;
  }

  /**
   * Shuffles an array of cards using the Fisher-Yates algorithm
   */
  static shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled;
  }
}
