import React from 'react';
import { useRouter } from 'next/router';
import { styles } from '../common/styles';

type CompletionProps = {
  onComplete: () => void;
};

const Completion = ({ onComplete }: CompletionProps) => {
  const router = useRouter();

  const handleGoToMain = () => {
    router.push('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h1 className={styles.header}>Поздравляем с завершением уровня 1!</h1>
        
        <div className={styles.section}>
          <div className="mb-8">
            <img src="/images/level1/completion.svg" alt="Уровень завершен" className="w-64 h-64 mx-auto" />
          </div>
          
          <div className={styles.text}>
            <p className={styles.text}>
              Вы успешно завершили первый уровень курса по продуктовому менеджменту и приобрели ценные знания и навыки 
              в следующих областях:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-400 mb-2">Продуктовое мышление</h3>
                <p className="text-slate-300">
                  Вы познакомились с основами продуктового мышления, научились фокусироваться на проблемах пользователей 
                  и сочетать их с бизнес-целями.
                </p>
              </div>
              
              <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-400 mb-2">UX-анализ</h3>
                <p className="text-slate-300">
                  Вы освоили методы анализа пользовательского опыта, изучили как выявлять проблемные места 
                  в пользовательском пути и применили эти знания на практике.
                </p>
              </div>
              
              <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-400 mb-2">Работа с метриками</h3>
                <p className="text-slate-300">
                  Вы научились выбирать и анализировать ключевые метрики, понимать их взаимосвязь и 
                  использовать данные для принятия обоснованных решений.
                </p>
              </div>
              
              <div className="bg-slate-700 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-indigo-400 mb-2">Принятие решений</h3>
                <p className="text-slate-300">
                  Вы изучили структурированный подход к принятию решений в продуктовой разработке, 
                  научились оценивать альтернативы и выбирать наилучшие решения на основе данных.
                </p>
              </div>
            </div>
            
            <div className={styles.section}>
              <h2 className={styles.subheader}>Что дальше?</h2>
              <p className={styles.text}>
                На следующих уровнях вы углубите свои знания и навыки, изучите более продвинутые темы, 
                такие как:
              </p>
              <ul className={styles.list}>
                <li>Стратегическое планирование продукта</li>
                <li>Управление жизненным циклом продукта</li>
                <li>Монетизация и ценообразование</li>
                <li>Работа с заинтересованными сторонами</li>
                <li>Построение и развитие продуктовой команды</li>
              </ul>
            </div>
            
            <div className="bg-slate-700 p-6 rounded-lg my-8 border border-slate-600">
              <h3 className="text-lg font-semibold text-indigo-400 mb-2">Сообщение от ментора</h3>
              <div className="italic text-slate-300">
                <p className={styles.text}>
                  "Продуктовый менеджмент — это искусство и наука создания продуктов, которые решают реальные проблемы 
                  и приносят ценность пользователям и бизнесу. Вы сделали первый важный шаг в освоении этой многогранной 
                  профессии. Продолжайте развивать свои навыки, задавать правильные вопросы и принимать решения, 
                  основанные на данных и пользовательских потребностях."
                </p>
                <p className="text-right font-medium">— Анна, продуктовый лидер с 10-летним опытом</p>
              </div>
            </div>
            
            <div className={styles.section}>
              <h3 className="text-lg font-semibold text-indigo-400 mb-2">Ваш сертификат</h3>
              <p className={styles.text}>
                Вы получили сертификат о прохождении уровня 1. Вы можете скачать его и поделиться своим достижением 
                в социальных сетях.
              </p>
              <div className="flex gap-4 my-4">
                <button className={styles.btnPrimary}>Скачать сертификат</button>
                <button className={styles.btnSecondary}>Поделиться</button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-8 pt-6 border-t border-slate-600">
          <button className={styles.btnSecondary} onClick={handleGoToMain}>
            Вернуться на главную
          </button>
          <button className={styles.btnPrimary} onClick={onComplete}>
            Перейти к уровню 2
          </button>
        </div>
      </div>
    </div>
  );
};

export default Completion; 