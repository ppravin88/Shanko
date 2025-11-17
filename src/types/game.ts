import { Card } from './card';
import { Player } from './player';

export enum GamePhase {
  SETUP = 'SETUP',
  DRAW = 'DRAW',
  MELD = 'MELD',
  DISCARD = 'DISCARD',
  BUY_WINDOW = 'BUY_WINDOW',
  ROUND_END = 'ROUND_END',
  GAME_END = 'GAME_END'
}

export interface RoundObjective {
  round: number;
  triplets: number;
  sequences: number;
  totalCards: number;
}

export interface GameState {
  gameId: string;
  players: Player[];
  currentPlayerIndex: number;
  startingPlayerIndex: number;
  round: number;
  roundObjective: RoundObjective;
  drawPile: Card[];
  discardPile: Card[];
  phase: GamePhase;
  winner: string | null;
}

export const ROUND_OBJECTIVES: RoundObjective[] = [
  { round: 1, triplets: 2, sequences: 0, totalCards: 6 },
  { round: 2, triplets: 1, sequences: 1, totalCards: 7 },
  { round: 3, triplets: 0, sequences: 2, totalCards: 8 },
  { round: 4, triplets: 3, sequences: 0, totalCards: 9 },
  { round: 5, triplets: 2, sequences: 1, totalCards: 10 },
  { round: 6, triplets: 1, sequences: 2, totalCards: 11 },
  { round: 7, triplets: 0, sequences: 3, totalCards: 12 }
];
