import { useState, useEffect, useCallback } from 'react';
import { coursesService } from '../services/api.service';
import type { CourseFilters } from '../services/api.service';
import type { Course } from '../types';
import { useApiError } from './useApiError';

export const useCourses = (filters?: CourseFilters) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { error, handleError, clearError } = useApiError();

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    clearError();
    
    try {
      const data = await coursesService.getAll(filters);
      setCourses(data);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [filters, handleError, clearError]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return {
    courses,
    isLoading,
    error,
    refetch: fetchCourses,
  };
};

export const useCourse = (id: number | null) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { error, handleError, clearError } = useApiError();

  const fetchCourse = useCallback(async () => {
    if (!id) return;
    
    setIsLoading(true);
    clearError();
    
    try {
      const data = await coursesService.getById(id);
      setCourse(data);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [id, handleError, clearError]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  return {
    course,
    isLoading,
    error,
    refetch: fetchCourse,
  };
};

export const useCourseOutline = (id: number | null) => {
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { error, handleError, clearError } = useApiError();

  const fetchOutline = useCallback(async () => {
    if (!id) return;
    
    setIsLoading(true);
    clearError();
    
    try {
      const data = await coursesService.getOutline(id);
      setCourse(data);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [id, handleError, clearError]);

  useEffect(() => {
    fetchOutline();
  }, [fetchOutline]);

  return {
    course,
    isLoading,
    error,
    refetch: fetchOutline,
  };
};
