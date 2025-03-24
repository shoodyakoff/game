const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
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
  avatar: {
    type: String,
    default: '/images/characters/icons/default.png'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
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
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Проверка соответствия введенного пароля хешированному
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', UserSchema); 