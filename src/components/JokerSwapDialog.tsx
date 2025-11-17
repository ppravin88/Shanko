import { useState, useEffect } from 'react';
import { Card, Combination, Rank } from '../types';
import { ValidationEngine } from '../engines/ValidationEngine';
import { CardComponent } from './CardComponent';
import './JokerSwapDialog.css';

interface JokerSwapDialogProps {
  isOpen: boolean;
  playerHand: Card[];
  allMeldedCombinations: Combination[];
  onConfirm: (combinationId: string, jokerCard: Card, replacementCard: Card) => void;
  onCancel: () => void;
}

interface SwapOption {
  combination: Combination;
  jokerCard: Card;
  jokerIndex: number;
}

/**
 * JokerSwapDialog component - Interface for swapping Jokers from melded sequences
 * Requirements: 17.1, 17.2, 17.3, 17.4
 */
export function JokerSwapDialog({
  isOpen,
  playerHand,
  allMeldedCombinations,
  onConfirm,
  onCancel
}: JokerSwapDialogProps) {
  const [selectedSwapOption, setSelectedSwapOption] = useState<SwapOption | null>(null);
  const [selectedReplacementCard, setSelectedReplacementCard] = useState<Card | null>(null);
  const [validationError, setValidationError] = useState<string>('');

  useEffect(() => {
    if (!isOpen) {
      setSelectedSwapOption(null);
      setSelectedReplacementCard(null);
      setValidationError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Find all sequences with Jokers (excluding triplets)
  const swapOptions: SwapOption[] = [];
  allMeldedCombinations.forEach(combo => {
    if (combo.type === 'SEQUENCE') {
      combo.cards.forEach((card, index) => {
        if (card.rank === Rank.JOKER) {
          swapOptions.push({
            combination: combo,
            jokerCard: card,
            jokerIndex: index
          });
        }
      });
    }
  });

  // Get cards from hand that could potentially replace a Joker
  const potentialReplacementCards = playerHand.filter(card => card.rank !== Rank.JOKER);

  const handleSelectSwapOption = (option: SwapOption) => {
    setSelectedSwapOption(option);
    setSelectedReplacementCard(null);
    setValidationError('');
  };

  const handleSelectReplacementCard = (card: Card) => {
    setSelectedReplacementCard(card);
    setValidationError('');

    // Validate the swap in real-time
    if (selectedSwapOption) {
      const isValid = ValidationEngine.canSwapJoker(
        selectedSwapOption.combination,
        selectedSwapOption.jokerCard,
        card
      );

      if (!isValid) {
        setValidationError(
          'This card cannot replace the Joker. It must match the position in the sequence.'
        );
      }
    }
  };

  const handleConfirm = () => {
    if (!selectedSwapOption || !selectedReplacementCard) {
      setValidationError('Please select a Joker to swap and a replacement card');
      return;
    }

    // Final validation
    const isValid = ValidationEngine.canSwapJoker(
      selectedSwapOption.combination,
      selectedSwapOption.jokerCard,
      selectedReplacementCard
    );

    if (!isValid) {
      setValidationError('Invalid swap: The replacement card does not fit in the sequence');
      return;
    }

    onConfirm(
      selectedSwapOption.combination.id,
      selectedSwapOption.jokerCard,
      selectedReplacementCard
    );
  };

  const canConfirm = selectedSwapOption && selectedReplacementCard && !validationError;

  return (
    <div className="joker-swap-dialog-overlay">
      <div className="joker-swap-dialog">
        <div className="joker-swap-dialog-header">
          <h2>Swap Joker</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <div className="joker-swap-dialog-content">
          {/* Instructions */}
          <div className="instructions-box">
            <p>
              Select a Joker from a melded sequence, then choose a card from your hand to replace it.
              The replacement card must match the specific position the Joker occupies in the sequence.
            </p>
            <p className="note">
              <strong>Note:</strong> Jokers in triplets cannot be swapped.
            </p>
          </div>

          {swapOptions.length === 0 ? (
            <div className="no-options-message">
              <p>No Jokers available to swap in melded sequences.</p>
            </div>
          ) : (
            <>
              {/* Available Jokers to Swap */}
              <div className="swap-options-section">
                <h3>Select Joker to Swap ({swapOptions.length} available):</h3>
                <div className="swap-options-list">
                  {swapOptions.map((option, index) => {
                    const ownerName = allMeldedCombinations.find(
                      c => c.id === option.combination.id
                    )?.playerId || 'Unknown';
                    
                    return (
                      <div
                        key={`${option.combination.id}-${index}`}
                        className={`swap-option ${
                          selectedSwapOption?.combination.id === option.combination.id &&
                          selectedSwapOption?.jokerIndex === option.jokerIndex
                            ? 'selected'
                            : ''
                        }`}
                        onClick={() => handleSelectSwapOption(option)}
                      >
                        <div className="option-header">
                          <span className="option-label">Sequence (Player: {ownerName})</span>
                        </div>
                        <div className="option-cards">
                          {option.combination.cards.map((card, cardIndex) => (
                            <div
                              key={card.id}
                              className={`card-wrapper ${
                                cardIndex === option.jokerIndex ? 'joker-highlight' : ''
                              }`}
                            >
                              <CardComponent card={card} size="small" />
                              {cardIndex === option.jokerIndex && (
                                <div className="joker-indicator">Swap This</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Replacement Card Selection */}
              {selectedSwapOption && (
                <div className="replacement-section">
                  <h3>Select Replacement Card from Your Hand:</h3>
                  {potentialReplacementCards.length === 0 ? (
                    <p className="empty-message">No cards available in your hand to swap</p>
                  ) : (
                    <div className="replacement-cards">
                      {potentialReplacementCards.map(card => (
                        <div
                          key={card.id}
                          className={`replacement-card ${
                            selectedReplacementCard?.id === card.id ? 'selected' : ''
                          }`}
                          onClick={() => handleSelectReplacementCard(card)}
                        >
                          <CardComponent card={card} size="small" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Validation Feedback */}
              {validationError && (
                <div className="validation-error">
                  {validationError}
                </div>
              )}

              {selectedSwapOption && selectedReplacementCard && !validationError && (
                <div className="validation-success">
                  ✓ Valid swap! The Joker will be added to your hand.
                </div>
              )}
            </>
          )}
        </div>

        <div className="joker-swap-dialog-footer">
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="confirm-btn"
            onClick={handleConfirm}
            disabled={!canConfirm || swapOptions.length === 0}
          >
            Confirm Swap
          </button>
        </div>
      </div>
    </div>
  );
}
