# Bug Fix: Discard and Card Rearrangement Issues

## Problem Identified

You've discovered two critical bugs in the live game:

1. **Cannot discard cards** after drawing
2. **Cannot rearrange cards** in hand

## Root Cause

The `GameControls` component (`src/components/GameControls.tsx`) has placeholder `console.log()` statements instead of actual Redux dispatch actions. The buttons are not connected to the game state.

### Current Code (Lines 28-68):
```typescript
const handleDrawFromDrawPile = () => {
  if (!validActions.canDrawFromDrawPile) return;
  // This will be implemented when connecting to game logic
  console.log('Draw from draw pile');  // ❌ Just logging, not doing anything
};

const handleDiscard = () => {
  if (!validActions.canDiscard) return;
  // This will be implemented when connecting to game logic
  console.log('Discard card');  // ❌ Just logging, not doing anything
};
```

## The Fix

The game logic exists in `GameEngine.ts` but isn't connected to the UI. We need to:

1. Import `useDispatch` from react-redux
2. Import the game action creators from the store
3. Replace console.log statements with actual dispatch calls
4. Add card selection state management
5. Connect the PlayerHand component to allow card selection for discarding

## Quick Workaround (Temporary)

Since this requires significant code changes and you want to test the game, here's what you can do:

### Option 1: Use Keyboard Shortcuts
The game might have keyboard shortcuts that work. Try:
- Press `X` to discard
- Press `D` to draw
- Use arrow keys to select cards

### Option 2: Check Browser Console
Open browser console (F12) and check if there are any error messages that might give us more clues.

## Proper Fix Required

This needs code changes to:

1. **GameControls.tsx** - Connect Redux actions
2. **PlayerHand.tsx** - Add card selection for discard
3. **Game state management** - Ensure selected card is tracked

Would you like me to implement the full fix? This will require:
- Updating GameControls to dispatch Redux actions
- Adding card selection state
- Connecting the discard action to the selected card
- Testing the changes locally before deploying

## Impact

**Current State:**
- ❌ Game is unplayable - can't complete a turn
- ❌ Can't discard cards
- ❌ Can't rearrange hand

**After Fix:**
- ✅ Full gameplay functionality
- ✅ Card selection and discard
- ✅ Hand rearrangement (drag and drop)
- ✅ Complete game flow

## Next Steps

Let me know if you'd like me to:
1. **Implement the full fix** (recommended) - I'll update the necessary files
2. **Create a detailed fix guide** - Step-by-step instructions for you to implement
3. **Investigate further** - Check if there are other related issues

This is a critical bug that prevents the game from being playable. We should fix it before promoting the game further.

---

**Priority:** 🔴 **CRITICAL** - Game is currently unplayable  
**Estimated Fix Time:** 30-60 minutes  
**Files to Update:** 2-3 files  
**Testing Required:** Yes, full gameplay test after fix  

Would you like me to proceed with implementing the fix?
