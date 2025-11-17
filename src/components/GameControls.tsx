import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectValidActions, selectGamePhase, selectCurrentPlayer } from '../store/selectors';
import { GamePhase } from '../types';
import { useKeyboardNavigation, getShortcutText } from '../hooks/useKeyboardNavigation';
import { KeyboardHelp } from './KeyboardHelp';
import './GameControls.css';
import './VisualFeedback.css';
import '../styles/accessibility.css';

/**
 * GameControls component - Action buttons for game play with keyboard navigation
 * Requirements: 4.3, 4.5, 6.1, 12.1, 14.1, 7.3, 7.5
 */
export function GameControls() {
  const validActions = useSelector(selectValidActions);
  const gamePhase = useSelector(selectGamePhase);
  const currentPlayer = useSelector(selectCurrentPlayer);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  if (!currentPlayer) {
    return null;
  }

  const handleDrawFromDrawPile = () => {
    if (!validActions.canDrawFromDrawPile) return;
    // This will be implemented when connecting to game logic
    console.log('Draw from draw pile');
  };

  const handleDrawFromDiscardPile = () => {
    if (!validActions.canDrawFromDiscardPile) return;
    // This will be implemented when connecting to game logic
    console.log('Draw from discard pile');
  };

  const handleDiscard = () => {
    if (!validActions.canDiscard) return;
    // This will be implemented when connecting to game logic
    console.log('Discard card');
  };

  const handleMeld = () => {
    if (!validActions.canMeld) return;
    // This will be implemented when connecting to game logic
    console.log('Meld combinations');
  };

  const handleBuy = () => {
    if (!validActions.canBuy) return;
    // This will be implemented when connecting to game logic
    console.log('Buy card');
  };

  const handleGoOut = () => {
    if (!validActions.canGoOut) return;
    // This will be implemented when connecting to game logic
    console.log('Go out');
  };

  const handleSwapJoker = () => {
    if (!validActions.canSwapJoker) return;
    console.log('Swap Joker');
  };

  const handleExtendSequence = () => {
    if (!validActions.canExtendSequence) return;
    console.log('Extend Sequence');
  };

  // Set up keyboard navigation
  useKeyboardNavigation({
    onDrawFromPile: validActions.canDrawFromDrawPile ? handleDrawFromDrawPile : undefined,
    onDrawFromDiscard: validActions.canDrawFromDiscardPile ? handleDrawFromDiscardPile : undefined,
    onDiscard: validActions.canDiscard ? handleDiscard : undefined,
    onMeld: validActions.canMeld ? handleMeld : undefined,
    onBuy: validActions.canBuy ? handleBuy : undefined,
    onGoOut: validActions.canGoOut ? handleGoOut : undefined,
    onSwapJoker: validActions.canSwapJoker ? handleSwapJoker : undefined,
    onExtendSequence: validActions.canExtendSequence ? handleExtendSequence : undefined,
    onHelp: () => setShowKeyboardHelp(true)
  });

  const getPhaseMessage = (): string => {
    switch (gamePhase) {
      case GamePhase.DRAW:
        return 'Draw a card from the draw pile or discard pile';
      case GamePhase.MELD:
        return 'You can meld your combinations or skip to discard';
      case GamePhase.DISCARD:
        return 'Select a card from your hand to discard';
      case GamePhase.BUY_WINDOW:
        return 'Waiting for buy actions...';
      case GamePhase.ROUND_END:
        return 'Round ended';
      case GamePhase.GAME_END:
        return 'Game over';
      default:
        return 'Waiting...';
    }
  };

  return (
    <div className="game-controls">
      <div className="phase-indicator">
        <span className="phase-label">Current Phase:</span>
        <span className="phase-message">{getPhaseMessage()}</span>
        <button 
          className="keyboard-help-btn"
          onClick={() => setShowKeyboardHelp(true)}
          aria-label="Show keyboard shortcuts"
          title="Keyboard shortcuts (Press ?)"
        >
          <span aria-hidden="true">⌨️</span> Shortcuts
        </button>
      </div>

      <KeyboardHelp 
        isOpen={showKeyboardHelp} 
        onClose={() => setShowKeyboardHelp(false)} 
      />

      <div className="controls-buttons">
        {/* Draw Phase Buttons */}
        {gamePhase === GamePhase.DRAW && (
          <div className="button-group">
            <button
              className="control-btn draw-btn button-hover"
              onClick={handleDrawFromDrawPile}
              disabled={!validActions.canDrawFromDrawPile}
              aria-label="Draw card from draw pile (Press D)"
            >
              <span className="btn-icon" aria-hidden="true">🎴</span>
              <span className="btn-text">Draw from Pile</span>
              <span className="keyboard-hint" aria-hidden="true">{getShortcutText('drawFromPile')}</span>
            </button>
            <button
              className="control-btn draw-discard-btn button-hover"
              onClick={handleDrawFromDiscardPile}
              disabled={!validActions.canDrawFromDiscardPile}
              aria-label="Draw card from discard pile (Press R)"
            >
              <span className="btn-icon" aria-hidden="true">♻️</span>
              <span className="btn-text">Draw from Discard</span>
              <span className="keyboard-hint" aria-hidden="true">{getShortcutText('drawFromDiscard')}</span>
            </button>
          </div>
        )}

        {/* Meld Phase Buttons */}
        {gamePhase === GamePhase.MELD && (
          <div className="button-group">
            <button
              className="control-btn meld-btn button-hover"
              onClick={handleMeld}
              disabled={!validActions.canMeld}
              aria-label="Meld combinations (Press M)"
            >
              <span className="btn-icon" aria-hidden="true">📋</span>
              <span className="btn-text">Meld Combinations</span>
              <span className="keyboard-hint" aria-hidden="true">{getShortcutText('meld')}</span>
            </button>
            <button
              className="control-btn skip-btn button-hover"
              onClick={handleDiscard}
              disabled={!validActions.canDiscard}
              aria-label="Skip to discard phase (Press X)"
            >
              <span className="btn-icon" aria-hidden="true">⏭️</span>
              <span className="btn-text">Skip to Discard</span>
              <span className="keyboard-hint" aria-hidden="true">{getShortcutText('discard')}</span>
            </button>
          </div>
        )}

        {/* Discard Phase Buttons */}
        {gamePhase === GamePhase.DISCARD && (
          <div className="button-group">
            {validActions.canGoOut ? (
              <button
                className="control-btn go-out-btn button-hover"
                onClick={handleGoOut}
                aria-label="Go out and end the round (Press G)"
              >
                <span className="btn-icon" aria-hidden="true">🎯</span>
                <span className="btn-text">Go Out!</span>
                <span className="keyboard-hint" aria-hidden="true">{getShortcutText('goOut')}</span>
              </button>
            ) : (
              <button
                className="control-btn discard-btn button-hover"
                onClick={handleDiscard}
                disabled={!validActions.canDiscard}
                aria-label="Discard selected card (Press X)"
              >
                <span className="btn-icon" aria-hidden="true">🗑️</span>
                <span className="btn-text">Discard Card</span>
                <span className="keyboard-hint" aria-hidden="true">{getShortcutText('discard')}</span>
              </button>
            )}
          </div>
        )}

        {/* Buy Window Buttons */}
        {gamePhase === GamePhase.BUY_WINDOW && (
          <div className="button-group">
            <button
              className="control-btn buy-btn button-hover"
              onClick={handleBuy}
              disabled={!validActions.canBuy}
              aria-label="Buy card from discard pile (Press B)"
            >
              <span className="btn-icon" aria-hidden="true">💰</span>
              <span className="btn-text">Buy Card</span>
              <span className="keyboard-hint" aria-hidden="true">{getShortcutText('buy')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Additional Actions (available after melding) */}
      {currentPlayer.hasMelded && gamePhase === GamePhase.DISCARD && (
        <div className="additional-actions">
          <div className="actions-label">Additional Actions:</div>
          <div className="button-group">
            <button
              className="control-btn secondary-btn button-hover"
              onClick={handleSwapJoker}
              disabled={!validActions.canSwapJoker}
              aria-label="Swap Joker from melded sequence (Press J)"
            >
              <span className="btn-icon" aria-hidden="true">🃏</span>
              <span className="btn-text">Swap Joker</span>
              <span className="keyboard-hint" aria-hidden="true">{getShortcutText('swapJoker')}</span>
            </button>
            <button
              className="control-btn secondary-btn button-hover"
              onClick={handleExtendSequence}
              disabled={!validActions.canExtendSequence}
              aria-label="Extend melded sequence (Press E)"
            >
              <span className="btn-icon" aria-hidden="true">➕</span>
              <span className="btn-text">Extend Sequence</span>
              <span className="keyboard-hint" aria-hidden="true">{getShortcutText('extendSequence')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
