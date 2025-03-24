import React from 'react';
import { Dialog } from '@headlessui/react';
import { styles } from '../common/styles';
import MentorTip from '../../../MentorTip';

type ProductMindsetTheoryProps = {
  onComplete: () => void;
};

const ProductMindsetTheory = ({ onComplete }: ProductMindsetTheoryProps) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Продуктовое мышление: основы и принципы</h1>
      
      <section className={styles.section}>
        <h2 className={styles.subheader}>Что такое продуктовое мышление?</h2>
        <p className={styles.text}>
          Продуктовое мышление — это подход к решению проблем, который фокусируется на потребностях 
          пользователей и бизнес-целях, а не сразу на функциях и решениях. Это способность смотреть
          на продукт глазами пользователя, понимать его проблемы и находить наиболее эффективные решения,
          которые создают ценность как для пользователя, так и для бизнеса.
        </p>
        
        <div className={styles.importantBox}>
          <h3 className={styles.importantTitle}>Ключевые аспекты продуктового мышления:</h3>
          <ul className={styles.list}>
            <li>Фокус на <strong>проблемах</strong>, а не на решениях</li>
            <li>Понимание <strong>пользователей</strong> и их потребностей</li>
            <li>Ориентация на <strong>бизнес-цели</strong> и ценность для компании</li>
            <li>Принятие решений на основе <strong>данных</strong></li>
            <li>Итеративный подход и <strong>постоянное улучшение</strong></li>
          </ul>
        </div>
      </section>
      
      <section className={styles.section}>
        <h2 className={styles.subheader}>Принципы продуктового мышления</h2>
        
        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>1. Начинайте с проблемы, а не с решения</h3>
            <p className={styles.cardText}>
              Часто команды стремятся сразу предложить новые функции или решения, не разобравшись
              в сути проблемы. Продуктовое мышление требует сначала глубоко понять проблему:
              кто с ней сталкивается, почему она возникает, насколько она критична для пользователей
              и бизнеса. Только после этого можно приступать к поиску решений.
            </p>
          </div>
          
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>2. Опирайтесь на данные и исследования</h3>
            <p className={styles.cardText}>
              Продуктовые решения должны основываться на реальных данных и исследованиях, а не на
              предположениях или личных предпочтениях. Используйте количественные (метрики, A/B тесты)
              и качественные (интервью, отзывы) данные для принятия обоснованных решений.
            </p>
          </div>
          
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>3. Фокусируйтесь на ценности для пользователя и бизнеса</h3>
            <p className={styles.cardText}>
              Любое решение должно создавать ценность как для пользователей, так и для бизнеса.
              Самое технически совершенное решение может быть бесполезным, если оно не решает
              реальных проблем пользователей или не способствует достижению бизнес-целей.
            </p>
          </div>
          
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>4. Мыслите итеративно</h3>
            <p className={styles.cardText}>
              Продуктовое мышление предполагает постоянное улучшение и итерации. Не стремитесь
              сразу сделать идеальное решение — начните с минимально жизнеспособного продукта (MVP),
              тестируйте его с пользователями и улучшайте на основе полученной обратной связи.
            </p>
          </div>
          
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>5. Учитывайте весь пользовательский опыт</h3>
            <p className={styles.cardText}>
              Продуктовое мышление требует рассматривать весь пользовательский путь и опыт,
              а не отдельные функции. Даже самая полезная функция может не приносить ценности,
              если она плохо вписывается в общий пользовательский путь или сложна в использовании.
            </p>
          </div>
        </div>
      </section>
      
      <section className={styles.section}>
        <h2 className={styles.subheader}>Процесс продуктового мышления</h2>
        
        <div className={styles.processContainer}>
          <div className={styles.processStep}>
            <div className={styles.processNumber}>1</div>
            <h3 className={styles.processTitle}>Выявление проблемы</h3>
            <p className={styles.processText}>
              Определите и четко сформулируйте проблему, которую вы пытаетесь решить.
              Используйте данные и исследования для подтверждения и уточнения проблемы.
            </p>
          </div>
          
          <div className={styles.processStep}>
            <div className={styles.processNumber}>2</div>
            <h3 className={styles.processTitle}>Анализ</h3>
            <p className={styles.processText}>
              Проанализируйте имеющиеся данные, отзывы пользователей, метрики и другую информацию,
              чтобы глубже понять проблему и ее причины. Определите критерии успеха.
            </p>
          </div>
          
          <div className={styles.processStep}>
            <div className={styles.processNumber}>3</div>
            <h3 className={styles.processTitle}>Генерация идей</h3>
            <p className={styles.processText}>
              Разработайте различные варианты решения проблемы. Не ограничивайтесь
              очевидными решениями — рассмотрите разные подходы и альтернативы.
            </p>
          </div>
          
          <div className={styles.processStep}>
            <div className={styles.processNumber}>4</div>
            <h3 className={styles.processTitle}>Оценка и выбор решения</h3>
            <p className={styles.processText}>
              Оцените предложенные решения по заранее определенным критериям. Учитывайте влияние
              на пользователей, техническую сложность, бизнес-ценность и другие факторы.
            </p>
          </div>
          
          <div className={styles.processStep}>
            <div className={styles.processNumber}>5</div>
            <h3 className={styles.processTitle}>Тестирование и итерации</h3>
            <p className={styles.processText}>
              Реализуйте выбранное решение, тестируйте его с пользователями, собирайте метрики
              и обратную связь, и непрерывно улучшайте продукт на основе полученных данных.
            </p>
          </div>
        </div>
      </section>
      
      <section className={styles.section}>
        <h2 className={styles.subheader}>Практическое применение в нашей задаче</h2>
        <p className={styles.text}>
          В контексте нашей задачи по улучшению процесса создания задач в TaskMaster,
          продуктовое мышление требует от нас:
        </p>
        
        <ul className={styles.list}>
          <li>
            <strong>Четко определить проблему:</strong> Высокий уровень отказов в процессе создания задачи
            и длительное время выполнения базовых операций
          </li>
          <li>
            <strong>Проанализировать данные:</strong> Изучить метрики, воронку конверсии, отзывы пользователей,
            данные A/B тестов и провести UX-анализ для выявления конкретных болевых точек
          </li>
          <li>
            <strong>Оценить влияние на бизнес:</strong> Понять, как улучшение процесса создания задач
            повлияет на ключевые метрики бизнеса (удержание, активность, конверсия в платных пользователей)
          </li>
          <li>
            <strong>Разработать решения:</strong> Предложить несколько вариантов решения,
            оценить их по установленным критериям и выбрать оптимальное
          </li>
          <li>
            <strong>Подготовиться к итерациям:</strong> Спланировать, как будем измерять успешность
            выбранного решения и продолжать его улучшать
          </li>
        </ul>
      </section>
      
      <section className={styles.section}>
        <h2 className={styles.subheader}>Почему продуктовое мышление важно?</h2>
        <p className={styles.text}>
          Продуктовое мышление помогает создавать продукты и функциональность, которые действительно
          решают проблемы пользователей и приносят пользу бизнесу. Оно позволяет:
        </p>
        
        <div className={styles.benefitsContainer}>
          <div className={styles.benefit}>
            <span className={styles.icon}>✓</span>
            <p>Сократить затраты на разработку ненужных функций</p>
          </div>
          <div className={styles.benefit}>
            <span className={styles.icon}>✓</span>
            <p>Улучшить пользовательский опыт и удовлетворенность</p>
          </div>
          <div className={styles.benefit}>
            <span className={styles.icon}>✓</span>
            <p>Повысить ключевые метрики (активность, удержание, конверсия)</p>
          </div>
          <div className={styles.benefit}>
            <span className={styles.icon}>✓</span>
            <p>Принимать обоснованные решения на основе данных</p>
          </div>
          <div className={styles.benefit}>
            <span className={styles.icon}>✓</span>
            <p>Сфокусировать команду на наиболее ценных инициативах</p>
          </div>
        </div>
      </section>
      
      <div className={styles.mentorTip}>
        <h3 className={styles.mentorTipTitle}>Совет ментора</h3>
        <p className={styles.mentorTipText}>
          Продуктовое мышление требует практики. В каждой задаче сначала задавайте вопрос:
          "Какую проблему пользователя я пытаюсь решить?" вместо "Какую функцию я хочу добавить?".
          Проверяйте свои предположения данными и не бойтесь пересматривать решения
          на основе новой информации.
        </p>
      </div>
      
      <div className="flex justify-end mt-6">
        <button 
          className={styles.btnPrimary}
          onClick={onComplete}
        >
          Продолжить
        </button>
      </div>
    </div>
  );
};

export default ProductMindsetTheory; 