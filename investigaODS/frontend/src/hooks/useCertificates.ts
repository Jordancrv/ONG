import { useState, useEffect, useCallback } from 'react';
import { certificatesService, type Certificate } from '../services/api.service';
import { useApiError } from './useApiError';

export const useCertificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { error, handleError, clearError } = useApiError();

  const fetchCertificates = useCallback(async () => {
    setIsLoading(true);
    clearError();
    
    try {
      const data = await certificatesService.getMyCertificates();
      setCertificates(data);
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [handleError, clearError]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const verifyCertificate = async (serial: string) => {
    clearError();
    
    try {
      const certificate = await certificatesService.verify(serial);
      return certificate;
    } catch (err) {
      handleError(err);
      throw err;
    }
  };

  return {
    certificates,
    isLoading,
    error,
    verifyCertificate,
    refetch: fetchCertificates,
  };
};
