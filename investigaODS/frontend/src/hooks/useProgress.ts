import { useState, useEffect, useCallback } from 'react';
import { progressService, type CourseProgressResponse, type UpdateProgressDto } from '../services/api.service';
import { useApiError } from './useApiError';

export const useProgress = (courseId: number | null) => {
  const [progress, setProgress] = useState<CourseProgressResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { error, handleError, clearError } = useApiError();

  const fetchProgress = useCallback(async () => {
    if (!courseId) {
      setProgress(null);
      return;
    }

    setIsLoading(true);
    clearError();
    
    try {
      const data = await progressService.getCourseProgress(courseId);
      setProgress(data);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [courseId, handleError, clearError]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const updateLessonProgress = async (
    lessonId: number,
    progressPct: number,
    completed: boolean
  ) => {
    clearError();
    
    try {
      const data: UpdateProgressDto = { progressPct, completed };
      await progressService.updateLessonProgress(lessonId, data);
      
      // Refetch progress after update
      await fetchProgress();
    } catch (err) {
      handleError(err);
      throw err;
    }
  };

  return {
    progress,
    isLoading,
    error,
    updateLessonProgress,
    refetch: fetchProgress,
  };
};
