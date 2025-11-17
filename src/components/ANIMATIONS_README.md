# Card Animations and Visual Feedback System

This document describes the animation and visual feedback system implemented for the Shanko card game.

## Overview

The system provides comprehensive animations and visual feedback for all game actions, enhancing the user experience and making the game more intuitive and engaging.

## Components Implemented

### 1. Animation System (`animations.css`)

A complete CSS animation library for card movements and interactions:

#### Card Movement Animations
- **Dealing Animation**: Cards fly from deck to player hands with rotation
- **Draw Animation**: Smooth transition from draw pile to hand
- **Draw from Discard**: Cards move from discard pile to hand
- **Discard Animation**: Cards move from hand to discard pile
- **Buy Animation**: Special animation for bought cards with extra card
- **Meld Animation**: Cards transition from hand to melded area

#### Visual Feedback Animations
- **Pulse**: Highlights important cards or actions
- **Shake**: Indicates invalid actions or errors
- **Glow (Green)**: Shows valid card combinations
- **Glow (Red)**: Shows invalid card combinations
- **Flip**: Card reveal animation
- **Fade In/Out**: Smooth appearance/disappearance

#### Interactive States
- **Hover Lift**: Cards lift on hover for better interactivity
- **Selected**: Highlighted state for selected cards
- **Disabled**: Grayed out state for unavailable actions
- **Thinking**: Pulsing animation for AI turns

### 2. Visual Feedback Components (`VisualFeedback.tsx`)

React components for game state feedback:

#### CombinationHighlight
- Highlights card combinations as valid (green) or invalid (red)
- Shows checkmark/cross icons
- Animated borders and shadows

#### TurnIndicator
- Fixed position indicator showing current player
- Different styling for human vs AI players
- Animated entrance and pulsing icon

#### LoadingIndicator
- Spinner animation for AI thinking
- Customizable message display
- Smooth fade in/out

#### HoverFeedback
- Wrapper component for interactive elements
- Tooltip support
- Disabled state handling

### 3. Toast Notification System (`Toast.tsx`, `Toast.css`)

Complete notification system for errors, successes, and info messages:

#### Features
- **4 Toast Types**: Success, Error, Warning, Info
- **Auto-dismiss**: Configurable duration with progress bar
- **Manual Dismiss**: Close button on each toast
- **Stacking**: Multiple toasts stack vertically
- **Animations**: Slide in from right, shake on error
- **Responsive**: Adapts to mobile screens

#### Toast Hook (`useToast.ts`)
- `addToast()`: Add custom toast
- `showSuccess()`: Show success message
- `showError()`: Show error message
- `showWarning()`: Show warning message
- `showInfo()`: Show info message
- `dismissToast()`: Remove specific toast
- `clearAllToasts()`: Remove all toasts

#### Predefined Messages
- **Validation Errors**: Invalid triplet, sequence, etc.
- **Success Messages**: Card drawn, melded, went out, etc.
- **Info Messages**: Turn notifications, AI thinking, etc.

### 4. Toast Context (`ToastContext.tsx`)

React Context provider for global toast access:
- Wraps the app to provide toast functionality everywhere
- `useToastContext()` hook for accessing toasts in any component

## Integration

### CardComponent
- Accepts `animationClass` prop for applying animations
- Supports `onClick` handler
- Accepts `className` for additional styling

### PlayerHand
- Automatically animates new cards with draw animation
- Tracks card additions and triggers animations
- Applies hover effects to all cards

### MeldedSets
- Animates newly melded cards with appear animation
- Tracks meld additions across all players

### ScoreBoard
- Highlights current player with pulsing border
- Uses `player-current` class for visual distinction

### GameControls
- All buttons have hover effects (`button-hover` class)
- Disabled states properly styled
- Visual feedback on interaction

## Usage Examples

### Adding Animations to Cards

```tsx
<CardComponent 
  card={card}
  animationClass="card-drawing card-fade-in"
  className="card-selected"
/>
```

### Using Toast Notifications

```tsx
import { useToastContext } from '../utils/ToastContext';

function MyComponent() {
  const { showSuccess, showError } = useToastContext();
  
  const handleAction = () => {
    try {
      // ... perform action
      showSuccess('Action completed successfully!');
    } catch (error) {
      showError('Action failed: ' + error.message);
    }
  };
}
```

### Highlighting Combinations

```tsx
import { CombinationHighlight } from './VisualFeedback';

<CombinationHighlight isValid={isValidCombination}>
  {/* Card components */}
</CombinationHighlight>
```

### Showing Turn Indicator

```tsx
import { TurnIndicator } from './VisualFeedback';

<TurnIndicator 
  playerName={currentPlayer.name}
  isCurrentPlayer={true}
  isAI={currentPlayer.type === 'AI'}
/>
```

## Animation Classes Reference

### Movement
- `card-dealing` - Deal from deck
- `card-drawing` - Draw from pile
- `card-drawing-discard` - Draw from discard
- `card-discarding` - Discard to pile
- `card-buying` - Buy card animation
- `card-buying-extra` - Extra card in buy
- `card-melding` - Meld to table
- `card-appear-melded` - Appear in melded area

### Feedback
- `card-pulse` - Attention pulse
- `card-shake` - Error shake
- `card-glow-valid` - Valid green glow
- `card-glow-invalid` - Invalid red glow
- `card-flipping` - Flip animation
- `card-fade-in` - Fade in
- `card-fade-out` - Fade out

### States
- `card-hover-lift` - Hover effect
- `card-selected` - Selected state
- `card-disabled` - Disabled state
- `card-thinking` - AI thinking

### Delays
- `card-delay-1` through `card-delay-11` - Stagger animations

## Responsive Design

All animations and feedback components are responsive:
- Mobile-optimized toast positioning
- Scaled animations for smaller screens
- Touch-friendly hover states
- Adaptive sizing for all screen sizes

## Performance Considerations

- CSS animations use GPU acceleration (transform, opacity)
- Animations automatically clean up after completion
- Minimal re-renders with proper React hooks
- Efficient state management for toasts

## Requirements Satisfied

- ✅ 7.4: Card animations for all game actions
- ✅ 7.5: Visual feedback for valid/invalid combinations
- ✅ 7.5: Turn indicator showing current player
- ✅ 7.5: Hover effects on interactive elements
- ✅ 18.5: Loading state for AI turns
- ✅ 2.4: Validation error display
- ✅ 3.7: Sequence validation errors
- ✅ 6.4: Meld validation errors
- ✅ 10.5: Action confirmations

## Future Enhancements

Potential improvements for future iterations:
- Sound effects synchronized with animations
- Particle effects for special actions (going out)
- Customizable animation speeds in settings
- More elaborate card dealing sequences
- Victory celebration animations
- Confetti effects for winning
