/**
 * Game Settings Context
 * Manages user preferences for animations, sound, and AI behavior
 * Requirements: 18.5
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type AnimationSpeed = 'slow' | 'normal' | 'fast' | 'instant';
export type AITurnDelay = 'none' | 'short' | 'normal' | 'long';

interface GameSettings {
  animationSpeed: AnimationSpeed;
  soundEffectsEnabled: boolean;
  aiTurnDelay: AITurnDelay;
  showCardAnimations: boolean;
  autoSortHand: boolean;
}

interface GameSettingsContextType {
  settings: GameSettings;
  updateSettings: (updates: Partial<GameSettings>) => void;
  resetSettings: () => void;
  getAnimationDuration: (baseMs: number) => number;
  getAIDelayMs: () => number;
}

const DEFAULT_SETTINGS: GameSettings = {
  animationSpeed: 'normal',
  soundEffectsEnabled: false, // Disabled by default (no sound implementation yet)
  aiTurnDelay: 'normal',
  showCardAnimations: true,
  autoSortHand: true
};

const SETTINGS_STORAGE_KEY = 'shanko-game-settings';

const GameSettingsContext = createContext<GameSettingsContextType | undefined>(undefined);

export function GameSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<GameSettings>(() => {
    // Load settings from localStorage
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.warn('Failed to load game settings:', error);
    }
    return DEFAULT_SETTINGS;
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('Failed to save game settings:', error);
    }
  }, [settings]);

  const updateSettings = (updates: Partial<GameSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  // Calculate animation duration based on speed setting
  const getAnimationDuration = (baseMs: number): number => {
    switch (settings.animationSpeed) {
      case 'slow':
        return baseMs * 1.5;
      case 'normal':
        return baseMs;
      case 'fast':
        return baseMs * 0.5;
      case 'instant':
        return 0;
      default:
        return baseMs;
    }
  };

  // Get AI turn delay in milliseconds
  const getAIDelayMs = (): number => {
    switch (settings.aiTurnDelay) {
      case 'none':
        return 0;
      case 'short':
        return 500;
      case 'normal':
        return 1000;
      case 'long':
        return 2000;
      default:
        return 1000;
    }
  };

  const value: GameSettingsContextType = {
    settings,
    updateSettings,
    resetSettings,
    getAnimationDuration,
    getAIDelayMs
  };

  return (
    <GameSettingsContext.Provider value={value}>
      {children}
    </GameSettingsContext.Provider>
  );
}

export function useGameSettings() {
  const context = useContext(GameSettingsContext);
  if (!context) {
    throw new Error('useGameSettings must be used within GameSettingsProvider');
  }
  return context;
}
