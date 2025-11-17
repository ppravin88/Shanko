import { createContext, useContext, ReactNode } from 'react';
import { useToast } from './useToast';
import { ToastType } from '../components/Toast';

interface ToastContextType {
  addToast: (message: string, type?: ToastType, duration?: number) => string;
  showSuccess: (message: string, duration?: number) => string;
  showError: (message: string, duration?: number) => string;
  showWarning: (message: string, duration?: number) => string;
  showInfo: (message: string, duration?: number) => string;
  dismissToast: (id: string) => void;
  clearAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

/**
 * ToastProvider - Provides toast notification context to the app
 * Requirements: 2.4, 3.7, 6.4, 10.5
 */
export function ToastProvider({ children }: ToastProviderProps) {
  const toast = useToast();

  return (
    <ToastContext.Provider value={toast}>
      {children}
    </ToastContext.Provider>
  );
}

/**
 * useToastContext - Hook to access toast notifications
 */
export function useToastContext(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}
