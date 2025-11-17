/**
 * Game Settings Component
 * UI for adjusting game preferences
 * Requirements: 18.5
 */

import { useState } from 'react';
import { useGameSettings, AnimationSpeed, AITurnDelay } from '../contexts/GameSettingsContext';
import './GameSettings.css';

export function GameSettings() {
  const { settings, updateSettings, resetSettings } = useGameSettings();
  const [isOpen, setIsOpen] = useState(false);

  const handleAnimationSpeedChange = (speed: AnimationSpeed) => {
    updateSettings({ animationSpeed: speed });
  };

  const handleSoundToggle = () => {
    updateSettings({ soundEffectsEnabled: !settings.soundEffectsEnabled });
  };

  const handleAIDelayChange = (delay: AITurnDelay) => {
    updateSettings({ aiTurnDelay: delay });
  };

  const handleCardAnimationsToggle = () => {
    updateSettings({ showCardAnimations: !settings.showCardAnimations });
  };

  const handleAutoSortToggle = () => {
    updateSettings({ autoSortHand: !settings.autoSortHand });
  };

  const handleReset = () => {
    if (confirm('Reset all settings to defaults?')) {
      resetSettings();
    }
  };

  return (
    <div className="game-settings">
      <button
        className="settings-toggle touch-target"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Game settings"
        aria-expanded={isOpen}
      >
        <span className="settings-icon">⚙️</span>
        Settings
      </button>

      {isOpen && (
        <div className="settings-panel" role="dialog" aria-label="Game settings">
          <div className="settings-header">
            <h3>Game Settings</h3>
            <button
              className="close-btn touch-target"
              onClick={() => setIsOpen(false)}
              aria-label="Close settings"
            >
              ✕
            </button>
          </div>

          <div className="settings-content">
            {/* Animation Speed */}
            <div className="setting-group">
              <label htmlFor="animation-speed">Animation Speed</label>
              <div className="setting-options" role="radiogroup" aria-labelledby="animation-speed">
                {(['slow', 'normal', 'fast', 'instant'] as AnimationSpeed[]).map(speed => (
                  <button
                    key={speed}
                    className={`option-btn touch-target ${settings.animationSpeed === speed ? 'active' : ''}`}
                    onClick={() => handleAnimationSpeedChange(speed)}
                    role="radio"
                    aria-checked={settings.animationSpeed === speed}
                  >
                    {speed.charAt(0).toUpperCase() + speed.slice(1)}
                  </button>
                ))}
              </div>
              <p className="setting-description">
                Controls how fast cards move and animations play
              </p>
            </div>

            {/* Card Animations Toggle */}
            <div className="setting-group">
              <label htmlFor="card-animations">
                <input
                  type="checkbox"
                  id="card-animations"
                  checked={settings.showCardAnimations}
                  onChange={handleCardAnimationsToggle}
                />
                Show Card Animations
              </label>
              <p className="setting-description">
                Enable or disable card dealing and movement animations
              </p>
            </div>

            {/* Sound Effects Toggle */}
            <div className="setting-group">
              <label htmlFor="sound-effects">
                <input
                  type="checkbox"
                  id="sound-effects"
                  checked={settings.soundEffectsEnabled}
                  onChange={handleSoundToggle}
                  disabled={true}
                />
                Sound Effects <span className="badge">Coming Soon</span>
              </label>
              <p className="setting-description">
                Play sound effects for card actions (not yet implemented)
              </p>
            </div>

            {/* AI Turn Delay */}
            <div className="setting-group">
              <label htmlFor="ai-delay">AI Turn Delay</label>
              <div className="setting-options" role="radiogroup" aria-labelledby="ai-delay">
                {(['none', 'short', 'normal', 'long'] as AITurnDelay[]).map(delay => (
                  <button
                    key={delay}
                    className={`option-btn touch-target ${settings.aiTurnDelay === delay ? 'active' : ''}`}
                    onClick={() => handleAIDelayChange(delay)}
                    role="radio"
                    aria-checked={settings.aiTurnDelay === delay}
                  >
                    {delay.charAt(0).toUpperCase() + delay.slice(1)}
                  </button>
                ))}
              </div>
              <p className="setting-description">
                How long to wait before AI players take their turn
              </p>
            </div>

            {/* Auto Sort Hand */}
            <div className="setting-group">
              <label htmlFor="auto-sort">
                <input
                  type="checkbox"
                  id="auto-sort"
                  checked={settings.autoSortHand}
                  onChange={handleAutoSortToggle}
                />
                Auto-Sort Hand
              </label>
              <p className="setting-description">
                Automatically sort cards by suit and rank
              </p>
            </div>

            {/* Reset Button */}
            <div className="setting-group">
              <button
                className="reset-btn touch-target"
                onClick={handleReset}
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
