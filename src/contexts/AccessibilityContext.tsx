import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

/**
 * Accessibility settings context
 * Requirements: 7.2
 */

interface AccessibilitySettings {
  colorBlindMode: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  toggleColorBlindMode: () => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

const STORAGE_KEY = 'shanko-accessibility-settings';

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    // Load from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // Fall through to defaults
      }
    }
    
    // Check system preferences
    return {
      colorBlindMode: false,
      highContrast: window.matchMedia('(prefers-contrast: high)').matches,
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    };
  });

  // Save to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    
    // Apply settings to document
    document.documentElement.classList.toggle('color-blind-mode', settings.colorBlindMode);
    document.documentElement.classList.toggle('high-contrast', settings.highContrast);
    document.documentElement.classList.toggle('reduced-motion', settings.reducedMotion);
  }, [settings]);

  // Listen for system preference changes
  useEffect(() => {
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleContrastChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, highContrast: e.matches }));
    };

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setSettings(prev => ({ ...prev, reducedMotion: e.matches }));
    };

    contrastQuery.addEventListener('change', handleContrastChange);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      contrastQuery.removeEventListener('change', handleContrastChange);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  const toggleColorBlindMode = () => {
    setSettings(prev => ({ ...prev, colorBlindMode: !prev.colorBlindMode }));
  };

  const toggleHighContrast = () => {
    setSettings(prev => ({ ...prev, highContrast: !prev.highContrast }));
  };

  const toggleReducedMotion = () => {
    setSettings(prev => ({ ...prev, reducedMotion: !prev.reducedMotion }));
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        toggleColorBlindMode,
        toggleHighContrast,
        toggleReducedMotion
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}
