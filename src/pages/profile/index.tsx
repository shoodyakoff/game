import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Sidebar from '../../components/layout/Sidebar';
import Header from '../../components/layout/Header';

import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { RootState } from '../../store';
import { selectSelectedCharacter } from '../../store/slices/characterSlice';
import LogoutButton from '../../components/LogoutButton';

const Profile: NextPage = () => {
  const dispatch = useDispatch();
  const { data: session, status } = useSession();
  const user = session?.user;
  
  // Обновление для обработки типов user из NextAuth
  const selectedCharacter = user && user.hasCharacter ? { 
    name: user.name || 'Персонаж',
    type: user.role || 'user',
    icon: user.image || '/images/characters/icons/default.png'
  } : null;
  
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // Указываем, что мы находимся на клиенте
    setIsClient(true);
    
    // Заполняем форму данными из сессии
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        fullName: user.fullName || '',
        bio: user.bio || ''
      }));
    }
  }, [user]);
  
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
      // Реальный API-запрос на обновление профиля
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const response = await axios.put(`${API_URL}/user/profile`, {
        name: formData.name,
        email: formData.email,
        fullName: formData.fullName,
        bio: formData.bio
      }, {
        headers: { 
          'Content-Type': 'application/json'
        },
        withCredentials: true // Важно для передачи cookies с session token
      });
      
      setMessage({ 
        type: 'success', 
        text: 'Профиль успешно обновлен!' 
      });
      
      // Обновляем сессию, потребуется перезагрузка страницы
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error: any) {
      console.error('Ошибка обновления профиля:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Произошла ошибка при обновлении профиля'
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
      // Реальный API-запрос на обновление пароля
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
      const response = await axios.put(`${API_URL}/user/password`, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      }, {
        headers: { 
          'Content-Type': 'application/json'
        },
        withCredentials: true // Важно для передачи cookies с session token
      });
      
      setMessage({ 
        type: 'success', 
        text: 'Пароль успешно обновлен!' 
      });
      
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
        text: error.response?.data?.message || 'Произошла ошибка при обновлении пароля'
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
    <ProtectedRoute requireCharacter={true}>
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
                    className={`mb-4 p-3 rounded ${message.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}
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
                        />
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
                        rows={4}
                        className="input-field"
                        placeholder="Расскажите немного о себе..."
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <button 
                        type="submit"
                        className="btn-primary flex items-center justify-center"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Сохранение...
                          </>
                        ) : 'Сохранить изменения'}
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
                      <p className="text-xs text-slate-400 mt-1">
                        Пароль должен содержать минимум 8 символов, включая как минимум одну цифру и один специальный символ (!@#$%^&*,.? и т.д.)
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="form-label">Подтверждение пароля</label>
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
                    
                    <div className="flex justify-end">
                      <button 
                        type="submit"
                        className="btn-primary flex items-center justify-center"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Сохранение...
                          </>
                        ) : 'Обновить пароль'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
              
              <div className="card">
                <h3 className="text-lg font-bold mb-4">Удаление аккаунта</h3>
                <p className="text-slate-400 mb-4">
                  Внимание! Удаление аккаунта является необратимым действием. Все ваши данные, включая
                  игровой прогресс и достижения, будут безвозвратно удалены.
                </p>
                <button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Удалить аккаунт
                </button>
              </div>
            </div>
          </div>
        </main>
        
        <footer className="bg-slate-800/50 border-t border-slate-700 py-6">
          <div className="container-wide">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-slate-400">© 2023 GOTOGROW. Все права защищены.</p>
              </div>
              <div className="flex space-x-4">
                <Link href="/privacy" legacyBehavior>
                  <a className="text-sm text-slate-400 hover:text-white">Политика конфиденциальности</a>
                </Link>
                <Link href="/terms" legacyBehavior>
                  <a className="text-sm text-slate-400 hover:text-white">Условия использования</a>
                </Link>
                <Link href="/help" legacyBehavior>
                  <a className="text-sm text-slate-400 hover:text-white">Помощь</a>
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  );
};

export default Profile; 