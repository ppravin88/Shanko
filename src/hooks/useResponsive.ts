/**
 * React Hook for Responsive Design
 * Provides screen size detection and responsive utilities
 */

import { useState, useEffect } from 'react';
import { debounce, getOptimalCardSize, isTouchDevice } from '../utils/touchGestures';

export interface ScreenSize {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  isTouchDevice: boolean;
  cardSize: 'small' | 'medium' | 'large';
}

export interface Breakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
  large: number;
}

const DEFAULT_BREAKPOINTS: Breakpoints = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  large: 1440
};

/**
 * Hook to get current screen size and device type
 */
export function useResponsive(breakpoints: Breakpoints = DEFAULT_BREAKPOINTS): ScreenSize {
  const [screenSize, setScreenSize] = useState<ScreenSize>(() => 
    calculateScreenSize(window.innerWidth, window.innerHeight, breakpoints)
  );

  useEffect(() => {
    const handleResize = debounce(() => {
      setScreenSize(calculateScreenSize(window.innerWidth, window.innerHeight, breakpoints));
    }, 150);

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [breakpoints]);

  return screenSize;
}

/**
 * Calculate screen size properties
 */
function calculateScreenSize(width: number, height: number, breakpoints: Breakpoints): ScreenSize {
  const isMobile = width < breakpoints.tablet;
  const isTablet = width >= breakpoints.tablet && width < breakpoints.desktop;
  const isDesktop = width >= breakpoints.desktop;
  const isPortrait = height > width;
  const isLandscape = width >= height;
  const touchDevice = isTouchDevice();
  const cardSize = getOptimalCardSize(width);

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    isPortrait,
    isLandscape,
    isTouchDevice: touchDevice,
    cardSize
  };
}

/**
 * Hook for media query matching
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } 
    // Legacy browsers
    else {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [query]);

  return matches;
}

/**
 * Hook for detecting orientation
 */
export function useOrientation(): 'portrait' | 'landscape' {
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(() => 
    window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  );

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  return orientation;
}

/**
 * Hook for detecting if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

/**
 * Hook for viewport height (handles mobile browser chrome)
 */
export function useViewportHeight(): number {
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = debounce(() => {
      setHeight(window.innerHeight);
      
      // Update CSS custom property for dynamic viewport height
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    }, 150);

    // Set initial value
    document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return height;
}

/**
 * Hook for safe area insets (notches, etc.)
 */
export function useSafeAreaInsets() {
  const [insets, setInsets] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  });

  useEffect(() => {
    const updateInsets = () => {
      const style = getComputedStyle(document.documentElement);
      setInsets({
        top: parseInt(style.getPropertyValue('env(safe-area-inset-top)') || '0'),
        right: parseInt(style.getPropertyValue('env(safe-area-inset-right)') || '0'),
        bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
        left: parseInt(style.getPropertyValue('env(safe-area-inset-left)') || '0')
      });
    };

    updateInsets();
    window.addEventListener('resize', updateInsets);

    return () => window.removeEventListener('resize', updateInsets);
  }, []);

  return insets;
}
