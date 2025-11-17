import { Card, Rank, Player } from '../types';

/**
 * ScoringEngine handles all scoring calculations for the Shanko card game
 * 
 * Scoring rules:
 * - Number cards (2-10): Face value
 * - Face cards (J, Q, K): 10 points
 * - Ace: 15 points
 * - Joker: 50 points
 * - Player who goes out: 0 points for that round
 * - Lowest cumulative score wins the game
 */
export class ScoringEngine {
  /**
   * Calculate the point value of a single card
   * 
   * Requirements: 11.1, 11.2, 11.3, 11.4
   */
  static getCardPoints(card: Card): number {
    switch (card.rank) {
      case Rank.JOKER:
        return 50;
      case Rank.ACE:
        return 15;
      case Rank.JACK:
      case Rank.QUEEN:
      case Rank.KING:
        return 10;
      case Rank.TWO:
      case Rank.THREE:
      case Rank.FOUR:
      case Rank.FIVE:
      case Rank.SIX:
      case Rank.SEVEN:
      case Rank.EIGHT:
      case Rank.NINE:
      case Rank.TEN:
        return parseInt(card.rank);
      default:
        throw new Error(`Unknown card rank: ${card.rank}`);
    }
  }

  /**
   * Calculate the total score for a hand of cards
   * Used to score remaining cards when a round ends
   * 
   * Requirements: 8.2
   */
  static calculateRoundScore(hand: Card[]): number {
    return hand.reduce((sum, card) => sum + this.getCardPoints(card), 0);
  }

  /**
   * Update a player's cumulative score by adding their round score
   * 
   * Requirements: 8.3
   */
  static updateCumulativeScore(player: Player, roundScore: number): number {
    return player.cumulativeScore + roundScore;
  }

  /**
   * Determine the winner from a list of players
   * Winner is the player with the lowest cumulative score
   * 
   * Requirements: 8.5
   */
  static determineWinner(players: Player[]): Player {
    if (players.length === 0) {
      throw new Error('Cannot determine winner with no players');
    }

    return players.reduce((winner, player) => 
      player.cumulativeScore < winner.cumulativeScore ? player : winner
    );
  }

  /**
   * Calculate scores for all players at the end of a round
   * Returns a map of player IDs to their round scores
   * 
   * Requirements: 8.2, 11.5
   */
  static calculateRoundScores(players: Player[], winnerPlayerId: string): Map<string, number> {
    const scores = new Map<string, number>();

    for (const player of players) {
      // Winner gets 0 points (Requirement 11.5)
      if (player.id === winnerPlayerId) {
        scores.set(player.id, 0);
      } else {
        // Other players score based on remaining cards in hand
        scores.set(player.id, this.calculateRoundScore(player.hand));
      }
    }

    return scores;
  }
}
