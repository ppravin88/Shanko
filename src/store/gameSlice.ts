import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, GamePhase, ROUND_OBJECTIVES, Card, Combination } from '../types';

const initialState: GameState = {
  gameId: '',
  players: [],
  currentPlayerIndex: 0,
  startingPlayerIndex: 0,
  round: 1,
  roundObjective: ROUND_OBJECTIVES[0],
  drawPile: [],
  discardPile: [],
  phase: GamePhase.SETUP,
  winner: null
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    // Game initialization
    initializeGame: (state, action: PayloadAction<Partial<GameState>>) => {
      return { ...initialState, ...action.payload };
    },
    
    // Round management
    startRound: (state, action: PayloadAction<{ drawPile: Card[]; startingPlayerIndex: number }>) => {
      state.drawPile = action.payload.drawPile;
      state.discardPile = [];
      state.startingPlayerIndex = action.payload.startingPlayerIndex;
      state.currentPlayerIndex = action.payload.startingPlayerIndex;
      state.phase = GamePhase.DRAW;
    },
    
    endRound: (state) => {
      state.phase = GamePhase.ROUND_END;
    },
    
    advanceToNextRound: (state) => {
      if (state.round < 7) {
        state.round += 1;
        state.roundObjective = ROUND_OBJECTIVES[state.round - 1];
        // Rotate starting player left (clockwise)
        state.startingPlayerIndex = (state.startingPlayerIndex + 1) % state.players.length;
        state.phase = GamePhase.SETUP;
      } else {
        state.phase = GamePhase.GAME_END;
      }
    },
    
    // Turn progression
    advanceTurn: (state) => {
      state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
      state.phase = GamePhase.DRAW;
    },
    
    setPhase: (state, action: PayloadAction<GamePhase>) => {
      state.phase = action.payload;
    },
    
    setCurrentPlayer: (state, action: PayloadAction<number>) => {
      state.currentPlayerIndex = action.payload;
    },
    
    // Draw/Discard actions
    drawFromDrawPile: (state) => {
      if (state.drawPile.length > 0) {
        state.drawPile.shift(); // Remove top card (will be added to player hand in playersSlice)
        state.phase = GamePhase.MELD;
      }
    },
    
    drawFromDiscardPile: (state) => {
      if (state.discardPile.length > 0) {
        state.discardPile.pop(); // Remove top card (will be added to player hand in playersSlice)
        state.phase = GamePhase.MELD;
      }
    },
    
    discardCard: (state, action: PayloadAction<Card>) => {
      state.discardPile.push(action.payload);
      state.phase = GamePhase.BUY_WINDOW;
    },
    
    discardCardFaceDown: (state, action: PayloadAction<Card>) => {
      // For going out - final card is discarded face down
      state.discardPile.push(action.payload);
      state.phase = GamePhase.ROUND_END;
    },
    
    // Buy actions
    completeBuyWindow: (state) => {
      // After buy window, advance to next player's turn
      state.currentPlayerIndex = (state.currentPlayerIndex + 1) % state.players.length;
      state.phase = GamePhase.DRAW;
    },
    
    executeBuy: (state) => {
      // Remove card from draw pile for the face-down card in buy action
      if (state.drawPile.length > 0) {
        const faceDownCard = state.drawPile.shift()!;
        state.discardPile.push(faceDownCard); // Place face-down on discard pile
      }
    },
    
    // Meld actions
    meldCombinations: (state, action: PayloadAction<{ playerId: string; combinations: Combination[] }>) => {
      // Melding is tracked in playersSlice, this just updates phase if needed
      state.phase = GamePhase.DISCARD;
    },
    
    // Joker swap and sequence extension
    swapJoker: (state, action: PayloadAction<{ combinationId: string; jokerCard: Card; replacementCard: Card }>) => {
      // Joker swap is handled in playersSlice for the melded combinations
      // This action is here for consistency but doesn't modify game state
    },
    
    extendSequence: (state, action: PayloadAction<{ combinationId: string; cards: Card[]; position: 'START' | 'END' }>) => {
      // Sequence extension is handled in playersSlice for the melded combinations
      // This action is here for consistency but doesn't modify game state
    },
    
    // Game end
    setWinner: (state, action: PayloadAction<string>) => {
      state.winner = action.payload;
      state.phase = GamePhase.GAME_END;
    },
    
    // Draw pile management
    reshuffleDiscardPile: (state) => {
      if (state.drawPile.length === 0 && state.discardPile.length > 1) {
        // Keep top card of discard pile, shuffle rest into draw pile
        const topCard = state.discardPile.pop()!;
        state.drawPile = [...state.discardPile];
        state.discardPile = [topCard];
        
        // Shuffle the new draw pile (Fisher-Yates)
        for (let i = state.drawPile.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [state.drawPile[i], state.drawPile[j]] = [state.drawPile[j], state.drawPile[i]];
        }
      }
    },
    
    resetGame: () => initialState
  }
});

export const {
  initializeGame,
  startRound,
  endRound,
  advanceToNextRound,
  advanceTurn,
  setPhase,
  setCurrentPlayer,
  drawFromDrawPile,
  drawFromDiscardPile,
  discardCard,
  discardCardFaceDown,
  completeBuyWindow,
  executeBuy,
  meldCombinations,
  swapJoker,
  extendSequence,
  setWinner,
  reshuffleDiscardPile,
  resetGame
} = gameSlice.actions;

export default gameSlice.reducer;
