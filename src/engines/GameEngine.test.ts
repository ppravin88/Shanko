import { describe, it, expect, beforeEach } from 'vitest';
import { GameEngine } from './GameEngine';
import { GameState, GamePhase, Rank, Suit, Card, Combination } from '../types';
import { generateId } from '../utils';

describe('GameEngine', () => {
  describe('initializeGame', () => {
    it('should initialize game with correct player count', () => {
      const state = GameEngine.initializeGame(4, 2);
      expect(state.players).toHaveLength(4);
      expect(state.players.filter(p => p.type === 'HUMAN')).toHaveLength(2);
      expect(state.players.filter(p => p.type === 'AI')).toHaveLength(2);
    });

    it('should start at round 1 with correct objective', () => {
      const state = GameEngine.initializeGame(4);
      expect(state.round).toBe(1);
      expect(state.roundObjective.triplets).toBe(2);
      expect(state.roundObjective.sequences).toBe(0);
    });

    it('should initialize all players with empty hands and 3 buys', () => {
      const state = GameEngine.initializeGame(4);
      state.players.forEach(player => {
        expect(player.hand).toHaveLength(0);
        expect(player.buysRemaining).toBe(3);
        expect(player.hasMelded).toBe(false);
        expect(player.cumulativeScore).toBe(0);
      });
    });

    it('should throw error for invalid player count', () => {
      expect(() => GameEngine.initializeGame(1)).toThrow('Player count must be between 2 and 8');
      expect(() => GameEngine.initializeGame(9)).toThrow('Player count must be between 2 and 8');
    });
  });

  describe('startRound', () => {
    let state: GameState;

    beforeEach(() => {
      state = GameEngine.initializeGame(4);
    });

    it('should deal 11 cards to each player', () => {
      const roundState = GameEngine.startRound(state);
      roundState.players.forEach(player => {
        expect(player.hand).toHaveLength(11);
      });
    });

    it('should create draw pile and discard pile', () => {
      const roundState = GameEngine.startRound(state);
      expect(roundState.drawPile.length).toBeGreaterThan(0);
      expect(roundState.discardPile).toHaveLength(1);
    });

    it('should set phase to DRAW', () => {
      const roundState = GameEngine.startRound(state);
      expect(roundState.phase).toBe(GamePhase.DRAW);
    });

    it('should reset player buys to 3', () => {
      const roundState = GameEngine.startRound(state);
      roundState.players.forEach(player => {
        expect(player.buysRemaining).toBe(3);
        expect(player.hasMelded).toBe(false);
      });
    });
  });

  describe('drawCard', () => {
    let state: GameState;

    beforeEach(() => {
      state = GameEngine.initializeGame(4);
      state = GameEngine.startRound(state);
    });

    it('should draw card from draw pile', () => {
      const initialDrawPileSize = state.drawPile.length;
      const initialHandSize = state.players[state.currentPlayerIndex].hand.length;
      
      const result = GameEngine.drawCard(state, 'DRAW');
      
      expect(result.state.drawPile.length).toBe(initialDrawPileSize - 1);
      expect(result.state.players[result.state.currentPlayerIndex].hand.length).toBe(initialHandSize + 1);
      expect(result.state.phase).toBe(GamePhase.MELD);
    });

    it('should draw card from discard pile', () => {
      const initialDiscardPileSize = state.discardPile.length;
      const initialHandSize = state.players[state.currentPlayerIndex].hand.length;
      
      const result = GameEngine.drawCard(state, 'DISCARD');
      
      expect(result.state.discardPile.length).toBe(initialDiscardPileSize - 1);
      expect(result.state.players[result.state.currentPlayerIndex].hand.length).toBe(initialHandSize + 1);
    });

    it('should throw error if not in DRAW phase', () => {
      state.phase = GamePhase.DISCARD;
      expect(() => GameEngine.drawCard(state, 'DRAW')).toThrow('Cannot draw card outside of DRAW phase');
    });
  });

  describe('discardCard', () => {
    let state: GameState;
    let cardToDiscard: Card;

    beforeEach(() => {
      state = GameEngine.initializeGame(4);
      state = GameEngine.startRound(state);
      const drawResult = GameEngine.drawCard(state, 'DRAW');
      state = drawResult.state;
      cardToDiscard = state.players[state.currentPlayerIndex].hand[0];
    });

    it('should discard card and move to BUY_WINDOW for 3+ players', () => {
      const initialHandSize = state.players[state.currentPlayerIndex].hand.length;
      
      const newState = GameEngine.discardCard(state, cardToDiscard.id);
      
      expect(newState.players[newState.currentPlayerIndex].hand.length).toBe(initialHandSize - 1);
      expect(newState.discardPile[newState.discardPile.length - 1].id).toBe(cardToDiscard.id);
      expect(newState.phase).toBe(GamePhase.BUY_WINDOW);
    });

    it('should advance turn immediately for 2 players', () => {
      let twoPlayerState = GameEngine.initializeGame(2);
      twoPlayerState = GameEngine.startRound(twoPlayerState);
      const drawResult = GameEngine.drawCard(twoPlayerState, 'DRAW');
      twoPlayerState = drawResult.state;
      
      const cardId = twoPlayerState.players[twoPlayerState.currentPlayerIndex].hand[0].id;
      const newState = GameEngine.discardCard(twoPlayerState, cardId);
      
      expect(newState.phase).toBe(GamePhase.DRAW);
      expect(newState.currentPlayerIndex).toBe(1);
    });
  });

  describe('meldCombinations', () => {
    let state: GameState;

    beforeEach(() => {
      state = GameEngine.initializeGame(4);
      state = GameEngine.startRound(state);
      const drawResult = GameEngine.drawCard(state, 'DRAW');
      state = drawResult.state;
    });

    it('should meld valid combinations meeting round objective', () => {
      const currentPlayer = state.players[state.currentPlayerIndex];
      
      // Create valid triplets for round 1 (2 triplets required)
      const triplet1: Combination = {
        id: generateId(),
        type: 'TRIPLET',
        playerId: currentPlayer.id,
        cards: [
          { id: generateId(), rank: Rank.FIVE, suit: Suit.HEARTS, deckIndex: 0 },
          { id: generateId(), rank: Rank.FIVE, suit: Suit.DIAMONDS, deckIndex: 0 },
          { id: generateId(), rank: Rank.FIVE, suit: Suit.CLUBS, deckIndex: 0 }
        ]
      };

      const triplet2: Combination = {
        id: generateId(),
        type: 'TRIPLET',
        playerId: currentPlayer.id,
        cards: [
          { id: generateId(), rank: Rank.KING, suit: Suit.HEARTS, deckIndex: 0 },
          { id: generateId(), rank: Rank.KING, suit: Suit.DIAMONDS, deckIndex: 0 },
          { id: generateId(), rank: Rank.KING, suit: Suit.CLUBS, deckIndex: 0 }
        ]
      };

      // Replace player's hand with these cards
      state.players[state.currentPlayerIndex].hand = [
        ...triplet1.cards,
        ...triplet2.cards,
        { id: generateId(), rank: Rank.TWO, suit: Suit.HEARTS, deckIndex: 0 }
      ];

      const newState = GameEngine.meldCombinations(state, [triplet1, triplet2]);
      
      expect(newState.players[newState.currentPlayerIndex].hasMelded).toBe(true);
      expect(newState.players[newState.currentPlayerIndex].buysRemaining).toBe(0);
      expect(newState.phase).toBe(GamePhase.DISCARD);
    });

    it('should throw error if combinations do not meet objective', () => {
      const currentPlayer = state.players[state.currentPlayerIndex];
      
      // Only one triplet (round 1 requires 2)
      const triplet: Combination = {
        id: generateId(),
        type: 'TRIPLET',
        playerId: currentPlayer.id,
        cards: [
          { id: generateId(), rank: Rank.FIVE, suit: Suit.HEARTS, deckIndex: 0 },
          { id: generateId(), rank: Rank.FIVE, suit: Suit.DIAMONDS, deckIndex: 0 },
          { id: generateId(), rank: Rank.FIVE, suit: Suit.CLUBS, deckIndex: 0 }
        ]
      };

      state.players[state.currentPlayerIndex].hand = triplet.cards;

      expect(() => GameEngine.meldCombinations(state, [triplet]))
        .toThrow('Combinations do not meet round objective');
    });
  });

  describe('buyCard', () => {
    let state: GameState;

    beforeEach(() => {
      state = GameEngine.initializeGame(4);
      state = GameEngine.startRound(state);
      const drawResult = GameEngine.drawCard(state, 'DRAW');
      state = drawResult.state;
      const cardId = state.players[state.currentPlayerIndex].hand[0].id;
      state = GameEngine.discardCard(state, cardId);
    });

    it('should allow player to buy card', () => {
      const buyerIndex = (state.currentPlayerIndex + 2) % state.players.length;
      const buyerId = state.players[buyerIndex].id;
      const initialHandSize = state.players[buyerIndex].hand.length;
      const initialBuys = state.players[buyerIndex].buysRemaining;
      
      const result = GameEngine.buyCard(state, buyerId);
      
      expect(result.state.players[buyerIndex].hand.length).toBe(initialHandSize + 2);
      expect(result.state.players[buyerIndex].buysRemaining).toBe(initialBuys - 1);
    });

    it('should throw error for 2-player games', () => {
      let twoPlayerState = GameEngine.initializeGame(2);
      twoPlayerState = GameEngine.startRound(twoPlayerState);
      
      expect(() => GameEngine.buyCard(twoPlayerState, twoPlayerState.players[0].id))
        .toThrow('Buying is disabled in 2-player games');
    });

    it('should throw error if player has no buys remaining', () => {
      const buyerIndex = (state.currentPlayerIndex + 2) % state.players.length;
      state.players[buyerIndex].buysRemaining = 0;
      
      expect(() => GameEngine.buyCard(state, state.players[buyerIndex].id))
        .toThrow('No buys remaining');
    });
  });

  describe('getBuyPriority', () => {
    let state: GameState;

    beforeEach(() => {
      state = GameEngine.initializeGame(4);
      state = GameEngine.startRound(state);
      const drawResult = GameEngine.drawCard(state, 'DRAW');
      state = drawResult.state;
      const cardId = state.players[state.currentPlayerIndex].hand[0].id;
      state = GameEngine.discardCard(state, cardId);
    });

    it('should return priority list in clockwise order', () => {
      const priority = GameEngine.getBuyPriority(state);
      
      // Should exclude current player and next player
      expect(priority.length).toBeLessThan(state.players.length);
    });

    it('should exclude melded players', () => {
      state.players[2].hasMelded = true;
      const priority = GameEngine.getBuyPriority(state);
      
      expect(priority).not.toContain(state.players[2].id);
    });

    it('should exclude players with no buys', () => {
      state.players[2].buysRemaining = 0;
      const priority = GameEngine.getBuyPriority(state);
      
      expect(priority).not.toContain(state.players[2].id);
    });
  });

  describe('endRound', () => {
    let state: GameState;

    beforeEach(() => {
      state = GameEngine.initializeGame(4);
      state = GameEngine.startRound(state);
    });

    it('should calculate scores and advance to next round', () => {
      const winnerId = state.players[0].id;
      const newState = GameEngine.endRound(state, winnerId);
      
      expect(newState.round).toBe(2);
      expect(newState.players[0].roundScores).toHaveLength(1);
      expect(newState.players[0].roundScores[0]).toBe(0); // Winner gets 0 points
    });

    it('should end game after round 7', () => {
      state.round = 7;
      const winnerId = state.players[0].id;
      const newState = GameEngine.endRound(state, winnerId);
      
      expect(newState.phase).toBe(GamePhase.GAME_END);
      expect(newState.winner).toBeTruthy();
    });
  });
});
