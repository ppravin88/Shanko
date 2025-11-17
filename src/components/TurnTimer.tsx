import { useEffect, useState } from 'react';
import { formatTimeRemaining, getTimerWarningLevel, TURN_TIME_LIMIT } from '../utils/turnTimer';
import './TurnTimer.css';

interface TurnTimerProps {
  isActive: boolean;
  onTimeout: () => void;
  onTick?: (secondsRemaining: number) => void;
  duration?: number; // Optional custom duration in seconds (default: 30)
}

/**
 * TurnTimer component - Displays countdown timer for player turns
 * Automatically triggers timeout action when time runs out
 */
export function TurnTimer({ isActive, onTimeout, onTick, duration = TURN_TIME_LIMIT }: TurnTimerProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(duration);

  useEffect(() => {
    if (!isActive) {
      setSecondsRemaining(duration);
      return;
    }

    // Reset to duration when becoming active
    setSecondsRemaining(duration);

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
  }, [isActive, onTimeout, onTick, duration]);

  if (!isActive) {
    return null;
  }

  const warningLevel = getTimerWarningLevel(secondsRemaining, duration);
  const percentage = (secondsRemaining / duration) * 100;

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
          aria-valuemax={duration}
        />
      </div>
      {warningLevel === 'critical' && (
        <div className="timer-warning">Hurry! Time running out!</div>
      )}
    </div>
  );
}
