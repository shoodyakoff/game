/**
 * Стили для компонентов уровня 1
 */
export const styles = {
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
  btnOutline: "bg-transparent hover:bg-slate-700 text-slate-300 font-medium py-2 px-4 rounded-md flex items-center justify-center transition-colors shadow border border-slate-500",
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
  paragraph: "text-slate-300 mb-4 leading-relaxed",
};

export default styles; 