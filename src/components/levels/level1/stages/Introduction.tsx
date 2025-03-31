import React from 'react';
import { useRouter } from 'next/router';
import { styles } from '../common/styles';
import { LevelStage } from '../../../../types/level';
import MentorTip from '../../../common/MentorTip';

const Introduction: React.FC = () => {
  const router = useRouter();
  const handleContinue = () => {
    router.push('/level1');
  };
  
  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Добро пожаловать в TaskMaster!</h2>
      
      <div className="flex justify-end mb-4">
        <MentorTip
          content={
            <>
              <h3 className="text-lg font-bold mb-2">Введение в продуктовое мышление</h3>
              <p className="mb-2">В этом уровне вы познакомитесь с основами продуктового мышления и узнаете, как применять его на практике.</p>
              <p className="mb-2">Что вы изучите:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Что такое продуктовое мышление и почему оно важно</li>
                <li>Как анализировать пользовательский опыт</li>
                <li>Какие метрики важны для продукта</li>
                <li>Как принимать решения, основанные на данных</li>
              </ul>
            </>
          }
          position="left"
          className="z-10"
        />
      </div>
      
      <section className={styles.section}>
        <h3 className={styles.subheader}>О компании</h3>
        <p className={styles.text}>
          TaskMaster — это растущий сервис управления задачами, который помогает командам 
          эффективно организовывать работу. За последний год аудитория сервиса выросла на 300%, 
          но команда заметила ряд проблем с процессом создания задач, который сказывается на 
          удержании пользователей и конверсии.
        </p>
      </section>
      
      <section className={styles.section}>
        <h3 className={styles.subheader}>Ваша роль</h3>
        <p className={styles.text}>
          Вы недавно присоединились к команде TaskMaster в качестве младшего продакт-менеджера. 
          Ваша первая серьезная задача — проанализировать и улучшить процесс создания задач в приложении. 
          Вам нужно будет изучить проблему, собрать данные, проанализировать метрики и предложить 
          решение, которое улучшит пользовательский опыт и ключевые показатели.
        </p>
        <p className={styles.text}>
          В процессе работы над задачей вы будете применять продуктовое мышление, анализировать 
          метрики, проводить UX-анализ и принимать обоснованные решения.
        </p>
      </section>
      
      <section className={styles.section}>
        <h3 className={styles.subheader}>Цели уровня</h3>
        <p className={styles.text}>
          В рамках этого уровня вы научитесь:
        </p>
        <ul className={styles.list}>
          <li>Анализировать проблему с точки зрения продакта, учитывая бизнес-цели и потребности пользователей</li>
          <li>Работать с метриками продукта и выявлять ключевые инсайты</li>
          <li>Проводить базовый UX-анализ и выявлять болевые точки в пользовательском опыте</li>
          <li>Разрабатывать и обосновывать продуктовые решения на основе данных</li>
          <li>Составлять план внедрения и проверки гипотез</li>
        </ul>
      </section>
      
      <section className={styles.section}>
        <h3 className={styles.subheader}>Структура уровня</h3>
        <p className={styles.text}>
          Уровень состоит из следующих этапов:
        </p>
        <ul className={styles.list}>
          <li><strong>Принятие решений: теория</strong> — изучите основные принципы и фреймворки</li>
          <li><strong>Принятие решений: практика</strong> — примените знания на реальном кейсе</li>
          <li><strong>Финальный тест</strong> — проверьте свои знания</li>
        </ul>
      </section>
      
      <div className="flex justify-center mt-8">
        <button 
          className={styles.btnPrimary}
          onClick={handleContinue}
        >
          Начать обучение
        </button>
      </div>
    </div>
  );
};

export default Introduction; 