import { useEffect, useRef } from 'react';
import { trapFocus } from '../utils/focusManagement';
import '../styles/accessibility.css';

interface KeyboardHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * KeyboardHelp component - Displays available keyboard shortcuts
 * Requirements: 7.3, 7.5
 */
export function KeyboardHelp({ isOpen, onClose }: KeyboardHelpProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      const cleanup = trapFocus(contentRef.current);
      return cleanup;
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: 'D', description: 'Draw card from draw pile' },
    { key: 'R', description: 'Draw card from discard pile (Recycle)' },
    { key: 'X', description: 'Discard selected card' },
    { key: 'M', description: 'Open meld dialog' },
    { key: 'B', description: 'Buy card from discard pile' },
    { key: 'G', description: 'Go out (end round)' },
    { key: 'J', description: 'Swap Joker' },
    { key: 'E', description: 'Extend sequence' },
    { key: 'Enter', description: 'Confirm action' },
    { key: 'Esc', description: 'Cancel / Close dialog' },
    { key: 'Tab', description: 'Navigate between elements' },
    { key: 'Shift+Tab', description: 'Navigate backwards' },
    { key: '?', description: 'Show this help' }
  ];

  return (
    <div 
      className="keyboard-help-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="keyboard-help-title"
    >
      <div 
        ref={contentRef}
        className="keyboard-help-content modal-focus-trap"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="keyboard-help-title">Keyboard Shortcuts</h2>
        <ul className="shortcut-list" role="list">
          {shortcuts.map((shortcut, index) => (
            <li key={index} className="shortcut-item" role="listitem">
              <span className="shortcut-key" aria-label={`Key: ${shortcut.key}`}>
                {shortcut.key}
              </span>
              <span className="shortcut-description">{shortcut.description}</span>
            </li>
          ))}
        </ul>
        <button 
          className="keyboard-help-close"
          onClick={onClose}
          aria-label="Close keyboard shortcuts help"
        >
          Close (Esc)
        </button>
      </div>
    </div>
  );
}
