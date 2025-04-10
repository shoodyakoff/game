import { useState, useEffect } from 'react';
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
import { StepNavigation } from '../../components/levels/shared/navigation';
import { LevelNavigation } from '../../components/levels/shared/navigation';
import { Completion } from '../../components/levels/level1/stages/Completion';

// Импорты компонентов стадий из правильных путей
import ProductMindsetTheory from '../../components/levels/level1/stages/ProductMindsetTheory';
import UXAnalysisTheory from '../../components/levels/level1/stages/UXAnalysisTheory';
import MetricsTheory from '../../components/levels/level1/stages/MetricsTheory';
import DecisionMakingTheory from '../../components/levels/level1/stages/DecisionMakingTheory';

import ProductThinkingPractice from '../../components/levels/level1/stages/ProductThinkingPractice';
import UXAnalysisPractice from '../../components/levels/level1/stages/UXAnalysisPractice';
import MetricsPractice from '../../components/levels/level1/stages/MetricsPractice';
import DecisionMakingPractice from '../../components/levels/level1/stages/DecisionMakingPractice';

// Импортируем стили из правильного пути
import { styles as componentStyles } from '../../components/levels/level1/common/styles';

// Этапы уровня
const STAGE_ORDER = [
  LevelStage.INTRO,
  LevelStage.PRODUCT_THINKING_THEORY,
  LevelStage.PRODUCT_THINKING_PRACTICE,
  LevelStage.UX_ANALYSIS_THEORY,
  LevelStage.UX_ANALYSIS_PRACTICE,
  LevelStage.QUIZ
];

// Добавим моковые данные для этапа анализа
const mockAnalysisData = {
  user_feedback: {
    feedbacks: [
      {
        id: "fb1",
        userName: "Ирина К.",
        rating: 3,
        text: "Приложение в целом неплохое, но создание новой задачи занимает слишком много времени. Много полей, которые я не понимаю, зачем нужны.",
        date: "2023-05-15"
      },
      {
        id: "fb2",
        userName: "Алексей М.",
        rating: 2,
        text: "Слишком сложно добавить простую задачу. Почему нельзя просто написать название и дату дедлайна? Зачем все эти дополнительные поля?",
        date: "2023-05-10"
      },
      {
        id: "fb3",
        userName: "Михаил П.",
        rating: 4,
        text: "Хорошее приложение, но интерфейс создания задач не интуитивный. Особенно сложно с мобильного телефона.",
        date: "2023-05-05"
      },
      {
        id: "fb4",
        userName: "Елена С.",
        rating: 3,
        text: "Пыталась создать задачу на ходу в метро, не получилось — слишком много обязательных полей и мелких элементов.",
        date: "2023-04-28"
      },
      {
        id: "fb5",
        userName: "Дмитрий В.",
        rating: 1,
        text: "Удалил приложение. Хотел быстро набросать список дел, а пришлось заполнять какие-то сложные формы. Слишком перегружено.",
        date: "2023-04-25"
      }
    ],
    summary: "Большинство негативных отзывов связано со сложностью и длительностью процесса создания новых задач. Пользователи часто жалуются на избыточное количество полей и неудобство использования на мобильных устройствах."
  },
  analytics: {
    conversion: {
      start_task_creation: 100,
      filled_main_fields: 85,
      filled_additional_fields: 62,
      completed_task_creation: 45
    },
    averages: {
      time_to_create_task: "3 мин 24 сек",
      fields_filled_per_task: 4.3,
      abandonment_rate: "55%"
    },
    device_stats: {
      desktop_completion_rate: "58%",
      mobile_completion_rate: "32%",
      tablet_completion_rate: "45%"
    },
    common_exit_points: [
      { field: "Приоритет", exit_percentage: "15%" },
      { field: "Теги", exit_percentage: "20%" },
      { field: "Связанные задачи", exit_percentage: "25%" },
      { field: "Описание", exit_percentage: "10%" }
    ]
  },
  interface: {
    current_flow: [
      { step: 1, screen: "Главный экран", action: "Нажатие кнопки + (Новая задача)" },
      { step: 2, screen: "Форма задачи - основное", fields: ["Название*", "Дата*", "Проект*", "Приоритет*", "Исполнитель*"] },
      { step: 3, screen: "Форма задачи - детали", fields: ["Описание", "Вложения", "Теги", "Связанные задачи"] },
      { step: 4, screen: "Форма задачи - настройки", fields: ["Уведомления", "Повторение", "Видимость", "Доступ"] },
      { step: 5, screen: "Предпросмотр задачи", action: "Подтверждение создания" }
    ],
    pain_points: [
      "Много обязательных полей (помечены *)",
      "Многоэтапный процесс (5 шагов)",
      "Маленькие элементы управления на мобильных устройствах",
      "Неочевидная навигация между шагами",
      "Отсутствие возможности быстрого добавления простой задачи"
    ],
    screenshots: [
      { screen: "Шаг 1 - Главный экран", image_url: "/images/analysis/task_creation_1.png" },
      { screen: "Шаг 2 - Основные поля", image_url: "/images/analysis/task_creation_2.png" },
      { screen: "Шаг 3 - Детали", image_url: "/images/analysis/task_creation_3.png" }
    ]
  },
  interviews: {
    participants: [
      { id: "p1", name: "Марина", age: 28, occupation: "Менеджер проектов", usage: "Ежедневно" },
      { id: "p2", name: "Сергей", age: 35, occupation: "Предприниматель", usage: "Несколько раз в неделю" },
      { id: "p3", name: "Наталья", age: 42, occupation: "HR-специалист", usage: "Ежедневно" },
      { id: "p4", name: "Иван", age: 24, occupation: "Студент", usage: "Несколько раз в месяц" }
    ],
    key_findings: [
      "Пользователи не понимают, зачем нужны все поля в форме создания задачи",
      "Большинство участников используют только 3-4 поля, остальные игнорируют",
      "Мобильные пользователи особенно недовольны сложностью интерфейса",
      "Участники выразили желание иметь опцию 'быстрое добавление' для простых задач",
      "Новые пользователи часто путаются в многоэтапной форме"
    ],
    quotes: [
      { participant: "p1", quote: "Я трачу больше времени на заполнение формы, чем на выполнение некоторых задач." },
      { participant: "p2", quote: "Мне нужна возможность быстро записать идею или задачу, без заполнения десятка полей." },
      { participant: "p3", quote: "В моей компании многие отказались от приложения именно из-за сложного процесса создания задач." },
      { participant: "p4", quote: "Я вообще не понимаю, зачем мне указывать приоритет для каждой мелкой задачи." }
    ]
  }
};

type Progress = LevelStage[];

const Level1: NextPage = () => {
  const router = useRouter();
  const selectedCharacter = useSelector(selectSelectedCharacter);
  const [isClient, setIsClient] = useState(false);
  const [currentStage, setCurrentStage] = useState<LevelStage>(LevelStage.INTRO);
  const [progress, setProgress] = useState<LevelStage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [levelData, setLevelData] = useState<any>(null);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [notes, setNotes] = useState<string[]>([]);
  const [selectedSolution, setSelectedSolution] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [completionTime, setCompletionTime] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [currentDialogIndex, setCurrentDialogIndex] = useState(0);
  const [dialogsCompleted, setDialogsCompleted] = useState(false);
  const [feedbackCompleted, setFeedbackCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [completedStages, setCompletedStages] = useState<LevelStage[]>([]);
  
  useEffect(() => {
    setIsClient(true);
    
    // Если у пользователя нет выбранного персонажа, перенаправляем на страницу выбора
    if (isClient && !selectedCharacter) {
      router.push('/character?redirectTo=/levels/1');
    }
    
    // Загрузка данных уровня
    const loadLevelData = async () => {
      try {
        // Имитация API запроса
        setLevelData({
          id: 1,
          title: 'Введение в продуктовое мышление',
          description: 'Научитесь основам продуктового мышления: от анализа пользовательских потребностей до принятия взвешенных решений на основе данных.',
        });
        
        setAnalysisData(mockAnalysisData);
        
        // Загрузка прогресса
        const savedProgress = localStorage.getItem('level1Progress');
        if (savedProgress) {
          try {
            const parsedProgress = JSON.parse(savedProgress);
            setProgress(parsedProgress.progress || []);
            setCurrentStage(parsedProgress.currentStage || LevelStage.INTRO);
            setCompletedStages(parsedProgress.completedStages || []);
          } catch (error) {
            console.error('Ошибка при загрузке прогресса:', error);
          }
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Ошибка при загрузке данных уровня:', error);
        setIsLoading(false);
      }
    };
    
    loadLevelData();
  }, [isClient, router, selectedCharacter]);
  
  // Сохранение прогресса
  useEffect(() => {
    if (!isLoading) {
      const saveData = {
        progress,
        currentStage,
        completedStages
      };
      localStorage.setItem('level1Progress', JSON.stringify(saveData));
    }
  }, [progress, currentStage, completedStages, isLoading]);
  
  // Вспомогательный метод для загрузки аналитических данных
  const loadAnalysisData = async () => {
    if (currentStage === LevelStage.UX_ANALYSIS_PRACTICE && !analysisData) {
      try {
        // В реальном приложении здесь будет API запрос
        // const response = await axios.get('/api/levels/1/analysis-data');
        // setAnalysisData(response.data);
        
        // Для демо используем моковые данные
        setAnalysisData(mockAnalysisData);
      } catch (error) {
        console.error('Ошибка при загрузке аналитических данных:', error);
        // Используем моковые данные при ошибке
        setAnalysisData(mockAnalysisData);
      }
    }
  };
  
  // Метод для перехода на следующую стадию
  const getNextStage = (currentStage: LevelStage): LevelStage => {
    switch (currentStage) {
      case LevelStage.INTRO:
        return LevelStage.PRODUCT_THINKING_THEORY;
        
      case LevelStage.PRODUCT_THINKING_THEORY:
        return LevelStage.PRODUCT_THINKING_PRACTICE;
      case LevelStage.PRODUCT_THINKING_PRACTICE:
        return LevelStage.UX_ANALYSIS_THEORY;
        
      case LevelStage.UX_ANALYSIS_THEORY:
        return LevelStage.UX_ANALYSIS_PRACTICE;
      case LevelStage.UX_ANALYSIS_PRACTICE:
        return LevelStage.METRICS_THEORY;
        
      case LevelStage.METRICS_THEORY:
        return LevelStage.METRICS_PRACTICE;
      case LevelStage.METRICS_PRACTICE:
        return LevelStage.DECISION_MAKING_THEORY;
        
      case LevelStage.DECISION_MAKING_THEORY:
        return LevelStage.DECISION_MAKING_PRACTICE;
      case LevelStage.DECISION_MAKING_PRACTICE:
        return LevelStage.QUIZ;
        
      case LevelStage.QUIZ:
        return LevelStage.COMPLETE;
      case LevelStage.COMPLETE:
      default:
        return LevelStage.COMPLETE;
    }
  };
  
  // Обновляем функцию перехода к предыдущему этапу
  const goToPreviousStage = () => {
    const prevStage = getPreviousStage(currentStage);
    setCurrentStage(prevStage);
    saveProgress(prevStage, progress);
  };

  // Функция для определения предыдущей стадии
  const getPreviousStage = (currentStage: LevelStage): LevelStage => {
    switch (currentStage) {
      case LevelStage.PRODUCT_THINKING_THEORY:
        return LevelStage.INTRO;
      case LevelStage.PRODUCT_THINKING_PRACTICE:
        return LevelStage.PRODUCT_THINKING_THEORY;
      case LevelStage.UX_ANALYSIS_THEORY:
        return LevelStage.PRODUCT_THINKING_PRACTICE;
      case LevelStage.UX_ANALYSIS_PRACTICE:
        return LevelStage.UX_ANALYSIS_THEORY;
      case LevelStage.METRICS_THEORY:
        return LevelStage.UX_ANALYSIS_PRACTICE;
      case LevelStage.METRICS_PRACTICE:
        return LevelStage.METRICS_THEORY;
      case LevelStage.DECISION_MAKING_THEORY:
        return LevelStage.METRICS_PRACTICE;
      case LevelStage.DECISION_MAKING_PRACTICE:
        return LevelStage.DECISION_MAKING_THEORY;
      case LevelStage.QUIZ:
        return LevelStage.DECISION_MAKING_PRACTICE;
      case LevelStage.COMPLETE:
        return LevelStage.QUIZ;
      default:
        return LevelStage.INTRO;
    }
  };

  // Загружаем сохраненный прогресс и этап из URL при монтировании компонента
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Проверяем наличие параметра stage в URL
      const urlParams = new URLSearchParams(window.location.search);
      const stageParam = urlParams.get('stage');
      
      if (stageParam && Object.values(LevelStage).includes(stageParam as LevelStage)) {
        setCurrentStage(stageParam as LevelStage);
        
        // Устанавливаем соответствующий прогресс
        switch (stageParam) {
          case LevelStage.PRODUCT_THINKING_THEORY: saveProgress(stageParam as LevelStage, progress); break;
          case LevelStage.UX_ANALYSIS_THEORY: saveProgress(stageParam as LevelStage, progress); break;
          case LevelStage.METRICS_THEORY: saveProgress(stageParam as LevelStage, progress); break;
          case LevelStage.DECISION_MAKING_THEORY: saveProgress(stageParam as LevelStage, progress); break;
          case LevelStage.UX_ANALYSIS_PRACTICE: saveProgress(stageParam as LevelStage, progress); break;
          case LevelStage.METRICS_PRACTICE: saveProgress(stageParam as LevelStage, progress); break;
          case LevelStage.DECISION_MAKING_PRACTICE: saveProgress(stageParam as LevelStage, progress); break;
          case LevelStage.QUIZ: saveProgress(stageParam as LevelStage, progress); break;
          case LevelStage.COMPLETE: saveProgress(stageParam as LevelStage, progress); break;
        }
      }
    }
  }, []);
  
  // Функция для сохранения прогресса
  const saveProgress = (stage: LevelStage, currentProgress: Progress) => {
    if (!currentProgress.includes(stage)) {
      const newProgress = [...currentProgress, stage];
      setProgress(newProgress);
      localStorage.setItem('level1Progress', JSON.stringify({ progress: newProgress, completedStages: currentProgress }));
    }
  };
  
  // Метод для добавления заметки
  const addNote = (note: string) => {
    const updatedNotes = [...notes, note];
    setNotes(updatedNotes);
    saveProgress(currentStage, progress);
  };
  
  // Метод для выбора материала
  const handleSelectMaterial = (materialType: string) => {
    setSelectedMaterial(materialType);
    saveProgress(currentStage, progress);
  };
  
  // Метод для выбора решения
  const handleSelectSolution = (solutionId: string) => {
    setSelectedSolution(solutionId);
    saveProgress(currentStage, progress);
    setCurrentStage(getNextStage(currentStage));
  };
  
  // Метод для перехода к следующему диалогу
  const goToNextDialog = () => {
    if (currentDialogIndex < 5) { // 6 диалогов (0-5)
      setCurrentDialogIndex(prevIndex => prevIndex + 1);
    } else {
      setDialogsCompleted(true);
    }
  };
  
  // Функция для завершения уровня
  const completeLevel = async () => {
    try {
      setIsLoading(true);
      
      const completionTimeSeconds = Math.round((Date.now() - startTime) / 1000);
      setCompletionTime(completionTimeSeconds);
      
      // Отправляем запрос на завершение уровня
      try {
        const response = await axios.post('/api/levels/1/complete', {
          finalDecision: selectedSolution,
          timeSpent: completionTimeSeconds,
          characterType: selectedCharacter?.type
        });
        
        setResult(response.data);
      } catch (error) {
        console.error('Ошибка при завершении уровня через API:', error);
        
        // Моковый результат при ошибке API
        setResult({
          success: true,
          levelCompleted: true,
          rewards: {
            experience: 100,
            achievement: "Первый рабочий день",
            item: "Базовая заметка"
          },
          nextLevelUnlocked: true,
          summary: {
            decision: selectedSolution,
            timeSpent: completionTimeSeconds,
            outcome: "Поздравляем с успешным завершением первого уровня!"
          }
        });
      }
      
      // Сохраняем статус завершения уровня в localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('level1-completed', 'true');
      }
      
      // Переходим к этапу завершения
      setCurrentStage(LevelStage.COMPLETE);
      saveProgress(LevelStage.COMPLETE, progress);
      
      // Сохраняем финальный прогресс
      saveProgress(LevelStage.COMPLETE, progress);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Ошибка при завершении уровня:', error);
      setIsLoading(false);
    }
  };
  
  // При изменении стадии выполняем соответствующие действия
  useEffect(() => {
    const onStageEnter = (stage: LevelStage) => {
      // Прокручиваем страницу в начало при смене этапа
      window.scrollTo(0, 0);
      
      switch (stage) {
        case LevelStage.INTRO:
          setCurrentDialogIndex(0);
          break;
        case LevelStage.QUIZ:
          setQuizScore(0);
          setQuizAnswers([]);
          break;
        default:
          // Сбросить данные для других стадий при необходимости
          break;
      }
      
      // Сохраняем прогресс при переходе на новую стадию
      saveProgress(stage, progress);
    };
    
    onStageEnter(currentStage);
  }, [currentStage]);
  
  // Функция для проверки выполнения стадии
  const checkStageCompletion = (stage: LevelStage): boolean => {
    switch (stage) {
      case LevelStage.INTRO:
        return true;  // Введение всегда считается выполненным
      case LevelStage.PRODUCT_THINKING_THEORY:
      case LevelStage.UX_ANALYSIS_THEORY:
      case LevelStage.METRICS_THEORY:
      case LevelStage.DECISION_MAKING_THEORY:
        return true;  // Теоретические блоки всегда считаются выполненными
      case LevelStage.PRODUCT_THINKING_PRACTICE:
      case LevelStage.UX_ANALYSIS_PRACTICE:
      case LevelStage.METRICS_PRACTICE:
      case LevelStage.DECISION_MAKING_PRACTICE:
        return progress.includes(stage);
      case LevelStage.QUIZ:
        return quizScore > 0;
      case LevelStage.COMPLETE:
        return true;
      default:
        return false;
    }
  };
  
  // Обработчик завершения этапа
  const handleStageComplete = (stage: LevelStage) => {
    // Добавляем этап в текущий прогресс
    const currentProgress = [...progress];
    if (!currentProgress.includes(stage)) {
      const newProgress = [...currentProgress, stage];
      setProgress(newProgress);
    }
    
    // Добавляем этап в список завершенных, если он еще не там
    if (!completedStages.includes(stage)) {
      setCompletedStages(prev => [...prev, stage]);
    }
    
    // Переходим к следующему этапу
    setCurrentStage(getNextStage(stage));
  };
  
  // Список всех этапов для навигации
  const stagesList = [
    { stage: LevelStage.INTRO, title: 'Введение', 
      completed: progress.includes(LevelStage.INTRO) || completedStages.includes(LevelStage.INTRO) },
    { stage: LevelStage.PRODUCT_THINKING_THEORY, title: 'Продуктовое мышление: теория', 
      completed: progress.includes(LevelStage.PRODUCT_THINKING_THEORY) || completedStages.includes(LevelStage.PRODUCT_THINKING_THEORY) },
    { stage: LevelStage.PRODUCT_THINKING_PRACTICE, title: 'Продуктовое мышление: практика',
      completed: progress.includes(LevelStage.PRODUCT_THINKING_PRACTICE) || completedStages.includes(LevelStage.PRODUCT_THINKING_PRACTICE) },
    { stage: LevelStage.UX_ANALYSIS_THEORY, title: 'UX анализ: теория',
      completed: progress.includes(LevelStage.UX_ANALYSIS_THEORY) || completedStages.includes(LevelStage.UX_ANALYSIS_THEORY) },
    { stage: LevelStage.UX_ANALYSIS_PRACTICE, title: 'UX анализ: практика',
      completed: progress.includes(LevelStage.UX_ANALYSIS_PRACTICE) || completedStages.includes(LevelStage.UX_ANALYSIS_PRACTICE) },
    { stage: LevelStage.METRICS_THEORY, title: 'Метрики: теория',
      completed: progress.includes(LevelStage.METRICS_THEORY) || completedStages.includes(LevelStage.METRICS_THEORY) },
    { stage: LevelStage.METRICS_PRACTICE, title: 'Метрики: практика',
      completed: progress.includes(LevelStage.METRICS_PRACTICE) || completedStages.includes(LevelStage.METRICS_PRACTICE) },
    { stage: LevelStage.DECISION_MAKING_THEORY, title: 'Принятие решений: теория',
      completed: progress.includes(LevelStage.DECISION_MAKING_THEORY) || completedStages.includes(LevelStage.DECISION_MAKING_THEORY) },
    { stage: LevelStage.DECISION_MAKING_PRACTICE, title: 'Принятие решений: практика',
      completed: progress.includes(LevelStage.DECISION_MAKING_PRACTICE) || completedStages.includes(LevelStage.DECISION_MAKING_PRACTICE) },
    { stage: LevelStage.QUIZ, title: 'Финальный тест',
      completed: progress.includes(LevelStage.QUIZ) || completedStages.includes(LevelStage.QUIZ) },
    { stage: LevelStage.COMPLETE, title: 'Завершение',
      completed: progress.includes(LevelStage.COMPLETE) || completedStages.includes(LevelStage.COMPLETE) }
  ];
  
  // Рендер содержимого в зависимости от текущего этапа
  const renderStageContent = () => {
    // Создание компонента кнопки "Назад"
    const backButton = currentStage !== LevelStage.INTRO ? (
      <button 
        className={componentStyles.btnSecondary}
        onClick={goToPreviousStage}
      >
        Назад
      </button>
    ) : null;
    
    switch (currentStage) {
      case LevelStage.INTRO:
        // Шаги интро
        const introSteps = [
          // Шаг 1: Введение
          <div key="intro-step-1">
            <h1 className={componentStyles.header}>Уровень 1: Основы продуктового мышления</h1>
            
            <p className={componentStyles.text}>
              Добро пожаловать на первый уровень! Здесь вы познакомитесь с основами продуктового мышления 
              и научитесь применять его на практике.
            </p>
            
            <p className={componentStyles.text}>
              В этом уровне вас ждет:
            </p>
            
            <ul className={componentStyles.list}>
              <li>Теоретическая часть с ключевыми концепциями</li>
              <li>Практические задания для закрепления знаний</li>
              <li>Финальный тест для проверки усвоенного материала</li>
            </ul>
            
            <div className="mb-4 mt-6">
              <MentorTip
                tip="Добро пожаловать! В этом уровне вы будете чередовать теорию и практику, что поможет лучше усвоить материал. Не спешите и внимательно выполняйте все задания."
                position="bottom-right"
                showIcon={true}
                avatar="/characters/avatar_mentor.png"
                name="Ментор"
                defaultOpen={false}
              />
            </div>
          </div>,
          
          // Шаг 2: Структура обучения
          <div key="intro-step-2">
            <h2 className={componentStyles.subheader}>Как построено обучение</h2>
            
            <p className={componentStyles.text}>
              Каждый раздел состоит из двух частей:
            </p>
            
            <ul className={componentStyles.list}>
              <li><strong>Теория</strong> - здесь вы изучите основные концепции и принципы</li>
              <li><strong>Практика</strong> - здесь вы примените полученные знания на практике</li>
            </ul>
            
            <p className={componentStyles.text}>
              После каждого раздела вы сможете проверить свои знания и перейти к следующему этапу.
            </p>
          </div>,
          
          // Шаг 3: Начало обучения
          <div key="intro-step-3">
            <h2 className={componentStyles.subheader}>Готовы начать?</h2>
            
            <p className={componentStyles.text}>
              Теперь, когда вы знаете, как построено обучение, давайте начнем с основ продуктового мышления.
            </p>
            
            <p className={componentStyles.text}>
              В первом разделе вы познакомитесь с ключевыми принципами и научитесь применять их на практике.
            </p>
          </div>
        ];
        
        return (
          <div className={componentStyles.container}>
            <StepNavigation 
              steps={introSteps} 
              onComplete={() => handleStageComplete(LevelStage.INTRO)}
              completeButtonText="Начать обучение"
            />
          </div>
        );
        
      case LevelStage.PRODUCT_THINKING_THEORY:
        return <ProductMindsetTheory onComplete={() => handleStageComplete(LevelStage.PRODUCT_THINKING_THEORY)} />;
        
      case LevelStage.UX_ANALYSIS_THEORY:
        return <UXAnalysisTheory onComplete={() => handleStageComplete(LevelStage.UX_ANALYSIS_THEORY)} />;
        
      case LevelStage.METRICS_THEORY:
        return <MetricsTheory onComplete={() => handleStageComplete(LevelStage.METRICS_THEORY)} />;
        
      case LevelStage.DECISION_MAKING_THEORY:
        return <DecisionMakingTheory onComplete={() => handleStageComplete(LevelStage.DECISION_MAKING_THEORY)} />;
      
      case LevelStage.PRODUCT_THINKING_PRACTICE:
        return <ProductThinkingPractice onComplete={() => handleStageComplete(LevelStage.PRODUCT_THINKING_PRACTICE)} />;
        
      case LevelStage.UX_ANALYSIS_PRACTICE:
        return <UXAnalysisPractice onComplete={() => handleStageComplete(LevelStage.UX_ANALYSIS_PRACTICE)} />;
        
      case LevelStage.METRICS_PRACTICE:
        return <MetricsPractice onComplete={() => handleStageComplete(LevelStage.METRICS_PRACTICE)} />;
        
      case LevelStage.DECISION_MAKING_PRACTICE:
        return <DecisionMakingPractice onComplete={() => handleStageComplete(LevelStage.DECISION_MAKING_PRACTICE)} />;
      
      case LevelStage.QUIZ:
        return (
          <div className={componentStyles.container}>
            <h1 className={componentStyles.header}>Финальный тест</h1>
            <Quiz
              questions={quizQuestions}
              onComplete={(results) => {
                setQuizScore(results.score);
                if (results.score > 0) {
                  handleStageComplete(LevelStage.QUIZ);
                }
              }}
            />
          </div>
        );
        
      case LevelStage.COMPLETE:
        return (
          <div className="max-w-4xl mx-auto">
            <Completion onComplete={() => {
              // Здесь можно добавить дополнительную логику при завершении
              router.push('/levels');
            }} />
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-indigo-950 text-white">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
              <p className="text-xl">Загрузка уровня...</p>
            </div>
          </div>
        ) : (
          <>
            <LevelNavigation 
              currentStage={currentStage} 
              setCurrentStage={setCurrentStage} 
              stages={stagesList} 
            />
            <div className="max-w-7xl mx-auto px-4 py-8">
              {renderStageContent()}
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
};

// Вопросы для квиза
const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Какая проблема является наиболее критичной для пользователей при создании задачи?",
    options: [
      { id: "a", text: "Слишком яркие цвета интерфейса", isCorrect: false },
      { id: "b", text: "Множество обязательных полей, которые не всегда нужны", isCorrect: true },
      { id: "c", text: "Медленная загрузка страницы", isCorrect: false },
      { id: "d", text: "Отсутствие возможности прикрепить файлы", isCorrect: false },
    ],
    explanation: "Согласно отзывам пользователей и аналитике, основной проблемой является большое количество обязательных полей, что усложняет и замедляет процесс создания задачи. Это подтверждается высоким процентом отказов на этапе заполнения дополнительных полей.",
    type: 'single',
    difficulty: 'medium',
    points: 10
  },
  {
    id: 2,
    question: "На каком устройстве конверсия завершения создания задачи самая низкая?",
    options: [
      { id: "a", text: "Десктоп", isCorrect: false },
      { id: "b", text: "Планшет", isCorrect: false },
      { id: "c", text: "Мобильный телефон", isCorrect: true },
      { id: "d", text: "Конверсия одинакова на всех устройствах", isCorrect: false },
    ],
    explanation: "Аналитика показывает, что на мобильных устройствах самая низкая конверсия завершения создания задачи. Это связано с тем, что форма не оптимизирована для маленьких экранов, и пользователям сложнее заполнять множество полей.",
    type: 'single',
    difficulty: 'easy',
    points: 5
  },
  {
    id: 3,
    question: "Какое решение наиболее эффективно для повышения конверсии создания задач?",
    options: [
      { id: "a", text: "Добавить больше подсказок к полям", isCorrect: false },
      { id: "b", text: "Увеличить размер кнопок на мобильных устройствах", isCorrect: false },
      { id: "c", text: "Реализовать поэтапное создание задачи с разделением на шаги", isCorrect: false },
      { id: "d", text: "Упростить форму и сделать большинство полей опциональными", isCorrect: true },
    ],
    explanation: "Упрощение формы и снижение количества обязательных полей напрямую решает основную проблему, выявленную в исследовании – сложный и перегруженный процесс создания задачи. Это позволит быстрее создавать базовые задачи и увеличит конверсию.",
    type: 'single',
    difficulty: 'medium',
    points: 10
  },
  {
    id: 4,
    question: "Что такое прогрессивное раскрытие (progressive disclosure) в UX дизайне?",
    options: [
      { id: "a", text: "Техника анимации элементов при открытии страницы", isCorrect: false },
      { id: "b", text: "Постепенное показывание информации по мере необходимости", isCorrect: true },
      { id: "c", text: "Метод тестирования интерфейса с реальными пользователями", isCorrect: false },
      { id: "d", text: "Способ организации навигации на сайте", isCorrect: false },
    ],
    explanation: "Прогрессивное раскрытие – это принцип дизайна, при котором информация и опции показываются пользователю постепенно, по мере необходимости, чтобы снизить когнитивную нагрузку. Это особенно полезно для сложных форм и процессов.",
    type: 'single',
    difficulty: 'hard',
    points: 15
  },
  {
    id: 5,
    question: "Какой подход к исследованию проблемы не использовался в данном проекте?",
    options: [
      { id: "a", text: "Анализ отзывов пользователей", isCorrect: false },
      { id: "b", text: "Количественное исследование (аналитика использования)", isCorrect: false },
      { id: "c", text: "Качественное исследование (интервью)", isCorrect: false },
      { id: "d", text: "A/B тестирование различных вариантов интерфейса", isCorrect: true },
    ],
    explanation: "В проекте были использованы анализ отзывов, количественные и качественные исследования, но не было A/B тестирования различных вариантов интерфейса. Это могло бы быть полезным дополнительным методом для проверки эффективности разных решений.",
    type: 'single',
    difficulty: 'medium',
    points: 10
  }
];

export default Level1; 