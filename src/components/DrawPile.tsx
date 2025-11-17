import { useDispatch, useSelector } from 'react-redux';
import { drawFromDrawPile, reshuffleDiscardPile } from '../store/gameSlice';
import { addCardToHand } from '../store/playersSlice';
import { selectCurrentPlayer, selectValidActions, selectDrawPile } from '../store/selectors';
import { CardComponent } from './CardComponent';
import './DrawPile.css';

interface DrawPileProps {
  count: number;
}

/**
 * DrawPile component - Display draw pile with card back
 * Requirements: 1.7, 4.3
 */
export function DrawPile({ count }: DrawPileProps) {
  const dispatch = useDispatch();
  const currentPlayer = useSelector(selectCurrentPlayer);
  const validActions = useSelector(selectValidActions);
  const drawPile = useSelector(selectDrawPile);

  const handleDrawFromPile = () => {
    if (!validActions.canDrawFromDrawPile || !currentPlayer) return;

    // Check if draw pile is empty and needs reshuffling
    if (drawPile.length === 0) {
      dispatch(reshuffleDiscardPile());
    }

    // Get the top card from draw pile
    const topCard = drawPile[0];
    if (topCard) {
      // Add card to current player's hand
      dispatch(addCardToHand({ playerId: currentPlayer.id, card: topCard }));
      // Remove card from draw pile
      dispatch(drawFromDrawPile());
    }
  };

  const dummyCard = {
    id: 'dummy',
    rank: 'A' as any,
    suit: null,
    deckIndex: 0
  };

  return (
    <div className="draw-pile">
      <div 
        className={`pile-container ${validActions.canDrawFromDrawPile ? 'clickable' : 'disabled'}`}
        onClick={handleDrawFromPile}
      >
        {count > 0 ? (
          <>
            <CardComponent card={dummyCard} faceDown={true} size="large" />
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
        <span className="pile-name">Draw Pile</span>
        <span className="pile-count">{count} cards</span>
      </div>
    </div>
  );
}
