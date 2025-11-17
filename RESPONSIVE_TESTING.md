# Responsive Design Testing Guide

This document provides comprehensive testing procedures for the Shanko Card Game responsive design implementation.

## Overview

The game supports three main device categories:
- **Mobile** (< 768px): Portrait and landscape phones
- **Tablet** (768px - 1023px): Portrait and landscape tablets
- **Desktop** (1024px+): Desktop and laptop screens

## Testing Tools

### 1. Browser DevTools
- Chrome DevTools Device Mode
- Firefox Responsive Design Mode
- Safari Responsive Design Mode

### 2. Real Devices
Test on actual devices for the most accurate results:
- iOS devices (iPhone, iPad)
- Android devices (phones and tablets)
- Desktop browsers (Chrome, Firefox, Safari, Edge)

### 3. Development Debugger
Press `Ctrl+Shift+D` in development mode to open the responsive debugger panel.

## Device Testing Matrix

### iOS Devices

#### iPhone SE (375x667)
- [ ] Cards are readable and appropriately sized
- [ ] Touch targets are at least 44x44px
- [ ] Game board fits without horizontal scroll
- [ ] Dialogs appear as bottom sheets
- [ ] Portrait orientation works correctly
- [ ] Landscape orientation works correctly

#### iPhone 12/13 (390x844)
- [ ] All mobile features work
- [ ] Notch safe area is respected
- [ ] Dynamic island doesn't obscure content
- [ ] Both orientations work smoothly

#### iPhone 14 Pro Max (430x932)
- [ ] Larger screen space is utilized
- [ ] Cards scale appropriately
- [ ] All touch interactions work
- [ ] Safe areas are respected

#### iPad Mini (768x1024)
- [ ] Tablet layout is displayed
- [ ] Two-column button layout works
- [ ] Scoreboard is readable
- [ ] Portrait mode optimized
- [ ] Landscape mode optimized
- [ ] Split-screen multitasking works

#### iPad Air (820x1180)
- [ ] Layout uses space efficiently
- [ ] Cards are appropriately sized
- [ ] All tablet features work
- [ ] Both orientations work

#### iPad Pro 12.9" (1024x1366)
- [ ] Desktop layout may appear
- [ ] Large screen space is utilized
- [ ] All features are accessible
- [ ] Performance is smooth

### Android Devices

#### Samsung Galaxy S21 (360x800)
- [ ] Mobile layout works correctly
- [ ] Touch gestures are responsive
- [ ] Cards are readable
- [ ] No horizontal scrolling
- [ ] Both orientations work

#### Samsung Galaxy S21 Ultra (384x854)
- [ ] All mobile features work
- [ ] High pixel density handled
- [ ] Performance is acceptable
- [ ] Touch interactions smooth

#### Google Pixel 6 (412x915)
- [ ] Mobile layout optimized
- [ ] Material Design principles followed
- [ ] All features accessible
- [ ] Smooth animations

#### Samsung Galaxy Tab S7 (753x1037)
- [ ] Tablet layout displayed
- [ ] S Pen interactions work (if applicable)
- [ ] Both orientations optimized
- [ ] Performance is smooth

### Desktop Browsers

#### 1080p (1920x1080)
- [ ] Full desktop layout
- [ ] Sidebar visible
- [ ] Hover effects work
- [ ] Keyboard navigation works
- [ ] All features accessible

#### 1440p (2560x1440)
- [ ] Large screen layout
- [ ] Space utilized efficiently
- [ ] High DPI rendering correct
- [ ] Performance excellent

## Feature Testing Checklist

### Mobile (< 768px)

#### Layout
- [ ] Game board fits in viewport without horizontal scroll
- [ ] Header stacks vertically
- [ ] Scoreboard is compact but readable
- [ ] Piles area is accessible
- [ ] Player hand displays correctly

#### Touch Interactions
- [ ] Cards can be selected with tap
- [ ] Buttons are easy to tap (min 44x44px)
- [ ] No accidental mis-taps
- [ ] Drag gestures work (if implemented)
- [ ] Swipe gestures work (if implemented)

#### Dialogs
- [ ] Appear as bottom sheets
- [ ] Have drag handle indicator
- [ ] Can be dismissed easily
- [ ] Content is scrollable if needed
- [ ] Buttons are full-width

#### Cards
- [ ] Appropriate size for screen
- [ ] Readable rank and suit
- [ ] Selection state is clear
- [ ] Animations are smooth

#### Controls
- [ ] All buttons accessible without scrolling
- [ ] Button text is readable
- [ ] Icons are clear
- [ ] Disabled states are obvious

#### Orientation Changes
- [ ] Portrait to landscape transition smooth
- [ ] Layout adjusts appropriately
- [ ] No content loss during transition
- [ ] Game state preserved

### Tablet (768px - 1023px)

#### Layout
- [ ] Sidebar visible in landscape
- [ ] Stacked layout in portrait
- [ ] Two-column button layout works
- [ ] Space utilized efficiently
- [ ] All sections visible

#### Touch Interactions
- [ ] Touch targets appropriately sized
- [ ] Gestures work smoothly
- [ ] No lag or delay
- [ ] Multi-touch works (if applicable)

#### Cards
- [ ] Medium size cards displayed
- [ ] Readable and detailed
- [ ] Selection clear
- [ ] Animations smooth

#### Dialogs
- [ ] Centered on screen
- [ ] Appropriate size (max 600px)
- [ ] Buttons in row layout
- [ ] Content well-organized

#### Orientation
- [ ] Portrait mode optimized
- [ ] Landscape mode optimized
- [ ] Smooth transitions
- [ ] Layout adapts correctly

### Desktop (1024px+)

#### Layout
- [ ] Full layout with sidebar
- [ ] All sections visible
- [ ] No wasted space
- [ ] Proper spacing and padding

#### Mouse Interactions
- [ ] Hover effects work
- [ ] Click interactions precise
- [ ] Cursor changes appropriately
- [ ] No touch-specific UI shown

#### Keyboard Navigation
- [ ] Tab order is logical
- [ ] Focus indicators visible
- [ ] Keyboard shortcuts work
- [ ] All features accessible

#### Cards
- [ ] Large size cards displayed
- [ ] Full detail visible
- [ ] Hover effects work
- [ ] Selection clear

#### Performance
- [ ] 60fps animations
- [ ] No lag or stutter
- [ ] Smooth scrolling
- [ ] Fast interactions

## Automated Testing

### Run Responsive Checks
```typescript
import { runResponsiveChecks } from './utils/responsiveTesting';

const result = runResponsiveChecks();
console.log('Passed:', result.passed);
console.log('Issues:', result.issues);
```

### Monitor Performance
```typescript
import { monitorPerformance } from './utils/responsiveTesting';

const perf = monitorPerformance();
console.log('Performance metrics:', perf);
```

### Log Responsive Info
```typescript
import { logResponsiveInfo } from './utils/responsiveTesting';

logResponsiveInfo();
```

## Manual Testing Procedures

### 1. Visual Inspection
1. Open game in browser
2. Open DevTools
3. Enable device mode
4. Test each device profile
5. Check for:
   - Layout issues
   - Overlapping elements
   - Cut-off content
   - Misaligned elements
   - Incorrect spacing

### 2. Interaction Testing
1. Test all buttons and controls
2. Verify touch targets are adequate
3. Test card selection
4. Test dialog interactions
5. Test game flow

### 3. Orientation Testing
1. Start in portrait
2. Rotate to landscape
3. Verify layout adjusts
4. Rotate back to portrait
5. Verify no issues

### 4. Performance Testing
1. Open Performance tab in DevTools
2. Record interaction
3. Check for:
   - Frame drops
   - Long tasks
   - Layout thrashing
   - Memory leaks

### 5. Accessibility Testing
1. Test with keyboard only
2. Test with screen reader
3. Check color contrast
4. Verify focus indicators
5. Test with reduced motion

## Common Issues and Solutions

### Issue: Horizontal Scrolling
**Solution:** Check for fixed-width elements, ensure max-width: 100%

### Issue: Touch Targets Too Small
**Solution:** Increase button padding, ensure min 44x44px

### Issue: Text Too Small
**Solution:** Increase font-size, ensure min 14px on mobile

### Issue: Layout Breaks on Orientation Change
**Solution:** Use flexible units (%, vh, vw), test both orientations

### Issue: Animations Janky
**Solution:** Use transform/opacity only, enable GPU acceleration

### Issue: Content Cut Off
**Solution:** Check viewport height, use safe area insets

## Browser-Specific Testing

### Safari (iOS)
- [ ] Viewport height handles correctly (100vh vs 100dvh)
- [ ] Safe area insets respected
- [ ] Touch events work
- [ ] Animations smooth
- [ ] No webkit-specific issues

### Chrome (Android)
- [ ] Address bar hiding handled
- [ ] Touch events work
- [ ] Performance acceptable
- [ ] No chrome-specific issues

### Firefox
- [ ] Layout consistent
- [ ] Touch events work
- [ ] Performance good
- [ ] No firefox-specific issues

## Performance Benchmarks

### Mobile
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Frame rate: 60fps
- Touch response: < 100ms

### Tablet
- First Contentful Paint: < 1s
- Time to Interactive: < 2s
- Frame rate: 60fps
- Touch response: < 100ms

### Desktop
- First Contentful Paint: < 0.8s
- Time to Interactive: < 1.5s
- Frame rate: 60fps
- Mouse response: < 50ms

## Reporting Issues

When reporting responsive design issues, include:
1. Device/browser information
2. Screen size and orientation
3. Steps to reproduce
4. Expected vs actual behavior
5. Screenshots or video
6. Console errors (if any)

## Continuous Testing

- Test on every major feature addition
- Test on every layout change
- Test on every CSS update
- Test on multiple devices regularly
- Monitor user feedback for issues

## Resources

- [MDN Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Web.dev Responsive Design](https://web.dev/responsive-web-design-basics/)
- [Can I Use](https://caniuse.com/) - Browser compatibility
- [BrowserStack](https://www.browserstack.com/) - Real device testing
