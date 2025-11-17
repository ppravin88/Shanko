import { describe, it, expect } from 'vitest';
import {
  isValidTriplet,
  isValidSequence,
  meetsRoundObjective,
  canSwapJoker,
  canExtendSequence
} from './ValidationEngine';
import { Card, Rank, Suit } from '../types/card';
import { Combination, Sequence } from '../types/combination';
import { ROUND_OBJECTIVES } from '../types/game';

// Helper function to create a card
function createCard(rank: Rank, suit: Suit | null = Suit.HEARTS, id?: string): Card {
  return {
    id: id || `${rank}-${suit}-0`,
    rank,
    suit,
    deckIndex: 0
  };
}

describe('ValidationEngine', () => {
  describe('isValidTriplet', () => {
    it('should validate a valid triplet with 3 matching ranks', () => {
      const cards = [
        createCard(Rank.FIVE, Suit.HEARTS),
        createCard(Rank.FIVE, Suit.DIAMONDS),
        createCard(Rank.FIVE, Suit.CLUBS)
      ];
      expect(isValidTriplet(cards)).toBe(true);
    });

    it('should validate a triplet with 2 cards and 1 Joker', () => {
      const cards = [
        createCard(Rank.KING, Suit.HEARTS),
        createCard(Rank.KING, Suit.DIAMONDS),
        createCard(Rank.JOKER, null)
      ];
      expect(isValidTriplet(cards)).toBe(true);
    });

    it('should validate a triplet with 1 card and 2 Jokers', () => {
      const cards = [
        createCard(Rank.ACE, Suit.SPADES),
        createCard(Rank.JOKER, null),
        createCard(Rank.JOKER, null)
      ];
      expect(isValidTriplet(cards)).toBe(true);
    });

    it('should reject triplet with only Jokers', () => {
      const cards = [
        createCard(Rank.JOKER, null),
        createCard(Rank.JOKER, null),
        createCard(Rank.JOKER, null)
      ];
      expect(isValidTriplet(cards)).toBe(false);
    });

    it('should reject triplet with non-matching ranks', () => {
      const cards = [
        createCard(Rank.FIVE, Suit.HEARTS),
        createCard(Rank.SIX, Suit.DIAMONDS),
        createCard(Rank.SEVEN, Suit.CLUBS)
      ];
      expect(isValidTriplet(cards)).toBe(false);
    });

    it('should reject triplet with fewer than 3 cards', () => {
      const cards = [
        createCard(Rank.FIVE, Suit.HEARTS),
        createCard(Rank.FIVE, Suit.DIAMONDS)
      ];
      expect(isValidTriplet(cards)).toBe(false);
    });

    it('should reject triplet with more than 3 cards', () => {
      const cards = [
        createCard(Rank.FIVE, Suit.HEARTS),
        createCard(Rank.FIVE, Suit.DIAMONDS),
        createCard(Rank.FIVE, Suit.CLUBS),
        createCard(Rank.FIVE, Suit.SPADES)
      ];
      expect(isValidTriplet(cards)).toBe(false);
    });
  });

  describe('isValidSequence', () => {
    it('should validate a valid 4-card sequence', () => {
      const cards = [
        createCard(Rank.FIVE, Suit.HEARTS),
        createCard(Rank.SIX, Suit.HEARTS),
        createCard(Rank.SEVEN, Suit.HEARTS),
        createCard(Rank.EIGHT, Suit.HEARTS)
      ];
      expect(isValidSequence(cards)).toBe(true);
    });

    it('should validate a sequence with Ace at the beginning (A-2-3-4)', () => {
      const cards = [
        createCard(Rank.ACE, Suit.DIAMONDS),
        createCard(Rank.TWO, Suit.DIAMONDS),
        createCard(Rank.THREE, Suit.DIAMONDS),
        createCard(Rank.FOUR, Suit.DIAMONDS)
      ];
      expect(isValidSequence(cards)).toBe(true);
    });

    it('should validate a sequence with Ace at the end (J-Q-K-A)', () => {
      const cards = [
        createCard(Rank.JACK, Suit.CLUBS),
        createCard(Rank.QUEEN, Suit.CLUBS),
        createCard(Rank.KING, Suit.CLUBS),
        createCard(Rank.ACE, Suit.CLUBS)
      ];
      expect(isValidSequence(cards)).toBe(true);
    });

    it('should validate a sequence with Jokers filling gaps', () => {
      const cards = [
        createCard(Rank.FIVE, Suit.SPADES),
        createCard(Rank.JOKER, null),
        createCard(Rank.SEVEN, Suit.SPADES),
        createCard(Rank.EIGHT, Suit.SPADES)
      ];
      expect(isValidSequence(cards)).toBe(true);
    });

    it('should validate a longer sequence (5+ cards)', () => {
      const cards = [
        createCard(Rank.THREE, Suit.HEARTS),
        createCard(Rank.FOUR, Suit.HEARTS),
        createCard(Rank.FIVE, Suit.HEARTS),
        createCard(Rank.SIX, Suit.HEARTS),
        createCard(Rank.SEVEN, Suit.HEARTS)
      ];
      expect(isValidSequence(cards)).toBe(true);
    });

    it('should reject wrapping sequence (K-A-2-3)', () => {
      const cards = [
        createCard(Rank.KING, Suit.HEARTS),
        createCard(Rank.ACE, Suit.HEARTS),
        createCard(Rank.TWO, Suit.HEARTS),
        createCard(Rank.THREE, Suit.HEARTS)
      ];
      expect(isValidSequence(cards)).toBe(false);
    });

    it('should reject sequence with mixed suits', () => {
      const cards = [
        createCard(Rank.FIVE, Suit.HEARTS),
        createCard(Rank.SIX, Suit.DIAMONDS),
        createCard(Rank.SEVEN, Suit.HEARTS),
        createCard(Rank.EIGHT, Suit.HEARTS)
      ];
      expect(isValidSequence(cards)).toBe(false);
    });

    it('should reject sequence with only Jokers', () => {
      const cards = [
        createCard(Rank.JOKER, null),
        createCard(Rank.JOKER, null),
        createCard(Rank.JOKER, null),
        createCard(Rank.JOKER, null)
      ];
      expect(isValidSequence(cards)).toBe(false);
    });

    it('should reject sequence with fewer than 4 cards', () => {
      const cards = [
        createCard(Rank.FIVE, Suit.HEARTS),
        createCard(Rank.SIX, Suit.HEARTS),
        createCard(Rank.SEVEN, Suit.HEARTS)
      ];
      expect(isValidSequence(cards)).toBe(false);
    });

    it('should reject non-consecutive sequence', () => {
      const cards = [
        createCard(Rank.FIVE, Suit.HEARTS),
        createCard(Rank.SIX, Suit.HEARTS),
        createCard(Rank.EIGHT, Suit.HEARTS),
        createCard(Rank.NINE, Suit.HEARTS)
      ];
      expect(isValidSequence(cards)).toBe(false);
    });
  });

  describe('meetsRoundObjective', () => {
    it('should validate Round 1 objective (2 triplets)', () => {
      const combinations: Combination[] = [
        {
          id: '1',
          type: 'TRIPLET',
          cards: [
            createCard(Rank.FIVE, Suit.HEARTS),
            createCard(Rank.FIVE, Suit.DIAMONDS),
            createCard(Rank.FIVE, Suit.CLUBS)
          ],
          playerId: 'player1'
        },
        {
          id: '2',
          type: 'TRIPLET',
          cards: [
            createCard(Rank.KING, Suit.HEARTS),
            createCard(Rank.KING, Suit.DIAMONDS),
            createCard(Rank.KING, Suit.CLUBS)
          ],
          playerId: 'player1'
        }
      ];
      expect(meetsRoundObjective(combinations, ROUND_OBJECTIVES[0])).toBe(true);
    });

    it('should validate Round 2 objective (1 triplet, 1 sequence)', () => {
      const combinations: Combination[] = [
        {
          id: '1',
          type: 'TRIPLET',
          cards: [
            createCard(Rank.FIVE, Suit.HEARTS),
            createCard(Rank.FIVE, Suit.DIAMONDS),
            createCard(Rank.FIVE, Suit.CLUBS)
          ],
          playerId: 'player1'
        },
        {
          id: '2',
          type: 'SEQUENCE',
          cards: [
            createCard(Rank.TWO, Suit.SPADES),
            createCard(Rank.THREE, Suit.SPADES),
            createCard(Rank.FOUR, Suit.SPADES),
            createCard(Rank.FIVE, Suit.SPADES)
          ],
          playerId: 'player1'
        }
      ];
      expect(meetsRoundObjective(combinations, ROUND_OBJECTIVES[1])).toBe(true);
    });

    it('should validate Round 7 objective (3 sequences)', () => {
      const combinations: Combination[] = [
        {
          id: '1',
          type: 'SEQUENCE',
          cards: [
            createCard(Rank.TWO, Suit.HEARTS),
            createCard(Rank.THREE, Suit.HEARTS),
            createCard(Rank.FOUR, Suit.HEARTS),
            createCard(Rank.FIVE, Suit.HEARTS)
          ],
          playerId: 'player1'
        },
        {
          id: '2',
          type: 'SEQUENCE',
          cards: [
            createCard(Rank.SIX, Suit.DIAMONDS),
            createCard(Rank.SEVEN, Suit.DIAMONDS),
            createCard(Rank.EIGHT, Suit.DIAMONDS),
            createCard(Rank.NINE, Suit.DIAMONDS)
          ],
          playerId: 'player1'
        },
        {
          id: '3',
          type: 'SEQUENCE',
          cards: [
            createCard(Rank.JACK, Suit.CLUBS),
            createCard(Rank.QUEEN, Suit.CLUBS),
            createCard(Rank.KING, Suit.CLUBS),
            createCard(Rank.ACE, Suit.CLUBS)
          ],
          playerId: 'player1'
        }
      ];
      expect(meetsRoundObjective(combinations, ROUND_OBJECTIVES[6])).toBe(true);
    });

    it('should reject when triplet count does not match', () => {
      const combinations: Combination[] = [
        {
          id: '1',
          type: 'TRIPLET',
          cards: [
            createCard(Rank.FIVE, Suit.HEARTS),
            createCard(Rank.FIVE, Suit.DIAMONDS),
            createCard(Rank.FIVE, Suit.CLUBS)
          ],
          playerId: 'player1'
        }
      ];
      expect(meetsRoundObjective(combinations, ROUND_OBJECTIVES[0])).toBe(false);
    });

    it('should reject when sequence count does not match', () => {
      const combinations: Combination[] = [
        {
          id: '1',
          type: 'SEQUENCE',
          cards: [
            createCard(Rank.TWO, Suit.HEARTS),
            createCard(Rank.THREE, Suit.HEARTS),
            createCard(Rank.FOUR, Suit.HEARTS),
            createCard(Rank.FIVE, Suit.HEARTS)
          ],
          playerId: 'player1'
        }
      ];
      expect(meetsRoundObjective(combinations, ROUND_OBJECTIVES[2])).toBe(false);
    });

    it('should reject when total card count does not match', () => {
      const combinations: Combination[] = [
        {
          id: '1',
          type: 'TRIPLET',
          cards: [
            createCard(Rank.FIVE, Suit.HEARTS),
            createCard(Rank.FIVE, Suit.DIAMONDS),
            createCard(Rank.FIVE, Suit.CLUBS)
          ],
          playerId: 'player1'
        },
        {
          id: '2',
          type: 'SEQUENCE',
          cards: [
            createCard(Rank.TWO, Suit.SPADES),
            createCard(Rank.THREE, Suit.SPADES),
            createCard(Rank.FOUR, Suit.SPADES),
            createCard(Rank.FIVE, Suit.SPADES),
            createCard(Rank.SIX, Suit.SPADES)
          ],
          playerId: 'player1'
        }
      ];
      expect(meetsRoundObjective(combinations, ROUND_OBJECTIVES[1])).toBe(false);
    });
  });

  describe('canSwapJoker', () => {
    it('should allow swapping Joker from sequence with valid replacement', () => {
      const joker = createCard(Rank.JOKER, null, 'joker-1');
      const sequence: Sequence = {
        id: 'seq-1',
        type: 'SEQUENCE',
        cards: [
          createCard(Rank.FIVE, Suit.HEARTS, 'card-1'),
          joker,
          createCard(Rank.SEVEN, Suit.HEARTS, 'card-2'),
          createCard(Rank.EIGHT, Suit.HEARTS, 'card-3')
        ],
        playerId: 'player1'
      };
      const replacement = createCard(Rank.SIX, Suit.HEARTS, 'card-4');
      
      expect(canSwapJoker(sequence, joker, replacement)).toBe(true);
    });

    it('should reject swapping Joker from triplet', () => {
      const joker = createCard(Rank.JOKER, null, 'joker-1');
      const triplet: Combination = {
        id: 'trip-1',
        type: 'TRIPLET',
        cards: [
          createCard(Rank.FIVE, Suit.HEARTS, 'card-1'),
          createCard(Rank.FIVE, Suit.DIAMONDS, 'card-2'),
          joker
        ],
        playerId: 'player1'
      };
      const replacement = createCard(Rank.FIVE, Suit.CLUBS, 'card-3');
      
      expect(canSwapJoker(triplet, joker, replacement)).toBe(false);
    });

    it('should reject swap with wrong suit replacement', () => {
      const joker = createCard(Rank.JOKER, null, 'joker-1');
      const sequence: Sequence = {
        id: 'seq-1',
        type: 'SEQUENCE',
        cards: [
          createCard(Rank.FIVE, Suit.HEARTS, 'card-1'),
          joker,
          createCard(Rank.SEVEN, Suit.HEARTS, 'card-2'),
          createCard(Rank.EIGHT, Suit.HEARTS, 'card-3')
        ],
        playerId: 'player1'
      };
      const replacement = createCard(Rank.SIX, Suit.DIAMONDS, 'card-4');
      
      expect(canSwapJoker(sequence, joker, replacement)).toBe(false);
    });

    it('should reject swap that breaks sequence validity', () => {
      const joker = createCard(Rank.JOKER, null, 'joker-1');
      const sequence: Sequence = {
        id: 'seq-1',
        type: 'SEQUENCE',
        cards: [
          createCard(Rank.FIVE, Suit.HEARTS, 'card-1'),
          joker,
          createCard(Rank.SEVEN, Suit.HEARTS, 'card-2'),
          createCard(Rank.EIGHT, Suit.HEARTS, 'card-3')
        ],
        playerId: 'player1'
      };
      const replacement = createCard(Rank.NINE, Suit.HEARTS, 'card-4');
      
      expect(canSwapJoker(sequence, joker, replacement)).toBe(false);
    });
  });

  describe('canExtendSequence', () => {
    it('should allow extending sequence at the end', () => {
      const sequence: Sequence = {
        id: 'seq-1',
        type: 'SEQUENCE',
        cards: [
          createCard(Rank.FIVE, Suit.HEARTS),
          createCard(Rank.SIX, Suit.HEARTS),
          createCard(Rank.SEVEN, Suit.HEARTS),
          createCard(Rank.EIGHT, Suit.HEARTS)
        ],
        playerId: 'player1'
      };
      const extension = [createCard(Rank.NINE, Suit.HEARTS)];
      
      expect(canExtendSequence(sequence, extension, 'END')).toBe(true);
    });

    it('should allow extending sequence at the start', () => {
      const sequence: Sequence = {
        id: 'seq-1',
        type: 'SEQUENCE',
        cards: [
          createCard(Rank.FIVE, Suit.HEARTS),
          createCard(Rank.SIX, Suit.HEARTS),
          createCard(Rank.SEVEN, Suit.HEARTS),
          createCard(Rank.EIGHT, Suit.HEARTS)
        ],
        playerId: 'player1'
      };
      const extension = [createCard(Rank.FOUR, Suit.HEARTS)];
      
      expect(canExtendSequence(sequence, extension, 'START')).toBe(true);
    });

    it('should allow extending with multiple cards', () => {
      const sequence: Sequence = {
        id: 'seq-1',
        type: 'SEQUENCE',
        cards: [
          createCard(Rank.FIVE, Suit.HEARTS),
          createCard(Rank.SIX, Suit.HEARTS),
          createCard(Rank.SEVEN, Suit.HEARTS),
          createCard(Rank.EIGHT, Suit.HEARTS)
        ],
        playerId: 'player1'
      };
      const extension = [
        createCard(Rank.NINE, Suit.HEARTS),
        createCard(Rank.TEN, Suit.HEARTS)
      ];
      
      expect(canExtendSequence(sequence, extension, 'END')).toBe(true);
    });

    it('should allow extending with Jokers', () => {
      const sequence: Sequence = {
        id: 'seq-1',
        type: 'SEQUENCE',
        cards: [
          createCard(Rank.FIVE, Suit.HEARTS),
          createCard(Rank.SIX, Suit.HEARTS),
          createCard(Rank.SEVEN, Suit.HEARTS),
          createCard(Rank.EIGHT, Suit.HEARTS)
        ],
        playerId: 'player1'
      };
      const extension = [createCard(Rank.JOKER, null)];
      
      expect(canExtendSequence(sequence, extension, 'END')).toBe(true);
    });

    it('should reject extension with wrong suit', () => {
      const sequence: Sequence = {
        id: 'seq-1',
        type: 'SEQUENCE',
        cards: [
          createCard(Rank.FIVE, Suit.HEARTS),
          createCard(Rank.SIX, Suit.HEARTS),
          createCard(Rank.SEVEN, Suit.HEARTS),
          createCard(Rank.EIGHT, Suit.HEARTS)
        ],
        playerId: 'player1'
      };
      const extension = [createCard(Rank.NINE, Suit.DIAMONDS)];
      
      expect(canExtendSequence(sequence, extension, 'END')).toBe(false);
    });

    it('should reject extension with non-consecutive ranks', () => {
      const sequence: Sequence = {
        id: 'seq-1',
        type: 'SEQUENCE',
        cards: [
          createCard(Rank.FIVE, Suit.HEARTS),
          createCard(Rank.SIX, Suit.HEARTS),
          createCard(Rank.SEVEN, Suit.HEARTS),
          createCard(Rank.EIGHT, Suit.HEARTS)
        ],
        playerId: 'player1'
      };
      const extension = [createCard(Rank.TEN, Suit.HEARTS)];
      
      expect(canExtendSequence(sequence, extension, 'END')).toBe(false);
    });

    it('should reject empty extension', () => {
      const sequence: Sequence = {
        id: 'seq-1',
        type: 'SEQUENCE',
        cards: [
          createCard(Rank.FIVE, Suit.HEARTS),
          createCard(Rank.SIX, Suit.HEARTS),
          createCard(Rank.SEVEN, Suit.HEARTS),
          createCard(Rank.EIGHT, Suit.HEARTS)
        ],
        playerId: 'player1'
      };
      
      expect(canExtendSequence(sequence, [], 'END')).toBe(false);
    });
  });
});
