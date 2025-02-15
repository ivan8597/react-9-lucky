import { configureStore } from '@reduxjs/toolkit';
import memeReducer from './features/memeSlice.ts';

const store = configureStore({
  reducer: {
    meme: memeReducer,
  },
});

// Определяем тип состояния
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;