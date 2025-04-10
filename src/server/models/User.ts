import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * ВАЖНО: Эта модель User сейчас используется только для обратной совместимости
 * с устаревшими частями приложения. Основное хранение и управление пользователями
 * теперь происходит через Clerk. Для синхронизации данных используются вебхуки Clerk
 * (см. src/pages/api/webhooks/clerk.ts).
 * 
 * В новом коде рекомендуется использовать API Clerk вместо этой модели.
 */

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  fullName: string;
  bio: string;
  avatar: string;
  role: 'user' | 'admin';
  characterType: 'product-lead' | 'agile-coach' | 'growth-hacker' | 'ux-visionary' | 'tech-pm' | null;
  created_at: Date;
  updated_at: Date;
  last_login?: Date;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  hasCharacter: boolean;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema = new Schema({
  username: {
    type: String,
    required: [true, 'Пожалуйста, укажите имя пользователя'],
    unique: true,
    trim: true,
    minlength: [3, 'Имя пользователя должно содержать не менее 3 символов']
  },
  email: {
    type: String,
    required: [true, 'Пожалуйста, укажите email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Пожалуйста, укажите корректный email'
    ],
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Пожалуйста, введите пароль'],
    minlength: [6, 'Пароль должен содержать не менее 6 символов'],
    select: false // Не возвращаем пароль по умолчанию
  },
  fullName: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  avatar: {
    type: String,
    default: '/images/characters/icons/default.png'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  characterType: {
    type: String,
    enum: ['product-lead', 'agile-coach', 'growth-hacker', 'ux-visionary', 'tech-pm', null],
    default: null
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  last_login: {
    type: Date
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  hasCharacter: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
});

// Хеширование пароля перед сохранением
UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Проверка соответствия введенного пароля хешированному
UserSchema.methods.matchPassword = async function(enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Проверяем, существует ли модель, и создаем новую или используем существующую
const User = mongoose.models.User as mongoose.Model<IUser> || mongoose.model<IUser>('User', UserSchema);
export default User; 