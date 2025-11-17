import { useState, useEffect } from 'react';
import { Card, Combination, RoundObjective } from '../types';
import { ValidationEngine } from '../engines/ValidationEngine';
import { CardComponent } from './CardComponent';
import './MeldDialog.css';

interface MeldDialogProps {
  isOpen: boolean;
  playerHand: Card[];
  roundObjective: RoundObjective;
  onConfirm: (combinations: Combination[]) => void;
  onCancel: () => void;
}

interface CombinationBuilder {
  id: string;
  type: 'TRIPLET' | 'SEQUENCE' | null;
  cards: Card[];
  label?: string;
}

/**
 * MeldDialog component - Interface for building and validating card combinations
 * Requirements: 6.1, 6.3, 6.4, 6.5
 */
export function MeldDialog({ isOpen, playerHand, roundObjective, onConfirm, onCancel }: MeldDialogProps) {
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [combinations, setCombinations] = useState<CombinationBuilder[]>([]);
  const [currentBuilder, setCurrentBuilder] = useState<CombinationBuilder>({
    id: crypto.randomUUID(),
    type: null,
    cards: [],
    label: ''
  });
  const [validationError, setValidationError] = useState<string>('');
  const [customLabel, setCustomLabel] = useState<string>('');

  useEffect(() => {
    if (!isOpen) {
      // Reset state when dialog closes
      setSelectedCards(new Set());
      setCombinations([]);
      setCurrentBuilder({ id: crypto.randomUUID(), type: null, cards: [], label: '' });
      setValidationError('');
      setCustomLabel('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCardClick = (card: Card) => {
    const newSelected = new Set(selectedCards);
    if (newSelected.has(card.id)) {
      newSelected.delete(card.id);
      // Remove from current builder
      setCurrentBuilder(prev => ({
        ...prev,
        cards: prev.cards.filter(c => c.id !== card.id)
      }));
    } else {
      newSelected.add(card.id);
      // Add to current builder
      setCurrentBuilder(prev => ({
        ...prev,
        cards: [...prev.cards, card]
      }));
    }
    setSelectedCards(newSelected);
    setValidationError('');
  };

  const handleSetType = (type: 'TRIPLET' | 'SEQUENCE') => {
    setCurrentBuilder(prev => ({ ...prev, type }));
    setValidationError('');
  };

  const generateLabel = (type: 'TRIPLET' | 'SEQUENCE'): string => {
    const existingOfType = combinations.filter(c => c.type === type).length;
    return `${type === 'TRIPLET' ? 'Triplet' : 'Sequence'} ${existingOfType + 1}`;
  };

  const handleAddCombination = () => {
    if (!currentBuilder.type) {
      setValidationError('Please select combination type (Triplet or Sequence)');
      return;
    }

    if (currentBuilder.cards.length === 0) {
      setValidationError('Please select cards for the combination');
      return;
    }

    // Validate the combination
    const isValid = currentBuilder.type === 'TRIPLET'
      ? ValidationEngine.isValidTriplet(currentBuilder.cards)
      : ValidationEngine.isValidSequence(currentBuilder.cards);

    if (!isValid) {
      setValidationError(
        currentBuilder.type === 'TRIPLET'
          ? 'Invalid triplet: Must have exactly 3 cards with matching ranks'
          : 'Invalid sequence: Must have at least 4 consecutive cards of the same suit'
      );
      return;
    }

    // Generate label if not provided
    const label = customLabel.trim() || generateLabel(currentBuilder.type!);
    
    // Add to combinations list with label
    setCombinations(prev => [...prev, { ...currentBuilder, label }]);
    
    // Reset builder
    setCurrentBuilder({
      id: crypto.randomUUID(),
      type: null,
      cards: [],
      label: ''
    });
    setCustomLabel('');
    setValidationError('');
  };

  const handleRemoveCombination = (combinationId: string) => {
    const combo = combinations.find(c => c.id === combinationId);
    if (combo) {
      // Return cards to selection
      const newSelected = new Set(selectedCards);
      combo.cards.forEach(card => newSelected.delete(card.id));
      setSelectedCards(newSelected);
    }
    setCombinations(prev => prev.filter(c => c.id !== combinationId));
    setValidationError('');
  };

  const handleConfirm = () => {
    // Convert builders to proper Combinations
    const finalCombinations: Combination[] = combinations.map(builder => ({
      id: builder.id,
      type: builder.type!,
      cards: builder.cards,
      playerId: '' // Will be set by the game engine
    }));

    // Validate against round objective
    const meetsObjective = ValidationEngine.meetsRoundObjective(finalCombinations, roundObjective);
    
    if (!meetsObjective) {
      setValidationError(
        `Does not meet round objective: Need ${roundObjective.triplets} triplet(s) and ${roundObjective.sequences} sequence(s)`
      );
      return;
    }

    onConfirm(finalCombinations);
  };

  const availableCards = playerHand.filter(card => !selectedCards.has(card.id));
  const currentBuilderValid = currentBuilder.type && currentBuilder.cards.length > 0;
  const meetsObjective = ValidationEngine.meetsRoundObjective(
    combinations.map(b => ({ ...b, type: b.type!, playerId: '' })),
    roundObjective
  );

  return (
    <div className="meld-dialog-overlay">
      <div className="meld-dialog">
        <div className="meld-dialog-header">
          <h2>Meld Combinations</h2>
          <button className="close-btn" onClick={onCancel}>×</button>
        </div>

        <div className="meld-dialog-content">
          {/* Round Objective Display */}
          <div className="round-objective-display">
            <h3>Round {roundObjective.round} Objective:</h3>
            <div className="objective-requirements">
              {roundObjective.triplets > 0 && (
                <span className="requirement">
                  {roundObjective.triplets} Triplet{roundObjective.triplets > 1 ? 's' : ''}
                </span>
              )}
              {roundObjective.sequences > 0 && (
                <span className="requirement">
                  {roundObjective.sequences} Sequence{roundObjective.sequences > 1 ? 's' : ''}
                </span>
              )}
              <span className="requirement-total">
                ({roundObjective.totalCards} cards total)
              </span>
            </div>
          </div>

          {/* Current Combinations */}
          <div className="combinations-list">
            <h3>Your Combinations ({combinations.length}):</h3>
            {combinations.length === 0 ? (
              <p className="empty-message">No combinations added yet</p>
            ) : (
              <div className="combinations-grid">
                {combinations.map(combo => (
                  <div key={combo.id} className={`combination-item ${combo.type?.toLowerCase()}`}>
                    <div className="combination-header">
                      <span className="combination-label">{combo.label || combo.type}</span>
                      <span className="combination-type-badge">{combo.type}</span>
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemoveCombination(combo.id)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="combination-cards">
                      {combo.cards.map(card => (
                        <CardComponent key={card.id} card={card} size="small" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Combination Builder */}
          <div className="combination-builder">
            <h3>Build New Combination:</h3>
            
            <div className="builder-type-selector">
              <button
                className={`type-btn ${currentBuilder.type === 'TRIPLET' ? 'active' : ''}`}
                onClick={() => handleSetType('TRIPLET')}
              >
                Triplet (3 cards)
              </button>
              <button
                className={`type-btn ${currentBuilder.type === 'SEQUENCE' ? 'active' : ''}`}
                onClick={() => handleSetType('SEQUENCE')}
              >
                Sequence (4+ cards)
              </button>
            </div>

            <div className="builder-label-input">
              <label htmlFor="combo-label">Label (optional):</label>
              <input
                id="combo-label"
                type="text"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                placeholder={currentBuilder.type ? generateLabel(currentBuilder.type) : 'e.g., My Triplet'}
                maxLength={20}
                className="label-input"
              />
              <small className="label-hint">
                {customLabel.trim() ? `Will be labeled: "${customLabel.trim()}"` : currentBuilder.type ? `Auto-label: "${generateLabel(currentBuilder.type)}"` : 'Select type first'}
              </small>
            </div>

            <div className="builder-cards">
              <h4>Selected Cards ({currentBuilder.cards.length}):</h4>
              <div className="selected-cards-area">
                {currentBuilder.cards.length === 0 ? (
                  <p className="empty-message">Click cards below to add them</p>
                ) : (
                  <div className="cards-row">
                    {currentBuilder.cards.map(card => (
                      <CardComponent 
                        key={card.id} 
                        card={card} 
                        size="small"
                        onClick={() => handleCardClick(card)}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              <button
                className="add-combination-btn"
                onClick={handleAddCombination}
                disabled={!currentBuilderValid}
              >
                Add Combination
              </button>
            </div>
          </div>

          {/* Available Cards */}
          <div className="available-cards">
            <h3>Your Hand ({availableCards.length} cards):</h3>
            <div className="cards-grid">
              {availableCards.map(card => (
                <CardComponent
                  key={card.id}
                  card={card}
                  size="small"
                  onClick={() => handleCardClick(card)}
                  selected={selectedCards.has(card.id)}
                />
              ))}
            </div>
          </div>

          {/* Validation Feedback */}
          {validationError && (
            <div className="validation-error">
              {validationError}
            </div>
          )}

          {combinations.length > 0 && !meetsObjective && (
            <div className="validation-warning">
              ⚠️ Combinations do not meet round objective yet
            </div>
          )}

          {combinations.length > 0 && meetsObjective && (
            <div className="validation-success">
              ✓ Combinations meet round objective!
            </div>
          )}
        </div>

        <div className="meld-dialog-footer">
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button 
            className="confirm-btn" 
            onClick={handleConfirm}
            disabled={combinations.length === 0 || !meetsObjective}
          >
            Confirm Meld
          </button>
        </div>
      </div>
    </div>
  );
}
