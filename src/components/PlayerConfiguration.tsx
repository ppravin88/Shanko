import { useState } from 'react';
import './PlayerConfiguration.css';

export type AIDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export interface PlayerConfig {
  name: string;
  type: 'HUMAN' | 'AI';
  difficulty?: AIDifficulty;
}

interface PlayerConfigurationProps {
  playerCount: number;
  humanPlayers: number;
  onConfigComplete: (configs: PlayerConfig[]) => void;
  onBack: () => void;
}

/**
 * PlayerConfiguration component for setting player names and AI difficulty
 * Requirements: 1.1, 1.2, 18.1
 */
export function PlayerConfiguration({
  playerCount,
  humanPlayers,
  onConfigComplete,
  onBack
}: PlayerConfigurationProps) {
  // Initialize player configurations
  const [playerConfigs, setPlayerConfigs] = useState<PlayerConfig[]>(() => {
    const configs: PlayerConfig[] = [];
    for (let i = 0; i < playerCount; i++) {
      if (i < humanPlayers) {
        configs.push({
          name: `Player ${i + 1}`,
          type: 'HUMAN'
        });
      } else {
        configs.push({
          name: `AI ${i + 1 - humanPlayers}`,
          type: 'AI',
          difficulty: 'MEDIUM'
        });
      }
    }
    return configs;
  });

  const updatePlayerName = (index: number, name: string) => {
    const updated = [...playerConfigs];
    updated[index] = { ...updated[index], name };
    setPlayerConfigs(updated);
  };

  const updateAIDifficulty = (index: number, difficulty: AIDifficulty) => {
    const updated = [...playerConfigs];
    updated[index] = { ...updated[index], difficulty };
    setPlayerConfigs(updated);
  };

  const handleContinue = () => {
    // Validate that all players have names
    const allNamed = playerConfigs.every(config => config.name.trim().length > 0);
    if (!allNamed) {
      alert('Please provide names for all players');
      return;
    }
    onConfigComplete(playerConfigs);
  };

  return (
    <div className="player-configuration">
      <h2>Configure Players</h2>
      
      <div className="player-list">
        {playerConfigs.map((config, index) => (
          <div key={index} className="player-config-item">
            <div className="player-header">
              <span className="player-number">Player {index + 1}</span>
              <span className={`player-type ${config.type.toLowerCase()}`}>
                {config.type}
              </span>
            </div>
            
            <div className="config-row">
              <label htmlFor={`player-name-${index}`}>Name:</label>
              <input
                id={`player-name-${index}`}
                type="text"
                value={config.name}
                onChange={(e) => updatePlayerName(index, e.target.value)}
                placeholder={config.type === 'HUMAN' ? 'Enter your name' : 'AI name'}
                maxLength={20}
              />
            </div>

            {config.type === 'AI' && (
              <div className="config-row">
                <label>Difficulty:</label>
                <div className="difficulty-selector">
                  {(['EASY', 'MEDIUM', 'HARD'] as AIDifficulty[]).map(diff => (
                    <button
                      key={diff}
                      className={`difficulty-button ${config.difficulty === diff ? 'selected' : ''}`}
                      onClick={() => updateAIDifficulty(index, diff)}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="player-order-preview">
        <h3>Turn Order</h3>
        <div className="order-list">
          {playerConfigs.map((config, index) => (
            <div key={index} className="order-item">
              <span className="order-number">{index + 1}.</span>
              <span className="order-name">{config.name || `Player ${index + 1}`}</span>
              {config.type === 'AI' && (
                <span className="order-difficulty">({config.difficulty})</span>
              )}
            </div>
          ))}
        </div>
        <p className="order-note">
          The youngest player (Player 1) will start Round 1. 
          Starting player rotates clockwise each round.
        </p>
      </div>

      <div className="action-buttons">
        <button className="back-button" onClick={onBack}>
          Back
        </button>
        <button className="continue-button" onClick={handleContinue}>
          Start Game
        </button>
      </div>
    </div>
  );
}
