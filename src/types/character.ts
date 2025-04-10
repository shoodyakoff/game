export enum CharacterType {
  DEVELOPER = 'developer',
  DESIGNER = 'designer',
  MANAGER = 'manager'
}

export interface Character {
  id: string;
  name: string;
  image: string;
  icon?: string;
  description: string;
  type?: CharacterType;
  role?: string;
  difficulty?: string;
  stats?: {
    logic?: number;
    analytics?: number;
    communication?: number;
    strategy?: number;
    technical?: number;
    creativity?: number;
    leadership?: number;
  };
  achievements?: string[];
} 