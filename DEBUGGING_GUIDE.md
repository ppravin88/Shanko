# Debugging Guide - What to Check After Deployment

## What You Should See

After the deployment completes and you refresh the game, you should see a **debug panel** above the game controls that looks like this:

```
┌─────────────────────────────────────┐
│ Selected Card: None                 │
│ Game Phase: DRAW                    │
│ Player Type: HUMAN                  │
│ Timer Active: No                    │
└─────────────────────────────────────┐
```

## Testing Steps

### 1. Card Selection Test

**Steps:**
1. Start a game and draw a card (to get to MELD or DISCARD phase)
2. Click on any card in your hand
3. Watch the debug panel

**What Should Happen:**
- Debug panel "Selected Card" should change from "None" to a card ID (e.g., "card-123")
- The clicked card should visually lift up with a green border
- Browser console (F12) should show: `Card selected: card-123`

**If It Doesn't Work:**
- Check browser console for errors
- Verify the debug panel is visible
- Try clicking different cards
- Take a screenshot and share what you see

### 2. Timer Visibility Test

**Steps:**
1. Progress through the game until it's your turn to discard
2. Check the debug panel values

**What Should Happen:**
- Debug panel should show:
  - `Game Phase: DISCARD`
  - `Player Type: HUMAN`
  - `Timer Active: Yes`
- You should see a white timer box counting down from 30 seconds
- Timer should be between the debug panel and the game control buttons

**If Timer Doesn't Show:**
- Check what "Timer Active" says in debug panel
- Check what "Game Phase" says
- If "Timer Active: Yes" but no timer visible, it's a CSS issue
- If "Timer Active: No", the logic is wrong

### 3. Drag-and-Drop Test

**Steps:**
1. On desktop browser (not mobile)
2. Hover over a card - cursor should change to a "grab" hand
3. Click and hold a card
4. Drag it left or right
5. Release

**What Should Happen:**
- While dragging: card becomes semi-transparent (40% opacity)
- Drop target: shows green border on left side
- Browser console shows: `Card reordered: [card] to position [index]`
- Card moves to new position (but will re-sort on next render)

**If It Doesn't Work:**
- Check if cursor changes to "grab" hand on hover
- Check browser console for errors
- Verify you're on desktop (not mobile/tablet)

## Common Issues & Solutions

### Issue: Debug Panel Not Visible
**Solution:** Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: "Selected Card" Stays "None"
**Possible Causes:**
1. onClick handler not firing
2. onCardSelect callback not working
3. State not updating

**Check:** Browser console for "Card selected:" message

### Issue: Timer Active = "No" During DISCARD Phase
**Possible Causes:**
1. Player type is not "HUMAN"
2. Game phase detection is wrong

**Check:** Debug panel values for Player Type and Game Phase

### Issue: Timer Active = "Yes" But No Timer Visible
**Possible Causes:**
1. CSS styling issue
2. Component rendering but hidden
3. Z-index problem

**Check:** Browser DevTools Elements tab - search for "turn-timer" class

## What to Share If Issues Persist

Please provide:
1. Screenshot of the game showing the debug panel
2. Browser console output (F12 → Console tab)
3. What happens when you click a card
4. What phase the game is in (from debug panel)

## Browser Console Commands

Open console (F12) and try these:

```javascript
// Check if React is loaded
window.React

// Check Redux store state
// (This won't work unless you expose it, but worth trying)
window.__REDUX_DEVTOOLS_EXTENSION__
```

## Next Steps

Once you've tested and can tell me what the debug panel shows, I can:
1. Fix the specific issue based on the debug info
2. Remove the debug panel once everything works
3. Clean up console.log statements
