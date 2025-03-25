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
            bio: user.bio || ''
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
      console.log('signIn callback вызван:', { 
        hasUser: !!user, 
        hasAccount: !!account, 
        hasCredentials: !!credentials 
      });
      return true; // Разрешаем вход всем прошедшим authorize
    },
    // Исправление для обработки URL обратного вызова
    async redirect({ url, baseUrl }) {
      // Исправление неверных URL
      if (url.includes('%3A%2F%2F')) {
        url = decodeURIComponent(url);
      }
      
      // Проверка, является ли URL относительным или абсолютным
      if (url.startsWith('/')) {
        // Добавляем baseUrl к относительному URL
        return `${baseUrl}${url}`;
      } else if (url.startsWith(baseUrl)) {
        // URL уже абсолютный и принадлежит этому сайту
        return url;
      }
      // По умолчанию возвращаем на страницу профиля
      return `${baseUrl}/dashboard`;
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
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
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