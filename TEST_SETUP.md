# Test Setup Instructions

## Prerequisites

The test suite requires vitest to be installed. Since Node.js/npm is not currently available in the PATH, please follow these steps:

## Installation Steps

1. Ensure Node.js and npm are installed and available in your PATH
2. Install test dependencies:
   ```bash
   npm install -D vitest @vitest/ui jsdom
   ```

## Running Tests

Once dependencies are installed, you can run tests using:

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui
```

## Test Coverage

The DeckManager tests cover:
- Deck creation for different player counts (2-8 players)
- Card uniqueness across multiple decks
- Deck composition (52 standard cards + 4 Jokers per deck)
- Shuffle algorithm validation
- Error handling for invalid player counts

## Test File Location

- `src/engines/DeckManager.test.ts` - Unit tests for DeckManager class
