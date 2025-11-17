import { GameState, GamePhase, Player } from '../types';
import { GameEngine } from './GameEngine';
import { AIEngine } from './AIEngine';

/**
 * GameFlowController orchestrates the game loop and manages game flow
 * Requirements: 4.1, 4.2, 5.1, 5.2, 5.3
 */
export class GameFlowController {
  /**
   * Initialize a new round
   * Requirements: 4.1, 4.2, 5.1, 5.2
   */
  static initializeRound(state: GameState): GameState {
    // Start the round using GameEngine
    let updatedState = GameEngine.startRound(state);
    
    // Set phase to DRAW for the starting player
    updatedState = {
      ...updatedState,
      phase: GamePhase.DRAW
    };
    
    return updatedState;
  }

  /**
   * Determine the starting player for a round
   * Round 1: youngest player (index 0 for simplicity)
   * Round 2+: rotate left (clockwise) from previous starting player
   * Requirements: 4.1, 4.2
   */
  static determineStartingPlayer(state: GameState): number {
    if (state.round === 1) {
      // Round 1: youngest player (Requirement 4.1)
      return 0;
    } else {
      // Round 2+: rotate left from previous starting player (Requirement 4.2)
      return (state.startingPlayerIndex + 1) % state.players.length;
    }
  }

  /**
   * Set the starting player for the current round
   * Requirements: 4.1, 4.2
   */
  static setStartingPlayer(state: GameState, startingPlayerIndex: number): GameState {
    return {
      ...state,
      startingPlayerIndex,
      currentPlayerIndex: startingPlayerIndex
    };
  }

  /**
   * Handle turn progression - advance to next player
   * Requirements: 4.5, 5.3
   */
  static advanceTurn(state: GameState): GameState {
    return GameEngine.advanceTurn(state);
  }

  /**
   * Manage game phase transitions
   * Requirements: 5.3
   */
  static transitionPhase(state: GameState, newPhase: GamePhase): GameState {
    return {
      ...state,
      phase: newPhase
    };
  }

  /**
   * Coordinate AI turn execution
   * Requirements: 18.1, 18.2, 18.3, 18.4, 18.5
   */
  static async executeAITurn(state: GameState): Promise<GameState> {
    const currentPlayer = state.players[state.currentPlayerIndex];
    
    if (currentPlayer.type !== 'AI') {
      throw new Error('Current player is not an AI');
    }

    let updatedState = { ...state };

    try {
      // DRAW phase - AI decides whether to draw from draw pile or discard pile
      if (updatedState.phase === GamePhase.DRAW) {
        const drawDecision = AIEngine.decideDraw(updatedState, currentPlayer.id);
        const { state: afterDrawState } = GameEngine.drawCard(updatedState, drawDecision);
        updatedState = afterDrawState;
      }

      // MELD phase - AI decides whether to meld
      if (updatedState.phase === GamePhase.MELD) {
        const meldDecision = AIEngine.decideMeld(updatedState, currentPlayer.id);
        
        if (meldDecision.shouldMeld && meldDecision.combinations) {
          // Check if AI can go out
          const updatedPlayer = updatedState.players[updatedState.currentPlayerIndex];
          const totalMeldedCards = meldDecision.combinations.reduce(
            (sum, combo) => sum + combo.cards.length,
            0
          );
          
          if (updatedPlayer.hand.length === totalMeldedCards + 1) {
            // AI can go out - find the remaining card
            const meldedCardIds = new Set(
              meldDecision.combinations.flatMap(combo => combo.cards.map(c => c.id))
            );
            const finalCard = updatedPlayer.hand.find(card => !meldedCardIds.has(card.id));
            
            if (finalCard) {
              // Go out
              updatedState = GameEngine.goOut(
                updatedState,
                meldDecision.combinations,
                finalCard.id
              );
              return updatedState; // Round ends, no need to continue
            }
          }
          
          // Just meld (not going out)
          updatedState = GameEngine.meldCombinations(updatedState, meldDecision.combinations);
        }
      }

      // DISCARD phase - AI decides which card to discard
      if (updatedState.phase === GamePhase.DISCARD || updatedState.phase === GamePhase.MELD) {
        const discardCard = AIEngine.decideDiscard(updatedState, currentPlayer.id);
        updatedState = GameEngine.discardCard(updatedState, discardCard.id);
      }

      // BUY_WINDOW phase - handled separately by handleBuyWindow
      // The AI turn is complete at this point

      return updatedState;
    } catch (error) {
      console.error('AI turn execution error:', error);
      // On error, try to at least discard a random card to keep game moving
      const currentPlayerAfterError = updatedState.players[updatedState.currentPlayerIndex];
      if (currentPlayerAfterError.hand.length > 0 && 
          (updatedState.phase === GamePhase.MELD || updatedState.phase === GamePhase.DISCARD)) {
        const randomCard = currentPlayerAfterError.hand[0];
        updatedState = GameEngine.discardCard(updatedState, randomCard.id);
      }
      return updatedState;
    }
  }

  /**
   * Handle the buy window phase - check if any AI players want to buy
   * Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 16.1, 16.2, 16.3, 16.4, 16.5
   */
  static async handleBuyWindow(
    state: GameState,
    onBuyAttempt?: (playerId: string, playerName: string) => Promise<boolean>
  ): Promise<GameState> {
    if (state.phase !== GamePhase.BUY_WINDOW) {
      return state;
    }

    // Get buy priority order
    const buyPriority = GameEngine.getBuyPriority(state);
    
    if (buyPriority.length === 0) {
      // No one can buy, advance turn
      return GameEngine.completeBuyWindow(state);
    }

    let updatedState = { ...state };

    // Check each player in priority order
    for (const playerId of buyPriority) {
      const player = updatedState.players.find(p => p.id === playerId);
      if (!player) continue;

      let wantsToBuy = false;

      if (player.type === 'AI') {
        // AI decides whether to buy
        const discardedCard = updatedState.discardPile[updatedState.discardPile.length - 1];
        wantsToBuy = AIEngine.decideBuy(updatedState, playerId, discardedCard);
      } else if (onBuyAttempt) {
        // Human player - ask via callback
        wantsToBuy = await onBuyAttempt(playerId, player.name);
      }

      if (wantsToBuy) {
        // Execute the buy
        try {
          const { state: afterBuyState } = GameEngine.buyCard(updatedState, playerId);
          updatedState = afterBuyState;
          break; // Only one player can buy
        } catch (error) {
          console.error('Buy execution error:', error);
          // Continue to next player in priority
        }
      }
    }

    // Complete buy window and advance turn
    return GameEngine.completeBuyWindow(updatedState);
  }

  /**
   * Check if current player is AI and should execute turn automatically
   * Requirements: 18.1, 18.5
   */
  static shouldExecuteAITurn(state: GameState): boolean {
    if (state.phase === GamePhase.SETUP || 
        state.phase === GamePhase.ROUND_END || 
        state.phase === GamePhase.GAME_END ||
        state.phase === GamePhase.BUY_WINDOW) {
      return false;
    }

    const currentPlayer = state.players[state.currentPlayerIndex];
    return currentPlayer.type === 'AI';
  }

  /**
   * Check if game is in a state where buy window should be processed
   * Requirements: 12.1, 16.1
   */
  static shouldProcessBuyWindow(state: GameState): boolean {
    return state.phase === GamePhase.BUY_WINDOW && state.players.length > 2;
  }

  /**
   * Get the current player
   */
  static getCurrentPlayer(state: GameState): Player {
    return state.players[state.currentPlayerIndex];
  }

  /**
   * Check if round should end (someone went out or stalemate)
   * Requirements: 10.2, 14.3
   */
  static shouldEndRound(state: GameState): boolean {
    return state.phase === GamePhase.ROUND_END;
  }

  /**
   * Check if game should end (all 7 rounds complete)
   * Requirements: 5.5, 8.5
   */
  static shouldEndGame(state: GameState): boolean {
    return state.phase === GamePhase.GAME_END;
  }

  /**
   * Detect if all 7 rounds are complete
   * Requirements: 5.5
   */
  static isGameComplete(state: GameState): boolean {
    return state.round >= 7 && state.phase === GamePhase.ROUND_END;
  }

  /**
   * Calculate final winner and transition to game over
   * Requirements: 5.5, 8.5
   */
  static finalizeGame(state: GameState): GameState {
    if (state.round < 7) {
      throw new Error('Cannot finalize game before all 7 rounds are complete');
    }

    // Determine winner (player with lowest cumulative score)
    let winner = state.players[0];
    for (const player of state.players) {
      if (player.cumulativeScore < winner.cumulativeScore) {
        winner = player;
      }
    }

    return {
      ...state,
      phase: GamePhase.GAME_END,
      winner: winner.id
    };
  }

  /**
   * Get game winner
   * Requirements: 8.5
   */
  static getWinner(state: GameState): Player | null {
    if (state.phase !== GamePhase.GAME_END || !state.winner) {
      return null;
    }

    return state.players.find(p => p.id === state.winner) || null;
  }

  /**
   * Get final standings (all players sorted by cumulative score)
   * Requirements: 8.5
   */
  static getFinalStandings(state: GameState): Player[] {
    return [...state.players].sort((a, b) => a.cumulativeScore - b.cumulativeScore);
  }

  /**
   * Handle round transition - calculate scores, reset states, advance to next round
   * Requirements: 5.2, 8.2, 8.3, 13.2
   */
  static handleRoundTransition(state: GameState): GameState {
    // Note: Scores should already be calculated by GameEngine.endRound
    // This method handles the transition from ROUND_END to the next round
    
    if (state.phase !== GamePhase.ROUND_END) {
      throw new Error('Cannot transition round when not in ROUND_END phase');
    }

    if (state.round >= 7) {
      // All 7 rounds complete - game ends
      return {
        ...state,
        phase: GamePhase.GAME_END
      };
    }

    // Advance to next round
    return this.advanceToNextRound(state);
  }

  /**
   * Advance to next round
   * Requirements: 5.2, 8.2, 8.3, 13.2
   */
  static advanceToNextRound(state: GameState): GameState {
    if (state.round >= 7) {
      // Game is complete
      return {
        ...state,
        phase: GamePhase.GAME_END
      };
    }

    // Advance round counter
    const nextRound = state.round + 1;

    // Reset player states for new round (Requirement 13.2)
    const resetPlayers = state.players.map(player => ({
      ...player,
      hand: [],
      meldedCombinations: [],
      hasMelded: false,
      buysRemaining: 3 // Reset buys (Requirement 13.2)
    }));

    const updatedState: GameState = {
      ...state,
      round: nextRound,
      players: resetPlayers,
      phase: GamePhase.SETUP
    };

    // Initialize the new round
    return this.initializeRound(updatedState);
  }

  /**
   * Calculate round scores for all players
   * Requirements: 8.2, 8.3
   */
  static calculateRoundScores(state: GameState, winnerPlayerId: string): Map<string, number> {
    const scores = new Map<string, number>();
    
    for (const player of state.players) {
      if (player.id === winnerPlayerId) {
        // Winner gets 0 points (Requirement 8.2)
        scores.set(player.id, 0);
      } else {
        // Calculate points from remaining cards in hand (Requirement 8.2)
        let score = 0;
        for (const card of player.hand) {
          if (card.rank === 'JOKER') {
            score += 50;
          } else if (card.rank === 'A') {
            score += 15;
          } else if (['J', 'Q', 'K'].includes(card.rank)) {
            score += 10;
          } else {
            score += parseInt(card.rank);
          }
        }
        scores.set(player.id, score);
      }
    }
    
    return scores;
  }

  /**
   * Update cumulative scores for all players
   * Requirements: 8.3
   */
  static updateCumulativeScores(state: GameState, roundScores: Map<string, number>): GameState {
    const updatedPlayers = state.players.map(player => {
      const roundScore = roundScores.get(player.id) || 0;
      return {
        ...player,
        cumulativeScore: player.cumulativeScore + roundScore,
        roundScores: [...player.roundScores, roundScore]
      };
    });

    return {
      ...state,
      players: updatedPlayers
    };
  }

  /**
   * Handle stalemate detection and resolution
   * Requirements: 10.2
   */
  static checkAndHandleStalemate(state: GameState): GameState {
    if (GameEngine.detectStalemate(state)) {
      return GameEngine.handleStalemate(state);
    }
    return state;
  }
}
