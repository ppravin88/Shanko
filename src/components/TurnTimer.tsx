import { useEffect, useState } from 'react';
import { formatTimeRemaining, getTimerWarningLevel, TURN_TIME_LIMIT } from '../utils/turnTimer';
import './TurnTimer.css';

interface TurnTimerProps {
  isActive: boolean;
  onTimeout: () => void;
  onTick?: (secondsRemaining: number) => void;
}

/**
 * TurnTimer component - Displays countdown timer for player turns
 * Automatically triggers timeout action when time runs out
 */
export function TurnTimer({ isActive, onTimeout, onTick }: TurnTimerProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(TURN_TIME_LIMIT);

  useEffect(() => {
    if (!isActive) {
      setSecondsRemaining(TURN_TIME_LIMIT);
      return;
    }

    // Start countdown
    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        const newValue = prev - 1;
        
        // Notify parent of tick
        if (onTick) {
          onTick(newValue);
        }

        // Check for timeout
        if (newValue <= 0) {
          clearInterval(interval);
          onTimeout();
          return 0;
        }

        return newValue;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onTimeout, onTick]);

  if (!isActive) {
    return null;
  }

  const warningLevel = getTimerWarningLevel(secondsRemaining);
  const percentage = (secondsRemaining / TURN_TIME_LIMIT) * 100;

  return (
    <div className={`turn-timer turn-timer-${warningLevel}`} role="timer" aria-live="polite">
      <div className="timer-label">Time Remaining:</div>
      <div className="timer-display">
        <span className="timer-value">{formatTimeRemaining(secondsRemaining)}</span>
      </div>
      <div className="timer-bar">
        <div 
          className="timer-bar-fill" 
          style={{ width: `${percentage}%` }}
          aria-valuenow={secondsRemaining}
          aria-valuemin={0}
          aria-valuemax={TURN_TIME_LIMIT}
        />
      </div>
      {warningLevel === 'critical' && (
        <div className="timer-warning">Hurry! Time running out!</div>
      )}
    </div>
  );
}
