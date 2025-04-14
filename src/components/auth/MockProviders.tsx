import React, { createContext, useContext, useState, useEffect } from 'react';

// Интерфейс для мок-пользователя
interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  emailAddresses: { emailAddress: string }[];
  profileImageUrl: string;
}

// Интерфейс для контекста мок-клерка
interface MockClerkContextType {
  user: MockUser | null;
  isSignedIn: boolean;
  isLoaded: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Создаем контекст с дефолтными значениями
const MockClerkContext = createContext<MockClerkContextType>({
  user: null,
  isSignedIn: false,
  isLoaded: false,
  signIn: async () => {},
  signOut: async () => {},
});

// Хуки для использования контекста
export const useMockClerk = () => useContext(MockClerkContext);
export const useMockUser = () => useContext(MockClerkContext).user;

// Мок-данные пользователя
const mockUserData: MockUser = {
  id: 'mock-user-123',
  firstName: 'Тестовый',
  lastName: 'Пользователь',
  emailAddresses: [{ emailAddress: 'test@example.com' }],
  profileImageUrl: 'https://via.placeholder.com/150',
};

// Компонент-провайдер для мок-авторизации
export const MockClerkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Состояния для имитации процесса авторизации
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState<MockUser | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);

  // Имитация загрузки данных пользователя при первом рендере
  useEffect(() => {
    const savedSignInState = localStorage.getItem('mockClerkSignedIn') === 'true';
    setTimeout(() => {
      setUser(savedSignInState ? mockUserData : null);
      setIsSignedIn(savedSignInState);
      setIsLoaded(true);
    }, 800); // Имитация задержки загрузки
  }, []);

  // Функция для входа пользователя
  const signIn = async (email: string, password: string) => {
    setIsLoaded(false);
    setTimeout(() => {
      setUser(mockUserData);
      localStorage.setItem('mockClerkSignedIn', 'true');
      setIsSignedIn(true);
      setIsLoaded(true);
    }, 1000);
  };

  // Функция для выхода пользователя
  const signOut = async () => {
    setIsLoaded(false);
    setTimeout(() => {
      setUser(null);
      localStorage.setItem('mockClerkSignedIn', 'false');
      setIsSignedIn(false);
      setIsLoaded(true);
    }, 800);
  };

  return (
    <MockClerkContext.Provider value={{ user, isSignedIn, isLoaded, signIn, signOut }}>
      {children}
    </MockClerkContext.Provider>
  );
};

// Компонент кнопки пользователя
export const MockUserButton: React.FC = () => {
  const { user, signOut } = useMockClerk();

  if (!user) return null;

  return (
    <div className="mock-user-button">
      <div className="flex items-center gap-2 py-2 px-4">
        <img src={user.profileImageUrl} alt="Аватар" className="w-8 h-8 rounded-full" />
        <span>{user.firstName} {user.lastName}</span>
        <button 
          onClick={() => signOut()}
          className="ml-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm"
        >
          Выход
        </button>
      </div>
    </div>
  );
};

// Компонент формы входа
export const MockSignIn: React.FC = () => {
  const { signIn } = useMockClerk();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
    // Имитация перенаправления на главную страницу после входа
    window.location.href = '/';
  };

  return (
    <div className="mock-sign-in">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Вход в систему</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="email@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="••••••••"
          />
        </div>
        <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
          Войти
        </button>
      </form>
    </div>
  );
};

// Компонент формы регистрации
export const MockSignUp: React.FC = () => {
  const { signIn } = useMockClerk();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password); // После регистрации сразу входим
    // Имитация перенаправления на главную страницу после регистрации
    window.location.href = '/';
  };

  return (
    <div className="mock-sign-up">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Регистрация</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
            <input 
              type="text" 
              value={firstName} 
              onChange={(e) => setFirstName(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Имя"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Фамилия</label>
            <input 
              type="text" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)} 
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Фамилия"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="email@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Пароль</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="••••••••"
          />
        </div>
        <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
          Зарегистрироваться
        </button>
      </form>
    </div>
  );
}; 