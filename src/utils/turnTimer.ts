import { Card, RoundObjective, Rank } from '../types';
import { ScoringEngine } from '../engines/ScoringEngine';

/**
 * Turn Timer Utility
 * Manages 30-second turn timer and automatic card discard
 */

export const TURN_TIME_LIMIT = 30; // seconds

/**
 * Find the least useful card to discard based on round objective
 * Strategy: Discard the card that contributes least to forming required combinations
 */
export function findLeastUsefulCard(hand: Card[], roundObjective: RoundObjective): Card {
  if (hand.length === 0) {
    throw new Error('Cannot find least useful card from empty hand');
  }

  // Score each card based on its potential usefulness
  const cardScores = hand.map(card => ({
    card,
    score: calculateCardUsefulness(card, hand, roundObjective)
  }));

  // Sort by score (lowest first = least useful)
  cardScores.sort((a, b) => a.score - b.score);

  // Return the least useful card
  return cardScores[0].card;
}

/**
 * Calculate how useful a card is for forming combinations
 * Higher score = more useful
 */
function calculateCardUsefulness(card: Card, hand: Card[], roundObjective: RoundObjective): number {
  let score = 0;

  // Jokers are always valuable (but risky if caught)
  if (card.rank === Rank.JOKER) {
    return 100; // Keep jokers unless absolutely necessary
  }

  // Count potential triplet partners (same rank)
  const tripletPartners = hand.filter(c => 
    c.id !== card.id && c.rank === card.rank
  ).length;
  score += tripletPartners * 30;

  // Count potential sequence partners (consecutive ranks, same suit)
  const sequencePartners = countSequencePartners(card, hand);
  score += sequencePartners * 25;

  // Penalize high-value cards (they cost more points if caught)
  const cardValue = ScoringEngine.calculateCardValue(card);
  score -= cardValue * 2;

  // Bonus for cards that match round objective needs
  if (roundObjective.triplets > 0 && tripletPartners >= 1) {
    score += 20;
  }
  if (roundObjective.sequences > 0 && sequencePartners >= 2) {
    score += 20;
  }

  return score;
}

/**
 * Count how many cards in hand could form sequences with this card
 */
function countSequencePartners(card: Card, hand: Card[]): number {
  if (!card.suit || card.rank === Rank.JOKER) {
    return 0;
  }

  const rankOrder = [
    Rank.TWO, Rank.THREE, Rank.FOUR, Rank.FIVE, Rank.SIX,
    Rank.SEVEN, Rank.EIGHT, Rank.NINE, Rank.TEN,
    Rank.JACK, Rank.QUEEN, Rank.KING, Rank.ACE
  ];

  const cardRankIndex = rankOrder.indexOf(card.rank);
  if (cardRankIndex === -1) return 0;

  let partners = 0;

  // Check for cards within 3 ranks (for potential 4-card sequence)
  for (let i = -3; i <= 3; i++) {
    if (i === 0) continue;
    
    const targetRankIndex = cardRankIndex + i;
    if (targetRankIndex < 0 || targetRankIndex >= rankOrder.length) continue;

    const targetRank = rankOrder[targetRankIndex];
    const hasPartner = hand.some(c => 
      c.id !== card.id && 
      c.rank === targetRank && 
      c.suit === card.suit
    );

    if (hasPartner) partners++;
  }

  return partners;
}

/**
 * Format time remaining for display
 */
export function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get warning level based on time remaining
 */
export function getTimerWarningLevel(seconds: number): 'normal' | 'warning' | 'critical' {
  if (seconds <= 5) return 'critical';
  if (seconds <= 10) return 'warning';
  return 'normal';
}
