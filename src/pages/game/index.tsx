import { NextPage } from 'next';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import Head from 'next/head';

const Game: NextPage = () => {
  return (
    <ProtectedRoute characterRequired={true}>
      <div className="min-h-screen bg-slate-900">
        <Head>
          <title>Игра | GOTOGROW</title>
          <meta name="description" content="Игровой процесс" />
        </Head>
        <main className="container-wide py-8">
          <h1 className="text-3xl font-bold text-white mb-6">Игровой экран</h1>
          {/* Содержимое игры */}
          <div className="bg-slate-800 rounded-lg p-8 text-white">
            <p>Здесь будет отображаться игровой контент</p>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
};

export default Game; 