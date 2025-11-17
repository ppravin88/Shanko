# Game Flow Orchestration Implementation

## Overview

Task 13 "Implement game flow orchestration" has been completed. This implementation provides a comprehensive game loop controller that manages all aspects of game flow for the Shanko card game.

## Files Created

### 1. `src/engines/GameFlowController.ts`
The main controller that orchestrates game flow. Provides methods for:
- Round initialization and management
- Turn progression and phase transitions
- AI turn coordination
- Buy window handling
- Starting player rotation
- Score calculation and tracking
- Game end detection

### 2. `src/engines/GameFlowController.test.ts`
Comprehensive unit tests covering all GameFlowController functionality:
- Round initialization
- Starting player rotation
- Turn advancement
- AI turn detection
- Buy window processing
- Round transitions
- Game end detection
- Score calculation
- Winner determination

### 3. `src/hooks/useGameFlow.ts`
React hook that integrates GameFlowController with Redux store:
- Provides easy-to-use interface for React components
- Automatically executes AI turns
- Handles buy window processing
- Manages round transitions
- Updates Redux store with game state changes

### 4. `src/engines/GAME_FLOW_USAGE.md`
Comprehensive usage guide with examples showing:
- How to use each GameFlowController method
- Complete game loop example
- Redux integration patterns
- Requirements satisfied

## Implementation Details

### Subtask 13.1: Game Loop Controller ✅

**Methods Implemented:**
- `initializeRound()` - Initialize a new round with card dealing
- `advanceTurn()` - Progress to next player's turn
- `transitionPhase()` - Manage game phase transitions
- `executeAITurn()` - Coordinate AI turn execution
- `handleBuyWindow()` - Process buy window with priority

**Requirements Satisfied:**
- 4.1, 4.2: Turn progression and starting player
- 5.1, 5.2, 5.3: Round management and phase transitions
- 18.1-18.5: AI turn coordination

### Subtask 13.2: Starting Player Rotation ✅

**Methods Implemented:**
- `determineStartingPlayer()` - Calculate starting player index
- `setStartingPlayer()` - Set starting player for round

**Logic:**
- Round 1: Youngest player (index 0)
- Round 2+: Rotate left (clockwise) from previous starting player
- Wraps around to index 0 after last player

**Requirements Satisfied:**
- 4.1: Youngest player starts Round 1
- 4.2: Rotate starting player left each round

### Subtask 13.3: Round Transitions ✅

**Methods Implemented:**
- `handleRoundTransition()` - Transition from ROUND_END to next round
- `advanceToNextRound()` - Advance round counter and reset states
- `calculateRoundScores()` - Calculate scores for all players
- `updateCumulativeScores()` - Update cumulative scores

**Logic:**
- Calculate round scores (winner gets 0, others get card points)
- Update cumulative scores for all players
- Reset player states (buys, melded status, hands)
- Advance to next round or game end

**Requirements Satisfied:**
- 5.2: Round advancement
- 8.2: Round score calculation
- 8.3: Cumulative score tracking
- 13.2: Reset player states (buys, melded status)

### Subtask 13.4: Game End Detection ✅

**Methods Implemented:**
- `isGameComplete()` - Check if all 7 rounds complete
- `finalizeGame()` - Calculate final winner and transition to GAME_END
- `getWinner()` - Get the game winner
- `getFinalStandings()` - Get all players sorted by score
- `shouldEndGame()` - Check if in GAME_END phase
- `shouldEndRound()` - Check if in ROUND_END phase

**Logic:**
- Detect when round 7 completes
- Calculate final winner (lowest cumulative score)
- Transition to GAME_END phase
- Provide final standings

**Requirements Satisfied:**
- 5.5: Detect all 7 rounds complete
- 8.5: Determine overall winner (lowest score)

## Integration with Existing Code

The GameFlowController integrates seamlessly with existing components:

### With GameEngine
```typescript
// GameFlowController uses GameEngine for core operations
const roundState = GameEngine.startRound(state);
const { state: afterDraw } = GameEngine.drawCard(state, 'DRAW');
```

### With AIEngine
```typescript
// GameFlowController coordinates AI decisions
const drawDecision = AIEngine.decideDraw(state, playerId);
const meldDecision = AIEngine.decideMeld(state, playerId);
```

### With Redux Store
```typescript
// Use the useGameFlow hook in components
const { 
  initializeRound, 
  executeAITurn, 
  handleRoundTransition 
} = useGameFlow();
```

## Usage Example

```typescript
import { GameFlowController } from './engines/GameFlowController';
import { GameEngine } from './engines/GameEngine';

// Initialize game
let gameState = GameEngine.initializeGame(4, 2);

// Initialize first round
gameState = GameFlowController.initializeRound(gameState);

// Game loop
while (!GameFlowController.shouldEndGame(gameState)) {
  // Handle round transitions
  if (GameFlowController.shouldEndRound(gameState)) {
    gameState = GameFlowController.handleRoundTransition(gameState);
    continue;
  }
  
  // Execute AI turns
  if (GameFlowController.shouldExecuteAITurn(gameState)) {
    gameState = await GameFlowController.executeAITurn(gameState);
  }
  
  // Handle buy window
  if (GameFlowController.shouldProcessBuyWindow(gameState)) {
    gameState = await GameFlowController.handleBuyWindow(gameState);
  }
}

// Game complete
const winner = GameFlowController.getWinner(gameState);
console.log(`Winner: ${winner?.name}`);
```

## Testing

Run tests with:
```bash
npm test -- GameFlowController.test.ts --run
```

All tests pass and cover:
- Round initialization and starting player rotation
- Turn advancement and phase transitions
- AI turn execution detection
- Buy window processing
- Round and game end detection
- Score calculation and winner determination

## Requirements Coverage

This implementation satisfies all requirements for task 13:

| Requirement | Description | Status |
|------------|-------------|--------|
| 4.1 | Youngest player starts Round 1 | ✅ |
| 4.2 | Rotate starting player left each round | ✅ |
| 5.1 | Round progression | ✅ |
| 5.2 | Round advancement | ✅ |
| 5.3 | Phase management | ✅ |
| 5.5 | Detect all 7 rounds complete | ✅ |
| 8.2 | Calculate round scores | ✅ |
| 8.3 | Update cumulative scores | ✅ |
| 8.5 | Determine overall winner | ✅ |
| 13.2 | Reset player states between rounds | ✅ |
| 18.1-18.5 | AI turn coordination | ✅ |

## Next Steps

The game flow orchestration is now complete. To use it in your application:

1. Import `GameFlowController` in your game logic
2. Use the `useGameFlow` hook in React components
3. Follow the examples in `GAME_FLOW_USAGE.md`
4. Run tests to verify functionality

The implementation is production-ready and fully tested.
