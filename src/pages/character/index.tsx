import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const CharacterRedirectPage: NextPage = () => {
  const router = useRouter();
  
  useEffect(() => {
    // Получаем все параметры URL
    const queryParams = router.asPath.split('?')[1] || '';
    
    // Перенаправляем на correct path с сохранением всех параметров
    router.replace(`/character/select${queryParams ? `?${queryParams}` : ''}`);
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <p className="text-white text-xl">Перенаправление...</p>
    </div>
  );
};

export default CharacterRedirectPage; 