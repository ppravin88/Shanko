/**
 * Interactive Tutorial Component
 * Teaches players the game rules step-by-step
 * Requirements: All requirements
 */

import { useState } from 'react';
import { Card, Rank, Suit } from '../types';
import { CardComponent } from './CardComponent';
import './Tutorial.css';

interface TutorialStep {
  id: string;
  title: string;
  content: string;
  example?: {
    cards?: Card[];
    description: string;
  };
  practiceScenario?: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  };
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to Shanko!',
    content: 'Shanko is a strategic card game where you form combinations of cards across 7 rounds. The player with the lowest total score at the end wins!'
  },
  {
    id: 'objective',
    title: 'Game Objective',
    content: 'Each round has a specific objective - you must form the required number of Triplets and Sequences. Complete all 7 rounds with the lowest cumulative score to win!'
  },
  {
    id: 'triplets',
    title: 'Triplets',
    content: 'A Triplet is exactly 3 cards with the same rank (number or face). Suits don\'t matter for triplets.',
    example: {
      cards: [
        { id: '1', rank: Rank.SEVEN, suit: Suit.HEARTS, deckIndex: 0 },
        { id: '2', rank: Rank.SEVEN, suit: Suit.DIAMONDS, deckIndex: 0 },
        { id: '3', rank: Rank.SEVEN, suit: Suit.CLUBS, deckIndex: 0 }
      ],
      description: 'Three 7s form a valid triplet'
    },
    practiceScenario: {
      question: 'Which of these is a valid triplet?',
      options: [
        '3♥ 4♥ 5♥',
        'K♠ K♦ K♣',
        'A♥ A♦ 2♥',
        '10♠ J♠ Q♠'
      ],
      correctAnswer: 1,
      explanation: 'K♠ K♦ K♣ is correct - three Kings of any suit form a triplet!'
    }
  },
  {
    id: 'sequences',
    title: 'Sequences',
    content: 'A Sequence is exactly 4 cards with consecutive ranks from the same suit. Ace can be at the start (A-2-3-4) or end (J-Q-K-A), but not both (K-A-2-3 is invalid).',
    example: {
      cards: [
        { id: '4', rank: Rank.FIVE, suit: Suit.SPADES, deckIndex: 0 },
        { id: '5', rank: Rank.SIX, suit: Suit.SPADES, deckIndex: 0 },
        { id: '6', rank: Rank.SEVEN, suit: Suit.SPADES, deckIndex: 0 },
        { id: '7', rank: Rank.EIGHT, suit: Suit.SPADES, deckIndex: 0 }
      ],
      description: '5-6-7-8 of Spades form a valid sequence'
    },
    practiceScenario: {
      question: 'Which sequence is INVALID?',
      options: [
        'A♥ 2♥ 3♥ 4♥',
        'J♦ Q♦ K♦ A♦',
        'K♣ A♣ 2♣ 3♣',
        '7♠ 8♠ 9♠ 10♠'
      ],
      correctAnswer: 2,
      explanation: 'K♣ A♣ 2♣ 3♣ is invalid - sequences cannot wrap around from King to Ace to 2!'
    }
  },
  {
    id: 'jokers',
    title: 'Jokers - Wild Cards',
    content: 'Jokers can substitute for any card in Triplets or Sequences. Every combination must have at least one real card. Jokers are worth 50 points if left in your hand!',
    example: {
      cards: [
        { id: '8', rank: Rank.QUEEN, suit: Suit.HEARTS, deckIndex: 0 },
        { id: '9', rank: Rank.JOKER, suit: null, deckIndex: 0 },
        { id: '10', rank: Rank.QUEEN, suit: Suit.CLUBS, deckIndex: 0 }
      ],
      description: 'Joker acts as a Queen to complete this triplet'
    }
  },
  {
    id: 'rounds',
    title: '7 Rounds of Increasing Difficulty',
    content: 'Round 1: 2 Triplets\nRound 2: 1 Triplet + 1 Sequence\nRound 3: 2 Sequences\nRound 4: 3 Triplets\nRound 5: 2 Triplets + 1 Sequence\nRound 6: 1 Triplet + 2 Sequences\nRound 7: 3 Sequences'
  },
  {
    id: 'turns',
    title: 'Taking Your Turn',
    content: 'On your turn:\n1. Draw a card (from draw pile or discard pile)\n2. Optionally meld your combinations if you meet the round objective\n3. Discard one card to end your turn'
  },
  {
    id: 'melding',
    title: 'Melding',
    content: 'When you have the required combinations for the round, you can meld (lay down your cards). Once melded, you can no longer buy cards, but you can swap Jokers and extend sequences!'
  },
  {
    id: 'buying',
    title: 'Buying Cards',
    content: 'When another player discards, you can "buy" that card (if it\'s not your turn next). You get the discarded card PLUS one from the draw pile. You can buy up to 3 times per round. Buying is disabled in 2-player games.'
  },
  {
    id: 'going-out',
    title: 'Going Out',
    content: 'After melding, when you have exactly 1 card left, you can "go out" by discarding it face-down. This ends the round. You score 0 points, while others score based on their remaining cards!'
  },
  {
    id: 'scoring',
    title: 'Scoring',
    content: 'Card values:\n• Number cards (2-10): Face value\n• Jack, Queen, King: 10 points each\n• Ace: 15 points\n• Joker: 50 points\n\nThe player who goes out scores 0. Others score the total value of cards left in their hand. Lowest cumulative score after 7 rounds wins!'
  },
  {
    id: 'strategy',
    title: 'Strategy Tips',
    content: '• Keep high-value cards (Aces, Jokers) in combinations to avoid scoring them\n• Use Jokers in sequences (not triplets) so you can swap them later\n• Buy strategically - save buys for cards that complete combinations\n• Watch what opponents pick from the discard pile to guess their hands\n• Meld early if your hand is weak to minimize potential losses'
  },
  {
    id: 'ready',
    title: 'Ready to Play!',
    content: 'You now know the basics of Shanko! Start a game to practice, and remember:\n\n• Form the required combinations each round\n• Manage your buys wisely\n• Go out first to score zero\n• Lowest total score wins!\n\nGood luck!'
  }
];

interface TutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function Tutorial({ onComplete, onSkip }: TutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const step = TUTORIAL_STEPS[currentStep];
  const isLastStep = currentStep === TUTORIAL_STEPS.length - 1;
  const isFirstStep = currentStep === 0;

  const handleNext = () => {
    if (step.practiceScenario && selectedAnswer === null) {
      alert('Please select an answer to continue');
      return;
    }

    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    setShowExplanation(true);
  };

  const progress = ((currentStep + 1) / TUTORIAL_STEPS.length) * 100;

  return (
    <div className="tutorial-overlay" role="dialog" aria-labelledby="tutorial-title">
      <div className="tutorial-container">
        <div className="tutorial-header">
          <h2 id="tutorial-title">{step.title}</h2>
          <button
            className="tutorial-skip touch-target"
            onClick={onSkip}
            aria-label="Skip tutorial"
          >
            Skip Tutorial
          </button>
        </div>

        <div className="tutorial-progress">
          <div className="progress-bar" style={{ width: `${progress}%` }} />
          <span className="progress-text">
            Step {currentStep + 1} of {TUTORIAL_STEPS.length}
          </span>
        </div>

        <div className="tutorial-content">
          <p className="tutorial-text">{step.content}</p>

          {step.example && (
            <div className="tutorial-example">
              <h4>Example:</h4>
              {step.example.cards && (
                <div className="example-cards">
                  {step.example.cards.map(card => (
                    <CardComponent key={card.id} card={card} size="small" />
                  ))}
                </div>
              )}
              <p className="example-description">{step.example.description}</p>
            </div>
          )}

          {step.practiceScenario && (
            <div className="tutorial-practice">
              <h4>Practice Question:</h4>
              <p className="practice-question">{step.practiceScenario.question}</p>
              <div className="practice-options">
                {step.practiceScenario.options.map((option, index) => (
                  <button
                    key={index}
                    className={`practice-option touch-target ${
                      selectedAnswer === index
                        ? index === step.practiceScenario!.correctAnswer
                          ? 'correct'
                          : 'incorrect'
                        : ''
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={selectedAnswer !== null}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {showExplanation && (
                <div
                  className={`practice-explanation ${
                    selectedAnswer === step.practiceScenario.correctAnswer
                      ? 'correct'
                      : 'incorrect'
                  }`}
                >
                  <strong>
                    {selectedAnswer === step.practiceScenario.correctAnswer
                      ? '✓ Correct!'
                      : '✗ Incorrect'}
                  </strong>
                  <p>{step.practiceScenario.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="tutorial-navigation">
          <button
            className="tutorial-btn touch-target"
            onClick={handlePrevious}
            disabled={isFirstStep}
          >
            ← Previous
          </button>
          <button
            className="tutorial-btn tutorial-btn-primary touch-target"
            onClick={handleNext}
          >
            {isLastStep ? 'Start Playing!' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
}
