import React, { useState } from 'react';
import { styles } from '../common/styles';

interface UxIssue {
  id: string;
  area: string;
  description: string;
  impact: string;
  severity: 'Низкая' | 'Средняя' | 'Высокая' | 'Критическая';
  userQuote?: string;
}

const UxAnalysis: React.FC = () => {
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [userSelections, setUserSelections] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const uxIssues: UxIssue[] = [
    {
      id: 'form-length',
      area: 'Форма создания задачи',
      description: 'Слишком длинная форма с большим количеством полей на одном экране, что вызывает когнитивную перегрузку пользователя.',
      impact: 'Пользователи испытывают затруднения при заполнении формы, часто оставляют её незаполненной или допускают ошибки. Особенно это заметно у новых пользователей.',
      severity: 'Высокая',
      userQuote: 'Когда я впервые пытался создать задачу, я был ошеломлен количеством полей. Я не понимал, какие поля обязательны, а какие нет.'
    },
    {
      id: 'validation-late',
      area: 'Валидация полей',
      description: 'Валидация происходит только после попытки отправки формы, а не в процессе заполнения полей.',
      impact: 'Пользователь узнает об ошибках слишком поздно, что приводит к разочарованию и необходимости возвращаться к заполнению формы.',
      severity: 'Высокая',
      userQuote: 'Я потратил время на заполнение всей формы, а потом система выдала 3 ошибки, и мне пришлось всё проверять заново.'
    },
    {
      id: 'fields-arrangement',
      area: 'Расположение полей',
      description: 'Логически связанные поля расположены в разных частях формы, что нарушает естественный поток заполнения.',
      impact: 'Пользователям приходится перескакивать между разными частями формы, что увеличивает когнитивную нагрузку и время заполнения.',
      severity: 'Средняя',
      userQuote: 'Странно, что поле "Срок выполнения" находится далеко от поля "Дата начала". Логичнее было бы разместить их рядом.'
    },
    {
      id: 'mobile-adaptation',
      area: 'Мобильная версия',
      description: 'Форма плохо адаптирована для мобильных устройств, элементы слишком маленькие, поля не масштабируются должным образом.',
      impact: 'Мобильные пользователи испытывают значительные трудности при создании задач, что подтверждается низкой конверсией в мобильной версии.',
      severity: 'Критическая',
      userQuote: 'Пытаться создать задачу с телефона — настоящий кошмар. Я просто отказался от этой затеи и дождался, пока буду за компьютером.'
    },
    {
      id: 'labels-unclear',
      area: 'Подписи и инструкции',
      description: 'Неясные подписи к полям и отсутствие подсказок о том, какая информация требуется или в каком формате.',
      impact: 'Пользователи часто не понимают, что именно нужно ввести в поле, особенно это касается специфических полей вроде "Теги" или "Приоритет".',
      severity: 'Средняя',
      userQuote: 'Я не понял, что означает поле "Статус". Задача же только создаётся, какой у неё может быть статус?'
    },
    {
      id: 'dependencies-handling',
      area: 'Работа с зависимостями',
      description: 'Сложная система указания зависимостей между задачами требует множества действий и плохо визуализирована.',
      impact: 'Большинство пользователей игнорируют функцию зависимостей, даже когда она могла бы быть полезна, из-за сложности её использования.',
      severity: 'Низкая',
      userQuote: 'Я даже не пытаюсь использовать зависимости. Слишком сложно, проще написать в описании, что одна задача зависит от другой.'
    },
    {
      id: 'required-optional',
      area: 'Обязательные и необязательные поля',
      description: 'Отсутствие чёткого визуального разделения между обязательными и необязательными полями.',
      impact: 'Пользователи либо тратят время на заполнение необязательных полей, либо пропускают обязательные, получая ошибки валидации.',
      severity: 'Высокая',
      userQuote: 'Мне непонятно, какие поля обязательны для заполнения. Звёздочек нет, цветом не выделяются. Приходится угадывать.'
    },
    {
      id: 'saving-issues',
      area: 'Процесс сохранения',
      description: 'Отсутствие автосохранения или возможности сохранить черновик задачи.',
      impact: 'Пользователи теряют введённые данные, если отвлекаются или происходит ошибка в процессе создания задачи.',
      severity: 'Средняя',
      userQuote: 'Однажды я заполнял большую задачу, браузер закрылся, и вся информация пропала. После этого я стал копировать текст в блокнот перед отправкой.'
    }
  ];

  const handleToggleIssue = (issueId: string) => {
    setSelectedIssue(issueId === selectedIssue ? null : issueId);
  };

  const handleSelectIssue = (issueId: string) => {
    const newSelections = userSelections.includes(issueId)
      ? userSelections.filter(id => id !== issueId)
      : [...userSelections, issueId];
    
    setUserSelections(newSelections);
  };

  const handleSubmitAnalysis = () => {
    const criticalIssues = uxIssues.filter(issue => issue.severity === 'Критическая').map(issue => issue.id);
    const highIssues = uxIssues.filter(issue => issue.severity === 'Высокая').map(issue => issue.id);
    
    const selectedCritical = userSelections.filter(id => criticalIssues.includes(id));
    const selectedHigh = userSelections.filter(id => highIssues.includes(id));
    
    if (selectedCritical.length === criticalIssues.length && selectedHigh.length >= 2) {
      setFeedback('Отличная работа! Вы правильно идентифицировали все критические и большинство высоких по важности проблем UX. Теперь вы можете приступить к исследованию пользователей, чтобы глубже понять их проблемы и потребности.');
    } else if (selectedCritical.length >= 1 && (selectedCritical.length + selectedHigh.length) >= 3) {
      setFeedback('Хорошая работа! Вы выявили некоторые ключевые проблемы UX, но упустили несколько важных аспектов. Обратите особое внимание на проблемы с мобильной версией и валидацией полей.');
    } else {
      setFeedback('Попробуйте еще раз. Важно выявить наиболее критичные проблемы UX, которые сильнее всего влияют на пользовательский опыт. Обратите внимание на проблемы, помеченные как "Критическая" и "Высокая" важность.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>UX-анализ интерфейса создания задач</h2>
        <p className={styles.sectionDescription}>
          Изучите текущий интерфейс создания задач в TaskMaster и выявите основные проблемы с точки зрения пользовательского опыта.
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.subheader}>Интерфейс создания задачи</h3>
        <div className={styles.imageContainer}>
          <img 
            src="/images/task_creation_interface.png" 
            alt="Интерфейс создания задачи в TaskMaster" 
            className={styles.mockupImage}
            onError={(e) => {
              // Fallback if image not found
              e.currentTarget.src = 'https://via.placeholder.com/800x500?text=Интерфейс+создания+задачи';
            }}
          />
          <p className={styles.imageCaptionText}>Текущий интерфейс создания задачи в TaskMaster</p>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.subheader}>Выявленные проблемы UX</h3>
        <p className={styles.text}>
          На основе анализа пользовательских сессий, записей взаимодействия и обратной связи выявлены следующие проблемы в интерфейсе создания задач:
        </p>
        
        <div className={styles.uxIssuesList}>
          {uxIssues.map((issue) => (
            <div key={issue.id} className={styles.uxIssueCard}>
              <div className={styles.uxIssueHeader} onClick={() => handleToggleIssue(issue.id)}>
                <div className={styles.uxIssueTitle}>
                  <h4>{issue.area}</h4>
                  <span className={`${styles.severityBadge} ${
                    issue.severity === 'Критическая' ? styles.criticalSeverity :
                    issue.severity === 'Высокая' ? styles.highSeverity :
                    issue.severity === 'Средняя' ? styles.mediumSeverity :
                    styles.lowSeverity
                  }`}>
                    {issue.severity}
                  </span>
                </div>
                <div className={styles.uxIssueActions}>
                  <button
                    type="button"
                    className={`${styles.uxIssueToggle} ${selectedIssue === issue.id ? styles.uxIssueToggleOpen : ''}`}
                    aria-expanded={selectedIssue === issue.id}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              {selectedIssue === issue.id && (
                <div className={styles.uxIssueDetails}>
                  <p className={styles.uxIssueDescription}>
                    <strong>Описание:</strong> {issue.description}
                  </p>
                  <p className={styles.uxIssueImpact}>
                    <strong>Влияние на пользователей:</strong> {issue.impact}
                  </p>
                  {issue.userQuote && (
                    <div className={styles.userQuote}>
                      <svg className="w-5 h-5 inline-block mr-1" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                      <em>{issue.userQuote}</em>
                    </div>
                  )}
                </div>
              )}
              
              <div className={styles.uxIssueSelection}>
                <input 
                  type="checkbox" 
                  id={`select-${issue.id}`}
                  checked={userSelections.includes(issue.id)}
                  onChange={() => handleSelectIssue(issue.id)}
                  className={styles.uxIssueCheckbox}
                />
                <label htmlFor={`select-${issue.id}`} className={styles.uxIssueCheckboxLabel}>
                  Выбрать как ключевую проблему
                </label>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.analysisActions}>
          <p className={styles.selectionCount}>
            Выбрано проблем: {userSelections.length} из {uxIssues.length}
          </p>
          <button 
            className={styles.submitButton}
            onClick={handleSubmitAnalysis}
            disabled={userSelections.length === 0}
          >
            Завершить UX-анализ
          </button>
          
          {feedback && (
            <div className={`${styles.feedbackMessage} ${feedback.startsWith('Отличная') ? styles.successFeedback : feedback.startsWith('Хорошая') ? styles.warningFeedback : styles.errorFeedback}`}>
              {feedback}
            </div>
          )}
        </div>
      </div>
      
      <div className={styles.mentorTip}>
        <h4 className={styles.mentorTipTitle}>Совет ментора:</h4>
        <p className={styles.mentorTipText}>
          При UX-анализе важно не только выявить проблемы, но и оценить их влияние на пользователей и бизнес. 
          Сосредоточьтесь на наиболее критичных проблемах, которые непосредственно влияют на конверсию и удовлетворенность 
          пользователей. Приоритизация — ключевой навык продакт-менеджера.
        </p>
      </div>
    </div>
  );
};

export default UxAnalysis; 