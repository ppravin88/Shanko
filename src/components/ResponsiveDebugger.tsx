/**
 * Responsive Debugger Component
 * Development tool for testing responsive design
 * Only visible in development mode
 */

import { useState, useEffect } from 'react';
import { useResponsive } from '../hooks/useResponsive';
import { getBreakpointInfo, runResponsiveChecks, monitorPerformance } from '../utils/responsiveTesting';

export function ResponsiveDebugger() {
  const [isVisible, setIsVisible] = useState(false);
  const [checks, setChecks] = useState<{ passed: boolean; issues: string[] } | null>(null);
  const [perf, setPerf] = useState<any>(null);
  const screenSize = useResponsive();
  const breakpointInfo = getBreakpointInfo();

  // Only show in development
  useEffect(() => {
    if (import.meta.env.DEV) {
      // Listen for keyboard shortcut: Ctrl+Shift+D
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
          setIsVisible(prev => !prev);
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, []);

  const handleRunChecks = () => {
    const result = runResponsiveChecks();
    setChecks(result);
  };

  const handleCheckPerformance = () => {
    const perfData = monitorPerformance();
    setPerf(perfData);
  };

  if (!import.meta.env.DEV || !isVisible) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      right: 0,
      width: '350px',
      maxHeight: '500px',
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      color: '#fff',
      padding: '1rem',
      borderTopLeftRadius: '8px',
      zIndex: 10000,
      fontSize: '12px',
      overflowY: 'auto',
      fontFamily: 'monospace',
      boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0, fontSize: '14px' }}>📱 Responsive Debugger</h3>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '18px'
          }}
        >
          ×
        </button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '12px', color: '#4CAF50' }}>Screen Info</h4>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem' }}>
          <div>Width:</div>
          <div>{screenSize.width}px</div>
          <div>Height:</div>
          <div>{screenSize.height}px</div>
          <div>Device:</div>
          <div>{breakpointInfo.category}</div>
          <div>Orientation:</div>
          <div>{screenSize.orientation}</div>
          <div>Touch:</div>
          <div>{screenSize.isTouchDevice ? 'Yes' : 'No'}</div>
          <div>Pixel Ratio:</div>
          <div>{breakpointInfo.pixelRatio}x</div>
          <div>Card Size:</div>
          <div>{screenSize.cardSize}</div>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '12px', color: '#2196F3' }}>Breakpoints</h4>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            backgroundColor: screenSize.isMobile ? '#4CAF50' : '#333',
            fontSize: '10px'
          }}>
            Mobile
          </span>
          <span style={{
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            backgroundColor: screenSize.isTablet ? '#4CAF50' : '#333',
            fontSize: '10px'
          }}>
            Tablet
          </span>
          <span style={{
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            backgroundColor: screenSize.isDesktop ? '#4CAF50' : '#333',
            fontSize: '10px'
          }}>
            Desktop
          </span>
        </div>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={handleRunChecks}
          style={{
            width: '100%',
            padding: '0.5rem',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            marginBottom: '0.5rem'
          }}
        >
          Run Responsive Checks
        </button>
        
        <button
          onClick={handleCheckPerformance}
          style={{
            width: '100%',
            padding: '0.5rem',
            backgroundColor: '#2196F3',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Check Performance
        </button>
      </div>

      {checks && (
        <div style={{ marginBottom: '1rem' }}>
          <h4 style={{
            margin: '0 0 0.5rem 0',
            fontSize: '12px',
            color: checks.passed ? '#4CAF50' : '#f44336'
          }}>
            Checks: {checks.passed ? '✓ Passed' : '✗ Failed'}
          </h4>
          {checks.issues.length > 0 && (
            <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '11px' }}>
              {checks.issues.map((issue, index) => (
                <li key={index} style={{ color: '#f44336', marginBottom: '0.25rem' }}>
                  {issue}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {perf && (
        <div>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '12px', color: '#FF9800' }}>Performance</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem', fontSize: '11px' }}>
            <div>DOM Ready:</div>
            <div>{perf.domContentLoaded.toFixed(2)}ms</div>
            <div>Load Complete:</div>
            <div>{perf.loadComplete.toFixed(2)}ms</div>
            <div>First Paint:</div>
            <div>{perf.firstPaint.toFixed(2)}ms</div>
            <div>FCP:</div>
            <div>{perf.firstContentfulPaint.toFixed(2)}ms</div>
          </div>
        </div>
      )}

      <div style={{ marginTop: '1rem', fontSize: '10px', color: '#888', textAlign: 'center' }}>
        Press Ctrl+Shift+D to toggle
      </div>
    </div>
  );
}
