import { useEffect } from 'react';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

/**
 * Toast component - Individual toast notification
 * Requirements: 2.4, 3.7, 6.4, 10.5
 */
export function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    const duration = toast.duration || 3000;
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  const getIcon = (): string => {
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
    }
  };

  return (
    <div className={`toast toast-${toast.type}`}>
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-message">{toast.message}</div>
      <button 
        className="toast-close" 
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

/**
 * ToastContainer - Container for all toast notifications
 * Requirements: 2.4, 3.7, 6.4, 10.5
 */
export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
