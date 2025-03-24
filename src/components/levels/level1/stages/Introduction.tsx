import React from 'react';
import { useRouter } from 'next/router';
import { styles } from '../common/styles';
import { LevelStage, getNextStage } from '../common/LevelStages';

const Introduction: React.FC = () => {
  const router = useRouter();
  
  const handleContinue = () => {
    const nextStage = getNextStage(LevelStage.INTRODUCTION);
    router.push(`/level1?stage=${nextStage}`);
  };
  
  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Добро пожаловать в TaskMaster!</h2>
      
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
          <li><strong>Встреча с командой</strong> — познакомьтесь с командой и узнайте их видение проблемы</li>
          <li><strong>Анализ метрик</strong> — изучите ключевые метрики и выявите проблемные места</li>
          <li><strong>UX-анализ</strong> — проанализируйте текущий интерфейс и выявите болевые точки</li>
          <li><strong>Исследование пользователей</strong> — изучите отзывы и проведите интервью с пользователями</li>
          <li><strong>Проектирование решения</strong> — разработайте и обоснуйте свое решение</li>
          <li><strong>План внедрения</strong> — составьте план реализации и тестирования решения</li>
          <li><strong>Итоговый тест</strong> — проверьте свои знания и навыки</li>
        </ul>
      </section>
      
      <div className={styles.actionButtons}>
        <button 
          className={styles.btnPrimary}
          onClick={handleContinue}
        >
          Начать уровень
        </button>
      </div>
      
      <div className={styles.mentorTip}>
        <h4 className={styles.mentorTipTitle}>Совет ментора:</h4>
        <p className={styles.mentorTipText}>
          В работе продакт-менеджера важно опираться на данные и глубокое понимание пользователей. 
          Не торопитесь сразу предлагать решения — сначала тщательно изучите проблему, проанализируйте 
          метрики и отзывы пользователей, и только потом приступайте к разработке решения.
        </p>
      </div>
    </div>
  );
};

export default Introduction; 