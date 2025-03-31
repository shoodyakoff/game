import { useState, useCallback } from 'react';

interface LevelProgress {
  achievements: string[];
  completedStages: string[];
  score: number;
}

export const useLevelProgress = () => {
  const [progress, setProgress] = useState<LevelProgress>({
    achievements: [],
    completedStages: [],
    score: 0
  });

  const addAchievement = useCallback((achievementId: string) => {
    setProgress(prev => ({
      ...prev,
      achievements: [...new Set([...prev.achievements, achievementId])]
    }));
  }, []);

  const completeStage = useCallback((stageId: string) => {
    setProgress(prev => ({
      ...prev,
      completedStages: [...new Set([...prev.completedStages, stageId])]
    }));
  }, []);

  const addScore = useCallback((points: number) => {
    setProgress(prev => ({
      ...prev,
      score: prev.score + points
    }));
  }, []);

  const hasAchievement = useCallback((achievementId: string) => {
    return progress.achievements.includes(achievementId);
  }, [progress.achievements]);

  const isStageCompleted = useCallback((stageId: string) => {
    return progress.completedStages.includes(stageId);
  }, [progress.completedStages]);

  return {
    progress,
    addAchievement,
    completeStage,
    addScore,
    hasAchievement,
    isStageCompleted
  };
}; 