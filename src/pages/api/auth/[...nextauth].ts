import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { SessionStrategy } from 'next-auth';
import connectDB from '../../../server/config/db';
import User from '../../../server/models/User';
import { verifyToken } from '../../../server/utils/jwt';

// Инициализация подключения к базе данных
try {
  console.log('Подключение к базе данных MongoDB...');
  await connectDB();
  console.log('Подключение к MongoDB успешно');
} catch (error) {
  console.error('Ошибка подключения к MongoDB:', error);
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // Имя, которое будет отображаться в форме входа
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        try {
          console.log(`Попытка авторизации для email: ${credentials.email}`);
          
          // Найти пользователя по email
          const user = await (User as any).findOne({ email: credentials.email }).select('+password');
          if (!user) {
            console.log(`Пользователь не найден: ${credentials.email}`);
            return null;
          }
          
          // Проверить пароль
          const isMatch = await user.matchPassword(credentials.password);
          if (!isMatch) {
            console.log(`Неверный пароль для: ${credentials.email}`);
            return null;
          }
          
          console.log(`Успешный вход: ${credentials.email}, ID: ${user._id}`);
          
          // Обновляем дату последнего входа
          user.last_login = new Date();
          await user.save();
          
          // Вернуть пользователя в формате NextAuth
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.username,
            image: user.avatar,
            role: user.role,
            hasCharacter: user.hasCharacter || false
          };
        } catch (error) {
          console.error('Ошибка аутентификации в NextAuth:', error);
          return null;
        }
      }
    }),
  ],
  session: {
    strategy: 'jwt' as SessionStrategy,
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Добавляем пользовательские поля в JWT токен
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.hasCharacter = user.hasCharacter;
        token.fullName = user.fullName;
        token.bio = user.bio;
      }
      return token;
    },
    async session({ session, token }) {
      // Добавляем пользовательские поля в сессию
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.hasCharacter = token.hasCharacter as boolean;
        session.user.fullName = token.fullName as string;
        session.user.bio = token.bio as string;
      }
      return session;
    },
    // Проверка безопасности для запросов API
    async signIn({ user, account, profile, email, credentials }) {
      return true; // Разрешаем вход всем прошедшим authorize
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
    signOut: '/auth/login',
  },
  // JWT настройки
  jwt: {
    maxAge: 60 * 60 * 24 * 30, // 30 дней
  },
  secret: process.env.NEXTAUTH_SECRET || 'секрет_для_режима_разработки',
  debug: process.env.NODE_ENV === 'development',
  // Настройки Cookie
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
};

// NextAuth обработчик запросов
const nextAuthHandler = (req, res) => NextAuth(req, res, authOptions);

// Устанавливаем поддержку CORS для всех маршрутов NextAuth
export default async function handler(req, res) {
  // Устанавливаем CORS заголовки для разрешения запросов
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
  
  // Обработка OPTIONS запроса (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Передаем все остальные запросы в NextAuth
  return nextAuthHandler(req, res);
} 