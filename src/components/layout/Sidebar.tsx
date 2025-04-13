import React from 'react';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

type SidebarProps = {
  activePage: 'dashboard' | 'levels' | 'profile';
};

const Sidebar: React.FC<SidebarProps> = ({ activePage }) => {
  // Получаем информацию о выбранном персонаже из Redux-хранилища
  const selectedCharacter = useSelector((state: RootState) => state.character.selectedCharacter);

  // Отображаем тип персонажа в читаемом формате
  const getCharacterTypeLabel = (type: string | undefined): string => {
    switch (type) {
      case 'product-lead': return 'Стратег';
      case 'agile-coach': return 'Поддержка';
      case 'growth-hacker': return 'DPS';
      case 'ux-visionary': return 'Дизайнер';
      case 'tech-pm': return 'Гибрид';
      default: return 'Персонаж';
    }
  };

  // Получаем иконку персонажа
  const getCharacterIconPath = (characterId: string | undefined): string => {
    if (!characterId) return '/characters/product-lead-icon.png'; // Дефолтная иконка
    
    // Проверяем, заканчивается ли id на -icon
    if (characterId.endsWith('-icon')) {
      return `/characters/${characterId}.png`;
    }
    
    // Если нет, добавляем суффикс -icon
    return `/characters/${characterId}-icon.png`;
  };

  return (
    <div className="md:w-1/4">
      {/* Блок информации о персонаже */}
      <div className="card mb-6">
        {selectedCharacter ? (
          <div className="p-3 bg-slate-800 rounded-lg">
            <h4 className="text-sm uppercase text-slate-400 font-medium tracking-wider mb-2">ВАШ ПЕРСОНАЖ</h4>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-600/30 rounded-lg flex items-center justify-center mr-3">
                <img 
                  src={getCharacterIconPath(selectedCharacter.id)}
                  alt={selectedCharacter.name}
                  className="w-full h-full object-contain rounded-lg"
                  onError={(e) => {
                    // Если изображение не найдено, используем дефолтную иконку
                    e.currentTarget.src = '/characters/product-lead-icon.png';
                  }}
                />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">{selectedCharacter.name}</h3>
                <div className="flex mt-1">
                  <span className="text-xs text-indigo-400 px-2 py-0.5 bg-indigo-900/30 rounded">
                    {getCharacterTypeLabel(selectedCharacter.type)}
                  </span>
                </div>
              </div>
            </div>
            <Link 
              href="/character" 
              className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 inline-flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m-4 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              Сменить персонажа
            </Link>
          </div>
        ) : (
          <div className="p-3 bg-slate-800 rounded-lg">
            <h4 className="text-sm uppercase text-slate-400 font-medium tracking-wider mb-2">ВАШ ПЕРСОНАЖ</h4>
            <p className="text-slate-300 text-sm mb-3">Вы еще не выбрали персонажа</p>
            <Link 
              href="/character" 
              className="inline-flex items-center text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Выбрать персонажа
            </Link>
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-slate-700">
          <h4 className="text-sm uppercase text-slate-500 font-medium tracking-wider mb-3">НАВИГАЦИЯ</h4>
          <ul className="space-y-2">
            <li>
              <Link 
                href="/dashboard" 
                className={`flex items-center ${activePage === 'dashboard' 
                  ? 'text-white bg-slate-700 hover:bg-slate-600' 
                  : 'text-slate-300 hover:bg-slate-700'} rounded-lg p-2 transition-colors`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Прогресс
              </Link>
            </li>
            <li>
              <Link 
                href="/levels" 
                className={`flex items-center ${activePage === 'levels' 
                  ? 'text-white bg-slate-700 hover:bg-slate-600' 
                  : 'text-slate-300 hover:bg-slate-700'} rounded-lg p-2 transition-colors`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Играть
              </Link>
            </li>
            <li>
              <Link 
                href="/profile" 
                className={`flex items-center ${activePage === 'profile' 
                  ? 'text-white bg-slate-700 hover:bg-slate-600' 
                  : 'text-slate-300 hover:bg-slate-700'} rounded-lg p-2 transition-colors`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Профиль
              </Link>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Блок поддержки */}
      <div className="card p-4 bg-gradient-to-r from-indigo-600 to-purple-600">
        <h3 className="font-bold text-lg mb-2">Нужна помощь?</h3>
        <p className="text-slate-200 text-sm mb-3">Напишите нам на почту s.hoodyakoff.accs@gmail.com</p>
      </div>
    </div>
  );
};

export default Sidebar; 