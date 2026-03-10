import { useState } from 'react';
import { attemptsService, type CreateAnswerDto, type AttemptResult } from '../services/api.service';
import { useApiError } from './useApiError';

export const useQuizAttempt = () => {
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const { error, handleError, clearError } = useApiError();

  const startAttempt = async (quizId: number) => {
    setIsLoading(true);
    clearError();
    setResult(null);
    
    try {
      const attempt = await attemptsService.startAttempt(quizId);
      setAttemptId(attempt.id);
      return attempt;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const submitAnswer = async (questionId: number, answer: string) => {
    if (!attemptId) {
      throw new Error('No active attempt');
    }

    clearError();
    
    try {
      const data: CreateAnswerDto = { questionId, answer };
      await attemptsService.addAnswer(attemptId, data);
    } catch (err) {
      handleError(err);
      throw err;
    }
  };

  const submitAttempt = async () => {
    if (!attemptId) {
      throw new Error('No active attempt');
    }

    setIsLoading(true);
    clearError();
    
    try {
      await attemptsService.submitAttempt(attemptId);
      const attemptResult = await attemptsService.getResult(attemptId);
      setResult(attemptResult);
      return attemptResult;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setAttemptId(null);
    setResult(null);
    clearError();
  };

  return {
    attemptId,
    result,
    isLoading,
    error,
    startAttempt,
    submitAnswer,
    submitAttempt,
    reset,
  };
};
