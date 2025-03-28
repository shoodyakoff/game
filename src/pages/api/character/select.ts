import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '../auth/[...nextauth]';
import connectDB from '../../../server/config/db';
import User from '../../../server/models/User';
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
  // Устанавливаем CORS заголовки
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: `Метод ${req.method} не разрешен` });
  }

  try {
    // Получаем сессию
    const session = await getServerSession(req, res, authOptions);
    
    if (!session || !session.user) {
      return res.status(401).json({ success: false, message: 'Не авторизован' });
    }

    const { characterId, characterType } = req.body;

    if (!characterId || !characterType) {
      return res.status(400).json({ success: false, message: 'ID персонажа и тип обязательны' });
    }

    await connectDB();

    const user = await (User as any).findById(session.user.id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Пользователь не найден' });
    }

    // Обновляем данные пользователя
    user.hasCharacter = true;
    user.characterType = characterType;
    user.role = characterTypeToRole[characterType] || 'user';
    user.updated_at = new Date();

    await user.save();
    
    console.log('Пользователь обновлен с персонажем:', {
      id: user._id,
      hasCharacter: user.hasCharacter,
      characterType: user.characterType
    });

    // Отправляем специальный флаг, чтобы клиент знал, что нужно выполнить hard reload
    // для обновления сессии NextAuth
    return res.status(200).json({
      success: true,
      message: 'Персонаж успешно выбран',
      redirectUrl: '/dashboard',
      requiresReload: true,  // Флаг для принудительной перезагрузки страницы
      user: {
        id: user._id,
        name: user.username,
        email: user.email,
        image: user.avatar,
        role: user.role,
        hasCharacter: true,
        characterType: characterType
      }
    });
  } catch (error: any) {
    console.error('Ошибка при выборе персонажа:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Внутренняя ошибка сервера: ' + error.message
    });
  }
} 