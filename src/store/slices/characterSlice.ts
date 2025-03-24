import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';

interface Character {
  id: string;
  name: string;
  image: string;
  icon?: string;
  description: string;
  type?: string;
  role?: string;
  difficulty?: string;
  stats?: {
    analytics?: number;
    communication?: number;
    strategy?: number;
    technical?: number;
    creativity?: number;
    leadership?: number;
  };
}

interface CharacterState {
  selectedCharacter: Character | null;
}

const initialState: CharacterState = {
  selectedCharacter: null
};

export const characterSlice = createSlice({
  name: 'character',
  initialState,
  reducers: {
    selectCharacter: (state, action: PayloadAction<Character>) => {
      state.selectedCharacter = action.payload;
      // Сохраняем выбор персонажа в localStorage для сохранения между сессиями
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedCharacter', JSON.stringify(action.payload));
      }
    },
    resetCharacter: (state) => {
      state.selectedCharacter = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('selectedCharacter');
      }
    }
  }
});

export const { selectCharacter, resetCharacter } = characterSlice.actions;

// Селекторы
export const selectSelectedCharacter = (state: RootState) => state.character.selectedCharacter;

// Создаем асинхронный thunk для инициализации персонажа из localStorage
export const initializeCharacter = createAsyncThunk(
  'character/initializeCharacter',
  async (_, { dispatch }) => {
    if (typeof window !== 'undefined') {
      const savedCharacter = localStorage.getItem('selectedCharacter');
      
      if (savedCharacter) {
        try {
          const character = JSON.parse(savedCharacter);
          
          // Проверяем, содержит ли объект все необходимые поля
          if (character && character.id && character.name) {
            dispatch(selectCharacter(character));
          }
        } catch (error) {
          console.error('Ошибка при чтении данных персонажа из localStorage:', error);
          localStorage.removeItem('selectedCharacter');
        }
      }
    }
  }
);

export default characterSlice.reducer; 