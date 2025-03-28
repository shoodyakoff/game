import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './[...nextauth]';
import connectDB from '../../../server/config/db';
import User from '../../../server/models/User';

// Кэш для хранения времени последнего обновления для каждого пользователя
const sessionUpdateCache: Record<string, number> = {};
// Увеличиваем время кэширования до 5 минут (300 000 миллисекунд)
const CACHE_TTL = 300000;

/**
 * API эндпоинт для обновления данных сессии
 * Возвращает актуальные данные пользователя из базы данных
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Устанавливаем заголовки для предотвращения кэширования
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  // Поддерживаем только GET запросы
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false, 
      message: `Метод ${req.method} не разрешен` 
    });
  }

  try {
    // Получаем текущую сессию
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !session.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Не авторизован' 
      });
    }
    
    const userId = session.user.id;
    
    // Проверяем, не запрашивали ли мы обновление недавно для этого пользователя
    const lastUpdate = sessionUpdateCache[userId] || 0;
    const now = Date.now();
    
    if (now - lastUpdate < CACHE_TTL) {
      // Логируем, что используются кэшированные данные
      console.log(`[API] Используем кэшированные данные для пользователя ${userId}, истекает через ${Math.floor((CACHE_TTL - (now - lastUpdate)) / 1000)} сек.`);
      
      return res.status(200).json({
        success: true,
        message: 'Кэшированные данные сессии',
        needsUpdate: false,
        fromCache: true,
        cacheExpiresIn: Math.floor((CACHE_TTL - (now - lastUpdate)) / 1000) // сколько секунд осталось до истечения кэша
      });
    }
    
    // Подключаемся к базе данных
    await connectDB();
    
    // Получаем актуальные данные пользователя
    const user = await (User as any).findById(userId);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'Пользователь не найден' 
      });
    }
    
    // Обновляем время последнего обращения в кэше
    sessionUpdateCache[userId] = now;
    console.log(`[API] Обновлен кэш данных сессии для пользователя ${userId}`);
    
    // Проверяем, нужно ли обновлять сессию
    const needsUpdate = 
      session.user.hasCharacter !== user.hasCharacter || 
      session.user.characterType !== user.characterType || 
      session.user.role !== user.role;
    
    // Возвращаем актуальные данные
    return res.status(200).json({
      success: true,
      message: 'Данные сессии получены',
      needsUpdate,
      fromCache: false,
      cacheExpiresIn: CACHE_TTL / 1000, // сколько секунд кэш будет валиден
      currentSession: {
        hasCharacter: session.user.hasCharacter,
        characterType: session.user.characterType,
        role: session.user.role
      },
      dbUser: {
        id: user._id,
        name: user.username,
        email: user.email,
        image: user.avatar,
        role: user.role,
        hasCharacter: user.hasCharacter || false,
        characterType: user.characterType || '',
      }
    });
  } catch (error: any) {
    console.error('Ошибка при получении данных сессии:', error);
    
    return res.status(500).json({ 
      success: false, 
      message: 'Ошибка сервера: ' + error.message 
    });
  }
} 