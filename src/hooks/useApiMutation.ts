import { useState, useCallback } from 'react';
import { apiClient } from '../services/api/client';
import type { AxiosRequestConfig } from 'axios';
import { toast } from 'sonner';

interface UseApiMutationOptions<TResponse> {
  method?: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  onSuccess?: (data: TResponse) => void;
  onError?: (error: any) => void;
  showSuccessToast?: boolean | string;
  showErrorToast?: boolean | string;
}

export function useApiMutation<TPayload = any, TResponse = any>(
  url: string | ((payload: TPayload) => string),
  options: UseApiMutationOptions<TResponse> = {}
) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    method = 'POST',
    onSuccess,
    onError,
    showSuccessToast = true,
    showErrorToast = true
  } = options;

  const mutate = useCallback(
    async (payload?: TPayload, config?: AxiosRequestConfig) => {
      let loadingToastId: string | number | undefined;
      
      try {
        setIsLoading(true);
        if (showSuccessToast || showErrorToast) {
           loadingToastId = toast.loading('Processing request...');
        }

        const finalUrl = typeof url === 'function' ? url(payload as TPayload) : url;

        const response = await apiClient.request<TResponse>({
          url: finalUrl,
          method,
          data: payload,
          ...config
        });

        if (loadingToastId) {
          toast.dismiss(loadingToastId);
        }

        if (showSuccessToast) {
          const message = typeof showSuccessToast === 'string' ? showSuccessToast : 'Operation successful';
          toast.success(message);
        }

        if (onSuccess) {
          onSuccess(response.data);
        }

        return response.data;
      } catch (error: any) {
        if (loadingToastId) {
          toast.dismiss(loadingToastId);
        }

        if (showErrorToast) {
          const message = typeof showErrorToast === 'string' 
            ? showErrorToast 
            : error.response?.data?.message || error.message || 'An error occurred';
          toast.error(message);
        }

        if (onError) {
          onError(error);
        }
        
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [url, method, onSuccess, onError, showSuccessToast, showErrorToast]
  );

  return { mutate, isLoading };
}
