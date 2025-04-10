import { NextApiRequest, NextApiResponse } from 'next';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';
import connectDB from '../../../server/config/db';
import mongoose from 'mongoose';

// Определяем интерфейс для User
interface IUser extends mongoose.Document {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Определим простую схему для пользователя, если она еще не существует
const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Используем существующую модель или создаем новую
const User = mongoose.models.User as mongoose.Model<IUser> || 
  mongoose.model<IUser>('User', UserSchema);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Принимаем только POST запросы
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Проверка секрета вебхука
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  
  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET не найден в переменных окружения');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // Получаем заголовки Svix
  const svix_id = req.headers['svix-id'] as string;
  const svix_timestamp = req.headers['svix-timestamp'] as string;
  const svix_signature = req.headers['svix-signature'] as string;

  // Проверяем, что все заголовки присутствуют
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return res.status(400).json({ error: 'Missing Svix headers' });
  }

  // Получаем тело запроса в виде строки
  const payload = JSON.stringify(req.body);
  const headers = {
    'svix-id': svix_id,
    'svix-timestamp': svix_timestamp,
    'svix-signature': svix_signature,
  };

  try {
    // Проверяем подпись вебхука
    const webhook = new Webhook(WEBHOOK_SECRET);
    const event = webhook.verify(payload, headers) as WebhookEvent;

    await connectDB();

    // Обрабатываем разные типы событий
    switch (event.type) {
      case 'user.created':
        await handleUserCreated(event.data);
        break;
      case 'user.updated':
        await handleUserUpdated(event.data);
        break;
      case 'user.deleted':
        await handleUserDeleted(event.data);
        break;
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Ошибка обработки вебхука:', error);
    return res.status(400).json({ 
      success: false, 
      error: 'Invalid webhook payload' 
    });
  }
}

// Обработчики событий
async function handleUserCreated(data: any) {
  try {
    const { id, email_addresses, first_name, last_name } = data;
    
    // Создаем новый документ
    const newUser = new User({
      clerkId: id,
      email: email_addresses[0]?.email_address,
      firstName: first_name,
      lastName: last_name,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Сохраняем документ
    await newUser.save();
    
    console.log(`Пользователь создан: ${id}`);
  } catch (error) {
    console.error('Ошибка при создании пользователя:', error);
  }
}

async function handleUserUpdated(data: any) {
  try {
    const { id, email_addresses, first_name, last_name } = data;

    // Обновляем данные пользователя
    await User.findOneAndUpdate(
      { clerkId: id },
      {
        email: email_addresses[0]?.email_address,
        firstName: first_name,
        lastName: last_name,
        updatedAt: new Date()
      },
      { new: true, upsert: true }
    );
    
    console.log(`Пользователь обновлен: ${id}`);
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error);
  }
}

async function handleUserDeleted(data: any) {
  try {
    const { id } = data;
    
    // Удаляем пользователя и связанные данные
    await User.deleteOne({ clerkId: id });
    
    // Здесь можно добавить удаление персонажей и прогресса пользователя
    
    console.log(`Пользователь удален: ${id}`);
  } catch (error) {
    console.error('Ошибка при удалении пользователя:', error);
  }
} 