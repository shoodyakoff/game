import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { Container } from '../../components/common/Container';
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
        <Container>
          <h1 className="text-3xl font-bold text-white pt-8 mb-6">Выбор персонажа</h1>
          <CharacterSelect />
        </Container>
      </div>
    </ProtectedRoute>
  );
};

export default Characters; 