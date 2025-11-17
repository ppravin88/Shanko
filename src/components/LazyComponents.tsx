/**
 * Lazy-loaded components for code splitting and performance optimization
 * Requirements: 17.1 - Optimize performance
 */

import { lazy, Suspense } from 'react';
import { lazyWithRetry } from '../utils/performanceOptimization';

// Lazy load dialog components (not needed until user interaction)
export const MeldDialog = lazyWithRetry(() => import('./MeldDialog'));
export const BuyDialog = lazyWithRetry(() => import('./BuyDialog'));
export const JokerSwapDialog = lazyWithRetry(() => import('./JokerSwapDialog'));
export const SequenceExtensionDialog = lazyWithRetry(() => import('./SequenceExtensionDialog'));
export const RoundEndDialog = lazyWithRetry(() => import('./RoundEndDialog'));
export const GameOverScreen = lazyWithRetry(() => import('./GameOverScreen'));

// Lazy load settings and debug components
export const AccessibilitySettings = lazyWithRetry(() => import('./AccessibilitySettings'));
export const ResponsiveDebugger = lazyWithRetry(() => import('./ResponsiveDebugger'));

// Loading fallback component
export function DialogLoadingFallback() {
  return (
    <div className="dialog-loading" role="status" aria-live="polite">
      <div className="loading-spinner" aria-label="Loading dialog"></div>
    </div>
  );
}

// Wrapper component with Suspense boundary
interface LazyDialogWrapperProps {
  children: React.ReactNode;
}

export function LazyDialogWrapper({ children }: LazyDialogWrapperProps) {
  return (
    <Suspense fallback={<DialogLoadingFallback />}>
      {children}
    </Suspense>
  );
}
