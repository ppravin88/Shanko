import { Card } from '../types';
import { preloadCardArtwork } from '../components/CardArtworkOptimized';

/**
 * Card Preloader Utility
 * Preloads card artwork to improve initial render performance
 */

let preloadPromise: Promise<void> | null = null;

/**
 * Preload all card artwork for the given cards
 * This should be called when the game initializes or a round starts
 */
export async function preloadCards(cards: Card[]): Promise<void> {
  if (preloadPromise) {
    return preloadPromise;
  }

  preloadPromise = new Promise((resolve) => {
    // Use requestIdleCallback if available, otherwise use setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        preloadCardArtwork(cards);
        resolve();
      });
    } else {
      setTimeout(() => {
        preloadCardArtwork(cards);
        resolve();
      }, 0);
    }
  });

  return preloadPromise;
}

/**
 * Reset the preload state
 */
export function resetPreloader(): void {
  preloadPromise = null;
}

/**
 * Batch preload cards in chunks to avoid blocking the main thread
 */
export async function batchPreloadCards(cards: Card[], chunkSize: number = 20): Promise<void> {
  const chunks: Card[][] = [];
  
  for (let i = 0; i < cards.length; i += chunkSize) {
    chunks.push(cards.slice(i, i + chunkSize));
  }

  for (const chunk of chunks) {
    await preloadCards(chunk);
    // Small delay between chunks to keep UI responsive
    await new Promise(resolve => setTimeout(resolve, 10));
  }
}
