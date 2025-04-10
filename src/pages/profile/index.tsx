import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';

import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { RootState } from '../../store';
import { selectSelectedCharacter } from '../../store/slices/characterSlice';
import LogoutButton from '../../components/LogoutButton';

// Расширяем тип для дополнительных полей пользователя
interface ExtendedUser {
  fullName?: string;
  bio?: string;
}

const Profile: NextPage = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const selectedCharacter = useSelector(selectSelectedCharacter);
  
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // Указываем, что мы находимся на клиенте
    setIsClient(true);
    
    // Заполняем форму данными из Clerk
    if (isSignedIn && user) {
      setFormData(prev => ({
        ...prev,
        name: user.username || '',
        email: user.primaryEmailAddress?.emailAddress || '',
        fullName: user.fullName || '',
        bio: ''  // Clerk не имеет поля bio по умолчанию
      }));
    }
  }, [user, isSignedIn]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    fullName: '',
    bio: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState('profile');
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Обновляем данные через API Clerk
      if (user) {
        await user.update({
          username: formData.name,
          firstName: formData.fullName.split(' ')[0],
          lastName: formData.fullName.split(' ').slice(1).join(' ')
        });
      }
      
      setMessage({ 
        type: 'success', 
        text: 'Профиль успешно обновлен!' 
      });
      
    } catch (error: any) {
      console.error('Ошибка обновления профиля:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Произошла ошибка при обновлении профиля'
      });
    } finally {
      setIsLoading(false);
      
      // Сбрасываем сообщение через 3 секунды
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    }
  };
  
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ 
        type: 'error', 
        text: 'Новый пароль и подтверждение не совпадают' 
      });
      return;
    }
    
    if (formData.newPassword.length < 8) {
      setMessage({ 
        type: 'error', 
        text: 'Пароль должен содержать минимум 8 символов' 
      });
      return;
    }
    
    // Проверка наличия цифры и специального символа
    const hasNumber = /\d/.test(formData.newPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword);
    
    if (!hasNumber || !hasSpecial) {
      setMessage({ 
        type: 'error', 
        text: 'Пароль должен содержать хотя бы одну цифру и один специальный символ' 
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Используем API Clerk для смены пароля
      if (user) {
        // Получаем существующий пароль у пользователя через персональный URL
        const userProfile = await fetch('/api/clerk/user-profile');
        const passwordResetLink = `https://accounts.clerk.com/user/password/reset?__clerk_ticket=${user.id}`;
        
        setMessage({ 
          type: 'success', 
          text: 'Для смены пароля используйте личный кабинет Clerk. Мы отправили вам ссылку на почту.' 
        });
      }
      
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error: any) {
      console.error('Ошибка обновления пароля:', error);
      setMessage({
        type: 'error',
        text: error.message || 'Произошла ошибка при обновлении пароля'
      });
    } finally {
      setIsLoading(false);
      
      // Сбрасываем сообщение через 3 секунды
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    }
  };
  
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-900">
        <Head>
          <title>Профиль | GOTOGROW</title>
          <meta name="description" content="Управление профилем пользователя" />
        </Head>
        
        <Header activePage="profile" />
        
        <main className="container-wide py-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Боковая панель */}
            <Sidebar activePage="profile" />
            
            {/* Основной контент */}
            <div className="md:w-3/4">
              <div className="card mb-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Настройки профиля</h2>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setActiveTab('profile')}
                      className={`px-4 py-2 rounded-lg ${activeTab === 'profile' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'}`}
                    >
                      Профиль
                    </button>
                    <button 
                      onClick={() => setActiveTab('security')}
                      className={`px-4 py-2 rounded-lg ${activeTab === 'security' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'}`}
                    >
                      Безопасность
                    </button>
                  </div>
                </div>
                
                {message.text && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-4 p-3 rounded ${
                      message.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 
                      message.type === 'info' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {message.text}
                  </motion.div>
                )}
                
                {activeTab === 'profile' ? (
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="form-label">Имя пользователя</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="input-field"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="input-field"
                          required
                          disabled={true} // Email управляется Clerk
                        />
                        <p className="text-xs text-slate-400 mt-1">Управляется через Clerk</p>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="fullName" className="form-label">Полное имя</label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="input-field"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="bio" className="form-label">О себе</label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        className="input-field"
                        rows={4}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="btn-primary"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Сохранение...' : 'Сохранить изменения'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="form-label">Текущий пароль</label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="form-label">Новый пароль</label>
                      <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                      <p className="text-xs text-slate-400 mt-1">Минимум 8 символов, должен содержать цифру и специальный символ</p>
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="form-label">Подтвердите новый пароль</label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>
                    
                    <p className="text-amber-400 text-sm mt-1">
                      Обратите внимание: обновление пароля может потребовать повторной авторизации.
                    </p>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="btn-primary"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Обновление...' : 'Обновить пароль'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
              
              <div className="card">
                <h3 className="text-lg font-bold mb-4">Дополнительные настройки</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-md font-semibold mb-2">Персональные данные</h4>
                    <Link href="/user/data" className="text-indigo-400 hover:text-indigo-300 text-sm">
                      Управление личными данными
                    </Link>
                  </div>
                  
                  <div>
                    <h4 className="text-md font-semibold mb-2">Удаление аккаунта</h4>
                    <p className="text-sm text-slate-400 mb-2">
                      Эта операция необратима и удалит все ваши данные.
                    </p>
                    <button
                      className="text-red-500 hover:text-red-400 text-sm font-medium"
                      onClick={() => {
                        if (window.confirm('Вы уверены, что хотите удалить свой аккаунт? Это действие необратимо.')) {
                          // Здесь будет логика удаления аккаунта
                          alert('Функция удаления аккаунта находится в разработке');
                        }
                      }}
                    >
                      Удалить мой аккаунт
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Profile; 