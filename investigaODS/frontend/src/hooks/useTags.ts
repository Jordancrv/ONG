import { useState, useEffect, useCallback } from 'react';
import { tagsService } from '../services/api.service';
import type { Tag } from '../types';
import { useApiError } from './useApiError';

export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { error, handleError, clearError } = useApiError();

  const fetchTags = useCallback(async () => {
    setIsLoading(true);
    clearError();
    
    try {
      const data = await tagsService.getAll();
      setTags(data);
    } catch (err) {
      console.error('Error fetching tags:', err);
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError, clearError]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  return {
    tags,
    isLoading,
    error,
    refetch: fetchTags,
  };
};
