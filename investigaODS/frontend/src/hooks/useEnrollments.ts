import { useState, useEffect, useCallback } from 'react';
import { enrollmentsService } from '../services/api.service';
import type { Enrollment } from '../types';
import { useApiError } from './useApiError';

export const useEnrollments = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { error, handleError, clearError } = useApiError();

  const fetchEnrollments = useCallback(async () => {
    setIsLoading(true);
    clearError();
    
    try {
      const data = await enrollmentsService.getMyEnrollments();
      setEnrollments(data);
    } catch (err) {
      console.error('Error fetching enrollments:', err);
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError, clearError]);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  const enroll = async (courseId: number) => {
    setIsLoading(true);
    clearError();
    
    try {
      const enrollment = await enrollmentsService.enroll(courseId);
      setEnrollments((prev) => [...prev, enrollment]);
      return enrollment;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    enrollments,
    isLoading,
    error,
    enroll,
    refetch: fetchEnrollments,
  };
};
