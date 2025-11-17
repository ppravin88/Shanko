/**
 * Focus management utilities for accessibility
 * Requirements: 7.3, 7.5
 */

/**
 * Trap focus within a container (useful for modals/dialogs)
 */
export function trapFocus(container: HTMLElement): () => void {
  const focusableElements = getFocusableElements(container);
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    if (event.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  // Focus first element when trap is activated
  firstElement?.focus();

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  return Array.from(container.querySelectorAll(selector));
}

/**
 * Save and restore focus (useful when opening/closing modals)
 */
export class FocusManager {
  private previousFocus: HTMLElement | null = null;

  saveFocus(): void {
    this.previousFocus = document.activeElement as HTMLElement;
  }

  restoreFocus(): void {
    if (this.previousFocus && typeof this.previousFocus.focus === 'function') {
      this.previousFocus.focus();
    }
  }
}

/**
 * Move focus to next/previous focusable element
 */
export function moveFocus(direction: 'next' | 'previous', container?: HTMLElement): void {
  const root = container || document.body;
  const focusableElements = getFocusableElements(root);
  const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);

  if (currentIndex === -1) {
    focusableElements[0]?.focus();
    return;
  }

  let nextIndex: number;
  if (direction === 'next') {
    nextIndex = (currentIndex + 1) % focusableElements.length;
  } else {
    nextIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
  }

  focusableElements[nextIndex]?.focus();
}
