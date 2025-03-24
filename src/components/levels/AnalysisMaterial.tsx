import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Feedback = {
  id: number;
  user: string;
  rating: number;
  text: string;
  date: string;
};

type Analytics = {
  task_creation: {
    total_attempts: number;
    completed: number;
    abandoned: number;
    completion_rate: number;
    avg_time_seconds: number;
    by_device: {
      desktop: {
        attempts: number;
        completed: number;
        rate: number;
      };
      mobile: {
        attempts: number;
        completed: number;
        rate: number;
      };
    };
    drop_off_points: {
      step: string;
      drop_rate: number;
    }[];
  };
  user_retention: {
    overall: number;
    users_with_task_creation_issues: number;
  };
};

type InterfaceStep = {
  step: number;
  name: string;
  description: string;
};

type Interview = {
  person: string;
  feedback: string[];
};

type AnalysisMaterialProps = {
  materialType: 'user_feedback' | 'analytics' | 'interface' | 'interviews';
  data: any;
  onSaveNote?: (note: string) => void;
};

const AnalysisMaterial: React.FC<AnalysisMaterialProps> = ({
  materialType,
  data,
  onSaveNote
}) => {
  const [note, setNote] = useState('');
  const [showNoteForm, setShowNoteForm] = useState(false);
  
  const handleSaveNote = () => {
    if (note.trim() && onSaveNote) {
      onSaveNote(note);
      setNote('');
      setShowNoteForm(false);
    }
  };
  
  const renderUserFeedback = () => {
    const feedbackData = data.user_feedback;
    if (!feedbackData) return <p>Данные отзывов недоступны</p>;
    
    return (
      <div>
        <div className="summary-box bg-slate-700 p-4 rounded-lg mb-4">
          <h4 className="text-indigo-300 font-medium mb-2">Сводка по отзывам:</h4>
          <p className="text-slate-300 text-sm">{feedbackData.summary}</p>
        </div>
        
        <div className="space-y-4">
          {feedbackData.feedbacks.map((feedback: any) => (
            <div key={feedback.id} className="bg-slate-700 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium text-white">{feedback.userName}</div>
                <div className="flex items-center">
                  <span className={`inline-block h-2 w-2 rounded-full mr-1 ${
                    feedback.rating >= 4 ? 'bg-green-500' : 
                    feedback.rating >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></span>
                  <span className="text-sm text-slate-400">{feedback.rating}/5</span>
                </div>
              </div>
              <p className="text-slate-300 text-sm mb-2">{feedback.text}</p>
              <div className="text-xs text-slate-500">{feedback.date}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const renderAnalytics = () => {
    const analyticsData = data.analytics;
    if (!analyticsData) return <p>Аналитические данные недоступны</p>;
    
    return (
      <div>
        <div className="mb-6">
          <h4 className="text-indigo-300 font-medium mb-3">Конверсия создания задач:</h4>
          <div className="bg-slate-700 p-4 rounded-lg">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-indigo-200 text-indigo-900">
                    Начали создание
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-indigo-300">
                    100%
                  </span>
                </div>
              </div>
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-indigo-200 text-indigo-900">
                    Заполнили основные поля
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-indigo-300">
                    {analyticsData.conversion.filled_main_fields}%
                  </span>
                </div>
              </div>
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-indigo-200 text-indigo-900">
                    Заполнили дополнительные поля
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-indigo-300">
                    {analyticsData.conversion.filled_additional_fields}%
                  </span>
                </div>
              </div>
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-indigo-200 text-indigo-900">
                    Завершили создание
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-indigo-300">
                    {analyticsData.conversion.completed_task_creation}%
                  </span>
                </div>
              </div>
              <div className="flex mb-2 items-center justify-between">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div className="flex mb-2 items-center justify-between">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${analyticsData.conversion.filled_main_fields}%` }}></div>
                </div>
              </div>
              <div className="flex mb-2 items-center justify-between">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${analyticsData.conversion.filled_additional_fields}%` }}></div>
                </div>
              </div>
              <div className="flex mb-2 items-center justify-between">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: `${analyticsData.conversion.completed_task_creation}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-700 p-4 rounded-lg">
            <h5 className="text-indigo-300 font-medium mb-2">Среднее время создания</h5>
            <p className="text-2xl font-bold text-white">{analyticsData.averages.time_to_create_task}</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <h5 className="text-indigo-300 font-medium mb-2">Заполняемых полей</h5>
            <p className="text-2xl font-bold text-white">{analyticsData.averages.fields_filled_per_task}</p>
          </div>
          <div className="bg-slate-700 p-4 rounded-lg">
            <h5 className="text-indigo-300 font-medium mb-2">Отказов от создания</h5>
            <p className="text-2xl font-bold text-white">{analyticsData.averages.abandonment_rate}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-indigo-300 font-medium mb-3">Показатели по устройствам:</h4>
            <div className="bg-slate-700 p-4 rounded-lg">
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-slate-300">Десктоп</span>
                  <span className="text-sm text-slate-300">{analyticsData.device_stats.desktop_completion_rate}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: analyticsData.device_stats.desktop_completion_rate }}></div>
                </div>
              </div>
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-slate-300">Планшет</span>
                  <span className="text-sm text-slate-300">{analyticsData.device_stats.tablet_completion_rate}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: analyticsData.device_stats.tablet_completion_rate }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-slate-300">Мобильный</span>
                  <span className="text-sm text-slate-300">{analyticsData.device_stats.mobile_completion_rate}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: analyticsData.device_stats.mobile_completion_rate }}></div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 className="text-indigo-300 font-medium mb-3">Точки отказа:</h4>
            <div className="bg-slate-700 p-4 rounded-lg">
              <div className="space-y-3">
                {analyticsData.common_exit_points.map((point: any, index: number) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-slate-300">{point.field}</span>
                      <span className="text-sm text-slate-300">{point.exit_percentage}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: point.exit_percentage }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderInterface = () => {
    const interfaceData = data.interface;
    if (!interfaceData) return <p>Данные интерфейса недоступны</p>;
    
    return (
      <div>
        <div className="mb-6">
          <h4 className="text-indigo-300 font-medium mb-3">Текущий процесс создания задачи:</h4>
          <div className="bg-slate-700 p-4 rounded-lg">
            <div className="relative">
              {interfaceData.current_flow.map((step: any, index: number) => (
                <div key={index} className="mb-6 last:mb-0">
                  <div className="flex">
                    <div className="mr-4 flex flex-col items-center">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500 text-white text-sm font-bold">
                        {step.step}
                      </div>
                      {index < interfaceData.current_flow.length - 1 && (
                        <div className="h-full w-0.5 bg-indigo-200 mt-2"></div>
                      )}
                    </div>
                    <div>
                      <h5 className="font-medium text-white">{step.screen}</h5>
                      {step.action && <p className="text-sm text-slate-300 mt-1">{step.action}</p>}
                      {step.fields && (
                        <div className="mt-2">
                          <p className="text-xs text-slate-400 mb-1">Поля на экране:</p>
                          <div className="flex flex-wrap gap-2">
                            {step.fields.map((field: string, i: number) => (
                              <span 
                                key={i} 
                                className={`text-xs px-2 py-1 rounded ${
                                  field.includes('*') 
                                    ? 'bg-red-900 text-red-100' 
                                    : 'bg-slate-600 text-slate-300'
                                }`}
                              >
                                {field}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="text-indigo-300 font-medium mb-3">Основные проблемы интерфейса:</h4>
          <div className="bg-slate-700 p-4 rounded-lg">
            <ul className="space-y-2">
              {interfaceData.pain_points.map((point: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-4 h-4 rounded-full bg-red-500 mt-1 mr-2"></span>
                  <span className="text-slate-300">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div>
          <h4 className="text-indigo-300 font-medium mb-3">Скриншоты интерфейса:</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {interfaceData.screenshots.map((screenshot: any, index: number) => (
              <div key={index} className="bg-slate-700 rounded-lg overflow-hidden">
                <div className="p-2 bg-slate-800">
                  <p className="text-xs text-slate-300 text-center">{screenshot.screen}</p>
                </div>
                <div className="p-2">
                  <div className="w-full h-40 bg-slate-800 flex items-center justify-center rounded">
                    <p className="text-slate-500 text-xs">[Изображение: {screenshot.screen}]</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  const renderInterviews = () => {
    const interviewData = data.interviews;
    if (!interviewData) return <p>Данные интервью недоступны</p>;
    
    return (
      <div>
        <div className="mb-6">
          <h4 className="text-indigo-300 font-medium mb-3">Участники интервью:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interviewData.participants.map((participant: any) => (
              <div key={participant.id} className="bg-slate-700 p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-medium text-white">{participant.name}</h5>
                    <p className="text-sm text-slate-400">{participant.occupation}, {participant.age} лет</p>
                  </div>
                  <span className="bg-indigo-500 text-xs text-white px-2 py-1 rounded">
                    {participant.usage}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="text-indigo-300 font-medium mb-3">Ключевые наблюдения:</h4>
          <div className="bg-slate-700 p-4 rounded-lg">
            <ul className="space-y-2">
              {interviewData.key_findings.map((finding: string, index: number) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block text-indigo-300 mr-2">•</span>
                  <span className="text-slate-300">{finding}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div>
          <h4 className="text-indigo-300 font-medium mb-3">Цитаты участников:</h4>
          <div className="space-y-4">
            {interviewData.quotes.map((quote: any, index: number) => {
              const participant = interviewData.participants.find((p: any) => p.id === quote.participant);
              return (
                <div key={index} className="bg-slate-700 p-4 rounded-lg">
                  <p className="text-slate-300 mb-2 italic">"{quote.quote}"</p>
                  <p className="text-right text-sm text-slate-400">— {participant ? participant.name : 'Участник'}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
  
  const renderContent = () => {
    switch (materialType) {
      case 'user_feedback':
        return renderUserFeedback();
      case 'analytics':
        return renderAnalytics();
      case 'interface':
        return renderInterface();
      case 'interviews':
        return renderInterviews();
      default:
        return <p>Выберите материал для анализа</p>;
    }
  };
  
  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">
          {materialType === 'user_feedback' && 'Отзывы пользователей'}
          {materialType === 'analytics' && 'Аналитика использования'}
          {materialType === 'interface' && 'Текущий интерфейс'}
          {materialType === 'interviews' && 'Интервью с пользователями'}
        </h3>
        <button 
          onClick={() => setShowNoteForm(!showNoteForm)} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-1 rounded-md flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Добавить заметку
        </button>
      </div>
      
      <AnimatePresence>
        {showNoteForm && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-slate-700 p-4 rounded-lg">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-md p-2 mb-3"
                placeholder="Запишите ваши наблюдения или выводы..."
                rows={3}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowNoteForm(false)}
                  className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-1 rounded-md text-sm"
                >
                  Отмена
                </button>
                <button
                  onClick={handleSaveNote}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm"
                >
                  Сохранить
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div>
        {renderContent()}
      </div>
    </div>
  );
};

export default AnalysisMaterial; 