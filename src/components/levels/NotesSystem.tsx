import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Note = {
  id: string;
  text: string;
  category: string;
  timestamp: number;
};

type NotesSystemProps = {
  // Новый API
  onSaveNote?: (note: Omit<Note, 'id' | 'timestamp'>) => void;
  savedNotes?: Note[];
  categories?: Array<{ id: string; name: string; color: string }>;
  
  // Старый API для обратной совместимости
  notes?: string[];
  setNotes?: Dispatch<SetStateAction<string[]>>;
  placeholder?: string;
};

const NotesSystem: React.FC<NotesSystemProps> = ({
  onSaveNote,
  savedNotes = [],
  categories = [
    { id: "general", name: "Общее", color: "bg-blue-500" },
    { id: "idea", name: "Идея", color: "bg-green-500" },
    { id: "question", name: "Вопрос", color: "bg-purple-500" }
  ],
  // Старый API
  notes,
  setNotes,
  placeholder
}) => {
  // Конвертируем старый API в новый при необходимости
  const initialNotes = notes ? 
    notes.map((text, idx) => ({
      id: `note-${idx}`,
      text,
      category: "general",
      timestamp: Date.now() - (idx * 60000)
    })) : 
    savedNotes;

  const [internalNotes, setInternalNotes] = useState<Note[]>(initialNotes);
  const [noteText, setNoteText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '');
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Обновляем внутренний список заметок, если внешние данные изменились
  useEffect(() => {
    const notesChanged = JSON.stringify(notes) !== JSON.stringify(internalNotes.map(n => n.text));
    const savedNotesChanged = JSON.stringify(savedNotes) !== JSON.stringify(internalNotes);
    
    if (notes && notesChanged) {
      // Старый API
      setInternalNotes(notes.map((text, idx) => ({
        id: `note-${idx}`,
        text,
        category: "general",
        timestamp: Date.now() - (idx * 60000)
      })));
    } else if (savedNotes && savedNotesChanged) {
      // Новый API
      setInternalNotes(savedNotes);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(notes), JSON.stringify(savedNotes)]);
  
  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    
    const newNote: Note = {
      id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text: noteText.trim(),
      category: selectedCategory,
      timestamp: Date.now()
    };
    
    setInternalNotes(prevNotes => [...prevNotes, newNote]);
    
    // Поддержка старого API
    if (setNotes && notes) {
      setNotes([...notes, newNote.text]);
    }
    
    // Поддержка нового API
    if (onSaveNote) {
      onSaveNote({
        text: newNote.text,
        category: newNote.category
      });
    }
    
    setNoteText('');
  };
  
  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || 'bg-gray-200';
  };
  
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || '';
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Заголовок панели */}
      <div 
        className="bg-indigo-600 text-white p-3 flex items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3 className="text-lg font-semibold">Мои заметки</h3>
        <div className="ml-2 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          {internalNotes.length}
        </div>
        <button className="ml-auto">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'transform rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      {/* Содержимое панели */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {/* Форма добавления заметки */}
            <div className="p-4 border-b">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Категория
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-3 py-1 text-xs rounded-full ${
                        selectedCategory === category.id
                          ? `${category.color} text-white font-medium`
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-3">
                <label htmlFor="note-text" className="block text-sm font-medium text-gray-700 mb-1">
                  Текст заметки
                </label>
                <textarea
                  id="note-text"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 bg-slate-800 text-slate-200"
                  rows={3}
                  placeholder={placeholder || "Запишите важную мысль или инсайт..."}
                />
              </div>
              
              <button
                onClick={handleSaveNote}
                disabled={!noteText.trim()}
                className={`w-full py-2 px-4 rounded-md ${
                  noteText.trim()
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Сохранить заметку
              </button>
            </div>
            
            {/* Список заметок */}
            <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
              {internalNotes.length === 0 ? (
                <div className="p-4 text-center text-gray-500 italic">
                  У вас пока нет заметок. Добавьте первую заметку выше.
                </div>
              ) : (
                internalNotes.map(note => (
                  <div key={note.id} className="p-3 hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(note.category)}`}>
                        {getCategoryName(note.category)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(note.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{note.text}</p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotesSystem; 