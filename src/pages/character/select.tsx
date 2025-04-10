import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useUser } from '@clerk/nextjs';
import { CharacterSelect } from '../../components/dashboard/CharacterSelect';

const CharacterSelectPage: NextPage = () => {
  const router = useRouter();
  const { user, isSignedIn, isLoaded } = useUser();
  const { redirectTo } = router.query;

  // Если пользователь еще не загружен или не аутентифицирован,
  // это обрабатывается в middleware

  return (
    <div className="min-h-screen bg-slate-900">
      <Head>
        <title>Выбор персонажа | GOTOGROW</title>
        <meta name="description" content="Выберите персонажа для игрового мира" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="container-wide py-12">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-white mb-4">Выберите своего персонажа</h1>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Каждый персонаж имеет свои уникальные особенности и преимущества на разных уровнях.
                Выберите того, кто подходит вашему стилю игры.
              </p>
            </div>
            
            <CharacterSelect />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default CharacterSelectPage; 