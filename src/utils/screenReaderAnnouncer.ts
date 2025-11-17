/**
 * Screen reader announcer utility for accessibility
 * Requirements: 7.2, 7.5
 */

let announcerElement: HTMLDivElement | null = null;

/**
 * Initialize the screen reader announcer
 * Creates a visually hidden element for screen reader announcements
 */
export function initializeAnnouncer(): void {
  if (announcerElement) return;

  announcerElement = document.createElement('div');
  announcerElement.setAttribute('role', 'status');
  announcerElement.setAttribute('aria-live', 'polite');
  announcerElement.setAttribute('aria-atomic', 'true');
  announcerElement.className = 'sr-only';
  
  // Visually hidden but accessible to screen readers
  Object.assign(announcerElement.style, {
    position: 'absolute',
    left: '-10000px',
    width: '1px',
    height: '1px',
    overflow: 'hidden'
  });

  document.body.appendChild(announcerElement);
}

/**
 * Announce a message to screen readers
 * @param message - The message to announce
 * @param priority - 'polite' (default) or 'assertive' for urgent messages
 */
export function announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
  if (!announcerElement) {
    initializeAnnouncer();
  }

  if (!announcerElement) return;

  // Update aria-live attribute based on priority
  announcerElement.setAttribute('aria-live', priority);

  // Clear and set new message
  announcerElement.textContent = '';
  
  // Use setTimeout to ensure screen readers pick up the change
  setTimeout(() => {
    if (announcerElement) {
      announcerElement.textContent = message;
    }
  }, 100);
}

/**
 * Announce game state changes
 */
export const GameAnnouncements = {
  roundStart: (round: number, objective: string) => {
    announce(`Round ${round} started. Objective: ${objective}`, 'polite');
  },

  turnStart: (playerName: string) => {
    announce(`${playerName}'s turn`, 'polite');
  },

  cardDrawn: (source: 'draw pile' | 'discard pile') => {
    announce(`Card drawn from ${source}`, 'polite');
  },

  cardDiscarded: (cardDescription: string) => {
    announce(`${cardDescription} discarded`, 'polite');
  },

  meldSuccess: (combinationCount: number) => {
    announce(`Successfully melded ${combinationCount} combination${combinationCount > 1 ? 's' : ''}`, 'polite');
  },

  buyAction: (playerName: string, cardDescription: string) => {
    announce(`${playerName} bought ${cardDescription}`, 'polite');
  },

  goOut: (playerName: string) => {
    announce(`${playerName} went out and ended the round!`, 'assertive');
  },

  roundEnd: (winnerName: string, score: number) => {
    announce(`Round ended. ${winnerName} won with ${score} points`, 'assertive');
  },

  gameEnd: (winnerName: string, totalScore: number) => {
    announce(`Game over! ${winnerName} wins with a total score of ${totalScore} points`, 'assertive');
  },

  error: (errorMessage: string) => {
    announce(`Error: ${errorMessage}`, 'assertive');
  },

  validationError: (errorMessage: string) => {
    announce(`Invalid action: ${errorMessage}`, 'assertive');
  },

  phaseChange: (phaseName: string) => {
    announce(`Phase changed to ${phaseName}`, 'polite');
  }
};

/**
 * Get descriptive text for a card
 */
export function getCardDescription(card: { rank: string; suit: string | null }): string {
  if (card.rank === 'JOKER') {
    return 'Joker';
  }
  
  const rankNames: Record<string, string> = {
    '2': 'Two',
    '3': 'Three',
    '4': 'Four',
    '5': 'Five',
    '6': 'Six',
    '7': 'Seven',
    '8': 'Eight',
    '9': 'Nine',
    '10': 'Ten',
    'J': 'Jack',
    'Q': 'Queen',
    'K': 'King',
    'A': 'Ace'
  };

  const suitNames: Record<string, string> = {
    'HEARTS': 'Hearts',
    'DIAMONDS': 'Diamonds',
    'CLUBS': 'Clubs',
    'SPADES': 'Spades'
  };

  const rankName = rankNames[card.rank] || card.rank;
  const suitName = card.suit ? suitNames[card.suit] : '';

  return `${rankName} of ${suitName}`;
}

/**
 * Get descriptive text for round objective
 */
export function getRoundObjectiveDescription(objective: { triplets: number; sequences: number }): string {
  const parts: string[] = [];
  
  if (objective.triplets > 0) {
    parts.push(`${objective.triplets} triplet${objective.triplets > 1 ? 's' : ''}`);
  }
  
  if (objective.sequences > 0) {
    parts.push(`${objective.sequences} sequence${objective.sequences > 1 ? 's' : ''}`);
  }
  
  return parts.join(' and ');
}
