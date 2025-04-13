/**
 * Утилиты для управления сбросом прогресса уровней
 */

/**
 * Сбрасывает прогресс первого уровня, устанавливая флаг сброса и очищая все соответствующие ключи localStorage
 */
export const resetLevel1 = () => {
  // Устанавливаем флаг сброса для первого уровня
  localStorage.setItem('level1_reset', 'true');
  
  // Очищаем все ключи, связанные с прогрессом первого уровня
  localStorage.removeItem('product_thinking_theory_step');
  localStorage.removeItem('product_thinking_practice_step');
  localStorage.removeItem('product_thinking_practice_answers');
  localStorage.removeItem('product_thinking_practice_visited');
  localStorage.removeItem('ux_analysis_theory_step');
  localStorage.removeItem('decision_making_theory_step');
  localStorage.removeItem('decision_making_practice_step');
  localStorage.removeItem('metrics_theory_step');
  localStorage.removeItem('metrics_practice_step');
  
  // Через некоторое время убираем флаг сброса, чтобы не затрагивать будущие загрузки
  setTimeout(() => {
    localStorage.removeItem('level1_reset');
  }, 3000);
  
  console.log('Уровень 1 был сброшен');
};

/**
 * Проверяет, был ли сброшен указанный уровень
 * @param levelNumber Номер уровня
 * @returns true, если уровень был сброшен
 */
export const isLevelReset = (levelNumber: number): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(`level${levelNumber}_reset`) === 'true';
}; 