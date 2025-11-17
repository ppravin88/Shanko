import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './gameSlice';
import playersReducer from './playersSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    players: playersReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Re-export selectors for convenience
export * from './selectors';
