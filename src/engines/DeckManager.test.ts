import { describe, it, expect } from 'vitest';
import { DeckManager } from './DeckManager';
import { Rank, Suit } from '../types';

describe('DeckManager', () => {
  describe('createDecks', () => {
    it('should create 2 decks (112 cards) for 2 players', () => {
      const cards = DeckManager.createDecks(2);
      expect(cards).toHaveLength(112);
    });

    it('should create 2 decks (112 cards) for 3 players', () => {
      const cards = DeckManager.createDecks(3);
      expect(cards).toHaveLength(112);
    });

    it('should create 2 decks (112 cards) for 4 players', () => {
      const cards = DeckManager.createDecks(4);
      expect(cards).toHaveLength(112);
    });

    it('should create 3 decks (168 cards) for 5 players', () => {
      const cards = DeckManager.createDecks(5);
      expect(cards).toHaveLength(168);
    });

    it('should create 3 decks (168 cards) for 6 players', () => {
      const cards = DeckManager.createDecks(6);
      expect(cards).toHaveLength(168);
    });

    it('should create 4 decks (224 cards) for 7 players', () => {
      const cards = DeckManager.createDecks(7);
      expect(cards).toHaveLength(224);
    });

    it('should create 4 decks (224 cards) for 8 players', () => {
      const cards = DeckManager.createDecks(8);
      expect(cards).toHaveLength(224);
    });

    it('should throw error for player count less than 2', () => {
      expect(() => DeckManager.createDecks(1)).toThrow('Player count must be between 2 and 8');
    });

    it('should throw error for player count greater than 8', () => {
      expect(() => DeckManager.createDecks(9)).toThrow('Player count must be between 2 and 8');
    });
  });

  describe('card uniqueness', () => {
    it('should generate unique IDs for all cards', () => {
      const cards = DeckManager.createDecks(4);
      const ids = cards.map(card => card.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(cards.length);
    });

    it('should have correct deck indices for multiple decks', () => {
      const cards = DeckManager.createDecks(4);
      const deckIndices = cards.map(card => card.deckIndex);
      expect(deckIndices).toContain(0);
      expect(deckIndices).toContain(1);
    });
  });

  describe('deck composition', () => {
    it('should contain 52 standard cards per deck', () => {
      const cards = DeckManager.createDecks(2);
      const standardCards = cards.filter(card => card.rank !== Rank.JOKER);
      expect(standardCards).toHaveLength(104); // 52 cards × 2 decks
    });

    it('should contain 4 Jokers per deck', () => {
      const cards = DeckManager.createDecks(2);
      const jokers = cards.filter(card => card.rank === Rank.JOKER);
      expect(jokers).toHaveLength(8); // 4 Jokers × 2 decks
    });

    it('should have all Jokers with null suit', () => {
      const cards = DeckManager.createDecks(2);
      const jokers = cards.filter(card => card.rank === Rank.JOKER);
      jokers.forEach(joker => {
        expect(joker.suit).toBeNull();
      });
    });

    it('should have all standard cards with valid suits', () => {
      const cards = DeckManager.createDecks(2);
      const standardCards = cards.filter(card => card.rank !== Rank.JOKER);
      standardCards.forEach(card => {
        expect(Object.values(Suit)).toContain(card.suit);
      });
    });

    it('should have 13 cards of each suit per deck', () => {
      const cards = DeckManager.createDecks(2);
      const standardCards = cards.filter(card => card.rank !== Rank.JOKER);
      
      for (const suit of Object.values(Suit)) {
        const suitCards = standardCards.filter(card => card.suit === suit);
        expect(suitCards).toHaveLength(26); // 13 cards × 2 decks
      }
    });
  });

  describe('shuffle', () => {
    it('should return array with same length', () => {
      const cards = DeckManager.createDecks(2);
      const originalLength = cards.length;
      const shuffled = DeckManager.shuffle(cards);
      expect(shuffled).toHaveLength(originalLength);
    });

    it('should contain all original cards', () => {
      const cards = DeckManager.createDecks(2);
      const originalIds = cards.map(c => c.id).sort();
      const shuffled = DeckManager.shuffle(cards);
      const shuffledIds = shuffled.map(c => c.id).sort();
      expect(shuffledIds).toEqual(originalIds);
    });

    it('should produce different order (statistical test)', () => {
      const cards = DeckManager.createDecks(2);
      const shuffled = DeckManager.shuffle(cards);
      
      // Check if at least some cards are in different positions
      let differentPositions = 0;
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].id !== shuffled[i].id) {
          differentPositions++;
        }
      }
      
      // With 112 cards, we expect most positions to be different
      expect(differentPositions).toBeGreaterThan(50);
    });
  });
});
