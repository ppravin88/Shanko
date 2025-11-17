import { Card, Rank } from '../types/card';
import { Combination, Sequence } from '../types/combination';
import { RoundObjective } from '../types/game';

// Rank order for sequence validation
const RANK_ORDER: Rank[] = [
  Rank.ACE,   // Ace can be at the beginning
  Rank.TWO,
  Rank.THREE,
  Rank.FOUR,
  Rank.FIVE,
  Rank.SIX,
  Rank.SEVEN,
  Rank.EIGHT,
  Rank.NINE,
  Rank.TEN,
  Rank.JACK,
  Rank.QUEEN,
  Rank.KING,
  Rank.ACE    // Ace can also be at the end
];

/**
 * ValidationEngine provides validation functions for game rules
 */
export class ValidationEngine {
  /**
   * Validates if the given cards form a valid triplet.
   * A valid triplet consists of exactly 3 cards with matching ranks.
   * Jokers can be used as wildcards, but at least one non-Joker card is required.
   */
  static isValidTriplet(cards: Card[]): boolean {
    return isValidTriplet(cards);
  }

  /**
   * Validates if the given cards form a valid sequence.
   * A valid sequence consists of at least 4 cards with consecutive ranks in the same suit.
   * Jokers can be used as wildcards, but at least one non-Joker card is required.
   * Ace can be at the beginning (A-2-3-4) or end (J-Q-K-A), but not wrapping (K-A-2-3).
   */
  static isValidSequence(cards: Card[]): boolean {
    return isValidSequence(cards);
  }

  /**
   * Validates if the given combinations meet the round objective.
   * Checks that the correct number of triplets and sequences are present,
   * and that the total card count matches the objective.
   */
  static meetsRoundObjective(
    combinations: Combination[],
    objective: RoundObjective
  ): boolean {
    return meetsRoundObjective(combinations, objective);
  }

  /**
   * Validates if a Joker can be swapped from a melded combination.
   * Jokers can only be swapped from sequences (not triplets).
   * The replacement card must match the specific card the Joker represents.
   * The swap must maintain sequence validity.
   */
  static canSwapJoker(
    combination: Combination,
    jokerCard: Card,
    replacementCard: Card
  ): boolean {
    return canSwapJoker(combination, jokerCard, replacementCard);
  }

  /**
   * Validates if cards can extend an existing sequence.
   * Cards can be added to the beginning or end of a sequence.
   * The extended sequence must maintain consecutive ranks and same suit.
   * Jokers can be used in extensions.
   */
  static canExtendSequence(
    sequence: Sequence,
    extensionCards: Card[],
    position: 'START' | 'END'
  ): boolean {
    return canExtendSequence(sequence, extensionCards, position);
  }
}

/**
 * Validates if the given cards form a valid triplet.
 * A valid triplet consists of exactly 3 cards with matching ranks.
 * Jokers can be used as wildcards, but at least one non-Joker card is required.
 */
export function isValidTriplet(cards: Card[]): boolean {
  // Must have exactly 3 cards
  if (cards.length !== 3) {
    return false;
  }

  // Count non-Jokers
  const nonJokers = cards.filter(card => card.rank !== Rank.JOKER);

  // Must have at least one non-Joker card
  if (nonJokers.length === 0) {
    return false;
  }

  // All non-Joker cards must have the same rank
  const firstRank = nonJokers[0].rank;
  return nonJokers.every(card => card.rank === firstRank);
}

/**
 * Validates if the given cards form a valid sequence.
 * A valid sequence consists of at least 4 cards with consecutive ranks in the same suit.
 * Jokers can be used as wildcards, but at least one non-Joker card is required.
 * Ace can be at the beginning (A-2-3-4) or end (J-Q-K-A), but not wrapping (K-A-2-3).
 */
export function isValidSequence(cards: Card[]): boolean {
  // Must have at least 4 cards
  if (cards.length < 4) {
    return false;
  }

  // Separate Jokers and non-Jokers
  const jokers = cards.filter(card => card.rank === Rank.JOKER);
  const nonJokers = cards.filter(card => card.rank !== Rank.JOKER);

  // Must have at least one non-Joker card
  if (nonJokers.length === 0) {
    return false;
  }

  // All non-Joker cards must be from the same suit
  const firstSuit = nonJokers[0].suit;
  if (!nonJokers.every(card => card.suit === firstSuit)) {
    return false;
  }

  // Get rank indices for non-Joker cards
  const rankIndices = nonJokers.map(card => {
    const index = RANK_ORDER.indexOf(card.rank);
    return index;
  }).sort((a, b) => a - b);

  // Check if we can form a valid sequence with the given cards and Jokers
  // Try to find a consecutive sequence that includes all non-Joker cards
  const minIndex = rankIndices[0];
  const maxIndex = rankIndices[rankIndices.length - 1];
  
  // Calculate the span needed for the sequence
  const span = maxIndex - minIndex + 1;
  
  // Check if we have enough cards (non-Jokers + Jokers) to fill the span
  if (span > cards.length) {
    return false;
  }

  // Verify that non-Joker cards can form a consecutive sequence with Jokers filling gaps
  let expectedIndex = minIndex;
  let nonJokerIdx = 0;
  let jokersUsed = 0;

  for (let i = 0; i < span; i++) {
    if (nonJokerIdx < rankIndices.length && rankIndices[nonJokerIdx] === expectedIndex) {
      nonJokerIdx++;
    } else {
      jokersUsed++;
    }
    expectedIndex++;
  }

  // Check if we used the correct number of Jokers
  if (jokersUsed !== jokers.length) {
    return false;
  }

  // Prohibit wrapping sequences (K-A-2-3)
  // Check if Ace appears in both low and high positions
  const hasLowAce = rankIndices.includes(0); // Ace at beginning
  const hasHighAce = rankIndices.includes(13); // Ace at end
  
  if (hasLowAce && hasHighAce) {
    return false;
  }

  // Check for wrapping: if we have King and low cards (2, 3, 4)
  const hasKing = nonJokers.some(card => card.rank === Rank.KING);
  const hasLowCards = nonJokers.some(card => 
    [Rank.TWO, Rank.THREE, Rank.FOUR].includes(card.rank)
  );
  
  if (hasKing && hasLowCards) {
    // This could be a wrap, check if Ace is involved
    const hasAce = nonJokers.some(card => card.rank === Rank.ACE);
    if (hasAce || jokers.length > 0) {
      // Potential wrap detected, verify it's not K-A-2 or similar
      const kingIndex = RANK_ORDER.lastIndexOf(Rank.KING); // 12
      const lowCardIndices = rankIndices.filter(idx => idx <= 4); // A, 2, 3, 4
      
      if (lowCardIndices.length > 0 && rankIndices.includes(kingIndex)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Validates if the given combinations meet the round objective.
 * Checks that the correct number of triplets and sequences are present,
 * and that the total card count matches the objective.
 */
export function meetsRoundObjective(
  combinations: Combination[],
  objective: RoundObjective
): boolean {
  // Count triplets and sequences
  const triplets = combinations.filter(c => c.type === 'TRIPLET');
  const sequences = combinations.filter(c => c.type === 'SEQUENCE');

  // Check if counts match objective
  if (triplets.length !== objective.triplets) {
    return false;
  }

  if (sequences.length !== objective.sequences) {
    return false;
  }

  // Calculate total cards in all combinations
  const totalCards = combinations.reduce((sum, combo) => sum + combo.cards.length, 0);

  // Check if total card count matches objective
  return totalCards === objective.totalCards;
}

/**
 * Validates if a Joker can be swapped from a melded combination.
 * Jokers can only be swapped from sequences (not triplets).
 * The replacement card must match the specific card the Joker represents.
 * The swap must maintain sequence validity.
 */
export function canSwapJoker(
  combination: Combination,
  jokerCard: Card,
  replacementCard: Card
): boolean {
  // Can only swap from sequences, not triplets
  if (combination.type !== 'SEQUENCE') {
    return false;
  }

  // Verify the joker is actually in the combination
  const jokerIndex = combination.cards.findIndex(card => card.id === jokerCard.id);
  if (jokerIndex === -1) {
    return false;
  }

  // Verify the card at that position is actually a Joker
  if (combination.cards[jokerIndex].rank !== Rank.JOKER) {
    return false;
  }

  // Determine what card the Joker represents
  const sequence = combination as Sequence;
  const nonJokers = sequence.cards.filter(card => card.rank !== Rank.JOKER);
  
  if (nonJokers.length === 0) {
    return false;
  }

  // Get the suit of the sequence
  const sequenceSuit = nonJokers[0].suit;

  // Replacement card must be from the same suit
  if (replacementCard.suit !== sequenceSuit) {
    return false;
  }

  // Create a new card array with the replacement
  const newCards = [...sequence.cards];
  newCards[jokerIndex] = replacementCard;

  // Validate that the new sequence is still valid
  return isValidSequence(newCards);
}

/**
 * Validates if cards can extend an existing sequence.
 * Cards can be added to the beginning or end of a sequence.
 * The extended sequence must maintain consecutive ranks and same suit.
 * Jokers can be used in extensions.
 */
export function canExtendSequence(
  sequence: Sequence,
  extensionCards: Card[],
  position: 'START' | 'END'
): boolean {
  if (extensionCards.length === 0) {
    return false;
  }

  // Create the extended sequence
  const extendedCards = position === 'START' 
    ? [...extensionCards, ...sequence.cards]
    : [...sequence.cards, ...extensionCards];

  // Validate the extended sequence
  return isValidSequence(extendedCards);
}
