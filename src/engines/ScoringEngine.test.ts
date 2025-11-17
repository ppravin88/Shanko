import { describe, it, expect } from 'vitest';
import { ScoringEngine } from './ScoringEngine';
import { Card, Rank, Suit, Player } from '../types';

describe('ScoringEngine', () => {
  describe('getCardPoints', () => {
    it('should return 50 points for Joker', () => {
      const joker: Card = {
        id: '1',
        rank: Rank.JOKER,
        suit: null,
        deckIndex: 0
      };
      expect(ScoringEngine.getCardPoints(joker)).toBe(50);
    });

    it('should return 15 points for Ace', () => {
      const ace: Card = {
        id: '2',
        rank: Rank.ACE,
        suit: Suit.HEARTS,
        deckIndex: 0
      };
      expect(ScoringEngine.getCardPoints(ace)).toBe(15);
    });

    it('should return 10 points for Jack', () => {
      const jack: Card = {
        id: '3',
        rank: Rank.JACK,
        suit: Suit.DIAMONDS,
        deckIndex: 0
      };
      expect(ScoringEngine.getCardPoints(jack)).toBe(10);
    });

    it('should return 10 points for Queen', () => {
      const queen: Card = {
        id: '4',
        rank: Rank.QUEEN,
        suit: Suit.CLUBS,
        deckIndex: 0
      };
      expect(ScoringEngine.getCardPoints(queen)).toBe(10);
    });

    it('should return 10 points for King', () => {
      const king: Card = {
        id: '5',
        rank: Rank.KING,
        suit: Suit.SPADES,
        deckIndex: 0
      };
      expect(ScoringEngine.getCardPoints(king)).toBe(10);
    });

    it('should return face value for number cards', () => {
      const two: Card = { id: '6', rank: Rank.TWO, suit: Suit.HEARTS, deckIndex: 0 };
      const three: Card = { id: '7', rank: Rank.THREE, suit: Suit.HEARTS, deckIndex: 0 };
      const four: Card = { id: '8', rank: Rank.FOUR, suit: Suit.HEARTS, deckIndex: 0 };
      const five: Card = { id: '9', rank: Rank.FIVE, suit: Suit.HEARTS, deckIndex: 0 };
      const six: Card = { id: '10', rank: Rank.SIX, suit: Suit.HEARTS, deckIndex: 0 };
      const seven: Card = { id: '11', rank: Rank.SEVEN, suit: Suit.HEARTS, deckIndex: 0 };
      const eight: Card = { id: '12', rank: Rank.EIGHT, suit: Suit.HEARTS, deckIndex: 0 };
      const nine: Card = { id: '13', rank: Rank.NINE, suit: Suit.HEARTS, deckIndex: 0 };
      const ten: Card = { id: '14', rank: Rank.TEN, suit: Suit.HEARTS, deckIndex: 0 };

      expect(ScoringEngine.getCardPoints(two)).toBe(2);
      expect(ScoringEngine.getCardPoints(three)).toBe(3);
      expect(ScoringEngine.getCardPoints(four)).toBe(4);
      expect(ScoringEngine.getCardPoints(five)).toBe(5);
      expect(ScoringEngine.getCardPoints(six)).toBe(6);
      expect(ScoringEngine.getCardPoints(seven)).toBe(7);
      expect(ScoringEngine.getCardPoints(eight)).toBe(8);
      expect(ScoringEngine.getCardPoints(nine)).toBe(9);
      expect(ScoringEngine.getCardPoints(ten)).toBe(10);
    });
  });

  describe('calculateRoundScore', () => {
    it('should return 0 for empty hand', () => {
      expect(ScoringEngine.calculateRoundScore([])).toBe(0);
    });

    it('should calculate correct score for single card', () => {
      const hand: Card[] = [
        { id: '1', rank: Rank.FIVE, suit: Suit.HEARTS, deckIndex: 0 }
      ];
      expect(ScoringEngine.calculateRoundScore(hand)).toBe(5);
    });

    it('should calculate correct score for multiple number cards', () => {
      const hand: Card[] = [
        { id: '1', rank: Rank.TWO, suit: Suit.HEARTS, deckIndex: 0 },
        { id: '2', rank: Rank.FIVE, suit: Suit.DIAMONDS, deckIndex: 0 },
        { id: '3', rank: Rank.NINE, suit: Suit.CLUBS, deckIndex: 0 }
      ];
      expect(ScoringEngine.calculateRoundScore(hand)).toBe(16); // 2 + 5 + 9
    });

    it('should calculate correct score for mixed cards', () => {
      const hand: Card[] = [
        { id: '1', rank: Rank.ACE, suit: Suit.HEARTS, deckIndex: 0 },      // 15
        { id: '2', rank: Rank.KING, suit: Suit.DIAMONDS, deckIndex: 0 },   // 10
        { id: '3', rank: Rank.FIVE, suit: Suit.CLUBS, deckIndex: 0 }       // 5
      ];
      expect(ScoringEngine.calculateRoundScore(hand)).toBe(30); // 15 + 10 + 5
    });

    it('should calculate correct score with Joker', () => {
      const hand: Card[] = [
        { id: '1', rank: Rank.JOKER, suit: null, deckIndex: 0 },           // 50
        { id: '2', rank: Rank.THREE, suit: Suit.HEARTS, deckIndex: 0 }     // 3
      ];
      expect(ScoringEngine.calculateRoundScore(hand)).toBe(53); // 50 + 3
    });

    it('should calculate correct score for all face cards', () => {
      const hand: Card[] = [
        { id: '1', rank: Rank.JACK, suit: Suit.HEARTS, deckIndex: 0 },     // 10
        { id: '2', rank: Rank.QUEEN, suit: Suit.DIAMONDS, deckIndex: 0 },  // 10
        { id: '3', rank: Rank.KING, suit: Suit.CLUBS, deckIndex: 0 }       // 10
      ];
      expect(ScoringEngine.calculateRoundScore(hand)).toBe(30); // 10 + 10 + 10
    });
  });

  describe('updateCumulativeScore', () => {
    it('should add round score to cumulative score', () => {
      const player: Player = {
        id: 'player1',
        name: 'Test Player',
        type: 'HUMAN',
        hand: [],
        meldedCombinations: [],
        hasMelded: false,
        buysRemaining: 3,
        cumulativeScore: 25,
        roundScores: [10, 15]
      };

      const newScore = ScoringEngine.updateCumulativeScore(player, 20);
      expect(newScore).toBe(45); // 25 + 20
    });

    it('should handle zero round score', () => {
      const player: Player = {
        id: 'player1',
        name: 'Test Player',
        type: 'HUMAN',
        hand: [],
        meldedCombinations: [],
        hasMelded: false,
        buysRemaining: 3,
        cumulativeScore: 30,
        roundScores: []
      };

      const newScore = ScoringEngine.updateCumulativeScore(player, 0);
      expect(newScore).toBe(30); // 30 + 0
    });

    it('should handle starting from zero cumulative score', () => {
      const player: Player = {
        id: 'player1',
        name: 'Test Player',
        type: 'HUMAN',
        hand: [],
        meldedCombinations: [],
        hasMelded: false,
        buysRemaining: 3,
        cumulativeScore: 0,
        roundScores: []
      };

      const newScore = ScoringEngine.updateCumulativeScore(player, 15);
      expect(newScore).toBe(15); // 0 + 15
    });
  });

  describe('determineWinner', () => {
    it('should return player with lowest cumulative score', () => {
      const players: Player[] = [
        {
          id: 'player1',
          name: 'Player 1',
          type: 'HUMAN',
          hand: [],
          meldedCombinations: [],
          hasMelded: false,
          buysRemaining: 3,
          cumulativeScore: 50,
          roundScores: []
        },
        {
          id: 'player2',
          name: 'Player 2',
          type: 'HUMAN',
          hand: [],
          meldedCombinations: [],
          hasMelded: false,
          buysRemaining: 3,
          cumulativeScore: 30,
          roundScores: []
        },
        {
          id: 'player3',
          name: 'Player 3',
          type: 'HUMAN',
          hand: [],
          meldedCombinations: [],
          hasMelded: false,
          buysRemaining: 3,
          cumulativeScore: 45,
          roundScores: []
        }
      ];

      const winner = ScoringEngine.determineWinner(players);
      expect(winner.id).toBe('player2');
      expect(winner.cumulativeScore).toBe(30);
    });

    it('should return first player when all have same score', () => {
      const players: Player[] = [
        {
          id: 'player1',
          name: 'Player 1',
          type: 'HUMAN',
          hand: [],
          meldedCombinations: [],
          hasMelded: false,
          buysRemaining: 3,
          cumulativeScore: 40,
          roundScores: []
        },
        {
          id: 'player2',
          name: 'Player 2',
          type: 'HUMAN',
          hand: [],
          meldedCombinations: [],
          hasMelded: false,
          buysRemaining: 3,
          cumulativeScore: 40,
          roundScores: []
        }
      ];

      const winner = ScoringEngine.determineWinner(players);
      expect(winner.id).toBe('player1');
    });

    it('should handle single player', () => {
      const players: Player[] = [
        {
          id: 'player1',
          name: 'Player 1',
          type: 'HUMAN',
          hand: [],
          meldedCombinations: [],
          hasMelded: false,
          buysRemaining: 3,
          cumulativeScore: 100,
          roundScores: []
        }
      ];

      const winner = ScoringEngine.determineWinner(players);
      expect(winner.id).toBe('player1');
    });

    it('should throw error for empty player array', () => {
      expect(() => ScoringEngine.determineWinner([])).toThrow('Cannot determine winner with no players');
    });
  });

  describe('calculateRoundScores', () => {
    it('should assign 0 points to winner', () => {
      const players: Player[] = [
        {
          id: 'player1',
          name: 'Player 1',
          type: 'HUMAN',
          hand: [
            { id: '1', rank: Rank.FIVE, suit: Suit.HEARTS, deckIndex: 0 }
          ],
          meldedCombinations: [],
          hasMelded: true,
          buysRemaining: 3,
          cumulativeScore: 0,
          roundScores: []
        }
      ];

      const scores = ScoringEngine.calculateRoundScores(players, 'player1');
      expect(scores.get('player1')).toBe(0);
    });

    it('should calculate scores for non-winners based on remaining cards', () => {
      const players: Player[] = [
        {
          id: 'player1',
          name: 'Player 1',
          type: 'HUMAN',
          hand: [],
          meldedCombinations: [],
          hasMelded: true,
          buysRemaining: 3,
          cumulativeScore: 0,
          roundScores: []
        },
        {
          id: 'player2',
          name: 'Player 2',
          type: 'HUMAN',
          hand: [
            { id: '1', rank: Rank.FIVE, suit: Suit.HEARTS, deckIndex: 0 },
            { id: '2', rank: Rank.TEN, suit: Suit.DIAMONDS, deckIndex: 0 }
          ],
          meldedCombinations: [],
          hasMelded: false,
          buysRemaining: 3,
          cumulativeScore: 0,
          roundScores: []
        },
        {
          id: 'player3',
          name: 'Player 3',
          type: 'HUMAN',
          hand: [
            { id: '3', rank: Rank.ACE, suit: Suit.CLUBS, deckIndex: 0 }
          ],
          meldedCombinations: [],
          hasMelded: false,
          buysRemaining: 3,
          cumulativeScore: 0,
          roundScores: []
        }
      ];

      const scores = ScoringEngine.calculateRoundScores(players, 'player1');
      expect(scores.get('player1')).toBe(0);
      expect(scores.get('player2')).toBe(15); // 5 + 10
      expect(scores.get('player3')).toBe(15); // Ace = 15
    });

    it('should handle all players with remaining cards except winner', () => {
      const players: Player[] = [
        {
          id: 'winner',
          name: 'Winner',
          type: 'HUMAN',
          hand: [],
          meldedCombinations: [],
          hasMelded: true,
          buysRemaining: 0,
          cumulativeScore: 0,
          roundScores: []
        },
        {
          id: 'loser1',
          name: 'Loser 1',
          type: 'HUMAN',
          hand: [
            { id: '1', rank: Rank.JOKER, suit: null, deckIndex: 0 }
          ],
          meldedCombinations: [],
          hasMelded: false,
          buysRemaining: 3,
          cumulativeScore: 0,
          roundScores: []
        },
        {
          id: 'loser2',
          name: 'Loser 2',
          type: 'HUMAN',
          hand: [
            { id: '2', rank: Rank.KING, suit: Suit.HEARTS, deckIndex: 0 },
            { id: '3', rank: Rank.QUEEN, suit: Suit.DIAMONDS, deckIndex: 0 }
          ],
          meldedCombinations: [],
          hasMelded: false,
          buysRemaining: 3,
          cumulativeScore: 0,
          roundScores: []
        }
      ];

      const scores = ScoringEngine.calculateRoundScores(players, 'winner');
      expect(scores.get('winner')).toBe(0);
      expect(scores.get('loser1')).toBe(50); // Joker = 50
      expect(scores.get('loser2')).toBe(20); // King + Queen = 10 + 10
    });
  });
});
