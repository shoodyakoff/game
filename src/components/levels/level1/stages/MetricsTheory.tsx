import React from 'react';
import { styles } from '../common/styles';

type MetricsTheoryProps = {
  onComplete: () => void;
};

const MetricsTheory = ({ onComplete }: MetricsTheoryProps) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Продуктовые метрики: теория</h1>
      
      <section className={styles.section}>
        <h2 className={styles.subheader}>Роль метрик в продуктовой разработке</h2>
        <p className={styles.text}>
          Метрики — это количественные показатели, которые помогают оценивать различные аспекты продукта. 
          Правильно подобранные метрики позволяют:
        </p>
        <ul className={styles.list}>
          <li>Объективно оценивать успех или неудачу продуктовых решений</li>
          <li>Обнаруживать проблемы до того, как они станут критическими</li>
          <li>Принимать решения на основе данных, а не интуиции</li>
          <li>Определять приоритеты в развитии продукта</li>
          <li>Демонстрировать ценность продукта заинтересованным сторонам</li>
        </ul>
      </section>
      
      <section className={styles.section}>
        <h2 className={styles.subheader}>Типы метрик</h2>
        
        <div className={styles.typesContainer}>
          <div className={styles.typeBlock}>
            <h3 className={styles.typeTitle}>Метрики пользовательской активности</h3>
            <p className={styles.typeDescription}>
              Измеряют, как пользователи взаимодействуют с продуктом.
            </p>
            <ul className={styles.typeList}>
              <li><strong>DAU/MAU (Daily/Monthly Active Users)</strong> — ежедневные/ежемесячные активные пользователи</li>
              <li><strong>Сессии</strong> — количество посещений продукта</li>
              <li><strong>Частота использования</strong> — как часто пользователи возвращаются</li>
              <li><strong>Время в приложении</strong> — сколько времени пользователи проводят с продуктом</li>
            </ul>
          </div>
          
          <div className={styles.typeBlock}>
            <h3 className={styles.typeTitle}>Метрики бизнес-ценности</h3>
            <p className={styles.typeDescription}>
              Измеряют финансовый или стратегический успех продукта.
            </p>
            <ul className={styles.typeList}>
              <li><strong>Выручка</strong> — доход, генерируемый продуктом</li>
              <li><strong>ARPU (Average Revenue Per User)</strong> — средняя выручка на пользователя</li>
              <li><strong>LTV (Lifetime Value)</strong> — пожизненная ценность пользователя</li>
              <li><strong>CAC (Customer Acquisition Cost)</strong> — стоимость привлечения пользователя</li>
              <li><strong>ROI (Return on Investment)</strong> — возврат инвестиций</li>
            </ul>
          </div>
          
          <div className={styles.typeBlock}>
            <h3 className={styles.typeTitle}>Метрики пользовательского опыта</h3>
            <p className={styles.typeDescription}>
              Измеряют удовлетворенность и восприятие продукта пользователями.
            </p>
            <ul className={styles.typeList}>
              <li><strong>NPS (Net Promoter Score)</strong> — индекс потребительской лояльности</li>
              <li><strong>CSAT (Customer Satisfaction)</strong> — удовлетворенность пользователей</li>
              <li><strong>CES (Customer Effort Score)</strong> — оценка усилий пользователя</li>
              <li><strong>Показатель отказов</strong> — процент пользователей, покинувших продукт после первого экрана</li>
            </ul>
          </div>
          
          <div className={styles.typeBlock}>
            <h3 className={styles.typeTitle}>Метрики производительности</h3>
            <p className={styles.typeDescription}>
              Измеряют технические аспекты продукта.
            </p>
            <ul className={styles.typeList}>
              <li><strong>Время загрузки</strong> — скорость загрузки страниц или экранов</li>
              <li><strong>Частота сбоев</strong> — как часто происходят ошибки в продукте</li>
              <li><strong>Доступность</strong> — процент времени, когда продукт работает без сбоев</li>
              <li><strong>Использование ресурсов</strong> — потребление памяти, CPU и других ресурсов</li>
            </ul>
          </div>
        </div>
      </section>
      
      <section className={styles.section}>
        <h2 className={styles.subheader}>AARRR воронка: ключевые этапы продуктовых метрик</h2>
        <p className={styles.text}>
          Фреймворк AARRR (также известный как "Пиратские метрики") помогает структурировать ключевые метрики продукта 
          по основным этапам взаимодействия пользователя с продуктом:
        </p>
        
        <div className={styles.funnelContainer}>
          <div className={styles.funnelStep}>
            <h3 className={styles.funnelStepTitle}>Acquisition (Привлечение)</h3>
            <p className={styles.funnelStepDescription}>
              Как пользователи узнают о вашем продукте?
            </p>
            <ul className={styles.funnelStepMetrics}>
              <li>Количество посетителей</li>
              <li>Источники трафика</li>
              <li>Стоимость привлечения (CAC)</li>
              <li>Конверсия из посетителя в зарегистрированного пользователя</li>
            </ul>
          </div>
          
          <div className={styles.funnelStep}>
            <h3 className={styles.funnelStepTitle}>Activation (Активация)</h3>
            <p className={styles.funnelStepDescription}>
              Получают ли новые пользователи позитивный первый опыт?
            </p>
            <ul className={styles.funnelStepMetrics}>
              <li>Завершение онбординга</li>
              <li>Время до первого целевого действия</li>
              <li>Конверсия в первое ценное действие</li>
            </ul>
          </div>
          
          <div className={styles.funnelStep}>
            <h3 className={styles.funnelStepTitle}>Retention (Удержание)</h3>
            <p className={styles.funnelStepDescription}>
              Возвращаются ли пользователи к вашему продукту?
            </p>
            <ul className={styles.funnelStepMetrics}>
              <li>N-дневное удержание</li>
              <li>Отток пользователей (Churn rate)</li>
              <li>Частота использования</li>
              <li>Когортный анализ</li>
            </ul>
          </div>
          
          <div className={styles.funnelStep}>
            <h3 className={styles.funnelStepTitle}>Revenue (Доход)</h3>
            <p className={styles.funnelStepDescription}>
              Как вы монетизируете свой продукт?
            </p>
            <ul className={styles.funnelStepMetrics}>
              <li>Конверсия в платящих пользователей</li>
              <li>ARPU</li>
              <li>LTV</li>
              <li>MRR/ARR (Monthly/Annual Recurring Revenue)</li>
            </ul>
          </div>
          
          <div className={styles.funnelStep}>
            <h3 className={styles.funnelStepTitle}>Referral (Рекомендации)</h3>
            <p className={styles.funnelStepDescription}>
              Рекомендуют ли пользователи ваш продукт другим?
            </p>
            <ul className={styles.funnelStepMetrics}>
              <li>NPS</li>
              <li>Коэффициент виральности (K-фактор)</li>
              <li>Количество реферальных приглашений</li>
              <li>Конверсия реферальных ссылок</li>
            </ul>
          </div>
        </div>
      </section>
      
      <section className={styles.section}>
        <h2 className={styles.subheader}>Северные звезды и ключевые индикаторы</h2>
        <p className={styles.text}>
          "Северная звезда" (North Star Metric) — это ключевой показатель, который наилучшим образом отражает ценность, 
          которую ваш продукт приносит пользователям, и коррелирует с долгосрочным успехом компании.
        </p>
        
        <div className={styles.northStarExamples}>
          <h3 className={styles.examplesTitle}>Примеры "северных звезд" для разных продуктов:</h3>
          <ul className={styles.examplesList}>
            <li><strong>Spotify</strong>: "Время прослушивания" — отражает ценность музыкального сервиса</li>
            <li><strong>Airbnb</strong>: "Ночи бронирования" — показывает использование платформы</li>
            <li><strong>Facebook</strong>: "Ежедневные активные пользователи" — измеряет охват и активность</li>
            <li><strong>Slack</strong>: "Сообщения на пользователя" — демонстрирует активность коммуникации</li>
            <li><strong>TaskMaster</strong>: "Успешно созданные задачи" — ключевой показатель использования продукта</li>
          </ul>
        </div>
        
        <div className={styles.northStarTips}>
          <h3 className={styles.tipsTitle}>Советы по выбору "северной звезды":</h3>
          <ul className={styles.tipsList}>
            <li>Метрика должна отражать реальную ценность для пользователей</li>
            <li>Она должна коррелировать с долгосрочным ростом и успехом бизнеса</li>
            <li>Должна быть простой для измерения и понимания всей командой</li>
            <li>Лучше сосредоточиться на одной "северной звезде", но поддерживать ее набором вспомогательных метрик</li>
          </ul>
        </div>
      </section>
      
      <section className={styles.section}>
        <h2 className={styles.subheader}>Работа с метриками в контексте TaskMaster</h2>
        <p className={styles.text}>
          Рассмотрим, как разные типы метрик могут применяться для анализа и улучшения процесса создания задач в TaskMaster:
        </p>
        
        <div className={styles.metricsExample}>
          <h3 className={styles.metricsExampleTitle}>Пример анализа с помощью метрик:</h3>
          
          <div className={styles.metricsCard}>
            <h4 className={styles.metricsCardTitle}>Проблема: низкая конверсия в завершение создания задачи</h4>
            
            <div className={styles.metricsCardContent}>
              <div className={styles.metricsSection}>
                <h5 className={styles.metricsSectionTitle}>Метрики для анализа:</h5>
                <ul className={styles.metricsList}>
                  <li><strong>Конверсия по шагам воронки</strong> — где происходит наибольший отток</li>
                  <li><strong>Время на каждом шаге</strong> — какие шаги занимают больше всего времени</li>
                  <li><strong>Количество повторных попыток</strong> — насколько часто пользователи пробуют заново</li>
                  <li><strong>Опросы удовлетворенности</strong> — что говорят пользователи о процессе</li>
                </ul>
              </div>
              
              <div className={styles.metricsSection}>
                <h5 className={styles.metricsSectionTitle}>Гипотезы на основе метрик:</h5>
                <ul className={styles.metricsList}>
                  <li>Форма слишком длинная (высокий отток на шаге заполнения параметров)</li>
                  <li>Интерфейс неинтуитивный (много времени тратится на понимание полей)</li>
                  <li>Система выдает ошибки (много повторных попыток)</li>
                </ul>
              </div>
              
              <div className={styles.metricsSection}>
                <h5 className={styles.metricsSectionTitle}>Целевые метрики для улучшений:</h5>
                <ul className={styles.metricsList}>
                  <li>Увеличить конверсию создания задач с 60% до 80%</li>
                  <li>Сократить среднее время создания задачи с 3 минут до 1.5 минут</li>
                  <li>Увеличить процент пользователей, создающих более одной задачи за сессию</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className={styles.section}>
        <h2 className={styles.subheader}>Лучшие практики работы с метриками</h2>
        
        <div className={styles.bestPractices}>
          <div className={styles.practiceItem}>
            <h3 className={styles.practiceTitle}>Сегментация данных</h3>
            <p className={styles.practiceDescription}>
              Разделяйте метрики по различным сегментам пользователей (новые/опытные, платящие/бесплатные, 
              мобильные/десктопные и т.д.). Разные группы могут демонстрировать разное поведение.
            </p>
          </div>
          
          <div className={styles.practiceItem}>
            <h3 className={styles.practiceTitle}>Когортный анализ</h3>
            <p className={styles.practiceDescription}>
              Отслеживайте метрики для групп пользователей, которые начали использовать продукт в одно и то же время. 
              Это позволяет увидеть, как изменения в продукте влияют на поведение разных поколений пользователей.
            </p>
          </div>
          
          <div className={styles.practiceItem}>
            <h3 className={styles.practiceTitle}>Баланс между количественными и качественными данными</h3>
            <p className={styles.practiceDescription}>
              Метрики показывают ЧТО происходит, но не всегда объясняют ПОЧЕМУ. Дополняйте количественные данные 
              качественными исследованиями (интервью, опросы, юзабилити-тестирование).
            </p>
          </div>
          
          <div className={styles.practiceItem}>
            <h3 className={styles.practiceTitle}>Экспериментирование и A/B тесты</h3>
            <p className={styles.practiceDescription}>
              Используйте метрики для оценки эффективности изменений в продукте через контролируемые эксперименты. 
              Сравнивайте метрики для разных версий, чтобы определить, какие изменения приводят к лучшим результатам.
            </p>
          </div>
          
          <div className={styles.practiceItem}>
            <h3 className={styles.practiceTitle}>Регулярный мониторинг и дашборды</h3>
            <p className={styles.practiceDescription}>
              Создавайте автоматизированные дашборды для отслеживания ключевых метрик в реальном времени. 
              Регулярный мониторинг помогает быстро выявлять проблемы и реагировать на изменения.
            </p>
          </div>
        </div>
      </section>
      
      <section className={styles.section}>
        <div className={styles.mentorTip}>
          <h3 className={styles.mentorTipTitle}>Совет ментора:</h3>
          <p className={styles.mentorTipText}>
            "Не утоните в океане метрик. Выберите небольшой набор ключевых показателей, которые действительно важны 
            для вашего продукта, и сосредоточьтесь на их улучшении. Помните, что каждая метрика — это инструмент 
            для принятия решений, а не самоцель. Всегда задавайте вопрос: 'Какое решение я могу принять на основе этой метрики?'"
          </p>
        </div>
      </section>
      
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

export default MetricsTheory; 