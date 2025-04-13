import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { selectCharacter } from '../../store/slices/characterSlice';
import { RootState } from '../../store';

// Функция для безопасного перенаправления
const safeRedirect = (router: any, url: string) => {
  router.push(url).catch((err: any) => {
    console.error('Ошибка перенаправления:', err);
    window.location.href = url;
  });
};

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

// Типы персонажей
interface CharacterStats {
  analytics: number;
  communication: number;
  strategy: number;
  technical: number;
  creativity: number;
  leadership?: number;
}

interface Character {
  id: string;
  name: string;
  image: string;
  description: string;
  role: string;
  difficulty: string;
  type: string;
  stats: CharacterStats;
}

// Доступные персонажи
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
  const { user, isSignedIn } = useUser();
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
    
    try {
      const character = characters.find(c => c.id === selectedChar);
      
      if (!character) {
        if (isMounted.current) {
          setError('Выбранный персонаж не найден');
          setIsLoading(false);
        }
        return;
      }

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
        
        // После успешного сохранения на сервере обновляем Redux store
        dispatch(selectCharacter(character));
        
        // Определяем, куда перенаправлять пользователя
        let destination = '/dashboard';
        
        if (redirectTo && typeof redirectTo === 'string') {
          // Если есть параметр levelStage, добавляем его к URL назначения
          const levelStage = router.query.levelStage;
          
          if (levelStage) {
            // Проверяем, содержит ли redirectTo уже параметры
            if (redirectTo.includes('?')) {
              destination = `${redirectTo}&stage=${levelStage}`;
            } else {
              destination = `${redirectTo}?stage=${levelStage}`;
            }
          } else {
            destination = redirectTo;
          }
        }
          
        // Перенаправляем пользователя
        safeRedirect(router, destination);
      } else {
        throw new Error(response.data.message || 'Неизвестная ошибка');
      }
    } catch (err: any) {
      // Обрабатываем ошибки только если компонент не размонтирован
      if (isMounted.current) {
        console.error('Ошибка при выборе персонажа:', err);
        setError(err.message || 'Произошла ошибка при выборе персонажа');
        setIsLoading(false);
        setIsRedirecting(false);
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
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-slate-900 mb-4">
              <img 
                src={character.image} 
                alt={character.name} 
                className="object-cover"
                onError={(e) => {
                  console.error(`Ошибка загрузки изображения для ${character.name}:`, e);
                  // Устанавливаем путь к запасному изображению
                  e.currentTarget.src = '/characters/default.png';
                }}
              />
            </div>
            <h3 className="text-lg font-semibold mb-1">{character.name}</h3>
            <p className="text-slate-400 text-sm mb-2">{character.role} • {character.difficulty}</p>
            <p className="text-sm text-slate-300 line-clamp-3">{character.description}</p>
            
            <div className="mt-4 space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Аналитика:</span>
                <span className="text-indigo-400">{character.stats.analytics}/10</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Коммуникация:</span>
                <span className="text-indigo-400">{character.stats.communication}/10</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Стратегия:</span>
                <span className="text-indigo-400">{character.stats.strategy}/10</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Техничность:</span>
                <span className="text-indigo-400">{character.stats.technical}/10</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Креативность:</span>
                <span className="text-indigo-400">{character.stats.creativity}/10</span>
              </div>
              {character.stats.leadership && (
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Лидерство:</span>
                  <span className="text-indigo-400">{character.stats.leadership}/10</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-end mt-4">
        <button
          className={`px-4 py-2 rounded-md ${
            !selectedChar
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-500'
          }`}
          onClick={handleConfirm}
          disabled={!selectedChar || isLoading}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Сохранение...
            </span>
          ) : 'Подтвердить выбор'}
        </button>
      </div>
    </div>
  );
};