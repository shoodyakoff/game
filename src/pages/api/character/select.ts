import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '../auth/[...nextauth]';
import connectDB from '../../../server/config/db';
import User from '../../../server/models/User';
import jwt from 'jsonwebtoken';
import { getToken } from 'next-auth/jwt';
import { getServerSession } from 'next-auth/next';

// Маппинг типов персонажей к ролям пользователя
const characterTypeToRole: Record<string, string> = {
  'product-lead': 'user',
  'agile-coach': 'user',
  'growth-hacker': 'user',
  'ux-visionary': 'user',
  'tech-pm': 'user'
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Устанавливаем CORS заголовки для разрешения запросов
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Автоматически определяем origin в зависимости от окружения
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  // Для OPTIONS запросов возвращаем 200
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Проверяем метод запроса
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: `Метод ${req.method} не разрешен` });
  }

  console.log('[API] Character select запрос получен:', req.body);
  console.log('[API] Cookies:', req.cookies);
  console.log('[API] Headers:', req.headers);

  try {
    // Получаем токен из куки NextAuth
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log('[API] JWT токен:', token);
    
    if (!token || !token.sub) {
      console.log('[API] Ошибка: пользователь не авторизован (токен не найден)');
      return res.status(401).json({ success: false, message: 'Не авторизован' });
    }

    // Получаем данные из тела запроса
    const { characterId, characterType } = req.body;
    console.log('[API] Данные персонажа:', { characterId, characterType });

    // Проверяем наличие необходимых данных
    if (!characterId || !characterType) {
      console.log('[API] Ошибка: отсутствуют необходимые данные');
      return res.status(400).json({ success: false, message: 'ID персонажа и тип обязательны' });
    }

    // Подключаемся к базе данных
    console.log('[API] Подключаемся к БД...');
    await connectDB();
    console.log('[API] Подключение к БД успешно');

    // Находим пользователя по ID из токена
    const userId = token.sub;
    console.log('[API] Ищем пользователя с ID:', userId);
    const user = await (User as any).findById(userId);

    if (!user) {
      console.log('[API] Ошибка: пользователь не найден в БД');
      return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }

    console.log('[API] Пользователь найден:', { id: user._id, username: user.username });

    // Маппим тип персонажа к роли пользователя и сохраняем в метаданных
    const role = characterTypeToRole[characterType] || 'user';
    console.log('[API] Маппинг типа персонажа к роли:', { characterType, role });

    // Обновляем данные пользователя
    user.hasCharacter = true;
    
    // Проверяем, есть ли поле characterType в схеме User
    const hasCharacterTypeField = Object.keys(user.schema?.paths || {}).includes('characterType');
    console.log('[API] Поле characterType в схеме User:', hasCharacterTypeField);
    
    try {
      // Если поле есть, устанавливаем его значение
      if (hasCharacterTypeField) {
        user.characterType = characterType;
      } else {
        console.log('[API] Поле characterType отсутствует в схеме User, добавляем метаданные');
        // Если поля нет, добавляем информацию в метаданные или другое поле
        if (!user.metadata) user.metadata = {};
        user.metadata.characterType = characterType;
      }
    } catch (err) {
      console.log('[API] Предупреждение при установке characterType:', err);
    }
    
    user.updated_at = new Date();

    // Сохраняем обновленные данные
    console.log('[API] Сохраняем обновленные данные пользователя...');
    
    try {
      await user.save();
      console.log('[API] Данные пользователя обновлены успешно');
    } catch (saveError) {
      console.error('[API] Ошибка при сохранении пользователя:', saveError);
      // Пробуем сохранить только критические поля
      user.hasCharacter = true;
      await user.save();
      console.log('[API] Сохранены только базовые данные пользователя');
    }

    // Обновляем токен сессии с новым значением hasCharacter
    try {
      // Этот метод напрямую не может обновить токен NextAuth
      // Вместо этого мы сообщаем клиенту, что ему нужно получить новую сессию
    } catch (sessionError) {
      console.error('[API] Ошибка при обновлении сессии:', sessionError);
    }

    // Возвращаем успешный ответ с обновленными данными
    console.log('[API] Возвращаем успешный ответ');
    
    // Устанавливаем заголовки для предотвращения кэширования ответа
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    return res.status(200).json({
      success: true,
      message: 'Персонаж успешно выбран',
      redirect: '/dashboard',
      refreshSession: true, // Сигнал клиенту обновить сессию
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        image: user.avatar,
        role: user.role,
        hasCharacter: user.hasCharacter,
        characterType
      }
    });
  } catch (error: any) {
    console.error('[API] Критическая ошибка при выборе персонажа:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Внутренняя ошибка сервера: ' + error.message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
} 