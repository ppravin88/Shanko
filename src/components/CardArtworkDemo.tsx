import { Rank, Suit } from '../types';
import { CardComponent } from './CardComponent';
import './CardComponent.css';

/**
 * CardArtworkDemo - Demonstration component showing all card designs
 * This component can be used for testing and showcasing the card artwork
 */
export function CardArtworkDemo() {
  const ranks = [
    Rank.TWO, Rank.THREE, Rank.FOUR, Rank.FIVE, Rank.SIX,
    Rank.SEVEN, Rank.EIGHT, Rank.NINE, Rank.TEN,
    Rank.JACK, Rank.QUEEN, Rank.KING, Rank.ACE
  ];
  
  const suits = [Suit.HEARTS, Suit.DIAMONDS, Suit.CLUBS, Suit.SPADES];

  return (
    <div style={{ padding: '20px', background: '#2d5016' }}>
      <h1 style={{ color: 'white', textAlign: 'center' }}>Shanko Card Artwork</h1>
      
      {/* Show all suits */}
      {suits.map(suit => (
        <div key={suit} style={{ marginBottom: '30px' }}>
          <h2 style={{ color: 'white', marginBottom: '10px' }}>{suit}</h2>
          <div style={{ 
            display: 'flex', 
            gap: '10px', 
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {ranks.map(rank => (
              <CardComponent
                key={`${rank}-${suit}`}
                card={{
                  id: `demo-${rank}-${suit}`,
                  rank,
                  suit,
                  deckIndex: 0
                }}
                size="medium"
              />
            ))}
          </div>
        </div>
      ))}
      
      {/* Show Joker */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: 'white', marginBottom: '10px' }}>Joker</h2>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <CardComponent
            card={{
              id: 'demo-joker',
              rank: Rank.JOKER,
              suit: null,
              deckIndex: 0
            }}
            size="medium"
          />
        </div>
      </div>
      
      {/* Show card back */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: 'white', marginBottom: '10px' }}>Card Back</h2>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <CardComponent
            card={{
              id: 'demo-back',
              rank: Rank.ACE,
              suit: Suit.SPADES,
              deckIndex: 0
            }}
            faceDown={true}
            size="medium"
          />
        </div>
      </div>
      
      {/* Show different sizes */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: 'white', marginBottom: '10px' }}>Size Variations</h2>
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          alignItems: 'flex-end',
          justifyContent: 'center'
        }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'white', marginBottom: '5px' }}>Small</p>
            <CardComponent
              card={{
                id: 'demo-size-small',
                rank: Rank.KING,
                suit: Suit.HEARTS,
                deckIndex: 0
              }}
              size="small"
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'white', marginBottom: '5px' }}>Medium</p>
            <CardComponent
              card={{
                id: 'demo-size-medium',
                rank: Rank.KING,
                suit: Suit.HEARTS,
                deckIndex: 0
              }}
              size="medium"
            />
          </div>
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'white', marginBottom: '5px' }}>Large</p>
            <CardComponent
              card={{
                id: 'demo-size-large',
                rank: Rank.KING,
                suit: Suit.HEARTS,
                deckIndex: 0
              }}
              size="large"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
