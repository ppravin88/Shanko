/**
 * Responsive Testing Utilities
 * Helper functions for testing responsive design across different devices
 */

export interface DeviceProfile {
  name: string;
  width: number;
  height: number;
  pixelRatio: number;
  userAgent: string;
  touch: boolean;
  orientation: 'portrait' | 'landscape';
}

// Common device profiles for testing
export const DEVICE_PROFILES: Record<string, DeviceProfile> = {
  // iOS Devices
  'iPhone SE': {
    name: 'iPhone SE',
    width: 375,
    height: 667,
    pixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
    touch: true,
    orientation: 'portrait'
  },
  'iPhone 12/13': {
    name: 'iPhone 12/13',
    width: 390,
    height: 844,
    pixelRatio: 3,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
    touch: true,
    orientation: 'portrait'
  },
  'iPhone 14 Pro Max': {
    name: 'iPhone 14 Pro Max',
    width: 430,
    height: 932,
    pixelRatio: 3,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15',
    touch: true,
    orientation: 'portrait'
  },
  'iPad Mini': {
    name: 'iPad Mini',
    width: 768,
    height: 1024,
    pixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
    touch: true,
    orientation: 'portrait'
  },
  'iPad Air': {
    name: 'iPad Air',
    width: 820,
    height: 1180,
    pixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
    touch: true,
    orientation: 'portrait'
  },
  'iPad Pro 12.9"': {
    name: 'iPad Pro 12.9"',
    width: 1024,
    height: 1366,
    pixelRatio: 2,
    userAgent: 'Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
    touch: true,
    orientation: 'portrait'
  },

  // Android Devices
  'Samsung Galaxy S21': {
    name: 'Samsung Galaxy S21',
    width: 360,
    height: 800,
    pixelRatio: 3,
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G991B) AppleWebKit/537.36',
    touch: true,
    orientation: 'portrait'
  },
  'Samsung Galaxy S21 Ultra': {
    name: 'Samsung Galaxy S21 Ultra',
    width: 384,
    height: 854,
    pixelRatio: 3.5,
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-G998B) AppleWebKit/537.36',
    touch: true,
    orientation: 'portrait'
  },
  'Google Pixel 6': {
    name: 'Google Pixel 6',
    width: 412,
    height: 915,
    pixelRatio: 2.625,
    userAgent: 'Mozilla/5.0 (Linux; Android 12; Pixel 6) AppleWebKit/537.36',
    touch: true,
    orientation: 'portrait'
  },
  'Samsung Galaxy Tab S7': {
    name: 'Samsung Galaxy Tab S7',
    width: 753,
    height: 1037,
    pixelRatio: 2,
    userAgent: 'Mozilla/5.0 (Linux; Android 11; SM-T870) AppleWebKit/537.36',
    touch: true,
    orientation: 'portrait'
  },

  // Desktop
  'Desktop 1080p': {
    name: 'Desktop 1080p',
    width: 1920,
    height: 1080,
    pixelRatio: 1,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    touch: false,
    orientation: 'landscape'
  },
  'Desktop 1440p': {
    name: 'Desktop 1440p',
    width: 2560,
    height: 1440,
    pixelRatio: 1,
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    touch: false,
    orientation: 'landscape'
  }
};

/**
 * Get landscape version of a device profile
 */
export function getLandscapeProfile(profile: DeviceProfile): DeviceProfile {
  return {
    ...profile,
    width: profile.height,
    height: profile.width,
    orientation: 'landscape'
  };
}

/**
 * Simulate device viewport for testing
 */
export function simulateDevice(profile: DeviceProfile) {
  // Set viewport size
  if (typeof window !== 'undefined') {
    // Note: This won't actually resize the browser window in production
    // It's mainly for development/testing purposes
    console.log(`Simulating ${profile.name}:`);
    console.log(`- Viewport: ${profile.width}x${profile.height}`);
    console.log(`- Pixel Ratio: ${profile.pixelRatio}`);
    console.log(`- Touch: ${profile.touch}`);
    console.log(`- Orientation: ${profile.orientation}`);
  }
}

/**
 * Check if current viewport matches a device category
 */
export function getDeviceCategory(): 'mobile' | 'tablet' | 'desktop' {
  const width = window.innerWidth;
  
  if (width < 768) {
    return 'mobile';
  } else if (width < 1024) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}

/**
 * Get responsive breakpoint information
 */
export function getBreakpointInfo() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const category = getDeviceCategory();
  const orientation = height > width ? 'portrait' : 'landscape';
  const pixelRatio = window.devicePixelRatio || 1;
  
  return {
    width,
    height,
    category,
    orientation,
    pixelRatio,
    isRetina: pixelRatio >= 2,
    isMobile: category === 'mobile',
    isTablet: category === 'tablet',
    isDesktop: category === 'desktop',
    isPortrait: orientation === 'portrait',
    isLandscape: orientation === 'landscape'
  };
}

/**
 * Log responsive design information for debugging
 */
export function logResponsiveInfo() {
  const info = getBreakpointInfo();
  
  console.group('📱 Responsive Design Info');
  console.log('Device Category:', info.category);
  console.log('Viewport:', `${info.width}x${info.height}`);
  console.log('Orientation:', info.orientation);
  console.log('Pixel Ratio:', info.pixelRatio);
  console.log('Is Retina:', info.isRetina);
  console.log('Touch Support:', 'ontouchstart' in window);
  console.groupEnd();
}

/**
 * Test checklist for responsive design
 */
export const RESPONSIVE_TEST_CHECKLIST = {
  mobile: [
    'Cards are readable and appropriately sized',
    'Touch targets are at least 44x44px',
    'Buttons are easy to tap without mis-taps',
    'Text is readable without zooming',
    'Game board fits in viewport without horizontal scroll',
    'Dialogs appear as bottom sheets',
    'Player hand cards can be selected with tap',
    'Game controls are accessible without scrolling',
    'Orientation change is handled smoothly',
    'Safe area insets are respected (notches)'
  ],
  tablet: [
    'Layout uses available space efficiently',
    'Cards are appropriately sized for screen',
    'Two-column button layout works well',
    'Scoreboard is readable',
    'Melded sets display properly',
    'Dialogs are centered and sized appropriately',
    'Both portrait and landscape orientations work',
    'Touch gestures work smoothly',
    'Game board sections are well-proportioned'
  ],
  desktop: [
    'Full layout with sidebar is displayed',
    'Hover effects work on cards and buttons',
    'Cards are full size and detailed',
    'All game elements are visible without scrolling',
    'Keyboard navigation works',
    'Mouse interactions are smooth',
    'Large screens use space effectively'
  ],
  general: [
    'No horizontal scrolling on any screen size',
    'Animations are smooth (or disabled if reduced motion)',
    'Color contrast is sufficient',
    'Focus indicators are visible',
    'Loading states are clear',
    'Error messages are readable',
    'Game state is always clear',
    'Performance is acceptable (60fps)'
  ]
};

/**
 * Run automated responsive checks
 */
export function runResponsiveChecks(): { passed: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Check viewport meta tag
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  if (!viewportMeta) {
    issues.push('Missing viewport meta tag');
  }
  
  // Check for horizontal scroll
  if (document.body.scrollWidth > window.innerWidth) {
    issues.push('Horizontal scrolling detected');
  }
  
  // Check touch target sizes
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button, index) => {
    const rect = button.getBoundingClientRect();
    if (rect.width < 44 || rect.height < 44) {
      issues.push(`Button ${index} is too small for touch (${rect.width}x${rect.height})`);
    }
  });
  
  // Check text readability
  const minFontSize = 14;
  const allText = document.querySelectorAll('p, span, button, a, li');
  allText.forEach((element, index) => {
    const fontSize = parseFloat(window.getComputedStyle(element).fontSize);
    if (fontSize < minFontSize) {
      issues.push(`Text element ${index} has font size ${fontSize}px (minimum ${minFontSize}px)`);
    }
  });
  
  return {
    passed: issues.length === 0,
    issues
  };
}

/**
 * Performance monitoring for responsive design
 */
export function monitorPerformance() {
  if (typeof window === 'undefined' || !window.performance) {
    return null;
  }
  
  const perfData = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  return {
    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
    loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
    domInteractive: perfData.domInteractive - perfData.fetchStart,
    firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime || 0,
    firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime || 0
  };
}
