import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';

import ProtectedRoute from '../../components/auth/ProtectedRoute';
import DialogBubble from '../../components/levels/DialogBubble';
import AnalysisMaterial from '../../components/levels/AnalysisMaterial';
import DecisionSelector from '../../components/levels/DecisionSelector';
import QuizComponent, { QuizQuestion } from '../../components/levels/QuizComponent';
import { RootState } from '../../store';
import { selectSelectedCharacter } from '../../store/slices/characterSlice';
import ProgressIndicator from '../../components/levels/ProgressIndicator';
import NotesSystem from '../../components/levels/NotesSystem';
import MentorTip from '../../components/levels/MentorTip';
import StakeholdersTheory from '../../components/levels/level2/stages/StakeholdersTheory';
import StakeholderBriefing from '../../components/levels/level2/stages/StakeholderBriefing';
import RequirementsTheory from '../../components/levels/level2/stages/RequirementsTheory';
import RequirementsPractice from '../../components/levels/level2/stages/RequirementsPractice';
import quizQuestions from '../../components/levels/level2/data/quizData';

// Этапы уровня
enum LevelStage {
  // Теоретические блоки
  STAKEHOLDERS_THEORY = 'stakeholders_theory',
  REQUIREMENTS_THEORY = 'requirements_theory',
  USERS_RESEARCH_THEORY = 'users_research_theory',
  COMPETITORS_THEORY = 'competitors_theory', 
  PLANNING_THEORY = 'planning_theory',
  PRESENTATION_THEORY = 'presentation_theory',
  
  // Практические блоки
  STAKEHOLDER_BRIEFING = 'stakeholder_briefing',
  REQUIREMENTS_PRACTICE = 'requirements_practice',
  USERS_RESEARCH_PRACTICE = 'users_research_practice',
  COMPETITORS_PRACTICE = 'competitors_practice',
  PLANNING_PRACTICE = 'planning_practice',
  PRESENTATION_PRACTICE = 'presentation_practice',
  
  // Заключительные блоки
  QUIZ = 'quiz',
  COMPLETE = 'complete'
}

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

  // При первой загрузке проверяем, если есть сохраненное состояние
  useEffect(() => {
    if (!selectedCharacter) {
      router.push('/character-selection');
      return;
    }
    
    // Попытка восстановить сессию из localStorage
    const savedLevel = localStorage.getItem('level2_progress');
    if (savedLevel) {
      try {
        const parsedLevel = JSON.parse(savedLevel);
        setCurrentStage(parsedLevel.stage);
        setNotes(parsedLevel.notes || []);
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
        // Другие необходимые состояния
      }));
    }
  }, [currentStage, notes]);

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
      explanation: "Метод MoSCoW специально разработан для категоризации задач по четырем уровням важности, от обязательных (Must have) до тех, которые можно отложить (Won't have)."
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
      explanation: "MVP (Minimum Viable Product) - это версия продукта с минимальным, но достаточным набором функций для решения основной проблемы пользователей и получения обратной связи."
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
      explanation: "Любой план проекта должен включать временные рамки и основные вехи (milestone), чтобы команда понимала дедлайны и могла отслеживать прогресс."
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
      explanation: "Сбор требований от всех стейкхолдеров помогает выявить противоречия, приоритизировать требования и найти оптимальное решение, учитывающее интересы всех сторон."
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
      explanation: "Управление ожиданиями стейкхолдеров - это проактивная коммуникация с заинтересованными сторонами для формирования у них реалистичного понимания того, что может быть достигнуто в рамках проекта."
    }
  ];

  // Рендер содержимого в зависимости от текущего этапа
  const renderStageContent = () => {
    switch (currentStage) {
      case LevelStage.STAKEHOLDERS_THEORY:
        return (
          <div className={styles.card}>
            <h2 className={styles.levelTitle}>Стейкхолдеры в продуктовой разработке</h2>
            <p className={styles.levelSubtitle}>Теоретический блок</p>
            
            <div className="mb-6 text-slate-300">
              <h3 className="text-xl font-semibold text-white mb-3">Кто такие стейкхолдеры?</h3>
              <p className="mb-4">
                <strong>Стейкхолдеры</strong> (заинтересованные стороны) — это лица или организации, которые оказывают влияние на проект или сами могут быть подвержены влиянию проекта. Это все, кто имеет интерес к проекту и его результатам.
              </p>
              
              <h3 className="text-xl font-semibold text-white mb-3">Типы стейкхолдеров</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                  <h4 className="text-lg font-medium text-indigo-400 mb-2">Внутренние стейкхолдеры</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Команда разработки</li>
                    <li>Менеджмент компании</li>
                    <li>Инвесторы</li>
                    <li>Сотрудники других отделов</li>
                  </ul>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                  <h4 className="text-lg font-medium text-indigo-400 mb-2">Внешние стейкхолдеры</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Пользователи продукта</li>
                    <li>Клиенты</li>
                    <li>Партнеры</li>
                    <li>Конкуренты</li>
                    <li>Регуляторы</li>
                  </ul>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-3">Почему важно работать со стейкхолдерами?</h3>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Снижение рисков и неопределенности</li>
                <li>Получение критической информации для принятия решений</li>
                <li>Обеспечение поддержки проекта</li>
                <li>Выявление скрытых требований и ограничений</li>
                <li>Повышение эффективности коммуникации</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-white mb-3">Матрица анализа стейкхолдеров</h3>
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-900 p-3 rounded-lg text-center">
                    <h5 className="font-medium mb-2">Высокое влияние<br/>Высокий интерес</h5>
                    <p className="text-sm">Ключевые игроки</p>
                    <p className="text-xs mt-2">Тесно сотрудничать</p>
                  </div>
                  <div className="bg-blue-800 p-3 rounded-lg text-center">
                    <h5 className="font-medium mb-2">Высокое влияние<br/>Низкий интерес</h5>
                    <p className="text-sm">Удовлетворять потребности</p>
                    <p className="text-xs mt-2">Держать в курсе</p>
                  </div>
                  <div className="bg-blue-800 p-3 rounded-lg text-center">
                    <h5 className="font-medium mb-2">Низкое влияние<br/>Высокий интерес</h5>
                    <p className="text-sm">Информировать</p>
                    <p className="text-xs mt-2">Консультироваться</p>
                  </div>
                  <div className="bg-blue-700 p-3 rounded-lg text-center">
                    <h5 className="font-medium mb-2">Низкое влияние<br/>Низкий интерес</h5>
                    <p className="text-sm">Наблюдать</p>
                    <p className="text-xs mt-2">Минимальные усилия</p>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-3">Методы работы со стейкхолдерами</h3>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li><strong>Интервью:</strong> прямое общение для выявления требований, ожиданий и ограничений</li>
                <li><strong>Опросы:</strong> сбор информации от большого количества стейкхолдеров</li>
                <li><strong>Наблюдения:</strong> анализ реального использования продукта</li>
                <li><strong>Воркшопы:</strong> совместная работа над продуктом с разными стейкхолдерами</li>
                <li><strong>Презентации:</strong> демонстрация результатов и получение обратной связи</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-white mb-3">Работа с конфликтами между стейкхолдерами</h3>
              <p className="mb-4">
                Различные стейкхолдеры могут иметь противоречивые требования. Продуктовый менеджер должен уметь выявлять, анализировать и разрешать такие конфликты:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Выявление скрытых интересов каждой стороны</li>
                <li>Поиск компромиссных решений</li>
                <li>Приоритизация требований на основе бизнес-ценности и технической сложности</li>
                <li>Выстраивание этапности реализации для удовлетворения различных потребностей</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-white mb-3">Примеры вопросов для интервью со стейкхолдерами</h3>
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 mb-6">
                <h4 className="text-lg font-medium text-indigo-400 mb-2">Общие вопросы:</h4>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                  <li>Какие цели вы хотите достичь с помощью этого продукта/функционала?</li>
                  <li>Какие метрики успеха вы считаете ключевыми?</li>
                  <li>Какие проблемы должно решить данное решение?</li>
                </ul>
                
                <h4 className="text-lg font-medium text-indigo-400 mb-2">Специфические вопросы:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Какие ограничения (бюджет, время, ресурсы) существуют для проекта?</li>
                  <li>Какие технические/дизайн/бизнес требования необходимо учесть?</li>
                  <li>Какие риски вы видите в проекте?</li>
                  <li>Какие компромиссы вы готовы принять?</li>
                </ul>
              </div>
            </div>
            
            <MentorTip tip="Помните, что стейкхолдеры могут говорить не только о своих явных потребностях, но и иметь скрытые мотивы. Задавайте уточняющие вопросы и обращайте внимание на противоречия в требованиях разных заинтересованных сторон." />
            
            <div className="flex justify-between mt-6">
              <div></div>
              <button
                className={styles.btnPrimary}
                onClick={goToNextStage}
                disabled={isLoading}
              >
                {isLoading ? 'Загрузка...' : 'К брифингу стейкхолдеров'}
              </button>
            </div>
          </div>
        );

      case LevelStage.STAKEHOLDER_BRIEFING:
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
            
            <div className="flex justify-between mt-4">
              <button
                className={styles.btnSecondary}
                onClick={goToPreviousStage}
                disabled={isLoading}
              >
                Назад
              </button>
              
              <button
                className={styles.btnPrimary}
                onClick={goToNextStage}
                disabled={isLoading || currentDialogIndex < 6}
              >
                {isLoading ? 'Загрузка...' : 'К сбору требований'}
              </button>
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
          </div>
        );

      case LevelStage.REQUIREMENTS_THEORY:
        return (
          <div className={styles.card}>
            <h2 className={styles.levelTitle}>Сбор и анализ требований</h2>
            <p className={styles.levelSubtitle}>Теоретический блок</p>
            
            <div className="mb-6 text-slate-300">
              <h3 className="text-xl font-semibold text-white mb-3">Что такое требования?</h3>
              <p className="mb-4">
                <strong>Требования</strong> — это описание того, что система должна делать, какими свойствами она должна обладать, и каким ограничениям должна соответствовать. Хорошо определенные требования критически важны для успеха продукта.
              </p>
              
              <h3 className="text-xl font-semibold text-white mb-3">Типы требований</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                  <h4 className="text-lg font-medium text-indigo-400 mb-2">Функциональные требования</h4>
                  <p className="mb-2">Описывают, что система должна делать:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Конкретные функции и возможности</li>
                    <li>Бизнес-правила</li>
                    <li>Взаимодействие с пользователями</li>
                    <li>Взаимодействие с другими системами</li>
                  </ul>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                  <h4 className="text-lg font-medium text-indigo-400 mb-2">Нефункциональные требования</h4>
                  <p className="mb-2">Описывают, какими характеристиками должна обладать система:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Производительность</li>
                    <li>Безопасность</li>
                    <li>Удобство использования</li>
                    <li>Масштабируемость</li>
                    <li>Надежность</li>
                  </ul>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-3">Методы сбора требований</h3>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li><strong>Интервью со стейкхолдерами</strong>: прямой диалог для выявления потребностей</li>
                <li><strong>Фокус-группы</strong>: групповые обсуждения с представителями целевой аудитории</li>
                <li><strong>Наблюдение за пользователями</strong>: анализ того, как пользователи взаимодействуют с продуктом</li>
                <li><strong>Анализ конкурентов</strong>: изучение аналогичных решений на рынке</li>
                <li><strong>Анкетирование</strong>: сбор информации от большого числа пользователей</li>
                <li><strong>Анализ документации</strong>: изучение существующих материалов о продукте или процессах</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-white mb-3">Документирование требований</h3>
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 mb-6">
                <h4 className="text-lg font-medium text-indigo-400 mb-2">User Stories</h4>
                <p className="mb-3">Формат: <span className="bg-slate-700 px-2 py-1 rounded">Как [роль], я хочу [действие], чтобы [польза]</span></p>
                <p className="mb-2">Примеры:</p>
                <ul className="list-disc pl-5 space-y-1 mb-4">
                  <li>Как пользователь, я хочу создать команду, чтобы совместно работать над задачами</li>
                  <li>Как менеджер, я хочу видеть прогресс по всем задачам команды, чтобы контролировать выполнение проекта</li>
                </ul>
                
                <h4 className="text-lg font-medium text-indigo-400 mb-2">Пользовательские сценарии (User Flow)</h4>
                <p className="mb-2">Описывают последовательность действий пользователя для выполнения задачи:</p>
                <ol className="list-decimal pl-5 space-y-1 mb-4">
                  <li>Пользователь входит в систему</li>
                  <li>Пользователь нажимает кнопку "Создать команду"</li>
                  <li>Пользователь вводит название команды и описание</li>
                  <li>Пользователь добавляет участников в команду</li>
                  <li>Пользователь нажимает кнопку "Сохранить"</li>
                </ol>
                
                <h4 className="text-lg font-medium text-indigo-400 mb-2">Спецификации</h4>
                <p className="mb-2">Детальное описание каждого требования:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Описание функциональности</li>
                  <li>Входные и выходные данные</li>
                  <li>Ограничения и условия</li>
                  <li>Критерии приемки</li>
                </ul>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-3">Приоритизация требований</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                  <h4 className="text-lg font-medium text-indigo-400 mb-2">MoSCoW</h4>
                  <ul className="list-none pl-0 space-y-1">
                    <li><strong>M</strong> - Must Have (необходимо)</li>
                    <li><strong>S</strong> - Should Have (следует иметь)</li>
                    <li><strong>C</strong> - Could Have (можно иметь)</li>
                    <li><strong>W</strong> - Won't Have (не будет)</li>
                  </ul>
                </div>
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                  <h4 className="text-lg font-medium text-indigo-400 mb-2">RICE</h4>
                  <ul className="list-none pl-0 space-y-1">
                    <li><strong>R</strong> - Reach (охват)</li>
                    <li><strong>I</strong> - Impact (влияние)</li>
                    <li><strong>C</strong> - Confidence (уверенность)</li>
                    <li><strong>E</strong> - Effort (усилия)</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 mb-6">
                <h4 className="text-lg font-medium text-indigo-400 mb-2">Матрица "Ценность-Усилия"</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-800 p-3 rounded-lg text-center">
                    <h5 className="font-medium mb-2">Высокая ценность<br/>Низкие усилия</h5>
                    <p className="text-sm">Быстрые победы</p>
                    <p className="text-xs mt-2">Реализовать в первую очередь</p>
                  </div>
                  <div className="bg-yellow-700 p-3 rounded-lg text-center">
                    <h5 className="font-medium mb-2">Высокая ценность<br/>Высокие усилия</h5>
                    <p className="text-sm">Большие проекты</p>
                    <p className="text-xs mt-2">Разбить на этапы</p>
                  </div>
                  <div className="bg-blue-700 p-3 rounded-lg text-center">
                    <h5 className="font-medium mb-2">Низкая ценность<br/>Низкие усилия</h5>
                    <p className="text-sm">Приятные мелочи</p>
                    <p className="text-xs mt-2">Реализовать при наличии времени</p>
                  </div>
                  <div className="bg-red-800 p-3 rounded-lg text-center">
                    <h5 className="font-medium mb-2">Низкая ценность<br/>Высокие усилия</h5>
                    <p className="text-sm">Неэффективные задачи</p>
                    <p className="text-xs mt-2">Отложить или отказаться</p>
                  </div>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-3">Валидация требований</h3>
              <p className="mb-3">
                После сбора требований необходимо проверить их на корректность, полноту и реализуемость:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Обсуждение требований со стейкхолдерами</li>
                <li>Проверка на соответствие бизнес-целям</li>
                <li>Оценка технической реализуемости</li>
                <li>Тестирование требований на прототипах</li>
                <li>Выявление противоречий и конфликтов</li>
              </ul>
              
              <h3 className="text-xl font-semibold text-white mb-3">Управление изменениями требований</h3>
              <p className="mb-3">
                Требования могут меняться в процессе работы над продуктом. Важно управлять этими изменениями:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Документирование всех изменений</li>
                <li>Оценка влияния изменений на сроки и ресурсы</li>
                <li>Согласование изменений со всеми стейкхолдерами</li>
                <li>Приоритизация новых требований</li>
                <li>Корректировка плана проекта</li>
              </ul>
            </div>
            
            <MentorTip tip="Помните, что сбор требований — это не одноразовое мероприятие, а непрерывный процесс. В ходе работы над продуктом требования будут уточняться и дополняться. Ключевая задача — создать систему, которая позволит эффективно управлять этими изменениями." />
            
            <div className="flex justify-between mt-6">
              <button
                className={styles.btnSecondary}
                onClick={goToPreviousStage}
                disabled={isLoading}
              >
                Назад
              </button>
              <button
                className={styles.btnPrimary}
                onClick={goToNextStage}
                disabled={isLoading}
              >
                {isLoading ? 'Загрузка...' : 'К практике сбора требований'}
              </button>
            </div>
          </div>
        );

      case LevelStage.REQUIREMENTS_PRACTICE:
        return (
          <div className={styles.card}>
            <h2 className={styles.levelTitle}>Сбор и анализ требований</h2>
            <p className={styles.levelSubtitle}>Практическое задание</p>
            
            <div className="mb-6">
              <div className="bg-slate-900 p-5 rounded-lg border border-slate-700 mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">Задание</h3>
                <p className="text-slate-300 mb-4">
                  Ваша задача — выявить требования к новому мобильному приложению для ведения задач 
                  на основе интервью с ключевыми стейкхолдерами. Затем вам нужно провести их 
                  приоритизацию и предложить минимальный жизнеспособный продукт (MVP).
                </p>
                
                <h4 className="text-lg font-medium text-indigo-400 mb-3">Цитаты из интервью:</h4>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <p className="text-sm text-slate-400 mb-1">CEO:</p>
                    <p className="italic text-slate-300">"Нам нужно приложение, которое поможет пользователям организовать свои задачи. Оно должно быть простым, но функциональным, чтобы мы могли быстро выйти на рынок. Самое важное — быстро запуститься и получить первую обратную связь."</p>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <p className="text-sm text-slate-400 mb-1">Маркетинг-директор:</p>
                    <p className="italic text-slate-300">"Приложение должно выделяться среди конкурентов. Было бы здорово добавить элементы геймификации — баллы, достижения, уровни — чтобы удержать пользователей. Также нужна возможность делиться прогрессом в соцсетях."</p>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <p className="text-sm text-slate-400 mb-1">Технический директор:</p>
                    <p className="italic text-slate-300">"Приложение должно работать как онлайн, так и офлайн. Синхронизация с облаком — обязательна. Кроме того, нужно обеспечить высокую производительность и защиту данных пользователей."</p>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <p className="text-sm text-slate-400 mb-1">Дизайн-директор:</p>
                    <p className="italic text-slate-300">"Интерфейс должен быть интуитивно понятным и минималистичным. Мы должны сделать акцент на удобство использования. Темная тема необходима. Я бы также добавила возможность персонализации интерфейса."</p>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <p className="text-sm text-slate-400 mb-1">Пользовательские интервью:</p>
                    <p className="italic text-slate-300">"Для меня важно иметь возможность организовать задачи по проектам и категориям. Я также хочу видеть прогресс выполнения задач и иметь уведомления о сроках."</p>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <p className="text-sm text-slate-400 mb-1">Аналитика:</p>
                    <p className="italic text-slate-300">"Согласно данным, многие пользователи испытывают трудности с завершением задач. 60% пользователей конкурентных приложений не возвращаются после первого использования."</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-900 p-5 rounded-lg border border-slate-700 mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">Составьте список требований</h3>
                <p className="text-slate-300 mb-4">
                  На основе информации выше, составьте список функциональных и нефункциональных требований:
                </p>
                
                <h4 className="text-lg font-medium text-indigo-400 mb-2">Функциональные требования:</h4>
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 mb-4">
                  <ol className="list-decimal pl-5 space-y-2 text-slate-300">
                    <li className="mb-2">
                      <input type="text" className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white" placeholder="Создание и редактирование задач..." />
                    </li>
                    <li className="mb-2">
                      <input type="text" className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white" placeholder="Организация задач по категориям..." />
                    </li>
                    <li className="mb-2">
                      <input type="text" className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white" placeholder="Напоминания о сроках..." />
                    </li>
                    <li className="mb-2">
                      <input type="text" className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white" placeholder="Отслеживание прогресса..." />
                    </li>
                    <li className="mb-2">
                      <input type="text" className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white" placeholder="Синхронизация с облаком..." />
                    </li>
                    <li className="mb-2">
                      <input type="text" className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white" placeholder="Работа в офлайн-режиме..." />
                    </li>
                    <li className="mb-2">
                      <input type="text" className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white" placeholder="Элементы геймификации..." />
                    </li>
                    <li className="mb-2">
                      <input type="text" className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white" placeholder="Интеграция с соцсетями..." />
                    </li>
                    <li className="mb-2">
                      <input type="text" className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white" placeholder="Персонализация интерфейса..." />
                    </li>
                    <li className="mb-2">
                      <input type="text" className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white" placeholder="Добавьте свой вариант..." />
                    </li>
                  </ol>
                </div>
                
                <h4 className="text-lg font-medium text-indigo-400 mb-2">Нефункциональные требования:</h4>
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 mb-4">
                  <ol className="list-decimal pl-5 space-y-2 text-slate-300">
                    <li className="mb-2">
                      <input type="text" className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white" placeholder="Интуитивно понятный интерфейс..." />
                    </li>
                    <li className="mb-2">
                      <input type="text" className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white" placeholder="Высокая производительность..." />
                    </li>
                    <li className="mb-2">
                      <input type="text" className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white" placeholder="Безопасность данных..." />
                    </li>
                    <li className="mb-2">
                      <input type="text" className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white" placeholder="Поддержка темной темы..." />
                    </li>
                    <li className="mb-2">
                      <input type="text" className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white" placeholder="Добавьте свой вариант..." />
                    </li>
                  </ol>
                </div>
              </div>
              
              <div className="bg-slate-900 p-5 rounded-lg border border-slate-700 mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">Приоритизация требований и MVP</h3>
                <p className="text-slate-300 mb-4">
                  Используя метод MoSCoW, распределите требования по приоритетам.
                  Обоснуйте выбор 5 наиболее приоритетных функций для MVP:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-2">Must Have (необходимо)</h4>
                    <textarea 
                      className="w-full h-32 bg-slate-700 border border-slate-600 rounded p-2 text-white mb-2" 
                      placeholder="Перечислите требования этой категории..."
                    ></textarea>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-2">Should Have (следует иметь)</h4>
                    <textarea 
                      className="w-full h-32 bg-slate-700 border border-slate-600 rounded p-2 text-white mb-2" 
                      placeholder="Перечислите требования этой категории..."
                    ></textarea>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-2">Could Have (можно иметь)</h4>
                    <textarea 
                      className="w-full h-32 bg-slate-700 border border-slate-600 rounded p-2 text-white mb-2" 
                      placeholder="Перечислите требования этой категории..."
                    ></textarea>
                  </div>
                  <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <h4 className="font-semibold text-white mb-2">Won't Have (не будет)</h4>
                    <textarea 
                      className="w-full h-32 bg-slate-700 border border-slate-600 rounded p-2 text-white mb-2" 
                      placeholder="Перечислите требования этой категории..."
                    ></textarea>
                  </div>
                </div>
                
                <h4 className="text-lg font-medium text-indigo-400 mb-2">Минимальный жизнеспособный продукт (MVP):</h4>
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                  <p className="text-slate-300 mb-2">
                    Опишите, какие функции вы включите в MVP и почему:
                  </p>
                  <textarea 
                    className="w-full h-48 bg-slate-700 border border-slate-600 rounded p-2 text-white" 
                    placeholder="Для MVP нашего приложения для управления задачами я предлагаю включить следующие 5 функций..."
                  ></textarea>
                </div>
              </div>
              
              <div className="bg-slate-900 p-5 rounded-lg border border-slate-700 mb-6">
                <h3 className="text-xl font-semibold text-white mb-4">Валидация требований</h3>
                <p className="text-slate-300 mb-4">
                  Как вы будете проверять, что выявленные требования соответствуют реальным потребностям пользователей?
                </p>
                <textarea 
                  className="w-full h-32 bg-slate-700 border border-slate-600 rounded p-2 text-white" 
                  placeholder="Для валидации требований я предлагаю использовать следующие методы..."
                ></textarea>
              </div>
            </div>
            
            <MentorTip tip="Помните о важности баланса между желаниями стейкхолдеров и реальными возможностями проекта. MVP должен решать ключевую проблему пользователей, быть реализуемым в короткие сроки и при этом предоставлять достаточную ценность для получения обратной связи." />
            
            <NotesSystem
              notes={notes}
              setNotes={setNotes}
              placeholder="Запишите ключевые выводы из анализа требований..."
            />
            
            <div className="flex justify-between mt-6">
              <button
                className={styles.btnSecondary}
                onClick={goToPreviousStage}
                disabled={isLoading}
              >
                Назад
              </button>
              <button
                className={styles.btnPrimary}
                onClick={goToNextStage}
                disabled={isLoading}
              >
                {isLoading ? 'Загрузка...' : 'К исследованию пользователей'}
              </button>
            </div>
          </div>
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
            <QuizComponent 
              questions={quizQuestions} 
              onComplete={() => setCurrentStage(LevelStage.COMPLETE)} 
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
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-900 text-white">
        <Head>
          <title>Уровень 2: Планирование проекта | GamePM</title>
          <meta name="description" content="Второй уровень обучающей игры по продуктовому менеджменту" />
        </Head>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {renderStageContent()}
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Level2; 