import { Rank, Suit } from '../types';

/**
 * CardArtwork - SVG-based custom card artwork components
 * Provides unique designs for all ranks, suits, and Joker
 */

// Suit SVG Components
export const HeartSuit = ({ size = 24, color = '#d32f2f' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

export const DiamondSuit = ({ size = 24, color = '#d32f2f' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2L2 12l10 10 10-10L12 2z"/>
  </svg>
);

export const ClubSuit = ({ size = 24, color = '#212121' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2C10.34 2 9 3.34 9 5c0 1.1.6 2.05 1.48 2.58C9.56 8.03 9 9.23 9 10.5c0 1.93 1.57 3.5 3.5 3.5.35 0 .69-.05 1-.15V19H11v2h6v-2h-2.5v-5.15c.31.1.65.15 1 .15 1.93 0 3.5-1.57 3.5-3.5 0-1.27-.56-2.47-1.48-2.92C18.4 7.05 19 6.1 19 5c0-1.66-1.34-3-3-3-1.3 0-2.4.84-2.82 2h-1.36C11.4 2.84 10.3 2 9 2z"/>
  </svg>
);

export const SpadeSuit = ({ size = 24, color = '#212121' }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2L2 12c0 2.21 1.79 4 4 4 1.18 0 2.24-.51 2.97-1.33.07.11.14.22.22.33-.23.74-.39 1.52-.39 2.33 0 .83.67 1.5 1.5 1.5h3.4c.83 0 1.5-.67 1.5-1.5 0-.81-.16-1.59-.39-2.33.08-.11.15-.22.22-.33C15.76 15.49 16.82 16 18 16c2.21 0 4-1.79 4-4L12 2z"/>
  </svg>
);

// Face Card Artwork
export const JackArtwork = ({ suit, size = 60 }: { suit: Suit; size?: number }) => {
  const color = suit === Suit.HEARTS || suit === Suit.DIAMONDS ? '#d32f2f' : '#212121';
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      {/* Crown */}
      <path d="M15 20 L20 15 L25 20 L30 15 L35 20 L40 15 L45 20 L45 25 L15 25 Z" fill={color} opacity="0.8"/>
      {/* Face */}
      <circle cx="30" cy="35" r="12" fill={color} opacity="0.3"/>
      {/* Eyes */}
      <circle cx="26" cy="33" r="2" fill={color}/>
      <circle cx="34" cy="33" r="2" fill={color}/>
      {/* Smile */}
      <path d="M24 38 Q30 42 36 38" stroke={color} strokeWidth="2" fill="none"/>
    </svg>
  );
};

export const QueenArtwork = ({ suit, size = 60 }: { suit: Suit; size?: number }) => {
  const color = suit === Suit.HEARTS || suit === Suit.DIAMONDS ? '#d32f2f' : '#212121';
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      {/* Crown with jewels */}
      <path d="M15 18 L20 13 L25 18 L30 13 L35 18 L40 13 L45 18 L45 24 L15 24 Z" fill={color} opacity="0.8"/>
      <circle cx="22" cy="18" r="2" fill="#FFD700"/>
      <circle cx="30" cy="18" r="2" fill="#FFD700"/>
      <circle cx="38" cy="18" r="2" fill="#FFD700"/>
      {/* Face */}
      <circle cx="30" cy="36" r="13" fill={color} opacity="0.3"/>
      {/* Eyes */}
      <circle cx="26" cy="34" r="2" fill={color}/>
      <circle cx="34" cy="34" r="2" fill={color}/>
      {/* Smile */}
      <path d="M24 40 Q30 44 36 40" stroke={color} strokeWidth="2" fill="none"/>
      {/* Hair */}
      <path d="M18 30 Q18 25 22 24" stroke={color} strokeWidth="2" fill="none"/>
      <path d="M42 30 Q42 25 38 24" stroke={color} strokeWidth="2" fill="none"/>
    </svg>
  );
};

export const KingArtwork = ({ suit, size = 60 }: { suit: Suit; size?: number }) => {
  const color = suit === Suit.HEARTS || suit === Suit.DIAMONDS ? '#d32f2f' : '#212121';
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      {/* Large crown */}
      <path d="M12 16 L18 10 L24 16 L30 10 L36 16 L42 10 L48 16 L48 24 L12 24 Z" fill={color} opacity="0.9"/>
      <rect x="12" y="24" width="36" height="4" fill={color} opacity="0.9"/>
      {/* Jewels */}
      <circle cx="18" cy="16" r="2.5" fill="#FFD700"/>
      <circle cx="30" cy="16" r="2.5" fill="#FFD700"/>
      <circle cx="42" cy="16" r="2.5" fill="#FFD700"/>
      {/* Face */}
      <circle cx="30" cy="40" r="14" fill={color} opacity="0.3"/>
      {/* Eyes */}
      <circle cx="26" cy="38" r="2" fill={color}/>
      <circle cx="34" cy="38" r="2" fill={color}/>
      {/* Beard */}
      <path d="M22 44 Q30 50 38 44" stroke={color} strokeWidth="3" fill="none"/>
      <path d="M24 46 Q30 51 36 46" stroke={color} strokeWidth="2" fill="none"/>
    </svg>
  );
};

export const AceArtwork = ({ suit, size = 60 }: { suit: Suit; size?: number }) => {
  const color = suit === Suit.HEARTS || suit === Suit.DIAMONDS ? '#d32f2f' : '#212121';
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      {/* Large decorative A */}
      <path d="M30 10 L45 50 L38 50 L35 40 L25 40 L22 50 L15 50 Z" fill={color} opacity="0.8"/>
      <rect x="26" y="32" width="8" height="6" fill="white"/>
      {/* Star accent */}
      <path d="M30 5 L32 12 L39 12 L33 17 L35 24 L30 19 L25 24 L27 17 L21 12 L28 12 Z" fill={color} opacity="0.4"/>
    </svg>
  );
};

// Joker Artwork
export const JokerArtwork = ({ size = 80 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    {/* Jester hat */}
    <path d="M20 30 L30 10 L40 30 L50 10 L60 30 L40 35 Z" fill="#764ba2"/>
    <circle cx="30" cy="10" r="4" fill="#FFD700"/>
    <circle cx="50" cy="10" r="4" fill="#FFD700"/>
    
    {/* Face */}
    <circle cx="40" cy="45" r="18" fill="white"/>
    
    {/* Mask */}
    <ellipse cx="40" cy="42" rx="16" ry="8" fill="#667eea" opacity="0.7"/>
    
    {/* Eyes */}
    <circle cx="34" cy="42" r="3" fill="#212121"/>
    <circle cx="46" cy="42" r="3" fill="#212121"/>
    
    {/* Big smile */}
    <path d="M28 50 Q40 60 52 50" stroke="#d32f2f" strokeWidth="3" fill="none"/>
    
    {/* Stars around */}
    <path d="M15 45 L17 48 L20 48 L18 50 L19 53 L15 51 L11 53 L12 50 L10 48 L13 48 Z" fill="#FFD700" opacity="0.6"/>
    <path d="M65 45 L67 48 L70 48 L68 50 L69 53 L65 51 L61 53 L62 50 L60 48 L63 48 Z" fill="#FFD700" opacity="0.6"/>
  </svg>
);

// Number card pip layouts
export const NumberPips = ({ rank, suit, size = 60 }: { rank: Rank; suit: Suit; size?: number }) => {
  const SuitComponent = getSuitComponent(suit);
  const pipSize = size / 6;
  const color = suit === Suit.HEARTS || suit === Suit.DIAMONDS ? '#d32f2f' : '#212121';
  
  const positions = getPipPositions(rank, size);
  
  return (
    <svg width={size} height={size * 1.4} viewBox={`0 0 ${size} ${size * 1.4}`}>
      {positions.map((pos, idx) => (
        <g key={idx} transform={`translate(${pos.x}, ${pos.y})`}>
          <SuitComponent size={pipSize} color={color} />
        </g>
      ))}
    </svg>
  );
};

function getSuitComponent(suit: Suit) {
  switch (suit) {
    case Suit.HEARTS: return HeartSuit;
    case Suit.DIAMONDS: return DiamondSuit;
    case Suit.CLUBS: return ClubSuit;
    case Suit.SPADES: return SpadeSuit;
  }
}

function getPipPositions(rank: Rank, size: number): { x: number; y: number }[] {
  const w = size;
  const h = size * 1.4;
  const positions: { x: number; y: number }[] = [];
  
  const left = w * 0.25;
  const center = w * 0.5;
  const right = w * 0.75;
  
  const top = h * 0.15;
  const upperMid = h * 0.3;
  const middle = h * 0.5;
  const lowerMid = h * 0.7;
  const bottom = h * 0.85;
  
  switch (rank) {
    case Rank.TWO:
      positions.push({ x: center, y: top }, { x: center, y: bottom });
      break;
    case Rank.THREE:
      positions.push({ x: center, y: top }, { x: center, y: middle }, { x: center, y: bottom });
      break;
    case Rank.FOUR:
      positions.push({ x: left, y: top }, { x: right, y: top }, { x: left, y: bottom }, { x: right, y: bottom });
      break;
    case Rank.FIVE:
      positions.push({ x: left, y: top }, { x: right, y: top }, { x: center, y: middle }, { x: left, y: bottom }, { x: right, y: bottom });
      break;
    case Rank.SIX:
      positions.push({ x: left, y: top }, { x: right, y: top }, { x: left, y: middle }, { x: right, y: middle }, { x: left, y: bottom }, { x: right, y: bottom });
      break;
    case Rank.SEVEN:
      positions.push({ x: left, y: top }, { x: right, y: top }, { x: center, y: upperMid }, { x: left, y: middle }, { x: right, y: middle }, { x: left, y: bottom }, { x: right, y: bottom });
      break;
    case Rank.EIGHT:
      positions.push({ x: left, y: top }, { x: right, y: top }, { x: center, y: upperMid }, { x: left, y: middle }, { x: right, y: middle }, { x: center, y: lowerMid }, { x: left, y: bottom }, { x: right, y: bottom });
      break;
    case Rank.NINE:
      positions.push({ x: left, y: top }, { x: right, y: top }, { x: left, y: upperMid }, { x: right, y: upperMid }, { x: center, y: middle }, { x: left, y: lowerMid }, { x: right, y: lowerMid }, { x: left, y: bottom }, { x: right, y: bottom });
      break;
    case Rank.TEN:
      positions.push({ x: left, y: top }, { x: right, y: top }, { x: center, y: top + (upperMid - top) / 2 }, { x: left, y: upperMid }, { x: right, y: upperMid }, { x: left, y: lowerMid }, { x: right, y: lowerMid }, { x: center, y: bottom - (bottom - lowerMid) / 2 }, { x: left, y: bottom }, { x: right, y: bottom });
      break;
  }
  
  return positions;
}

// Card back pattern
export const CardBackPattern = ({ width = 80, height = 112 }: { width?: number; height?: number }) => (
  <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
    <defs>
      <linearGradient id="cardBackGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e3c72" />
        <stop offset="100%" stopColor="#2a5298" />
      </linearGradient>
      <pattern id="cardBackPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <rect width="20" height="20" fill="none"/>
        <path d="M0 10 L10 0 M10 20 L20 10" stroke="rgba(255,255,255,0.15)" strokeWidth="2"/>
      </pattern>
    </defs>
    
    <rect width={width} height={height} fill="url(#cardBackGradient)" rx="8"/>
    <rect width={width} height={height} fill="url(#cardBackPattern)" rx="8"/>
    
    {/* Central ornament */}
    <circle cx={width/2} cy={height/2} r={width/4} fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
    <circle cx={width/2} cy={height/2} r={width/5} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
    
    {/* Corner decorations */}
    <circle cx={width * 0.2} cy={height * 0.15} r="3" fill="rgba(255,255,255,0.4)"/>
    <circle cx={width * 0.8} cy={height * 0.15} r="3" fill="rgba(255,255,255,0.4)"/>
    <circle cx={width * 0.2} cy={height * 0.85} r="3" fill="rgba(255,255,255,0.4)"/>
    <circle cx={width * 0.8} cy={height * 0.85} r="3" fill="rgba(255,255,255,0.4)"/>
  </svg>
);
