import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import axios from 'axios';

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
  isLoading: boolean;
  error: string | null;
}

const initialState: CharacterState = {
  selectedCharacter: null,
  isLoading: false,
  error: null
};

export const characterSlice = createSlice({
  name: 'character',
  initialState,
  reducers: {
    selectCharacter: (state, action: PayloadAction<Character>) => {
      state.selectedCharacter = action.payload;
      // Сохраняем выбор персонажа в localStorage для кэширования
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedCharacter', JSON.stringify(action.payload));
      }
    },
    resetCharacter: (state) => {
      state.selectedCharacter = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('selectedCharacter');
      }
    },
    setCharacterLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCharacterError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const { 
  selectCharacter, 
  resetCharacter,
  setCharacterLoading,
  setCharacterError
} = characterSlice.actions;

// Селекторы
export const selectSelectedCharacter = (state: RootState) => state.character.selectedCharacter;
export const selectCharacterLoading = (state: RootState) => state.character.isLoading;
export const selectCharacterError = (state: RootState) => state.character.error;

// Создаем асинхронный thunk для инициализации персонажа
// Приоритет: 1) Сессия NextAuth -> 2) API запрос -> 3) localStorage
export const initializeCharacter = createAsyncThunk(
  'character/initializeCharacter',
  async (session: any, { dispatch }) => {
    dispatch(setCharacterLoading(true));
    dispatch(setCharacterError(null));
    
    try {
      // Если сессии нет (пользователь не аутентифицирован), просто сбрасываем персонажа
      if (session === null) {
        console.log('Пользователь не аутентифицирован, сбрасываем персонажа');
        dispatch(resetCharacter());
        dispatch(setCharacterLoading(false));
        return null;
      }
      
      // Сначала попробуем получить данные из localStorage
      let localStorageCharacter = null;
      if (typeof window !== 'undefined') {
        const savedCharacter = localStorage.getItem('selectedCharacter');
        
        if (savedCharacter) {
          try {
            const character = JSON.parse(savedCharacter);
            
            // Проверяем, содержит ли объект все необходимые поля
            if (character && character.id && character.name) {
              console.log('Используем данные персонажа из localStorage для быстрой загрузки');
              localStorageCharacter = character;
              
              // Устанавливаем персонажа из localStorage для быстрого отображения UI
              dispatch(selectCharacter(character));
            }
          } catch (error) {
            console.error('Ошибка при чтении данных персонажа из localStorage:', error);
            localStorage.removeItem('selectedCharacter');
          }
        }
      }
      
      // Затем запрашиваем актуальные данные с сервера для синхронизации
      try {
        console.log('Запрашиваем данные персонажа с сервера');
        const response = await axios.get('/api/character/current');
        
        if (response.data.success) {
          if (response.data.character) {
            // Если сервер вернул персонажа, обновляем его в хранилище
            console.log('Получен персонаж с сервера:', response.data.character);
            dispatch(selectCharacter(response.data.character));
            dispatch(setCharacterLoading(false));
            return response.data.character;
          } else if (response.data.dbError) {
            // Если есть ошибка базы данных, но у нас есть данные из localStorage
            console.log('Ошибка при получении персонажа с сервера, используем localStorage:', response.data.message);
            
            if (localStorageCharacter) {
              dispatch(selectCharacter(localStorageCharacter));
              dispatch(setCharacterLoading(false));
              return localStorageCharacter;
            }
          } else {
            // Если сервер вернул успех, но нет персонажа
            console.log('Сервер не вернул данные персонажа');
            
            if (localStorageCharacter) {
              // Если у нас есть данные в localStorage, используем их
              dispatch(selectCharacter(localStorageCharacter));
              dispatch(setCharacterLoading(false));
              return localStorageCharacter;
            } else {
              // У пользователя нет персонажа
              dispatch(resetCharacter());
              dispatch(setCharacterLoading(false));
              return null;
            }
          }
        } else {
          // Если сервер вернул ошибку, но у нас есть данные из localStorage
          if (localStorageCharacter) {
            console.log('Ошибка при получении персонажа с сервера, используем localStorage:', response.data.message);
            dispatch(setCharacterLoading(false));
            return localStorageCharacter;
          }
        }
      } catch (apiError) {
        console.log('Не удалось получить данные персонажа с сервера, используем localStorage');
        
        // Если была ошибка API, но у нас есть данные из localStorage
        if (localStorageCharacter) {
          dispatch(setCharacterLoading(false));
          return localStorageCharacter;
        }
      }
      
      // Если мы дошли до этой точки, значит нет данных ни на сервере, ни в localStorage
      dispatch(resetCharacter());
      dispatch(setCharacterLoading(false));
      return null;
    } catch (error) {
      console.error('Ошибка при инициализации персонажа:', error);
      dispatch(setCharacterError('Не удалось загрузить персонажа'));
      dispatch(setCharacterLoading(false));
      return null;
    }
  }
);

// Хелпер для получения имени персонажа по типу
function getCharacterNameByType(type: string): string {
  const names: Record<string, string> = {
    'product-lead': 'Product Lead',
    'agile-coach': 'Agile Coach',
    'growth-hacker': 'Growth Hacker', 
    'ux-visionary': 'UX Visionary',
    'tech-pm': 'Tech PM'
  };
  
  return names[type] || 'Неизвестный персонаж';
}

export default characterSlice.reducer; 