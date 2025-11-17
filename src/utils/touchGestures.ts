/**
 * Touch Gesture Utilities for Mobile Interactions
 * Handles tap, drag, and swipe gestures for card game
 */

export interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface DragState {
  isDragging: boolean;
  startPoint: TouchPoint | null;
  currentPoint: TouchPoint | null;
  element: HTMLElement | null;
}

export interface SwipeResult {
  direction: 'left' | 'right' | 'up' | 'down' | null;
  distance: number;
  velocity: number;
}

// Constants for gesture detection
const TAP_THRESHOLD = 10; // pixels
const TAP_DURATION = 300; // milliseconds
const SWIPE_THRESHOLD = 50; // pixels
const SWIPE_VELOCITY_THRESHOLD = 0.3; // pixels per millisecond

/**
 * Detect if a touch event is a tap (short touch with minimal movement)
 */
export function isTap(startPoint: TouchPoint, endPoint: TouchPoint): boolean {
  const distance = getDistance(startPoint, endPoint);
  const duration = endPoint.timestamp - startPoint.timestamp;
  
  return distance < TAP_THRESHOLD && duration < TAP_DURATION;
}

/**
 * Calculate distance between two points
 */
export function getDistance(point1: TouchPoint, point2: TouchPoint): number {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Detect swipe gesture and return direction and velocity
 */
export function detectSwipe(startPoint: TouchPoint, endPoint: TouchPoint): SwipeResult {
  const dx = endPoint.x - startPoint.x;
  const dy = endPoint.y - startPoint.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const duration = endPoint.timestamp - startPoint.timestamp;
  const velocity = duration > 0 ? distance / duration : 0;

  if (distance < SWIPE_THRESHOLD || velocity < SWIPE_VELOCITY_THRESHOLD) {
    return { direction: null, distance: 0, velocity: 0 };
  }

  // Determine primary direction
  const absDx = Math.abs(dx);
  const absDy = Math.abs(dy);

  let direction: 'left' | 'right' | 'up' | 'down';
  
  if (absDx > absDy) {
    direction = dx > 0 ? 'right' : 'left';
  } else {
    direction = dy > 0 ? 'down' : 'up';
  }

  return { direction, distance, velocity };
}

/**
 * Get touch point from touch event
 */
export function getTouchPoint(event: TouchEvent | Touch): TouchPoint {
  const touch = 'touches' in event ? event.touches[0] : event;
  return {
    x: touch.clientX,
    y: touch.clientY,
    timestamp: Date.now()
  };
}

/**
 * Hook for handling card drag gestures
 */
export class CardDragHandler {
  private dragState: DragState = {
    isDragging: false,
    startPoint: null,
    currentPoint: null,
    element: null
  };

  private onDragStart?: (element: HTMLElement, point: TouchPoint) => void;
  private onDragMove?: (element: HTMLElement, point: TouchPoint, delta: { x: number; y: number }) => void;
  private onDragEnd?: (element: HTMLElement, point: TouchPoint) => void;
  private onTap?: (element: HTMLElement, point: TouchPoint) => void;

  constructor(callbacks: {
    onDragStart?: (element: HTMLElement, point: TouchPoint) => void;
    onDragMove?: (element: HTMLElement, point: TouchPoint, delta: { x: number; y: number }) => void;
    onDragEnd?: (element: HTMLElement, point: TouchPoint) => void;
    onTap?: (element: HTMLElement, point: TouchPoint) => void;
  }) {
    this.onDragStart = callbacks.onDragStart;
    this.onDragMove = callbacks.onDragMove;
    this.onDragEnd = callbacks.onDragEnd;
    this.onTap = callbacks.onTap;
  }

  handleTouchStart = (event: TouchEvent, element: HTMLElement) => {
    const point = getTouchPoint(event);
    
    this.dragState = {
      isDragging: true,
      startPoint: point,
      currentPoint: point,
      element
    };

    this.onDragStart?.(element, point);
  };

  handleTouchMove = (event: TouchEvent) => {
    if (!this.dragState.isDragging || !this.dragState.element || !this.dragState.startPoint) {
      return;
    }

    event.preventDefault(); // Prevent scrolling while dragging

    const point = getTouchPoint(event);
    const delta = {
      x: point.x - this.dragState.currentPoint!.x,
      y: point.y - this.dragState.currentPoint!.y
    };

    this.dragState.currentPoint = point;
    this.onDragMove?.(this.dragState.element, point, delta);
  };

  handleTouchEnd = (event: TouchEvent) => {
    if (!this.dragState.isDragging || !this.dragState.element || !this.dragState.startPoint) {
      return;
    }

    const endPoint: TouchPoint = {
      x: event.changedTouches[0].clientX,
      y: event.changedTouches[0].clientY,
      timestamp: Date.now()
    };

    // Check if it was a tap
    if (isTap(this.dragState.startPoint, endPoint)) {
      this.onTap?.(this.dragState.element, endPoint);
    } else {
      this.onDragEnd?.(this.dragState.element, endPoint);
    }

    // Reset drag state
    this.dragState = {
      isDragging: false,
      startPoint: null,
      currentPoint: null,
      element: null
    };
  };

  handleTouchCancel = () => {
    this.dragState = {
      isDragging: false,
      startPoint: null,
      currentPoint: null,
      element: null
    };
  };
}

/**
 * Prevent default touch behaviors that interfere with game
 */
export function preventDefaultTouch(event: TouchEvent) {
  if (event.target instanceof HTMLElement) {
    const tagName = event.target.tagName.toLowerCase();
    // Don't prevent default on input elements
    if (tagName !== 'input' && tagName !== 'textarea' && tagName !== 'select') {
      event.preventDefault();
    }
  }
}

/**
 * Check if device supports touch
 */
export function isTouchDevice(): boolean {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
}

/**
 * Get optimal card size based on screen width
 */
export function getOptimalCardSize(screenWidth: number): 'small' | 'medium' | 'large' {
  if (screenWidth < 480) {
    return 'small';
  } else if (screenWidth < 768) {
    return 'medium';
  } else if (screenWidth < 1024) {
    return 'medium';
  } else {
    return 'large';
  }
}

/**
 * Debounce function for resize events
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Lock body scroll (useful for modals on mobile)
 */
export function lockBodyScroll() {
  document.body.style.overflow = 'hidden';
  document.body.style.position = 'fixed';
  document.body.style.width = '100%';
}

/**
 * Unlock body scroll
 */
export function unlockBodyScroll() {
  document.body.style.overflow = '';
  document.body.style.position = '';
  document.body.style.width = '';
}

/**
 * Get safe area insets for devices with notches
 */
export function getSafeAreaInsets() {
  const style = getComputedStyle(document.documentElement);
  
  return {
    top: parseInt(style.getPropertyValue('--sat') || '0'),
    right: parseInt(style.getPropertyValue('--sar') || '0'),
    bottom: parseInt(style.getPropertyValue('--sab') || '0'),
    left: parseInt(style.getPropertyValue('--sal') || '0')
  };
}
