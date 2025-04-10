/**
 * Утилита для отладки сессии и маршрутизации
 */

export function debugSession() {
  try {
    // Получаем данные пользователя из Clerk (localStorage)
    const clerkData = localStorage.getItem('clerk') || '{}';
    const clerkSession = JSON.parse(clerkData);
    
    console.log('Debug Clerk Session:', clerkSession);
    
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
    
    // Проверяем данные персонажа в localStorage
    const characterData = localStorage.getItem('selectedCharacter');
    if (characterData) {
      try {
        const character = JSON.parse(characterData);
        console.log('Debug Character Data:', character);
      } catch (e) {
        console.error('Error parsing character data:', e);
      }
    } else {
      console.log('No character data found in localStorage');
    }
    
    return {
      clerkSession,
      cookies,
      character: characterData ? JSON.parse(characterData) : null
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