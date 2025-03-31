import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';

import { LevelStage } from '../../../types/level';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import DialogBubble from '../../components/levels/DialogBubble';
import AnalysisMaterial from '../../components/levels/AnalysisMaterial';
import DecisionSelector from '../../components/levels/DecisionSelector';
import { Quiz, QuizQuestion } from '../../components/levels/shared/quiz';
import { RootState } from '../../store';
import { selectSelectedCharacter } from '../../store/slices/characterSlice';
import ProgressIndicator from '../../components/levels/ProgressIndicator';
import NotesSystem from '../../components/levels/NotesSystem';
import { MentorTip } from '../../components/levels/shared/feedback';
import { StepNavigation, LevelNavigation } from '../../components/levels/shared/navigation';
import StakeholdersTheory from '../../components/levels/level2/stages/StakeholdersTheory';
import StakeholderBriefing from '../../components/levels/level2/stages/StakeholderBriefing';
import RequirementsTheory from '../../components/levels/level2/stages/RequirementsTheory';
import RequirementsPractice from '../../components/levels/level2/stages/RequirementsPractice';
import quizQuestions from '../../components/levels/level2/data/quizData';
import { styles as componentStyles } from '../../components/levels/level2/common/styles';

// CSS стили
const styles = {
  dialogContainer: "bg-slate-900 rounded-xl p-6 shadow-xl border border-slate-700 mb-6",
  card: "bg-slate-800 p-6 rounded-lg shadow-lg mb-6 border border-slate-700",
  levelTitle: "text-2xl font-bold text-white mb-2",
  levelSubtitle: "text-lg text-slate-300 mb-4",
  btnPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors",
  btnSecondary: "bg-slate-600 hover:bg-slate-700 text-white font-medium py-2 px-4 rounded-md transition-colors mr-4",
  planningBoard: "bg-slate-800 p-4 rounded-lg border border-slate-600 min-h-[400px] mb-6",
  dragItem: "bg-slate-700 p-3 rounded border border-slate-500 mb-2 cursor-move",
  interviewCard: "bg-slate-700 p-4 rounded-lg border border-slate-600 mb-4",
  priorityHigh: "bg-red-900 text-white px-2 py-1 rounded text-xs",
  priorityMedium: "bg-yellow-700 text-white px-2 py-1 rounded text-xs",
  priorityLow: "bg-blue-900 text-white px-2 py-1 rounded text-xs",
  resourceBadge: "bg-indigo-800 text-white px-2 py-1 rounded-full text-xs mr-2"
};

const Level2: NextPage = () => {
  const router = useRouter();
  const selectedCharacter = useSelector(selectSelectedCharacter);
  const [currentStage, setCurrentStage] = useState<LevelStage>(LevelStage.STAKEHOLDERS_THEORY);
  const [currentDialogIndex, setCurrentDialogIndex] = useState(0);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  const [completedPrioritization, setCompletedPrioritization] = useState(false);
  const [planPresentation, setPlanPresentation] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [notes, setNotes] = useState<string[]>([]);
  const [completedStages, setCompletedStages] = useState<LevelStage[]>([]);

  // При первой загрузке проверяем, если есть сохраненное состояние
  useEffect(() => {
    if (!selectedCharacter) {
      router.push('/character?redirectTo=/levels/2');
      return;
    }
    
    // Попытка восстановить сессию из localStorage
    const savedLevel = localStorage.getItem('level2_progress');
    if (savedLevel) {
      try {
        const parsedLevel = JSON.parse(savedLevel);
        setCurrentStage(parsedLevel.stage);
        setNotes(parsedLevel.notes || []);
        setCompletedStages(parsedLevel.completedStages || []);
        // Другие необходимые состояния
      } catch (e) {
        console.error('Ошибка при загрузке прогресса:', e);
      }
    }
  }, [selectedCharacter, router]);

  // Сохранение состояния в localStorage
  useEffect(() => {
    if (currentStage) {
      localStorage.setItem('level2_progress', JSON.stringify({
        stage: currentStage,
        notes,
        completedStages,
        // Другие необходимые состояния
      }));
    }
  }, [currentStage, notes, completedStages]);

  // Функция перехода к следующему этапу
  const goToNextStage = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setCurrentDialogIndex(0);
      
      switch (currentStage) {
        case LevelStage.STAKEHOLDERS_THEORY:
          setCurrentStage(LevelStage.STAKEHOLDER_BRIEFING);
          break;
        case LevelStage.STAKEHOLDER_BRIEFING:
          setCurrentStage(LevelStage.REQUIREMENTS_THEORY);
          break;
        case LevelStage.REQUIREMENTS_THEORY:
          setCurrentStage(LevelStage.REQUIREMENTS_PRACTICE);
          break;
        case LevelStage.REQUIREMENTS_PRACTICE:
          setCurrentStage(LevelStage.USERS_RESEARCH_THEORY);
          break;
        case LevelStage.USERS_RESEARCH_THEORY:
          setCurrentStage(LevelStage.USERS_RESEARCH_PRACTICE);
          break;
        case LevelStage.USERS_RESEARCH_PRACTICE:
          setCurrentStage(LevelStage.COMPETITORS_THEORY);
          break;
        case LevelStage.COMPETITORS_THEORY:
          setCurrentStage(LevelStage.COMPETITORS_PRACTICE);
          break;
        case LevelStage.COMPETITORS_PRACTICE:
          setCurrentStage(LevelStage.PLANNING_THEORY);
          break;
        case LevelStage.PLANNING_THEORY:
          setCurrentStage(LevelStage.PLANNING_PRACTICE);
          break;
        case LevelStage.PLANNING_PRACTICE:
          setCurrentStage(LevelStage.PRESENTATION_THEORY);
          break;
        case LevelStage.PRESENTATION_THEORY:
          setCurrentStage(LevelStage.PRESENTATION_PRACTICE);
          break;
        case LevelStage.PRESENTATION_PRACTICE:
          setCurrentStage(LevelStage.QUIZ);
          break;
        case LevelStage.QUIZ:
          setCurrentStage(LevelStage.COMPLETE);
          // Отметить уровень как пройденный
          const completedLevels = JSON.parse(localStorage.getItem('completedLevels') || '[]');
          if (!completedLevels.includes(2)) {
            completedLevels.push(2);
            localStorage.setItem('completedLevels', JSON.stringify(completedLevels));
          }
          break;
        default:
          break;
      }
      
      setIsLoading(false);
    }, 1000);
  };

  // Функция возврата к предыдущему этапу
  const goToPreviousStage = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setCurrentDialogIndex(0);
      
      switch (currentStage) {
        case LevelStage.STAKEHOLDER_BRIEFING:
          setCurrentStage(LevelStage.STAKEHOLDERS_THEORY);
          break;
        case LevelStage.REQUIREMENTS_THEORY:
          setCurrentStage(LevelStage.STAKEHOLDER_BRIEFING);
          break;
        case LevelStage.REQUIREMENTS_PRACTICE:
          setCurrentStage(LevelStage.REQUIREMENTS_THEORY);
          break;
        case LevelStage.USERS_RESEARCH_THEORY:
          setCurrentStage(LevelStage.REQUIREMENTS_PRACTICE);
          break;
        case LevelStage.USERS_RESEARCH_PRACTICE:
          setCurrentStage(LevelStage.USERS_RESEARCH_THEORY);
          break;
        case LevelStage.COMPETITORS_THEORY:
          setCurrentStage(LevelStage.USERS_RESEARCH_PRACTICE);
          break;
        case LevelStage.COMPETITORS_PRACTICE:
          setCurrentStage(LevelStage.COMPETITORS_THEORY);
          break;
        case LevelStage.PLANNING_THEORY:
          setCurrentStage(LevelStage.COMPETITORS_PRACTICE);
          break;
        case LevelStage.PLANNING_PRACTICE:
          setCurrentStage(LevelStage.PLANNING_THEORY);
          break;
        case LevelStage.PRESENTATION_THEORY:
          setCurrentStage(LevelStage.PLANNING_PRACTICE);
          break;
        case LevelStage.PRESENTATION_PRACTICE:
          setCurrentStage(LevelStage.PRESENTATION_THEORY);
          break;
        case LevelStage.QUIZ:
          setCurrentStage(LevelStage.PRESENTATION_PRACTICE);
          break;
        case LevelStage.COMPLETE:
          setCurrentStage(LevelStage.QUIZ);
          break;
        default:
          break;
      }
      
      setIsLoading(false);
    }, 500);
  };

  // Загрузка данных для требований
  const fetchRequirementsData = async () => {
    try {
      const response = await axios.get('/api/levels/project-planning/stakeholders');
      return response.data;
    } catch (error) {
      console.error('Ошибка при загрузке данных стейкхолдеров:', error);
      // Возвращаем моковые данные в случае ошибки
      return mockStakeholderData;
    }
  };

  // Моковые данные стейкхолдеров
  const mockStakeholderData = {
    stakeholders: [
      {
        id: 1,
        name: "Александр",
        role: "CEO",
        avatarUrl: "/characters/avatar_ceo.png",
        expectations: "Хочу увидеть рост активности команд на 30% в течение 3 месяцев после запуска функционала. Также важно, чтобы решение было масштабируемым для будущего роста нашей базы пользователей.",
        constraints: "Бюджет ограничен, нам нужно запустить MVP в течение следующего квартала."
      },
      {
        id: 2,
        name: "Мария",
        role: "Дизайнер",
        avatarUrl: "/characters/avatar_designer.png",
        expectations: "Интерфейс должен быть интуитивно понятным даже для новых пользователей, с минимальным порогом вхождения.",
        constraints: "Необходимо сохранить консистентность с существующим дизайном приложения."
      },
      {
        id: 3,
        name: "Дмитрий",
        role: "Разработчик",
        avatarUrl: "/characters/avatar_developer.png",
        expectations: "Хотелось бы избежать сложных архитектурных решений, которые потребуют большого рефакторинга.",
        constraints: "Текущая архитектура имеет ограничения по масштабированию, нужно учитывать технический долг."
      },
      {
        id: 4,
        name: "Анна",
        role: "Маркетолог",
        avatarUrl: "/characters/avatar_marketer.png",
        expectations: "Новый функционал должен стать ключевым элементом нашей следующей маркетинговой кампании.",
        constraints: "Запуск должен совпадать с нашим календарём маркетинговых активностей."
      },
      {
        id: 5,
        name: "Павел",
        role: "Тестировщик",
        avatarUrl: "/characters/avatar_tester.png",
        expectations: "Хотелось бы получить четкие критерии приемки для эффективного тестирования.",
        constraints: "У нас ограниченные ресурсы на тестирование, поэтому продукт должен быть качественным изначально."
      }
    ],
    users: [
      {
        id: 1,
        name: "Екатерина",
        type: "Новичок",
        avatarUrl: "/characters/avatar_mentor.png",
        needs: "Простой интерфейс с пошаговыми инструкциями для совместной работы над задачами.",
        pains: "Не понимает, как добавить коллег в приложение и делегировать задачи."
      },
      {
        id: 2,
        name: "Игорь",
        type: "Опытный пользователь",
        avatarUrl: "/characters/avatar_mentor.png",
        needs: "Больше гибкости в настройке рабочих процессов и интеграции с другими инструментами команды.",
        pains: "Текущий процесс совместной работы слишком ограничен и не позволяет настроить сложные сценарии."
      },
      {
        id: 3,
        name: "Компания АБВ",
        type: "Корпоративный клиент",
        avatarUrl: "/characters/avatar_mentor.png",
        needs: "Возможность создавать иерархию команд и гибко управлять правами доступа.",
        pains: "Отсутствие масштабируемости и сложности с администрированием больших команд."
      }
    ],
    competitors: [
      {
        id: 1,
        name: "TeamFlow",
        strengths: "Простой интерфейс, быстрая настройка команд",
        weaknesses: "Ограниченная гибкость, отсутствие интеграций с внешними сервисами"
      },
      {
        id: 2,
        name: "CollabMaster",
        strengths: "Мощные инструменты аналитики, много интеграций",
        weaknesses: "Сложный для начинающих пользователей, высокая стоимость"
      },
      {
        id: 3,
        name: "TeamSync",
        strengths: "Хорошие возможности для совместной работы, удобный мобильный клиент",
        weaknesses: "Периодические проблемы с производительностью, ограниченная поддержка"
      }
    ]
  };

  // Вопросы для викторины
  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: "Какой метод приоритизации лучше всего подходит для оценки задач по четырем категориям важности?",
      options: [
        { id: "rice", text: "RICE (Reach, Impact, Confidence, Effort)", isCorrect: false },
        { id: "moscow", text: "MoSCoW (Must have, Should have, Could have, Won't have)", isCorrect: true },
        { id: "value-effort", text: "Value vs Effort", isCorrect: false },
        { id: "ice", text: "ICE (Impact, Confidence, Ease)", isCorrect: false }
      ],
      explanation: "Метод MoSCoW специально разработан для категоризации задач по четырем уровням важности, от обязательных (Must have) до тех, которые можно отложить (Won't have).",
      type: 'single',
      difficulty: 'medium',
      points: 2
    },
    {
      id: 2,
      question: "В чем основное отличие MVP (Minimum Viable Product) от полной версии продукта?",
      options: [
        { id: "cheap", text: "MVP включает только самые дешевые в разработке функции", isCorrect: false },
        { id: "ui-only", text: "MVP фокусируется только на UI/UX без реальной функциональности", isCorrect: false },
        { id: "minimal", text: "MVP включает минимальный набор функций для решения ключевой проблемы пользователей", isCorrect: true },
        { id: "prototype", text: "MVP - это просто прототип, который не запускается на рынок", isCorrect: false }
      ],
      explanation: "MVP (Minimum Viable Product) - это версия продукта с минимальным, но достаточным набором функций для решения основной проблемы пользователей и получения обратной связи.",
      type: 'single',
      difficulty: 'easy',
      points: 1
    },
    {
      id: 3,
      question: "Какой элемент обязательно должен присутствовать в плане проекта?",
      options: [
        { id: "all-features", text: "Список всех возможных функций продукта", isCorrect: false },
        { id: "timeline", text: "Четкие сроки и основные этапы (вехи) проекта", isCorrect: true },
        { id: "architecture", text: "Детальная архитектура системы", isCorrect: false },
        { id: "marketing", text: "Подробный маркетинговый план", isCorrect: false }
      ],
      explanation: "Любой план проекта должен включать временные рамки и основные вехи (milestone), чтобы команда понимала дедлайны и могла отслеживать прогресс.",
      type: 'single',
      difficulty: 'easy',
      points: 1
    },
    {
      id: 4,
      question: "Почему важно собирать требования от всех заинтересованных сторон?",
      options: [
        { id: "all-features", text: "Чтобы включить в продукт все пожелания без исключения", isCorrect: false },
        { id: "formal", text: "Для формального соблюдения процедур проектного управления", isCorrect: false },
        { id: "conflicts", text: "Для выявления потенциальных конфликтов и поиска оптимального решения", isCorrect: true },
        { id: "delay", text: "Чтобы растянуть сроки проекта", isCorrect: false }
      ],
      explanation: "Сбор требований от всех стейкхолдеров помогает выявить противоречия, приоритизировать требования и найти оптимальное решение, учитывающее интересы всех сторон.",
      type: 'single',
      difficulty: 'medium',
      points: 2
    },
    {
      id: 5,
      question: "Что такое 'управление ожиданиями стейкхолдеров'?",
      options: [
        { id: "lower", text: "Процесс снижения ожиданий для упрощения разработки", isCorrect: false },
        { id: "realistic", text: "Коммуникация для формирования реалистичного понимания возможностей и ограничений проекта", isCorrect: true },
        { id: "manipulation", text: "Техника манипуляции для увеличения бюджета проекта", isCorrect: false },
        { id: "transfer", text: "Передача всей ответственности за решения стейкхолдерам", isCorrect: false }
      ],
      explanation: "Управление ожиданиями стейкхолдеров - это проактивная коммуникация с заинтересованными сторонами для формирования у них реалистичного понимания того, что может быть достигнуто в рамках проекта.",
      type: 'single',
      difficulty: 'hard',
      points: 3
    }
  ];

  // Рендер содержимого в зависимости от текущего этапа
  const renderStageContent = () => {
    switch (currentStage) {
      case LevelStage.STAKEHOLDERS_THEORY:
        return (
          <StakeholdersTheory
            goToPreviousStage={goToPreviousStage}
            goToNextStage={goToNextStage}
            isLoading={isLoading}
          />
        );

      case LevelStage.STAKEHOLDER_BRIEFING:
        return (
          <StakeholderBriefing
            goToPreviousStage={goToPreviousStage}
            goToNextStage={goToNextStage}
            isLoading={isLoading}
            notes={notes}
            setNotes={setNotes}
          />
        );

      case LevelStage.REQUIREMENTS_THEORY:
        return (
          <RequirementsTheory
            goToPreviousStage={goToPreviousStage}
            goToNextStage={goToNextStage}
            isLoading={isLoading}
          />
        );

      case LevelStage.REQUIREMENTS_PRACTICE:
        return (
          <RequirementsPractice
            goToPreviousStage={goToPreviousStage}
            goToNextStage={goToNextStage}
            isLoading={isLoading}
            notes={notes}
            setNotes={setNotes}
          />
        );
        
      case LevelStage.COMPLETE:
        return (
          <div className={styles.card}>
            <h2 className={styles.levelTitle}>Уровень пройден!</h2>
            <p className={styles.levelSubtitle}>Поздравляем с успешным завершением уровня "Планирование проекта"</p>
            
            <div className="mb-6 text-slate-300">
              <p className="mb-4">Вы успешно освоили основные принципы планирования продуктовых проектов:</p>
              
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Определение целей и метрик успеха проекта</li>
                <li>Методы приоритизации задач, такие как MoSCoW</li>
                <li>Реалистичное планирование ресурсов и времени</li>
                <li>Управление ожиданиями заинтересованных сторон</li>
                <li>Определение MVP и планирование итераций</li>
              </ul>
              
              <p className="mb-4">Эти навыки помогут вам в управлении продуктовыми проектами и создании успешных продуктов, отвечающих потребностям пользователей и бизнеса.</p>
              
              <MentorTip tip="Планирование - это непрерывный процесс. План не является чем-то неизменным, он должен адаптироваться под изменяющиеся условия. Регулярно пересматривайте и корректируйте план, чтобы он оставался актуальным и эффективным." />
            </div>
            
            <div className="flex justify-center">
              <Link href="/levels">
                <button
                  className={styles.btnPrimary}
                >
                  К выбору уровней
                </button>
              </Link>
            </div>
          </div>
        );

      case LevelStage.QUIZ:
        return (
          <div className={styles.dialogContainer}>
            <h2 className={styles.levelTitle}>Проверка знаний</h2>
            <p className={styles.levelSubtitle}>
              Давайте проверим, как хорошо вы усвоили материал о стейкхолдерах и требованиях.
            </p>
            <Quiz 
              questions={quizQuestions} 
              onComplete={(results) => {
                setQuizScore(results.score);
                if (results.score > 0) {
                  setCurrentStage(LevelStage.COMPLETE);
                }
              }} 
            />
            <div>
              <button 
                className={styles.btnSecondary} 
                onClick={goToPreviousStage}
              >
                Назад
              </button>
            </div>
          </div>
        );

      default:
        return <div>Содержимое загружается...</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className={componentStyles.levelTitle}>Уровень 2: Планирование проекта</h1>
          <p className={componentStyles.levelSubtitle}>Изучите основы планирования продуктовых проектов</p>
        </div>

        <div className={componentStyles.navContainer}>
          <LevelNavigation
            currentStage={currentStage}
            setCurrentStage={setCurrentStage}
            stages={Object.values(LevelStage).map(stage => ({
              stage,
              title: stage.toString(),
              completed: completedStages.includes(stage)
            }))}
          />
        </div>

        <div className={componentStyles.card}>
          {renderStageContent()}
        </div>
      </div>
    </div>
  );
};

export default Level2; 