import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { selectCharacter } from '../../store/slices/characterSlice';
import { RootState } from '../../store';
import { updateCharacterSelection, safeRedirect } from '../../lib/session';

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
  const [isRedirecting, setIsRedirecting] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { redirectTo } = router.query; 
  const currentCharacter = useSelector((state: RootState) => state.character.selectedCharacter);
  const { data: session } = useSession();
  const isMounted = useRef(true);

  // Устанавливаем флаг монтирования
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  
  // Сброс ошибки при монтировании
  useEffect(() => {
    setError(null);
  }, []);
  
  // Отладка путей изображений при монтировании компонента
  useEffect(() => {
    console.log('Доступные персонажи:', characters.map(char => ({ 
      id: char.id, 
      path: char.image,
      absolute: typeof window !== 'undefined' ? new URL(char.image, window.location.origin).href : null
    })));
    
    if (currentCharacter && isMounted.current) {
      setSelectedChar(currentCharacter.id);
      console.log('Текущий персонаж из хранилища:', currentCharacter);
    }
  }, [currentCharacter]);

  const handleSelectCharacter = (character: Character) => {
    console.log('handleSelectCharacter вызван:', {
      character,
      previousSelected: selectedChar
    });
    
    if (isMounted.current) {
      setSelectedChar(character.id);
      setError(null);
    }
  };

  const handleConfirm = async () => {
    if (!selectedChar) {
      setError('Пожалуйста, выберите персонажа');
      return;
    }
    
    if (isMounted.current) {
      setIsLoading(true);
      setError(null);
    }
    
    const character = characters.find(c => c.id === selectedChar);
    if (!character) {
      if (isMounted.current) {
        setError('Выбранный персонаж не найден');
        setIsLoading(false);
      }
      return;
    }
    
    try {
      if (!session || !session.user) {
        if (isMounted.current) {
          setError('Необходимо авторизоваться для выбора персонажа');
          setIsLoading(false);
        }
        return;
      }

      // Сохраняем в Redux
      dispatch(selectCharacter(character));
      
      // Показываем, что начали процесс перенаправления
      if (isMounted.current) {
        setIsRedirecting(true);
      }
      
      console.log('Отправка API запроса для выбора персонажа:', {
        characterId: character.id,
        characterType: character.type
      });
      
      // Создаем контроллер для возможности отмены запроса
      const controller = new AbortController();
      
      // Отправляем запрос на выбор персонажа
      const response = await axios.post('/api/character/select', {
        characterId: character.id,
        characterType: character.type
      }, {
        signal: controller.signal
      });

      // Проверяем, не размонтирован ли компонент
      if (!isMounted.current) {
        controller.abort();
        return;
      }

      if (!response.data) {
        throw new Error('Нет данных в ответе API');
      }

      if (response.data.success) {
        console.log('Персонаж успешно выбран, ответ сервера:', response.data);
        
        // Если сервер просит нас сделать принудительную перезагрузку
        if (response.data.requiresReload) {
          console.log('Выполняется принудительное обновление страницы для обновления сессии...');
          
          // Устанавливаем cookie с path='/', чтобы middleware мог его прочитать
          document.cookie = 'just_selected_character=true; path=/; max-age=60'; // живет 60 секунд
          console.log('Cookie установлен: just_selected_character=true');
          
          // Устанавливаем целевой URL в sessionStorage
          window.sessionStorage.setItem('redirectAfterReload', '/dashboard');
          
          // Принудительно перезагружаем страницу для обновления сессии
          console.log('Переход на /dashboard с перезагрузкой страницы');
          window.location.href = '/dashboard';
          return;
        }
        
        // Обычное перенаправление, если не требуется перезагрузка
        console.log('Стандартное перенаправление на /dashboard');
        safeRedirect('/dashboard');
      } else {
        throw new Error(response.data.message || 'Неизвестная ошибка при выборе персонажа');
      }
    } catch (err: any) {
      // Проверяем, не был ли запрос отменен из-за размонтирования
      if (err.name === 'CanceledError' || err.name === 'AbortError') {
        console.log('Запрос на выбор персонажа был отменен');
        return;
      }
      
      console.error('Ошибка при выборе персонажа:', err);
      
      if (isMounted.current) {
        setError(err.message || 'Произошла ошибка при сохранении персонажа');
        setIsRedirecting(false);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="py-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-300 px-4 py-3 rounded mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {isRedirecting && (
        <div className="bg-blue-500/10 border border-blue-500/50 text-blue-300 px-4 py-3 rounded mb-6">
          <p>Перенаправление после выбора персонажа...</p>
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
            <div className="flex flex-col items-center pointer-events-none">
              <div className="w-24 h-24 flex items-center justify-center mb-4">
                <img
                  src={character.image}
                  alt={character.name}
                  className="max-h-24 max-w-full object-contain"
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
                  {Object.entries(character.stats).map(([stat, value]) => (
                    <div key={stat}>
                      <span className="text-gray-400">{stat}:</span> 
                      <span className="text-indigo-300 ml-1">{value}/10</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center justify-center">
        <Button 
          onClick={handleConfirm} 
          disabled={!selectedChar || isLoading || isRedirecting}
          className="px-8 py-3"
        >
          {isLoading ? "Сохранение..." : isRedirecting ? "Перенаправление..." : "Подтвердить выбор"}
        </Button>
        {!selectedChar && (
          <p className="text-gray-400 text-sm mt-2">Выберите персонажа, чтобы продолжить</p>
        )}
      </div>
    </div>
  );
};