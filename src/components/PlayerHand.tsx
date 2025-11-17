import React, { useState, useEffect, useRef, useMemo, memo } from 'react';
import { Card, Rank, Suit } from '../types';
import { CardComponent } from './CardComponent';
import { CardDragHandler, isTouchDevice } from '../utils/touchGestures';
import { useResponsive } from '../hooks/useResponsive';
import { hashCards } from '../utils/performanceOptimization';
import './PlayerHand.css';
import './animations.css';

interface PlayerHandProps {
  cards: Card[];
  playerId: string;
  playerName: string;
  selectedCardId?: string | null;
  onCardSelect?: (cardId: string | null) => void;
}

/**
 * PlayerHand component - Display current player's cards (optimized with memo)
 * Requirements: 7.3, 7.5
 */
export const PlayerHand = memo(function PlayerHand({ cards, playerId, playerName, selectedCardId, onCardSelect }: PlayerHandProps) {
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [animatingCards, setAnimatingCards] = useState<Set<string>>(new Set());
  const [previousCardCount, setPreviousCardCount] = useState(cards.length);
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [dragOverCardId, setDragOverCardId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { isMobile, cardSize } = useResponsive();
  const isTouch = isTouchDevice();

  // Detect when cards are added and trigger animations
  useEffect(() => {
    if (cards.length > previousCardCount) {
      // New cards added - animate them
      const newCardIds = cards.slice(previousCardCount).map(c => c.id);
      setAnimatingCards(new Set(newCardIds));
      
      // Remove animation class after animation completes
      const timer = setTimeout(() => {
        setAnimatingCards(new Set());
      }, 600);
      
      return () => clearTimeout(timer);
    }
    setPreviousCardCount(cards.length);
  }, [cards.length, previousCardCount]);

  // Sort cards by suit and rank (memoized to avoid re-sorting on every render)
  const sortedCards = useMemo(() => {
    return [...cards].sort((a, b) => {
      // Jokers go to the end
      if (a.rank === Rank.JOKER && b.rank !== Rank.JOKER) return 1;
      if (b.rank === Rank.JOKER && a.rank !== Rank.JOKER) return -1;
      
      // Sort by suit first
      if (a.suit && b.suit && a.suit !== b.suit) {
        const suitOrder = [Suit.HEARTS, Suit.DIAMONDS, Suit.CLUBS, Suit.SPADES];
        return suitOrder.indexOf(a.suit) - suitOrder.indexOf(b.suit);
      }
      
      // Then by rank
      const rankOrder = [
        Rank.TWO, Rank.THREE, Rank.FOUR, Rank.FIVE, Rank.SIX,
        Rank.SEVEN, Rank.EIGHT, Rank.NINE, Rank.TEN,
        Rank.JACK, Rank.QUEEN, Rank.KING, Rank.ACE, Rank.JOKER
      ];
      return rankOrder.indexOf(a.rank) - rankOrder.indexOf(b.rank);
    });
  }, [hashCards(cards)]); // Only re-sort when card composition changes

  // Touch gesture handler for mobile
  useEffect(() => {
    if (!isTouch || !containerRef.current) return;

    const dragHandler = new CardDragHandler({
      onTap: (element) => {
        const cardId = element.getAttribute('data-card-id');
        if (cardId) {
          handleCardClick(cardId);
        }
      }
    });

    const container = containerRef.current;
    const cardWrappers = container.querySelectorAll('.card-wrapper');

    cardWrappers.forEach(wrapper => {
      const element = wrapper as HTMLElement;
      element.addEventListener('touchstart', (e) => dragHandler.handleTouchStart(e as TouchEvent, element));
      element.addEventListener('touchmove', dragHandler.handleTouchMove);
      element.addEventListener('touchend', dragHandler.handleTouchEnd);
      element.addEventListener('touchcancel', dragHandler.handleTouchCancel);
    });

    return () => {
      cardWrappers.forEach(wrapper => {
        const element = wrapper as HTMLElement;
        element.removeEventListener('touchstart', (e) => dragHandler.handleTouchStart(e as TouchEvent, element));
        element.removeEventListener('touchmove', dragHandler.handleTouchMove);
        element.removeEventListener('touchend', dragHandler.handleTouchEnd);
        element.removeEventListener('touchcancel', dragHandler.handleTouchCancel);
      });
    };
  }, [cards, isTouch]);

  const handleCardClick = (cardId: string) => {
    // If parent provides onCardSelect, use single selection mode (for discarding)
    if (onCardSelect) {
      const newSelection = selectedCardId === cardId ? null : cardId;
      onCardSelect(newSelection);
      console.log('Card selected:', newSelection); // Debug log
    } else {
      // Otherwise use multi-selection mode (for melding)
      setSelectedCards(prev => {
        const newSet = new Set(prev);
        if (newSet.has(cardId)) {
          newSet.delete(cardId);
        } else {
          newSet.add(cardId);
        }
        return newSet;
      });
    }
  };

  const handleClearSelection = () => {
    setSelectedCards(new Set());
  };

  // Drag and drop handlers for card reordering
  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    setDraggedCardId(cardId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', cardId);
  };

  const handleDragOver = (e: React.DragEvent, cardId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverCardId(cardId);
  };

  const handleDragLeave = () => {
    setDragOverCardId(null);
  };

  const handleDrop = (e: React.DragEvent, targetCardId: string) => {
    e.preventDefault();
    setDragOverCardId(null);
    
    if (!draggedCardId || draggedCardId === targetCardId) {
      setDraggedCardId(null);
      return;
    }

    // Find indices
    const draggedIndex = sortedCards.findIndex(c => c.id === draggedCardId);
    const targetIndex = sortedCards.findIndex(c => c.id === targetCardId);

    if (draggedIndex === -1 || targetIndex === -1) {
      setDraggedCardId(null);
      return;
    }

    // Reorder cards
    const newCards = [...sortedCards];
    const [draggedCard] = newCards.splice(draggedIndex, 1);
    newCards.splice(targetIndex, 0, draggedCard);

    // Note: This is visual only - we'd need to dispatch an action to persist the order
    // For now, the cards will re-sort on next render based on suit/rank
    console.log('Card reordered:', draggedCard, 'to position', targetIndex);
    
    setDraggedCardId(null);
  };

  const handleDragEnd = () => {
    setDraggedCardId(null);
    setDragOverCardId(null);
  };

  return (
    <div className="player-hand">
      <div className="player-hand-header">
        <div className="player-info">
          <span className="player-name">{playerName}'s Hand</span>
          <span className="card-count">{cards.length} card{cards.length !== 1 ? 's' : ''}</span>
        </div>
        {selectedCards.size > 0 && (
          <button 
            className="clear-selection-btn touch-target" 
            onClick={handleClearSelection}
            aria-label={`Clear selection of ${selectedCards.size} cards`}
          >
            Clear Selection ({selectedCards.size})
          </button>
        )}
      </div>
      
      <div className="cards-container no-select" ref={containerRef}>
        {sortedCards.length === 0 ? (
          <div className="empty-hand">No cards in hand</div>
        ) : (
          sortedCards.map(card => (
            <div
              key={card.id}
              data-card-id={card.id}
              className={`card-wrapper ${(selectedCardId === card.id || selectedCards.has(card.id)) ? 'selected' : ''} ${isTouch ? 'touch-enabled' : ''} ${draggedCardId === card.id ? 'dragging' : ''} ${dragOverCardId === card.id ? 'drag-over' : ''}`}
              onClick={() => !isTouch && handleCardClick(card.id)}
              draggable={!isTouch}
              onDragStart={(e) => handleDragStart(e, card.id)}
              onDragOver={(e) => handleDragOver(e, card.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, card.id)}
              onDragEnd={handleDragEnd}
              role="button"
              aria-pressed={selectedCardId === card.id || selectedCards.has(card.id)}
              tabIndex={0}
            >
              <CardComponent 
                card={card}
                size={isMobile ? cardSize : 'medium'}
                animationClass={animatingCards.has(card.id) ? 'card-drawing card-fade-in' : 'card-hover-lift'}
                className={(selectedCardId === card.id || selectedCards.has(card.id)) ? 'card-selected' : ''}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memo optimization
  return (
    hashCards(prevProps.cards) === hashCards(nextProps.cards) &&
    prevProps.playerId === nextProps.playerId &&
    prevProps.playerName === nextProps.playerName
  );
});

// Export selected cards state management for parent components
export function useCardSelection() {
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());

  const toggleCard = (cardId: string) => {
    setSelectedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  const clearSelection = () => {
    setSelectedCards(new Set());
  };

  const selectCards = (cardIds: string[]) => {
    setSelectedCards(new Set(cardIds));
  };

  return {
    selectedCards,
    toggleCard,
    clearSelection,
    selectCards
  };
}
