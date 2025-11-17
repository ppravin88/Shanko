import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GameFlowController } from '../engines/GameFlowController';
import { selectGameState } from '../store/selectors';
import { 
  startRound, 
  advanceTurn, 
  setPhase,
  endRound,
  advanceToNextRound
} from '../store/gameSlice';
import { setPlayers } from '../store/playersSlice';
import { GamePhase } from '../types';

/**
 * Custom hook for managing game flow
 * Integrates GameFlowController with Redux store
 */
export function useGameFlow() {
  const dispatch = useDispatch();
  const gameState = useSelector(selectGameState);

  /**
   * Initialize a new round
   */
  const initializeRound = useCallback(() => {
    const newState = GameFlowController.initializeRound(gameState);
    
    // Update Redux store
    dispatch(startRound({
      drawPile: newState.drawPile,
      startingPlayerIndex: newState.startingPlayerIndex
    }));
    dispatch(setPlayers(newState.players));
    dispatch(setPhase(GamePhase.DRAW));
  }, [gameState, dispatch]);

  /**
   * Advance to next player's turn
   */
  const advanceToNextTurn = useCallback(() => {
    GameFlowController.advanceTurn(gameState);
    dispatch(advanceTurn());
  }, [gameState, dispatch]);

  /**
   * Execute AI turn
   */
  const executeAITurn = useCallback(async () => {
    if (!GameFlowController.shouldExecuteAITurn(gameState)) {
      return;
    }

    try {
      const newState = await GameFlowController.executeAITurn(gameState);
      
      // Update Redux store with new state
      dispatch(setPlayers(newState.players));
      dispatch(setPhase(newState.phase));
      
      // If round ended, handle it
      if (newState.phase === GamePhase.ROUND_END) {
        dispatch(endRound());
      }
    } catch (error) {
      console.error('Error executing AI turn:', error);
    }
  }, [gameState, dispatch]);

  /**
   * Handle round transition
   */
  const handleRoundTransition = useCallback(() => {
    if (!GameFlowController.shouldEndRound(gameState)) {
      return;
    }

    const newState = GameFlowController.handleRoundTransition(gameState);
    
    if (newState.phase === GamePhase.GAME_END) {
      dispatch(setPhase(GamePhase.GAME_END));
    } else {
      dispatch(advanceToNextRound());
      // Initialize the new round
      const roundState = GameFlowController.initializeRound(newState);
      dispatch(startRound({
        drawPile: roundState.drawPile,
        startingPlayerIndex: roundState.startingPlayerIndex
      }));
      dispatch(setPlayers(roundState.players));
    }
  }, [gameState, dispatch]);

  /**
   * Handle buy window
   */
  const handleBuyWindow = useCallback(async (
    onBuyAttempt?: (playerId: string, playerName: string) => Promise<boolean>
  ) => {
    if (!GameFlowController.shouldProcessBuyWindow(gameState)) {
      return;
    }

    const newState = await GameFlowController.handleBuyWindow(gameState, onBuyAttempt);
    
    // Update Redux store
    dispatch(setPlayers(newState.players));
    dispatch(setPhase(newState.phase));
    
    if (newState.currentPlayerIndex !== gameState.currentPlayerIndex) {
      dispatch(advanceTurn());
    }
  }, [gameState, dispatch]);

  /**
   * Auto-execute AI turns when it's their turn
   */
  useEffect(() => {
    if (GameFlowController.shouldExecuteAITurn(gameState)) {
      // Add a small delay for better UX
      const timer = setTimeout(() => {
        executeAITurn();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayerIndex, gameState.phase, executeAITurn]);

  /**
   * Auto-handle buy window
   */
  useEffect(() => {
    if (GameFlowController.shouldProcessBuyWindow(gameState)) {
      // Handle buy window automatically
      handleBuyWindow();
    }
  }, [gameState.phase, handleBuyWindow]);

  return {
    // State checks
    shouldExecuteAITurn: GameFlowController.shouldExecuteAITurn(gameState),
    shouldProcessBuyWindow: GameFlowController.shouldProcessBuyWindow(gameState),
    shouldEndRound: GameFlowController.shouldEndRound(gameState),
    shouldEndGame: GameFlowController.shouldEndGame(gameState),
    isGameComplete: GameFlowController.isGameComplete(gameState),
    
    // Current state
    currentPlayer: GameFlowController.getCurrentPlayer(gameState),
    
    // Actions
    initializeRound,
    advanceToNextTurn,
    executeAITurn,
    handleRoundTransition,
    handleBuyWindow,
    
    // Game end
    getWinner: () => GameFlowController.getWinner(gameState),
    getFinalStandings: () => GameFlowController.getFinalStandings(gameState)
  };
}
