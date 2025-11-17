import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Player, Card, Combination } from '../types';

interface PlayersState {
  players: Player[];
}

const initialState: PlayersState = {
  players: []
};

const playersSlice = createSlice({
  name: 'players',
  initialState,
  reducers: {
    // Player initialization
    setPlayers: (state, action: PayloadAction<Player[]>) => {
      state.players = action.payload;
    },
    
    // Hand management
    updatePlayerHand: (state, action: PayloadAction<{ playerId: string; hand: Card[] }>) => {
      const player = state.players.find(p => p.id === action.payload.playerId);
      if (player) {
        player.hand = action.payload.hand;
      }
    },
    
    addCardToHand: (state, action: PayloadAction<{ playerId: string; card: Card }>) => {
      const player = state.players.find(p => p.id === action.payload.playerId);
      if (player) {
        player.hand.push(action.payload.card);
      }
    },
    
    addCardsToHand: (state, action: PayloadAction<{ playerId: string; cards: Card[] }>) => {
      const player = state.players.find(p => p.id === action.payload.playerId);
      if (player) {
        player.hand.push(...action.payload.cards);
      }
    },
    
    removeCardFromHand: (state, action: PayloadAction<{ playerId: string; cardId: string }>) => {
      const player = state.players.find(p => p.id === action.payload.playerId);
      if (player) {
        player.hand = player.hand.filter(card => card.id !== action.payload.cardId);
      }
    },
    
    removeCardsFromHand: (state, action: PayloadAction<{ playerId: string; cardIds: string[] }>) => {
      const player = state.players.find(p => p.id === action.payload.playerId);
      if (player) {
        player.hand = player.hand.filter(card => !action.payload.cardIds.includes(card.id));
      }
    },
    
    // Meld actions
    setPlayerMelded: (state, action: PayloadAction<{ playerId: string; combinations: Combination[] }>) => {
      const player = state.players.find(p => p.id === action.payload.playerId);
      if (player) {
        player.hasMelded = true;
        player.meldedCombinations = action.payload.combinations;
        player.buysRemaining = 0; // Forfeit remaining buys when melding
      }
    },
    
    // Joker swap
    swapJokerInCombination: (state, action: PayloadAction<{ 
      playerId: string; 
      combinationId: string; 
      jokerCard: Card; 
      replacementCard: Card 
    }>) => {
      const player = state.players.find(p => p.id === action.payload.playerId);
      if (player) {
        const combination = player.meldedCombinations.find(c => c.id === action.payload.combinationId);
        if (combination) {
          // Replace Joker with the actual card
          const jokerIndex = combination.cards.findIndex(c => c.id === action.payload.jokerCard.id);
          if (jokerIndex !== -1) {
            combination.cards[jokerIndex] = action.payload.replacementCard;
          }
        }
      }
    },
    
    addJokerToHand: (state, action: PayloadAction<{ playerId: string; joker: Card }>) => {
      const player = state.players.find(p => p.id === action.payload.playerId);
      if (player) {
        player.hand.push(action.payload.joker);
      }
    },
    
    // Sequence extension
    extendPlayerSequence: (state, action: PayloadAction<{ 
      playerId: string; 
      combinationId: string; 
      cards: Card[]; 
      position: 'START' | 'END' 
    }>) => {
      const player = state.players.find(p => p.id === action.payload.playerId);
      if (player) {
        const combination = player.meldedCombinations.find(c => c.id === action.payload.combinationId);
        if (combination && combination.type === 'SEQUENCE') {
          if (action.payload.position === 'START') {
            combination.cards = [...action.payload.cards, ...combination.cards];
          } else {
            combination.cards = [...combination.cards, ...action.payload.cards];
          }
        }
      }
    },
    
    // Buy actions
    decrementBuys: (state, action: PayloadAction<string>) => {
      const player = state.players.find(p => p.id === action.payload);
      if (player && player.buysRemaining > 0) {
        player.buysRemaining -= 1;
      }
    },
    
    // Scoring
    updatePlayerScore: (state, action: PayloadAction<{ playerId: string; roundScore: number }>) => {
      const player = state.players.find(p => p.id === action.payload.playerId);
      if (player) {
        player.roundScores.push(action.payload.roundScore);
        player.cumulativeScore += action.payload.roundScore;
      }
    },
    
    // Round reset
    resetPlayersForRound: (state) => {
      state.players.forEach(player => {
        player.hand = [];
        player.meldedCombinations = [];
        player.hasMelded = false;
        player.buysRemaining = 3;
      });
    },
    
    dealCardsToPlayer: (state, action: PayloadAction<{ playerId: string; cards: Card[] }>) => {
      const player = state.players.find(p => p.id === action.payload.playerId);
      if (player) {
        player.hand = action.payload.cards;
      }
    }
  }
});

export const {
  setPlayers,
  updatePlayerHand,
  addCardToHand,
  addCardsToHand,
  removeCardFromHand,
  removeCardsFromHand,
  setPlayerMelded,
  swapJokerInCombination,
  addJokerToHand,
  extendPlayerSequence,
  decrementBuys,
  updatePlayerScore,
  resetPlayersForRound,
  dealCardsToPlayer
} = playersSlice.actions;

export default playersSlice.reducer;
