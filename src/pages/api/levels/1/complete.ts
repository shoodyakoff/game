import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Проверка авторизации через Clerk
  const { userId, sessionId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: 'Необходима авторизация' });
  }

  // Только метод POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешен' });
  }

  try {
    const { finalDecision, timeSpent, characterType } = req.body;

    // Проверяем обязательные поля
    if (!finalDecision) {
      return res.status(400).json({ error: 'Не указаны обязательные поля: finalDecision' });
    }

    // В реальной реализации здесь мы бы обновляли статус уровня и выдавали награды в базе данных
    // Сейчас просто имитируем успешное завершение
    console.log(`Завершение уровня 1 для пользователя ${userId}. Решение: ${finalDecision}, время: ${timeSpent || 'не указано'}`);
    
    // Определяем награды на основе принятого решения и типа персонажа
    // В реальной реализации это была бы более сложная логика
    let experience = 100; // базовый опыт
    const achievement = "Первый рабочий день";
    let itemReward = "Базовая заметка";
    let nextLevelUnlocked = true;
    
    // В реальной реализации здесь мы бы проверяли соответствие выбранного решения типу персонажа
    if ((characterType === 'ux-visionary' && finalDecision === 'ux_focused') ||
        (characterType === 'growth-hacker' && finalDecision === 'data_driven') ||
        (characterType === 'product-lead' && finalDecision === 'balanced')) {
      // Бонус за выбор подходящего для персонажа решения
      experience += 50;
      itemReward = "Улучшенная заметка";
    }

    // Возвращаем результаты и награды
    return res.status(200).json({
      success: true,
      levelCompleted: true,
      rewards: {
        experience,
        achievement,
        item: itemReward
      },
      nextLevelUnlocked,
      summary: {
        decision: finalDecision,
        timeSpent: timeSpent || 'не указано',
        outcome: getOutcomeForDecision(finalDecision)
      }
    });
  } catch (error) {
    console.error('Ошибка при завершении уровня:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' });
  }
}

// Вспомогательная функция для получения описания результатов решения
function getOutcomeForDecision(decision: string): string {
  switch (decision) {
    case 'ux_focused':
      return 'Вы выбрали полную переработку интерфейса. Пользователи очень довольны новым интерфейсом, но реализация заняла больше времени и ресурсов.';
    case 'data_driven':
      return 'Вы выбрали оптимизацию на основе данных. Удалось быстро улучшить ключевые метрики конверсии, но некоторые пользователи все еще недовольны сложностью интерфейса.';
    case 'balanced':
      return 'Вы выбрали сбалансированный подход. Получилось хорошее соотношение между улучшением пользовательского опыта и эффективным использованием ресурсов компании.';
    default:
      return 'Результаты вашего решения неоднозначны. Команда продолжает работу над улучшением продукта.';
  }
} 