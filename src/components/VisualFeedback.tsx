import { ReactNode } from 'react';
import './VisualFeedback.css';

interface CombinationHighlightProps {
  children: ReactNode;
  isValid?: boolean;
  isInvalid?: boolean;
  className?: string;
}

/**
 * CombinationHighlight - Highlights card combinations as valid or invalid
 * Requirements: 7.5
 */
export function CombinationHighlight({ 
  children, 
  isValid = false, 
  isInvalid = false,
  className = ''
}: CombinationHighlightProps) {
  const highlightClass = isValid ? 'highlight-valid' : isInvalid ? 'highlight-invalid' : '';
  
  return (
    <div className={`combination-highlight ${highlightClass} ${className}`}>
      {children}
    </div>
  );
}

interface TurnIndicatorProps {
  playerName: string;
  isCurrentPlayer: boolean;
  isAI?: boolean;
}

/**
 * TurnIndicator - Shows whose turn it is
 * Requirements: 7.5
 */
export function TurnIndicator({ playerName, isCurrentPlayer, isAI = false }: TurnIndicatorProps) {
  if (!isCurrentPlayer) return null;
  
  return (
    <div className={`turn-indicator ${isAI ? 'ai-turn' : 'human-turn'}`}>
      <div className="turn-indicator-content">
        <span className="turn-indicator-icon">▶</span>
        <span className="turn-indicator-text">
          {playerName}'s Turn
          {isAI && <span className="ai-badge">AI</span>}
        </span>
      </div>
    </div>
  );
}

interface LoadingIndicatorProps {
  message?: string;
}

/**
 * LoadingIndicator - Shows loading state for AI turns
 * Requirements: 18.5
 */
export function LoadingIndicator({ message = 'AI is thinking...' }: LoadingIndicatorProps) {
  return (
    <div className="loading-indicator">
      <div className="loading-spinner"></div>
      <span className="loading-message">{message}</span>
    </div>
  );
}

interface HoverFeedbackProps {
  children: ReactNode;
  tooltip?: string;
  disabled?: boolean;
}

/**
 * HoverFeedback - Adds hover effects to interactive elements
 * Requirements: 7.5
 */
export function HoverFeedback({ children, tooltip, disabled = false }: HoverFeedbackProps) {
  return (
    <div className={`hover-feedback ${disabled ? 'disabled' : ''}`} title={tooltip}>
      {children}
    </div>
  );
}
