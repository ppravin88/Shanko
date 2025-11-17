import { Card } from './card';

export type CombinationType = 'TRIPLET' | 'SEQUENCE';

export interface Combination {
  id: string;
  type: CombinationType;
  cards: Card[];
  playerId: string;
}

export interface Triplet extends Combination {
  type: 'TRIPLET';
  cards: [Card, Card, Card];
}

export interface Sequence extends Combination {
  type: 'SEQUENCE';
  cards: Card[];
}
