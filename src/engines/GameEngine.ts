import { GameState, GamePhase, ROUND_OBJECTIVES, Player, Card, Combination } from '../types';
import { DeckManager } from './DeckManager';
import { ScoringEngine } from './ScoringEngine';
import { ValidationEngine } from './ValidationEngine';
import { generateId } from '../utils';

/**
 * GameEngine handles the core game logic for Shanko card game
 * Manages game initialization, round progression, and turn actions
 */
export class GameEngine {
  /**
   * Initialize a new game with the specified number of players
   * Requirements: 1.1, 1.2, 4.1, 4.2
   */
  static initializeGame(playerCount: number, humanPlayers: number = 1): GameState {
    if (playerCount < 2 || playerCount > 8) {
      throw new Error('Player count must be between 2 and 8');
    }

    if (humanPlayers < 0 || humanPlayers > playerCount) {
      throw new Error('Human player count must be between 0 and total player count');
    }

    // Create players
    const players: Player[] = [];
    
    for (let i = 0; i < playerCount; i++) {
      const isHuman = i < humanPlayers;
      players.push({
        id: generateId(),
        name: isHuman ? `Player ${i + 1}` : `AI ${i + 1 - humanPlayers}`,
        type: isHuman ? 'HUMAN' : 'AI',
        hand: [],
        meldedCombinations: [],
        hasMelded: false,
        buysRemaining: 3,
        cumulativeScore: 0,
        roundScores: []
      });
    }

    // Create initial game state
    const gameState: GameState = {
      gameId: generateId(),
      players,
      currentPlayerIndex: 0,
      startingPlayerIndex: 0, // Will be set when round starts
      round: 1,
      roundObjective: ROUND_OBJECTIVES[0],
      drawPile: [],
      discardPile: [],
      phase: GamePhase.SETUP,
      winner: null
    };

    return gameState;
  }

  /**
   * Start a new round by dealing cards and setting up the game state
   * Requirements: 1.1, 4.1, 4.2, 5.2, 5.3
   */
  static startRound(state: GameState): GameState {
    // Create and shuffle decks based on player count
    const allCards = DeckManager.createDecks(state.players.length);

    // Deal 11 cards to each player (Requirement 1.1)
    const updatedPlayers = state.players.map((player, index) => {
      const startIdx = index * 11;
      const hand = allCards.slice(startIdx, startIdx + 11);
      
      return {
        ...player,
        hand,
        meldedCombinations: [],
        hasMelded: false,
        buysRemaining: 3 // Reset buys for new round (Requirement 13.2)
      };
    });

    // Remaining cards go to draw pile
    const drawPile = allCards.slice(state.players.length * 11);

    // Place top card face-up to start discard pile (Requirement 1.7)
    const discardPile: Card[] = [];
    if (drawPile.length > 0) {
      discardPile.push(drawPile.shift()!);
    }

    // Determine starting player
    // Round 1: youngest player (index 0 for simplicity) (Requirement 4.1)
    // Round 2+: rotate left from previous starting player (Requirement 4.2)
    let startingPlayerIndex = state.startingPlayerIndex;
    if (state.round === 1) {
      startingPlayerIndex = 0;
    } else {
      startingPlayerIndex = (state.startingPlayerIndex + 1) % state.players.length;
    }

    return {
      ...state,
      players: updatedPlayers,
      drawPile,
      discardPile,
      startingPlayerIndex,
      currentPlayerIndex: startingPlayerIndex,
      phase: GamePhase.DRAW
    };
  }

  /**
   * End the current round, calculate scores, and prepare for next round
   * Requirements: 5.2, 8.2, 8.3
   */
  static endRound(state: GameState, winnerPlayerId: string): GameState {
    // Calculate round scores for all players (Requirement 8.2)
    const roundScores = ScoringEngine.calculateRoundScores(state.players, winnerPlayerId);

    // Update player scores (Requirement 8.3)
    const updatedPlayers = state.players.map(player => {
      const roundScore = roundScores.get(player.id) || 0;
      return {
        ...player,
        cumulativeScore: player.cumulativeScore + roundScore,
        roundScores: [...player.roundScores, roundScore]
      };
    });

    // Check if game is complete (all 7 rounds played)
    if (state.round >= 7) {
      // Determine overall winner (Requirement 8.5)
      const winner = ScoringEngine.determineWinner(updatedPlayers);
      
      return {
        ...state,
        players: updatedPlayers,
        phase: GamePhase.GAME_END,
        winner: winner.id
      };
    }

    // Advance to next round (Requirement 5.2)
    const nextRound = state.round + 1;
    
    return {
      ...state,
      players: updatedPlayers,
      round: nextRound,
      roundObjective: ROUND_OBJECTIVES[nextRound - 1],
      phase: GamePhase.ROUND_END
    };
  }

  /**
   * Draw a card from either the draw pile or discard pile
   * Requirements: 4.3, 4.4
   */
  static drawCard(state: GameState, source: 'DRAW' | 'DISCARD'): { state: GameState; drawnCard: Card } {
    // Validate it's the current player's turn and they're in DRAW phase
    if (state.phase !== GamePhase.DRAW) {
      throw new Error('Cannot draw card outside of DRAW phase');
    }

    let drawnCard: Card;
    let updatedState = { ...state };

    if (source === 'DRAW') {
      // Draw from draw pile (Requirement 4.3)
      if (state.drawPile.length === 0) {
        // Handle draw pile depletion - reshuffle discard pile
        updatedState = this.reshuffleDiscardPile(state);
      }

      if (updatedState.drawPile.length === 0) {
        throw new Error('No cards available to draw');
      }

      drawnCard = updatedState.drawPile[0];
      updatedState = {
        ...updatedState,
        drawPile: updatedState.drawPile.slice(1)
      };
    } else {
      // Draw from discard pile (Requirement 4.3)
      if (state.discardPile.length === 0) {
        throw new Error('Discard pile is empty');
      }

      drawnCard = state.discardPile[state.discardPile.length - 1];
      updatedState = {
        ...updatedState,
        discardPile: updatedState.discardPile.slice(0, -1)
      };
    }

    // Add card to current player's hand (Requirement 4.4)
    const currentPlayer = updatedState.players[updatedState.currentPlayerIndex];
    const updatedPlayers = updatedState.players.map((player, idx) => {
      if (idx === updatedState.currentPlayerIndex) {
        return {
          ...player,
          hand: [...player.hand, drawnCard]
        };
      }
      return player;
    });

    // Move to MELD phase (player can choose to meld or go straight to discard)
    return {
      state: {
        ...updatedState,
        players: updatedPlayers,
        phase: GamePhase.MELD
      },
      drawnCard
    };
  }

  /**
   * Discard a card from the current player's hand
   * Requirements: 4.5
   */
  static discardCard(state: GameState, cardId: string): GameState {
    // Validate phase (can discard from MELD or DISCARD phase)
    if (state.phase !== GamePhase.MELD && state.phase !== GamePhase.DISCARD) {
      throw new Error('Cannot discard card outside of MELD or DISCARD phase');
    }

    const currentPlayer = state.players[state.currentPlayerIndex];
    
    // Find the card in player's hand
    const cardIndex = currentPlayer.hand.findIndex(card => card.id === cardId);
    if (cardIndex === -1) {
      throw new Error('Card not found in player hand');
    }

    const discardedCard = currentPlayer.hand[cardIndex];

    // Remove card from player's hand
    const updatedPlayers = state.players.map((player, idx) => {
      if (idx === state.currentPlayerIndex) {
        return {
          ...player,
          hand: player.hand.filter(card => card.id !== cardId)
        };
      }
      return player;
    });

    // Add card to discard pile
    const updatedDiscardPile = [...state.discardPile, discardedCard];

    // Move to BUY_WINDOW phase (or advance turn if 2 players)
    const nextPhase = state.players.length === 2 ? GamePhase.DRAW : GamePhase.BUY_WINDOW;
    
    return {
      ...state,
      players: updatedPlayers,
      discardPile: updatedDiscardPile,
      phase: nextPhase,
      // If 2 players, advance turn immediately (Requirement 12.2)
      currentPlayerIndex: state.players.length === 2 
        ? (state.currentPlayerIndex + 1) % state.players.length 
        : state.currentPlayerIndex
    };
  }

  /**
   * Advance to the next player's turn (clockwise)
   * Requirements: 4.5
   */
  static advanceTurn(state: GameState): GameState {
    return {
      ...state,
      currentPlayerIndex: (state.currentPlayerIndex + 1) % state.players.length,
      phase: GamePhase.DRAW
    };
  }

  /**
   * Reshuffle discard pile into draw pile when draw pile is depleted
   * Requirements: 10.1
   */
  private static reshuffleDiscardPile(state: GameState): GameState {
    if (state.discardPile.length <= 1) {
      // Keep at least the top card in discard pile
      return state;
    }

    // Keep top card of discard pile, shuffle rest into draw pile
    const topCard = state.discardPile[state.discardPile.length - 1];
    const cardsToShuffle = state.discardPile.slice(0, -1);
    const shuffledCards = DeckManager.shuffle(cardsToShuffle);

    return {
      ...state,
      drawPile: shuffledCards,
      discardPile: [topCard]
    };
  }

  /**
   * Meld combinations for the current player
   * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 15.1, 15.3
   */
  static meldCombinations(state: GameState, combinations: Combination[]): GameState {
    // Validate phase
    if (state.phase !== GamePhase.MELD) {
      throw new Error('Cannot meld outside of MELD phase');
    }

    const currentPlayer = state.players[state.currentPlayerIndex];

    // Check if player has already melded (Requirement 6.6)
    if (currentPlayer.hasMelded) {
      throw new Error('Player has already melded this round');
    }

    // Validate combinations meet round objective (Requirement 6.3)
    if (!ValidationEngine.meetsRoundObjective(combinations, state.roundObjective)) {
      throw new Error('Combinations do not meet round objective');
    }

    // Validate all combinations are valid
    for (const combo of combinations) {
      if (combo.type === 'TRIPLET') {
        if (!ValidationEngine.isValidTriplet(combo.cards)) {
          throw new Error('Invalid triplet in meld');
        }
      } else if (combo.type === 'SEQUENCE') {
        if (!ValidationEngine.isValidSequence(combo.cards)) {
          throw new Error('Invalid sequence in meld');
        }
      }
    }

    // Get all card IDs from combinations
    const meldedCardIds = new Set(
      combinations.flatMap(combo => combo.cards.map(card => card.id))
    );

    // Verify all cards are in player's hand
    for (const cardId of meldedCardIds) {
      if (!currentPlayer.hand.some(card => card.id === cardId)) {
        throw new Error('Cannot meld cards not in hand');
      }
    }

    // Remove melded cards from player's hand
    const updatedPlayers = state.players.map((player, idx) => {
      if (idx === state.currentPlayerIndex) {
        return {
          ...player,
          hand: player.hand.filter(card => !meldedCardIds.has(card.id)),
          meldedCombinations: combinations,
          hasMelded: true,
          buysRemaining: 0 // Forfeit remaining buys (Requirement 15.1, 15.3)
        };
      }
      return player;
    });

    // Move to DISCARD phase (Requirement 15.5)
    return {
      ...state,
      players: updatedPlayers,
      phase: GamePhase.DISCARD
    };
  }

  /**
   * Go out by melding combinations and discarding final card
   * Requirements: 6.7, 14.1, 14.2, 14.3, 14.4, 14.5
   */
  static goOut(state: GameState, combinations: Combination[], finalCardId: string): GameState {
    // Validate phase
    if (state.phase !== GamePhase.MELD) {
      throw new Error('Cannot go out outside of MELD phase');
    }

    const currentPlayer = state.players[state.currentPlayerIndex];

    // Validate combinations meet round objective (Requirement 6.3)
    if (!ValidationEngine.meetsRoundObjective(combinations, state.roundObjective)) {
      throw new Error('Combinations do not meet round objective');
    }

    // Validate all combinations are valid
    for (const combo of combinations) {
      if (combo.type === 'TRIPLET') {
        if (!ValidationEngine.isValidTriplet(combo.cards)) {
          throw new Error('Invalid triplet in meld');
        }
      } else if (combo.type === 'SEQUENCE') {
        if (!ValidationEngine.isValidSequence(combo.cards)) {
          throw new Error('Invalid sequence in meld');
        }
      }
    }

    // Get all card IDs from combinations
    const meldedCardIds = new Set(
      combinations.flatMap(combo => combo.cards.map(card => card.id))
    );

    // Verify player has exactly the melded cards plus one final card (Requirement 14.1)
    if (currentPlayer.hand.length !== meldedCardIds.size + 1) {
      throw new Error('Must have exactly one card remaining after melding to go out');
    }

    // Find the final card
    const finalCard = currentPlayer.hand.find(card => card.id === finalCardId);
    if (!finalCard) {
      throw new Error('Final card not found in hand');
    }

    // Verify final card is not in melded combinations
    if (meldedCardIds.has(finalCardId)) {
      throw new Error('Final card cannot be part of melded combinations');
    }

    // Update player state
    const updatedPlayers = state.players.map((player, idx) => {
      if (idx === state.currentPlayerIndex) {
        return {
          ...player,
          hand: [], // All cards are now melded or discarded
          meldedCombinations: combinations,
          hasMelded: true,
          buysRemaining: 0
        };
      }
      return player;
    });

    // Add final card to discard pile face-down (Requirement 14.2)
    const updatedDiscardPile = [...state.discardPile, finalCard];

    // End the round (Requirement 14.3)
    return this.endRound(
      {
        ...state,
        players: updatedPlayers,
        discardPile: updatedDiscardPile,
        phase: GamePhase.ROUND_END
      },
      currentPlayer.id // Current player is the winner (Requirement 14.4)
    );
  }

  /**
   * Execute a buy action for a player
   * Requirements: 12.1, 12.3, 12.4, 12.5, 13.1, 13.3, 13.4, 15.2
   */
  static buyCard(state: GameState, playerId: string): { state: GameState; boughtCard: Card; extraCard: Card } {
    // Validate phase
    if (state.phase !== GamePhase.BUY_WINDOW) {
      throw new Error('Cannot buy outside of BUY_WINDOW phase');
    }

    // Disable buying for 2-player games (Requirement 12.2)
    if (state.players.length === 2) {
      throw new Error('Buying is disabled in 2-player games');
    }

    const player = state.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    // Check if player has melded (Requirement 15.2)
    if (player.hasMelded) {
      throw new Error('Cannot buy after melding');
    }

    // Check if player has buys remaining (Requirement 13.3, 13.4)
    if (player.buysRemaining <= 0) {
      throw new Error('No buys remaining');
    }

    // Get the top card from discard pile (Requirement 12.5)
    if (state.discardPile.length === 0) {
      throw new Error('Discard pile is empty');
    }

    const boughtCard = state.discardPile[state.discardPile.length - 1];

    // Draw a card from draw pile to place face-down (Requirement 12.3)
    let updatedState = { ...state };
    if (state.drawPile.length === 0) {
      updatedState = this.reshuffleDiscardPile(state);
    }

    if (updatedState.drawPile.length === 0) {
      throw new Error('No cards available in draw pile for buy');
    }

    const extraCard = updatedState.drawPile[0];

    // Remove bought card from discard pile
    const updatedDiscardPile = updatedState.discardPile.slice(0, -1);

    // Remove extra card from draw pile
    const updatedDrawPile = updatedState.drawPile.slice(1);

    // Add both cards to player's hand (Requirement 12.4)
    const updatedPlayers = updatedState.players.map(p => {
      if (p.id === playerId) {
        return {
          ...p,
          hand: [...p.hand, boughtCard, extraCard],
          buysRemaining: p.buysRemaining - 1 // Decrement buy count (Requirement 13.3)
        };
      }
      return p;
    });

    return {
      state: {
        ...updatedState,
        players: updatedPlayers,
        drawPile: updatedDrawPile,
        discardPile: updatedDiscardPile
      },
      boughtCard,
      extraCard
    };
  }

  /**
   * Complete the buy window and advance to next player's turn
   * Called when no players want to buy or after a buy is completed
   */
  static completeBuyWindow(state: GameState): GameState {
    if (state.phase !== GamePhase.BUY_WINDOW) {
      throw new Error('Not in BUY_WINDOW phase');
    }

    return this.advanceTurn(state);
  }

  /**
   * Get buy priority order for the current discard
   * Returns player IDs in priority order (highest priority first)
   * Requirements: 16.1, 16.2, 16.3, 16.4, 16.5
   */
  static getBuyPriority(state: GameState): string[] {
    if (state.phase !== GamePhase.BUY_WINDOW) {
      return [];
    }

    const priorityList: string[] = [];
    const playerCount = state.players.length;
    
    // Start from the player after the one who just discarded (Requirement 16.4)
    // The current player is the one who just discarded
    const discarderIndex = state.currentPlayerIndex;
    
    // Calculate priority in clockwise order (Requirement 16.2)
    for (let i = 1; i < playerCount; i++) {
      const playerIndex = (discarderIndex + i) % playerCount;
      const player = state.players[playerIndex];
      
      // Exclude next player in turn order (they will draw normally) (Requirement 16.4)
      const nextPlayerIndex = (discarderIndex + 1) % playerCount;
      if (playerIndex === nextPlayerIndex) {
        continue;
      }
      
      // Exclude melded players (Requirement 16.3)
      if (player.hasMelded) {
        continue;
      }
      
      // Exclude players with no buys remaining
      if (player.buysRemaining <= 0) {
        continue;
      }
      
      priorityList.push(player.id);
    }
    
    return priorityList;
  }

  /**
   * Check if a player can buy the current discard
   */
  static canPlayerBuy(state: GameState, playerId: string): boolean {
    if (state.phase !== GamePhase.BUY_WINDOW) {
      return false;
    }

    if (state.players.length === 2) {
      return false; // No buying in 2-player games
    }

    const player = state.players.find(p => p.id === playerId);
    if (!player) {
      return false;
    }

    // Check if player has melded
    if (player.hasMelded) {
      return false;
    }

    // Check if player has buys remaining
    if (player.buysRemaining <= 0) {
      return false;
    }

    // Check if player is in the buy priority list
    const priorityList = this.getBuyPriority(state);
    return priorityList.includes(playerId);
  }

  /**
   * Swap a Joker from a melded sequence with a card from player's hand
   * Requirements: 17.1, 17.2, 17.3, 17.4
   */
  static swapJoker(
    state: GameState,
    playerId: string,
    combinationId: string,
    jokerCardId: string,
    replacementCardId: string
  ): GameState {
    const player = state.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    // Player must have melded to swap Jokers (Requirement 17.1)
    if (!player.hasMelded) {
      throw new Error('Player must have melded to swap Jokers');
    }

    // Find the replacement card in player's hand
    const replacementCard = player.hand.find(card => card.id === replacementCardId);
    if (!replacementCard) {
      throw new Error('Replacement card not found in player hand');
    }

    // Find the combination (can be from any player's melded combinations)
    let targetPlayer: Player | undefined;
    let targetCombination: Combination | undefined;

    for (const p of state.players) {
      const combo = p.meldedCombinations.find(c => c.id === combinationId);
      if (combo) {
        targetPlayer = p;
        targetCombination = combo;
        break;
      }
    }

    if (!targetPlayer || !targetCombination) {
      throw new Error('Combination not found');
    }

    // Find the Joker card in the combination
    const jokerCard = targetCombination.cards.find(card => card.id === jokerCardId);
    if (!jokerCard) {
      throw new Error('Joker card not found in combination');
    }

    // Validate the swap (Requirement 17.2, 17.3)
    if (!ValidationEngine.canSwapJoker(targetCombination, jokerCard, replacementCard)) {
      throw new Error('Invalid Joker swap');
    }

    // Perform the swap
    const updatedPlayers = state.players.map(p => {
      if (p.id === targetPlayer!.id) {
        // Update the combination with the replacement card
        const updatedCombinations = p.meldedCombinations.map(combo => {
          if (combo.id === combinationId) {
            return {
              ...combo,
              cards: combo.cards.map(card => 
                card.id === jokerCardId ? replacementCard : card
              )
            };
          }
          return combo;
        });

        return {
          ...p,
          meldedCombinations: updatedCombinations
        };
      }

      if (p.id === playerId) {
        // Remove replacement card from hand and add Joker (Requirement 17.4)
        return {
          ...p,
          hand: p.hand
            .filter(card => card.id !== replacementCardId)
            .concat(jokerCard)
        };
      }

      return p;
    });

    return {
      ...state,
      players: updatedPlayers
    };
  }

  /**
   * Extend a melded sequence with additional cards
   * Requirements: 17.5, 17.6
   */
  static extendSequence(
    state: GameState,
    playerId: string,
    combinationId: string,
    extensionCardIds: string[],
    position: 'START' | 'END'
  ): GameState {
    const player = state.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    // Player must have melded to extend sequences
    if (!player.hasMelded) {
      throw new Error('Player must have melded to extend sequences');
    }

    // Find the extension cards in player's hand
    const extensionCards = extensionCardIds.map(cardId => {
      const card = player.hand.find(c => c.id === cardId);
      if (!card) {
        throw new Error(`Extension card ${cardId} not found in player hand`);
      }
      return card;
    });

    // Find the combination (can be from any player's melded combinations)
    let targetPlayer: Player | undefined;
    let targetCombination: Combination | undefined;

    for (const p of state.players) {
      const combo = p.meldedCombinations.find(c => c.id === combinationId);
      if (combo) {
        targetPlayer = p;
        targetCombination = combo;
        break;
      }
    }

    if (!targetPlayer || !targetCombination) {
      throw new Error('Combination not found');
    }

    // Must be a sequence
    if (targetCombination.type !== 'SEQUENCE') {
      throw new Error('Can only extend sequences');
    }

    // Validate the extension (Requirement 17.6)
    if (!ValidationEngine.canExtendSequence(targetCombination as Combination & { type: 'SEQUENCE' }, extensionCards, position)) {
      throw new Error('Invalid sequence extension');
    }

    // Perform the extension
    const updatedPlayers = state.players.map(p => {
      if (p.id === targetPlayer!.id) {
        // Update the combination with the extension cards
        const updatedCombinations = p.meldedCombinations.map(combo => {
          if (combo.id === combinationId) {
            const newCards = position === 'START'
              ? [...extensionCards, ...combo.cards]
              : [...combo.cards, ...extensionCards];
            
            return {
              ...combo,
              cards: newCards
            };
          }
          return combo;
        });

        return {
          ...p,
          meldedCombinations: updatedCombinations
        };
      }

      if (p.id === playerId) {
        // Remove extension cards from hand (Requirement 17.5)
        return {
          ...p,
          hand: p.hand.filter(card => !extensionCardIds.includes(card.id))
        };
      }

      return p;
    });

    return {
      ...state,
      players: updatedPlayers
    };
  }

  /**
   * Validate if an action can be performed by a player
   * Requirements: 10.4
   */
  static validatePlayerAction(state: GameState, playerId: string, action: string): void {
    const playerIndex = state.players.findIndex(p => p.id === playerId);
    
    if (playerIndex === -1) {
      throw new Error('Player not found');
    }

    // Prevent out-of-turn actions (Requirement 10.4)
    // Exception: buying can be done out of turn during BUY_WINDOW
    if (action !== 'buy' && playerIndex !== state.currentPlayerIndex) {
      throw new Error('Cannot perform action out of turn');
    }
  }

  /**
   * Detect stalemate condition
   * Requirements: 10.2
   */
  static detectStalemate(state: GameState): boolean {
    // Stalemate occurs when:
    // 1. Draw pile is empty and cannot be reshuffled
    // 2. No player can make progress
    
    if (state.drawPile.length === 0 && state.discardPile.length <= 1) {
      return true;
    }

    // Additional stalemate detection could include:
    // - All players have passed on buying multiple times
    // - Game has gone on for too many turns without progress
    // For now, we'll keep it simple with just the card depletion check

    return false;
  }

  /**
   * Handle stalemate by ending the round
   * Requirements: 10.2
   */
  static handleStalemate(state: GameState): GameState {
    // In a stalemate, calculate scores for all players based on their current hands
    // No winner is declared (all players score their remaining cards)
    
    const roundScores = new Map<string, number>();
    for (const player of state.players) {
      roundScores.set(player.id, ScoringEngine.calculateRoundScore(player.hand));
    }

    const updatedPlayers = state.players.map(player => {
      const roundScore = roundScores.get(player.id) || 0;
      return {
        ...player,
        cumulativeScore: player.cumulativeScore + roundScore,
        roundScores: [...player.roundScores, roundScore]
      };
    });

    // Check if game is complete
    if (state.round >= 7) {
      const winner = ScoringEngine.determineWinner(updatedPlayers);
      return {
        ...state,
        players: updatedPlayers,
        phase: GamePhase.GAME_END,
        winner: winner.id
      };
    }

    // Advance to next round
    const nextRound = state.round + 1;
    return {
      ...state,
      players: updatedPlayers,
      round: nextRound,
      roundObjective: ROUND_OBJECTIVES[nextRound - 1],
      phase: GamePhase.ROUND_END
    };
  }

  /**
   * Handle player disconnection
   * Requirements: 10.3
   */
  static handlePlayerDisconnection(state: GameState, playerId: string): GameState {
    // For now, we'll convert the disconnected player to an AI player
    // In a real implementation, this might involve more complex logic
    
    const updatedPlayers = state.players.map(player => {
      if (player.id === playerId) {
        return {
          ...player,
          type: 'AI' as const,
          name: `${player.name} (AI)`
        };
      }
      return player;
    });

    return {
      ...state,
      players: updatedPlayers
    };
  }
}
