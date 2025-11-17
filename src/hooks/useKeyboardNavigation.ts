import { useEffect, useCallback } from 'react';

/**
 * Keyboard shortcuts for the Shanko card game
 * Requirements: 7.3, 7.5
 */
export interface KeyboardShortcuts {
  onDrawFromPile?: () => void;
  onDrawFromDiscard?: () => void;
  onDiscard?: () => void;
  onMeld?: () => void;
  onBuy?: () => void;
  onGoOut?: () => void;
  onSwapJoker?: () => void;
  onExtendSequence?: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
  onHelp?: () => void;
}

/**
 * Hook for managing keyboard navigation and shortcuts
 * Provides consistent keyboard controls across the application
 */
export function useKeyboardNavigation(shortcuts: KeyboardShortcuts, enabled: boolean = true) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Don't trigger shortcuts when typing in input fields
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      return;
    }

    // Check for modifier keys
    const isCtrl = event.ctrlKey || event.metaKey;
    const isShift = event.shiftKey;

    // Handle keyboard shortcuts
    switch (event.key.toLowerCase()) {
      case 'd':
        if (!isCtrl && !isShift) {
          event.preventDefault();
          shortcuts.onDrawFromPile?.();
        }
        break;
      
      case 'r':
        if (!isCtrl && !isShift) {
          event.preventDefault();
          shortcuts.onDrawFromDiscard?.();
        }
        break;
      
      case 'x':
        if (!isCtrl && !isShift) {
          event.preventDefault();
          shortcuts.onDiscard?.();
        }
        break;
      
      case 'm':
        if (!isCtrl && !isShift) {
          event.preventDefault();
          shortcuts.onMeld?.();
        }
        break;
      
      case 'b':
        if (!isCtrl && !isShift) {
          event.preventDefault();
          shortcuts.onBuy?.();
        }
        break;
      
      case 'g':
        if (!isCtrl && !isShift) {
          event.preventDefault();
          shortcuts.onGoOut?.();
        }
        break;
      
      case 'j':
        if (!isCtrl && !isShift) {
          event.preventDefault();
          shortcuts.onSwapJoker?.();
        }
        break;
      
      case 'e':
        if (!isCtrl && !isShift) {
          event.preventDefault();
          shortcuts.onExtendSequence?.();
        }
        break;
      
      case 'escape':
        event.preventDefault();
        shortcuts.onCancel?.();
        break;
      
      case 'enter':
        if (!isCtrl && !isShift) {
          event.preventDefault();
          shortcuts.onConfirm?.();
        }
        break;
      
      case '?':
      case '/':
        if (isShift || event.key === '?') {
          event.preventDefault();
          shortcuts.onHelp?.();
        }
        break;
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    if (enabled) {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [handleKeyDown, enabled]);
}

/**
 * Get keyboard shortcut display text
 */
export function getShortcutText(action: string): string {
  const shortcuts: Record<string, string> = {
    drawFromPile: 'D',
    drawFromDiscard: 'R',
    discard: 'X',
    meld: 'M',
    buy: 'B',
    goOut: 'G',
    swapJoker: 'J',
    extendSequence: 'E',
    cancel: 'Esc',
    confirm: 'Enter',
    help: '?'
  };
  
  return shortcuts[action] || '';
}
