# Requirements Document

## Introduction

Shanko is a family card game designed for commercialization with a custom deck. The game builds on classic Rummy mechanics (triplets and sequences) across 7 rounds of increasing difficulty. Each round deals 11 cards to all players, creating an engaging progression that appeals to families and casual gamers. Players aim to achieve the lowest cumulative score across all rounds by forming required combinations and declaring their hand. A unique "Buying" mechanic allows players to acquire discarded cards outside their normal turn, adding strategic depth. The digital implementation will serve as both a playable game and a prototype for the physical card game product.

## Glossary

- **Shanko_Game_System**: The complete digital card game application including game logic, UI, and player management
- **Game_Round**: One of seven sequential play sessions within a single game, each with specific winning conditions
- **Triplet**: A valid card combination consisting of exactly 3 cards with identical rank values, regardless of suit
- **Sequence**: A valid card combination consisting of exactly 4 cards with consecutive rank values from the same suit
- **Player_Hand**: The collection of 11 cards dealt to a player at the start of each round
- **Custom_Deck**: A 56-card deck consisting of standard 52 playing cards (ranks 2-10, J, Q, K, A across 4 suits) plus 4 Jokers
- **Joker**: A wild card that can substitute for any card rank and suit in Triplets or Sequences, valued at 50 points
- **Winning_Condition**: The specific combination of triplets and sequences required to complete a round
- **Meld_Action**: The act of laying down valid card combinations (Triplets and Sequences) face-up on the table during a player's turn
- **Going_Out**: The action of melding all required combinations and discarding the final remaining card, which ends the Game_Round
- **Joker_Swap**: The action of replacing a Joker in a melded set with a valid card from a player's hand, allowing the Joker to be reused
- **Sequence_Extension**: The action of adding cards to an existing melded Sequence to create a longer consecutive series
- **Difficulty_Progression**: The increasing complexity of winning conditions from Round 1 through Round 7
- **Card_Point_Value**: The point value assigned to each card for scoring: number cards at face value, J/Q/K at 10 points, Ace at 15 points, Joker at 50 points
- **Remaining_Cards**: Cards left in a player's hand when another player declares and wins the round
- **Starting_Player**: The player who takes the first turn in a Game_Round
- **Buy_Action**: A special action allowing a player to acquire the top card from the discard pile by placing a card from the draw pile face-down on top of it
- **Buy_Limit**: The maximum number of Buy_Actions a player can perform in a single Game_Round, set at 3 buys per round
- **AI_Bot**: A computer-controlled player that follows all game rules and makes strategic decisions to compete against human players

## Requirements

### Requirement 1

**User Story:** As a player, I want to understand the basic game setup, so that I can start playing Shanko with the correct number of cards and players

#### Acceptance Criteria

1. WHEN a new game session starts, THE Shanko_Game_System SHALL deal exactly 11 cards to each player
2. THE Shanko_Game_System SHALL support between 2 and 8 players in a single game session
3. WHEN a game session has 2 players, THE Shanko_Game_System SHALL use 2 Custom_Decks (112 cards total: 104 standard cards plus 8 Jokers)
4. WHEN a game session has 3 to 4 players, THE Shanko_Game_System SHALL use 2 Custom_Decks (112 cards total: 104 standard cards plus 8 Jokers)
5. WHEN a game session has 5 to 6 players, THE Shanko_Game_System SHALL use 3 Custom_Decks (168 cards total: 156 standard cards plus 12 Jokers)
6. WHEN a game session has 7 to 8 players, THE Shanko_Game_System SHALL use 4 Custom_Decks (224 cards total: 208 standard cards plus 16 Jokers)
7. WHEN all cards are dealt, THE Shanko_Game_System SHALL place the remaining cards in a draw pile with the top card face-up to start a discard pile

### Requirement 2

**User Story:** As a player, I want to form valid triplets during my turn, so that I can work toward completing round objectives

#### Acceptance Criteria

1. THE Shanko_Game_System SHALL recognize a Triplet as valid when it contains exactly 3 cards with identical rank values
2. THE Shanko_Game_System SHALL allow cards of any suit combination within a Triplet
3. WHEN a player attempts to declare a Triplet, THE Shanko_Game_System SHALL validate that all 3 cards have matching rank values
4. IF a player attempts to declare fewer than 3 or more than 3 cards as a Triplet, THEN THE Shanko_Game_System SHALL reject the combination and display an error message

### Requirement 3

**User Story:** As a player, I want to form valid sequences during my turn, so that I can work toward completing round objectives

#### Acceptance Criteria

1. THE Shanko_Game_System SHALL recognize a Sequence as valid when it contains exactly 4 cards with consecutive rank values from the same suit
2. WHEN a player attempts to declare a Sequence, THE Shanko_Game_System SHALL validate that all 4 non-Joker cards belong to the same suit
3. WHEN a player attempts to declare a Sequence, THE Shanko_Game_System SHALL validate that the rank values form an unbroken consecutive series in ascending order
4. THE Shanko_Game_System SHALL recognize the rank order as 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, A for Sequence validation
5. THE Shanko_Game_System SHALL allow Ace to be used at the beginning of a Sequence (A-2-3-4) or at the end of a Sequence (J-Q-K-A)
6. THE Shanko_Game_System SHALL prohibit wrapping sequences that use Ace in both positions (such as K-A-2-3 or Q-K-A-2)
7. IF a player attempts to declare cards from different suits as a Sequence, THEN THE Shanko_Game_System SHALL reject the combination and display an error message

### Requirement 4

**User Story:** As a player, I want to take turns drawing and discarding cards, so that I can improve my hand and form winning combinations

#### Acceptance Criteria

1. WHEN Round 1 begins, THE Shanko_Game_System SHALL designate the youngest player as the Starting_Player
2. WHEN Round 2 through Round 7 begin, THE Shanko_Game_System SHALL designate the player sitting to the left of the previous round's Starting_Player as the new Starting_Player in round-robin fashion
3. WHEN a player's turn begins, THE Shanko_Game_System SHALL allow the player to draw one card from either the draw pile or the top card from the discard pile
4. WHEN a player draws a card, THE Shanko_Game_System SHALL add the card to the Player_Hand
5. WHEN a player completes their draw action, THE Shanko_Game_System SHALL require the player to discard exactly one card face-up to the discard pile to end their turn

### Requirement 5

**User Story:** As a player, I want to progress through 7 rounds with increasing difficulty, so that the game remains challenging and engaging

#### Acceptance Criteria

1. THE Shanko_Game_System SHALL implement exactly 7 Game_Rounds in sequential order with the following Winning_Conditions: Round 1 requires 2 Triplets (6 cards), Round 2 requires 1 Triplet and 1 Sequence (7 cards), Round 3 requires 2 Sequences (8 cards), Round 4 requires 3 Triplets (9 cards), Round 5 requires 2 Triplets and 1 Sequence (10 cards), Round 6 requires 2 Sequences and 1 Triplet (11 cards), Round 7 requires 3 Sequences (12 cards)
2. WHEN a Game_Round is completed, THE Shanko_Game_System SHALL automatically advance to the next Game_Round
3. WHEN a Game_Round begins, THE Shanko_Game_System SHALL display the current round number and its specific Winning_Condition to all players
4. THE Shanko_Game_System SHALL implement Difficulty_Progression where later rounds require more total cards in combinations than earlier rounds
5. WHEN all 7 Game_Rounds are completed, THE Shanko_Game_System SHALL calculate final scores and declare the player with the lowest total score as the overall game winner

### Requirement 6

**User Story:** As a player, I want to meld my card combinations when I meet the round's winning condition, so that I can work toward going out and ending the round

#### Acceptance Criteria

1. WHEN a player's turn begins and their Player_Hand contains cards that meet the current Winning_Condition, THE Shanko_Game_System SHALL allow the player to perform a Meld_Action
2. WHEN a player performs a Meld_Action, THE Shanko_Game_System SHALL require the player to first draw a card as normal at the start of their turn
3. WHEN a player performs a Meld_Action, THE Shanko_Game_System SHALL validate that the combinations being melded satisfy the current Winning_Condition before allowing the meld
4. IF a player attempts to perform a Meld_Action without meeting the current Winning_Condition, THEN THE Shanko_Game_System SHALL prevent the meld and display an error message
5. WHEN a player successfully performs a Meld_Action, THE Shanko_Game_System SHALL display the melded combinations face-up and visible to all players
6. THE Shanko_Game_System SHALL allow each player to perform a Meld_Action at most once per Game_Round
7. THE Shanko_Game_System SHALL allow a player to delay melding and perform both Meld_Action and Going_Out in a single turn as a strategic surprise

### Requirement 15

**User Story:** As a player who has melded, I want my buying privileges to be forfeited, so that the game progresses fairly toward conclusion

#### Acceptance Criteria

1. WHEN a player performs a Meld_Action, THE Shanko_Game_System SHALL immediately forfeit all of that player's remaining unused Buy_Actions for the current Game_Round
2. WHEN a player has performed a Meld_Action, THE Shanko_Game_System SHALL prevent that player from performing any Buy_Actions for the remainder of the current Game_Round
3. WHEN a player performs a Meld_Action, THE Shanko_Game_System SHALL update the player's Buy_Actions count to zero
4. WHEN a player has performed a Meld_Action, THE Shanko_Game_System SHALL exclude that player from Buy_Action priority consideration when multiple players attempt to buy the same card
5. WHEN a player performs a Meld_Action, THE Shanko_Game_System SHALL require the player to discard one card to complete their turn

### Requirement 17

**User Story:** As a player who has melded, I want to swap and reuse Jokers in melded sequences, so that I can extend sequences and discard additional cards from my hand

#### Acceptance Criteria

1. WHEN a player has performed a Meld_Action, THE Shanko_Game_System SHALL allow that player to swap Jokers only from melded Sequences (their own or other players') during their subsequent turns
2. THE Shanko_Game_System SHALL prohibit swapping Jokers from melded Triplets under all circumstances
3. WHEN a player swaps a Joker from a melded Sequence, THE Shanko_Game_System SHALL require the player to replace the Joker with the specific valid card from their Player_Hand that the Joker was representing
4. WHEN a player swaps a Joker from a melded Sequence, THE Shanko_Game_System SHALL add the Joker to that player's Player_Hand
5. WHEN a player has a Joker in their Player_Hand after swapping, THE Shanko_Game_System SHALL allow the player to use that Joker to extend any melded Sequence by adding cards from their Player_Hand to either the beginning or end of the Sequence
6. WHEN a player extends a melded Sequence, THE Shanko_Game_System SHALL validate that the extended Sequence maintains consecutive rank values and same suit requirements

### Requirement 14

**User Story:** As a player, I want to go out by melding my combinations and discarding my final card, so that I can end the round with zero points

#### Acceptance Criteria

1. WHEN a player performs a Meld_Action and has exactly one card remaining after melding, THE Shanko_Game_System SHALL allow the player to discard that final card face-down to perform Going_Out
2. WHEN a player performs Going_Out, THE Shanko_Game_System SHALL place the final discarded card face-down on the discard pile
3. WHEN a player performs Going_Out, THE Shanko_Game_System SHALL immediately end the current Game_Round
4. WHEN a player performs Going_Out, THE Shanko_Game_System SHALL assign zero points to that player for the current Game_Round
5. WHEN Going_Out occurs, THE Shanko_Game_System SHALL calculate points for all other players based on the Card_Point_Value of their Remaining_Cards

### Requirement 7

**User Story:** As a player, I want to see a visually appealing custom deck design, so that the game feels unique and commercial-ready

#### Acceptance Criteria

1. THE Shanko_Game_System SHALL display the Custom_Deck with unique card artwork distinct from traditional playing cards
2. THE Shanko_Game_System SHALL render each card with clear visual indicators for rank and suit
3. THE Shanko_Game_System SHALL display cards in the Player_Hand with sufficient size and spacing for easy readability
4. THE Shanko_Game_System SHALL animate card movements during dealing, drawing, discarding, and buying actions
5. THE Shanko_Game_System SHALL provide visual feedback when cards are selected or combined into Triplets and Sequences

### Requirement 8

**User Story:** As a player, I want to track scores across all rounds, so that I can see who is winning the overall game

#### Acceptance Criteria

1. THE Shanko_Game_System SHALL maintain a cumulative score total for each player across all 7 Game_Rounds
2. WHEN a Game_Round ends, THE Shanko_Game_System SHALL calculate each player's round score by summing the Card_Point_Value of all Remaining_Cards in their hand
3. WHEN a Game_Round ends, THE Shanko_Game_System SHALL add each player's round score to their cumulative total
4. THE Shanko_Game_System SHALL display current cumulative scores for all players at the end of each Game_Round
5. WHEN all 7 Game_Rounds are completed, THE Shanko_Game_System SHALL identify and announce the player with the lowest cumulative score as the overall game winner

### Requirement 9

**User Story:** As a player, I want to use Jokers as wild cards in my combinations, so that I have more flexibility in forming winning hands

#### Acceptance Criteria

1. THE Shanko_Game_System SHALL include exactly 4 Jokers in each Custom_Deck
2. THE Shanko_Game_System SHALL allow a Joker to substitute for any card rank and suit within a Triplet or Sequence
3. THE Shanko_Game_System SHALL allow any number of Jokers to be used within a single Triplet or Sequence
4. THE Shanko_Game_System SHALL require at least one non-Joker card (numbered card, J, Q, K, or A) in every Triplet or Sequence
5. WHEN calculating round scores, THE Shanko_Game_System SHALL assign a Card_Point_Value of 50 points to each Joker in a player's Remaining_Cards

### Requirement 10

**User Story:** As a player, I want the game to handle edge cases gracefully, so that gameplay is smooth and fair

#### Acceptance Criteria

1. WHEN the draw pile is depleted, THE Shanko_Game_System SHALL shuffle the discard pile (except the top card) to create a new draw pile
2. IF no player can make a valid move, THE Shanko_Game_System SHALL detect the stalemate condition and end the Game_Round
3. WHEN a player disconnects or leaves, THE Shanko_Game_System SHALL handle the absence and allow the game to continue with remaining players
4. THE Shanko_Game_System SHALL prevent players from performing actions out of turn
5. THE Shanko_Game_System SHALL validate all player inputs and provide clear error messages for invalid actions

### Requirement 18

**User Story:** As a player, I want to play against AI bots when human players are not available, so that I can enjoy the game at any time

#### Acceptance Criteria

1. WHEN a game session has fewer human players than desired, THE Shanko_Game_System SHALL allow AI_Bot players to fill remaining player slots
2. THE Shanko_Game_System SHALL implement AI_Bot players that understand and follow all game rules including turn order, drawing, discarding, melding, buying, and going out
3. WHEN an AI_Bot player takes a turn, THE Shanko_Game_System SHALL make decisions based on valid game strategies including card combination formation and buy timing
4. THE Shanko_Game_System SHALL allow AI_Bot players to perform Buy_Actions, Meld_Actions, Joker_Swaps, and Going_Out according to the same rules as human players
5. THE Shanko_Game_System SHALL display AI_Bot actions and decisions to human players with appropriate visual feedback and timing

### Requirement 11

**User Story:** As a player, I want clear scoring rules applied consistently, so that I understand how points are calculated

#### Acceptance Criteria

1. THE Shanko_Game_System SHALL assign Card_Point_Value of face value to number cards 2 through 10
2. THE Shanko_Game_System SHALL assign Card_Point_Value of 10 points to Jack, Queen, and King cards
3. THE Shanko_Game_System SHALL assign Card_Point_Value of 15 points to Ace cards
4. THE Shanko_Game_System SHALL assign Card_Point_Value of 50 points to Joker cards
5. WHEN a player wins a Game_Round by successfully declaring, THE Shanko_Game_System SHALL assign zero points to that player for the round regardless of cards used in combinations

### Requirement 12

**User Story:** As a player, I want to buy cards from the discard pile outside my turn, so that I can acquire cards I need even when it's not my turn

#### Acceptance Criteria

1. WHEN a game session has 3 or more players and any player discards a card, THE Shanko_Game_System SHALL allow any other player (except the next player in turn order) to perform a Buy_Action on that card
2. WHEN a game session has exactly 2 players, THE Shanko_Game_System SHALL disable the Buy_Action mechanic for the entire game
3. WHEN a player performs a Buy_Action, THE Shanko_Game_System SHALL require the player to take one card from the draw pile and place it face-down on top of the card being bought
4. WHEN a Buy_Action is completed, THE Shanko_Game_System SHALL add both the bought card and the face-down card from the draw pile to the buying player's Player_Hand
5. THE Shanko_Game_System SHALL only allow a Buy_Action on the top card of the discard pile immediately after it has been discarded

### Requirement 13

**User Story:** As a player, I want a limited number of buys per round, so that the buying mechanic remains strategic and balanced

#### Acceptance Criteria

1. THE Shanko_Game_System SHALL set the Buy_Limit to exactly 3 Buy_Actions per player per Game_Round
2. WHEN a Game_Round begins, THE Shanko_Game_System SHALL reset each player's available Buy_Actions to 3
3. WHEN a player performs a Buy_Action, THE Shanko_Game_System SHALL decrement that player's remaining Buy_Actions by 1
4. WHEN a player has used all 3 Buy_Actions in a Game_Round, THE Shanko_Game_System SHALL prevent that player from performing additional Buy_Actions until the next Game_Round
5. THE Shanko_Game_System SHALL display each player's remaining Buy_Actions count during gameplay

### Requirement 16

**User Story:** As a player, I want buy priority to be determined fairly when multiple players want the same card, so that gameplay follows consistent rules

#### Acceptance Criteria

1. WHEN a player wishes to perform a Buy_Action, THE Shanko_Game_System SHALL require that player to ask all players with higher priority (those whose turns come before theirs in clockwise order) if they want to buy the card first
2. WHEN multiple players attempt to perform a Buy_Action on the same discarded card, THE Shanko_Game_System SHALL grant priority to the player whose turn is most immediate in clockwise turn order
3. WHEN determining Buy_Action priority, THE Shanko_Game_System SHALL exclude any players who have already performed a Meld_Action in the current Game_Round
4. WHEN a Buy_Action priority conflict occurs, THE Shanko_Game_System SHALL evaluate turn proximity starting from the player who just discarded and moving clockwise
5. WHEN Buy_Action priority is granted to a player, THE Shanko_Game_System SHALL prevent other players from buying that same card
