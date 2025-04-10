import { configureStore } from '@reduxjs/toolkit';
import characterReducer from './slices/characterSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    character: characterReducer,
    user: userReducer
  },
  devTools: process.env.NODE_ENV !== 'production',
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Игнорируем несериализуемые значения в состоянии
        ignoredActions: [],
        ignoredPaths: [],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store; 