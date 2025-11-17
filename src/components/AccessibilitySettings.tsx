import { useState } from 'react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import '../styles/colorBlindMode.css';

/**
 * AccessibilitySettings component - Toggle accessibility features
 * Requirements: 7.2
 */
export function AccessibilitySettings() {
  const { settings, toggleColorBlindMode, toggleHighContrast, toggleReducedMotion } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="accessibility-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Accessibility settings"
        aria-expanded={isOpen}
        title="Accessibility settings"
      >
        <span aria-hidden="true">♿</span> A11y
      </button>

      {isOpen && (
        <div className="accessibility-settings" role="region" aria-label="Accessibility settings panel">
          <h3>Accessibility</h3>
          
          <label>
            <input
              type="checkbox"
              checked={settings.colorBlindMode}
              onChange={toggleColorBlindMode}
              aria-label="Enable color blind mode with suit patterns"
            />
            <span>Color Blind Mode</span>
          </label>

          <label>
            <input
              type="checkbox"
              checked={settings.highContrast}
              onChange={toggleHighContrast}
              aria-label="Enable high contrast mode"
            />
            <span>High Contrast</span>
          </label>

          <label>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={toggleReducedMotion}
              aria-label="Reduce animations and motion"
            />
            <span>Reduced Motion</span>
          </label>

          <button
            onClick={() => setIsOpen(false)}
            style={{
              marginTop: '8px',
              width: '100%',
              padding: '6px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '4px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.8em'
            }}
            aria-label="Close accessibility settings"
          >
            Close
          </button>
        </div>
      )}
    </>
  );
}
