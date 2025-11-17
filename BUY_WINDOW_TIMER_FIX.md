# Buy Window Timer Fix

## Problem

The game was getting stuck in the BUY_WINDOW phase indefinitely after a card was discarded. There was no automatic timeout to advance to the next turn.

## Solution

Added a 5-second buy window timer that automatically advances to the next player's turn if no one makes a buy within that time.

## Changes Made

### 1. GameBoard.tsx

**Added Buy Timer Logic**:
```typescript
// Separate timers for discard and buy phases
const isDiscardTimerActive = gamePhase === GamePhase.DISCARD;
const isBuyTimerActive = gamePhase === GamePhase.BUY_WINDOW;

// Buy window timeout handler
const handleBuyTimeout = useCallback(() => {
  dispatch(completeBuyWindow());
}, [dispatch]);
```

**Render Both Timers**:
```typescript
{/* Discard Timer - 30 seconds */}
{isDiscardTimerActive && (
  <TurnTimer 
    isActive={isDiscardTimerActive}
    onTimeout={handleDiscardTimeout}
  />
)}

{/* Buy Window Timer - 5 seconds */}
{isBuyTimerActive && (
  <TurnTimer 
    isActive={isBuyTimerActive}
    onTimeout={handleBuyTimeout}
    duration={5}
  />
)}
```

### 2. TurnTimer.tsx

**Added Duration Prop**:
```typescript
interface TurnTimerProps {
  isActive: boolean;
  onTimeout: () => void;
  onTick?: (secondsRemaining: number) => void;
  duration?: number; // Optional custom duration (default: 30)
}
```

**Updated Component**:
- Uses `duration` prop instead of hardcoded `TURN_TIME_LIMIT`
- Resets to `duration` when timer becomes active
- Calculates percentage based on `duration`

### 3. turnTimer.ts

**Updated Warning Level Function**:
```typescript
export function getTimerWarningLevel(
  seconds: number, 
  totalDuration: number = TURN_TIME_LIMIT
): 'normal' | 'warning' | 'critical' {
  const percentRemaining = (seconds / totalDuration) * 100;
  
  if (percentRemaining <= 16.67) return 'critical'; // Last 16.67%
  if (percentRemaining <= 33.33) return 'warning';  // Last 33.33%
  return 'normal';
}
```

Now works with any duration:
- 30s timer: critical at 5s, warning at 10s
- 5s timer: critical at <1s, warning at <2s

## How It Works

### Game Flow

1. **Player Discards** → Game enters BUY_WINDOW phase
2. **Buy Timer Starts** → 5-second countdown begins
3. **Players Can Buy** → Any player can click "Buy" button within 5 seconds
4. **Timer Expires** → If no one buys, `completeBuyWindow()` is called
5. **Next Turn** → Game advances to next player's DRAW phase

### Visual Feedback

The buy window timer shows:
- **Green** (5-2 seconds): Normal - plenty of time
- **Orange** (2-1 seconds): Warning - time running out
- **Red** (<1 second): Critical - last chance!

## Testing

After redeployment:

1. **Start a game**
2. **Discard a card** → Game enters BUY_WINDOW
3. **Watch the timer** → Should count down from 5 seconds
4. **Don't click Buy** → After 5 seconds, turn should automatically advance
5. **Try buying** → Click Buy before timer expires to test buy functionality

## Debug Panel

The debug panel now shows:
```
Selected Card: [card-id or None]
Game Phase: BUY_WINDOW
Player Type: [type]
Discard Timer: No
Buy Timer: Yes  ← Should show "Yes" during buy window
```

## Benefits

1. **No More Stuck Games** - Game always progresses
2. **Fair Time Limit** - All players have equal 5 seconds to decide
3. **Better UX** - Visual countdown shows time remaining
4. **Flexible System** - Can easily adjust duration if needed

## Future Enhancements

- Make buy window duration configurable in game settings
- Add sound effect when buy timer is critical
- Show "No one bought" message when timer expires
- Track buy statistics (how often players buy vs. timeout)
