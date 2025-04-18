import { NextResponse } from 'next/server';

export async function GET() {
  // Собираем информацию о среде выполнения
  const envInfo = {
    nodeEnv: process.env.NODE_ENV,
    clerkMockMode: process.env.NEXT_PUBLIC_CLERK_MOCK_MODE,
    // Скрываем полные ключи, но показываем часть для диагностики
    clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY 
      ? `${process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.substring(0, 10)}...` 
      : 'не установлен',
    hasClerkSecret: process.env.CLERK_SECRET_KEY ? 'установлен' : 'не установлен',
    hasMongoUri: process.env.MONGODB_URI ? 'установлен' : 'не установлен',
    hostname: process.env.HOSTNAME,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  };

  return NextResponse.json({
    status: 'ok',
    message: 'Сервер работает',
    env: envInfo
  });
} 