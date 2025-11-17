import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import { Player, GamePhase } from '../types';

// Basic selectors (memoized by default with createSelector)
export const selectGameState = (state: RootState) => state.game;
export const selectPlayers = (state: RootState) => state.players.players;
export const selectCurrentPlayerIndex = (state: RootState) => state.game.currentPlayerIndex;
export const selectGamePhase = (state: RootState) => state.game.phase;
export const selectRound = (state: RootState) => state.game.round;
export const selectRoundObjective = (state: RootState) => state.game.roundObjective;
export const selectDrawPile = (state: RootState) => state.game.drawPile;
export const selectDiscardPile = (state: RootState) => state.game.discardPile;
export const selectWinner = (state: RootState) => state.game.winner;
export const selectStartingPlayerIndex = (state: RootState) => state.game.startingPlayerIndex;

// Derived selectors
export const selectCurrentPlayer = createSelector(
  [selectPlayers, selectCurrentPlayerIndex],
  (players, currentIndex): Player | undefined => {
    return players[currentIndex];
  }
);

export const selectTopDiscardCard = createSelector(
  [selectDiscardPile],
  (discardPile) => {
    return discardPile.length > 0 ? discardPile[discardPile.length - 1] : null;
  }
);

export const selectDrawPileCount = createSelector(
  [selectDrawPile],
  (drawPile) => drawPile.length
);

export const selectDiscardPileCount = createSelector(
  [selectDiscardPile],
  (discardPile) => discardPile.length
);

// Buy priority order selector
export const selectBuyPriorityOrder = createSelector(
  [selectPlayers, selectCurrentPlayerIndex],
  (players, currentPlayerIndex): string[] => {
    if (players.length === 0) return [];
    
    const priorityOrder: string[] = [];
    const totalPlayers = players.length;
    
    // Start from the player after the current player (who just discarded)
    // and go clockwise, excluding melded players and the next player in turn
    const nextPlayerIndex = (currentPlayerIndex + 1) % totalPlayers;
    
    for (let i = 1; i < totalPlayers; i++) {
      const playerIndex = (currentPlayerIndex + i) % totalPlayers;
      
      // Skip the next player in turn order (they get to draw normally)
      if (playerIndex === nextPlayerIndex) continue;
      
      const player = players[playerIndex];
      
      // Only include players who haven't melded and have buys remaining
      if (!player.hasMelded && player.buysRemaining > 0) {
        priorityOrder.push(player.id);
      }
    }
    
    return priorityOrder;
  }
);

// Valid actions selector
export const selectValidActions = createSelector(
  [selectGameState, selectCurrentPlayer, selectPlayers],
  (gameState, currentPlayer, allPlayers) => {
    const actions = {
      canDrawFromDrawPile: false,
      canDrawFromDiscardPile: false,
      canDiscard: false,
      canMeld: false,
      canBuy: false,
      canGoOut: false,
      canSwapJoker: false,
      canExtendSequence: false
    };
    
    if (!currentPlayer) return actions;
    
    const { phase, drawPile, discardPile } = gameState;
    
    // Draw phase actions
    if (phase === GamePhase.DRAW) {
      actions.canDrawFromDrawPile = drawPile.length > 0;
      actions.canDrawFromDiscardPile = discardPile.length > 0;
    }
    
    // Meld phase actions
    if (phase === GamePhase.MELD) {
      actions.canMeld = !currentPlayer.hasMelded && currentPlayer.hand.length >= gameState.roundObjective.totalCards;
      actions.canDiscard = true; // Can skip melding and just discard
    }
    
    // Discard phase actions
    if (phase === GamePhase.DISCARD) {
      actions.canDiscard = true;
      actions.canGoOut = currentPlayer.hasMelded && currentPlayer.hand.length === 1;
    }
    
    // Post-meld actions (can be done after melding)
    if (currentPlayer.hasMelded) {
      // Check if any melded combinations have Jokers that can be swapped
      const hasSwappableJokers = allPlayers.some(player => 
        player.meldedCombinations.some(combo => 
          combo.type === 'SEQUENCE' && combo.cards.some(card => card.rank === 'JOKER')
        )
      );
      actions.canSwapJoker = hasSwappableJokers;
      
      // Check if any sequences can be extended
      const hasExtendableSequences = allPlayers.some(player =>
        player.meldedCombinations.some(combo => combo.type === 'SEQUENCE')
      );
      actions.canExtendSequence = hasExtendableSequences;
    }
    
    // Buy window actions
    if (phase === GamePhase.BUY_WINDOW) {
      // Current player cannot buy (they just discarded)
      // This would be checked for other players
      actions.canBuy = false;
    }
    
    return actions;
  }
);

// Player by ID selector factory
export const selectPlayerById = (playerId: string) =>
  createSelector(
    [selectPlayers],
    (players): Player | undefined => {
      return players.find(p => p.id === playerId);
    }
  );

// Melded players selector
export const selectMeldedPlayers = createSelector(
  [selectPlayers],
  (players): Player[] => {
    return players.filter(p => p.hasMelded);
  }
);

// Non-melded players selector
export const selectNonMeldedPlayers = createSelector(
  [selectPlayers],
  (players): Player[] => {
    return players.filter(p => !p.hasMelded);
  }
);

// Game progress selector
export const selectGameProgress = createSelector(
  [selectRound, selectPlayers],
  (round, players) => {
    return {
      currentRound: round,
      totalRounds: 7,
      completedRounds: round - 1,
      playerScores: players.map(p => ({
        playerId: p.id,
        playerName: p.name,
        cumulativeScore: p.cumulativeScore,
        roundScores: p.roundScores
      }))
    };
  }
);

// Check if player can buy a specific card
export const selectCanPlayerBuy = (playerId: string) =>
  createSelector(
    [selectPlayers, selectBuyPriorityOrder, selectGamePhase],
    (players, priorityOrder, phase): boolean => {
      if (phase !== GamePhase.BUY_WINDOW) return false;
      
      const player = players.find(p => p.id === playerId);
      if (!player) return false;
      
      // Player must not have melded and must have buys remaining
      if (player.hasMelded || player.buysRemaining === 0) return false;
      
      // Player must be in the priority order
      return priorityOrder.includes(playerId);
    }
  );

// Starting player selector (optimized with explicit memoization)
export const selectStartingPlayer = createSelector(
  [selectPlayers, selectStartingPlayerIndex],
  (players, startingIndex): Player | undefined => {
    return players[startingIndex];
  },
  {
    memoizeOptions: {
      maxSize: 10,
      resultEqualityCheck: (a, b) => a?.id === b?.id
    }
  }
);

// Check if game is over
export const selectIsGameOver = createSelector(
  [selectGamePhase, selectRound],
  (phase, round): boolean => {
    return phase === GamePhase.GAME_END || round > 7;
  }
);

// Get lowest scoring player (potential winner)
export const selectLowestScoringPlayer = createSelector(
  [selectPlayers],
  (players): Player | undefined => {
    if (players.length === 0) return undefined;
    
    return players.reduce((lowest, player) => 
      player.cumulativeScore < lowest.cumulativeScore ? player : lowest
    );
  }
);
