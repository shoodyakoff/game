import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

// Типы для компонента
interface MentorTipProps {
  content: React.ReactNode; // Содержимое подсказки
  position?: 'left' | 'right' | 'top' | 'bottom' | 'auto'; // Предпочтительное расположение блока
  iconPosition?: 'fixed' | 'absolute' | 'relative'; // Способ позиционирования иконки
  className?: string; // Дополнительные классы для стилизации
}

/**
 * Компонент "Ментор" для отображения контекстной подсказки
 * 
 * @param content - Содержимое подсказки (текст или JSX)
 * @param position - Предпочтительное расположение блока (default: 'auto')
 * @param iconPosition - Способ позиционирования иконки (default: 'relative')
 * @param className - Дополнительные классы
 */
const MentorTip: React.FC<MentorTipProps> = ({
  content,
  position = 'auto',
  iconPosition = 'relative',
  className = '',
}) => {
  // Состояние для отображения/скрытия подсказки
  const [isOpen, setIsOpen] = useState(false);
  
  // Состояние для вычисленной позиции
  const [computedPosition, setComputedPosition] = useState({
    top: 0,
    left: 0,
    arrowPosition: 'bottom',
  });
  
  // Ссылки на DOM-элементы для вычисления позиций
  const iconRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Функция для закрытия подсказки при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen && 
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    
    // Обработчик для закрытия по клавише Esc
    const handleEscKey = (event: KeyboardEvent) => {
      if (isOpen && event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen]);
  
  // Вычисление оптимальной позиции для отображения подсказки
  useEffect(() => {
    if (isOpen && iconRef.current && tipRef.current) {
      const calculatePosition = () => {
        const iconRect = iconRef.current!.getBoundingClientRect();
        const tipRect = tipRef.current!.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        let top = 0;
        let left = 0;
        let arrowPos = 'bottom';
        
        // По умолчанию располагаем справа от иконки
        if (position === 'auto' || position === 'right') {
          // Пробуем расположить справа
          left = iconRect.right + 10;
          top = iconRect.top + iconRect.height / 2 - tipRect.height / 2;
          arrowPos = 'left';
          
          // Проверяем, не выходит ли за пределы экрана справа
          if (left + tipRect.width > windowWidth) {
            // Если выходит, располагаем слева
            left = iconRect.left - tipRect.width - 10;
            arrowPos = 'right';
          }
        } else if (position === 'left') {
          // Располагаем слева
          left = iconRect.left - tipRect.width - 10;
          top = iconRect.top + iconRect.height / 2 - tipRect.height / 2;
          arrowPos = 'right';
          
          // Проверяем, не выходит ли за пределы экрана слева
          if (left < 0) {
            // Если выходит, располагаем справа
            left = iconRect.right + 10;
            arrowPos = 'left';
          }
        } else if (position === 'top') {
          // Располагаем сверху
          top = iconRect.top - tipRect.height - 10;
          left = iconRect.left + iconRect.width / 2 - tipRect.width / 2;
          arrowPos = 'bottom';
          
          // Проверяем, не выходит ли за пределы экрана сверху
          if (top < 0) {
            // Если выходит, располагаем снизу
            top = iconRect.bottom + 10;
            arrowPos = 'top';
          }
        } else if (position === 'bottom') {
          // Располагаем снизу
          top = iconRect.bottom + 10;
          left = iconRect.left + iconRect.width / 2 - tipRect.width / 2;
          arrowPos = 'top';
          
          // Проверяем, не выходит ли за пределы экрана снизу
          if (top + tipRect.height > windowHeight) {
            // Если выходит, располагаем сверху
            top = iconRect.top - tipRect.height - 10;
            arrowPos = 'bottom';
          }
        }
        
        // Проверка на выход за границы экрана по горизонтали
        if (left < 0) {
          left = 10;
        }
        if (left + tipRect.width > windowWidth) {
          left = windowWidth - tipRect.width - 10;
        }
        
        // Проверка на выход за границы экрана по вертикали
        if (top < 0) {
          top = 10;
        }
        if (top + tipRect.height > windowHeight) {
          top = windowHeight - tipRect.height - 10;
        }
        
        setComputedPosition({
          top,
          left,
          arrowPosition: arrowPos,
        });
      };
      
      calculatePosition();
      
      // Пересчитываем позицию при изменении размеров окна
      window.addEventListener('resize', calculatePosition);
      
      return () => {
        window.removeEventListener('resize', calculatePosition);
      };
    }
  }, [isOpen, position]);
  
  // Переключение состояния подсказки при клике на иконку
  const toggleTip = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div 
      ref={containerRef}
      className={`relative ${className}`}
      style={{ position: iconPosition }}
    >
      {/* Иконка ментора */}
      <div 
        ref={iconRef}
        onClick={toggleTip}
        className="cursor-pointer transition-transform hover:scale-105 rounded-full overflow-hidden w-10 h-10"
        aria-label="Подсказка от ментора"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && toggleTip()}
      >
        <Image 
          src="/characters/avatar_mentor.png"
          alt="Ментор"
          width={40}
          height={40}
          className="object-cover"
        />
      </div>
      
      {/* Блок подсказки */}
      {isOpen && (
        <div
          ref={tipRef}
          className="fixed z-50 bg-indigo-900 text-white p-4 rounded-lg shadow-lg max-w-sm"
          style={{
            top: `${computedPosition.top}px`,
            left: `${computedPosition.left}px`,
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            opacity: 1,
            transform: 'scale(1)',
          }}
          aria-live="polite"
          role="dialog"
          aria-modal="true"
        >
          {/* Кнопка закрытия */}
          <button
            className="absolute top-2 right-2 text-gray-300 hover:text-white"
            onClick={() => setIsOpen(false)}
            aria-label="Закрыть подсказку"
          >
            ✕
          </button>
          
          {/* Контент подсказки */}
          <div className="pt-4">
            {typeof content === 'string' ? (
              <>
                <h3 className="text-lg font-bold mb-2">Ментор</h3>
                <p>{content}</p>
              </>
            ) : (
              content
            )}
          </div>
          
          {/* Стрелка, указывающая на иконку */}
          <div
            className={`absolute w-3 h-3 bg-indigo-900 transform rotate-45 ${
              computedPosition.arrowPosition === 'left' ? 'left-[-6px] top-1/2 -translate-y-1/2' :
              computedPosition.arrowPosition === 'right' ? 'right-[-6px] top-1/2 -translate-y-1/2' :
              computedPosition.arrowPosition === 'top' ? 'top-[-6px] left-1/2 -translate-x-1/2' :
              'bottom-[-6px] left-1/2 -translate-x-1/2'
            }`}
          />
        </div>
      )}
    </div>
  );
};

export default MentorTip; 