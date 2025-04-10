import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import connectDB from '../../../server/config/db';
import mongoose from 'mongoose';

// Определение схемы для UserCharacter
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
    // Получаем идентификатор пользователя из Clerk
    const { userId } = getAuth(req);
    
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Не авторизован' });
    }

    const { characterType } = req.body;

    if (!characterType) {
      return res.status(400).json({ success: false, message: 'Тип персонажа обязателен' });
    }

    // Флаг для ошибок базы данных
    let dbError = false;
    let dbErrorMessage = "";

    try {
      await connectDB();
    } catch (dbConnError: any) {
      console.error('Ошибка подключения к MongoDB:', dbConnError);
      dbError = true;
      dbErrorMessage = dbConnError.message;
      
      // Возвращаем успешный ответ, чтобы клиент продолжил работу с локальными данными
      return res.status(200).json({
        success: true,
        message: 'Персонаж выбран локально из-за ошибки базы данных',
        dbError: true,
        dbErrorMessage,
        redirectUrl: '/dashboard',
        character: {
          type: characterType,
          isActive: true
        }
      });
    }

    try {
      // Деактивируем все текущие активные персонажи пользователя
      await UserCharacter.updateMany(
        { userId: userId, isActive: true },
        { $set: { isActive: false } }
      );
      
      // Проверяем, существует ли уже персонаж этого типа
      let character = await UserCharacter.findOne({ 
        userId: userId, 
        characterType: characterType 
      });
      
      if (character) {
        // Если персонаж существует, активируем его
        character.isActive = true;
        character.updatedAt = new Date();
        await character.save();
      } else {
        // Если нет, создаем нового
        character = await UserCharacter.create({
          userId: userId,
          characterType: characterType,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
          levelProgress: {},
          achievements: []
        });
      }
      
      console.log('Персонаж обновлен:', {
        id: character._id,
        userId: userId,
        characterType: characterType,
        isActive: true
      });

      return res.status(200).json({
        success: true,
        message: 'Персонаж успешно выбран и сохранен в базе данных',
        redirectUrl: '/dashboard',
        character: {
          id: character._id,
          type: characterType,
          isActive: true
        }
      });
    } catch (userError: any) {
      console.error('Ошибка при выборе персонажа:', userError);
      
      // Возвращаем успешный ответ, чтобы клиент продолжил работу с локальными данными
      return res.status(200).json({
        success: true,
        message: 'Персонаж выбран локально из-за ошибки базы данных',
        dbError: true,
        dbErrorMessage: userError.message,
        redirectUrl: '/dashboard',
        character: {
          type: characterType,
          isActive: true
        }
      });
    }
  } catch (error: any) {
    console.error('Ошибка при выборе персонажа:', error);
    
    // Возвращаем успешный ответ, чтобы клиент продолжил работу с локальными данными
    return res.status(200).json({ 
      success: true, 
      message: 'Персонаж выбран локально из-за внутренней ошибки сервера',
      dbError: true,
      dbErrorMessage: error.message,
      redirectUrl: '/dashboard',
      character: {
        type: req.body.characterType,
        isActive: true
      }
    });
  }
} 