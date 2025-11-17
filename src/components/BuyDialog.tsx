import { Card, Player } from '../types';
import { CardComponent } from './CardComponent';
import './BuyDialog.css';

interface BuyDialogProps {
  isOpen: boolean;
  cardToBuy: Card | null;
  currentPlayer: Player;
  buyPriorityOrder: Player[];
  onConfirm: () => void;
  onDecline: () => void;
}

/**
 * BuyDialog component - Interface for buying cards from discard pile
 * Requirements: 12.1, 12.5, 13.5, 16.1, 16.2
 */
export function BuyDialog({
  isOpen,
  cardToBuy,
  currentPlayer,
  buyPriorityOrder,
  onConfirm,
  onDecline
}: BuyDialogProps) {
  if (!isOpen || !cardToBuy) return null;

  const canBuy = currentPlayer.buysRemaining > 0 && !currentPlayer.hasMelded;
  const playerPriorityIndex = buyPriorityOrder.findIndex(p => p.id === currentPlayer.id);
  const isFirstInPriority = playerPriorityIndex === 0;

  return (
    <div className="buy-dialog-overlay">
      <div className="buy-dialog">
        <div className="buy-dialog-header">
          <h2>Buy Card Opportunity</h2>
        </div>

        <div className="buy-dialog-content">
          {/* Card Being Bought */}
          <div className="card-display">
            <h3>Card Available:</h3>
            <div className="card-showcase">
              <CardComponent card={cardToBuy} size="large" />
            </div>
          </div>

          {/* Player Info */}
          <div className="player-info">
            <div className="info-row">
              <span className="info-label">Your Buys Remaining:</span>
              <span className="info-value">{currentPlayer.buysRemaining} / 3</span>
            </div>
            <div className="info-row">
              <span className="info-label">Melded:</span>
              <span className="info-value">{currentPlayer.hasMelded ? 'Yes' : 'No'}</span>
            </div>
          </div>

          {/* Buy Priority Order */}
          <div className="priority-section">
            <h3>Buy Priority Order:</h3>
            <div className="priority-list">
              {buyPriorityOrder.map((player, index) => (
                <div
                  key={player.id}
                  className={`priority-item ${player.id === currentPlayer.id ? 'current-player' : ''} ${
                    index === 0 ? 'first-priority' : ''
                  }`}
                >
                  <span className="priority-number">{index + 1}</span>
                  <span className="priority-name">{player.name}</span>
                  {player.id === currentPlayer.id && (
                    <span className="priority-badge">You</span>
                  )}
                  {index === 0 && (
                    <span className="priority-badge first">First</span>
                  )}
                  <span className="priority-buys">{player.buysRemaining} buys left</span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="instructions">
            {!canBuy && currentPlayer.hasMelded && (
              <p className="warning-message">
                ⚠️ You cannot buy cards after melding
              </p>
            )}
            {!canBuy && currentPlayer.buysRemaining === 0 && !currentPlayer.hasMelded && (
              <p className="warning-message">
                ⚠️ You have no buys remaining this round
              </p>
            )}
            {canBuy && !isFirstInPriority && (
              <p className="info-message">
                ℹ️ You must ask players with higher priority if they want to buy first
              </p>
            )}
            {canBuy && isFirstInPriority && (
              <p className="success-message">
                ✓ You have first priority to buy this card!
              </p>
            )}
          </div>

          {/* Buy Action Info */}
          {canBuy && (
            <div className="buy-action-info">
              <h4>Buying this card will:</h4>
              <ul>
                <li>Add the discarded card to your hand</li>
                <li>Draw 1 card from the draw pile (placed face-down on discard)</li>
                <li>Add both cards to your hand (2 cards total)</li>
                <li>Use 1 of your {currentPlayer.buysRemaining} remaining buys</li>
              </ul>
            </div>
          )}
        </div>

        <div className="buy-dialog-footer">
          <button className="decline-btn" onClick={onDecline}>
            {canBuy ? 'Decline' : 'Close'}
          </button>
          {canBuy && (
            <button className="confirm-btn" onClick={onConfirm}>
              Buy Card
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
