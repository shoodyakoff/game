import React from 'react';
import { useRouter } from 'next/router';
import { styles } from '../common/styles';

const Completion = () => {
  const router = useRouter();

  const handleGoToMain = () => {
    router.push('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.completionContainer}>
        <h1 className={styles.completionHeader}>Поздравляем с завершением уровня 1!</h1>
        
        <div className={styles.completionContent}>
          <div className={styles.completionImage}>
            <img src="/images/level1/completion.svg" alt="Уровень завершен" className={styles.celebrationImage} />
          </div>
          
          <div className={styles.completionText}>
            <p>
              Вы успешно завершили первый уровень курса по продуктовому менеджменту и приобрели ценные знания и навыки 
              в следующих областях:
            </p>
            
            <div className={styles.completionSkills}>
              <div className={styles.skillItem}>
                <h3 className={styles.skillTitle}>Продуктовое мышление</h3>
                <p className={styles.skillDescription}>
                  Вы познакомились с основами продуктового мышления, научились фокусироваться на проблемах пользователей 
                  и сочетать их с бизнес-целями.
                </p>
              </div>
              
              <div className={styles.skillItem}>
                <h3 className={styles.skillTitle}>UX-анализ</h3>
                <p className={styles.skillDescription}>
                  Вы освоили методы анализа пользовательского опыта, изучили как выявлять проблемные места 
                  в пользовательском пути и применили эти знания на практике.
                </p>
              </div>
              
              <div className={styles.skillItem}>
                <h3 className={styles.skillTitle}>Работа с метриками</h3>
                <p className={styles.skillDescription}>
                  Вы научились выбирать и анализировать ключевые метрики, понимать их взаимосвязь и 
                  использовать данные для принятия обоснованных решений.
                </p>
              </div>
              
              <div className={styles.skillItem}>
                <h3 className={styles.skillTitle}>Принятие решений</h3>
                <p className={styles.skillDescription}>
                  Вы изучили структурированный подход к принятию решений в продуктовой разработке, 
                  научились оценивать альтернативы и выбирать наилучшие решения на основе данных.
                </p>
              </div>
            </div>
            
            <div className={styles.whatNext}>
              <h2 className={styles.whatNextTitle}>Что дальше?</h2>
              <p className={styles.whatNextDescription}>
                На следующих уровнях вы углубите свои знания и навыки, изучите более продвинутые темы, 
                такие как:
              </p>
              <ul className={styles.whatNextList}>
                <li>Стратегическое планирование продукта</li>
                <li>Управление жизненным циклом продукта</li>
                <li>Монетизация и ценообразование</li>
                <li>Работа с заинтересованными сторонами</li>
                <li>Построение и развитие продуктовой команды</li>
              </ul>
            </div>
            
            <div className={styles.mentorMessage}>
              <h3 className={styles.mentorMessageTitle}>Сообщение от ментора</h3>
              <div className={styles.mentorQuote}>
                <p>
                  "Продуктовый менеджмент — это искусство и наука создания продуктов, которые решают реальные проблемы 
                  и приносят ценность пользователям и бизнесу. Вы сделали первый важный шаг в освоении этой многогранной 
                  профессии. Продолжайте развивать свои навыки, задавать правильные вопросы и принимать решения, 
                  основанные на данных и пользовательских потребностях."
                </p>
                <p className={styles.mentorName}>— Анна, продуктовый лидер с 10-летним опытом</p>
              </div>
            </div>
            
            <div className={styles.certificateSection}>
              <h3 className={styles.certificateTitle}>Ваш сертификат</h3>
              <p className={styles.certificateDescription}>
                Вы получили сертификат о прохождении уровня 1. Вы можете скачать его и поделиться своим достижением 
                в социальных сетях.
              </p>
              <div className={styles.certificateActions}>
                <button className={styles.certificateDownload}>Скачать сертификат</button>
                <button className={styles.certificateShare}>Поделиться</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.navigationButtons}>
          <button className={styles.btnPrimary} onClick={handleGoToMain}>
            Вернуться на главную
          </button>
          <button className={styles.btnSecondary}>
            Перейти к уровню 2
          </button>
        </div>
      </div>
    </div>
  );
};

export default Completion; 