import React, { useState } from 'react';
import MentorTip from '../../shared/feedback/MentorTip';
import StepNavigation from '../../shared/navigation/StepNavigation';
import { styles } from '../common/styles';
import { motion } from 'framer-motion';

interface PracticeStageProps {
  goToNextStage: () => void;
  goToPreviousStage: () => void;
  isLoading: boolean;
  notes?: string[];
  setNotes?: (notes: string[]) => void;
}

// Компонент для интерактивного взаимодействия (выбор вариантов)
const SelectionCard: React.FC<{
  title: string;
  description: string;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ title, description, isSelected, onSelect }) => {
  return (
    <motion.div
      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
        isSelected
          ? 'bg-indigo-900/30 border-indigo-500'
          : 'bg-slate-800 border-slate-700 hover:border-slate-500'
      }`}
      onClick={onSelect}
      whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center">
        <div className={`w-5 h-5 rounded border mr-3 flex-shrink-0 ${
          isSelected
            ? 'bg-indigo-500 border-indigo-600'
            : 'border-slate-500'
        }`}>
          {isSelected && (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <div>
          <h3 className="font-medium text-white">{title}</h3>
          <p className="text-slate-300 text-sm">{description}</p>
        </div>
      </div>
    </motion.div>
  );
};

// Компонент заметок
const NotesSection: React.FC<{
  notes: string[];
  setNotes: (notes: string[]) => void;
}> = ({ notes, setNotes }) => {
  const [newNote, setNewNote] = useState<string>('');
  
  const handleAddNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, newNote.trim()]);
      setNewNote('');
    }
  };
  
  const handleDeleteNote = (index: number) => {
    const updatedNotes = [...notes];
    updatedNotes.splice(index, 1);
    setNotes(updatedNotes);
  };
  
  return (
    <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">Заметки</h3>
      
      <div className="flex mb-4">
        <input
          type="text"
          className="flex-grow bg-slate-700 text-white p-2 rounded-l border border-slate-600"
          placeholder="Добавить заметку..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
        />
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r transition-colors"
          onClick={handleAddNote}
        >
          Добавить
        </button>
      </div>
      
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {notes.length === 0 ? (
          <p className="text-slate-400 text-center italic">Нет заметок</p>
        ) : (
          notes.map((note, index) => (
            <div key={index} className="flex justify-between items-center bg-slate-700/50 p-3 rounded">
              <p className="text-slate-300">{note}</p>
              <button
                className="text-red-400 hover:text-red-300"
                onClick={() => handleDeleteNote(index)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const PracticeStageTemplate: React.FC<PracticeStageProps> = ({
  goToNextStage,
  goToPreviousStage,
  isLoading,
  notes = [],
  setNotes = () => {}
}) => {
  // Состояния для компонента
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [textInput, setTextInput] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);
  
  // Обработчики событий
  const handleOptionSelect = (option: string) => {
    setSelectedOptions(prev => 
      prev.includes(option) 
        ? prev.filter(o => o !== option) 
        : [...prev, option]
    );
  };
  
  const handleSubmit = () => {
    setSubmitted(true);
  };
  
  // Шаги для StepNavigation
  const steps = [
    // Шаг 1: Введение в практическое задание
    <div key="intro" className={styles.contentBlock}>
      <h2 className={styles.h3}>Введение в практическое задание</h2>
      <p className={styles.paragraph}>
        Описание практического задания, которое предстоит выполнить пользователю.
        Здесь можно представить контекст, цели и ожидаемые результаты.
      </p>
      
      <div className="bg-indigo-900/30 p-4 rounded-lg border border-indigo-800 mt-6 mb-6">
        <h3 className="text-indigo-400 font-semibold mb-2">Цели задания:</h3>
        <ul className={styles.list}>
          <li>Цель 1</li>
          <li>Цель 2</li>
          <li>Цель 3</li>
        </ul>
      </div>
      
      <MentorTip
        tip="Это подсказка ментора для первого шага. Тут можно дать дополнительный контекст или рекомендации."
        position="bottom-right"
      />
    </div>,

    // Шаг 2: Анализ информации
    <div key="analysis" className={styles.contentBlock}>
      <h2 className={styles.h3}>Анализ информации</h2>
      <p className={styles.paragraph}>
        Представление информации, которую пользователь должен проанализировать для выполнения задания.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <h3 className={styles.h4}>Раздел 1</h3>
          <p className="text-slate-300">Описание первого раздела информации.</p>
        </div>
        
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          <h3 className={styles.h4}>Раздел 2</h3>
          <p className="text-slate-300">Описание второго раздела информации.</p>
        </div>
      </div>
      
      {notes && setNotes && (
        <NotesSection notes={notes} setNotes={setNotes} />
      )}
      
      <MentorTip
        tip="Это подсказка ментора для второго шага. Тут можно акцентировать внимание на важных аспектах."
        position="bottom-left"
      />
    </div>,

    // Шаг 3: Выбор решения
    <div key="solution" className={styles.contentBlock}>
      <h2 className={styles.h3}>Выбор решения</h2>
      <p className={styles.paragraph}>
        На основе проанализированной информации пользователь должен выбрать решение
        или предложить свой вариант.
      </p>
      
      <div className="space-y-3 mb-6">
        {['option1', 'option2', 'option3', 'option4'].map(option => (
          <SelectionCard
            key={option}
            title={`Вариант ${option.slice(-1)}`}
            description={`Описание варианта ${option.slice(-1)}`}
            isSelected={selectedOptions.includes(option)}
            onSelect={() => handleOptionSelect(option)}
          />
        ))}
      </div>
      
      <div className="bg-slate-800/50 p-5 rounded-lg border border-slate-700 mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Обоснование выбора</h3>
        <textarea
          className="w-full bg-slate-700 text-white p-4 rounded border border-slate-600 min-h-32"
          placeholder="Опишите, почему вы выбрали эти варианты..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        />
      </div>
      
      <MentorTip
        tip="Это подсказка ментора для третьего шага. Здесь можно дать рекомендации по выбору решения."
        position="top-right"
      />
    </div>,

    // Шаг 4: Завершение и рефлексия
    <div key="reflection" className={styles.contentBlock}>
      <h2 className={styles.h3}>Завершение и рефлексия</h2>
      <p className={styles.paragraph}>
        Подведение итогов практического задания и рефлексия полученного опыта.
      </p>
      
      <div className="bg-indigo-900/30 p-5 rounded-lg border border-indigo-800 mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Ключевые выводы:</h3>
        <ul className={styles.list}>
          <li>Вывод 1</li>
          <li>Вывод 2</li>
          <li>Вывод 3</li>
        </ul>
      </div>
      
      {!submitted ? (
        <div className="flex justify-center">
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-lg transition-colors"
            onClick={handleSubmit}
          >
            Завершить задание
          </button>
        </div>
      ) : (
        <div className="bg-green-900/30 p-5 rounded-lg border border-green-800">
          <h3 className="text-xl font-semibold text-green-400 mb-4">Задание выполнено!</h3>
          <p className="text-slate-300">
            Отличная работа! Вы успешно выполнили практическое задание.
            Нажмите "К следующему этапу" для продолжения.
          </p>
        </div>
      )}
      
      <MentorTip
        tip="Это заключительная подсказка ментора. Здесь можно дать общие рекомендации или наставления для следующего этапа."
        position="bottom-right"
      />
    </div>
  ];

  return (
    <div className={styles.card}>
      <h1 className={styles.levelTitle}>Название практического задания</h1>
      <p className={styles.levelSubtitle}>Практическое задание</p>
      
      <StepNavigation
        steps={steps}
        onComplete={goToNextStage}
        showBackButton={true}
        continueButtonText="Далее"
        completeButtonText="Завершить"
        showProgress={true}
        showStepNumbers={true}
      />
    </div>
  );
};

export default PracticeStageTemplate; 