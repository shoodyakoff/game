import React, { useState } from 'react';
import styles from '../common/styles';

const TeamMeeting: React.FC = () => {
  const [currentDialog, setCurrentDialog] = useState<number>(0);
  const [showFullDialog, setShowFullDialog] = useState<boolean>(false);
  
  const team = [
    {
      name: 'Анна',
      role: 'Продакт-менеджер',
      avatar: '/images/avatars/anna.jpg'
    },
    {
      name: 'Михаил',
      role: 'UI/UX дизайнер',
      avatar: '/images/avatars/mikhail.jpg'
    },
    {
      name: 'Екатерина',
      role: 'Frontend-разработчик',
      avatar: '/images/avatars/ekaterina.jpg'
    },
    {
      name: 'Дмитрий',
      role: 'Backend-разработчик',
      avatar: '/images/avatars/dmitry.jpg'
    },
    {
      name: 'Ольга',
      role: 'QA-инженер',
      avatar: '/images/avatars/olga.jpg'
    },
    {
      name: 'Вы',
      role: 'Джуниор продакт-менеджер',
      avatar: '/images/avatars/you.jpg'
    }
  ];
  
  const dialogScript = [
    {
      speaker: 'Анна',
      text: 'Всем привет! Рада видеть вас на нашей еженедельной встрече. Сегодня мы хотим обсудить важную тему — процесс создания задач в нашем приложении TaskMaster.'
    },
    {
      speaker: 'Дмитрий',
      text: 'Да, я смотрел метрики по этому разделу. У нас высокий процент отказов — пользователи начинают создавать задачу, но не завершают процесс.'
    },
    {
      speaker: 'Екатерина',
      text: 'Я тоже заметила это. Плюс, у нас много обращений в поддержку именно по этому вопросу. Пользователи жалуются, что создание задач слишком сложное.'
    },
    {
      speaker: 'Михаил',
      text: 'С точки зрения дизайна, форма создания задачи действительно перегружена. Слишком много полей, и не всегда понятно, какие из них обязательны к заполнению.'
    },
    {
      speaker: 'Ольга',
      text: 'Кроме того, у нас нет адекватной валидации формы. Пользователи часто получают ошибки только после попытки сохранения.'
    },
    {
      speaker: 'Анна',
      text: 'Хорошо, что мы все видим проблему. Теперь нам нужно найти решение. Какие у вас есть идеи?'
    },
    {
      speaker: 'Михаил',
      text: 'Я предлагаю переработать форму, сделать её более простой и интуитивно понятной. Можно разделить процесс на шаги, чтобы пользователь не видел сразу все поля.'
    },
    {
      speaker: 'Екатерина',
      text: 'Согласна с Михаилом. Можно также добавить мгновенную валидацию полей и подсказки, которые будут помогать пользователю.'
    },
    {
      speaker: 'Дмитрий',
      text: 'А ещё стоит рассмотреть возможность сохранения черновика задачи. Так пользователь сможет вернуться к её созданию позже.'
    },
    {
      speaker: 'Ольга',
      text: 'Для оптимизации тестирования предлагаю заложить в новый процесс создания задач возможность A/B-тестирования разных вариантов.'
    },
    {
      speaker: 'Анна',
      text: 'Отличные идеи! Теперь нам нужно определить приоритеты и составить план работы. В этом нам поможет наш новый коллега. (Обращается к вам) Я хочу поручить вам проанализировать все эти идеи и подготовить предложение по оптимизации процесса создания задач.'
    },
    {
      speaker: 'Анна',
      text: 'Для этого вам понадобится применить продуктовое мышление, провести UX-анализ, поработать с метриками и принять обоснованные решения. Это будет ваш первый серьезный проект у нас, и я уверена, что вы справитесь. Готовы приступить?'
    }
  ];

  const handleNext = () => {
    if (currentDialog < dialogScript.length - 1) {
      setCurrentDialog(currentDialog + 1);
    }
  };

  const handlePrevious = () => {
    if (currentDialog > 0) {
      setCurrentDialog(currentDialog - 1);
    }
  };

  const handleShowFullDialog = () => {
    setShowFullDialog(true);
  };

  const getCurrentSpeaker = () => {
    return team.find(t => t.name === dialogScript[currentDialog].speaker);
  };

  const renderSpeakerAvatar = (speaker: typeof team[0]) => (
    <div className={styles.dialogAvatar}>
      <img 
        src={speaker.avatar} 
        alt={speaker.name}
        className="w-12 h-12 rounded-full object-cover"
        onError={(e) => {
          // Fallback for missing avatars
          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/48x48';
        }}
      />
    </div>
  );

  return (
    <div className={styles.container}>
      {/* Заголовок встречи */}
      <div className={styles.meetingHeader}>
        <h3 className={styles.meetingTitle}>Командная встреча: Обсуждение процесса создания задач</h3>
        <div className={styles.meetingDate}>
          <span>Понедельник, 14 марта 2023</span>
          <span className={styles.meetingTime}>10:00 - 11:00</span>
        </div>
      </div>

      {/* Участники встречи */}
      <div className={styles.teamSection}>
        <h4 className={styles.sectionTitle}>Участники встречи:</h4>
        <div className={styles.teamGrid}>
          {team.map((member, index) => (
            <div key={index} className={styles.teamMember}>
              <div className={styles.memberAvatar}>
                <img 
                  src={member.avatar} 
                  alt={member.name}
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) => {
                    // Fallback for missing avatars
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64x64';
                  }}
                />
              </div>
              <div className={styles.memberInfo}>
                <span className={styles.memberName}>{member.name}</span>
                <span className={styles.memberRole}>{member.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Диалог встречи */}
      {!showFullDialog ? (
        <div className={styles.dialogSection}>
          <h4 className={styles.sectionTitle}>Ход обсуждения:</h4>
          <div className={styles.dialogContainer}>
            <div className={styles.dialogMessage}>
              {getCurrentSpeaker() && renderSpeakerAvatar(getCurrentSpeaker()!)}
              <div className={styles.messageContent}>
                <div className={styles.messageSender}>{dialogScript[currentDialog].speaker}</div>
                <div className={styles.messageText}>{dialogScript[currentDialog].text}</div>
              </div>
            </div>
            
            <div className={styles.dialogNavigation}>
              <button
                onClick={handlePrevious}
                disabled={currentDialog === 0}
                className={`${styles.btnNavigation} ${currentDialog === 0 ? styles.btnDisabled : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Назад
              </button>
              
              <div className={styles.dialogCounter}>
                {currentDialog + 1} / {dialogScript.length}
              </div>
              
              <button
                onClick={handleNext}
                disabled={currentDialog === dialogScript.length - 1}
                className={`${styles.btnNavigation} ${currentDialog === dialogScript.length - 1 ? styles.btnDisabled : ''}`}
              >
                Далее
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            <button onClick={handleShowFullDialog} className={styles.btnSecondary}>
              Показать весь диалог
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.dialogSection}>
          <h4 className={styles.sectionTitle}>Полная запись обсуждения:</h4>
          <div className={styles.fullDialogContainer}>
            {dialogScript.map((message, index) => {
              const speaker = team.find(t => t.name === message.speaker);
              return (
                <div key={index} className={styles.dialogMessage}>
                  {speaker && renderSpeakerAvatar(speaker)}
                  <div className={styles.messageContent}>
                    <div className={styles.messageSender}>{message.speaker}</div>
                    <div className={styles.messageText}>{message.text}</div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <button 
            onClick={() => setShowFullDialog(false)} 
            className={styles.btnSecondary}
          >
            Вернуться к пошаговому просмотру
          </button>
        </div>
      )}

      {/* Задание */}
      <div className={styles.taskSection}>
        <h4 className={styles.sectionTitle}>Ваша задача:</h4>
        <div className={styles.taskDescription}>
          <p>
            Изучите материалы, предоставленные в следующих разделах, и подготовьте предложение по оптимизации процесса создания задач в приложении TaskMaster.
          </p>
          <p>
            Вам необходимо применить продуктовое мышление, провести UX-анализ, изучить метрики и принять обоснованные решения.
          </p>
          <p>
            В конце вас ждет тест для проверки усвоенных знаний.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TeamMeeting;