# Card Artwork System

This document describes the custom card artwork implementation for the Shanko card game.

## Overview

The card artwork system provides unique, SVG-based designs for all card ranks, suits, and the Joker. The system is optimized for performance with memoization, lazy loading, and preloading capabilities.

## Components

### CardArtwork.tsx

Contains all SVG artwork components:

- **Suit Components**: `HeartSuit`, `DiamondSuit`, `ClubSuit`, `SpadeSuit`
- **Face Cards**: `JackArtwork`, `QueenArtwork`, `KingArtwork`
- **Special Cards**: `AceArtwork`, `JokerArtwork`
- **Number Cards**: `NumberPips` (generates pip layouts for 2-10)
- **Card Back**: `CardBackPattern`

### CardArtworkOptimized.tsx

Provides optimized, memoized versions of card rendering:

- **CardFace**: Memoized component for rendering card faces
- **CardBack**: Memoized component for rendering card backs
- **preloadCardArtwork()**: Function to preload card artwork
- **clearCardArtworkCache()**: Function to clear the artwork cache

### CardComponent.tsx

Main card component that uses the optimized artwork system. Features:

- Responsive sizing (small, medium, large)
- Memoization to prevent unnecessary re-renders
- Custom comparison function for optimal performance
- Animation support

## Performance Optimizations

### 1. Memoization

All card components use React.memo with custom comparison functions to prevent unnecessary re-renders:

```typescript
export const CardComponent = memo(({ card, ... }) => {
  // Component logic
}, (prevProps, nextProps) => {
  return prevProps.card.id === nextProps.card.id && ...;
});
```

### 2. Lazy Loading

Cards are rendered on-demand. The preloader utility allows background loading:

```typescript
import { batchPreloadCards } from '../utils/cardPreloader';

// Preload cards in chunks
await batchPreloadCards(allCards, 20);
```

### 3. SVG-Based Artwork

All artwork is SVG-based, providing:
- Scalability without quality loss
- Small file size (no external images)
- Easy customization
- Fast rendering

### 4. Batch Preloading

The `cardPreloader.ts` utility provides batch preloading to avoid blocking the main thread:

```typescript
// Preload in chunks of 20 cards with 10ms delay between chunks
await batchPreloadCards(cards, 20);
```

## Card Designs

### Suits

- **Hearts**: Red heart shape
- **Diamonds**: Red diamond shape
- **Clubs**: Black club/clover shape
- **Spades**: Black spade shape

### Face Cards

- **Jack**: Crown with simple face
- **Queen**: Ornate crown with jewels and hair details
- **King**: Large crown with jewels and beard

### Special Cards

- **Ace**: Large decorative "A" with star accent
- **Joker**: Jester hat with mask, stars, and colorful gradient

### Number Cards (2-10)

Number cards display suit symbols in traditional pip layouts:
- 2: Top and bottom center
- 3: Top, middle, bottom center
- 4: Four corners
- 5: Four corners + center
- 6: Two columns, three rows
- 7-10: Progressive pip additions

### Card Back

Distinctive blue gradient with diagonal pattern and central ornament.

## Usage

### Basic Card Rendering

```typescript
import { CardComponent } from './components/CardComponent';

<CardComponent 
  card={card}
  size="medium"
  onClick={handleClick}
/>
```

### Face-Down Card

```typescript
<CardComponent 
  card={card}
  faceDown={true}
  size="medium"
/>
```

### With Animation

```typescript
<CardComponent 
  card={card}
  animationClass="card-deal"
  size="medium"
/>
```

### Preloading Cards

```typescript
import { batchPreloadCards } from './utils/cardPreloader';

useEffect(() => {
  const allCards = [...drawPile, ...discardPile, ...playerHands];
  batchPreloadCards(allCards);
}, [round]);
```

## Sprite Sheet Support

The system includes utilities for generating sprite sheets (future optimization):

```typescript
import { 
  generateSpriteSheetMetadata,
  exportSpriteSheetMetadata 
} from './utils/cardSpriteSheet';

// Generate metadata for sprite sheet tools
const metadata = generateSpriteSheetMetadata();
const json = exportSpriteSheetMetadata();
```

## Customization

### Changing Colors

Edit the color constants in `CardArtwork.tsx`:

```typescript
const color = suit === Suit.HEARTS || suit === Suit.DIAMONDS 
  ? '#d32f2f'  // Red suits
  : '#212121'; // Black suits
```

### Modifying Artwork

Each artwork component is a standalone SVG. Modify the SVG paths to change designs:

```typescript
export const JackArtwork = ({ suit, size }) => (
  <svg width={size} height={size} viewBox="0 0 60 60">
    {/* Modify SVG paths here */}
  </svg>
);
```

### Adding New Card Sizes

Add new size configurations in `CardComponent.tsx`:

```typescript
const dimensions = {
  small: { width: 50, height: 70, cornerSize: 12, centerSize: 30 },
  medium: { width: 80, height: 112, cornerSize: 16, centerSize: 60 },
  large: { width: 100, height: 140, cornerSize: 20, centerSize: 80 },
  xlarge: { width: 120, height: 168, cornerSize: 24, centerSize: 100 } // New size
}[size];
```

## Export for Physical Cards

The artwork can be exported for physical card production:

1. Render each card at high resolution (300 DPI)
2. Use the sprite sheet utilities to generate layouts
3. Export as PNG or PDF for printing

```typescript
// Generate sprite sheet metadata
const metadata = exportSpriteSheetMetadata({
  cardWidth: 750,  // 2.5" at 300 DPI
  cardHeight: 1050, // 3.5" at 300 DPI
  columns: 13,
  rows: 5,
  padding: 30
});
```

## Browser Compatibility

The card artwork system uses:
- SVG (supported in all modern browsers)
- React.memo (React 16.6+)
- requestIdleCallback (with setTimeout fallback)

## Performance Metrics

Expected performance characteristics:
- Initial render: ~50ms for 52 cards
- Re-render (memoized): <1ms per card
- Memory usage: ~2MB for all card artwork
- Preload time: ~100ms for full deck

## Future Enhancements

Potential improvements:
1. WebGL-based rendering for large card counts
2. Animated card faces (flip, shine effects)
3. Texture-based rendering for 3D effects
4. Custom themes/skins
5. Accessibility improvements (high contrast mode)
