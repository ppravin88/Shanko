# Implementation Plan

- [x] 1. Set up project structure and core interfaces





  - Initialize React + TypeScript project with Vite
  - Configure Redux Toolkit for state management
  - Set up CSS Modules and animation framework
  - Create core TypeScript interfaces (Card, Player, GameState, Combination)
  - Set up project folder structure (components, engines, utils, types)
  - _Requirements: 1.1, 1.2_

- [x] 2. Implement deck management system





  - [x] 2.1 Create Card and Deck data models







    - Implement Card interface with rank, suit, and deck index
    - Create Rank and Suit enums
    - Implement unique card ID generation
    - _Requirements: 1.3, 1.4, 1.5, 1.6, 1.7_
-

  - [x] 2.2 Implement DeckManager class






    - Create deck generation logic for 2-8 players
    - Implement shuffle algorithm (Fisher-Yates)
    - Add deck count calculation based on player count
    - Create single deck generation (52 cards + 4 Jokers)
    - _Requirements: 1.3, 1.4, 1.5, 1.6, 1.7_

  - [x] 2.3 Write unit tests for deck management







    - Test deck creation for different player counts
    - Verify card uniqueness across multiple decks
    - Test shuffle randomness
    - _Requirements: 1.3, 1.4, 1.5, 1.6, 1.7_

- [x] 3. Implement validation engine




  - [x] 3.1 Create triplet validation logic


    - Implement isValidTriplet function
    - Validate exactly 3 cards with matching ranks
    - Support Jokers as wildcards
    - Ensure at least one non-Joker card
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 9.2, 9.3, 9.4_

  - [x] 3.2 Create sequence validation logic


    - Implement isValidSequence function
    - Validate consecutive ranks in same suit
    - Handle Ace at beginning (A-2-3-4) or end (J-Q-K-A)
    - Prohibit wrapping sequences (K-A-2-3)
    - Support Jokers as wildcards
    - Ensure at least one non-Joker card
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 9.2, 9.3, 9.4_

  - [x] 3.3 Implement round objective validation


    - Create meetsRoundObjective function
    - Validate correct number of triplets and sequences
    - Check total card count matches objective
    - _Requirements: 5.1, 6.3, 6.4_

  - [x] 3.4 Implement Joker swap validation


    - Create canSwapJoker function
    - Prohibit swapping from triplets
    - Validate replacement card matches Joker's represented card
    - Ensure swap maintains sequence validity
    - _Requirements: 17.1, 17.2, 17.3_

  - [x] 3.5 Implement sequence extension validation


    - Create canExtendSequence function
    - Validate cards extend at beginning or end
    - Ensure consecutive ranks and same suit
    - Support Jokers in extensions
    - _Requirements: 17.5, 17.6_

  - [x] 3.6 Write unit tests for validation engine


    - Test triplet validation with various scenarios
    - Test sequence validation including Ace positions
    - Test round objective validation for all 7 rounds
    - Test Joker swap validation
    - Test sequence extension validation
    - _Requirements: 2.1-2.4, 3.1-3.7, 5.1, 9.2-9.4, 17.1-17.6_

- [x] 4. Implement scoring system




  - [x] 4.1 Create ScoringEngine class


    - Implement getCardPoints function (numbers, face cards, Ace, Joker)
    - Implement calculateRoundScore function
    - Implement cumulative score tracking
    - Implement determineWinner function (lowest score wins)
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 8.2, 8.3, 8.5_

  - [x] 4.2 Write unit tests for scoring


    - Test card point calculations for all ranks
    - Test round score calculation
    - Test winner determination
    - _Requirements: 11.1-11.5, 8.2, 8.3, 8.5_
-

- [x] 5. Implement game state management with Redux




  - [x] 5.1 Create Redux store and slices


    - Set up Redux Toolkit store
    - Create gameSlice for game state
    - Create playersSlice for player data
    - Define action creators for all game actions
    - _Requirements: 1.1, 1.2, 4.1, 4.2_

  - [x] 5.2 Implement game state reducers

    - Create reducer for game initialization
    - Create reducer for round start/end
    - Create reducer for turn progression
    - Create reducer for draw/discard actions
    - Create reducer for meld actions
    - Create reducer for buy actions
    - Create reducer for Joker swap and sequence extension
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 6.1-6.7, 12.1-12.5, 15.1-15.5, 17.1-17.6_

  - [x] 5.3 Create selectors for derived state

    - Implement selector for current player
    - Implement selector for buy priority order
    - Implement selector for valid actions
    - Implement selector for game phase
    - _Requirements: 4.1, 4.2, 16.1-16.5_

- [x] 6. Implement core game engine





  - [x] 6.1 Create GameEngine class


    - Implement initializeGame function
    - Implement startRound function (deal cards, set starting player)
    - Implement endRound function (calculate scores, advance round)
    - _Requirements: 1.1, 1.2, 4.1, 4.2, 5.2, 5.3, 8.2, 8.3_

  - [x] 6.2 Implement turn action handlers


    - Implement drawCard function (from draw pile or discard pile)
    - Implement discardCard function
    - Implement turn advancement logic (clockwise)
    - _Requirements: 4.3, 4.4, 4.5_

  - [x] 6.3 Implement meld and going out logic


    - Implement meldCombinations function
    - Validate combinations meet round objective
    - Implement goOut function (meld + final discard face-down)
    - Handle surprise go-out (meld and go out in one turn)
    - Forfeit buys when melding
    - _Requirements: 6.1-6.7, 14.1-14.5, 15.1-15.5_

  - [x] 6.4 Implement buy mechanics


    - Implement buyCard function
    - Add bought card and draw pile card to player hand
    - Decrement buy count
    - Disable buying for 2-player games
    - Prevent buying after melding
    - _Requirements: 12.1-12.5, 13.1-13.5, 15.2_

  - [x] 6.5 Implement buy priority system


    - Implement getBuyPriority function
    - Calculate clockwise turn order from discarder
    - Exclude melded players from priority
    - Exclude next player in turn order
    - _Requirements: 16.1-16.5_

  - [x] 6.6 Implement Joker swap and sequence extension


    - Implement swapJoker function
    - Validate swap is from sequence (not triplet)
    - Replace Joker with specific card it represents
    - Implement extendSequence function
    - Support extension at beginning or end
    - _Requirements: 17.1-17.6_

  - [x] 6.7 Implement edge case handling


    - Handle draw pile depletion (reshuffle discard pile)
    - Detect stalemate conditions
    - Handle player disconnection
    - Prevent out-of-turn actions
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [x] 6.8 Write integration tests for game engine


    - Test complete round flow
    - Test buy priority resolution
    - Test meld and go out scenarios
    - Test Joker mechanics
    - Test edge cases
    - _Requirements: All game engine requirements_

- [x] 7. Implement AI engine




  - [x] 7.1 Create AI decision framework


    - Implement HandEvaluation class
    - Create utility functions for hand strength assessment
    - Implement deadwood calculation
    - Create turn estimation heuristics
    - _Requirements: 18.1, 18.2, 18.3_

  - [x] 7.2 Implement AI drawing logic


    - Implement decideDraw function
    - Evaluate discard pile top card value
    - Prefer cards that complete/advance combinations
    - Consider deadwood reduction
    - _Requirements: 18.2, 18.3, 18.4_

  - [x] 7.3 Implement AI discarding logic


    - Implement decideDiscard function
    - Discard highest-point deadwood first
    - Keep cards forming multiple potential combinations
    - _Requirements: 18.2, 18.3, 18.4_

  - [x] 7.4 Implement AI buying logic


    - Implement decideBuy function
    - Buy if card completes combination
    - Consider buy limit (save for critical cards)
    - More aggressive in later rounds
    - _Requirements: 18.2, 18.3, 18.4_

  - [x] 7.5 Implement AI melding logic


    - Implement decideMeld function
    - Meld early if hand is weak
    - Delay if close to going out
    - Consider opponent progress
    - _Requirements: 18.2, 18.3, 18.4_

  - [x] 7.6 Implement AI Joker management


    - Implement decideJokerSwap function
    - Swap Jokers when holding actual card
    - Extend sequences to discard more cards
    - Prefer Jokers in sequences over triplets
    - _Requirements: 18.2, 18.3, 18.4_

  - [x] 7.7 Write unit tests for AI engine


    - Test hand evaluation accuracy
    - Test AI makes valid moves
    - Test AI follows buy limits
    - Test AI melding decisions
    - _Requirements: 18.1-18.5_

- [x] 8. Create UI components - Game setup




  - [x] 8.1 Create GameSetup component


    - Build player count selector (2-8)
    - Build human vs AI player selector
    - Add start game button
    - Display deck count based on player selection
    - _Requirements: 1.1, 1.2, 18.1_

  - [x] 8.2 Create player configuration UI


    - Add player name input fields
    - Add AI difficulty selector
    - Display player order preview
    - _Requirements: 1.1, 1.2, 18.1_
-

- [x] 9. Create UI components - Game board



  - [x] 9.1 Create GameBoard component


    - Build main game layout
    - Position player hand, draw pile, discard pile
    - Add melded sets display area
    - Add scoreboard
    - Add game controls
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 9.2 Create PlayerHand component


    - Display current player's cards
    - Implement card selection (click to select)
    - Sort cards by rank and suit
    - Highlight selected cards
    - Show card count
    - _Requirements: 7.3, 7.5_

  - [x] 9.3 Create DrawPile and DiscardPile components


    - Display draw pile with card back
    - Display discard pile with top card visible
    - Add click handlers for drawing
    - Show pile card counts
    - _Requirements: 1.7, 4.3_

  - [x] 9.4 Create MeldedSets component


    - Display all players' melded combinations
    - Group by player
    - Show combination type (triplet/sequence)
    - Highlight extendable sequences
    - Show Jokers in combinations
    - _Requirements: 6.5, 17.1, 17.5_

  - [x] 9.5 Create ScoreBoard component


    - Display all players' names
    - Show current round scores
    - Show cumulative scores
    - Highlight current player
    - Show buy counts remaining
    - Show who has melded
    - _Requirements: 8.1, 8.3, 8.4, 13.5_

  - [x] 9.6 Create GameControls component


    - Add Draw button (draw pile / discard pile)
    - Add Discard button
    - Add Meld button
    - Add Buy button (with priority check)
    - Add Go Out button
    - Disable buttons based on game phase
    - _Requirements: 4.3, 4.5, 6.1, 12.1, 14.1_

- [x] 10. Create UI components - Dialogs and modals




  - [x] 10.1 Create MeldDialog component


    - Build combination builder interface
    - Allow drag-and-drop card arrangement
    - Show triplet/sequence indicators
    - Validate combinations in real-time
    - Display round objective
    - Add confirm/cancel buttons
    - _Requirements: 6.1, 6.3, 6.4, 6.5_

  - [x] 10.2 Create BuyDialog component


    - Show card being bought
    - Display buy priority order
    - Show "Ask players" flow for priority
    - Add confirm/decline buttons
    - Show remaining buys
    - _Requirements: 12.1, 12.5, 13.5, 16.1, 16.2_

  - [x] 10.3 Create JokerSwapDialog component


    - Show available melded sequences with Jokers
    - Display replacement card requirement
    - Validate swap in real-time
    - Add confirm/cancel buttons
    - _Requirements: 17.1, 17.2, 17.3, 17.4_

  - [x] 10.4 Create SequenceExtensionDialog component


    - Show extendable sequences
    - Allow card selection for extension
    - Show extension position (start/end)
    - Validate extension in real-time
    - Add confirm/cancel buttons
    - _Requirements: 17.5, 17.6_

  - [x] 10.5 Create RoundEndDialog component


    - Display round winner
    - Show all players' hands and scores
    - Display cumulative scores
    - Add "Next Round" button
    - _Requirements: 5.2, 8.2, 8.3, 8.4, 14.3, 14.5_

  - [x] 10.6 Create GameOverScreen component


    - Display final scores for all players
    - Announce overall winner (lowest score)
    - Show round-by-round score breakdown
    - Add "New Game" button
    - _Requirements: 5.5, 8.5_

- [x] 11. Implement card animations and visual feedback





  - [x] 11.1 Create card animation system


    - Implement dealing animation (deck to hands)
    - Implement draw animation (pile to hand)
    - Implement discard animation (hand to pile)
    - Implement buy animation (pile to hand with extra card)
    - Implement meld animation (hand to melded area)
    - _Requirements: 7.4_

  - [x] 11.2 Add visual feedback for game actions


    - Highlight valid combinations (green border)
    - Highlight invalid combinations (red border)
    - Show turn indicator (current player highlight)
    - Add hover effects on interactive elements
    - Show loading state for AI turns
    - _Requirements: 7.5, 18.5_

  - [x] 11.3 Implement error message display


    - Create toast notification system
    - Display validation errors
    - Show action confirmations
    - Add dismissible error messages
    - _Requirements: 2.4, 3.7, 6.4, 10.5_


- [x] 12. Create custom card artwork




  - [x] 12.1 Design card faces


    - Create unique artwork for all ranks (2-A)
    - Design 4 suit symbols
    - Design Joker artwork
    - Ensure clear rank and suit indicators
    - _Requirements: 7.1, 7.2_

  - [x] 12.2 Design card back

    - Create distinctive card back design
    - Ensure it's visually distinct from card faces
    - _Requirements: 7.1_

  - [x] 12.3 Optimize card assets


    - Export cards as SVG or optimized PNG
    - Create sprite sheet for performance
    - Implement lazy loading
    - _Requirements: 7.1, 7.3_
- [x] 13. Implement game flow orchestration




- [ ] 13. Implement game flow orchestration

  - [x] 13.1 Create game loop controller


    - Implement round initialization
    - Handle turn progression
    - Manage game phase transitions
    - Coordinate AI turns
    - _Requirements: 4.1, 4.2, 5.1, 5.2, 5.3_

  - [x] 13.2 Implement starting player rotation


    - Set youngest player as starting player in Round 1
    - Rotate starting player left each round
    - Track starting player index
    - _Requirements: 4.1, 4.2_

  - [x] 13.3 Handle round transitions


    - Calculate and display round scores
    - Update cumulative scores
    - Reset player states (buys, melded status)
    - Advance to next round
    - _Requirements: 5.2, 8.2, 8.3, 13.2_

  - [x] 13.4 Implement game end detection


    - Detect when all 7 rounds complete
    - Calculate final winner
    - Transition to game over screen
    - _Requirements: 5.5, 8.5_
- [x] 14. Add accessibility features




- [ ] 14. Add accessibility features

  - [x] 14.1 Implement keyboard navigation


    - Add keyboard shortcuts for common actions
    - Support tab navigation through UI
    - Add focus indicators
    - _Requirements: 7.3, 7.5_

  - [x] 14.2 Add screen reader support


    - Add ARIA labels to all interactive elements
    - Announce game state changes
    - Provide text alternatives for visual elements
    - _Requirements: 7.2, 7.5_

  - [x] 14.3 Implement color blind mode


    - Add suit patterns in addition to colors
    - Provide high contrast option
    - Test with color blindness simulators
    - _Requirements: 7.2_

- [x] 15. Implement responsive design






  - [x] 15.1 Create mobile layout

    - Adapt game board for portrait orientation
    - Implement touch gestures (tap, drag)
    - Scale cards for smaller screens
    - Optimize button sizes for touch
    - _Requirements: 7.3, 7.4_


  - [x] 15.2 Create tablet layout

    - Optimize for landscape orientation
    - Adjust card and button sizing
    - _Requirements: 7.3_



  - [ ] 15.3 Test on multiple devices
    - Test on iOS devices
    - Test on Android devices
    - Test on various screen sizes
    - _Requirements: 7.3, 7.4_
-

- [x] 16. Write end-to-end tests




  - [x] 16.1 Test complete 7-round game


    - Simulate full game with multiple players
    - Verify score accumulation
    - Verify winner determination
    - _Requirements: All requirements_

  - [x] 16.2 Test multi-player scenarios

    - Test 2-player game (no buying)
    - Test 4-player game (full mechanics)
    - Test 8-player game (4 decks)
    - _Requirements: 1.2, 1.3-1.7, 12.2_

  - [x] 16.3 Test edge cases

    - Test draw pile depletion
    - Test all players pass on buying
    - Test surprise go-out
    - _Requirements: 6.6, 10.1, 16.5_

- [x] 17. Polish and optimization






  - [x] 17.1 Optimize performance

    - Profile and optimize render performance
    - Implement memoization for expensive calculations
    - Optimize Redux selectors
    - Lazy load components
    - _Requirements: All requirements_


  - [x] 17.2 Add game settings

    - Add animation speed control
    - Add sound effects toggle
    - Add AI turn delay setting
    - _Requirements: 18.5_

  - [x] 17.3 Add tutorial mode


    - Create interactive tutorial
    - Explain game rules step-by-step
    - Provide practice scenarios
    - _Requirements: All requirements_


- [x] 18. Prepare for deployment



  - [x] 18.1 Build production bundle


    - Configure Vite for production
    - Minify and optimize assets
    - Generate source maps
    - _Requirements: All requirements_

  - [x] 18.2 Set up hosting


    - Deploy to static hosting (Netlify/Vercel)
    - Configure CDN
    - Set up custom domain
    - _Requirements: All requirements_

  - [x] 18.3 Create marketing materials






    - Capture gameplay screenshots
    - Record gameplay video
    - Write game description
    - _Requirements: 7.1_
