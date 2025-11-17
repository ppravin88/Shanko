/**
 * Performance optimization utilities
 * Provides memoization and lazy loading helpers
 */

import { Card, Combination } from '../types';

/**
 * Memoization cache for expensive calculations
 */
class MemoCache<K, V> {
  private cache = new Map<string, { value: V; timestamp: number }>();
  private maxAge: number;
  private maxSize: number;

  constructor(maxAge = 5000, maxSize = 100) {
    this.maxAge = maxAge;
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const keyStr = JSON.stringify(key);
    const cached = this.cache.get(keyStr);
    
    if (!cached) return undefined;
    
    // Check if cache entry is still valid
    if (Date.now() - cached.timestamp > this.maxAge) {
      this.cache.delete(keyStr);
      return undefined;
    }
    
    return cached.value;
  }

  set(key: K, value: V): void {
    const keyStr = JSON.stringify(key);
    
    // Evict oldest entries if cache is full
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    
    this.cache.set(keyStr, { value, timestamp: Date.now() });
  }

  clear(): void {
    this.cache.clear();
  }
}

/**
 * Memoize expensive card validation calculations
 */
export const validationCache = new MemoCache<Card[], boolean>(10000, 200);

/**
 * Memoize hand evaluation results
 */
export const handEvaluationCache = new MemoCache<any, any>(5000, 50);

/**
 * Debounce function for expensive operations
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: number | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = window.setTimeout(later, wait);
  };
}

/**
 * Throttle function for high-frequency events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Batch multiple state updates together
 */
export function batchUpdates<T>(updates: (() => void)[]): void {
  // Use requestAnimationFrame to batch DOM updates
  requestAnimationFrame(() => {
    updates.forEach(update => update());
  });
}

/**
 * Lazy load component with retry logic
 */
export function lazyWithRetry<T extends any>(
  componentImport: () => Promise<{ default: T }>,
  retries = 3
): any {
  // Import React dynamically to avoid circular dependencies
  const React = require('react');
  
  return React.lazy(async () => {
    for (let i = 0; i < retries; i++) {
      try {
        return await componentImport();
      } catch (error) {
        if (i === retries - 1) throw error;
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
      }
    }
    throw new Error('Failed to load component');
  });
}

/**
 * Create a stable hash for card arrays (for memoization keys)
 */
export function hashCards(cards: Card[]): string {
  return cards
    .map(c => `${c.rank}-${c.suit}-${c.deckIndex}`)
    .sort()
    .join('|');
}

/**
 * Create a stable hash for combinations
 */
export function hashCombination(combo: Combination): string {
  return `${combo.type}-${hashCards(combo.cards)}`;
}

/**
 * Virtual scrolling helper for large lists
 */
export class VirtualScroller {
  private itemHeight: number;
  private containerHeight: number;
  private overscan: number;

  constructor(itemHeight: number, containerHeight: number, overscan = 3) {
    this.itemHeight = itemHeight;
    this.containerHeight = containerHeight;
    this.overscan = overscan;
  }

  getVisibleRange(scrollTop: number, totalItems: number): { start: number; end: number } {
    const start = Math.max(0, Math.floor(scrollTop / this.itemHeight) - this.overscan);
    const visibleCount = Math.ceil(this.containerHeight / this.itemHeight);
    const end = Math.min(totalItems, start + visibleCount + this.overscan * 2);
    
    return { start, end };
  }

  getTotalHeight(totalItems: number): number {
    return totalItems * this.itemHeight;
  }

  getItemOffset(index: number): number {
    return index * this.itemHeight;
  }
}
