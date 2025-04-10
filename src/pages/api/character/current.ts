import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import connectDB from '../../../server/config/db';
import mongoose from 'mongoose';

// Определение схемы для UserCharacter, если она еще не существует
const UserCharacterSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  characterType: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  levelProgress: { type: Map, of: Object, default: {} },
  achievements: [{ 
    id: String, 
    type: String, 
    title: String, 
    unlockedAt: Date 
  }]
});

// Определяем интерфейс для модели UserCharacter
interface IUserCharacter extends mongoose.Document {
  userId: string;
  characterType: string;
  isActive: boolean;
  levelProgress: Map<string, any>;
  achievements: Array<{
    id: string;
    type: string;
    title: string;
    unlockedAt: Date;
  }>;
}

// Используем существующую модель или создаем новую
const UserCharacter = mongoose.models.UserCharacter as mongoose.Model<IUserCharacter> || 
  mongoose.model<IUserCharacter>('UserCharacter', UserCharacterSchema);

// Типы персонажей и их детальная информация
const characterDetails: Record<string, any> = {
  'product-lead': {
    id: 'product-lead',
    name: 'Product Lead',
    image: '/characters/product-lead-full.png',
    icon: '/images/characters/icons/product-lead.png',
    description: 'Фокусируется на стратегическом планировании и балансировании потребностей.',
    type: 'product-lead',
    role: 'Стратег',
    difficulty: 'Нормальная',
    stats: {
      analytics: 7,
      communication: 7,
      strategy: 8,
      technical: 5,
      creativity: 5
    }
  },
  'agile-coach': {
    id: 'agile-coach',
    name: 'Agile Coach',
    image: '/characters/agile-coach-full.png',
    icon: '/images/characters/icons/agile-coach.png',
    description: 'Фокусируется на процессах и командной работе.',
    type: 'agile-coach',
    role: 'Поддержка',
    difficulty: 'Сложная',
    stats: {
      analytics: 5,
      communication: 9,
      strategy: 6,
      technical: 4,
      creativity: 4,
      leadership: 8
    }
  },
  'growth-hacker': {
    id: 'growth-hacker',
    name: 'Growth Hacker',
    image: '/characters/growth-hacker-full.png',
    icon: '/images/characters/icons/growth-hacker.png',
    description: 'Фокусируется на метриках и максимизации пользовательской базы.',
    type: 'growth-hacker',
    role: 'DPS',
    difficulty: 'Экстрим',
    stats: {
      analytics: 9,
      communication: 4,
      strategy: 6,
      technical: 7,
      creativity: 7
    }
  },
  'ux-visionary': {
    id: 'ux-visionary',
    name: 'UX Visionary',
    image: '/characters/ux-visionary-full.png',
    icon: '/images/characters/icons/ux-visionary.png',
    description: 'Фокусируется на пользовательском опыте и креативных решениях.',
    type: 'ux-visionary',
    role: 'Дизайнер',
    difficulty: 'Легкая',
    stats: {
      analytics: 6,
      communication: 7,
      strategy: 5,
      technical: 4,
      creativity: 9
    }
  },
  'tech-pm': {
    id: 'tech-pm',
    name: 'Tech PM',
    image: '/characters/tech-pm-full.png',
    icon: '/images/characters/icons/tech-pm.png',
    description: 'Технически ориентированный PM с глубоким пониманием разработки.',
    type: 'tech-pm',
    role: 'Гибрид',
    difficulty: 'Сложная',
    stats: {
      analytics: 6,
      communication: 5,
      strategy: 5,
      technical: 9,
      creativity: 5
    }
  }
};

/**
 * API-маршрут для получения информации о текущем персонаже пользователя
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Устанавливаем CORS заголовки
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: `Метод ${req.method} не разрешен` });
  }

  try {
    // Получаем данные пользователя из Clerk
    const { userId } = getAuth(req);
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Не авторизован' });
    }

    // Флаг для отслеживания проблем с БД
    let dbConnectionIssue = false;
    
    try {
      await connectDB();
      
      // Получаем персонажа из БД
      const character = await UserCharacter.findOne({ 
        userId: userId,
        isActive: true
      });
      
      if (!character) {
        return res.status(200).json({ 
          success: true, 
          character: null,
          hasCharacter: false,
          source: 'database'
        });
      }
      
      // Получаем детальную информацию о персонаже
      const characterType = character.characterType;
      const characterInfo = characterDetails[characterType] || null;
      
      if (!characterInfo) {
        return res.status(200).json({
          success: true,
          message: 'Информация о персонаже не найдена',
          character: {
            id: characterType,
            name: characterType,
            type: characterType,
            image: '/images/characters/icons/default.png'
          },
          hasCharacter: true,
          source: 'database'
        });
      }
      
      return res.status(200).json({
        success: true,
        character: {
          ...characterInfo,
          progress: character.levelProgress || {},
          achievements: character.achievements || []
        },
        hasCharacter: true,
        source: 'database'
      });
      
    } catch (dbError) {
      console.error('Ошибка при работе с БД:', dbError);
      dbConnectionIssue = true;
      
      // Продолжаем выполнение и используем localStorage данные с клиента
      // Клиент должен сам решить, как обработать этот случай
      
      return res.status(200).json({
        success: true,
        character: null,
        hasCharacter: false,
        dbError: true,
        message: 'Проблема подключения к базе данных. Используйте локальные данные.',
        source: 'error'
      });
    }
  } catch (error: any) {
    console.error('Ошибка при обработке запроса:', error);
    return res.status(200).json({ 
      success: false, 
      message: 'Ошибка при получении данных персонажа. Используйте локальные данные.',
      dbError: true,
      source: 'error'
    });
  }
} 