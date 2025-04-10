import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return res.status(401).json({ error: 'Необходима аутентификация' });
    }
    
    // Получаем данные пользователя из Clerk
    const user = await clerkClient.users.getUser(userId);
    
    // Возвращаем только нужные поля
    return res.status(200).json({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      // Маскируем для безопасности
      emailVerified: user.emailAddresses[0]?.verification?.status === 'verified',
      createdAt: user.createdAt
    });
  } catch (error: any) {
    console.error('Ошибка получения профиля пользователя:', error);
    return res.status(500).json({ 
      error: 'Ошибка сервера при получении данных пользователя',
      message: error.message
    });
  }
} 