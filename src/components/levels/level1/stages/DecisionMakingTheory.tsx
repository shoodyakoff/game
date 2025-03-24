import React from 'react';
import { styles } from '../common/styles';

type DecisionMakingTheoryProps = {
  onComplete: () => void;
};

const DecisionMakingTheory = ({ onComplete }: DecisionMakingTheoryProps) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Принятие решений в продуктовой разработке</h1>
      
      <section className={styles.section}>
        <h2 className={styles.subheader}>Роль принятия решений в работе продакт-менеджера</h2>
        <p className={styles.text}>
          Продакт-менеджер ежедневно принимает десятки решений, которые влияют на успех продукта,
          удовлетворенность пользователей и достижение бизнес-целей. Умение принимать обоснованные и 
          взвешенные решения — ключевой навык успешного продакт-менеджера.
        </p>
        
        <div className={styles.importantBox}>
          <h3 className={styles.importantTitle}>Почему качество решений имеет критическое значение?</h3>
          <ul className={styles.list}>
            <li>Ресурсы команды ограничены, и каждое решение определяет, на что они будут потрачены</li>
            <li>Неверные решения могут привести к потере пользователей и доходов</li>
            <li>Качественные решения создают конкурентное преимущество и ускоряют развитие продукта</li>
            <li>Каждое решение имеет долгосрочные последствия для продукта и бизнеса</li>
            <li>Решения продакт-менеджера влияют на работу многих команд и стейкхолдеров</li>
          </ul>
        </div>
      </section>
      
      <section className={styles.section}>
        <h2 className={styles.subheader}>Типы решений в продуктовой разработке</h2>
        
        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Стратегические решения</h3>
            <p className={styles.cardText}>
              Определяют долгосрочное направление развития продукта, влияют на бизнес-модель, 
              позиционирование и основную ценность для пользователей.
            </p>
            <div className={styles.exampleBox}>
              <p className={styles.exampleTitle}>Примеры:</p>
              <ul className={styles.exampleList}>
                <li>На какие сегменты пользователей сфокусироваться</li>
                <li>Какую бизнес-модель выбрать</li>
                <li>Какую проблему решать с помощью продукта</li>
                <li>Как позиционировать продукт на рынке</li>
              </ul>
            </div>
          </div>
          
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Тактические решения</h3>
            <p className={styles.cardText}>
              Определяют, как реализовать стратегию в краткосрочной перспективе, какие функции 
              разрабатывать, какие проблемы пользователей решать в первую очередь.
            </p>
            <div className={styles.exampleBox}>
              <p className={styles.exampleTitle}>Примеры:</p>
              <ul className={styles.exampleList}>
                <li>Какие функции включить в следующий релиз</li>
                <li>Какие проблемы пользователей решать в приоритете</li>
                <li>Какие метрики улучшать в первую очередь</li>
                <li>Как распределить ресурсы между проектами</li>
              </ul>
            </div>
          </div>
          
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>Операционные решения</h3>
            <p className={styles.cardText}>
              Касаются ежедневных действий команды, деталей реализации функций, дизайна интерфейса 
              и взаимодействия с пользователями.
            </p>
            <div className={styles.exampleBox}>
              <p className={styles.exampleTitle}>Примеры:</p>
              <ul className={styles.exampleList}>
                <li>Какой дизайн выбрать для конкретного элемента интерфейса</li>
                <li>Как реагировать на отзывы пользователей</li>
                <li>Как оптимизировать конкретный процесс в продукте</li>
                <li>Какую технологию использовать для решения конкретной задачи</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <section className={styles.section}>
        <h2 className={styles.subheader}>Процесс принятия решений</h2>
        
        <div className={styles.processContainer}>
          <div className={styles.processStep}>
            <div className={styles.processNumber}>1</div>
            <h3 className={styles.processTitle}>Определение проблемы</h3>
            <p className={styles.processText}>
              Четко сформулируйте проблему, которую нужно решить, и убедитесь, что она действительно
              важна для пользователей и бизнеса. Определите критерии успешного решения.
            </p>
          </div>
          
          <div className={styles.processStep}>
            <div className={styles.processNumber}>2</div>
            <h3 className={styles.processTitle}>Сбор данных и анализ</h3>
            <p className={styles.processText}>
              Соберите все доступные данные, которые могут помочь в принятии решения: метрики,
              отзывы пользователей, экспертные мнения, результаты исследований и тестирований.
            </p>
          </div>
          
          <div className={styles.processStep}>
            <div className={styles.processNumber}>3</div>
            <h3 className={styles.processTitle}>Генерация альтернатив</h3>
            <p className={styles.processText}>
              Разработайте несколько альтернативных решений проблемы. Стремитесь к разнообразию
              подходов, чтобы охватить различные аспекты проблемы.
            </p>
          </div>
          
          <div className={styles.processStep}>
            <div className={styles.processNumber}>4</div>
            <h3 className={styles.processTitle}>Оценка альтернатив</h3>
            <p className={styles.processText}>
              Оцените каждую альтернативу по заранее определенным критериям, учитывая потенциальное
              влияние на пользователей, бизнес, технические аспекты и ресурсы.
            </p>
          </div>
          
          <div className={styles.processStep}>
            <div className={styles.processNumber}>5</div>
            <h3 className={styles.processTitle}>Выбор решения</h3>
            <p className={styles.processText}>
              Выберите оптимальное решение на основе анализа и оценки. Учитывайте не только
              краткосрочные выгоды, но и долгосрочные последствия решения.
            </p>
          </div>
          
          <div className={styles.processStep}>
            <div className={styles.processNumber}>6</div>
            <h3 className={styles.processTitle}>Реализация и мониторинг</h3>
            <p className={styles.processText}>
              Реализуйте выбранное решение и внимательно отслеживайте его эффективность. Будьте
              готовы корректировать курс, если результаты не соответствуют ожиданиям.
            </p>
          </div>
        </div>
      </section>
      
      <section className={styles.section}>
        <h2 className={styles.subheader}>Ключевые принципы принятия решений</h2>
        
        <div className={styles.principlesGrid}>
          <div className={styles.principle}>
            <h3 className={styles.principleTitle}>Принцип 1: Опирайтесь на данные</h3>
            <p className={styles.principleText}>
              Используйте количественные и качественные данные для обоснования решений. Данные
              помогают сделать решения объективными и снижают риск ошибок, основанных на интуиции.
            </p>
          </div>
          
          <div className={styles.principle}>
            <h3 className={styles.principleTitle}>Принцип 2: Учитывайте долгосрочную перспективу</h3>
            <p className={styles.principleText}>
              Оценивайте не только краткосрочные результаты, но и долгосрочные последствия решений.
              Избегайте решений, которые дают быстрый результат, но создают проблемы в будущем.
            </p>
          </div>
          
          <div className={styles.principle}>
            <h3 className={styles.principleTitle}>Принцип 3: Привлекайте различные точки зрения</h3>
            <p className={styles.principleText}>
              Консультируйтесь с различными стейкхолдерами и экспертами перед принятием решений.
              Многообразие точек зрения помогает выявить потенциальные проблемы и найти лучшие решения.
            </p>
          </div>
          
          <div className={styles.principle}>
            <h3 className={styles.principleTitle}>Принцип 4: Балансируйте потребности пользователей и бизнеса</h3>
            <p className={styles.principleText}>
              Стремитесь найти решения, которые удовлетворяют потребности пользователей и одновременно
              способствуют достижению бизнес-целей. Избегайте решений, которые жертвуют одним ради другого.
            </p>
          </div>
          
          <div className={styles.principle}>
            <h3 className={styles.principleTitle}>Принцип 5: Будьте готовы к итерациям</h3>
            <p className={styles.principleText}>
              Принимайте решения с пониманием, что они могут потребовать корректировки. Внедряйте
              механизмы обратной связи и будьте готовы к итерациям на основе полученных результатов.
            </p>
          </div>
          
          <div className={styles.principle}>
            <h3 className={styles.principleTitle}>Принцип 6: Учитывайте технические ограничения</h3>
            <p className={styles.principleText}>
              Принимайте во внимание технические ограничения и возможности команды при принятии решений.
              Консультируйтесь с техническими экспертами для оценки реализуемости решений.
            </p>
          </div>
        </div>
      </section>
      
      <section className={styles.section}>
        <h2 className={styles.subheader}>Инструменты для принятия решений</h2>
        
        <div className={styles.toolsGrid}>
          <div className={styles.tool}>
            <h3 className={styles.toolTitle}>Матрица принятия решений</h3>
            <p className={styles.toolDescription}>
              Инструмент для сравнения нескольких альтернатив по различным критериям с использованием
              весовых коэффициентов для определения важности каждого критерия.
            </p>
            <p className={styles.toolUseCase}>
              <strong>Когда использовать:</strong> При наличии нескольких альтернатив и многих критериев
              оценки, особенно если некоторые критерии важнее других.
            </p>
          </div>
          
          <div className={styles.tool}>
            <h3 className={styles.toolTitle}>ICE Scoring (Impact, Confidence, Ease)</h3>
            <p className={styles.toolDescription}>
              Метод оценки идей по трем параметрам: воздействие (Impact), уверенность (Confidence)
              и простота реализации (Ease). Каждый параметр оценивается от 1 до 10.
            </p>
            <p className={styles.toolUseCase}>
              <strong>Когда использовать:</strong> Для быстрой приоритизации идей или задач, особенно
              когда нужно выбрать из большого числа альтернатив.
            </p>
          </div>
          
          <div className={styles.tool}>
            <h3 className={styles.toolTitle}>RICE Framework (Reach, Impact, Confidence, Effort)</h3>
            <p className={styles.toolDescription}>
              Расширенная версия ICE с добавлением параметра охвата (Reach). Позволяет учесть, сколько
              пользователей затронет потенциальное решение.
            </p>
            <p className={styles.toolUseCase}>
              <strong>Когда использовать:</strong> Для приоритизации функций и улучшений продукта,
              особенно когда важно учитывать масштаб воздействия на пользователей.
            </p>
          </div>
          
          <div className={styles.tool}>
            <h3 className={styles.toolTitle}>Cost-Benefit Analysis (Анализ затрат и выгод)</h3>
            <p className={styles.toolDescription}>
              Метод оценки альтернатив путем сравнения ожидаемых затрат (ресурсов, времени, денег)
              и потенциальных выгод (финансовых и нефинансовых).
            </p>
            <p className={styles.toolUseCase}>
              <strong>Когда использовать:</strong> Для оценки экономической эффективности решений,
              особенно когда важно обосновать инвестиции в проект.
            </p>
          </div>
          
          <div className={styles.tool}>
            <h3 className={styles.toolTitle}>A/B тестирование</h3>
            <p className={styles.toolDescription}>
              Метод сравнения двух версий продукта (A и B) путем показа их разным группам пользователей
              и измерения ключевых метрик для определения более эффективной версии.
            </p>
            <p className={styles.toolUseCase}>
              <strong>Когда использовать:</strong> Для принятия решений о дизайне интерфейса, функциях
              или процессах на основе реального поведения пользователей, а не предположений.
            </p>
          </div>
          
          <div className={styles.tool}>
            <h3 className={styles.toolTitle}>Анализ пяти "почему"</h3>
            <p className={styles.toolDescription}>
              Метод глубокого анализа проблемы путем последовательного задания вопроса "почему?"
              для выявления корневой причины проблемы.
            </p>
            <p className={styles.toolUseCase}>
              <strong>Когда использовать:</strong> Для выявления корневой причины проблемы перед
              принятием решения о том, как ее решать.
            </p>
          </div>
        </div>
      </section>
      
      <section className={styles.section}>
        <h2 className={styles.subheader}>Применение в нашей задаче</h2>
        <p className={styles.text}>
          В контексте улучшения процесса создания задач в TaskMaster, принятие решений включает:
        </p>
        
        <ul className={styles.list}>
          <li>
            <strong>Определение проблемы:</strong> Низкая конверсия и высокий отток пользователей в процессе
            создания задач, особенно на шаге настройки расширенных параметров
          </li>
          <li>
            <strong>Сбор данных:</strong> Анализ метрик конверсии, времени заполнения, отзывов пользователей,
            результатов A/B тестов и сравнения с конкурентами
          </li>
          <li>
            <strong>Генерация альтернатив:</strong> Разработка нескольких подходов к решению проблемы
            (упрощение формы, пошаговый мастер, автоподсказки и др.)
          </li>
          <li>
            <strong>Оценка альтернатив:</strong> Сравнение решений по критериям воздействия на конверсию,
            удовлетворенность пользователей, сложность реализации, влияние на бизнес-показатели
          </li>
          <li>
            <strong>Выбор решения:</strong> Определение оптимального подхода к улучшению процесса создания
            задач на основе анализа и оценки альтернатив
          </li>
        </ul>
      </section>
      
      <div className={styles.mentorTip}>
        <h3 className={styles.mentorTipTitle}>Совет ментора</h3>
        <p className={styles.mentorTipText}>
          При принятии решений избегайте когнитивных искажений, таких как подтверждение собственной
          точки зрения или эффект IKEA (переоценка ценности собственных идей). Всегда задавайте себе вопрос:
          "Какие данные могут опровергнуть мою гипотезу?". Это поможет сделать решения более объективными.
          Также помните, что иногда лучшее решение — не принимать поспешных решений. Если данных недостаточно,
          сначала соберите больше информации с помощью исследований или небольших экспериментов.
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

export default DecisionMakingTheory; 