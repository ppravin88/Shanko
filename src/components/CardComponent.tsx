import { memo } from 'react';
import { Card, Rank, Suit } from '../types';
import './CardComponent.css';
import './animations.css';
import { CardFace, CardBack } from './CardArtworkOptimized';

interface CardComponentProps {
  card: Card;
  faceDown?: boolean;
  size?: 'small' | 'medium' | 'large';
  animationClass?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * CardComponent - Optimized card renderer with memoization
 * Uses custom SVG artwork for all card faces and backs
 */
export const CardComponent = memo(({ 
  card, 
  faceDown = false, 
  size = 'medium',
  animationClass = '',
  onClick,
  className = ''
}: CardComponentProps) => {
  const combinedClassName = `card card-${size} ${animationClass} ${className}`.trim();
  
  // Get dimensions based on size
  const dimensions = {
    small: { width: 50, height: 70, cornerSize: 12, centerSize: 30 },
    medium: { width: 80, height: 112, cornerSize: 16, centerSize: 60 },
    large: { width: 100, height: 140, cornerSize: 20, centerSize: 80 }
  }[size];
  
  // Generate accessible label for the card
  const getCardLabel = (): string => {
    if (faceDown) {
      return 'Face down card';
    }
    
    if (card.rank === Rank.JOKER) {
      return 'Joker';
    }
    
    const rankNames: Record<string, string> = {
      '2': 'Two', '3': 'Three', '4': 'Four', '5': 'Five', '6': 'Six',
      '7': 'Seven', '8': 'Eight', '9': 'Nine', '10': 'Ten',
      'J': 'Jack', 'Q': 'Queen', 'K': 'King', 'A': 'Ace'
    };
    
    const suitNames: Record<string, string> = {
      'HEARTS': 'Hearts', 'DIAMONDS': 'Diamonds',
      'CLUBS': 'Clubs', 'SPADES': 'Spades'
    };
    
    const rankName = rankNames[card.rank] || card.rank;
    const suitName = card.suit ? suitNames[card.suit] : '';
    
    return `${rankName} of ${suitName}`;
  };

  if (faceDown) {
    return (
      <div 
        className={`${combinedClassName} card-back`} 
        onClick={onClick}
        role="img"
        aria-label="Face down card"
        tabIndex={onClick ? 0 : -1}
        onKeyDown={onClick ? (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
          }
        } : undefined}
      >
        <CardBack width={dimensions.width} height={dimensions.height} />
      </div>
    );
  }

  const isRed = card.suit === Suit.HEARTS || card.suit === Suit.DIAMONDS;
  const isJoker = card.rank === Rank.JOKER;

  return (
    <div 
      className={`${combinedClassName} ${isRed ? 'card-red' : 'card-black'} ${isJoker ? 'card-joker' : ''}`}
      onClick={onClick}
      role="img"
      aria-label={getCardLabel()}
      tabIndex={onClick ? 0 : -1}
      data-suit={card.suit || undefined}
      data-rank={card.rank}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      <CardFace 
        card={card}
        width={dimensions.width}
        height={dimensions.height}
        cornerSize={dimensions.cornerSize}
        centerSize={dimensions.centerSize}
      />
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for memo optimization
  return (
    prevProps.card.id === nextProps.card.id &&
    prevProps.faceDown === nextProps.faceDown &&
    prevProps.size === nextProps.size &&
    prevProps.animationClass === nextProps.animationClass &&
    prevProps.className === nextProps.className
  );
});

CardComponent.displayName = 'CardComponent';
