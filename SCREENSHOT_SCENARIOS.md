# Screenshot Capture Scenarios for Shanko

This document provides specific game scenarios to set up for capturing marketing screenshots.

## Quick Reference Checklist

- [ ] Screenshot 1: Game Setup (4 players, 2 human, 2 AI)
- [ ] Screenshot 2: Early Round Gameplay (Round 1-2, player's turn)
- [ ] Screenshot 3: Meld Dialog (valid combinations ready)
- [ ] Screenshot 4: Late Round Gameplay (Round 5-7, multiple melds visible)
- [ ] Screenshot 5: Buy Dialog (showing buy priority)
- [ ] Screenshot 6: Joker Swap Dialog (sequence with Joker)
- [ ] Screenshot 7: Sequence Extension Dialog (extending melded sequence)
- [ ] Screenshot 8: Round End Screen (showing scores)
- [ ] Screenshot 9: Game Over Screen (after 7 rounds)
- [ ] Screenshot 10: Mobile Portrait View
- [ ] Screenshot 11: Tablet Landscape View
- [ ] Screenshot 12: Tutorial Mode
- [ ] Screenshot 13: Accessibility Features
- [ ] Screenshot 14: Game Settings Panel

## Detailed Scenarios

### Screenshot 1: Game Setup Screen

**Objective:** Show the welcoming, easy-to-use setup interface

**Setup Steps:**
1. Open the game (fresh load)
2. Configure the following:
   - Player count: 4
   - Player 1: Human, name "Alex"
   - Player 2: Human, name "Jordan"
   - Player 3: AI (Medium), name "AI Bot 1"
   - Player 4: AI (Easy), name "AI Bot 2"
3. Don't click "Start Game" yet

**What to Capture:**
- Full setup screen
- All player configuration options visible
- Deck count indicator showing "2 decks (112 cards)"
- Start Game button prominent

**Viewport:** 1920x1080 (desktop)
**Filename:** `screenshot-01-game-setup.png`

---

### Screenshot 2: Early Round Gameplay

**Objective:** Show basic gameplay with clear UI elements

**Setup Steps:**
1. Start a 4-player game (2 human, 2 AI)
2. Play through Round 1 until you have:
   - A hand with 10-11 cards
   - At least 2-3 cards in the discard pile
   - Your turn (so buttons are active)
   - Some cards that could potentially form combinations

**Ideal Hand Composition:**
- A few cards of the same rank (potential triplet)
- A few cards in sequence (potential sequence)
- Mix of suits for visual variety

**What to Capture:**
- Player hand at bottom (cards clearly visible)
- Draw pile (left) and discard pile (right)
- Score board showing all 4 players
- Round indicator: "Round 1: 2 Triplets"
- Active game controls (Draw, Meld, Discard buttons)
- Current player indicator highlighting you

**Viewport:** 1920x1080 (desktop)
**Filename:** `screenshot-02-gameplay-early-round.png`

---

### Screenshot 3: Meld Dialog

**Objective:** Demonstrate the combination builder with valid sets

**Setup Steps:**
1. During Round 2 (1 Triplet + 1 Sequence), collect:
   - 3 cards of the same rank (e.g., three 7s)
   - 4 consecutive cards of the same suit (e.g., 5♥ 6♥ 7♥ 8♥)
2. Click "Meld" button
3. In the dialog, arrange:
   - Top row: The triplet (3 cards)
   - Bottom row: The sequence (4 cards)
4. Ensure both show green validation indicators

**What to Capture:**
- Meld dialog overlay (centered)
- Your remaining hand at bottom
- Combination builder area with cards arranged
- Green checkmarks or borders indicating valid combinations
- Round objective: "Round 2: 1 Triplet + 1 Sequence"
- Card count: "7 cards required, 7 cards placed"
- Confirm and Cancel buttons

**Viewport:** 1920x1080 (desktop)
**Filename:** `screenshot-03-meld-dialog.png`

---

### Screenshot 4: Late Round Gameplay

**Objective:** Show game complexity with multiple melded sets

**Setup Steps:**
1. Advance to Round 5, 6, or 7
2. Ensure at least 2-3 players have melded
3. Capture when:
   - Multiple melded combinations are visible
   - Your hand has 10-12 cards
   - Scores have accumulated (50-150 points range)
   - It's your turn

**What to Capture:**
- Multiple melded sets from different players
- Each set labeled with player name
- Mix of triplets and sequences visible
- Player hand with more cards
- Round indicator: "Round 6: 2 Sequences + 1 Triplet"
- Score board with accumulated scores
- Melded status indicators on score board

**Viewport:** 1920x1080 (desktop)
**Filename:** `screenshot-04-gameplay-late-round.png`

---

### Screenshot 5: Buy Dialog

**Objective:** Show the unique buying mechanic

**Setup Steps:**
1. During a 4-player game (buying enabled)
2. Wait for another player to discard
3. Immediately click "Buy" button
4. Capture the buy confirmation dialog

**What to Capture:**
- Buy dialog overlay
- The discarded card being bought (large and clear)
- "Buys remaining: 2/3" indicator
- Buy priority information (if multiple players want it)
- Confirm and Decline buttons
- Brief explanation text: "You'll receive this card plus one from the draw pile"

**Viewport:** 1920x1080 (desktop)
**Filename:** `screenshot-05-buy-dialog.png`

---

### Screenshot 6: Joker Swap Dialog

**Objective:** Demonstrate Joker swapping feature

**Setup Steps:**
1. After melding, have a sequence with a Joker
   - Example: 5♦ JOKER 7♦ 8♦ (Joker representing 6♦)
2. Acquire the actual card (6♦ in this example)
3. Click on the melded sequence
4. Select "Swap Joker" option
5. Select the Joker and the replacement card

**What to Capture:**
- Joker swap dialog
- Original sequence with Joker highlighted
- Replacement card from hand highlighted
- Preview of sequence after swap
- Validation message: "Valid swap - Joker will be added to your hand"
- Confirm and Cancel buttons

**Viewport:** 1920x1080 (desktop)
**Filename:** `screenshot-06-joker-swap-dialog.png`

---

### Screenshot 7: Sequence Extension Dialog

**Objective:** Show sequence extension mechanic

**Setup Steps:**
1. After melding, have a sequence that can be extended
   - Example: Melded sequence is 5♠ 6♠ 7♠ 8♠
2. Acquire cards that extend it (4♠ or 9♠ or both)
3. Click on the melded sequence
4. Select "Extend Sequence" option
5. Select the card(s) to add

**What to Capture:**
- Extension dialog
- Original sequence displayed
- Cards being added (highlighted)
- Position indicator: "Extending at START" or "Extending at END"
- Preview of extended sequence
- Confirm and Cancel buttons

**Viewport:** 1920x1080 (desktop)
**Filename:** `screenshot-07-sequence-extension-dialog.png`

---

### Screenshot 8: Round End Screen

**Objective:** Show scoring and round completion

**Setup Steps:**
1. Play through a round until someone goes out
2. Wait for round end dialog to appear automatically
3. Ensure the dialog shows:
   - Winner announcement
   - All players' remaining cards (revealed)
   - Points calculated for each player
   - Cumulative scores updated

**What to Capture:**
- Round end dialog (full screen overlay)
- Winner announcement with celebration icon
- All 4 players' hands revealed
- Point calculation for each card
- Round scores: "Alex: 0, Jordan: 45, AI Bot 1: 32, AI Bot 2: 58"
- Cumulative scores updated
- "Next Round" button

**Viewport:** 1920x1080 (desktop)
**Filename:** `screenshot-08-round-end.png`

---

### Screenshot 9: Game Over Screen

**Objective:** Show final results and winner

**Setup Steps:**
1. Complete all 7 rounds (or use dev tools to skip)
2. Wait for game over screen
3. Ensure it shows:
   - Clear winner announcement
   - Final scores for all players
   - Round-by-round breakdown

**What to Capture:**
- Game over screen (full screen)
- Trophy or celebration graphic
- Winner announcement: "Alex Wins!"
- Final scores table:
  - Alex: 245 (winner)
  - Jordan: 312
  - AI Bot 1: 289
  - AI Bot 2: 356
- Round-by-round score breakdown (7 columns)
- "New Game" and "View Statistics" buttons

**Viewport:** 1920x1080 (desktop)
**Filename:** `screenshot-09-game-over.png`

---

### Screenshot 10: Mobile Portrait View

**Objective:** Demonstrate mobile responsiveness

**Setup Steps:**
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select "iPhone 12 Pro" or similar (390x844)
4. Ensure portrait orientation
5. Navigate to game board during active gameplay

**What to Capture:**
- Full mobile view (portrait)
- Responsive layout with cards stacked vertically
- Touch-friendly buttons (larger)
- Readable card sizes
- All UI elements accessible without scrolling
- Score board adapted for mobile

**Viewport:** 390x844 (iPhone 12 Pro portrait)
**Filename:** `screenshot-10-mobile-portrait.png`

---

### Screenshot 11: Tablet Landscape View

**Objective:** Show tablet optimization

**Setup Steps:**
1. In DevTools device toolbar
2. Select "iPad" (1024x768)
3. Landscape orientation
4. Navigate to game board

**What to Capture:**
- Tablet-optimized layout
- Proper use of screen real estate
- Cards sized appropriately for tablet
- Touch-friendly controls
- Landscape-specific layout adjustments

**Viewport:** 1024x768 (iPad landscape)
**Filename:** `screenshot-11-tablet-landscape.png`

---

### Screenshot 12: Tutorial Mode

**Objective:** Show the interactive tutorial

**Setup Steps:**
1. Start a new game
2. Click "Tutorial" or "How to Play" button
3. Navigate to a tutorial step that shows:
   - Instructions overlay
   - Highlighted UI element
   - Step indicator

**What to Capture:**
- Tutorial overlay with instructions
- Highlighted game element (with spotlight effect)
- Step indicator: "Step 3 of 10"
- Tutorial text explaining the feature
- "Next", "Previous", and "Skip Tutorial" buttons
- Dimmed background showing game board

**Viewport:** 1920x1080 (desktop)
**Filename:** `screenshot-12-tutorial-mode.png`

---

### Screenshot 13: Accessibility Features

**Objective:** Highlight accessibility support

**Setup Steps:**
1. Open game settings
2. Navigate to Accessibility section
3. Enable some accessibility features
4. Press '?' key to open keyboard shortcuts help

**What to Capture:**
- Keyboard shortcuts overlay showing:
  - Arrow keys: Navigate cards
  - Space: Select/deselect card
  - Enter: Confirm action
  - Esc: Cancel/close dialog
  - Tab: Navigate UI elements
  - ?: Show this help
- Accessibility settings panel showing:
  - Color-blind mode toggle
  - High contrast mode
  - Screen reader announcements
  - Keyboard navigation enabled
  - Focus indicators

**Viewport:** 1920x1080 (desktop)
**Filename:** `screenshot-13-accessibility-features.png`

---

### Screenshot 14: Game Settings Panel

**Objective:** Show customization options

**Setup Steps:**
1. Click settings icon (gear icon)
2. Open settings panel
3. Ensure all options are visible

**What to Capture:**
- Settings panel overlay
- Animation speed slider (set to medium)
- Sound effects toggle (on)
- AI turn delay slider (set to 1.5s)
- Accessibility options section
- Visual theme selector (if available)
- "Save" and "Cancel" buttons

**Viewport:** 1920x1080 (desktop)
**Filename:** `screenshot-14-game-settings.png`

---

## Capture Techniques

### Method 1: Browser DevTools (Recommended)

```
1. Open game in Chrome/Firefox
2. Press F12 to open DevTools
3. Press Ctrl+Shift+M for device toolbar
4. Set custom dimensions (1920x1080)
5. Click ⋮ menu → Capture screenshot
6. Screenshot saves automatically
```

### Method 2: Windows Snipping Tool

```
1. Press Win + Shift + S
2. Select area to capture
3. Screenshot copied to clipboard
4. Paste into image editor
5. Save as PNG
```

### Method 3: Mac Screenshot

```
1. Press Cmd + Shift + 4
2. Drag to select area
3. Screenshot saved to desktop
4. Rename and organize
```

## Post-Processing Checklist

For each screenshot:

- [ ] Correct resolution (1920x1080 for desktop, etc.)
- [ ] No browser UI visible
- [ ] All text is readable
- [ ] Colors are accurate
- [ ] No visual glitches
- [ ] File size < 500KB
- [ ] Proper filename
- [ ] Saved in correct folder

## Optional Annotations

Consider adding annotations to highlight features:

1. **Arrows**: Point to key UI elements
2. **Circles**: Highlight important features
3. **Text labels**: Explain what's happening
4. **Numbers**: Show sequence of actions

**Tools for annotations:**
- Snagit
- Skitch
- Photoshop
- GIMP
- Canva

## Organization

Save screenshots in this structure:

```
screenshots/
├── desktop/
│   ├── screenshot-01-game-setup.png
│   ├── screenshot-02-gameplay-early-round.png
│   └── ...
├── mobile/
│   └── screenshot-10-mobile-portrait.png
├── tablet/
│   └── screenshot-11-tablet-landscape.png
└── annotated/
    └── (annotated versions)
```

## Quality Standards

All screenshots must meet these standards:

✅ **Resolution**: Correct for device type
✅ **Format**: PNG (lossless)
✅ **Clarity**: Sharp, no blur
✅ **Composition**: Key elements visible
✅ **Lighting**: Consistent colors
✅ **Size**: Optimized (<500KB)
✅ **Naming**: Descriptive filename

## Usage Guidelines

### Where to Use These Screenshots

1. **Website Hero Section**: Screenshot 2 or 4
2. **Feature Showcase**: Screenshots 3, 5, 6, 7
3. **Mobile Section**: Screenshots 10, 11
4. **Tutorial Section**: Screenshot 12
5. **Accessibility Section**: Screenshot 13
6. **Social Media**: Any gameplay screenshot
7. **Press Kit**: All screenshots
8. **Documentation**: Relevant screenshots

### Image Optimization

Before publishing:

1. **Compress**: Use TinyPNG or ImageOptim
2. **Resize**: Create thumbnail versions
3. **Format**: Consider WebP for web
4. **Alt text**: Write descriptive alt text for accessibility

## Troubleshooting

**Problem**: Blurry screenshots
**Solution**: Ensure browser zoom is 100%, use DevTools capture

**Problem**: UI elements cut off
**Solution**: Increase viewport size, ensure all elements visible

**Problem**: Inconsistent colors
**Solution**: Use same browser and settings for all captures

**Problem**: Large file sizes
**Solution**: Use PNG compression tools, crop unnecessary areas

## Timeline

Estimated time to capture all screenshots:

- Setup and preparation: 15 minutes
- Capturing 14 screenshots: 60-90 minutes
- Post-processing and optimization: 30 minutes
- **Total**: 2-2.5 hours

## Next Steps

After capturing screenshots:

1. ✅ Review all screenshots for quality
2. ✅ Optimize file sizes
3. ✅ Create thumbnail versions
4. ✅ Write alt text for each
5. ✅ Upload to website/press kit
6. ✅ Share on social media
7. ✅ Include in documentation

---

*Good luck capturing great screenshots! 📸*
