import NextAuth from "next-auth";

// Расширение типов NextAuth для добавления пользовательских полей в session.user
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string;
      email?: string;
      image?: string;
      role?: string;
      hasCharacter?: boolean;
      fullName?: string;
      bio?: string;
    };
  }

  interface User {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    role?: string;
    hasCharacter?: boolean;
    fullName?: string;
    bio?: string;
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
  }
} 