import { useState, useCallback } from 'react';
import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}

export const useApiError = () => {
  const [error, setError] = useState<ApiError | null>(null);

  const handleError = useCallback((err: unknown) => {
    if (err instanceof AxiosError) {
      const response = err.response;
      
      if (response) {
        // Backend error response
        setError({
          message: response.data?.message || 'Error en la solicitud',
          statusCode: response.status,
          errors: response.data?.errors,
        });
      } else if (err.request) {
        // No response received
        setError({
          message: 'No se pudo conectar con el servidor. Verifica tu conexión.',
          statusCode: 0,
        });
      } else {
        // Request setup error
        setError({
          message: err.message || 'Error desconocido',
        });
      }
    } else if (err instanceof Error) {
      setError({
        message: err.message,
      });
    } else {
      setError({
        message: 'Error desconocido',
      });
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    handleError,
    clearError,
  };
};
