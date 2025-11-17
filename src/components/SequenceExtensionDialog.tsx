import { useState, useEffect } from 'react';
import { Card, Combination, Sequence } from '../types';
import { ValidationEngine } from '../engines/ValidationEngine';
import { CardComponent } from './CardComponent';
import './SequenceExtensionDialog.css';

interface SequenceExtensionDialogProps {
  isOpen: boolean;
  playerHand: Card[];
  allMeldedCombinations: Combination[];
  onConfirm: (combinationId: string, cards: Card[], position: 'START' | 'END') => void;
  onCancel: () => void;
}

/**
 * SequenceExtensionDialog component - Interface for extending melded sequences
 * Requirements: 17.5, 17.6
 */
export function SequenceExtensionDialog({
  isOpen,
  playerHand,
  allMeldedCombinations,
  onConfirm,
  onCancel
}: SequenceExtensionDialogProps) {
  const [selectedSequence, setSelectedSequence] = useState<Sequence | null>(null);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [extensionPosition, setExtensionPosition] = useState<'START' | 'END'>('END');
  const [validationError, setValidationError] = useState<string>('');

  useEffect(() => {
    if (!isOpen) {
      setSelectedSequence(null);
      setSelectedCards(new Set());
      setExtensionPosition('END');
      setValidationError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Get all melded sequences (exclude triplets)
  const meldedSequences = allMeldedCombinations.filter(
    combo => combo.type === 'SEQUENCE'
  ) as Sequence[];

  const handleSelectSequence = (sequence: Sequence) => {
    setSelectedSequence(sequence);
    setSelectedCards(new Set());
    setValidationError('');
  };

  const handleCardClick = (card: Card) => {
    const newSelected = new Set(selectedCards);
    if (newSelected.has(card.id)) {
      newSelected.delete(card.id);
    } else {
      newSelected.add(card.id);
    }
    setSelectedCards(newSelected);
    setValidationError('');

    // Validate in real-time if we have a sequence selected
    if (selectedSequence && newSelected.size > 0) {
      const cardsToExtend = playerHand.filter(c => newSelected.has(c.id));
      const isValid = ValidationEngine.canExtendSequence(
        selectedSequence,
        cardsToExtend,
        extensionPosition
      );

      if (!isValid) {
        setValidationError(
          `Cannot extend sequence at ${extensionPosition.toLowerCase()}. Cards must form consecutive ranks in the same suit.`
        );
      }
    }
  };

  const handlePositionChange = (position: 'START' | 'END') => {
    setExtensionPosition(position);
    setValidationError('');

    // Re-validate with new position
    if (selectedSequence && selectedCards.size > 0) {
      const cardsToExtend = playerHand.filter(c => selectedCards.has(c.id));
      const isValid = ValidationEngine.canExtendSequence(
        selectedSequence,
        cardsToExtend,
        position
      );

      if (!isValid) {
        setValidationError(
          `Cannot extend sequence at ${position.toLowerCase()}. Cards must form consecutive ranks in the same suit.`
        );
      }
    }
  };

  const handleConfirm = () => {
    if (!selectedSequence) {
      setValidationError('Please select a sequence to extend');
      return;
    }

    if (selectedCards.size === 0) {
      setValidationError('Please select cards to extend the sequence');
      return;
    }

    const cardsToExtend = playerHand.filter(c => selectedCards.has(c.id));

    // Final validation
    const isValid = ValidationEngine.canExtendSequence(
      selectedSequence,
      cardsToExtend,
      extensionPosition
    );

    if (!isValid) {
      setValidationError('Invalid extension: Cards do not form a valid consecutive sequence');
      return;
    }

    onConfirm(selectedSequence.id, cardsToExtend, extensionPosition);
  };

  const selectedCardsArray = playerHand.filter(c => selectedCards.has(c.id));
  const canConfirm = selectedSequence && selectedCards.size > 0 && !validationError;

  return (
    <div className="sequence-extension-dialog-overlay">
      <div className="sequence-extension-dialog">
        <div className="sequence-extension-dialog-header">
          <h2>Extend Sequence</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <div className="sequence-extension-dialog-content">
          {/* Instructions */}
          <div className="instructions-box">
            <p>
              Select a melded sequence to extend, then choose cards from your hand to add to it.
              Cards can be added to the beginning or end of the sequence.
            </p>
          </div>

          {meldedSequences.length === 0 ? (
            <div className="no-sequences-message">
              <p>No melded sequences available to extend.</p>
            </div>
          ) : (
            <>
              {/* Available Sequences */}
              <div className="sequences-section">
                <h3>Select Sequence to Extend ({meldedSequences.length} available):</h3>
                <div className="sequences-list">
                  {meldedSequences.map(sequence => {
                    const ownerName = sequence.playerId || 'Unknown';
                    
                    return (
                      <div
                        key={sequence.id}
                        className={`sequence-option ${
                          selectedSequence?.id === sequence.id ? 'selected' : ''
                        }`}
                        onClick={() => handleSelectSequence(sequence)}
                      >
                        <div className="sequence-header">
                          <span className="sequence-label">Sequence (Player: {ownerName})</span>
                          <span className="sequence-count">{sequence.cards.length} cards</span>
                        </div>
                        <div className="sequence-cards">
                          {sequence.cards.map(card => (
                            <CardComponent key={card.id} card={card} size="small" />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Extension Controls */}
              {selectedSequence && (
                <>
                  <div className="extension-controls">
                    <h3>Extension Position:</h3>
                    <div className="position-selector">
                      <button
                        className={`position-btn ${extensionPosition === 'START' ? 'active' : ''}`}
                        onClick={() => handlePositionChange('START')}
                      >
                        <span className="position-icon">⬅️</span>
                        <span>Add to Start</span>
                      </button>
                      <button
                        className={`position-btn ${extensionPosition === 'END' ? 'active' : ''}`}
                        onClick={() => handlePositionChange('END')}
                      >
                        <span>Add to End</span>
                        <span className="position-icon">➡️</span>
                      </button>
                    </div>
                  </div>

                  {/* Preview */}
                  {selectedCards.size > 0 && (
                    <div className="extension-preview">
                      <h3>Preview Extended Sequence:</h3>
                      <div className="preview-cards">
                        {extensionPosition === 'START' && (
                          <>
                            {selectedCardsArray.map(card => (
                              <CardComponent key={card.id} card={card} size="small" />
                            ))}
                            <div className="preview-separator">+</div>
                          </>
                        )}
                        {selectedSequence.cards.map(card => (
                          <CardComponent key={card.id} card={card} size="small" />
                        ))}
                        {extensionPosition === 'END' && (
                          <>
                            <div className="preview-separator">+</div>
                            {selectedCardsArray.map(card => (
                              <CardComponent key={card.id} card={card} size="small" />
                            ))}
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Card Selection */}
                  <div className="card-selection">
                    <h3>Select Cards from Your Hand ({selectedCards.size} selected):</h3>
                    <div className="hand-cards">
                      {playerHand.length === 0 ? (
                        <p className="empty-message">No cards in hand</p>
                      ) : (
                        playerHand.map(card => (
                          <div
                            key={card.id}
                            className={`hand-card ${selectedCards.has(card.id) ? 'selected' : ''}`}
                            onClick={() => handleCardClick(card)}
                          >
                            <CardComponent card={card} size="small" />
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Validation Feedback */}
              {validationError && (
                <div className="validation-error">
                  {validationError}
                </div>
              )}

              {selectedSequence && selectedCards.size > 0 && !validationError && (
                <div className="validation-success">
                  ✓ Valid extension! The sequence will be extended with {selectedCards.size} card(s).
                </div>
              )}
            </>
          )}
        </div>

        <div className="sequence-extension-dialog-footer">
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="confirm-btn"
            onClick={handleConfirm}
            disabled={!canConfirm || meldedSequences.length === 0}
          >
            Confirm Extension
          </button>
        </div>
      </div>
    </div>
  );
}
