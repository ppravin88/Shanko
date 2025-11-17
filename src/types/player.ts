import { Card } from './card';
import { Combination } from './combination';

export type PlayerType = 'HUMAN' | 'AI';

export interface Player {
  id: string;
  name: string;
  type: PlayerType;
  hand: Card[];
  meldedCombinations: Combination[];
  hasMelded: boolean;
  buysRemaining: number;
  cumulativeScore: number;
  roundScores: number[];
}
