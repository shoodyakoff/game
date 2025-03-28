/**
 * Утилита для отладки сессии и маршрутизации
 */

export function debugSession() {
  try {
    // Получаем сессию из localStorage
    const nextAuthSession = localStorage.getItem('nextauth.session');
    if (!nextAuthSession) {
      console.log('Debug Session: No session found in localStorage');
      return;
    }
    
    // Парсим сессию
    const session = JSON.parse(nextAuthSession);
    console.log('Debug Session:', {
      expires: new Date(session.expires),
      user: session.user,
      expiresIn: Math.round((new Date(session.expires).getTime() - Date.now()) / 1000 / 60) + ' минут'
    });
    
    // Проверяем куки для отладки сессии
    const cookies = document.cookie.split(';').reduce((obj, cookie) => {
      const [key, value] = cookie.trim().split('=');
      try {
        obj[key] = decodeURIComponent(value);
      } catch (e) {
        obj[key] = value;
      }
      return obj;
    }, {} as Record<string, string>);
    
    console.log('Debug Cookies:', cookies);
    
    // Проверяем, не истекла ли сессия
    if (new Date(session.expires) < new Date()) {
      console.log('Debug Session: Session has expired!');
    }
    
    return {
      session,
      cookies
    };
  } catch (error) {
    console.error('Debug Session Error:', error);
    return null;
  }
}

// Запускаем отладку сессии при загрузке утилиты в режиме разработки
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('Debug Utility Loaded');
  window.debugSession = debugSession;
  
  // Для автоматического запуска отладки в консоли:
  // debugSession();
}

// Расширяем Window интерфейс для доступа к функции отладки
declare global {
  interface Window {
    debugSession: typeof debugSession;
  }
} 