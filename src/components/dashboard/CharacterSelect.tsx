import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
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
  icon: string;
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
    icon: '/characters/product-lead-icon.png',
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
    icon: '/characters/agile-coach-icon.png',
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
    icon: '/characters/growth-hacker-icon.png',
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
    icon: '/characters/ux-visionary-icon.png',
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
    icon: '/characters/tech-pm-icon.png',
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
  const dispatch = useDispatch();
  const router = useRouter();
  const { redirectTo } = router.query; 
  const currentCharacter = useSelector((state: RootState) => state.character.selectedCharacter);
  
  useEffect(() => {
    if (currentCharacter) {
      setSelectedChar(currentCharacter.id);
    }
  }, [currentCharacter]);

  const handleSelectCharacter = (character: Character) => {
    setSelectedChar(character.id);
  };

  const handleConfirm = () => {
    if (selectedChar) {
      const character = characters.find(c => c.id === selectedChar);
      if (character) {
        dispatch(selectCharacter(character));
        
        // Если есть redirectTo, перенаправляем на эту страницу
        if (redirectTo && typeof redirectTo === 'string') {
          router.push(decodeURIComponent(redirectTo));
        } else {
          // Всегда перенаправляем на /levels (страница "Играть")
          router.push('/levels');
        }
      }
    }
  };

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {characters.map((character) => (
          <div 
            key={character.id} 
            className={`bg-slate-800 rounded-lg p-4 cursor-pointer transition-all hover:bg-slate-700 ${
              selectedChar === character.id ? 'ring-2 ring-blue-500 transform scale-105' : ''
            }`}
            style={{ 
              width: 'calc(100% + 50px)', 
              marginLeft: '-25px',
              paddingTop: '30px',
              paddingBottom: '30px'
            }}
            onClick={() => handleSelectCharacter(character)}
          >
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 flex items-center justify-center mb-4">
                <Image 
                  src={character.image} 
                  alt={character.name}
                  width={96}
                  height={96}
                  className="object-contain"
                  style={{ 
                    display: 'block', 
                    margin: '0 auto',
                    height: '120px',
                    objectFit: 'contain',
                    objectPosition: 'center'
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
          disabled={!selectedChar}
          className="px-8 py-3"
        >
          Подтвердить выбор
        </Button>
      </div>
    </div>
  );
}; 