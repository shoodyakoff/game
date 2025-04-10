import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import mongoose from 'mongoose';

// Определение схемы для UserCharacter, если она еще не определена
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
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
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
  createdAt: Date;
  updatedAt: Date;
}

// Используем существующую модель или создаем новую
const UserCharacter = mongoose.models.UserCharacter as mongoose.Model<IUserCharacter> || 
  mongoose.model<IUserCharacter>('UserCharacter', UserCharacterSchema);

// Обработчик запроса на создание персонажа
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Устанавливаем CORS заголовки
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Разрешаем только POST-запросы
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: `Метод ${req.method} не разрешен` });
  }

  try {
    // Получаем идентификатор пользователя из Clerk
    const { userId } = getAuth(req);
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Не авторизован. Пожалуйста, войдите в систему.'
      });
    }
    
    const { characterType } = req.body;
    
    if (!characterType) {
      return res.status(400).json({
        success: false,
        message: 'Тип персонажа обязателен'
      });
    }
    
    try {
      // Создаем или обновляем персонажа
      const character = await UserCharacter.findOneAndUpdate(
        { userId, characterType },
        {
          userId,
          characterType,
          isActive: true,
          updatedAt: new Date()
        },
        { upsert: true, new: true }
      );
      
      // Возвращаем успешный ответ
      return res.status(200).json({
        success: true,
        message: 'Персонаж успешно создан',
        character: {
          id: character._id,
          type: characterType,
          isActive: true
        }
      });
    } catch (dbError: any) {
      console.error('Ошибка базы данных при создании персонажа:', dbError);
      
      // Возвращаем успешный ответ с локальными данными
      return res.status(200).json({
        success: true,
        message: 'Персонаж создан локально из-за ошибки базы данных',
        dbError: true,
        dbErrorMessage: dbError.message,
        character: {
          type: characterType,
          isActive: true
        }
      });
    }
  } catch (error: any) {
    console.error('Ошибка создания персонажа:', error);
    return res.status(500).json({
      success: false,
      message: 'Внутренняя ошибка сервера при создании персонажа'
    });
  }
} 