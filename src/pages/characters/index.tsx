import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { CharacterSelect } from '../../components/dashboard/CharacterSelect';

const Characters: NextPage = () => {
  const router = useRouter();
  const { redirectTo } = router.query;
  
  useEffect(() => {
    // После выбора персонажа переходим по redirectTo, если он есть
    // Логика редиректа обрабатывается в компоненте CharacterSelect
  }, [redirectTo]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-slate-900">
        <Head>
          <title>Выбор персонажа</title>
        </Head>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white pt-8 mb-6">Выбор персонажа</h1>
          <CharacterSelect />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Characters; 