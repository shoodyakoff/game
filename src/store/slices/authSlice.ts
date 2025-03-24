import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  role: string;
  hasCharacter?: boolean;
  fullName?: string;
  bio?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  hasCharacter: boolean;
}

// Интерфейсы для авторизации и регистрации
interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

// API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Асинхронные действия
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, remember = false }: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      // Сохраняем в localStorage всегда, чтобы сессия сохранялась между обновлениями страницы
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 
        'Ошибка входа. Пожалуйста, проверьте введенные данные.'
      );
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ username, email, password }: RegisterCredentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password
      });
      
      return response.data;
    } catch (error: any) {
      console.error('Ошибка регистрации:', error);
      
      // Детальное логирование ошибки
      if (error.response) {
        // Сервер вернул ответ с кодом ошибки
        console.error('Ответ сервера:', error.response.data);
        console.error('Статус ответа:', error.response.status);
        console.error('Заголовки ответа:', error.response.headers);
      } else if (error.request) {
        // Запрос был сделан, но нет ответа
        console.error('Запрос без ответа:', error.request);
      } else {
        // Что-то другое вызвало ошибку
        console.error('Сообщение об ошибке:', error.message);
      }
      
      return rejectWithValue(error.response?.data?.message || 'Ошибка при регистрации');
    }
  }
);

export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Получаем токен из state
      const state = getState() as { auth: AuthState };
      const token = state.auth.token;
      
      if (!token) {
        throw new Error('Токен не найден');
      }
      
      // Отправляем запрос с токеном
      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 
        'Не удалось получить данные пользователя'
      );
    }
  }
);

export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { dispatch, getState }) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const state = getState() as { auth: AuthState };

      // Если у нас есть токен в localStorage, но нет в state (или пользователь не аутентифицирован), 
      // пытаемся восстановить сессию
      if (token && (!state.auth.token || !state.auth.isAuthenticated)) {
        try {
          // Пытаемся получить данные пользователя по токену
          await dispatch(getMe());
        } catch (error) {
          console.error('Ошибка при проверке статуса аутентификации:', error);
          // В случае ошибки выходим из системы
          dispatch(logout());
        }
      }
    }
  }
);

// Получение пользователя из localStorage, если он есть
// Безопасно получаем данные из localStorage только на клиенте
const getAuthStateFromStorage = () => {
  if (typeof window === 'undefined') {
    // На сервере возвращаем пустые значения
    return { user: null, token: null, isAuthenticated: false, hasCharacter: false };
  }
  
  // На клиенте пытаемся получить данные из localStorage
  try {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    let user = null;
    
    if (userJson) {
      user = JSON.parse(userJson);
    }
    
    return {
      user,
      token,
      isAuthenticated: !!token,
      hasCharacter: user?.hasCharacter || false
    };
  } catch (error) {
    console.error('Ошибка при получении данных из localStorage', error);
    return { user: null, token: null, isAuthenticated: false, hasCharacter: false };
  }
};

// Начальное состояние
const initialState: AuthState = {
  ...getAuthStateFromStorage(),
  loading: false,
  error: null
};

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.hasCharacter = false;
      
      // Очищаем localStorage при выходе
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Обработка login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<{ user: User; token: string; hasCharacter?: boolean }>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.hasCharacter = action.payload.hasCharacter || false;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Ошибка входа';
    });
    
    // Обработка register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action: PayloadAction<{ user: User; token: string; hasCharacter?: boolean }>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.hasCharacter = action.payload.hasCharacter || false;
      
      // Сохраняем в localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string || 'Ошибка регистрации';
    });
    
    // Обработка getMe
    builder.addCase(getMe.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getMe.fulfilled, (state, action: PayloadAction<{ user: User }>) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    });
    builder.addCase(getMe.rejected, (state, action) => {
      state.loading = false;
      // Если ошибка аутентификации, выходим из системы
      if (action.payload === 'Токен не найден' || 
          action.payload === 'Недействительный токен' || 
          action.payload === 'Токен истек') {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.hasCharacter = false;
        
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 