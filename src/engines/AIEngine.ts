import { Card, Rank, Suit } from '../types/card';
import { Combination, CombinationType, Sequence } from '../types/combination';
import { Player } from '../types/player';
import { GameState, RoundObjective } from '../types/game';
import { ValidationEngine } from './ValidationEngine';
import { ScoringEngine } from './ScoringEngine';

/**
 * Represents a partial combination that could be completed
 */
interface PartialCombination {
  type: CombinationType;
  cards: Card[];
  missingCards: number;
  potentialValue: number;
}

/**
 * Evaluation of a player's hand
 */
export interface HandEvaluation {
  completedCombinations: Combination[];
  potentialCombinations: PartialCombination[];
  deadwood: Card[];
  deadwoodPoints: number;
  turnsToComplete: number;
}

/**
 * Context for AI decision making
 */
interface GameContext {
  state: GameState;
  player: Player;
  objective: RoundObjective;
}

/**
 * AIEngine provides strategic decision-making for computer-controlled players
 * 
 * Requirements: 18.1, 18.2, 18.3, 18.4, 18.5
 */
export class AIEngine {
  /**
   * Evaluate a player's hand to determine completed and potential combinations
   * 
   * Requirements: 18.1, 18.2, 18.3
   */
  static evaluateHand(hand: Card[], objective: RoundObjective): HandEvaluation {
    const completedCombinations: Combination[] = [];
    const potentialCombinations: PartialCombination[] = [];
    const usedCards = new Set<string>();

    // Find all completed triplets
    const triplets = this.findCompletedTriplets(hand);
    for (const triplet of triplets) {
      completedCombinations.push({
        id: `temp-${Math.random()}`,
        type: 'TRIPLET',
        cards: triplet,
        playerId: 'temp'
      });
      triplet.forEach(card => usedCards.add(card.id));
    }

    // Find all completed sequences
    const sequences = this.findCompletedSequences(hand);
    for (const sequence of sequences) {
      completedCombinations.push({
        id: `temp-${Math.random()}`,
        type: 'SEQUENCE',
        cards: sequence,
        playerId: 'temp'
      });
      sequence.forEach(card => usedCards.add(card.id));
    }

    // Find potential combinations from remaining cards
    const remainingCards = hand.filter(card => !usedCards.has(card.id));
    const potentials = this.findPotentialCombinations(remainingCards);
    potentialCombinations.push(...potentials);

    // Mark cards used in potential combinations
    for (const potential of potentials) {
      potential.cards.forEach(card => usedCards.add(card.id));
    }

    // Remaining cards are deadwood
    const deadwood = hand.filter(card => !usedCards.has(card.id));
    const deadwoodPoints = deadwood.reduce((sum, card) => sum + ScoringEngine.getCardPoints(card), 0);

    // Estimate turns to complete
    const turnsToComplete = this.estimateTurnsToComplete(
      completedCombinations,
      potentialCombinations,
      objective
    );

    return {
      completedCombinations,
      potentialCombinations,
      deadwood,
      deadwoodPoints,
      turnsToComplete
    };
  }

  /**
   * Find all valid triplets in a hand
   */
  private static findCompletedTriplets(hand: Card[]): Card[][] {
    const triplets: Card[][] = [];
    const rankGroups = new Map<Rank, Card[]>();

    // Group cards by rank
    for (const card of hand) {
      if (!rankGroups.has(card.rank)) {
        rankGroups.set(card.rank, []);
      }
      rankGroups.get(card.rank)!.push(card);
    }

    // Find valid triplets
    for (const [rank, cards] of rankGroups) {
      if (rank === Rank.JOKER) continue; // Handle Jokers separately
      
      if (cards.length >= 3) {
        // Can form triplet with just these cards
        triplets.push([cards[0], cards[1], cards[2]]);
      } else if (cards.length === 2) {
        // Need a Joker
        const jokers = hand.filter(c => c.rank === Rank.JOKER);
        if (jokers.length > 0) {
          triplets.push([cards[0], cards[1], jokers[0]]);
        }
      } else if (cards.length === 1) {
        // Need 2 Jokers
        const jokers = hand.filter(c => c.rank === Rank.JOKER);
        if (jokers.length >= 2) {
          triplets.push([cards[0], jokers[0], jokers[1]]);
        }
      }
    }

    return triplets;
  }

  /**
   * Find all valid sequences in a hand
   */
  private static findCompletedSequences(hand: Card[]): Card[][] {
    const sequences: Card[][] = [];
    const suitGroups = new Map<Suit, Card[]>();

    // Group cards by suit (excluding Jokers)
    for (const card of hand) {
      if (card.rank === Rank.JOKER || card.suit === null) continue;
      const cardSuit = card.suit;
      if (!suitGroups.has(cardSuit)) {
        suitGroups.set(cardSuit, []);
      }
      suitGroups.get(cardSuit)!.push(card);
    }

    const jokers = hand.filter(c => c.rank === Rank.JOKER);

    // Try to find sequences in each suit
    for (const [_suit, cards] of suitGroups) {
      const sortedCards = this.sortCardsByRank(cards);
      const foundSequences = this.extractSequences(sortedCards, jokers);
      sequences.push(...foundSequences);
    }

    return sequences;
  }

  /**
   * Extract valid sequences from sorted cards of the same suit
   */
  private static extractSequences(sortedCards: Card[], availableJokers: Card[]): Card[][] {
    const sequences: Card[][] = [];
    
    // Simple approach: try to build sequences starting from each card
    for (let i = 0; i < sortedCards.length; i++) {
      const sequence = this.buildSequenceFrom(sortedCards, i, availableJokers);
      if (sequence.length >= 4 && ValidationEngine.isValidSequence(sequence)) {
        sequences.push(sequence);
        break; // Take first valid sequence found
      }
    }

    return sequences;
  }

  /**
   * Build a sequence starting from a specific card
   */
  private static buildSequenceFrom(cards: Card[], startIndex: number, jokers: Card[]): Card[] {
    const sequence: Card[] = [cards[startIndex]];
    const rankOrder = this.getRankOrder();
    let currentRankIndex = rankOrder.indexOf(cards[startIndex].rank);
    let jokersUsed = 0;

    for (let i = startIndex + 1; i < cards.length; i++) {
      const nextRankIndex = rankOrder.indexOf(cards[i].rank);
      const gap = nextRankIndex - currentRankIndex;

      if (gap === 1) {
        // Consecutive card
        sequence.push(cards[i]);
        currentRankIndex = nextRankIndex;
      } else if (gap > 1 && gap <= jokers.length - jokersUsed + 1) {
        // Fill gap with Jokers
        for (let j = 0; j < gap - 1; j++) {
          if (jokersUsed < jokers.length) {
            sequence.push(jokers[jokersUsed++]);
          }
        }
        sequence.push(cards[i]);
        currentRankIndex = nextRankIndex;
      } else {
        break;
      }
    }

    return sequence;
  }

  /**
   * Find potential combinations that are close to completion
   */
  private static findPotentialCombinations(cards: Card[]): PartialCombination[] {
    const potentials: PartialCombination[] = [];

    // Find potential triplets (2 of same rank)
    const rankGroups = new Map<Rank, Card[]>();
    for (const card of cards) {
      if (card.rank === Rank.JOKER) continue;
      const cardRank = card.rank;
      if (!rankGroups.has(cardRank)) {
        rankGroups.set(cardRank, []);
      }
      rankGroups.get(cardRank)!.push(card);
    }

    for (const [_rank, rankCards] of rankGroups) {
      if (rankCards.length === 2) {
        potentials.push({
          type: 'TRIPLET',
          cards: rankCards,
          missingCards: 1,
          potentialValue: this.calculatePotentialValue(rankCards, 1)
        });
      }
    }

    // Find potential sequences (2-3 consecutive cards of same suit)
    const suitGroups = new Map<Suit, Card[]>();
    for (const card of cards) {
      if (card.rank === Rank.JOKER || card.suit === null) continue;
      const cardSuit = card.suit;
      if (!suitGroups.has(cardSuit)) {
        suitGroups.set(cardSuit, []);
      }
      suitGroups.get(cardSuit)!.push(card);
    }

    for (const [_suit, suitCards] of suitGroups) {
      if (suitCards.length >= 2) {
        const sorted = this.sortCardsByRank(suitCards);
        const consecutiveGroups = this.findConsecutiveGroups(sorted);
        
        for (const group of consecutiveGroups) {
          if (group.length >= 2 && group.length < 4) {
            const missing = 4 - group.length;
            potentials.push({
              type: 'SEQUENCE',
              cards: group,
              missingCards: missing,
              potentialValue: this.calculatePotentialValue(group, missing)
            });
          }
        }
      }
    }

    return potentials;
  }

  /**
   * Find groups of consecutive cards
   */
  private static findConsecutiveGroups(sortedCards: Card[]): Card[][] {
    const groups: Card[][] = [];
    let currentGroup: Card[] = [sortedCards[0]];
    const rankOrder = this.getRankOrder();

    for (let i = 1; i < sortedCards.length; i++) {
      const prevRankIndex = rankOrder.indexOf(sortedCards[i - 1].rank);
      const currRankIndex = rankOrder.indexOf(sortedCards[i].rank);

      if (currRankIndex === prevRankIndex + 1) {
        currentGroup.push(sortedCards[i]);
      } else {
        if (currentGroup.length >= 2) {
          groups.push(currentGroup);
        }
        currentGroup = [sortedCards[i]];
      }
    }

    if (currentGroup.length >= 2) {
      groups.push(currentGroup);
    }

    return groups;
  }

  /**
   * Calculate the value of a potential combination
   */
  private static calculatePotentialValue(cards: Card[], missingCards: number): number {
    const cardPoints = cards.reduce((sum, card) => sum + ScoringEngine.getCardPoints(card), 0);
    // Higher value for combinations closer to completion
    return cardPoints / (missingCards + 1);
  }

  /**
   * Estimate turns needed to complete the round objective
   */
  private static estimateTurnsToComplete(
    completed: Combination[],
    potential: PartialCombination[],
    objective: RoundObjective
  ): number {
    const completedTriplets = completed.filter(c => c.type === 'TRIPLET').length;
    const completedSequences = completed.filter(c => c.type === 'SEQUENCE').length;

    const neededTriplets = Math.max(0, objective.triplets - completedTriplets);
    const neededSequences = Math.max(0, objective.sequences - completedSequences);

    // Sort potentials by how close they are to completion
    const sortedPotentials = [...potential].sort((a, b) => a.missingCards - b.missingCards);

    let turns = 0;
    let tripletsFromPotential = 0;
    let sequencesFromPotential = 0;

    for (const p of sortedPotentials) {
      if (p.type === 'TRIPLET' && tripletsFromPotential < neededTriplets) {
        turns += p.missingCards;
        tripletsFromPotential++;
      } else if (p.type === 'SEQUENCE' && sequencesFromPotential < neededSequences) {
        turns += p.missingCards;
        sequencesFromPotential++;
      }
    }

    // Add extra turns for combinations not yet started
    const remainingTriplets = neededTriplets - tripletsFromPotential;
    const remainingSequences = neededSequences - sequencesFromPotential;
    turns += remainingTriplets * 3; // Assume 3 turns to build a triplet from scratch
    turns += remainingSequences * 4; // Assume 4 turns to build a sequence from scratch

    return turns;
  }

  /**
   * Sort cards by rank order
   */
  private static sortCardsByRank(cards: Card[]): Card[] {
    const rankOrder = this.getRankOrder();
    return [...cards].sort((a, b) => {
      const aIndex = rankOrder.indexOf(a.rank);
      const bIndex = rankOrder.indexOf(b.rank);
      return aIndex - bIndex;
    });
  }

  /**
   * Get the rank order for sequences
   */
  private static getRankOrder(): Rank[] {
    return [
      Rank.ACE, Rank.TWO, Rank.THREE, Rank.FOUR, Rank.FIVE,
      Rank.SIX, Rank.SEVEN, Rank.EIGHT, Rank.NINE, Rank.TEN,
      Rank.JACK, Rank.QUEEN, Rank.KING
    ];
  }

  /**
   * Decide whether to swap a Joker and extend sequences
   * 
   * Requirements: 18.2, 18.3, 18.4
   */
  static decideJokerSwap(
    state: GameState,
    playerId: string
  ): {
    shouldSwap: boolean;
    swap?: {
      combinationId: string;
      jokerCard: Card;
      replacementCard: Card;
      extendWith?: Card[];
    };
  } {
    const player = state.players.find(p => p.id === playerId);
    if (!player || !player.hasMelded) {
      return { shouldSwap: false };
    }

    // Look for Jokers in melded sequences (from any player)
    const allMeldedCombinations: Combination[] = [];
    for (const p of state.players) {
      allMeldedCombinations.push(...p.meldedCombinations);
    }

    const sequences = allMeldedCombinations.filter(c => c.type === 'SEQUENCE') as Sequence[];

    // Find sequences with Jokers
    for (const sequence of sequences) {
      const jokerIndex = sequence.cards.findIndex(c => c.rank === Rank.JOKER);
      if (jokerIndex === -1) continue;

      const jokerCard = sequence.cards[jokerIndex];

      // Determine what card the Joker represents
      const replacementCard = this.findJokerReplacement(sequence, jokerIndex, player.hand);

      if (replacementCard) {
        // We can swap! Now check if we should extend the sequence
        const extendCards = this.findSequenceExtensions(sequence, player.hand);

        return {
          shouldSwap: true,
          swap: {
            combinationId: sequence.id,
            jokerCard,
            replacementCard,
            extendWith: extendCards.length > 0 ? extendCards : undefined
          }
        };
      }
    }

    // No swappable Jokers found
    return { shouldSwap: false };
  }

  /**
   * Find the card in hand that can replace a Joker in a sequence
   */
  private static findJokerReplacement(
    sequence: Sequence,
    jokerIndex: number,
    hand: Card[]
  ): Card | null {
    // Determine the suit of the sequence
    const nonJokers = sequence.cards.filter(c => c.rank !== Rank.JOKER);
    if (nonJokers.length === 0) return null;

    const sequenceSuit = nonJokers[0].suit;

    // Determine what rank the Joker represents
    const rankOrder = this.getRankOrder();
    const sortedNonJokers = nonJokers
      .map(c => ({ card: c, index: rankOrder.indexOf(c.rank) }))
      .sort((a, b) => a.index - b.index);

    // Build the expected sequence
    const minRankIndex = sortedNonJokers[0].index;
    const maxRankIndex = sortedNonJokers[sortedNonJokers.length - 1].index;
    const expectedRanks: Rank[] = [];

    for (let i = minRankIndex; i <= maxRankIndex; i++) {
      expectedRanks.push(rankOrder[i]);
    }

    // Find which rank is missing (represented by Joker)
    const presentRanks = new Set(nonJokers.map(c => c.rank));
    const missingRanks = expectedRanks.filter(r => !presentRanks.has(r));

    // Look for the missing rank in hand
    for (const missingRank of missingRanks) {
      const replacement = hand.find(c => c.rank === missingRank && c.suit === sequenceSuit);
      if (replacement) {
        // Verify the swap would be valid
        if (ValidationEngine.canSwapJoker(sequence, sequence.cards[jokerIndex], replacement)) {
          return replacement;
        }
      }
    }

    return null;
  }

  /**
   * Find cards in hand that can extend a sequence
   */
  private static findSequenceExtensions(sequence: Sequence, hand: Card[]): Card[] {
    const extensions: Card[] = [];

    // Try each card in hand
    for (const card of hand) {
      // Try extending at start
      if (ValidationEngine.canExtendSequence(sequence, [card], 'START')) {
        extensions.push(card);
      }
      // Try extending at end
      else if (ValidationEngine.canExtendSequence(sequence, [card], 'END')) {
        extensions.push(card);
      }
    }

    return extensions;
  }

  /**
   * Decide whether to meld and which combinations to meld
   * 
   * Requirements: 18.2, 18.3, 18.4
   */
  static decideMeld(
    state: GameState,
    playerId: string
  ): { shouldMeld: boolean; combinations?: Combination[] } {
    const player = state.players.find(p => p.id === playerId);
    if (!player || player.hasMelded) {
      return { shouldMeld: false };
    }

    const evaluation = this.evaluateHand(player.hand, state.roundObjective);

    // Check if we can meet the round objective
    const canMeetObjective = ValidationEngine.meetsRoundObjective(
      evaluation.completedCombinations,
      state.roundObjective
    );

    if (!canMeetObjective) {
      return { shouldMeld: false };
    }

    // We can meld - now decide if we should

    // Strategy 1: If we can go out immediately (1 card left), do it
    const cardsInCombinations = evaluation.completedCombinations.reduce(
      (sum, combo) => sum + combo.cards.length,
      0
    );
    const remainingCards = player.hand.length - cardsInCombinations;

    if (remainingCards <= 1) {
      // Can go out immediately or very soon
      return {
        shouldMeld: true,
        combinations: evaluation.completedCombinations
      };
    }

    // Strategy 2: Meld early if hand is weak (high deadwood)
    if (evaluation.deadwoodPoints > 80) {
      return {
        shouldMeld: true,
        combinations: evaluation.completedCombinations
      };
    }

    // Strategy 3: Consider opponent progress
    // If any opponent has melded, we should meld to minimize risk
    const anyOpponentMelded = state.players.some(
      p => p.id !== playerId && p.hasMelded
    );

    if (anyOpponentMelded) {
      return {
        shouldMeld: true,
        combinations: evaluation.completedCombinations
      };
    }

    // Strategy 4: Delay melding if close to going out (2-3 cards remaining)
    if (remainingCards <= 3 && evaluation.deadwoodPoints < 50) {
      // Hold off to maintain surprise
      return { shouldMeld: false };
    }

    // Strategy 5: In later rounds, be more aggressive about melding
    if (state.round >= 5 && remainingCards <= 4) {
      return {
        shouldMeld: true,
        combinations: evaluation.completedCombinations
      };
    }

    // Default: don't meld yet
    return { shouldMeld: false };
  }

  /**
   * Decide whether to buy a discarded card
   * 
   * Requirements: 18.2, 18.3, 18.4
   */
  static decideBuy(state: GameState, playerId: string, discardedCard: Card): boolean {
    const player = state.players.find(p => p.id === playerId);
    if (!player) return false;

    // Can't buy if no buys remaining
    if (player.buysRemaining <= 0) return false;

    // Can't buy if already melded
    if (player.hasMelded) return false;

    const context: GameContext = {
      state,
      player,
      objective: state.roundObjective
    };

    const evaluation = this.evaluateHand(player.hand, state.roundObjective);
    const cardValue = this.calculateCardValue(discardedCard, context);

    // Check if card completes a combination - always buy
    for (const potential of evaluation.potentialCombinations) {
      if (this.cardCompletesCombination(discardedCard, potential)) {
        return true;
      }
    }

    // Be more aggressive in later rounds
    const roundFactor = state.round / 7;
    const aggressivenessThreshold = 50 - (roundFactor * 20); // 50 in round 1, 30 in round 7

    // Buy if card is very valuable
    if (cardValue > aggressivenessThreshold) {
      return true;
    }

    // Save buys for critical cards if we have few left
    if (player.buysRemaining === 1) {
      // Only use last buy for cards that complete combinations
      return cardValue > 80;
    }

    // Consider buying if card advances combinations and we have buys to spare
    if (player.buysRemaining >= 2 && cardValue > 30) {
      return true;
    }

    return false;
  }

  /**
   * Decide which card to discard from hand
   * 
   * Requirements: 18.2, 18.3, 18.4
   */
  static decideDiscard(state: GameState, playerId: string): Card {
    const player = state.players.find(p => p.id === playerId);
    if (!player || player.hand.length === 0) {
      throw new Error('Invalid player or empty hand');
    }

    const context: GameContext = {
      state,
      player,
      objective: state.roundObjective
    };

    const evaluation = this.evaluateHand(player.hand, state.roundObjective);

    // Never discard cards that are part of completed combinations
    const completedCardIds = new Set<string>();
    for (const combo of evaluation.completedCombinations) {
      combo.cards.forEach(card => completedCardIds.add(card.id));
    }

    // Never discard cards that are part of potential combinations
    const potentialCardIds = new Set<string>();
    for (const potential of evaluation.potentialCombinations) {
      potential.cards.forEach(card => potentialCardIds.add(card.id));
    }

    // Prioritize discarding deadwood
    if (evaluation.deadwood.length > 0) {
      // Sort deadwood by point value (highest first)
      const sortedDeadwood = [...evaluation.deadwood].sort((a, b) => {
        const aPoints = ScoringEngine.getCardPoints(a);
        const bPoints = ScoringEngine.getCardPoints(b);
        return bPoints - aPoints;
      });

      // Discard highest-point deadwood, but avoid Jokers if possible
      for (const card of sortedDeadwood) {
        if (card.rank !== Rank.JOKER) {
          return card;
        }
      }

      // If only Jokers in deadwood, discard one
      return sortedDeadwood[0];
    }

    // If no pure deadwood, discard from potential combinations
    // Choose the card with lowest strategic value
    const candidateCards = player.hand.filter(card => 
      !completedCardIds.has(card.id)
    );

    if (candidateCards.length > 0) {
      const cardValues = candidateCards.map(card => ({
        card,
        value: this.calculateCardValue(card, context)
      }));

      // Sort by value (lowest first)
      cardValues.sort((a, b) => a.value - b.value);
      return cardValues[0].card;
    }

    // Fallback: discard first card (shouldn't happen)
    return player.hand[0];
  }

  /**
   * Decide whether to draw from draw pile or discard pile
   * 
   * Requirements: 18.2, 18.3, 18.4
   */
  static decideDraw(state: GameState, playerId: string): 'DRAW' | 'DISCARD' {
    const player = state.players.find(p => p.id === playerId);
    if (!player) return 'DRAW';

    // If discard pile is empty, must draw from draw pile
    if (state.discardPile.length === 0) {
      return 'DRAW';
    }

    const topDiscard = state.discardPile[state.discardPile.length - 1];
    const context: GameContext = {
      state,
      player,
      objective: state.roundObjective
    };

    // Evaluate the value of the discard pile card
    const discardValue = this.calculateCardValue(topDiscard, context);
    
    // Evaluate current hand
    const evaluation = this.evaluateHand(player.hand, state.roundObjective);

    // Draw from discard if:
    // 1. Card completes a combination
    // 2. Card significantly advances a potential combination
    // 3. Card value is positive (useful) and deadwood is high

    // Check if it completes any potential combination
    for (const potential of evaluation.potentialCombinations) {
      if (this.cardCompletesCombination(topDiscard, potential)) {
        return 'DISCARD'; // Take it!
      }
    }

    // Check if it advances combinations and is valuable
    if (discardValue > 30) {
      return 'DISCARD';
    }

    // If deadwood is very high, consider taking useful cards
    if (evaluation.deadwoodPoints > 50 && discardValue > 0) {
      return 'DISCARD';
    }

    // Default: draw from draw pile (more unpredictable)
    return 'DRAW';
  }

  /**
   * Calculate the strategic value of a card in the current game context
   */
  static calculateCardValue(card: Card, context: GameContext): number {
    const evaluation = this.evaluateHand(context.player.hand, context.objective);
    
    // Base value is the point value (we want to discard high-point cards)
    let value = -ScoringEngine.getCardPoints(card);

    // Check if card completes any potential combinations
    for (const potential of evaluation.potentialCombinations) {
      if (this.cardCompletesCombination(card, potential)) {
        value += 100; // High value for completing combinations
      } else if (this.cardAdvancesCombination(card, potential)) {
        value += 50; // Medium value for advancing combinations
      }
    }

    // Jokers are always valuable
    if (card.rank === Rank.JOKER) {
      value += 75;
    }

    return value;
  }

  /**
   * Check if a card completes a potential combination
   */
  private static cardCompletesCombination(card: Card, potential: PartialCombination): boolean {
    if (potential.missingCards !== 1) return false;

    const testCards = [...potential.cards, card];
    
    if (potential.type === 'TRIPLET') {
      return ValidationEngine.isValidTriplet(testCards);
    } else {
      return ValidationEngine.isValidSequence(testCards);
    }
  }

  /**
   * Check if a card advances a potential combination
   */
  private static cardAdvancesCombination(card: Card, potential: PartialCombination): boolean {
    if (potential.type === 'TRIPLET') {
      // Check if card has same rank
      const nonJokers = potential.cards.filter(c => c.rank !== Rank.JOKER);
      if (nonJokers.length > 0) {
        return card.rank === nonJokers[0].rank || card.rank === Rank.JOKER;
      }
    } else if (potential.type === 'SEQUENCE') {
      // Check if card extends the sequence
      const nonJokers = potential.cards.filter(c => c.rank !== Rank.JOKER);
      if (nonJokers.length > 0 && card.suit === nonJokers[0].suit) {
        const testStart = [card, ...potential.cards];
        const testEnd = [...potential.cards, card];
        return ValidationEngine.isValidSequence(testStart) || ValidationEngine.isValidSequence(testEnd);
      }
    }

    return false;
  }
}
