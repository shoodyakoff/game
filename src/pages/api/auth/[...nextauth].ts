import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { SessionStrategy } from 'next-auth';
import connectDB from '../../../server/config/db';
import User from '../../../server/models/User';
import { verifyToken } from '../../../server/utils/jwt';
import mongoose, { Model } from 'mongoose';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '../../../server/config/mongodb';
import { compare } from 'bcryptjs';

// Тип для результата запроса MongoDB 
interface UserDocument extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  username: string;
  role: 'user' | 'admin';
  hasCharacter?: boolean;
  fullName?: string;
  bio?: string;
  characterType?: string;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Отсутствуют учетные данные');
          return null;
        }

        try {
          // Устанавливаем соединение с MongoDB
          await connectDB();
          
          const user = await (User as Model<UserDocument>)
            .findOne({ email: credentials.email })
            .select('+password')
            .exec();
          
          if (!user) {
            console.log('Пользователь не найден:', credentials.email);
            return null;
          }

          const isValid = await user.matchPassword(credentials.password);

          if (!isValid) {
            console.log('Неверный пароль для пользователя:', credentials.email);
            return null;
          }

          // Обновляем время последнего входа
          await (User as Model<UserDocument>).updateOne(
            { _id: user._id },
            { $set: { last_login: new Date() } }
          );

          console.log('Успешная аутентификация для пользователя:', credentials.email);
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.username,
            role: user.role
          };
        } catch (error) {
          console.error('Ошибка при авторизации:', {
            name: error.name,
            message: error.message,
            code: error.code,
            stack: error.stack
          });
          throw new Error('Ошибка при проверке учетных данных');
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT Callback вызван', {
        hasToken: !!token,
        hasUser: !!user,
        tokenId: token?.id,
        userId: user?.id
      });

      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }

      console.log('Итоговый JWT токен', token);
      return token;
    },
    async session({ session, token }) {
      console.log('Session Callback вызван', {
        hasSession: !!session,
        hasToken: !!token,
        sessionUserId: session?.user?.email,
        tokenId: token?.id
      });

      if (token && session.user) {
        console.log('Добавление пользовательской информации в сессию');
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.role = token.role;
      }

      console.log('Итоговая сессия', session.user);
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
    error: '/auth/error',
  },
  // JWT настройки
  jwt: {
    maxAge: 60 * 60 * 24 * 30, // 30 дней
  },
  secret: process.env.NEXTAUTH_SECRET,
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