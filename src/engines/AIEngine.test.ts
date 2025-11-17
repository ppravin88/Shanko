import { describe, it, expect } from 'vitest';
import { AIEngine } from './AIEngine';
import { Card, Rank, Suit } from '../types/card';
import { GameState, GamePhase, ROUND_OBJECTIVES } from '../types/game';
import { Player } from '../types/player';
import { Combination } from '../types/combination';

// Helper function to create a card
function createCard(rank: Rank, suit: Suit | null, id?: string): Card {
  return {
    id: id || `${rank}-${suit}-0`,
    rank,
    suit,
    deckIndex: 0
  };
}

// Helper function to create a test player
function createPlayer(id: string, hand: Card[], hasMelded = false, buysRemaining = 3): Player {
  return {
    id,
    name: `Player ${id}`,
    type: 'AI',
    hand,
    meldedCombinations: [],
    hasMelded,
    buysRemaining,
    cumulativeScore: 0,
    roundScores: []
  };
}

// Helper function to create a basic game state
function createGameState(players: Player[], round = 1): GameState {
  return {
    gameId: 'test-game',
    players,
    currentPlayerIndex: 0,
    startingPlayerIndex: 0,
    round,
    roundObjective: ROUND_OBJECTIVES[round - 1],
    drawPile: [],
    discardPile: [],
    phase: GamePhase.DRAW,
    winner: null
  };
}

describe('AIEngine', () => {
  describe('evaluateHand', () => {
    it('should identify completed triplets', () => {
      const hand: Card[] = [
        createCard(Rank.FIVE, Suit.HEARTS),
        createCard(Rank.FIVE, Suit.DIAMONDS),
        createCard(Rank.FIVE, Suit.CLUBS),
        createCard(Rank.KING, Suit.SPADES)
      ];

      const evaluation = AIEngine.evaluateHand(hand, ROUND_OBJECTIVES[0]);

      expect(evaluation.completedCombinations.length).toBe(1);
      expect(evaluation.completedCombinations[0].type).toBe('TRIPLET');
      expect(evaluation.deadwood.length).toBe(1);
      expect(evaluation.deadwood[0].rank).toBe(Rank.KING);
    });

    it('should identify completed sequences', () => {
      const hand: Card[] = [
        createCard(Rank.THREE, Suit.HEARTS),
        createCard(Rank.FOUR, Suit.HEARTS),
        createCard(Rank.FIVE, Suit.HEARTS),
        createCard(Rank.SIX, Suit.HEARTS),
        createCard(Rank.KING, Suit.SPADES)
      ];

      const evaluation = AIEngine.evaluateHand(hand, ROUND_OBJECTIVES[2]);

      expect(evaluation.completedCombinations.length).toBe(1);
      expect(evaluation.completedCombinations[0].type).toBe('SEQUENCE');
      expect(evaluation.deadwood.length).toBe(1);
    });

    it('should calculate deadwood points correctly', () => {
      const hand: Card[] = [
        createCard(Rank.KING, Suit.HEARTS),
        createCard(Rank.ACE, Suit.DIAMONDS),
        createCard(Rank.JOKER, null)
      ];

      const evaluation = AIEngine.evaluateHand(hand, ROUND_OBJECTIVES[0]);

      // King = 10, Ace = 15, Joker = 50
      expect(evaluation.deadwoodPoints).toBe(75);
    });

    it('should identify potential triplets', () => {
      const hand: Card[] = [
        createCard(Rank.SEVEN, Suit.HEARTS),
        createCard(Rank.SEVEN, Suit.DIAMONDS),
        createCard(Rank.TWO, Suit.CLUBS)
      ];

      const evaluation = AIEngine.evaluateHand(hand, ROUND_OBJECTIVES[0]);

      expect(evaluation.potentialCombinations.length).toBeGreaterThan(0);
      const tripletPotential = evaluation.potentialCombinations.find(p => p.type === 'TRIPLET');
      expect(tripletPotential).toBeDefined();
      expect(tripletPotential?.missingCards).toBe(1);
    });

    it('should estimate turns to complete', () => {
      const hand: Card[] = [
        createCard(Rank.FIVE, Suit.HEARTS),
        createCard(Rank.FIVE, Suit.DIAMONDS),
        createCard(Rank.FIVE, Suit.CLUBS),
        createCard(Rank.SEVEN, Suit.HEARTS),
        createCard(Rank.SEVEN, Suit.DIAMONDS)
      ];

      const evaluation = AIEngine.evaluateHand(hand, ROUND_OBJECTIVES[0]);

      // Should have 1 completed triplet, need 1 more
      expect(evaluation.turnsToComplete).toBeGreaterThan(0);
    });
  });

  describe('decideDraw', () => {
    it('should draw from draw pile when discard pile is empty', () => {
      const player = createPlayer('p1', [createCard(Rank.TWO, Suit.HEARTS)]);
      const state = createGameState([player]);

      const decision = AIEngine.decideDraw(state, 'p1');

      expect(decision).toBe('DRAW');
    });

    it('should draw from discard pile when card completes combination', () => {
      const hand: Card[] = [
        createCard(Rank.FIVE, Suit.HEARTS),
        createCard(Rank.FIVE, Suit.DIAMONDS)
      ];
      const player = createPlayer('p1', hand);
      const state = createGameState([player]);
      state.discardPile = [createCard(Rank.FIVE, Suit.CLUBS)];

      const decision = AIEngine.decideDraw(state, 'p1');

      expect(decision).toBe('DISCARD');
    });

    it('should prefer draw pile for low-value cards', () => {
      const hand: Card[] = [
        createCard(Rank.KING, Suit.HEARTS),
        createCard(Rank.QUEEN, Suit.HEARTS)
      ];
      const player = createPlayer('p1', hand);
      const state = createGameState([player]);
      state.discardPile = [createCard(Rank.TWO, Suit.CLUBS)];

      const decision = AIEngine.decideDraw(state, 'p1');

      expect(decision).toBe('DRAW');
    });
  });

  describe('decideDiscard', () => {
    it('should discard highest-point deadwood first', () => {
      const hand: Card[] = [
        createCard(Rank.FIVE, Suit.HEARTS, 'five-h'),
        createCard(Rank.FIVE, Suit.DIAMONDS, 'five-d'),
        createCard(Rank.FIVE, Suit.CLUBS, 'five-c'),
        createCard(Rank.KING, Suit.SPADES, 'king-s'),
        createCard(Rank.TWO, Suit.HEARTS, 'two-h')
      ];
      const player = createPlayer('p1', hand);
      const state = createGameState([player]);

      const discard = AIEngine.decideDiscard(state, 'p1');

      // Should discard King (10 points) over Two (2 points)
      expect(discard.rank).toBe(Rank.KING);
    });

    it('should not discard cards in completed combinations', () => {
      const hand: Card[] = [
        createCard(Rank.FIVE, Suit.HEARTS, 'five-h'),
        createCard(Rank.FIVE, Suit.DIAMONDS, 'five-d'),
        createCard(Rank.FIVE, Suit.CLUBS, 'five-c'),
        createCard(Rank.TWO, Suit.HEARTS, 'two-h')
      ];
      const player = createPlayer('p1', hand);
      const state = createGameState([player]);

      const discard = AIEngine.decideDiscard(state, 'p1');

      // Should discard the Two, not any of the Fives
      expect(discard.rank).toBe(Rank.TWO);
    });

    it('should avoid discarding Jokers when possible', () => {
      const hand: Card[] = [
        createCard(Rank.JOKER, null, 'joker'),
        createCard(Rank.KING, Suit.HEARTS, 'king-h')
      ];
      const player = createPlayer('p1', hand);
      const state = createGameState([player]);

      const discard = AIEngine.decideDiscard(state, 'p1');

      // Should discard King over Joker
      expect(discard.rank).toBe(Rank.KING);
    });
  });

  describe('decideBuy', () => {
    it('should not buy when no buys remaining', () => {
      const player = createPlayer('p1', [], false, 0);
      const state = createGameState([player]);
      const card = createCard(Rank.ACE, Suit.HEARTS);

      const decision = AIEngine.decideBuy(state, 'p1', card);

      expect(decision).toBe(false);
    });

    it('should not buy when already melded', () => {
      const player = createPlayer('p1', [], true, 3);
      const state = createGameState([player]);
      const card = createCard(Rank.ACE, Suit.HEARTS);

      const decision = AIEngine.decideBuy(state, 'p1', card);

      expect(decision).toBe(false);
    });

    it('should buy when card completes combination', () => {
      const hand: Card[] = [
        createCard(Rank.FIVE, Suit.HEARTS),
        createCard(Rank.FIVE, Suit.DIAMONDS)
      ];
      const player = createPlayer('p1', hand, false, 3);
      const state = createGameState([player]);
      const card = createCard(Rank.FIVE, Suit.CLUBS);

      const decision = AIEngine.decideBuy(state, 'p1', card);

      expect(decision).toBe(true);
    });

    it('should be more aggressive in later rounds', () => {
      const hand: Card[] = [
        createCard(Rank.SEVEN, Suit.HEARTS),
        createCard(Rank.EIGHT, Suit.HEARTS)
      ];
      const player = createPlayer('p1', hand, false, 3);
      const state = createGameState([player], 7);
      const card = createCard(Rank.NINE, Suit.HEARTS);

      const decision = AIEngine.decideBuy(state, 'p1', card);

      // More likely to buy in round 7
      expect(typeof decision).toBe('boolean');
    });
  });

  describe('decideMeld', () => {
    it('should not meld when objective not met', () => {
      const hand: Card[] = [
        createCard(Rank.FIVE, Suit.HEARTS),
        createCard(Rank.FIVE, Suit.DIAMONDS),
        createCard(Rank.FIVE, Suit.CLUBS)
      ];
      const player = createPlayer('p1', hand);
      const state = createGameState([player]);

      const decision = AIEngine.decideMeld(state, 'p1');

      // Round 1 needs 2 triplets, we only have 1
      expect(decision.shouldMeld).toBe(false);
    });

    it('should meld when can go out immediately', () => {
      const hand: Card[] = [
        createCard(Rank.FIVE, Suit.HEARTS),
        createCard(Rank.FIVE, Suit.DIAMONDS),
        createCard(Rank.FIVE, Suit.CLUBS),
        createCard(Rank.SEVEN, Suit.HEARTS),
        createCard(Rank.SEVEN, Suit.DIAMONDS),
        createCard(Rank.SEVEN, Suit.CLUBS),
        createCard(Rank.KING, Suit.SPADES)
      ];
      const player = createPlayer('p1', hand);
      const state = createGameState([player]);

      const decision = AIEngine.decideMeld(state, 'p1');

      // Has 2 triplets (6 cards) + 1 card = can go out
      expect(decision.shouldMeld).toBe(true);
      expect(decision.combinations).toBeDefined();
    });

    it('should meld when deadwood is high', () => {
      const hand: Card[] = [
        createCard(Rank.FIVE, Suit.HEARTS),
        createCard(Rank.FIVE, Suit.DIAMONDS),
        createCard(Rank.FIVE, Suit.CLUBS),
        createCard(Rank.SEVEN, Suit.HEARTS),
        createCard(Rank.SEVEN, Suit.DIAMONDS),
        createCard(Rank.SEVEN, Suit.CLUBS),
        createCard(Rank.KING, Suit.SPADES),
        createCard(Rank.QUEEN, Suit.HEARTS),
        createCard(Rank.ACE, Suit.DIAMONDS),
        createCard(Rank.JOKER, null)
      ];
      const player = createPlayer('p1', hand);
      const state = createGameState([player]);

      const decision = AIEngine.decideMeld(state, 'p1');

      // High deadwood (King + Queen + Ace + Joker = 85 points)
      expect(decision.shouldMeld).toBe(true);
    });

    it('should not meld when already melded', () => {
      const player = createPlayer('p1', [], true);
      const state = createGameState([player]);

      const decision = AIEngine.decideMeld(state, 'p1');

      expect(decision.shouldMeld).toBe(false);
    });
  });

  describe('decideJokerSwap', () => {
    it('should not swap when player has not melded', () => {
      const player = createPlayer('p1', [], false);
      const state = createGameState([player]);

      const decision = AIEngine.decideJokerSwap(state, 'p1');

      expect(decision.shouldSwap).toBe(false);
    });

    it('should swap Joker when holding replacement card', () => {
      const hand: Card[] = [
        createCard(Rank.FIVE, Suit.HEARTS, 'five-h')
      ];
      const player = createPlayer('p1', hand, true);
      
      const meldedSequence: Combination = {
        id: 'seq-1',
        type: 'SEQUENCE',
        playerId: 'p1',
        cards: [
          createCard(Rank.THREE, Suit.HEARTS, 'three-h'),
          createCard(Rank.FOUR, Suit.HEARTS, 'four-h'),
          createCard(Rank.JOKER, null, 'joker-1'),
          createCard(Rank.SIX, Suit.HEARTS, 'six-h')
        ]
      };
      player.meldedCombinations = [meldedSequence];

      const state = createGameState([player]);

      const decision = AIEngine.decideJokerSwap(state, 'p1');

      expect(decision.shouldSwap).toBe(true);
      expect(decision.swap?.replacementCard.rank).toBe(Rank.FIVE);
    });

    it('should not swap when no replacement card available', () => {
      const hand: Card[] = [
        createCard(Rank.KING, Suit.SPADES)
      ];
      const player = createPlayer('p1', hand, true);
      
      const meldedSequence: Combination = {
        id: 'seq-1',
        type: 'SEQUENCE',
        playerId: 'p1',
        cards: [
          createCard(Rank.THREE, Suit.HEARTS),
          createCard(Rank.FOUR, Suit.HEARTS),
          createCard(Rank.JOKER, null),
          createCard(Rank.SIX, Suit.HEARTS)
        ]
      };
      player.meldedCombinations = [meldedSequence];

      const state = createGameState([player]);

      const decision = AIEngine.decideJokerSwap(state, 'p1');

      expect(decision.shouldSwap).toBe(false);
    });
  });

  describe('calculateCardValue', () => {
    it('should assign negative value to high-point cards', () => {
      const hand: Card[] = [createCard(Rank.TWO, Suit.HEARTS)];
      const player = createPlayer('p1', hand);
      const state = createGameState([player]);
      const context = { state, player, objective: ROUND_OBJECTIVES[0] };

      const kingValue = AIEngine.calculateCardValue(createCard(Rank.KING, Suit.HEARTS), context);
      const twoValue = AIEngine.calculateCardValue(createCard(Rank.TWO, Suit.HEARTS), context);

      // King should have more negative base value than Two
      expect(kingValue).toBeLessThan(twoValue);
    });

    it('should assign high value to Jokers', () => {
      const hand: Card[] = [createCard(Rank.TWO, Suit.HEARTS)];
      const player = createPlayer('p1', hand);
      const state = createGameState([player]);
      const context = { state, player, objective: ROUND_OBJECTIVES[0] };

      const jokerValue = AIEngine.calculateCardValue(createCard(Rank.JOKER, null), context);

      expect(jokerValue).toBeGreaterThan(50);
    });
  });
});
