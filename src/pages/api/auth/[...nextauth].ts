import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { SessionStrategy } from 'next-auth';

export const authOptions = {
  providers: [
    CredentialsProvider({
      // Имя, которое будет отображаться в форме входа
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        // Здесь должна быть логика авторизации
        // Для примера мы просто создаем моковый объект пользователя
        if (credentials?.email && credentials?.password) {
          return {
            id: '1',
            name: 'Тестовый пользователь',
            email: credentials.email,
          };
        }
        return null;
      }
    }),
  ],
  session: {
    strategy: 'jwt' as SessionStrategy,
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'рандомная_строка_для_режима_разработки'
};

export default NextAuth(authOptions); 