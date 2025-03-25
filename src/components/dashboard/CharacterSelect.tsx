import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { selectCharacter } from '../../store/slices/characterSlice';
import { RootState } from '../../store';

// Создаём собственную кнопку, так как компонент Button не найден
const Button: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}> = ({ onClick, disabled, className, children }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${className} ${
        disabled
          ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
      } rounded-lg font-medium transition-colors`}
    >
      {children}
    </button>
  );
};

interface Character {
  id: string;
  name: string;
  image: string;
  description: string;
  role: string;
  difficulty: string;
  type: string;
  stats: {
    analytics: number;
    communication: number;
    strategy: number;
    technical: number;
    creativity: number;
    leadership?: number;
  };
}

const characters: Character[] = [
  {
    id: 'product-lead',
    name: 'Product Lead',
    image: '/characters/product-lead-full.png',
    description: 'Фокусируется на стратегическом планировании и балансировании потребностей.',
    role: 'Стратег',
    difficulty: 'Нормальная',
    type: 'product-lead',
    stats: {
      analytics: 7,
      communication: 7,
      strategy: 8,
      technical: 5,
      creativity: 5
    }
  },
  {
    id: 'agile-coach',
    name: 'Agile Coach',
    image: '/characters/agile-coach-full.png',
    description: 'Фокусируется на процессах и командной работе.',
    role: 'Поддержка',
    difficulty: 'Сложная',
    type: 'agile-coach',
    stats: {
      analytics: 5,
      communication: 9,
      strategy: 6,
      technical: 4,
      creativity: 4,
      leadership: 8
    }
  },
  {
    id: 'growth-hacker',
    name: 'Growth Hacker',
    image: '/characters/growth-hacker-full.png',
    description: 'Фокусируется на метриках и максимизации пользовательской базы.',
    role: 'DPS',
    difficulty: 'Экстрим',
    type: 'growth-hacker',
    stats: {
      analytics: 9,
      communication: 4,
      strategy: 6,
      technical: 7,
      creativity: 7
    }
  },
  {
    id: 'ux-visionary',
    name: 'UX Visionary',
    image: '/characters/ux-visionary-full.png',
    description: 'Фокусируется на пользовательском опыте и креативных решениях.',
    role: 'Дизайнер',
    difficulty: 'Легкая',
    type: 'ux-visionary',
    stats: {
      analytics: 6,
      communication: 7,
      strategy: 5,
      technical: 4,
      creativity: 9
    }
  },
  {
    id: 'tech-pm',
    name: 'Tech PM',
    image: '/characters/tech-pm-full.png',
    description: 'Технически ориентированный PM с глубоким пониманием разработки.',
    role: 'Гибрид',
    difficulty: 'Сложная',
    type: 'tech-pm',
    stats: {
      analytics: 6,
      communication: 5,
      strategy: 5,
      technical: 9,
      creativity: 5
    }
  }
];

export const CharacterSelect: React.FC = () => {
  const [selectedChar, setSelectedChar] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { redirectTo } = router.query; 
  const currentCharacter = useSelector((state: RootState) => state.character.selectedCharacter);
  const { data: session } = useSession();
  
  // Отладка путей изображений при монтировании компонента
  useEffect(() => {
    console.log('Доступные персонажи:', characters.map(char => ({ 
      id: char.id, 
      path: char.image,
      absolute: typeof window !== 'undefined' ? new URL(char.image, window.location.origin).href : null
    })));
    
    if (currentCharacter) {
      setSelectedChar(currentCharacter.id);
      console.log('Текущий персонаж из хранилища:', currentCharacter);
    }
  }, [currentCharacter]);

  const handleSelectCharacter = (character: Character) => {
    setSelectedChar(character.id);
    setError(null); // Сбрасываем ошибку при выборе нового персонажа
    console.log('Выбран персонаж:', character.id);
  };

  const handleConfirm = async () => {
    if (!selectedChar) return;
    
    setIsLoading(true);
    setError(null);
    
    const character = characters.find(c => c.id === selectedChar);
    if (!character) {
      setError('Выбранный персонаж не найден');
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('Отправляем API запрос на выбор персонажа:', character.id, character.type);
      console.log('Сессия пользователя:', session);
      
      if (!session || !session.user) {
        setError('Необходимо авторизоваться для выбора персонажа');
        setIsLoading(false);
        return;
      }
      
      // Сохраняем в Redux для обратной совместимости
      dispatch(selectCharacter(character));
      
      // Сохраняем выбор персонажа через API
      const response = await axios.post('/api/character/select', {
        characterId: character.id,
        characterType: character.type
      }, {
        headers: { 
          'Content-Type': 'application/json'
        },
        withCredentials: true // Для передачи cookies с сессией
      });
      
      console.log('Успешный API ответ:', response.data);
      
      // Обновляем сессию на клиенте, если API сигнализирует о необходимости
      if (response.data.refreshSession) {
        try {
          console.log('Обновляем сессию на клиенте...');
          // Вызываем специальный маршрут для обновления сессии
          await fetch('/api/auth/refresh', { 
            method: 'GET',
            cache: 'no-store',
            credentials: 'include'
          });
          
          // Также обновляем стандартный ендпоинт сессии NextAuth
          await fetch('/api/auth/session', { 
            method: 'GET',
            cache: 'no-store',
            credentials: 'include'
          });
        } catch (sessionError) {
          console.error('Ошибка при обновлении сессии:', sessionError);
          // Продолжаем процесс даже при ошибке обновления сессии
        }
      }
      
      // После успешного сохранения перенаправляем, используя принудительное перенаправление браузера
      if (response.data && response.data.redirect) {
        console.log('Перенаправление по данным API:', response.data.redirect);
        setTimeout(() => {
          window.location.href = response.data.redirect;
        }, 500); // Небольшая задержка для обновления сессии
      } else if (redirectTo && typeof redirectTo === 'string') {
        console.log('Перенаправление на:', decodeURIComponent(redirectTo));
        setTimeout(() => {
          window.location.href = decodeURIComponent(redirectTo);
        }, 500);
      } else {
        // По умолчанию перенаправляем на /dashboard
        console.log('Перенаправление на /dashboard');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 500);
      }
    } catch (err: any) {
      console.error('Ошибка при выборе персонажа:', err);
      const errorMessage = err.response?.data?.message || 'Произошла ошибка при сохранении персонажа';
      setError(errorMessage);
      
      // Дополнительная отладка ошибки
      if (err.response) {
        console.error('Данные ответа:', err.response.data);
        console.error('Статус ответа:', err.response.status);
        console.error('Заголовки ответа:', err.response.headers);
      } else if (err.request) {
        console.error('Запрос был отправлен, но ответ не получен', err.request);
      } else {
        console.error('Ошибка при настройке запроса:', err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {characters.map((character) => (
          <div 
            key={character.id} 
            className={`bg-slate-800 rounded-lg p-4 cursor-pointer transition-all hover:bg-slate-700 ${
              selectedChar === character.id ? 'ring-2 ring-blue-500 transform scale-105' : ''
            }`}
            onClick={() => handleSelectCharacter(character)}
          >
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 flex items-center justify-center mb-4">
                <img
                  src={`${character.image}?t=${new Date().getTime()}`}
                  alt={character.name}
                  className="max-h-24 max-w-full object-contain"
                  onLoad={() => console.log(`Изображение успешно загружено: ${character.image}`)}
                  onError={(e) => {
                    console.error(`Ошибка загрузки изображения для ${character.name}: ${character.image}`);
                    e.currentTarget.src = '/characters/product-lead-icon.png';
                  }}
                />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{character.name}</h3>
              <p className="text-xs text-gray-300 mb-2">{character.role} • {character.difficulty}</p>
              <p className="text-gray-300 text-center text-xs mb-3">{character.description}</p>
              
              <div className="w-full">
                <div className="grid grid-cols-1 gap-1 text-xs">
                  <div>
                    <span className="text-gray-400">Аналитика:</span> 
                    <span className="text-indigo-300 ml-1">{character.stats.analytics}/10</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Коммуникация:</span> 
                    <span className="text-indigo-300 ml-1">{character.stats.communication}/10</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Стратегия:</span> 
                    <span className="text-indigo-300 ml-1">{character.stats.strategy}/10</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Технические:</span> 
                    <span className="text-indigo-300 ml-1">{character.stats.technical}/10</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Креативность:</span> 
                    <span className="text-indigo-300 ml-1">{character.stats.creativity}/10</span>
                  </div>
                  {character.stats.leadership && (
                    <div>
                      <span className="text-gray-400">Лидерство:</span> 
                      <span className="text-indigo-300 ml-1">{character.stats.leadership}/10</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center">
        <Button 
          onClick={handleConfirm} 
          disabled={!selectedChar || isLoading}
          className="px-8 py-3"
        >
          {isLoading ? "Сохранение..." : "Подтвердить выбор"}
        </Button>
      </div>
    </div>
  );
};