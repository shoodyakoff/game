export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  hasCharacter: boolean;
  characterType?: CharacterType;
  profile: UserProfile;
  settings: UserSettings;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'user' | 'admin' | 'moderator';

export type CharacterType = 
  | 'product-lead'
  | 'agile-coach'
  | 'growth-hacker'
  | 'ux-visionary'
  | 'tech-pm';

export interface UserProfile {
  fullName?: string;
  bio?: string;
  avatar?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

export interface UserSettings {
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  language: string;
} 