import NextAuth from "next-auth";

// Расширение типов NextAuth для добавления пользовательских полей в session.user
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      hasCharacter?: boolean;
      fullName?: string;
      bio?: string;
      characterType?: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
    hasCharacter?: boolean;
    fullName?: string;
    bio?: string;
    characterType?: string;
  }
}

// Расширение типов JWT для добавления пользовательских полей в token
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role?: string;
    hasCharacter?: boolean;
    fullName?: string;
    bio?: string;
    characterType?: string;
    dbSyncedAt?: number;
  }
} 