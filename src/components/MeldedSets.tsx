import { useState, useEffect } from 'react';
import { Player, Rank } from '../types';
import { CardComponent } from './CardComponent';
import './MeldedSets.css';
import './animations.css';

interface MeldedSetsProps {
  players: Player[];
}

/**
 * MeldedSets component - Display all players' melded combinations
 * Requirements: 6.5, 17.1, 17.5
 */
export function MeldedSets({ players }: MeldedSetsProps) {
  const meldedPlayers = players.filter(p => p.hasMelded);
  const [newlyMeldedCards, setNewlyMeldedCards] = useState<Set<string>>(new Set());
  const [previousMeldCount, setPreviousMeldCount] = useState(0);

  // Track newly melded cards for animation
  useEffect(() => {
    const currentMeldCount = meldedPlayers.reduce((sum, p) => sum + p.meldedCombinations.length, 0);
    
    if (currentMeldCount > previousMeldCount) {
      // New melds added - collect all card IDs from new combinations
      const allCardIds = new Set<string>();
      meldedPlayers.forEach(player => {
        player.meldedCombinations.forEach(combo => {
          combo.cards.forEach(card => allCardIds.add(card.id));
        });
      });
      
      setNewlyMeldedCards(allCardIds);
      
      // Clear animation after it completes
      const timer = setTimeout(() => {
        setNewlyMeldedCards(new Set());
      }, 600);
      
      return () => clearTimeout(timer);
    }
    
    setPreviousMeldCount(currentMeldCount);
  }, [meldedPlayers, previousMeldCount]);

  if (meldedPlayers.length === 0) {
    return (
      <div className="melded-sets">
        <div className="no-melds">No players have melded yet</div>
      </div>
    );
  }

  // Check if a sequence can be extended (has room at start or end)
  const isExtendable = (combination: any): boolean => {
    if (combination.type !== 'SEQUENCE') return false;
    
    // A sequence is extendable if it doesn't start with 2 or end with Ace
    const cards = combination.cards;
    const firstCard = cards[0];
    const lastCard = cards[cards.length - 1];
    
    // Check if sequence can be extended at the start (not starting with 2)
    const canExtendStart = firstCard.rank !== Rank.TWO && firstCard.rank !== Rank.ACE;
    
    // Check if sequence can be extended at the end (not ending with Ace or King)
    const canExtendEnd = lastCard.rank !== Rank.ACE && lastCard.rank !== Rank.KING;
    
    return canExtendStart || canExtendEnd;
  };

  // Check if a combination has Jokers
  const hasJokers = (combination: any): boolean => {
    return combination.cards.some((card: any) => card.rank === Rank.JOKER);
  };

  return (
    <div className="melded-sets">
      <h3 className="melded-sets-title">Melded Combinations</h3>
      
      <div className="melded-players">
        {meldedPlayers.map(player => (
          <div key={player.id} className="player-melds">
            <div className="player-melds-header">
              <span className="player-melds-name">{player.name}</span>
              <span className="melds-count">
                {player.meldedCombinations.length} set{player.meldedCombinations.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="combinations-list">
              {player.meldedCombinations.map(combination => (
                <div 
                  key={combination.id} 
                  className={`combination ${combination.type.toLowerCase()} ${isExtendable(combination) ? 'extendable' : ''}`}
                >
                  <div className="combination-header">
                    <span className="combination-type">
                      {combination.type === 'TRIPLET' ? '3 of a Kind' : 'Sequence'}
                    </span>
                    {hasJokers(combination) && combination.type === 'SEQUENCE' && (
                      <span className="joker-badge">🃏 Swappable</span>
                    )}
                    {isExtendable(combination) && (
                      <span className="extendable-badge">+ Extendable</span>
                    )}
                  </div>
                  
                  <div className="combination-cards">
                    {combination.cards.map(card => (
                      <div key={card.id} className="combination-card">
                        <CardComponent 
                          card={card} 
                          size="small"
                          animationClass={newlyMeldedCards.has(card.id) ? 'card-appear-melded' : ''}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
