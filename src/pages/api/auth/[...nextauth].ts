import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { SessionStrategy } from 'next-auth';
import connectDB from '../../../server/config/db';
import User from '../../../server/models/User';
import { verifyToken } from '../../../server/utils/jwt';
import mongoose from 'mongoose';

// Инициализация подключения к базе данных - делаем асинхронно, но не блокируем запуск
let dbConnectionPromise: Promise<any> | null = null;

// Функция для получения подключения к БД
const getDbConnection = async () => {
  if (!dbConnectionPromise) {
    dbConnectionPromise = (async () => {
      try {
        console.log('Подключение к базе данных MongoDB...');
        const connection = await connectDB();
        console.log('Подключение к MongoDB успешно');
        return connection;
      } catch (error) {
        console.error('Ошибка подключения к MongoDB:', error);
        return null;
      }
    })();
  }
  return dbConnectionPromise;
};

// Инициируем подключение, но не ждем его завершения
getDbConnection();

// Тип для результата запроса MongoDB 
interface UserDocument {
  _id: mongoose.Types.ObjectId;
  role?: string;
  hasCharacter?: boolean;
  fullName?: string;
  bio?: string;
  characterType?: string;
  [key: string]: any;
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
        if (!credentials?.email || !credentials?.password) {
          console.log('Отсутствуют учетные данные:', { 
            hasEmail: !!credentials?.email, 
            hasPassword: !!credentials?.password 
          });
          return null;
        }
        
        try {
          console.log(`Попытка авторизации для email: ${credentials.email}`);
          
          // Найти пользователя по email
          const user = await (User as any).findOne({ email: credentials.email }).select('+password');
          if (!user) {
            console.log(`Пользователь не найден: ${credentials.email}`);
            throw new Error('Пользователь не найден');
          }
          
          // Проверить пароль
          console.log(`Сравнение пароля для: ${credentials.email}`);
          const isMatch = await user.matchPassword(credentials.password);
          console.log(`Результат сравнения пароля: ${isMatch}`);
          
          if (!isMatch) {
            console.log(`Неверный пароль для: ${credentials.email}`);
            throw new Error('Неверный пароль');
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
            hasCharacter: user.hasCharacter || false,
            fullName: user.fullName || '',
            bio: user.bio || '',
            characterType: user.characterType || ''
          };
        } catch (error) {
          console.error('Ошибка аутентификации в NextAuth:', error);
          // Перебрасываем ошибку для обработки в NextAuth
          throw error;
        }
      }
    }),
  ],
  session: {
    strategy: 'jwt' as SessionStrategy,
    maxAge: 30 * 24 * 60 * 60, // 30 дней
    updateAge: 24 * 60 * 60, // 1 день - как часто обновляется сессия
  },
  callbacks: {
    async jwt({ token, user, account }) {
      console.log('JWT Callback вызван', { 
        hasToken: !!token, 
        hasUser: !!user, 
        tokenId: token?.sub,
        userId: user?.id 
      });
      
      if (user) {
        console.log('Добавление пользовательской информации в токен JWT');
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.role = user.role;
        token.hasCharacter = user.hasCharacter;
        token.fullName = user.fullName || '';
        token.bio = user.bio || '';
        token.characterType = user.characterType || '';
      }
      
      console.log('Итоговый JWT токен', { 
        id: token.id, 
        email: token.email, 
        name: token.name,
        role: token.role
      });
      
      return token;
    },
    
    async session({ session, token }) {
      console.log('Session Callback вызван', { 
        hasSession: !!session, 
        hasToken: !!token,
        sessionUserId: session?.user?.email, 
        tokenId: token?.id 
      });
      
      if (token) {
        console.log('Добавление пользовательской информации в сессию');
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.hasCharacter = token.hasCharacter as boolean;
        session.user.fullName = token.fullName as string;
        session.user.bio = token.bio as string;
        session.user.characterType = token.characterType as string;
      }
      
      console.log('Итоговая сессия', { 
        id: session?.user?.id,
        email: session?.user?.email,
        name: session?.user?.name,
        role: session?.user?.role
      });
      
      return session;
    },

    // Проверка безопасности для запросов API
    async signIn({ user, account, profile, email, credentials }) {
      console.log('signIn callback вызван:', { 
        hasUser: !!user, 
        hasAccount: !!account, 
        hasCredentials: !!credentials 
      });
      return true; // Разрешаем вход всем прошедшим authorize
    },
    // Исправление для обработки URL обратного вызова
    async redirect({ url, baseUrl }) {
      // Проверка на недопустимые символы в URL
      if (!url || typeof url !== 'string') {
        return baseUrl + '/dashboard';
      }
      
      try {
        // Декодируем URL, если он закодирован
        let decodedUrl = url.includes('%') ? decodeURIComponent(url) : url;
        
        // Если URL относительный и начинается с /
        if (decodedUrl.startsWith('/')) {
          // Очищаем URL от недопустимых символов
          decodedUrl = decodedUrl.replace(/[^\w\s/\-?=&%]/g, '');
          return `${baseUrl}${decodedUrl}`;
        } 
        
        // Если URL абсолютный и с того же домена
        if (decodedUrl.startsWith(baseUrl)) {
          // Проверяем, что оставшаяся часть URL допустима
          const urlPath = decodedUrl.substring(baseUrl.length);
          const cleanUrlPath = urlPath.replace(/[^\w\s/\-?=&%]/g, '');
          return `${baseUrl}${cleanUrlPath}`;
        }
        
        // По умолчанию возвращаем на страницу дашборда
        return `${baseUrl}/dashboard`;
      } catch (error) {
        console.error('Ошибка в функции redirect:', error);
        return `${baseUrl}/dashboard`;
      }
    }
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
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  logger: {
    error(code, metadata) {
      console.error('[NextAuth] Ошибка:', { code, metadata });
    },
    warn(code) {
      console.warn('[NextAuth] Предупреждение:', code);
    },
    debug(code, metadata) {
      console.log('[NextAuth] Отладка:', { code, metadata });
    }
  }
};

// NextAuth обработчик запросов
export default NextAuth(authOptions); 