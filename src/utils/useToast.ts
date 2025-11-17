import { useState, useCallback } from 'react';
import { ToastMessage, ToastType } from '../components/Toast';

/**
 * useToast hook - Manages toast notifications
 * Requirements: 2.4, 3.7, 6.4, 10.5
 */
export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info', duration?: number) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = {
      id,
      message,
      type,
      duration
    };

    setToasts(prev => [...prev, newToast]);
    return id;
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const showSuccess = useCallback((message: string, duration?: number) => {
    return addToast(message, 'success', duration);
  }, [addToast]);

  const showError = useCallback((message: string, duration?: number) => {
    return addToast(message, 'error', duration);
  }, [addToast]);

  const showWarning = useCallback((message: string, duration?: number) => {
    return addToast(message, 'warning', duration);
  }, [addToast]);

  const showInfo = useCallback((message: string, duration?: number) => {
    return addToast(message, 'info', duration);
  }, [addToast]);

  return {
    toasts,
    addToast,
    dismissToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
}

// Validation error messages
export const ValidationErrors = {
  INVALID_TRIPLET: 'Invalid triplet: Cards must have matching ranks',
  INVALID_SEQUENCE: 'Invalid sequence: Cards must be consecutive and same suit',
  INSUFFICIENT_COMBINATIONS: 'Does not meet round objective requirements',
  OUT_OF_TURN: 'Action not allowed - not your turn',
  NO_BUYS_REMAINING: 'No buy actions remaining',
  CANNOT_BUY_AFTER_MELD: 'Cannot buy after melding',
  INVALID_JOKER_SWAP: 'Invalid Joker swap - must replace with correct card',
  SEQUENCE_WRAP_NOT_ALLOWED: 'Sequence wrapping (K-A-2) is not allowed',
  JOKER_SWAP_TRIPLET_NOT_ALLOWED: 'Cannot swap Jokers from triplets',
  NO_CARD_SELECTED: 'Please select a card first',
  INVALID_CARD_COUNT: 'Invalid number of cards selected',
  MUST_DRAW_FIRST: 'You must draw a card first',
  MUST_DISCARD: 'You must discard a card to end your turn',
  CANNOT_EXTEND_TRIPLET: 'Cannot extend triplets, only sequences',
  INVALID_EXTENSION: 'Cards do not extend the sequence properly'
};

// Success messages
export const SuccessMessages = {
  CARD_DRAWN: 'Card drawn successfully',
  CARD_DISCARDED: 'Card discarded',
  COMBINATIONS_MELDED: 'Combinations melded successfully!',
  CARD_BOUGHT: 'Card bought successfully',
  JOKER_SWAPPED: 'Joker swapped successfully',
  SEQUENCE_EXTENDED: 'Sequence extended successfully',
  WENT_OUT: 'You went out! Round complete!',
  ROUND_WON: 'Congratulations! You won this round!'
};

// Info messages
export const InfoMessages = {
  YOUR_TURN: "It's your turn",
  AI_THINKING: 'AI is thinking...',
  WAITING_FOR_BUYS: 'Waiting for buy actions...',
  ROUND_STARTED: 'Round started',
  GAME_STARTED: 'Game started - Good luck!'
};
