# GameFlowController Usage Guide

The `GameFlowController` orchestrates the game loop and manages the flow of the Shanko card game. It coordinates round initialization, turn progression, phase transitions, and AI turn execution.

## Overview

The GameFlowController provides a high-level API for managing game flow:

- **Round Management**: Initialize rounds, handle transitions, calculate scores
- **Turn Management**: Advance turns, manage phase transitions
- **AI Coordination**: Execute AI turns automatically
- **Buy Window**: Handle buy priority and execution
- **Game End Detection**: Detect when rounds/game complete, determine winners

## Key Methods

### Round Management

#### `initializeRound(state: GameState): GameState`
Initializes a new round by dealing cards and setting up the game state.

```typescript
import { GameFlowController } from './engines/GameFlowController';

// Initialize the first round
let gameState = GameFlowController.initializeRound(gameState);
```

#### `handleRoundTransition(state: GameState): GameState`
Handles the transition from ROUND_END to the next round or GAME_END.

```typescript
// After a round ends
if (GameFlowController.shouldEndRound(gameState)) {
  gameState = GameFlowController.handleRoundTransition(gameState);
}
```

#### `advanceToNextRound(state: GameState): GameState`
Advances to the next round, resetting player states and dealing new cards.

```typescript
// Manually advance to next round
gameState = GameFlowController.advanceToNextRound(gameState);
```

### Turn Management

#### `advanceTurn(state: GameState): GameState`
Advances to the next player's turn (clockwise).

```typescript
// After a player completes their turn
gameState = GameFlowController.advanceTurn(gameState);
```

#### `transitionPhase(state: GameState, newPhase: GamePhase): GameState`
Transitions the game to a new phase.

```typescript
import { GamePhase } from '../types';

// Transition to MELD phase
gameState = GameFlowController.transitionPhase(gameState, GamePhase.MELD);
```

### AI Coordination

#### `executeAITurn(state: GameState): Promise<GameState>`
Executes a complete AI turn (draw, meld, discard).

```typescript
// Execute AI turn
if (GameFlowController.shouldExecuteAITurn(gameState)) {
  gameState = await GameFlowController.executeAITurn(gameState);
}
```

#### `shouldExecuteAITurn(state: GameState): boolean`
Checks if the current player is AI and should execute their turn.

```typescript
// In your game loop
if (GameFlowController.shouldExecuteAITurn(gameState)) {
  // Execute AI turn
  gameState = await GameFlowController.executeAITurn(gameState);
}
```

### Buy Window Management

#### `handleBuyWindow(state: GameState, onBuyAttempt?: callback): Promise<GameState>`
Handles the buy window phase, checking if any players want to buy.

```typescript
// Handle buy window with human player callback
if (GameFlowController.shouldProcessBuyWindow(gameState)) {
  gameState = await GameFlowController.handleBuyWindow(
    gameState,
    async (playerId: string, playerName: string) => {
      // Ask human player if they want to buy
      return await showBuyDialog(playerId, playerName);
    }
  );
}
```

### Starting Player Management

#### `determineStartingPlayer(state: GameState): number`
Determines the starting player index for the current round.

```typescript
// Get starting player for round
const startingPlayerIndex = GameFlowController.determineStartingPlayer(gameState);
```

#### `setStartingPlayer(state: GameState, startingPlayerIndex: number): GameState`
Sets the starting player for the current round.

```typescript
// Set starting player
gameState = GameFlowController.setStartingPlayer(gameState, 0);
```

### Score Management

#### `calculateRoundScores(state: GameState, winnerPlayerId: string): Map<string, number>`
Calculates round scores for all players.

```typescript
// Calculate scores after round ends
const scores = GameFlowController.calculateRoundScores(gameState, winnerId);
```

#### `updateCumulativeScores(state: GameState, roundScores: Map<string, number>): GameState`
Updates cumulative scores for all players.

```typescript
// Update cumulative scores
const scores = GameFlowController.calculateRoundScores(gameState, winnerId);
gameState = GameFlowController.updateCumulativeScores(gameState, scores);
```

### Game End Detection

#### `isGameComplete(state: GameState): boolean`
Checks if all 7 rounds are complete.

```typescript
// Check if game is complete
if (GameFlowController.isGameComplete(gameState)) {
  gameState = GameFlowController.finalizeGame(gameState);
}
```

#### `finalizeGame(state: GameState): GameState`
Calculates the final winner and transitions to GAME_END.

```typescript
// Finalize game after round 7
gameState = GameFlowController.finalizeGame(gameState);
```

#### `getWinner(state: GameState): Player | null`
Gets the game winner.

```typescript
// Get winner
const winner = GameFlowController.getWinner(gameState);
if (winner) {
  console.log(`Winner: ${winner.name} with ${winner.cumulativeScore} points`);
}
```

#### `getFinalStandings(state: GameState): Player[]`
Gets all players sorted by cumulative score.

```typescript
// Get final standings
const standings = GameFlowController.getFinalStandings(gameState);
standings.forEach((player, index) => {
  console.log(`${index + 1}. ${player.name}: ${player.cumulativeScore} points`);
});
```

## Complete Game Loop Example

Here's a complete example of using GameFlowController in a game loop:

```typescript
import { GameFlowController } from './engines/GameFlowController';
import { GameEngine } from './engines/GameEngine';
import { GamePhase } from '../types';

// Initialize game
let gameState = GameEngine.initializeGame(4, 2); // 4 players, 2 human

// Initialize first round
gameState = GameFlowController.initializeRound(gameState);

// Main game loop
while (!GameFlowController.shouldEndGame(gameState)) {
  
  // Check if round should end
  if (GameFlowController.shouldEndRound(gameState)) {
    gameState = GameFlowController.handleRoundTransition(gameState);
    continue;
  }
  
  // Execute AI turn if current player is AI
  if (GameFlowController.shouldExecuteAITurn(gameState)) {
    gameState = await GameFlowController.executeAITurn(gameState);
  }
  
  // Handle buy window
  if (GameFlowController.shouldProcessBuyWindow(gameState)) {
    gameState = await GameFlowController.handleBuyWindow(
      gameState,
      async (playerId, playerName) => {
        // Show buy dialog to human player
        return await showBuyDialog(playerId, playerName);
      }
    );
  }
  
  // Wait for human player input if needed
  if (!GameFlowController.shouldExecuteAITurn(gameState) && 
      gameState.phase !== GamePhase.BUY_WINDOW) {
    // Wait for human player action
    await waitForHumanAction();
  }
}

// Game complete - show final standings
const winner = GameFlowController.getWinner(gameState);
const standings = GameFlowController.getFinalStandings(gameState);

console.log(`Game Over! Winner: ${winner?.name}`);
standings.forEach((player, index) => {
  console.log(`${index + 1}. ${player.name}: ${player.cumulativeScore} points`);
});
```

## Integration with Redux

When using with Redux, dispatch actions to update the store:

```typescript
import { useDispatch, useSelector } from 'react-redux';
import { GameFlowController } from './engines/GameFlowController';
import { setGameState } from './store/gameSlice';
import { selectGameState } from './store/selectors';

function GameComponent() {
  const dispatch = useDispatch();
  const gameState = useSelector(selectGameState);
  
  const handleNextRound = () => {
    const newState = GameFlowController.handleRoundTransition(gameState);
    dispatch(setGameState(newState));
  };
  
  const handleAITurn = async () => {
    if (GameFlowController.shouldExecuteAITurn(gameState)) {
      const newState = await GameFlowController.executeAITurn(gameState);
      dispatch(setGameState(newState));
    }
  };
  
  // ... rest of component
}
```

## Requirements Satisfied

The GameFlowController satisfies the following requirements:

- **4.1, 4.2**: Starting player rotation (youngest in round 1, rotate left each round)
- **5.1, 5.2, 5.3**: Round progression and phase management
- **8.2, 8.3**: Score calculation and cumulative tracking
- **5.5, 8.5**: Game end detection and winner determination
- **13.2**: Player state reset between rounds (buys, melded status)
- **18.1-18.5**: AI turn coordination and execution

## Testing

The GameFlowController includes comprehensive unit tests in `GameFlowController.test.ts`:

```bash
npm test -- GameFlowController.test.ts --run
```

Tests cover:
- Round initialization and starting player rotation
- Turn advancement and phase transitions
- AI turn execution detection
- Buy window processing
- Round and game end detection
- Score calculation and winner determination
