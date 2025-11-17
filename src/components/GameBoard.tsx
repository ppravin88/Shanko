import { useEffect, useMemo, memo, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectGameState, selectPlayers, selectCurrentPlayer, selectRound, selectRoundObjective, selectDrawPile, selectDiscardPile, selectGamePhase } from '../store/selectors';
import { PlayerHand } from './PlayerHand';
import { DrawPile } from './DrawPile';
import { DiscardPile } from './DiscardPile';
import { MeldedSets } from './MeldedSets';
import { ScoreBoard } from './ScoreBoard';
import { GameControls } from './GameControls';
import { TurnTimer } from './TurnTimer';
import { batchPreloadCards } from '../utils/cardPreloader';
import { debounce } from '../utils/performanceOptimization';
import { findLeastUsefulCard } from '../utils/turnTimer';
import { discardCard, completeBuyWindow } from '../store/gameSlice';
import { removeCardFromHand } from '../store/playersSlice';
import { GamePhase } from '../types';
import './GameBoard.css';

/**
 * GameBoard component - Main game layout with card preloading (optimized)
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5
 */
export const GameBoard = memo(function GameBoard() {
  const dispatch = useDispatch();
  
  // Use granular selectors to minimize re-renders
  const round = useSelector(selectRound);
  const roundObjective = useSelector(selectRoundObjective);
  const drawPile = useSelector(selectDrawPile);
  const discardPile = useSelector(selectDiscardPile);
  const players = useSelector(selectPlayers);
  const currentPlayer = useSelector(selectCurrentPlayer);
  const gamePhase = useSelector(selectGamePhase);
  
  // Card selection state for discarding
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  
  // Timer should be active during DISCARD phase for human players
  // Simplified: Show timer for all players during DISCARD (AI moves are instant anyway)
  const isDiscardTimerActive = gamePhase === GamePhase.DISCARD;
  
  // Buy window timer - 5 seconds for all players to decide if they want to buy
  const isBuyTimerActive = gamePhase === GamePhase.BUY_WINDOW;
  
  // Debug logging
  console.log('Timer Debug:', {
    playerType: currentPlayer?.type,
    gamePhase,
    isDiscardTimerActive,
    isBuyTimerActive,
    playerName: currentPlayer?.name
  });
  
  // Handle automatic discard when timer runs out
  const handleDiscardTimeout = useCallback(() => {
    if (!currentPlayer || currentPlayer.hand.length === 0) return;
    
    // Find least useful card to discard
    const cardToDiscard = findLeastUsefulCard(currentPlayer.hand, roundObjective);
    
    // Dispatch discard action
    dispatch(removeCardFromHand({ playerId: currentPlayer.id, cardId: cardToDiscard.id }));
    dispatch(discardCard(cardToDiscard));
    
    // Clear selection
    setSelectedCardId(null);
  }, [currentPlayer, roundObjective, dispatch]);
  
  // Handle buy window timeout - advance to next turn if no one buys
  const handleBuyTimeout = useCallback(() => {
    dispatch(completeBuyWindow());
  }, [dispatch]);

  // Debounced card preloading to avoid excessive calls
  const debouncedPreload = useMemo(
    () => debounce((cards: any[]) => {
      batchPreloadCards(cards).catch(err => {
        console.warn('Card preloading failed:', err);
      });
    }, 500),
    []
  );

  // Preload card artwork when game board mounts or round changes
  useEffect(() => {
    const allCards = [
      ...drawPile,
      ...discardPile,
      ...players.flatMap(p => [...p.hand, ...p.meldedCombinations.flatMap(c => c.cards)])
    ];
    
    // Preload in background without blocking UI (debounced)
    debouncedPreload(allCards);
  }, [round, drawPile.length, discardPile.length, players, debouncedPreload]);

  if (!currentPlayer) {
    return (
      <div className="game-board-loading" role="status" aria-live="polite">
        Loading game...
      </div>
    );
  }

  // Memoize objective text to avoid recalculation
  const objectiveText = useMemo(() => {
    const tripletText = roundObjective.triplets > 0 
      ? `${roundObjective.triplets} Triplet${roundObjective.triplets > 1 ? 's' : ''}` 
      : '';
    const sequenceText = roundObjective.sequences > 0 
      ? `${roundObjective.sequences} Sequence${roundObjective.sequences > 1 ? 's' : ''}` 
      : '';
    const separator = roundObjective.triplets > 0 && roundObjective.sequences > 0 ? ' and ' : '';
    return `${tripletText}${separator}${sequenceText}`;
  }, [roundObjective.triplets, roundObjective.sequences]);

  // Memoize top discard card
  const topDiscardCard = useMemo(() => {
    return discardPile.length > 0 ? discardPile[discardPile.length - 1] : null;
  }, [discardPile.length, discardPile[discardPile.length - 1]?.id]);

  return (
    <div className="game-board" role="region" aria-label="Game board">
      <div className="game-board-header" role="banner">
        <h2 id="round-heading">Shanko - Round {round}</h2>
        <div className="round-objective" role="status" aria-live="polite" aria-label={`Round objective: ${objectiveText}`}>
          <span>Objective: </span>
          {roundObjective.triplets > 0 && (
            <span>{roundObjective.triplets} Triplet{roundObjective.triplets > 1 ? 's' : ''}</span>
          )}
          {roundObjective.triplets > 0 && roundObjective.sequences > 0 && <span> + </span>}
          {roundObjective.sequences > 0 && (
            <span>{roundObjective.sequences} Sequence{roundObjective.sequences > 1 ? 's' : ''}</span>
          )}
        </div>
      </div>

      <div className="game-board-main">
        <aside className="game-board-left" role="complementary" aria-label="Score board">
          <ScoreBoard players={players} currentPlayerId={currentPlayer.id} round={round} />
        </aside>

        <div className="game-board-center">
          <div className="game-area" role="region" aria-label="Card piles and melded sets">
            <div className="piles-area" role="group" aria-label="Draw and discard piles">
              <DrawPile count={drawPile.length} />
              <DiscardPile 
                topCard={topDiscardCard}
                count={discardPile.length}
              />
            </div>

            <div className="melded-area" role="region" aria-label="Melded card combinations">
              <MeldedSets players={players} />
            </div>
          </div>

          <div className="player-area" role="region" aria-label={`${currentPlayer.name}'s hand`}>
            <PlayerHand 
              cards={currentPlayer.hand} 
              playerId={currentPlayer.id}
              playerName={currentPlayer.name}
              selectedCardId={selectedCardId}
              onCardSelect={setSelectedCardId}
            />
          </div>

          <div className="controls-area" role="region" aria-label="Game controls">
            {/* Debug info */}
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '8px', borderRadius: '4px', marginBottom: '8px', fontSize: '12px' }}>
              <div>Selected Card: {selectedCardId || 'None'}</div>
              <div>Game Phase: {gamePhase}</div>
              <div>Player Type: {currentPlayer?.type}</div>
              <div>Discard Timer: {isDiscardTimerActive ? 'Yes' : 'No'}</div>
              <div>Buy Timer: {isBuyTimerActive ? 'Yes' : 'No'}</div>
            </div>
            
            {/* Discard Timer - 30 seconds */}
            {isDiscardTimerActive && (
              <TurnTimer 
                isActive={isDiscardTimerActive}
                onTimeout={handleDiscardTimeout}
              />
            )}
            
            {/* Buy Window Timer - 5 seconds */}
            {isBuyTimerActive && (
              <TurnTimer 
                isActive={isBuyTimerActive}
                onTimeout={handleBuyTimeout}
                duration={5}
              />
            )}
            
            <GameControls selectedCardId={selectedCardId} />
          </div>        </div>
      </div>
    </div>
  );
});
