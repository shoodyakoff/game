import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '../../../../components/common/ui/Button';
import { Card } from '../../../../components/common/ui/Card';
import { Badge } from '../../../../components/common/Badge';
import { CharacterItem } from '../../../../components/common/CharacterItem';
import { useCharacter } from '../../../../hooks/useCharacter';
import { useLevelProgress } from '../../../../hooks/useLevelProgress';
import styles from './Completion.module.css';

interface CompletionProps {
  onComplete: () => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

interface LearningResource {
  title: string;
  description: string;
  url: string;
  type: 'article' | 'video' | 'book';
}

interface Reward {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'item' | 'badge' | 'achievement';
}

const LEVEL1_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'product_thinker',
    title: 'Продуктовый мыслитель',
    description: 'Освоили основы продуктового мышления',
    icon: '🧠'
  },
  {
    id: 'ux_master',
    title: 'UX-мастер',
    description: 'Научились анализировать пользовательский опыт',
    icon: '👥'
  },
  {
    id: 'metrics_guru',
    title: 'Гуру метрик',
    description: 'Освоили работу с продуктовыми метриками',
    icon: '📊'
  },
  {
    id: 'decision_maker',
    title: 'Принимающий решения',
    description: 'Научились принимать обоснованные продуктовые решения',
    icon: '⚖️'
  }
];

const LEVEL1_RESOURCES: LearningResource[] = [
  {
    title: 'Продуктовое мышление',
    description: 'Статья о том, как развивать продуктовое мышление',
    url: 'https://example.com/product-thinking',
    type: 'article'
  },
  {
    title: 'UX-исследования',
    description: 'Видео о методах UX-исследований',
    url: 'https://example.com/ux-research',
    type: 'video'
  },
  {
    title: 'Метрики в продукте',
    description: 'Книга о ключевых метриках в продукте',
    url: 'https://example.com/product-metrics',
    type: 'book'
  },
  {
    title: 'Принятие решений',
    description: 'Статья о фреймворках принятия решений',
    url: 'https://example.com/decision-making',
    type: 'article'
  }
];

const LEVEL1_REWARDS: Reward[] = [
  {
    id: 'product_hat',
    title: 'Шляпа продакта',
    description: 'Стильная шляпа настоящего продакт-менеджера',
    icon: '🎩',
    type: 'item'
  },
  {
    id: 'ux_glasses',
    title: 'Очки UX-исследователя',
    description: 'Помогают лучше видеть потребности пользователей',
    icon: '👓',
    type: 'item'
  },
  {
    id: 'metrics_watch',
    title: 'Часы аналитика',
    description: 'Показывают время и ключевые метрики',
    icon: '⌚',
    type: 'item'
  },
  {
    id: 'decision_compass',
    title: 'Компас решений',
    description: 'Указывает путь к правильным решениям',
    icon: '🧭',
    type: 'item'
  }
];

export const Completion: React.FC<CompletionProps> = ({ onComplete }) => {
  const router = useRouter();
  const { character, addItem } = useCharacter();
  const { progress, addAchievement } = useLevelProgress();
  const [currentSection, setCurrentSection] = useState<'achievements' | 'rewards' | 'resources'>('achievements');

  useEffect(() => {
    // Добавляем достижения и награды при первом рендере
    LEVEL1_ACHIEVEMENTS.forEach(achievement => {
      addAchievement(achievement.id);
    });

    LEVEL1_REWARDS.forEach(reward => {
      if (reward.type === 'item') {
        addItem(reward.id);
      }
    });
  }, [addAchievement, addItem]);

  const handleReturnToLevels = () => {
    router.push('/levels');
  };

  const renderContent = () => {
    switch (currentSection) {
      case 'achievements':
        return (
          <div className={styles.achievements}>
            {LEVEL1_ACHIEVEMENTS.map((achievement) => (
              <Card key={achievement.id} className={styles.achievementCard}>
                <div className={styles.achievementIcon}>{achievement.icon}</div>
                <h3>{achievement.title}</h3>
                <p>{achievement.description}</p>
              </Card>
            ))}
          </div>
        );
      case 'rewards':
        return (
          <div className={styles.rewards}>
            {LEVEL1_REWARDS.map((reward) => (
              <Card key={reward.id} className={styles.rewardCard}>
                <div className={styles.rewardIcon}>{reward.icon}</div>
                <h3>{reward.title}</h3>
                <p>{reward.description}</p>
              </Card>
            ))}
          </div>
        );
      case 'resources':
        return (
          <div className={styles.resources}>
            {LEVEL1_RESOURCES.map((resource, index) => (
              <Card key={index} className={styles.resourceCard}>
                <div className={styles.resourceIcon}>
                  {resource.type === 'article' ? '📄' : resource.type === 'video' ? '🎥' : '📚'}
                </div>
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                  Открыть
                </a>
              </Card>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.completion}>
      <div className={styles.container}>
        <h1 className={styles.title}>Поздравляем!</h1>
        <p className={styles.subtitle}>
          Вы успешно завершили первый уровень и освоили основы продуктового мышления!
        </p>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statValue}>100%</span>
            <span className={styles.statLabel}>Прогресс</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{LEVEL1_ACHIEVEMENTS.length}</span>
            <span className={styles.statLabel}>Достижения</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statValue}>{LEVEL1_REWARDS.length}</span>
            <span className={styles.statLabel}>Награды</span>
          </div>
        </div>

        <div className={styles.tabs}>
          <Button
            variant={currentSection === 'achievements' ? 'primary' : 'secondary'}
            onClick={() => setCurrentSection('achievements')}
          >
            Достижения
          </Button>
          <Button
            variant={currentSection === 'rewards' ? 'primary' : 'secondary'}
            onClick={() => setCurrentSection('rewards')}
          >
            Награды
          </Button>
          <Button
            variant={currentSection === 'resources' ? 'primary' : 'secondary'}
            onClick={() => setCurrentSection('resources')}
          >
            Полезные материалы
          </Button>
        </div>

        <div className={styles.content}>
          {renderContent()}
        </div>

        <div className={styles.actions}>
          <Button onClick={handleReturnToLevels} variant="primary">
            Вернуться к списку уровней
          </Button>
        </div>
      </div>
    </div>
  );
}; 