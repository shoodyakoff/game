import React from 'react';
import { styles } from '../common/styles';

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
        
        <div className="bg-indigo-900/30 border border-indigo-800 rounded-lg p-4 mt-4 mb-6">
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">Ключевые аспекты продуктового мышления:</h3>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="bg-slate-700 p-5 rounded-lg border border-slate-600">
            <h3 className="text-lg font-semibold text-indigo-400 mb-3">1. Начинайте с проблемы, а не с решения</h3>
            <p className={styles.text}>
              Часто команды стремятся сразу предложить новые функции или решения, не разобравшись
              в сути проблемы. Продуктовое мышление требует сначала глубоко понять проблему:
              кто с ней сталкивается, почему она возникает, насколько она критична для пользователей
              и бизнеса. Только после этого можно приступать к поиску решений.
            </p>
          </div>
          
          <div className="bg-slate-700 p-5 rounded-lg border border-slate-600">
            <h3 className="text-lg font-semibold text-indigo-400 mb-3">2. Опирайтесь на данные и исследования</h3>
            <p className={styles.text}>
              Продуктовые решения должны основываться на реальных данных и исследованиях, а не на
              предположениях или личных предпочтениях. Используйте количественные (метрики, A/B тесты)
              и качественные (интервью, отзывы) данные для принятия обоснованных решений.
            </p>
          </div>
          
          <div className="bg-slate-700 p-5 rounded-lg border border-slate-600">
            <h3 className="text-lg font-semibold text-indigo-400 mb-3">3. Фокусируйтесь на ценности для пользователя и бизнеса</h3>
            <p className={styles.text}>
              Любое решение должно создавать ценность как для пользователей, так и для бизнеса.
              Самое технически совершенное решение может быть бесполезным, если оно не решает
              реальных проблем пользователей или не способствует достижению бизнес-целей.
            </p>
          </div>
          
          <div className="bg-slate-700 p-5 rounded-lg border border-slate-600">
            <h3 className="text-lg font-semibold text-indigo-400 mb-3">4. Мыслите итеративно</h3>
            <p className={styles.text}>
              Продуктовое мышление предполагает постоянное улучшение и итерации. Не стремитесь
              сразу сделать идеальное решение — начните с минимально жизнеспособного продукта (MVP),
              тестируйте его с пользователями и улучшайте на основе полученной обратной связи.
            </p>
          </div>
          
          <div className="bg-slate-700 p-5 rounded-lg border border-slate-600">
            <h3 className="text-lg font-semibold text-indigo-400 mb-3">5. Учитывайте весь пользовательский опыт</h3>
            <p className={styles.text}>
              Продуктовое мышление требует рассматривать весь пользовательский путь и опыт,
              а не отдельные функции. Даже самая полезная функция может не приносить ценности,
              если она плохо вписывается в общий пользовательский путь или сложна в использовании.
            </p>
          </div>
        </div>
      </section>
      
      <section className={styles.section}>
        <h2 className={styles.subheader}>Процесс продуктового мышления</h2>
        
        <div className="flex flex-col space-y-6 my-6">
          <div className="flex flex-row items-start bg-slate-700 p-4 rounded-lg">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-4">1</div>
            <div>
              <h3 className="text-lg font-semibold text-indigo-400 mb-2">Выявление проблемы</h3>
              <p className={styles.text}>
                Определите и четко сформулируйте проблему, которую вы пытаетесь решить.
                Используйте данные и исследования для подтверждения и уточнения проблемы.
              </p>
            </div>
          </div>
          
          <div className="flex flex-row items-start bg-slate-700 p-4 rounded-lg">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-4">2</div>
            <div>
              <h3 className="text-lg font-semibold text-indigo-400 mb-2">Анализ</h3>
              <p className={styles.text}>
                Проанализируйте имеющиеся данные, отзывы пользователей, метрики и другую информацию,
                чтобы глубже понять проблему и ее причины. Определите критерии успеха.
              </p>
            </div>
          </div>
          
          <div className="flex flex-row items-start bg-slate-700 p-4 rounded-lg">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-4">3</div>
            <div>
              <h3 className="text-lg font-semibold text-indigo-400 mb-2">Генерация идей</h3>
              <p className={styles.text}>
                Разработайте различные варианты решения проблемы. Не ограничивайтесь
                очевидными решениями — рассмотрите разные подходы и альтернативы.
              </p>
            </div>
          </div>
          
          <div className="flex flex-row items-start bg-slate-700 p-4 rounded-lg">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-4">4</div>
            <div>
              <h3 className="text-lg font-semibold text-indigo-400 mb-2">Оценка и выбор решения</h3>
              <p className={styles.text}>
                Оцените предложенные решения по заранее определенным критериям. Учитывайте влияние
                на пользователей, техническую сложность, бизнес-ценность и другие факторы.
              </p>
            </div>
          </div>
          
          <div className="flex flex-row items-start bg-slate-700 p-4 rounded-lg">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-4">5</div>
            <div>
              <h3 className="text-lg font-semibold text-indigo-400 mb-2">Тестирование и итерации</h3>
              <p className={styles.text}>
                Реализуйте выбранное решение, тестируйте его с пользователями, собирайте метрики
                и обратную связь, и непрерывно улучшайте продукт на основе полученных данных.
              </p>
            </div>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="flex items-center bg-slate-700 p-3 rounded-lg">
            <span className="text-green-400 font-bold mr-3 text-xl">✓</span>
            <p>Сократить затраты на разработку ненужных функций</p>
          </div>
          <div className="flex items-center bg-slate-700 p-3 rounded-lg">
            <span className="text-green-400 font-bold mr-3 text-xl">✓</span>
            <p>Улучшить пользовательский опыт и удовлетворенность</p>
          </div>
          <div className="flex items-center bg-slate-700 p-3 rounded-lg">
            <span className="text-green-400 font-bold mr-3 text-xl">✓</span>
            <p>Повысить ключевые метрики (активность, удержание, конверсия)</p>
          </div>
          <div className="flex items-center bg-slate-700 p-3 rounded-lg">
            <span className="text-green-400 font-bold mr-3 text-xl">✓</span>
            <p>Принимать обоснованные решения на основе данных</p>
          </div>
          <div className="flex items-center bg-slate-700 p-3 rounded-lg">
            <span className="text-green-400 font-bold mr-3 text-xl">✓</span>
            <p>Сфокусировать команду на наиболее ценных инициативах</p>
          </div>
        </div>
      </section>
      
      <div className="bg-indigo-900/30 border border-indigo-800 rounded-lg p-4 my-6">
        <h3 className="text-lg font-semibold text-indigo-400 mb-2">Совет ментора</h3>
        <p className={styles.text}>
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