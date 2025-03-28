import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { SessionStrategy } from 'next-auth';
import connectDB from '../../../server/config/db';
import User from '../../../server/models/User';
import { verifyToken } from '../../../server/utils/jwt';
import mongoose from 'mongoose';

// Инициализация подключения к базе данных
try {
  console.log('Подключение к базе данных MongoDB...');
  await connectDB();
  console.log('Подключение к MongoDB успешно');
} catch (error) {
  console.error('Ошибка подключения к MongoDB:', error);
}

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
    async jwt({ token, user, trigger, session }) {
      try {
        // Если пользователь входит в систему
        if (user) {
          console.log('[NextAuth] JWT callback - new user data', { id: user.id });
          // Пытаемся загрузить дополнительную информацию о пользователе из базы данных
          await connectDB();
          console.log('[NextAuth] Проверка данных пользователя из базы данных');
          
          try {
            // Используем конструкцию try/catch для безопасного доступа к пользователю
            const userData = await mongoose.model('User').findById(user.id).lean() as UserDocument | null;
            
            if (userData) {
              // Добавляем свойства из базы данных в токен с безопасной проверкой
              const additionalData = {
                id: user.id,
                role: userData.role || 'user',
                hasCharacter: userData.hasCharacter || false,
                fullName: userData.fullName || '',
                bio: userData.bio || '',
                characterType: userData.characterType || ''
              };
              
              console.log('[NextAuth] Обновлены данные JWT из базы данных:', {
                hasCharacter: additionalData.hasCharacter,
                characterType: additionalData.characterType,
                role: additionalData.role
              });
              
              token = {
                ...token,
                ...additionalData
              };
            }
          } catch (dbError) {
            console.error('[NextAuth] Ошибка при доступе к пользователю в базе данных:', dbError);
          }
        }
        
        // Если клиент запрашивает обновление сессии
        if (trigger === 'update' && session) {
          console.log('[NextAuth] JWT обновление через trigger=update');
          
          // Копируем все свойства из обновленной сессии в токен
          // Это важно, чтобы избежать конфликтов между токеном и сессией
          if (session.user) {
            const { id, hasCharacter, characterType, role } = session.user as any;
            
            // Обновляем только поля, которые существуют в запросе обновления
            if (hasCharacter !== undefined) token.hasCharacter = hasCharacter;
            if (characterType !== undefined) token.characterType = characterType;
            if (role !== undefined) token.role = role;
            
            console.log('[NextAuth] JWT обновлен из сессии:', {
              hasCharacter,
              characterType,
              role
            });
          }
        }
      } catch (error) {
        console.error('[NextAuth] Ошибка в JWT callback:', error);
        // Не позволяем ошибке "сломать" JWT - продолжаем с существующим токеном
      }
      
      return token;
    },
    
    async session({ session, token }) {
      try {
        console.log('[NextAuth] Session callback', { tokenId: token.id });
        
        // Инициализируем session.user с необходимыми полями по умолчанию
        session.user = {
          id: "",
          name: session.user?.name || null,
          email: session.user?.email || null,
          image: session.user?.image || null,
          role: "user",
          hasCharacter: false,
          fullName: "",
          bio: "",
          characterType: ""
        };
        
        // Обеспечиваем наличие всех полей из токена в сессии
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.hasCharacter = token.hasCharacter as boolean;
        session.user.fullName = (token.fullName as string) || '';
        session.user.bio = (token.bio as string) || '';
        session.user.characterType = (token.characterType as string) || '';
        
        console.log('[NextAuth] Session after update:', session.user);
      } catch (error) {
        console.error('[NextAuth] Ошибка в Session callback:', error);
        // Возвращаем базовую сессию в случае ошибки
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