import { useState, useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store';
import { GameSetup } from './components/GameSetup';
import { PlayerConfiguration, PlayerConfig } from './components/PlayerConfiguration';
import { GameBoard } from './components/GameBoard';
import { ToastContainer } from './components/Toast';
import { AccessibilitySettings } from './components/AccessibilitySettings';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { GameSettingsProvider } from './contexts/GameSettingsContext';
import { GameSettings } from './components/GameSettings';
import { Tutorial } from './components/Tutorial';
import { ResponsiveDebugger } from './components/ResponsiveDebugger';
import { useToast } from './utils/useToast';
import { useViewportHeight } from './hooks/useResponsive';
import { GameEngine } from './engines/GameEngine';
import { initializeGame, startRound } from './store/gameSlice';
import { setPlayers } from './store/playersSlice';
import { initializeAnnouncer } from './utils/screenReaderAnnouncer';
import './App.css';
import './styles/accessibility.css';
import './styles/colorBlindMode.css';

type SetupPhase = 'PLAYER_COUNT' | 'PLAYER_CONFIG' | 'GAME_ACTIVE';

function GameContainer() {
  const dispatch = useDispatch();
  const [setupPhase, setSetupPhase] = useState<SetupPhase>('PLAYER_COUNT');
  const [playerCount, setPlayerCount] = useState(4);
  const [humanPlayers, setHumanPlayers] = useState(1);
  const [showTutorial, setShowTutorial] = useState(false);
  const { toasts, dismissToast } = useToast();
  
  // Initialize viewport height for mobile browsers
  useViewportHeight();

  // Initialize screen reader announcer on mount
  useEffect(() => {
    initializeAnnouncer();
    
    // Check if user has seen tutorial before
    const hasSeenTutorial = localStorage.getItem('shanko-tutorial-completed');
    if (!hasSeenTutorial) {
      setShowTutorial(true);
    }
  }, []);

  const handleGameSetup = (players: number, humans: number) => {
    setPlayerCount(players);
    setHumanPlayers(humans);
    setSetupPhase('PLAYER_CONFIG');
  };

  const handlePlayerConfigComplete = (configs: PlayerConfig[]) => {
    // Initialize game with GameEngine
    const gameState = GameEngine.initializeGame(playerCount, humanPlayers);
    
    // Update player names and AI difficulty from configs
    const updatedPlayers = gameState.players.map((player, index) => ({
      ...player,
      name: configs[index].name,
      type: configs[index].type
      // Note: AI difficulty would be stored separately if needed
    }));

    // Dispatch to Redux store
    dispatch(initializeGame({ ...gameState, players: updatedPlayers }));
    dispatch(setPlayers(updatedPlayers));

    // Start the first round
    const roundState = GameEngine.startRound({ ...gameState, players: updatedPlayers });
    dispatch(startRound({
      drawPile: roundState.drawPile,
      startingPlayerIndex: roundState.startingPlayerIndex
    }));
    
    // Deal cards to players
    roundState.players.forEach(player => {
      dispatch(setPlayers(roundState.players));
    });

    setSetupPhase('GAME_ACTIVE');
  };

  const handleBackToSetup = () => {
    setSetupPhase('PLAYER_COUNT');
  };

  const handleTutorialComplete = () => {
    localStorage.setItem('shanko-tutorial-completed', 'true');
    setShowTutorial(false);
  };

  const handleTutorialSkip = () => {
    localStorage.setItem('shanko-tutorial-completed', 'true');
    setShowTutorial(false);
  };

  const handleShowTutorial = () => {
    setShowTutorial(true);
  };

  return (
    <div className="app" role="application" aria-label="Shanko Card Game">
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>
      
      <GameSettings />
      <AccessibilitySettings />
      <ResponsiveDebugger />
      
      <header role="banner">
        <h1>Shanko Card Game</h1>
      </header>
      
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      
      <main id="main-content" role="main">
        {setupPhase === 'PLAYER_COUNT' && (
          <>
            <GameSetup onStartGame={handleGameSetup} />
            <div className="tutorial-prompt">
              <button 
                className="tutorial-link touch-target"
                onClick={handleShowTutorial}
                aria-label="Show tutorial"
              >
                📚 How to Play
              </button>
            </div>
          </>
        )}
        
        {setupPhase === 'PLAYER_CONFIG' && (
          <PlayerConfiguration
            playerCount={playerCount}
            humanPlayers={humanPlayers}
            onConfigComplete={handlePlayerConfigComplete}
            onBack={handleBackToSetup}
          />
        )}
        
        {setupPhase === 'GAME_ACTIVE' && (
          <GameBoard />
        )}
      </main>
      
      {showTutorial && (
        <Tutorial 
          onComplete={handleTutorialComplete}
          onSkip={handleTutorialSkip}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <GameSettingsProvider>
        <AccessibilityProvider>
          <GameContainer />
        </AccessibilityProvider>
      </GameSettingsProvider>
    </Provider>
  );
}

export default App;
