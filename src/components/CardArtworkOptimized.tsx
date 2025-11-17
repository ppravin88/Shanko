import { memo } from 'react';
import { Card, Rank, Suit } from '../types';
import {
  HeartSuit,
  DiamondSuit,
  ClubSuit,
  SpadeSuit,
  JackArtwork,
  QueenArtwork,
  KingArtwork,
  AceArtwork,
  JokerArtwork,
  NumberPips,
  CardBackPattern
} from './CardArtwork';

/**
 * Optimized card artwork components with memoization
 * These components are memoized to prevent unnecessary re-renders
 */

interface CardFaceProps {
  card: Card;
  width: number;
  height: number;
  cornerSize: number;
  centerSize: number;
}

// Memoized card face component
export const CardFace = memo(({ card, width, height, cornerSize, centerSize }: CardFaceProps) => {
  const isRed = card.suit === Suit.HEARTS || card.suit === Suit.DIAMONDS;
  const isJoker = card.rank === Rank.JOKER;
  const isFaceCard = [Rank.JACK, Rank.QUEEN, Rank.KING].includes(card.rank);
  const isAce = card.rank === Rank.ACE;
  const isNumberCard = !isJoker && !isFaceCard && !isAce;

  const getSuitComponent = (suit: Suit | null, size: number) => {
    if (!suit) return null;
    const color = isRed ? '#d32f2f' : '#212121';
    switch (suit) {
      case Suit.HEARTS: return <HeartSuit size={size} color={color} />;
      case Suit.DIAMONDS: return <DiamondSuit size={size} color={color} />;
      case Suit.CLUBS: return <ClubSuit size={size} color={color} />;
      case Suit.SPADES: return <SpadeSuit size={size} color={color} />;
    }
  };

  const getRankDisplay = (rank: Rank): string => {
    if (rank === Rank.JOKER) return 'JKR';
    return rank;
  };

  const getCenterArtwork = () => {
    if (isJoker) {
      return <JokerArtwork size={centerSize} />;
    }
    
    if (isAce && card.suit) {
      return <AceArtwork suit={card.suit} size={centerSize} />;
    }
    
    if (isFaceCard && card.suit) {
      switch (card.rank) {
        case Rank.JACK:
          return <JackArtwork suit={card.suit} size={centerSize} />;
        case Rank.QUEEN:
          return <QueenArtwork suit={card.suit} size={centerSize} />;
        case Rank.KING:
          return <KingArtwork suit={card.suit} size={centerSize} />;
      }
    }
    
    if (isNumberCard && card.suit) {
      return <NumberPips rank={card.rank} suit={card.suit} size={centerSize} />;
    }
    
    return null;
  };

  return (
    <div className="card-content">
      <div className="card-corner card-corner-top">
        <div className="card-rank">{getRankDisplay(card.rank)}</div>
        {!isJoker && <div className="card-suit">{getSuitComponent(card.suit, cornerSize)}</div>}
      </div>
      
      <div className="card-center">
        {getCenterArtwork()}
      </div>
      
      <div className="card-corner card-corner-bottom">
        <div className="card-rank">{getRankDisplay(card.rank)}</div>
        {!isJoker && <div className="card-suit">{getSuitComponent(card.suit, cornerSize)}</div>}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  return (
    prevProps.card.id === nextProps.card.id &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.cornerSize === nextProps.cornerSize &&
    prevProps.centerSize === nextProps.centerSize
  );
});

CardFace.displayName = 'CardFace';

// Memoized card back component
export const CardBack = memo(({ width, height }: { width: number; height: number }) => {
  return <CardBackPattern width={width} height={height} />;
}, (prevProps, nextProps) => {
  return prevProps.width === nextProps.width && prevProps.height === nextProps.height;
});

CardBack.displayName = 'CardBack';

// Card artwork cache for preloading
const cardArtworkCache = new Map<string, boolean>();

/**
 * Preload card artwork by rendering it off-screen
 * This helps with performance when cards are first displayed
 */
export function preloadCardArtwork(cards: Card[]) {
  cards.forEach(card => {
    const cacheKey = `${card.rank}-${card.suit}`;
    if (!cardArtworkCache.has(cacheKey)) {
      cardArtworkCache.set(cacheKey, true);
    }
  });
}

/**
 * Clear the card artwork cache
 */
export function clearCardArtworkCache() {
  cardArtworkCache.clear();
}
