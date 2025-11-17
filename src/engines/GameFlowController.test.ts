import { describe, it, expect, beforeEach } from 'vitest';
import { GameFlowController } from './GameFlowController';
import { GameEngine } from './GameEngine';
import { GameState, GamePhase, ROUND_OBJECTIVES } from '../types';

describe('GameFlowController', () => {
  let gameState: GameState;

  beforeEach(() => {
    // Initialize a basic game state for testing
    gameState = GameEngine.initializeGame(4, 2);
  });

  describe('initializeRound', () => {
    it('should initialize a round and set phase to DRAW', () => {
      const result = GameFlowController.initializeRound(gameState);
      
      expect(result.phase).toBe(GamePhase.DRAW);
      expect(result.players.every(p => p.hand.length === 11)).toBe(true);
      expect(result.drawPile.length).toBeGreaterThan(0);
      expect(result.discardPile.length).toBe(1);
    });

    it('should set starting player correctly for round 1', () => {
      const result = GameFlowController.initializeRound(gameState);
      
      expect(result.startingPlayerIndex).toBe(0);
      expect(result.currentPlayerIndex).toBe(0);
    });
  });

  describe('determineStartingPlayer', () => {
    it('should return 0 for round 1', () => {
      const result = GameFlowController.determineStartingPlayer(gameState);
      expect(result).toBe(0);
    });

    it('should rotate starting player for subsequent rounds', () => {
      const round2State = { ...gameState, round: 2, startingPlayerIndex: 0 };
      const result = GameFlowController.determineStartingPlayer(round2State);
      expect(result).toBe(1);
    });

    it('should wrap around when rotating past last player', () => {
      const round2State = { ...gameState, round: 2, startingPlayerIndex: 3 };
      const result = GameFlowController.determineStartingPlayer(round2State);
      expect(result).toBe(0);
    });
  });

  describe('advanceTurn', () => {
    it('should advance to next player', () => {
      const initialState = GameFlowController.initializeRound(gameState);
      const result = GameFlowController.advanceTurn(initialState);
      
      expect(result.currentPlayerIndex).toBe(1);
      expect(result.phase).toBe(GamePhase.DRAW);
    });

    it('should wrap around to first player', () => {
      const initialState = GameFlowController.initializeRound(gameState);
      const state = { ...initialState, currentPlayerIndex: 3 };
      const result = GameFlowController.advanceTurn(state);
      
      expect(result.currentPlayerIndex).toBe(0);
    });
  });

  describe('transitionPhase', () => {
    it('should transition to specified phase', () => {
      const result = GameFlowController.transitionPhase(gameState, GamePhase.MELD);
      expect(result.phase).toBe(GamePhase.MELD);
    });
  });

  describe('shouldExecuteAITurn', () => {
    it('should return true for AI player in DRAW phase', () => {
      const state = GameFlowController.initializeRound(gameState);
      // Set current player to AI (index 2 or 3 based on setup)
      const aiState = { ...state, currentPlayerIndex: 2 };
      
      expect(GameFlowController.shouldExecuteAITurn(aiState)).toBe(true);
    });

    it('should return false for human player', () => {
      const state = GameFlowController.initializeRound(gameState);
      // Set current player to human (index 0 or 1)
      const humanState = { ...state, currentPlayerIndex: 0 };
      
      expect(GameFlowController.shouldExecuteAITurn(humanState)).toBe(false);
    });

    it('should return false in SETUP phase', () => {
      const state = { ...gameState, phase: GamePhase.SETUP };
      expect(GameFlowController.shouldExecuteAITurn(state)).toBe(false);
    });

    it('should return false in ROUND_END phase', () => {
      const state = { ...gameState, phase: GamePhase.ROUND_END };
      expect(GameFlowController.shouldExecuteAITurn(state)).toBe(false);
    });

    it('should return false in GAME_END phase', () => {
      const state = { ...gameState, phase: GamePhase.GAME_END };
      expect(GameFlowController.shouldExecuteAITurn(state)).toBe(false);
    });
  });

  describe('shouldProcessBuyWindow', () => {
    it('should return true in BUY_WINDOW phase with more than 2 players', () => {
      const state = { ...gameState, phase: GamePhase.BUY_WINDOW };
      expect(GameFlowController.shouldProcessBuyWindow(state)).toBe(true);
    });

    it('should return false with 2 players', () => {
      const twoPlayerState = GameEngine.initializeGame(2, 1);
      const state = { ...twoPlayerState, phase: GamePhase.BUY_WINDOW };
      expect(GameFlowController.shouldProcessBuyWindow(state)).toBe(false);
    });

    it('should return false in other phases', () => {
      const state = { ...gameState, phase: GamePhase.DRAW };
      expect(GameFlowController.shouldProcessBuyWindow(state)).toBe(false);
    });
  });

  describe('shouldEndRound', () => {
    it('should return true in ROUND_END phase', () => {
      const state = { ...gameState, phase: GamePhase.ROUND_END };
      expect(GameFlowController.shouldEndRound(state)).toBe(true);
    });

    it('should return false in other phases', () => {
      expect(GameFlowController.shouldEndRound(gameState)).toBe(false);
    });
  });

  describe('shouldEndGame', () => {
    it('should return true in GAME_END phase', () => {
      const state = { ...gameState, phase: GamePhase.GAME_END };
      expect(GameFlowController.shouldEndGame(state)).toBe(true);
    });

    it('should return false in other phases', () => {
      expect(GameFlowController.shouldEndGame(gameState)).toBe(false);
    });
  });

  describe('isGameComplete', () => {
    it('should return true after round 7 in ROUND_END phase', () => {
      const state = { ...gameState, round: 7, phase: GamePhase.ROUND_END };
      expect(GameFlowController.isGameComplete(state)).toBe(true);
    });

    it('should return false before round 7', () => {
      const state = { ...gameState, round: 6, phase: GamePhase.ROUND_END };
      expect(GameFlowController.isGameComplete(state)).toBe(false);
    });

    it('should return false if not in ROUND_END phase', () => {
      const state = { ...gameState, round: 7, phase: GamePhase.DRAW };
      expect(GameFlowController.isGameComplete(state)).toBe(false);
    });
  });

  describe('advanceToNextRound', () => {
    it('should advance to next round and reset player states', () => {
      const initialState = GameFlowController.initializeRound(gameState);
      const result = GameFlowController.advanceToNextRound(initialState);
      
      expect(result.round).toBe(2);
      expect(result.roundObjective).toEqual(ROUND_OBJECTIVES[1]);
      expect(result.players.every(p => p.buysRemaining === 3)).toBe(true);
      expect(result.players.every(p => p.hasMelded === false)).toBe(true);
    });

    it('should transition to GAME_END after round 7', () => {
      const round7State = { ...gameState, round: 7 };
      const result = GameFlowController.advanceToNextRound(round7State);
      
      expect(result.phase).toBe(GamePhase.GAME_END);
    });
  });

  describe('handleRoundTransition', () => {
    it('should advance to next round from ROUND_END phase', () => {
      const state = { ...gameState, phase: GamePhase.ROUND_END };
      const result = GameFlowController.handleRoundTransition(state);
      
      expect(result.round).toBe(2);
    });

    it('should transition to GAME_END after round 7', () => {
      const state = { ...gameState, round: 7, phase: GamePhase.ROUND_END };
      const result = GameFlowController.handleRoundTransition(state);
      
      expect(result.phase).toBe(GamePhase.GAME_END);
    });

    it('should throw error if not in ROUND_END phase', () => {
      const state = { ...gameState, phase: GamePhase.DRAW };
      expect(() => GameFlowController.handleRoundTransition(state)).toThrow();
    });
  });

  describe('calculateRoundScores', () => {
    it('should assign 0 points to winner', () => {
      const winnerId = gameState.players[0].id;
      const scores = GameFlowController.calculateRoundScores(gameState, winnerId);
      
      expect(scores.get(winnerId)).toBe(0);
    });

    it('should calculate points for non-winners based on remaining cards', () => {
      // Give player some cards
      const stateWithCards = {
        ...gameState,
        players: gameState.players.map((p, i) => ({
          ...p,
          hand: i === 1 ? [
            { id: '1', rank: '5' as const, suit: 'HEARTS' as const, deckIndex: 0 },
            { id: '2', rank: 'K' as const, suit: 'HEARTS' as const, deckIndex: 0 }
          ] : []
        }))
      };
      
      const winnerId = stateWithCards.players[0].id;
      const scores = GameFlowController.calculateRoundScores(stateWithCards, winnerId);
      
      // Player 1 should have 5 + 10 = 15 points
      expect(scores.get(stateWithCards.players[1].id)).toBe(15);
    });
  });

  describe('finalizeGame', () => {
    it('should determine winner with lowest score', () => {
      const stateWithScores = {
        ...gameState,
        round: 7,
        players: gameState.players.map((p, i) => ({
          ...p,
          cumulativeScore: i * 10 // 0, 10, 20, 30
        }))
      };
      
      const result = GameFlowController.finalizeGame(stateWithScores);
      
      expect(result.phase).toBe(GamePhase.GAME_END);
      expect(result.winner).toBe(stateWithScores.players[0].id);
    });

    it('should throw error if called before round 7', () => {
      const state = { ...gameState, round: 6 };
      expect(() => GameFlowController.finalizeGame(state)).toThrow();
    });
  });

  describe('getWinner', () => {
    it('should return winner player in GAME_END phase', () => {
      const winnerId = gameState.players[0].id;
      const state = {
        ...gameState,
        phase: GamePhase.GAME_END,
        winner: winnerId
      };
      
      const winner = GameFlowController.getWinner(state);
      expect(winner?.id).toBe(winnerId);
    });

    it('should return null if not in GAME_END phase', () => {
      const winner = GameFlowController.getWinner(gameState);
      expect(winner).toBeNull();
    });
  });

  describe('getFinalStandings', () => {
    it('should return players sorted by cumulative score', () => {
      const stateWithScores = {
        ...gameState,
        players: gameState.players.map((p, i) => ({
          ...p,
          cumulativeScore: (3 - i) * 10 // 30, 20, 10, 0
        }))
      };
      
      const standings = GameFlowController.getFinalStandings(stateWithScores);
      
      expect(standings[0].cumulativeScore).toBe(0);
      expect(standings[1].cumulativeScore).toBe(10);
      expect(standings[2].cumulativeScore).toBe(20);
      expect(standings[3].cumulativeScore).toBe(30);
    });
  });
});
