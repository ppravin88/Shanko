import { useDispatch, useSelector } from 'react-redux';
import { drawFromDiscardPile } from '../store/gameSlice';
import { addCardToHand } from '../store/playersSlice';
import { selectCurrentPlayer, selectValidActions } from '../store/selectors';
import { Card } from '../types';
import { CardComponent } from './CardComponent';
import './DiscardPile.css';

interface DiscardPileProps {
  topCard: Card | null;
  count: number;
}

/**
 * DiscardPile component - Display discard pile with top card visible
 * Requirements: 1.7, 4.3
 */
export function DiscardPile({ topCard, count }: DiscardPileProps) {
  const dispatch = useDispatch();
  const currentPlayer = useSelector(selectCurrentPlayer);
  const validActions = useSelector(selectValidActions);

  const handleDrawFromDiscard = () => {
    if (!validActions.canDrawFromDiscardPile || !currentPlayer || !topCard) return;

    // Add card to current player's hand
    dispatch(addCardToHand({ playerId: currentPlayer.id, card: topCard }));
    // Remove card from discard pile
    dispatch(drawFromDiscardPile());
  };

  return (
    <div className="discard-pile">
      <div 
        className={`pile-container ${validActions.canDrawFromDiscardPile && topCard ? 'clickable' : 'disabled'}`}
        onClick={handleDrawFromDiscard}
      >
        {topCard ? (
          <>
            <CardComponent card={topCard} size="large" />
            {count > 1 && <div className="pile-stack"></div>}
            {count > 2 && <div className="pile-stack pile-stack-2"></div>}
          </>
        ) : (
          <div className="empty-pile">
            <span>Empty</span>
          </div>
        )}
      </div>
      <div className="pile-label">
        <span className="pile-name">Discard Pile</span>
        <span className="pile-count">{count} cards</span>
      </div>
    </div>
  );
}
