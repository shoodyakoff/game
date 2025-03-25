import React from 'react';
import { styles } from '../common/styles';

type UXAnalysisTheoryProps = {
  onComplete: () => void;
};

const UXAnalysisTheory = ({ onComplete }: UXAnalysisTheoryProps) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>UX-анализ: теория</h1>
      
      <section className={styles.section}>
        <h2 className={styles.subheader}>Что такое UX-анализ?</h2>
        <p className={styles.text}>
          UX-анализ (анализ пользовательского опыта) — это процесс изучения взаимодействия пользователей
          с продуктом с целью выявления проблемных мест, понимания потребностей пользователей и
          разработки решений для улучшения их опыта взаимодействия с продуктом.
        </p>
        <p className={styles.text}>
          Продуктовый менеджер активно использует UX-анализ для принятия обоснованных решений о развитии продукта,
          приоритизации задач и оценки эффективности внесенных изменений.
        </p>
      </section>
      
      <section className={styles.section}>
        <h2 className={styles.subheader}>Ключевые методы UX-анализа</h2>
        
        <div className={styles.uxMethod}>
          <h3 className={styles.uxMethodTitle}>1. Пользовательские интервью</h3>
          <p className={styles.uxMethodDescription}>
            Глубинные беседы с пользователями для выявления их потребностей, проблем, ожиданий и мнений о продукте.
          </p>
          <div className={styles.uxMethodDetails}>
            <h4 className={styles.uxMethodSubtitle}>Когда применять:</h4>
            <ul className={styles.list}>
              <li>На ранних этапах разработки для понимания потребностей пользователей</li>
              <li>После запуска для получения обратной связи и выявления проблем</li>
              <li>При планировании новых функций для оценки их востребованности</li>
            </ul>
            
            <h4 className={styles.uxMethodSubtitle}>Ключевые принципы:</h4>
            <ul className={styles.list}>
              <li>Задавайте открытые вопросы, избегайте наводящих</li>
              <li>Фокусируйтесь на реальном опыте пользователя, а не на гипотетических сценариях</li>
              <li>Спрашивайте "почему" для выявления глубинных мотивов и потребностей</li>
              <li>Записывайте интервью для последующего анализа и цитирования</li>
            </ul>
          </div>
        </div>
        
        <div className={styles.uxMethod}>
          <h3 className={styles.uxMethodTitle}>2. Анализ пользовательских путей</h3>
          <p className={styles.uxMethodDescription}>
            Изучение последовательности действий, которые пользователь совершает для достижения своей цели в продукте,
            с указанием точек взаимодействия, проблемных мест и эмоций пользователя.
          </p>
          <div className={styles.uxMethodDetails}>
            <h4 className={styles.uxMethodSubtitle}>Когда применять:</h4>
            <ul className={styles.list}>
              <li>При оптимизации существующих процессов</li>
              <li>Для выявления узких мест и точек отказа</li>
              <li>При планировании редизайна ключевых функций</li>
            </ul>
            
            <h4 className={styles.uxMethodSubtitle}>Ключевые принципы:</h4>
            <ul className={styles.list}>
              <li>Рассматривайте путь пользователя от начала до конца</li>
              <li>Идентифицируйте все точки контакта, включая не только UI, но и email, уведомления и т.д.</li>
              <li>Анализируйте эмоции пользователя на каждом этапе</li>
              <li>Оценивайте длительность каждого шага и общее время выполнения задачи</li>
            </ul>
          </div>
        </div>
        
        <div className={styles.uxMethod}>
          <h3 className={styles.uxMethodTitle}>3. Юзабилити-тестирование</h3>
          <p className={styles.uxMethodDescription}>
            Метод оценки удобства использования продукта, при котором реальные пользователи выполняют
            заданные сценарии, а исследователи наблюдают за их действиями и фиксируют проблемы.
          </p>
          <div className={styles.uxMethodDetails}>
            <h4 className={styles.uxMethodSubtitle}>Когда применять:</h4>
            <ul className={styles.list}>
              <li>Перед запуском новых функций</li>
              <li>При выявлении проблем с конверсией или вовлеченностью</li>
              <li>Для сравнения нескольких вариантов дизайна</li>
            </ul>
            
            <h4 className={styles.uxMethodSubtitle}>Ключевые принципы:</h4>
            <ul className={styles.list}>
              <li>Подбирайте участников тестирования, соответствующих вашей целевой аудитории</li>
              <li>Создавайте реалистичные задачи, которые пользователи выполняют в реальной жизни</li>
              <li>Просите пользователей думать вслух во время выполнения задач</li>
              <li>Фиксируйте объективные метрики: время выполнения, успешность, количество ошибок</li>
              <li>Анализируйте как успехи, так и неудачи пользователей</li>
            </ul>
          </div>
        </div>
        
        <div className={styles.uxMethod}>
          <h3 className={styles.uxMethodTitle}>4. Анализ метрик и данных</h3>
          <p className={styles.uxMethodDescription}>
            Изучение количественных показателей использования продукта для выявления паттернов поведения,
            проблемных мест и оценки эффективности изменений.
          </p>
          <div className={styles.uxMethodDetails}>
            <h4 className={styles.uxMethodSubtitle}>Когда применять:</h4>
            <ul className={styles.list}>
              <li>Для выявления проблемных мест в пользовательских путях</li>
              <li>При оценке эффективности внесенных изменений</li>
              <li>Для приоритизации проблем на основе их масштаба и влияния</li>
            </ul>
            
            <h4 className={styles.uxMethodSubtitle}>Ключевые метрики:</h4>
            <ul className={styles.list}>
              <li>Конверсия на ключевых этапах</li>
              <li>Время выполнения задач</li>
              <li>Количество ошибок и повторных попыток</li>
              <li>Частота использования функций</li>
              <li>Показатели вовлеченности (DAU/MAU, частота возвращения)</li>
            </ul>
          </div>
        </div>
        
        <div className={styles.uxMethod}>
          <h3 className={styles.uxMethodTitle}>5. Карты эмпатии</h3>
          <p className={styles.uxMethodDescription}>
            Инструмент для визуализации и систематизации знаний о пользователях,
            включая их мысли, чувства, поведение и мотивации.
          </p>
          <div className={styles.uxMethodDetails}>
            <h4 className={styles.uxMethodSubtitle}>Когда применять:</h4>
            <ul className={styles.list}>
              <li>При создании персонажей</li>
              <li>Для лучшего понимания потребностей различных сегментов пользователей</li>
              <li>При презентации результатов исследований команде</li>
            </ul>
            
            <h4 className={styles.uxMethodSubtitle}>Ключевые элементы карты эмпатии:</h4>
            <ul className={styles.list}>
              <li>Что пользователь видит (окружение, предложения конкурентов)</li>
              <li>Что пользователь слышит (мнения друзей, коллег, экспертов)</li>
              <li>Что пользователь думает и чувствует (страхи, стремления, ценности)</li>
              <li>Что пользователь говорит и делает (публичное поведение)</li>
              <li>Боли и проблемы пользователя</li>
              <li>Потребности и желания пользователя</li>
            </ul>
          </div>
        </div>
      </section>
      
      <section className={styles.section}>
        <h2 className={styles.subheader}>Практическое применение UX-анализа в TaskMaster</h2>
        
        <p className={styles.text}>
          В контексте проблемы с созданием задач в TaskMaster, мы можем использовать различные методы UX-анализа:
        </p>
        
        <div className="bg-slate-700 p-4 rounded-lg border border-slate-600 mb-6">
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">Анализ пользовательского пути создания задачи</h3>
          <p className={styles.text}>
            Мы можем детально изучить все шаги, которые пользователь проходит от момента нажатия кнопки 
            "Создать задачу" до успешного завершения процесса. На каждом шаге мы анализируем:
          </p>
          <ul className={styles.list}>
            <li>Время, затрачиваемое пользователями</li>
            <li>Процент пользователей, переходящих к следующему шагу (конверсия)</li>
            <li>Типичные ошибки и проблемы</li>
            <li>Эмоциональное состояние пользователя</li>
          </ul>
          <p className={styles.text}>
            Это поможет нам выявить конкретные шаги, на которых пользователи сталкиваются с наибольшими трудностями.
          </p>
        </div>
        
        <div className="bg-slate-700 p-4 rounded-lg border border-slate-600 mb-6">
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">Юзабилити-тестирование с различными сегментами пользователей</h3>
          <p className={styles.text}>
            Мы можем провести тестирование с представителями разных сегментов (новые, опытные, мобильные пользователи), 
            чтобы понять, с какими конкретными проблемами сталкивается каждый сегмент при создании задач. 
            Это поможет нам разработать решения, учитывающие потребности различных групп пользователей.
          </p>
        </div>
        
        <div className="bg-slate-700 p-4 rounded-lg border border-slate-600 mb-6">
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">Анализ метрик и воронки конверсии</h3>
          <p className={styles.text}>
            Изучая метрики по каждому шагу создания задачи, мы можем количественно оценить масштаб проблем 
            и их влияние на бизнес-показатели. Например, мы можем узнать, что 30% пользователей отказываются 
            от создания задачи на втором шаге (указание расширенных параметров), что приводит к потере 
            потенциальных активных пользователей.
          </p>
        </div>
      </section>
      
      <div className="bg-yellow-900/30 border-l-4 border-yellow-500 p-4 rounded-r-md my-6 relative">
        <h3 className="font-bold text-yellow-500 mb-2">Совет ментора:</h3>
        <p className={styles.text}>
          UX-анализ наиболее эффективен, когда вы сочетаете различные методы. Количественные данные (метрики) 
          говорят о масштабе проблем, а качественные исследования (интервью, юзабилити-тестирование) 
          помогают понять причины их возникновения. Не полагайтесь только на один источник информации — 
          триангулируйте данные из разных источников для получения более полной картины.
        </p>
      </div>

      <button 
        className={styles.btnPrimary}
        onClick={onComplete}
      >
        Продолжить
      </button>
    </div>
  );
};

export default UXAnalysisTheory; 