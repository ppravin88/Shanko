import { useState } from 'react';
import './GameSetup.css';

interface GameSetupProps {
  onStartGame: (playerCount: number, humanPlayers: number) => void;
}

/**
 * GameSetup component for configuring and starting a new game
 * Requirements: 1.1, 1.2, 18.1
 */
export function GameSetup({ onStartGame }: GameSetupProps) {
  const [playerCount, setPlayerCount] = useState(4);
  const [humanPlayers, setHumanPlayers] = useState(1);

  // Calculate deck count based on player count (Requirement 1.3-1.6)
  const getDeckCount = (players: number): number => {
    if (players <= 4) return 2;
    if (players <= 6) return 3;
    return 4;
  };

  const deckCount = getDeckCount(playerCount);
  const totalCards = deckCount * 56; // 52 standard + 4 Jokers per deck

  const handleStartGame = () => {
    onStartGame(playerCount, humanPlayers);
  };

  return (
    <div className="game-setup" role="region" aria-labelledby="setup-heading">
      <h2 id="setup-heading">Game Setup</h2>
      
      <div className="setup-section">
        <label htmlFor="player-count">Number of Players (2-8):</label>
        <div 
          className="player-count-selector" 
          role="group" 
          aria-labelledby="player-count"
          aria-label="Select number of players"
        >
          {[2, 3, 4, 5, 6, 7, 8].map(count => (
            <button
              key={count}
              className={`count-button ${playerCount === count ? 'selected' : ''}`}
              onClick={() => {
                setPlayerCount(count);
                // Ensure human players doesn't exceed total players
                if (humanPlayers > count) {
                  setHumanPlayers(count);
                }
              }}
              aria-label={`${count} players`}
              aria-pressed={playerCount === count}
            >
              {count}
            </button>
          ))}
        </div>
      </div>

      <div className="setup-section">
        <label htmlFor="human-players">Human Players:</label>
        <div 
          className="human-players-selector"
          role="group"
          aria-labelledby="human-players"
          aria-label="Select number of human players"
        >
          {Array.from({ length: playerCount + 1 }, (_, i) => i).map(count => (
            <button
              key={count}
              className={`count-button ${humanPlayers === count ? 'selected' : ''}`}
              onClick={() => setHumanPlayers(count)}
              aria-label={`${count} human player${count !== 1 ? 's' : ''}`}
              aria-pressed={humanPlayers === count}
            >
              {count}
            </button>
          ))}
        </div>
        <p className="helper-text" aria-live="polite">
          AI Players: {playerCount - humanPlayers}
        </p>
      </div>

      <div className="setup-info" role="region" aria-label="Game configuration summary">
        <div className="info-item">
          <span className="info-label">Decks:</span>
          <span className="info-value" aria-label={`${deckCount} decks will be used`}>{deckCount}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Total Cards:</span>
          <span className="info-value" aria-label={`${totalCards} total cards`}>{totalCards}</span>
        </div>
        <div className="info-item">
          <span className="info-label">Cards per Player:</span>
          <span className="info-value" aria-label="11 cards per player">11</span>
        </div>
      </div>

      <button 
        className="start-button" 
        onClick={handleStartGame}
        aria-label={`Start game with ${playerCount} players (${humanPlayers} human, ${playerCount - humanPlayers} AI)`}
      >
        Start Game
      </button>
    </div>
  );
}
