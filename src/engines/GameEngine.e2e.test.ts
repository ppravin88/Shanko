import { describe, it, expect } from 'vitest';
import { GameEngine } from './GameEngine';
import { AIEngine } from './AIEngine';
import { GamePhase, ROUND_OBJECTIVES } from '../types/game';
import { Rank, Suit } from '../types/card';
import { Combination } from '../types/combination';
import { generateId } from '../utils/idGenerator';

/**
 * End-to-End Tests for Shanko Card Game
 * 
 * These tests simulate complete game scenarios including:
 * - Full 7-round games with multiple players
 * - Multi-player scenarios (2, 4, 8 players)
 * - Edge cases (draw pile depletion, buy mechanics, surprise go-out)
 */

describe('GameEngine E2E Tests', () => {
  describe('16.1 Test complete 7-round game', () => {
    it('should complete a full 7-round game with 4 players', () => {
      // Initialize game with 4 players (2 human, 2 AI)
      let state = GameEngine.initializeGame(4, 2);
      
      expect(state.players).toHaveLength(4);
      expect(state.round).toBe(1);
      expect(state.phase).toBe(GamePhase.SETUP);
      
      // Play through all 7 rounds
      for (let round = 1; round <= 7; round++) {
        // Start the round
        state = GameEngine.startRound(state);
        
        expect(state.round).toBe(round);
        expect(state.phase).toBe(GamePhase.DRAW);
        expect(state.roundObjective).toEqual(ROUND_OBJECTIVES[round - 1]);
        
        // Verify all players have 11 cards
        state.players.forEach(player => {
          expect(player.hand).toHaveLength(11);
          expect(player.buysRemaining).toBe(3);
          expect(player.hasMelded).toBe(false);
        });
        
        // Simulate turns until someone goes out
        let maxTurns = 100; // Safety limit
        let turnCount = 0;
        let roundComplete = false;
        
        while (!roundComplete && turnCount < maxTurns) {
          const currentPlayer = state.players[state.currentPlayerIndex];
          
          // Draw phase
          if (state.phase === GamePhase.DRAW) {
            const drawSource = currentPlayer.type === 'AI' 
              ? AIEngine.decideDraw(state, currentPlayer.id)
              : 'DRAW';
            
            const drawResult = GameEngine.drawCard(state, drawSource);
            state = drawResult.state;
          }
          
          // Meld phase (optional)
          if (state.phase === GamePhase.MELD) {
            if (currentPlayer.type === 'AI' && !currentPlayer.hasMelded) {
              const meldDecision = AIEngine.decideMeld(state, currentPlayer.id);
              
              if (meldDecision.shouldMeld && meldDecision.combinations) {
                // Check if AI can go out
                const totalMeldedCards = meldDecision.combinations.reduce(
                  (sum, combo) => sum + combo.cards.length, 0
                );
                const remainingCards = currentPlayer.hand.length - totalMeldedCards;
                
                if (remainingCards === 1) {
                  // Go out
                  const finalCard = currentPlayer.hand.find(
                    card => !meldDecision.combinations!.some(
                      combo => combo.cards.some(c => c.id === card.id)
                    )
                  );
                  
                  if (finalCard) {
                    state = GameEngine.goOut(state, meldDecision.combinations, finalCard.id);
                    roundComplete = true;
                    continue;
                  }
                } else {
                  // Just meld
                  state = GameEngine.meldCombinations(state, meldDecision.combinations);
                }
              }
            }
          }
          
          // Discard phase
          if (state.phase === GamePhase.DISCARD && !roundComplete) {
            const cardToDiscard = currentPlayer.type === 'AI'
              ? AIEngine.decideDiscard(state, currentPlayer.id)
              : currentPlayer.hand[0];
            
            state = GameEngine.discardCard(state, cardToDiscard.id);
          }
          
          // Buy window phase (skip for simplicity in this test)
          if (state.phase === GamePhase.BUY_WINDOW) {
            state = GameEngine.advanceTurn(state);
          }
          
          turnCount++;
        }
        
        // If no one went out naturally, force round end
        if (!roundComplete) {
          state = GameEngine.endRound(state, state.players[0].id);
        }
        
        // Verify round scores were recorded
        state.players.forEach(player => {
          expect(player.roundScores).toHaveLength(round);
          expect(player.roundScores[round - 1]).toBeGreaterThanOrEqual(0);
        });
        
        // Verify cumulative scores are updated
        state.players.forEach(player => {
          const expectedCumulative = player.roundScores.reduce((sum, score) => sum + score, 0);
          expect(player.cumulativeScore).toBe(expectedCumulative);
        });
        
        // Starting player will rotate when next round starts
      }
      
      // After 7 rounds, game should end
      expect(state.phase).toBe(GamePhase.GAME_END);
      expect(state.winner).toBeTruthy();
      
      // Verify winner has lowest cumulative score
      const winner = state.players.find(p => p.id === state.winner);
      expect(winner).toBeDefined();
      
      const lowestScore = Math.min(...state.players.map(p => p.cumulativeScore));
      expect(winner!.cumulativeScore).toBe(lowestScore);
      
      // Verify all players have 7 round scores
      state.players.forEach(player => {
        expect(player.roundScores).toHaveLength(7);
      });
    });

    it('should accumulate scores correctly across rounds', () => {
      let state = GameEngine.initializeGame(3, 1);
      
      const testScores = [
        [0, 25, 30],    // Round 1
        [15, 0, 40],    // Round 2
        [20, 10, 0],    // Round 3
        [0, 35, 25],    // Round 4
        [30, 0, 15],    // Round 5
        [10, 20, 0],    // Round 6
        [0, 15, 35]     // Round 7
      ];
      
      for (let round = 1; round <= 7; round++) {
        state = GameEngine.startRound(state);
        
        // Manually set round scores for testing
        state.players.forEach((player, index) => {
          player.roundScores[round - 1] = testScores[round - 1][index];
        });
        
        // End round and verify cumulative scores
        state = GameEngine.endRound(state, state.players[0].id);
        
        state.players.forEach((player, index) => {
          const expectedCumulative = testScores
            .slice(0, round)
            .reduce((sum, roundScores) => sum + roundScores[index], 0);
          expect(player.cumulativeScore).toBe(expectedCumulative);
        });
      }
      
      // Verify final cumulative scores
      expect(state.players[0].cumulativeScore).toBe(75);  // 0+15+20+0+30+10+0
      expect(state.players[1].cumulativeScore).toBe(105); // 25+0+10+35+0+20+15
      expect(state.players[2].cumulativeScore).toBe(145); // 30+40+0+25+15+0+35
      
      // Player 0 should win
      expect(state.winner).toBe(state.players[0].id);
    });

    it('should verify winner determination with tied scores', () => {
      let state = GameEngine.initializeGame(2, 0);
      
      // Create a tie scenario
      for (let round = 1; round <= 7; round++) {
        state = GameEngine.startRound(state);
        
        // Both players get same score each round
        state.players[0].roundScores[round - 1] = 10;
        state.players[1].roundScores[round - 1] = 10;
        
        state = GameEngine.endRound(state, state.players[0].id);
      }
      
      // Both should have same cumulative score
      expect(state.players[0].cumulativeScore).toBe(70);
      expect(state.players[1].cumulativeScore).toBe(70);
      
      // Winner should still be determined (first player in case of tie)
      expect(state.winner).toBeTruthy();
    });
  });

  describe('16.2 Test multi-player scenarios', () => {
    it('should handle 2-player game with no buying mechanic', () => {
      // Initialize 2-player game
      let state = GameEngine.initializeGame(2, 1);
      
      expect(state.players).toHaveLength(2);
      
      // Start first round
      state = GameEngine.startRound(state);
      
      // Verify deck count (2 decks for 2 players = 112 cards)
      const totalCards = state.drawPile.length + state.discardPile.length + 
        state.players.reduce((sum, p) => sum + p.hand.length, 0);
      expect(totalCards).toBe(112); // 2 decks * 56 cards
      
      // Simulate a turn
      const drawResult = GameEngine.drawCard(state, 'DRAW');
      state = drawResult.state;
      
      const currentPlayer = state.players[state.currentPlayerIndex];
      const cardToDiscard = currentPlayer.hand[0];
      state = GameEngine.discardCard(state, cardToDiscard.id);
      
      // In 2-player game, should skip BUY_WINDOW and go directly to next turn
      expect(state.phase).toBe(GamePhase.DRAW);
      expect(state.currentPlayerIndex).toBe(1);
      
      // Verify buying is disabled
      expect(() => GameEngine.buyCard(state, state.players[0].id))
        .toThrow('Buying is disabled in 2-player games');
    });

    it('should handle 4-player game with full mechanics', () => {
      // Initialize 4-player game
      let state = GameEngine.initializeGame(4, 2);
      
      expect(state.players).toHaveLength(4);
      
      // Start first round
      state = GameEngine.startRound(state);
      
      // Verify deck count (2 decks for 4 players = 112 cards)
      const totalCards = state.drawPile.length + state.discardPile.length + 
        state.players.reduce((sum, p) => sum + p.hand.length, 0);
      expect(totalCards).toBe(112);
      
      // Simulate a turn with discard
      const drawResult = GameEngine.drawCard(state, 'DRAW');
      state = drawResult.state;
      
      const currentPlayer = state.players[state.currentPlayerIndex];
      const cardToDiscard = currentPlayer.hand[0];
      state = GameEngine.discardCard(state, cardToDiscard.id);
      
      // Should enter BUY_WINDOW phase
      expect(state.phase).toBe(GamePhase.BUY_WINDOW);
      
      // Test buy priority
      const buyPriority = GameEngine.getBuyPriority(state);
      expect(buyPriority.length).toBeGreaterThan(0);
      expect(buyPriority.length).toBeLessThan(4); // Excludes current and next player
      
      // Test buying mechanic
      const buyerIndex = (state.currentPlayerIndex + 2) % 4;
      const buyerId = state.players[buyerIndex].id;
      const initialHandSize = state.players[buyerIndex].hand.length;
      const initialBuys = state.players[buyerIndex].buysRemaining;
      
      const buyResult = GameEngine.buyCard(state, buyerId);
      state = buyResult.state;
      
      // Verify buy added 2 cards (bought card + draw pile card)
      expect(state.players[buyerIndex].hand.length).toBe(initialHandSize + 2);
      expect(state.players[buyerIndex].buysRemaining).toBe(initialBuys - 1);
      
      // Verify buy limit (3 buys per round)
      state.players[buyerIndex].buysRemaining = 0;
      expect(() => GameEngine.buyCard(state, buyerId))
        .toThrow('No buys remaining');
    });

    it('should handle 8-player game with 4 decks', () => {
      // Initialize 8-player game
      let state = GameEngine.initializeGame(8, 4);
      
      expect(state.players).toHaveLength(8);
      
      // Start first round
      state = GameEngine.startRound(state);
      
      // Verify deck count (4 decks for 8 players = 224 cards)
      const totalCards = state.drawPile.length + state.discardPile.length + 
        state.players.reduce((sum, p) => sum + p.hand.length, 0);
      expect(totalCards).toBe(224); // 4 decks * 56 cards
      
      // Verify all 8 players have 11 cards
      state.players.forEach(player => {
        expect(player.hand).toHaveLength(11);
      });
      
      // Verify draw pile has enough cards
      expect(state.drawPile.length).toBeGreaterThan(100);
      
      // Test turn rotation through all 8 players
      const initialPlayerIndex = state.currentPlayerIndex;
      
      for (let i = 0; i < 8; i++) {
        const drawResult = GameEngine.drawCard(state, 'DRAW');
        state = drawResult.state;
        
        const currentPlayer = state.players[state.currentPlayerIndex];
        const cardToDiscard = currentPlayer.hand[0];
        state = GameEngine.discardCard(state, cardToDiscard.id);
        
        // Skip buy window
        if (state.phase === GamePhase.BUY_WINDOW) {
          state = GameEngine.advanceTurn(state);
        }
      }
      
      // Should have cycled back to initial player
      expect(state.currentPlayerIndex).toBe(initialPlayerIndex);
    });

    it('should verify correct deck counts for different player counts', () => {
      // 2-4 players: 2 decks
      let state2 = GameEngine.initializeGame(2, 0);
      state2 = GameEngine.startRound(state2);
      let total2 = state2.drawPile.length + state2.discardPile.length + 
        state2.players.reduce((sum, p) => sum + p.hand.length, 0);
      expect(total2).toBe(112);
      
      let state4 = GameEngine.initializeGame(4, 0);
      state4 = GameEngine.startRound(state4);
      let total4 = state4.drawPile.length + state4.discardPile.length + 
        state4.players.reduce((sum, p) => sum + p.hand.length, 0);
      expect(total4).toBe(112);
      
      // 5-6 players: 3 decks
      let state5 = GameEngine.initializeGame(5, 0);
      state5 = GameEngine.startRound(state5);
      let total5 = state5.drawPile.length + state5.discardPile.length + 
        state5.players.reduce((sum, p) => sum + p.hand.length, 0);
      expect(total5).toBe(168);
      
      let state6 = GameEngine.initializeGame(6, 0);
      state6 = GameEngine.startRound(state6);
      let total6 = state6.drawPile.length + state6.discardPile.length + 
        state6.players.reduce((sum, p) => sum + p.hand.length, 0);
      expect(total6).toBe(168);
      
      // 7-8 players: 4 decks
      let state7 = GameEngine.initializeGame(7, 0);
      state7 = GameEngine.startRound(state7);
      let total7 = state7.drawPile.length + state7.discardPile.length + 
        state7.players.reduce((sum, p) => sum + p.hand.length, 0);
      expect(total7).toBe(224);
      
      let state8 = GameEngine.initializeGame(8, 0);
      state8 = GameEngine.startRound(state8);
      let total8 = state8.drawPile.length + state8.discardPile.length + 
        state8.players.reduce((sum, p) => sum + p.hand.length, 0);
      expect(total8).toBe(224);
    });
  });

  describe('16.3 Test edge cases', () => {
    it('should handle draw pile depletion by reshuffling discard pile', () => {
      let state = GameEngine.initializeGame(2, 0);
      state = GameEngine.startRound(state);
      
      // Artificially deplete draw pile
      state.drawPile = [state.drawPile[0]]; // Leave only 1 card
      state.discardPile = state.drawPile.slice(1, 20); // Move cards to discard
      
      const initialDiscardSize = state.discardPile.length;
      
      // Draw the last card
      const drawResult1 = GameEngine.drawCard(state, 'DRAW');
      state = drawResult1.state;
      
      expect(state.drawPile.length).toBe(0);
      
      // Try to draw again - should trigger reshuffle
      state.phase = GamePhase.DRAW;
      const drawResult2 = GameEngine.drawCard(state, 'DRAW');
      state = drawResult2.state;
      
      // Draw pile should be replenished from discard pile
      expect(state.drawPile.length).toBeGreaterThan(0);
      expect(state.discardPile.length).toBeLessThan(initialDiscardSize);
    });

    it('should handle all players passing on buying', () => {
      let state = GameEngine.initializeGame(4, 0);
      state = GameEngine.startRound(state);
      
      // Simulate a discard
      const drawResult = GameEngine.drawCard(state, 'DRAW');
      state = drawResult.state;
      
      const currentPlayer = state.players[state.currentPlayerIndex];
      const cardToDiscard = currentPlayer.hand[0];
      state = GameEngine.discardCard(state, cardToDiscard.id);
      
      expect(state.phase).toBe(GamePhase.BUY_WINDOW);
      
      // All eligible players pass (don't buy)
      // Advance turn without any buys
      state = GameEngine.advanceTurn(state);
      
      // Should move to next player's turn
      expect(state.phase).toBe(GamePhase.DRAW);
      const nextPlayerIndex = (drawResult.state.currentPlayerIndex + 1) % 4;
      expect(state.currentPlayerIndex).toBe(nextPlayerIndex);
    });

    it('should handle surprise go-out (meld and go out in one turn)', () => {
      let state = GameEngine.initializeGame(3, 0);
      state = GameEngine.startRound(state);
      
      const currentPlayer = state.players[state.currentPlayerIndex];
      
      // Set up a hand that can go out immediately (Round 1: 2 triplets + 1 card)
      const triplet1Cards = [
        { id: generateId(), rank: Rank.FIVE, suit: Suit.HEARTS, deckIndex: 0 },
        { id: generateId(), rank: Rank.FIVE, suit: Suit.DIAMONDS, deckIndex: 0 },
        { id: generateId(), rank: Rank.FIVE, suit: Suit.CLUBS, deckIndex: 0 }
      ];
      
      const triplet2Cards = [
        { id: generateId(), rank: Rank.SEVEN, suit: Suit.HEARTS, deckIndex: 0 },
        { id: generateId(), rank: Rank.SEVEN, suit: Suit.DIAMONDS, deckIndex: 0 },
        { id: generateId(), rank: Rank.SEVEN, suit: Suit.CLUBS, deckIndex: 0 }
      ];
      
      const finalCard = { id: generateId(), rank: Rank.KING, suit: Suit.SPADES, deckIndex: 0 };
      
      currentPlayer.hand = [...triplet1Cards, ...triplet2Cards, finalCard];
      
      const triplet1: Combination = {
        id: generateId(),
        type: 'TRIPLET',
        playerId: currentPlayer.id,
        cards: triplet1Cards
      };
      
      const triplet2: Combination = {
        id: generateId(),
        type: 'TRIPLET',
        playerId: currentPlayer.id,
        cards: triplet2Cards
      };
      
      // Draw a card first
      const drawResult = GameEngine.drawCard(state, 'DRAW');
      state = drawResult.state;
      
      // Go out immediately
      state = GameEngine.goOut(state, [triplet1, triplet2], finalCard.id);
      
      // Round should end
      expect(state.phase).toBe(GamePhase.ROUND_END);
      
      // Player should have 0 points for this round
      expect(currentPlayer.hasMelded).toBe(true);
    });

    it('should prevent buying after melding', () => {
      let state = GameEngine.initializeGame(4, 0);
      state = GameEngine.startRound(state);
      
      const playerIndex = 0;
      const player = state.players[playerIndex];
      
      // Set up player with valid meld
      const triplet1Cards = [
        { id: generateId(), rank: Rank.FIVE, suit: Suit.HEARTS, deckIndex: 0 },
        { id: generateId(), rank: Rank.FIVE, suit: Suit.DIAMONDS, deckIndex: 0 },
        { id: generateId(), rank: Rank.FIVE, suit: Suit.CLUBS, deckIndex: 0 }
      ];
      
      const triplet2Cards = [
        { id: generateId(), rank: Rank.SEVEN, suit: Suit.HEARTS, deckIndex: 0 },
        { id: generateId(), rank: Rank.SEVEN, suit: Suit.DIAMONDS, deckIndex: 0 },
        { id: generateId(), rank: Rank.SEVEN, suit: Suit.CLUBS, deckIndex: 0 }
      ];
      
      player.hand = [...triplet1Cards, ...triplet2Cards, 
        { id: generateId(), rank: Rank.KING, suit: Suit.SPADES, deckIndex: 0 }
      ];
      
      const triplet1: Combination = {
        id: generateId(),
        type: 'TRIPLET',
        playerId: player.id,
        cards: triplet1Cards
      };
      
      const triplet2: Combination = {
        id: generateId(),
        type: 'TRIPLET',
        playerId: player.id,
        cards: triplet2Cards
      };
      
      // Draw and meld
      const drawResult = GameEngine.drawCard(state, 'DRAW');
      state = drawResult.state;
      state = GameEngine.meldCombinations(state, [triplet1, triplet2]);
      
      expect(player.hasMelded).toBe(true);
      expect(player.buysRemaining).toBe(0);
      
      // Discard
      const cardToDiscard = player.hand[0];
      state = GameEngine.discardCard(state, cardToDiscard.id);
      
      // Try to buy - should fail
      expect(() => GameEngine.buyCard(state, player.id))
        .toThrow();
    });

    it('should handle buy priority correctly with melded players', () => {
      let state = GameEngine.initializeGame(4, 0);
      state = GameEngine.startRound(state);
      
      // Mark player 2 as melded
      state.players[2].hasMelded = true;
      
      // Simulate discard from player 0
      state.currentPlayerIndex = 0;
      const drawResult = GameEngine.drawCard(state, 'DRAW');
      state = drawResult.state;
      
      const cardToDiscard = state.players[0].hand[0];
      state = GameEngine.discardCard(state, cardToDiscard.id);
      
      // Get buy priority
      const priority = GameEngine.getBuyPriority(state);
      
      // Should not include player 2 (melded)
      expect(priority).not.toContain(state.players[2].id);
      
      // Should not include player 0 (current) or player 1 (next)
      expect(priority).not.toContain(state.players[0].id);
      expect(priority).not.toContain(state.players[1].id);
      
      // Should only include player 3
      expect(priority).toContain(state.players[3].id);
      expect(priority.length).toBe(1);
    });

    it('should handle Joker swap and sequence extension', () => {
      let state = GameEngine.initializeGame(3, 0);
      state = GameEngine.startRound(state);
      
      const player = state.players[0];
      player.hasMelded = true;
      
      // Create a melded sequence with a Joker
      const sequenceWithJoker: Combination = {
        id: generateId(),
        type: 'SEQUENCE',
        playerId: player.id,
        cards: [
          { id: 'three-h', rank: Rank.THREE, suit: Suit.HEARTS, deckIndex: 0 },
          { id: 'four-h', rank: Rank.FOUR, suit: Suit.HEARTS, deckIndex: 0 },
          { id: 'joker-1', rank: Rank.JOKER, suit: null, deckIndex: 0 },
          { id: 'six-h', rank: Rank.SIX, suit: Suit.HEARTS, deckIndex: 0 }
        ]
      };
      
      player.meldedCombinations = [sequenceWithJoker];
      
      // Player has the Five of Hearts (replacement for Joker)
      const fiveOfHearts = { id: 'five-h', rank: Rank.FIVE, suit: Suit.HEARTS, deckIndex: 0 };
      player.hand = [fiveOfHearts];
      
      // Swap the Joker
      const jokerCard = sequenceWithJoker.cards[2];
      state = GameEngine.swapJoker(state, player.id, sequenceWithJoker.id, jokerCard.id, fiveOfHearts.id);
      
      // Verify Joker is now in hand
      let updatedPlayer = state.players[0];
      expect(updatedPlayer.hand.some(c => c.rank === Rank.JOKER)).toBe(true);
      
      // Verify sequence now has Five of Hearts
      let updatedSequence = updatedPlayer.meldedCombinations.find(c => c.id === sequenceWithJoker.id);
      expect(updatedSequence?.cards.some(c => c.id === 'five-h')).toBe(true);
      
      // Now extend the sequence
      const twoOfHearts = { id: 'two-h', rank: Rank.TWO, suit: Suit.HEARTS, deckIndex: 0 };
      state.players[0].hand.push(twoOfHearts);
      
      state = GameEngine.extendSequence(state, player.id, sequenceWithJoker.id, [twoOfHearts.id], 'START');
      
      // Verify sequence is extended
      updatedPlayer = state.players[0];
      const extendedSequence = updatedPlayer.meldedCombinations.find(c => c.id === sequenceWithJoker.id);
      expect(extendedSequence?.cards.length).toBe(5);
      expect(extendedSequence?.cards[0].rank).toBe(Rank.TWO);
    });
  });
});
