import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export type GlossaryTerm = {
  id: string;
  term: string;
  definition: string;
  category: string;
  examples?: string[];
  relatedTerms?: string[];
};

type GlossaryProps = {
  terms: GlossaryTerm[];
  position?: 'fixed' | 'absolute';
  isOpen: boolean;
  onClose: () => void;
};

const Glossary: React.FC<GlossaryProps> = ({
  terms,
  position = 'fixed',
  isOpen,
  onClose
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLetter, setSelectedLetter] = useState<string>('all');
  const modalRef = useRef<HTMLDivElement>(null);
  
  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Сброс фильтров при открытии глоссария
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedCategory('all');
      setSelectedLetter('all');
    }
  }, [isOpen]);
  
  // Извлечение уникальных категорий
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    terms.forEach(term => uniqueCategories.add(term.category));
    return ['all', ...Array.from(uniqueCategories)];
  }, [terms]);
  
  // Извлечение всех начальных букв терминов
  const alphabet = useMemo(() => {
    const letters = new Set<string>();
    terms.forEach(term => {
      const firstLetter = term.term.charAt(0).toUpperCase();
      if (/[А-Я]/.test(firstLetter)) {
        letters.add(firstLetter);
      }
    });
    return ['all', ...Array.from(letters).sort()];
  }, [terms]);
  
  // Фильтрация терминов
  const filteredTerms = useMemo(() => {
    return terms.filter(term => {
      // Фильтр по поиску
      const matchesSearch = searchQuery === '' || 
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Фильтр по категории
      const matchesCategory = selectedCategory === 'all' || term.category === selectedCategory;
      
      // Фильтр по букве
      const matchesLetter = selectedLetter === 'all' || 
        term.term.charAt(0).toUpperCase() === selectedLetter;
      
      return matchesSearch && matchesCategory && matchesLetter;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [terms, searchQuery, selectedCategory, selectedLetter]);
  
  // Группировка терминов по первой букве для алфавитного отображения
  const groupedTerms = useMemo(() => {
    const grouped: Record<string, GlossaryTerm[]> = {};
    
    filteredTerms.forEach(term => {
      const firstLetter = term.term.charAt(0).toUpperCase();
      if (!grouped[firstLetter]) {
        grouped[firstLetter] = [];
      }
      grouped[firstLetter].push(term);
    });
    
    return Object.keys(grouped)
      .sort()
      .reduce((result: Record<string, GlossaryTerm[]>, key) => {
        result[key] = grouped[key];
        return result;
      }, {});
  }, [filteredTerms]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className={`${position} inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50`}
    >
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Заголовок */}
        <div className="bg-indigo-700 text-white p-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Глоссарий продуктовых терминов</h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-indigo-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Поиск и фильтры */}
        <div className="p-4 border-b">
          <div className="relative mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск терминов..."
              className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 absolute left-3 top-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Категория
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'Все категории' : category}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="w-full md:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Буква
              </label>
              <div className="flex flex-wrap gap-1">
                {alphabet.map(letter => (
                  <button
                    key={letter}
                    onClick={() => setSelectedLetter(letter)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium ${
                      selectedLetter === letter
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {letter === 'all' ? '#' : letter}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Список терминов */}
        <div className="flex-grow overflow-y-auto p-4">
          {Object.keys(groupedTerms).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg">Термины не найдены</p>
              <p className="text-sm">Попробуйте изменить параметры поиска или фильтры</p>
            </div>
          ) : (
            Object.keys(groupedTerms).map(letter => (
              <div key={letter} className="mb-6 last:mb-0">
                <h3 className="text-xl font-bold text-indigo-700 mb-2 border-b border-indigo-200 pb-1">
                  {letter}
                </h3>
                <div className="space-y-4">
                  {groupedTerms[letter].map(term => (
                    <div key={term.id} className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors">
                      <div className="flex justify-between items-start">
                        <h4 className="text-lg font-semibold text-gray-800">{term.term}</h4>
                        <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">
                          {term.category}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-1">{term.definition}</p>
                      
                      {term.examples && term.examples.length > 0 && (
                        <div className="mt-2">
                          <h5 className="text-sm font-medium text-gray-700">Примеры:</h5>
                          <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
                            {term.examples.map((example, index) => (
                              <li key={index}>{example}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {term.relatedTerms && term.relatedTerms.length > 0 && (
                        <div className="mt-2">
                          <h5 className="text-sm font-medium text-gray-700">Связанные термины:</h5>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {term.relatedTerms.map((relatedTerm, index) => (
                              <span key={index} className="text-xs px-2 py-1 bg-gray-200 rounded-full text-gray-700">
                                {relatedTerm}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* Информация о количестве терминов */}
        <div className="p-3 bg-gray-100 text-sm text-gray-600 border-t">
          {filteredTerms.length > 0 ? (
            <span>Показано {filteredTerms.length} из {terms.length} терминов</span>
          ) : (
            <span>Нет терминов для отображения. Измените параметры фильтрации.</span>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Glossary; 