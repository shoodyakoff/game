"use strict";
exports.id = 81;
exports.ids = [81];
exports.modules = {

/***/ 8654:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "W": () => (/* binding */ styles),
/* harmony export */   "Z": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Стили для компонентов уровня 1
 */ const styles = {
    // Общие стили
    container: "bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-6 mb-6",
    header: "text-2xl font-bold mb-6 text-slate-300 border-b border-slate-700 pb-4",
    subheader: "text-2xl font-semibold text-indigo-400 mb-4",
    levelSubtitle: "text-lg text-slate-400 mb-6",
    section: "mb-8",
    sectionHeader: "mb-6",
    sectionTitle: "text-xl font-semibold text-slate-300 mb-4",
    sectionDescription: "text-slate-300 mb-4",
    text: "text-slate-300 mb-4 leading-relaxed",
    list: "list-disc list-inside text-slate-300 space-y-2 mb-6 pl-4",
    // Кнопки
    btnPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md flex items-center justify-center transition-colors shadow",
    btnSecondary: "bg-slate-700 hover:bg-slate-600 text-slate-300 font-medium py-2 px-4 rounded-md flex items-center justify-center transition-colors shadow border border-slate-600",
    btnNavigation: "flex items-center px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none transition-all duration-200",
    btnDisabled: "opacity-50 cursor-not-allowed",
    // Формы
    textarea: "w-full p-3 border border-slate-600 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
    input: "w-full p-3 border border-slate-600 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
    // Навигация по этапам
    tabs: "flex mb-6 border-b border-slate-600",
    tabButton: "px-4 py-2 font-medium text-slate-400 hover:text-indigo-400 focus:outline-none",
    activeTab: "text-indigo-400 border-b-2 border-indigo-400",
    tabButtonActive: "text-indigo-400 border-b-2 border-indigo-400",
    tabContent: "mt-4",
    // StageNavigation
    stageNavigation: "flex flex-col mt-8 pt-6 border-t border-slate-600",
    stageInfo: "flex justify-between items-center mb-4",
    stageName: "text-xl font-semibold text-indigo-400",
    stageCount: "text-slate-400",
    progressBar: "w-full h-2 bg-slate-700 rounded-full mb-6",
    progressFill: "h-full bg-indigo-600 rounded-full",
    navigationButtons: "flex justify-between items-center",
    navigationButton: "px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none",
    // TeamMeeting
    meetingHeader: "mb-6 pb-4 border-b border-slate-600",
    meetingTitle: "text-xl font-bold text-indigo-400 mb-2",
    meetingDate: "flex justify-between text-slate-400",
    meetingTime: "font-medium",
    teamSection: "mb-8",
    teamGrid: "grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6",
    teamMember: "flex flex-col items-center bg-slate-700 p-4 rounded-lg border border-slate-600",
    memberAvatar: "mb-3",
    memberInfo: "text-center",
    memberName: "font-medium text-indigo-700 block",
    memberRole: "text-sm text-gray-600",
    dialogSection: "mb-8",
    dialogContainer: "bg-gray-50 p-4 rounded-lg border border-gray-200",
    fullDialogContainer: "bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-[400px] overflow-y-auto",
    dialogMessage: "flex mb-4 last:mb-0",
    dialogAvatar: "flex-shrink-0 mr-3",
    messageContent: "flex-grow",
    messageSender: "font-semibold text-indigo-700 mb-1",
    messageText: "text-gray-700",
    dialogNavigation: "flex justify-between items-center mt-4 mb-3",
    dialogCounter: "text-gray-500",
    taskSection: "bg-indigo-50 p-4 rounded-lg border border-indigo-100",
    taskDescription: "text-gray-700 space-y-2",
    // MetricsPractice
    metricsNav: "flex flex-wrap mb-6 border-b border-gray-200",
    metricsNavButton: "px-4 py-2 font-medium text-gray-600 hover:text-indigo-600 focus:outline-none",
    active: "text-indigo-600 border-b-2 border-indigo-600",
    chartSection: "mb-8",
    chartContainer: "mb-6 bg-slate-800 p-4 rounded-lg border border-slate-600",
    chartTitle: "text-lg font-semibold text-white mb-4",
    chartPlaceholder: "text-center py-4",
    mockChart: "h-64 mb-4 bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-end justify-around",
    barChartMock: "flex items-end justify-around h-full w-full",
    barContainer: "flex flex-col items-center h-full",
    bar: "w-16 bg-indigo-600 rounded-t-md",
    barLabel: "text-xs text-gray-600 mt-1",
    lineChartMock: "w-full h-full flex flex-col",
    lineChart: "flex-grow",
    lineChartLabels: "flex justify-between mt-2",
    lineChartLabel: "text-xs text-gray-600",
    dataPreview: "mt-4 text-left",
    codeBlock: "bg-gray-100 p-2 rounded-md text-xs overflow-x-auto",
    tableWrapper: "overflow-x-auto",
    dataTable: "min-w-full border-collapse",
    "dataTable th": "bg-gray-100 px-4 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider border border-gray-200",
    "dataTable td": "px-4 py-2 border border-gray-200 text-sm text-gray-700",
    "dataTable tr:nth-child(even)": "bg-gray-50",
    analysisSection: "bg-gray-50 p-6 rounded-lg border border-gray-200 mb-8",
    analysisTitle: "text-xl font-semibold text-indigo-700 mb-4",
    insightsSelection: "mb-6",
    insightsList: "space-y-2",
    insightItem: "flex items-start",
    "insightItem input": "mt-1 mr-2",
    "insightItem label": "text-gray-700",
    conclusionSection: "mb-6",
    conclusionTextarea: "w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[150px]",
    wordCount: "text-sm text-gray-500 text-right mt-1",
    submitButton: "w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200",
    feedbackMessage: "mt-4 p-3 rounded-md",
    successFeedback: "bg-green-50 text-green-800 border border-green-200",
    errorFeedback: "bg-red-50 text-red-800 border border-red-200",
    warningFeedback: "bg-yellow-50 text-yellow-800 border border-yellow-200",
    // Советы ментора
    mentorTipButton: "absolute top-4 right-4 bg-yellow-500/20 text-yellow-500 p-2 rounded-full hover:bg-yellow-500/30 transition-all cursor-pointer",
    mentorTipIcon: "w-6 h-6",
    mentorTip: "bg-yellow-900/30 border-l-4 border-yellow-500 p-4 rounded-r-md my-6 relative",
    mentorTipTitle: "font-bold text-yellow-500 mb-2",
    mentorTipText: "text-slate-300",
    // Стили для MetricsTheory
    typesContainer: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8",
    typeBlock: "bg-indigo-50 p-4 rounded-lg border border-indigo-100",
    typeTitle: "text-xl font-semibold text-indigo-700 mb-2",
    typeDescription: "text-gray-700 mb-3",
    typeList: "list-disc pl-5 text-gray-700 space-y-1",
    funnelContainer: "space-y-4 mb-8",
    funnelStep: "bg-gradient-to-r from-indigo-50 to-white p-4 rounded-lg border border-indigo-100 mb-2",
    funnelStepTitle: "text-lg font-semibold text-indigo-700 mb-1",
    funnelStepDescription: "text-gray-700 mb-2",
    funnelStepMetrics: "list-disc pl-5 text-gray-700",
    northStarExamples: "bg-indigo-50 p-4 rounded-lg border border-indigo-100 mb-8",
    examplesTitle: "text-lg font-semibold text-indigo-700 mb-2",
    examplesList: "list-disc pl-5 text-gray-700 space-y-1",
    northStarTips: "bg-indigo-50 p-4 rounded-lg border border-indigo-100 mb-8",
    tipsTitle: "text-lg font-semibold text-indigo-700 mb-2",
    tipsList: "list-disc pl-5 text-gray-700 space-y-1",
    metricsExample: "bg-white p-6 rounded-lg border border-gray-200 mb-8",
    metricsExampleTitle: "text-xl font-semibold text-indigo-700 mb-4",
    metricsCard: "bg-slate-700 p-4 rounded-lg mb-6 border border-slate-600",
    metricsCardTitle: "text-lg font-semibold text-indigo-700 mb-3",
    metricsCardContent: "space-y-4",
    metricsSection: "bg-white p-3 rounded-lg",
    metricsSectionTitle: "text-md font-semibold text-indigo-700 mb-2",
    metricsList: "list-disc pl-5 text-gray-700 space-y-1",
    bestPractices: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-8",
    practiceItem: "bg-indigo-50 p-4 rounded-lg border border-indigo-100",
    practiceTitle: "text-lg font-semibold text-indigo-700 mb-2",
    practiceDescription: "text-gray-700",
    // Стили для UxAnalysis
    imageContainer: "border border-gray-200 rounded-lg p-2 mb-6",
    mockupImage: "w-full h-auto rounded mb-2",
    imageCaptionText: "text-sm text-gray-500 text-center",
    uxIssuesList: "space-y-4 mb-6",
    uxIssueCard: "bg-white p-4 rounded-lg border border-gray-200 shadow-sm",
    uxIssueHeader: "flex justify-between items-start cursor-pointer mb-2",
    uxIssueTitle: "flex items-center space-x-2",
    severityBadge: "ml-2 px-2 py-0.5 text-xs font-medium rounded-full",
    criticalSeverity: "bg-red-100 text-red-800",
    highSeverity: "bg-orange-100 text-orange-800",
    mediumSeverity: "bg-yellow-100 text-yellow-800",
    lowSeverity: "bg-green-100 text-green-800",
    uxIssueActions: "flex",
    uxIssueToggle: "text-gray-500 hover:text-indigo-600 focus:outline-none",
    uxIssueToggleOpen: "transform rotate-180",
    uxIssueDetails: "bg-gray-50 p-3 rounded-md mb-3",
    uxIssueDescription: "text-gray-700 mb-2",
    uxIssueImpact: "text-gray-700 mb-2",
    userQuote: "bg-white p-3 rounded-md border-l-4 border-indigo-300 italic text-gray-600 my-2",
    uxIssueSelection: "flex items-center space-x-2 mt-2",
    uxIssueCheckbox: "h-4 w-4 text-indigo-600 rounded border-gray-300",
    uxIssueCheckboxLabel: "text-sm text-gray-700",
    analysisActions: "mt-6 flex flex-col space-y-4",
    selectionCount: "text-sm text-gray-600 mb-2",
    // Стили для UXAnalysisPractice
    segmentsContainer: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8",
    segmentsList: "col-span-1",
    segmentCard: "bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-3 cursor-pointer hover:border-indigo-300",
    segmentCardSelected: "border-indigo-500 ring-2 ring-indigo-200",
    segmentName: "text-lg font-semibold text-indigo-700 mb-1",
    segmentDescription: "text-gray-600 text-sm",
    segmentDetails: "col-span-2 bg-white p-5 rounded-lg border border-gray-200 shadow-sm",
    detailsTitle: "text-xl font-semibold text-indigo-700 mb-3",
    painPointsList: "list-disc pl-5 text-gray-700 space-y-2 mb-6",
    painPoint: "text-gray-700",
    uxPracticeTitle: "text-xl font-semibold text-indigo-700 mb-2",
    uxPracticeDescription: "text-gray-700 mb-4",
    feedbackBox: "bg-white p-4 rounded-lg border mt-4 mb-2",
    feedbackTitle: "text-lg font-semibold mb-2",
    feedbackText: "text-gray-700 mb-4",
    exampleSolution: "bg-indigo-50 p-3 rounded-md",
    exampleTitle: "font-semibold text-indigo-700 mb-1",
    exampleText: "text-gray-700",
    journeyContainer: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8",
    journeySteps: "col-span-1 space-y-3",
    journeyStep: "flex items-center bg-white p-3 rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:border-indigo-300",
    journeyStepSelected: "border-indigo-500 ring-2 ring-indigo-200",
    stepNumber: "flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 font-semibold mr-3",
    stepContent: "flex-grow",
    stepName: "font-semibold text-indigo-700",
    stepBrief: "text-sm text-gray-600",
    stepDetails: "col-span-2 bg-white p-5 rounded-lg border border-gray-200 shadow-sm",
    stepDescription: "text-gray-700 mb-4",
    detailsSubtitle: "text-lg font-semibold text-indigo-700 mb-2",
    // Стили для Level1
    levelContainer: "max-w-4xl mx-auto p-4 md:p-6",
    stageContent: "mt-6 mb-10",
    // UX Analysis styles
    uxMethod: "bg-slate-700 p-4 rounded-lg mb-6 border border-slate-600",
    uxMethodTitle: "text-xl font-semibold text-indigo-400 mb-2",
    uxMethodDescription: "text-slate-300 mb-4",
    uxMethodDetails: "border-t border-slate-600 pt-4 mt-4",
    uxMethodSubtitle: "text-lg font-medium text-white mb-2",
    uxTip: "bg-indigo-900/30 border-l-4 border-indigo-400 p-4 rounded-r-md mb-6",
    uxTipTitle: "font-bold text-indigo-400 mb-2",
    // Metrics Analysis
    metricsGrid: "grid grid-cols-1 sm:grid-cols-2 gap-4",
    metricBox: "bg-slate-800 p-4 rounded-lg border border-slate-600",
    metricName: "text-sm font-medium text-slate-400 mb-1",
    metricValue: "text-2xl font-bold text-indigo-400",
    // Decision Making
    decisionCard: "bg-slate-700 p-4 rounded-lg mb-6 border border-slate-600",
    decisionTitle: "text-xl font-semibold text-indigo-400 mb-2",
    decisionGrid: "grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4",
    // Practice Components
    practiceContainer: "bg-slate-700 rounded-lg p-5 border border-slate-600",
    practiceTask: "bg-slate-800 p-4 rounded-lg mb-6 border border-slate-600",
    practiceControls: "flex justify-between mt-6 pt-4 border-t border-slate-600",
    contentBlock: "bg-slate-700/30 rounded-lg p-6 mb-6 border-l border-slate-600",
    paragraph: "text-slate-300 mb-4 leading-relaxed"
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (styles);


/***/ }),

/***/ 2081:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": () => (/* binding */ stages_MetricsPractice)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(6689);
// EXTERNAL MODULE: ./src/components/levels/level1/common/styles.ts
var styles = __webpack_require__(8654);
;// CONCATENATED MODULE: ./src/components/levels/level1/common/metrics-data.ts
const metricsData = {
    // Ежедневные метрики за последние 14 дней
    dailyMetrics: [
        {
            date: "2023-03-01",
            tasksStarted: 1245,
            tasksCompleted: 742,
            completionRate: 59.6,
            avgTimeToComplete: 185,
            errorRate: 12.3
        },
        {
            date: "2023-03-02",
            tasksStarted: 1312,
            tasksCompleted: 798,
            completionRate: 60.8,
            avgTimeToComplete: 178,
            errorRate: 11.8
        },
        {
            date: "2023-03-03",
            tasksStarted: 1187,
            tasksCompleted: 724,
            completionRate: 61.0,
            avgTimeToComplete: 182,
            errorRate: 12.1
        },
        {
            date: "2023-03-04",
            tasksStarted: 982,
            tasksCompleted: 591,
            completionRate: 60.2,
            avgTimeToComplete: 186,
            errorRate: 12.7
        },
        {
            date: "2023-03-05",
            tasksStarted: 876,
            tasksCompleted: 523,
            completionRate: 59.7,
            avgTimeToComplete: 189,
            errorRate: 13.2
        },
        {
            date: "2023-03-06",
            tasksStarted: 1421,
            tasksCompleted: 842,
            completionRate: 59.3,
            avgTimeToComplete: 184,
            errorRate: 12.5
        },
        {
            date: "2023-03-07",
            tasksStarted: 1534,
            tasksCompleted: 912,
            completionRate: 59.5,
            avgTimeToComplete: 183,
            errorRate: 12.2
        },
        {
            date: "2023-03-08",
            tasksStarted: 1489,
            tasksCompleted: 891,
            completionRate: 59.8,
            avgTimeToComplete: 181,
            errorRate: 12.0
        },
        {
            date: "2023-03-09",
            tasksStarted: 1367,
            tasksCompleted: 820,
            completionRate: 60.0,
            avgTimeToComplete: 180,
            errorRate: 11.9
        },
        {
            date: "2023-03-10",
            tasksStarted: 1298,
            tasksCompleted: 770,
            completionRate: 59.3,
            avgTimeToComplete: 183,
            errorRate: 12.4
        },
        {
            date: "2023-03-11",
            tasksStarted: 1021,
            tasksCompleted: 612,
            completionRate: 59.9,
            avgTimeToComplete: 185,
            errorRate: 12.6
        },
        {
            date: "2023-03-12",
            tasksStarted: 914,
            tasksCompleted: 540,
            completionRate: 59.1,
            avgTimeToComplete: 187,
            errorRate: 12.8
        },
        {
            date: "2023-03-13",
            tasksStarted: 1476,
            tasksCompleted: 877,
            completionRate: 59.4,
            avgTimeToComplete: 184,
            errorRate: 12.3
        },
        {
            date: "2023-03-14",
            tasksStarted: 1562,
            tasksCompleted: 923,
            completionRate: 59.1,
            avgTimeToComplete: 186,
            errorRate: 12.5
        }
    ],
    // Анализ воронки создания задачи
    funnelSteps: [
        {
            step: "Открытие формы",
            users: 10000,
            dropoff: 0,
            dropoffRate: "0.0%"
        },
        {
            step: "Ввод названия задачи",
            users: 9750,
            dropoff: 250,
            dropoffRate: "2.5%"
        },
        {
            step: "Выбор приоритета",
            users: 8950,
            dropoff: 800,
            dropoffRate: "8.2%"
        },
        {
            step: "Добавление описания",
            users: 7800,
            dropoff: 1150,
            dropoffRate: "12.8%"
        },
        {
            step: "Установка сроков",
            users: 7100,
            dropoff: 700,
            dropoffRate: "9.0%"
        },
        {
            step: "Назначение исполнителей",
            users: 6550,
            dropoff: 550,
            dropoffRate: "7.7%"
        },
        {
            step: "Добавление тегов",
            users: 6100,
            dropoff: 450,
            dropoffRate: "6.9%"
        },
        {
            step: "Предпросмотр задачи",
            users: 5950,
            dropoff: 150,
            dropoffRate: "2.5%"
        },
        {
            step: "Подтверждение создания",
            users: 5900,
            dropoff: 50,
            dropoffRate: "0.8%"
        }
    ],
    // Сегменты пользователей
    userSegments: [
        {
            segment: "Новые пользователи (менее 30 дней)",
            completionRate: 42.3,
            avgTimeToComplete: 237,
            errorRate: 18.7,
            satisfactionScore: 3.2
        },
        {
            segment: "Регулярные пользователи",
            completionRate: 68.5,
            avgTimeToComplete: 162,
            errorRate: 9.2,
            satisfactionScore: 4.1
        },
        {
            segment: "Продвинутые пользователи",
            completionRate: 84.2,
            avgTimeToComplete: 126,
            errorRate: 5.1,
            satisfactionScore: 4.4
        },
        {
            segment: "Пользователи мобильной версии",
            completionRate: 51.8,
            avgTimeToComplete: 214,
            errorRate: 15.3,
            satisfactionScore: 3.5
        },
        {
            segment: "Корпоративные пользователи",
            completionRate: 76.3,
            avgTimeToComplete: 159,
            errorRate: 7.2,
            satisfactionScore: 4.3
        }
    ],
    // Результаты A/B тестирования
    abTests: [
        {
            variant: "Текущий вариант (A)",
            completionRate: 59.6,
            avgTimeToComplete: 183,
            errorRate: 12.4,
            satisfactionScore: 3.7
        },
        {
            variant: "Пошаговый процесс (B)",
            completionRate: 72.8,
            avgTimeToComplete: 152,
            errorRate: 8.6,
            satisfactionScore: 4.2
        },
        {
            variant: "Упрощенная форма (C)",
            completionRate: 68.3,
            avgTimeToComplete: 132,
            errorRate: 7.9,
            satisfactionScore: 4.0
        }
    ],
    // Сравнение с конкурентами
    competitorData: [
        {
            competitor: "TaskMaster (наш продукт)",
            completionRate: 59.6,
            avgTimeToComplete: 183,
            userSatisfaction: 3.7
        },
        {
            competitor: "Конкурент 1",
            completionRate: 72.1,
            avgTimeToComplete: 145,
            userSatisfaction: 4.2
        },
        {
            competitor: "Конкурент 2",
            completionRate: 68.4,
            avgTimeToComplete: 158,
            userSatisfaction: 4.0
        },
        {
            competitor: "Конкурент 3",
            completionRate: 64.2,
            avgTimeToComplete: 172,
            userSatisfaction: 3.9
        },
        {
            competitor: "Среднее по рынку",
            completionRate: 67.5,
            avgTimeToComplete: 162,
            userSatisfaction: 4.0
        }
    ],
    // Ключевые выводы, которые должен заметить учащийся
    keyInsights: [
        "Воронка создания задач имеет большой отток на этапах выбора приоритета и добавления описания",
        "Новые пользователи и пользователи мобильной версии имеют значительно более низкие показатели завершения",
        "Варианты B и C в A/B тестировании показывают значительное улучшение по сравнению с текущим вариантом",
        "Конкуренты имеют более высокие показатели завершения и удовлетворенности пользователей",
        "Среднее время создания задачи (183 секунды) значительно выше, чем у конкурентов",
        "Высокая частота ошибок указывает на проблемы с валидацией формы",
        "Корпоративные и продвинутые пользователи имеют наилучшие показатели завершения"
    ]
};
/* harmony default export */ const metrics_data = (metricsData);

;// CONCATENATED MODULE: ./src/components/levels/level1/stages/MetricsPractice.tsx




const MetricsPractice = ({ onComplete  })=>{
    const [selectedChart, setSelectedChart] = (0,external_react_.useState)("dailyMetrics");
    const [selectedInsights, setSelectedInsights] = (0,external_react_.useState)([]);
    const [userConclusion, setUserConclusion] = (0,external_react_.useState)("");
    const [feedback, setFeedback] = (0,external_react_.useState)(null);
    const [submitted, setSubmitted] = (0,external_react_.useState)(false);
    const [feedbackType, setFeedbackType] = (0,external_react_.useState)("warning");
    // Простой компонент для визуализации данных
    const Chart = ({ data , title , type , xKey , yKey , columns  })=>{
        if (type === "table" && columns) {
            return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: styles/* default.chartContainer */.Z.chartContainer,
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("h4", {
                        className: styles/* default.chartTitle */.Z.chartTitle,
                        children: title
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        className: styles/* default.tableWrapper */.Z.tableWrapper,
                        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("table", {
                            className: styles/* default.dataTable */.Z.dataTable,
                            children: [
                                /*#__PURE__*/ jsx_runtime_.jsx("thead", {
                                    children: /*#__PURE__*/ jsx_runtime_.jsx("tr", {
                                        children: columns.map((col, i)=>/*#__PURE__*/ jsx_runtime_.jsx("th", {
                                                children: col
                                            }, i))
                                    })
                                }),
                                /*#__PURE__*/ jsx_runtime_.jsx("tbody", {
                                    children: data.map((row, i)=>/*#__PURE__*/ jsx_runtime_.jsx("tr", {
                                            children: columns.map((col, j)=>{
                                                const key = col.toLowerCase().replace(/ /g, "");
                                                let value = row[key] || row[Object.keys(row).find((k)=>k.toLowerCase() === key) || ""];
                                                // Форматирование значений для читаемости
                                                if (typeof value === "number") {
                                                    if (value > 1 && key.includes("rate")) {
                                                        value = `${value.toFixed(1)}%`;
                                                    } else if (key.includes("time")) {
                                                        value = `${value.toFixed(0)} сек`;
                                                    } else if (value < 10) {
                                                        value = value.toFixed(1);
                                                    }
                                                }
                                                return /*#__PURE__*/ jsx_runtime_.jsx("td", {
                                                    children: value
                                                }, j);
                                            })
                                        }, i))
                                })
                            ]
                        })
                    })
                ]
            });
        }
        // Заглушка для графиков (в реальном приложении здесь был бы настоящий график)
        return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
            className: styles/* default.chartContainer */.Z.chartContainer,
            children: [
                /*#__PURE__*/ jsx_runtime_.jsx("h4", {
                    className: styles/* default.chartTitle */.Z.chartTitle,
                    children: title
                }),
                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                    className: styles/* default.chartPlaceholder */.Z.chartPlaceholder,
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("p", {
                            children: [
                                "Представьте, что здесь отображается график ",
                                type === "bar" ? "столбчатый" : "линейный"
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                            className: styles/* default.mockChart */.Z.mockChart,
                            children: [
                                type === "bar" && /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                    className: styles/* default.barChartMock */.Z.barChartMock,
                                    children: data.slice(0, 7).map((item, i)=>{
                                        const value = yKey ? item[yKey] : 50;
                                        const heightPercentage = yKey ? value / Math.max(...data.map((d)=>d[yKey])) * 100 : 40 + Math.random() * 50;
                                        return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                            className: styles/* default.barContainer */.Z.barContainer,
                                            children: [
                                                /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                                    className: styles/* default.bar */.Z.bar,
                                                    style: {
                                                        height: `${heightPercentage}%`
                                                    }
                                                }),
                                                /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                                    className: styles/* default.barLabel */.Z.barLabel,
                                                    children: xKey ? item[xKey].toString().slice(5) : `Элем. ${i + 1}`
                                                })
                                            ]
                                        }, i);
                                    })
                                }),
                                type === "line" && /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                    className: styles/* default.lineChartMock */.Z.lineChartMock,
                                    children: [
                                        /*#__PURE__*/ jsx_runtime_.jsx("svg", {
                                            viewBox: "0 0 100 50",
                                            className: styles/* default.lineChart */.Z.lineChart,
                                            children: /*#__PURE__*/ jsx_runtime_.jsx("polyline", {
                                                fill: "none",
                                                stroke: "#0070f3",
                                                strokeWidth: "2",
                                                points: data.slice(0, 7).map((item, i)=>{
                                                    const value = yKey ? item[yKey] : 50;
                                                    const x = i * (100 / 6);
                                                    const maxValue = Math.max(...data.map((d)=>yKey ? d[yKey] : 50));
                                                    const y = 50 - value / maxValue * 40;
                                                    return `${x},${y}`;
                                                }).join(" ")
                                            })
                                        }),
                                        /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                            className: styles/* default.lineChartLabels */.Z.lineChartLabels,
                                            children: data.slice(0, 7).map((item, i)=>/*#__PURE__*/ jsx_runtime_.jsx("div", {
                                                    className: styles/* default.lineChartLabel */.Z.lineChartLabel,
                                                    children: xKey ? item[xKey].toString().slice(5) : `Элем. ${i + 1}`
                                                }, i))
                                        })
                                    ]
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                            className: styles/* default.dataPreview */.Z.dataPreview,
                            children: [
                                /*#__PURE__*/ jsx_runtime_.jsx("strong", {
                                    children: "Данные для анализа:"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("pre", {
                                    className: styles/* default.codeBlock */.Z.codeBlock,
                                    children: [
                                        JSON.stringify(data.slice(0, 3), null, 2),
                                        data.length > 3 ? "..." : ""
                                    ]
                                })
                            ]
                        })
                    ]
                })
            ]
        });
    };
    const renderSelectedChart = ()=>{
        switch(selectedChart){
            case "dailyMetrics":
                return /*#__PURE__*/ jsx_runtime_.jsx(Chart, {
                    data: metrics_data.dailyMetrics,
                    title: "Ежедневные метрики создания задач (последние 14 дней)",
                    type: "line",
                    xKey: "date",
                    yKey: "completionRate"
                });
            case "funnelSteps":
                return /*#__PURE__*/ jsx_runtime_.jsx(Chart, {
                    data: metrics_data.funnelSteps,
                    title: "Воронка создания задачи",
                    type: "bar",
                    xKey: "step",
                    yKey: "users"
                });
            case "userSegments":
                return /*#__PURE__*/ jsx_runtime_.jsx(Chart, {
                    data: metrics_data.userSegments,
                    title: "Показатели по сегментам пользователей",
                    type: "table",
                    columns: [
                        "Сегмент",
                        "Процент завершения",
                        "Среднее время",
                        "Частота ошибок",
                        "Удовлетворенность"
                    ]
                });
            case "abTests":
                return /*#__PURE__*/ jsx_runtime_.jsx(Chart, {
                    data: metrics_data.abTests,
                    title: "Результаты A/B тестирования",
                    type: "table",
                    columns: [
                        "Вариант",
                        "Процент завершения",
                        "Среднее время",
                        "Частота ошибок",
                        "Удовлетворенность"
                    ]
                });
            case "competitorData":
                return /*#__PURE__*/ jsx_runtime_.jsx(Chart, {
                    data: metrics_data.competitorData,
                    title: "Сравнение с конкурентами",
                    type: "table",
                    columns: [
                        "Продукт",
                        "Процент завершения",
                        "Среднее время",
                        "Удовлетворенность"
                    ]
                });
            default:
                return null;
        }
    };
    const handleInsightToggle = (insight)=>{
        if (selectedInsights.includes(insight)) {
            setSelectedInsights(selectedInsights.filter((i)=>i !== insight));
        } else {
            setSelectedInsights([
                ...selectedInsights,
                insight
            ]);
        }
    };
    const handleSubmitAnalysis = ()=>{
        const requiredInsightsCount = 4;
        // Проверяем, выбрано ли достаточное количество правильных выводов
        const correctInsightsSelected = metrics_data.keyInsights.filter((insight)=>selectedInsights.includes(insight)).length;
        if (correctInsightsSelected >= requiredInsightsCount && userConclusion.length >= 100) {
            setFeedback("Отлично! Вы правильно проанализировали метрики и сделали обоснованные выводы. Вы можете перейти к следующему этапу.");
            setFeedbackType("success");
            setSubmitted(true);
        } else if (correctInsightsSelected < requiredInsightsCount) {
            setFeedback(`Пожалуйста, выберите больше ключевых выводов из анализа метрик (минимум ${requiredInsightsCount}).`);
            setFeedbackType("warning");
        } else {
            setFeedback("Пожалуйста, напишите более подробное заключение (минимум 100 символов).");
            setFeedbackType("warning");
        }
    };
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: styles/* default.container */.Z.container,
        children: [
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: styles/* default.sectionHeader */.Z.sectionHeader,
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("h2", {
                        className: styles/* default.sectionTitle */.Z.sectionTitle,
                        children: "Анализ метрик процесса создания задач"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("p", {
                        className: styles/* default.sectionDescription */.Z.sectionDescription,
                        children: "Изучите представленные метрики, выберите ключевые выводы и составьте заключение о проблемах в текущем процессе создания задач."
                    })
                ]
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: styles/* default.metricsNav */.Z.metricsNav,
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("button", {
                        className: `${styles/* default.metricsNavButton */.Z.metricsNavButton} ${selectedChart === "dailyMetrics" ? styles/* default.active */.Z.active : ""}`,
                        onClick: ()=>setSelectedChart("dailyMetrics"),
                        children: "Ежедневные метрики"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("button", {
                        className: `${styles/* default.metricsNavButton */.Z.metricsNavButton} ${selectedChart === "funnelSteps" ? styles/* default.active */.Z.active : ""}`,
                        onClick: ()=>setSelectedChart("funnelSteps"),
                        children: "Воронка создания"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("button", {
                        className: `${styles/* default.metricsNavButton */.Z.metricsNavButton} ${selectedChart === "userSegments" ? styles/* default.active */.Z.active : ""}`,
                        onClick: ()=>setSelectedChart("userSegments"),
                        children: "Сегменты пользователей"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("button", {
                        className: `${styles/* default.metricsNavButton */.Z.metricsNavButton} ${selectedChart === "abTests" ? styles/* default.active */.Z.active : ""}`,
                        onClick: ()=>setSelectedChart("abTests"),
                        children: "A/B тесты"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("button", {
                        className: `${styles/* default.metricsNavButton */.Z.metricsNavButton} ${selectedChart === "competitorData" ? styles/* default.active */.Z.active : ""}`,
                        onClick: ()=>setSelectedChart("competitorData"),
                        children: "Конкуренты"
                    })
                ]
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: styles/* default.chartSection */.Z.chartSection,
                children: renderSelectedChart()
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: styles/* default.analysisSection */.Z.analysisSection,
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("h3", {
                        className: styles/* default.analysisTitle */.Z.analysisTitle,
                        children: "Ваш анализ метрик"
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: styles/* default.insightsSelection */.Z.insightsSelection,
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("h4", {
                                children: "Выберите ключевые выводы из анализа метрик:"
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                className: styles/* default.insightsList */.Z.insightsList,
                                children: metrics_data.keyInsights.map((insight, index)=>/*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                        className: styles/* default.insightItem */.Z.insightItem,
                                        children: [
                                            /*#__PURE__*/ jsx_runtime_.jsx("input", {
                                                type: "checkbox",
                                                id: `insight-${index}`,
                                                checked: selectedInsights.includes(insight),
                                                onChange: ()=>handleInsightToggle(insight)
                                            }),
                                            /*#__PURE__*/ jsx_runtime_.jsx("label", {
                                                htmlFor: `insight-${index}`,
                                                children: insight
                                            })
                                        ]
                                    }, index))
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: styles/* default.conclusionSection */.Z.conclusionSection,
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("h4", {
                                children: "Ваше заключение и рекомендации:"
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("textarea", {
                                className: styles/* default.conclusionTextarea */.Z.conclusionTextarea,
                                value: userConclusion,
                                onChange: (e)=>setUserConclusion(e.target.value),
                                placeholder: "На основе изученных метрик опишите основные проблемы процесса создания задач и предложите свои рекомендации по его улучшению...",
                                rows: 6
                            }),
                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                className: styles/* default.wordCount */.Z.wordCount,
                                children: [
                                    userConclusion.length,
                                    " / 100 символов (минимум)"
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("button", {
                        className: styles/* default.submitButton */.Z.submitButton,
                        onClick: handleSubmitAnalysis,
                        children: "Отправить анализ"
                    }),
                    feedback && /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: `mt-8 p-4 rounded-lg ${feedbackType === "success" ? "bg-green-800/30 border border-green-700" : "bg-yellow-800/30 border border-yellow-700"}`,
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("h3", {
                                className: "text-lg font-semibold text-slate-300 mb-2",
                                children: feedbackType === "success" ? "Отличная работа!" : "Есть над чем поработать"
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("p", {
                                className: "text-slate-300",
                                children: feedback
                            })
                        ]
                    })
                ]
            }),
            submitted && feedbackType === "success" && /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: "flex justify-end mt-6",
                children: /*#__PURE__*/ jsx_runtime_.jsx("button", {
                    className: styles/* default.btnPrimary */.Z.btnPrimary,
                    onClick: onComplete,
                    children: "Завершить упражнение"
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: styles/* default.mentorTip */.Z.mentorTip,
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("h4", {
                        className: styles/* default.mentorTipTitle */.Z.mentorTipTitle,
                        children: "Совет ментора:"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("p", {
                        className: styles/* default.mentorTipText */.Z.mentorTipText,
                        children: "При анализе метрик ищите аномалии и тренды. Обратите внимание на этапы с наибольшим оттоком пользователей, разницу в показателях между сегментами и сравнение с конкурентами. Успешный продакт-менеджер должен уметь выделять наиболее значимые метрики и делать на их основе правильные выводы."
                    })
                ]
            })
        ]
    });
};
/* harmony default export */ const stages_MetricsPractice = (MetricsPractice);


/***/ })

};
;