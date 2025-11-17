# Comprehensive Fix Plan

## Issues to Fix

### 1. 🔴 CRITICAL: Game Controls Not Connected
**Problem:** Cannot discard cards or play the game
**Root Cause:** GameControls.tsx has placeholder console.log() instead of Redux actions

### 2. ⭐ ENHANCEMENT: Meld Grouping with Labels
**Problem:** No way to label combinations as "Triplet 1", "Triplet 2", "Sequence 1", etc.
**Solution:** Add labeling system to MeldDialog

## Implementation Plan

### Phase 1: Fix Critical Game Controls (Priority 1)

**Files to Update:**
1. `src/components/GameControls.tsx` - Connect Redux actions
2. `src/components/GameBoard.tsx` - Add card selection state management
3. `src/components/PlayerHand.tsx` - Export selected cards to parent

**Changes:**

#### GameControls.tsx
```typescript
// Add imports
import { useDispatch } from 'react-redux';
import { 
  drawFromDrawPile, 
  drawFromDiscardPile, 
  discardCard,
  setPhase 
} from '../store/gameSlice';
import { 
  addCardToHand, 
  removeCardFromHand,
  setPlayerMelded 
} from '../store/playersSlice';

// Replace console.log with actual actions
const dispatch = useDispatch();

const handleDrawFromDrawPile = () => {
  if (!validActions.canDrawFromDrawPile) return;
  const topCard = drawPile[0]; // Get from selector
  dispatch(drawFromDrawPile());
  dispatch(addCardToHand({ playerId: currentPlayer.id, card: topCard }));
};

const handleDiscard = () => {
  if (!validActions.canDiscard || !selectedCardId) return;
  const cardToDiscard = currentPlayer.hand.find(c => c.id === selectedCardId);
  if (cardToDiscard) {
    dispatch(removeCardFromHand({ playerId: currentPlayer.id, cardId: selectedCardId }));
    dispatch(discardCard(cardToDiscard));
  }
};
```

#### GameBoard.tsx
```typescript
// Add card selection state
const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

// Pass to PlayerHand
<PlayerHand 
  cards={currentPlayer.hand} 
  playerId={currentPlayer.id}
  playerName={currentPlayer.name}
  selectedCardId={selectedCardId}
  onCardSelect={setSelectedCardId}
/>

// Pass to GameControls
<GameControls selectedCardId={selectedCardId} />
```

#### PlayerHand.tsx
```typescript
// Add props
interface PlayerHandProps {
  cards: Card[];
  playerId: string;
  playerName: string;
  selectedCardId?: string | null;
  onCardSelect?: (cardId: string | null) => void;
}

// Update handleCardClick
const handleCardClick = (cardId: string) => {
  if (onCardSelect) {
    // Single selection for discard
    onCardSelect(selectedCardId === cardId ? null : cardId);
  }
};
```

### Phase 2: Add Meld Grouping Labels (Priority 2)

**Files to Update:**
1. `src/components/MeldDialog.tsx` - Add labeling system
2. `src/components/MeldDialog.css` - Style labels

**Changes:**

#### MeldDialog.tsx Enhancement
```typescript
interface CombinationBuilder {
  id: string;
  type: 'TRIPLET' | 'SEQUENCE' | null;
  cards: Card[];
  label?: string; // NEW: User-defined label
}

// Add label input
const [customLabel, setCustomLabel] = useState('');

// Auto-generate labels
const generateLabel = (type: 'TRIPLET' | 'SEQUENCE') => {
  const existingOfType = combinations.filter(c => c.type === type).length;
  return `${type === 'TRIPLET' ? 'Triplet' : 'Sequence'} ${existingOfType + 1}`;
};

// In handleAddCombination
const label = customLabel || generateLabel(currentBuilder.type!);
setCombinations(prev => [...prev, { ...currentBuilder, label }]);
setCustomLabel(''); // Reset

// UI Addition
<div className="label-input">
  <label>Label (optional):</label>
  <input 
    type="text"
    value={customLabel}
    onChange={(e) => setCustomLabel(e.target.value)}
    placeholder={currentBuilder.type ? generateLabel(currentBuilder.type) : 'e.g., Triplet 1'}
    maxLength={20}
  />
</div>

// Display labels in combinations list
<div className="combination-header">
  <span className="combination-label">{combo.label || combo.type}</span>
  <span className="combination-type-badge">{combo.type}</span>
  <button onClick={() => handleRemoveCombination(combo.id)}>Remove</button>
</div>
```

## Testing Checklist

### After Phase 1 (Critical Fix):
- [ ] Can draw from draw pile
- [ ] Can draw from discard pile
- [ ] Can select a card in hand
- [ ] Can discard selected card
- [ ] Turn advances after discard
- [ ] AI players take turns
- [ ] Can complete a full round

### After Phase 2 (Meld Labels):
- [ ] Can create triplet with auto-label "Triplet 1"
- [ ] Can create sequence with auto-label "Sequence 1"
- [ ] Can create second triplet labeled "Triplet 2"
- [ ] Can provide custom label "My Special Triplet"
- [ ] Labels display correctly in combinations list
- [ ] Labels persist through meld confirmation
- [ ] Labels show in melded sets on game board

## Deployment Steps

1. **Implement fixes locally**
2. **Test thoroughly** (all checklist items)
3. **Commit changes:**
   ```bash
   git add .
   git commit -m "Fix: Connect game controls and add meld labeling"
   git push
   ```
4. **Netlify auto-deploys** (2-3 minutes)
5. **Test on live site**

## Estimated Time

- Phase 1 (Critical): 20-30 minutes
- Phase 2 (Enhancement): 15-20 minutes
- Testing: 15-20 minutes
- **Total: 50-70 minutes**

## Priority

1. **CRITICAL**: Phase 1 - Game is unplayable without this
2. **HIGH**: Phase 2 - Greatly improves user experience

Let's start with Phase 1 to make the game playable!

