import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

interface UserState {
  id: string | null;
  username: string | null;
  email: string | null;
  avatar: string | null;
  level: number;
  points: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  id: null,
  username: null,
  email: null,
  avatar: null,
  level: 1,
  points: 0,
  isLoading: false,
  error: null
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
    incrementLevel: (state) => {
      state.level += 1;
    },
    addPoints: (state, action: PayloadAction<number>) => {
      state.points += action.payload;
      
      // Проверяем, нужно ли повысить уровень
      const pointsForNextLevel = state.level * 100;
      if (state.points >= pointsForNextLevel) {
        state.level += 1;
      }
    },
    setAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload;
    },
    resetUser: () => initialState,
    setUserLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setUserError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const {
  setUser,
  incrementLevel,
  addPoints,
  setAvatar,
  resetUser,
  setUserLoading,
  setUserError
} = userSlice.actions;

// Селекторы
export const selectUser = (state: RootState) => state.user;
export const selectUserId = (state: RootState) => state.user.id;
export const selectUserLevel = (state: RootState) => state.user.level;
export const selectUserPoints = (state: RootState) => state.user.points;
export const selectUserAvatar = (state: RootState) => state.user.avatar;
export const selectUserIsLoading = (state: RootState) => state.user.isLoading;
export const selectUserError = (state: RootState) => state.user.error;

export default userSlice.reducer; 