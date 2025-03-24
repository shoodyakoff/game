import React, { useState } from 'react';
import DialogBubble from '../../../levels/DialogBubble';
import ProgressIndicator from '../../../levels/ProgressIndicator';
import NotesSystem from '../../../levels/NotesSystem';
import styles from '../common/styles';
import StageNavigation from '../common/StageNavigation';
import LevelStage from '../common/LevelStages';

interface StakeholderBriefingProps {
  goToPreviousStage: () => void;
  goToNextStage: () => void;
  isLoading: boolean;
  notes: string[];
  setNotes: React.Dispatch<React.SetStateAction<string[]>>;
}

const StakeholderBriefing: React.FC<StakeholderBriefingProps> = ({
  goToPreviousStage,
  goToNextStage,
  isLoading,
  notes,
  setNotes
}) => {
  const [currentDialogIndex, setCurrentDialogIndex] = useState(0);
  
  return (
    <div>
      <div className={styles.dialogContainer}>
        <h2 className="text-xl text-white mb-4">Брифинг от заинтересованных сторон</h2>
        
        {currentDialogIndex === 0 && (
          <DialogBubble
            avatar="/characters/avatar_ceo.png"
            name="Александр"
            role="CEO"
            messages={["Рад вас видеть! Сегодня у нас важная задача. Нам нужно разработать план внедрения новой системы командной работы в приложение TaskMaster. Наши пользователи давно просят возможность совместной работы над задачами, и пришло время реализовать это."]}
            typingSpeed={25}
            autoPlay={true}
            onComplete={() => setCurrentDialogIndex(1)}
          />
        )}
        
        {currentDialogIndex === 1 && (
          <DialogBubble
            avatar="/characters/avatar_ceo.png"
            name="Александр"
            role="CEO"
            messages={["Нам важно увидеть рост активности команд на 30% в течение 3 месяцев после запуска. Бюджет ограничен, поэтому нам нужно запустить MVP в течение следующего квартала. Прошу вас поговорить со всеми стейкхолдерами и собрать их требования."]}
            typingSpeed={25}
            autoPlay={true}
            onComplete={() => setCurrentDialogIndex(2)}
          />
        )}

        {currentDialogIndex >= 2 && currentDialogIndex <= 6 && (
          <>
            {currentDialogIndex === 2 && (
              <DialogBubble
                avatar="/characters/avatar_designer.png"
                name="Мария"
                role="Дизайнер"
                messages={["С точки зрения дизайна, интерфейс должен быть интуитивно понятным даже для новых пользователей. Важно сохранить консистентность с существующим дизайном приложения, чтобы пользователи не чувствовали резкого перехода."]}
                typingSpeed={25}
                autoPlay={true}
                onComplete={() => setCurrentDialogIndex(3)}
              />
            )}
            
            {currentDialogIndex === 3 && (
              <DialogBubble
                avatar="/characters/avatar_developer.png"
                name="Дмитрий"
                role="Разработчик"
                messages={["С технической точки зрения, я бы хотел избежать сложных архитектурных решений, которые потребуют большого рефакторинга. Наша текущая архитектура имеет ограничения по масштабированию, нужно учитывать технический долг."]}
                typingSpeed={25}
                autoPlay={true}
                onComplete={() => setCurrentDialogIndex(4)}
              />
            )}
            
            {currentDialogIndex === 4 && (
              <DialogBubble
                avatar="/characters/avatar_marketer.png"
                name="Анна"
                role="Маркетолог"
                messages={["Я планирую сделать новый функционал ключевым элементом нашей следующей маркетинговой кампании. Было бы идеально, если запуск совпадет с нашим календарём маркетинговых активностей."]}
                typingSpeed={25}
                autoPlay={true}
                onComplete={() => setCurrentDialogIndex(5)}
              />
            )}
            
            {currentDialogIndex === 5 && (
              <DialogBubble
                avatar="/characters/avatar_tester.png"
                name="Павел"
                role="Тестировщик"
                messages={["Мне важно получить четкие критерии приемки для эффективного тестирования. У нас ограниченные ресурсы на тестирование, поэтому продукт должен быть качественным изначально."]}
                typingSpeed={25}
                autoPlay={true}
                onComplete={() => setCurrentDialogIndex(6)}
              />
            )}
            
            {currentDialogIndex === 6 && (
              <DialogBubble
                avatar="/characters/avatar_ceo.png"
                name="Александр"
                role="CEO"
                messages={["Отлично! Теперь у вас есть базовое понимание ожиданий команды. Следующий шаг - собрать и проанализировать все требования, включая отзывы пользователей и анализ конкурентов. После этого вам нужно будет разработать план проекта."]}
                typingSpeed={25}
                autoPlay={true}
                onComplete={() => {}}
              />
            )}
          </>
        )}
        
        <ProgressIndicator 
          stages={[
            { id: "1", name: "Введение" },
            { id: "2", name: "CEO" },
            { id: "3", name: "Дизайнер" },
            { id: "4", name: "Разработчик" },
            { id: "5", name: "Маркетолог" },
            { id: "6", name: "Тестировщик" },
            { id: "7", name: "Итог" }
          ]}
          currentStage={(currentDialogIndex + 1).toString()}
          progress={100 * currentDialogIndex / 6}
        />
      </div>
      
      <NotesSystem
        onSaveNote={(note) => {
          setNotes([...notes, note.text]);
        }}
        savedNotes={notes.map((text, index) => ({
          id: `note-${index}`,
          text,
          category: "general",
          timestamp: Date.now() - index * 60000
        }))}
        categories={[
          { id: "general", name: "Общее", color: "bg-blue-500" },
          { id: "idea", name: "Идея", color: "bg-green-500" },
          { id: "question", name: "Вопрос", color: "bg-purple-500" }
        ]}
        placeholder="Сохраните ключевые требования стейкхолдеров здесь..."
      />
      
      <StageNavigation
        currentStage={LevelStage.STAKEHOLDER_BRIEFING}
        goToPreviousStage={goToPreviousStage}
        goToNextStage={goToNextStage}
        isLoading={isLoading}
        disableNext={currentDialogIndex < 6}
        nextButtonLabel="К теории о требованиях"
      />
    </div>
  );
};

export default StakeholderBriefing; 