import { useState, useEffect, useCallback, useRef } from 'react';
import { apiClient } from '../services/api/client';
import type { AxiosRequestConfig } from 'axios';

interface UseApiQueryOptions<TData, TResult> {
  url: string;
  params?: AxiosRequestConfig['params'];
  enabled?: boolean;
  transform?: (data: TData) => TResult;
}

interface UseApiQueryResult<TResult> {
  data: TResult | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useApiQuery<TData = any, TResult = TData>({
  url,
  params,
  enabled = true,
  transform
}: UseApiQueryOptions<TData, TResult>): UseApiQueryResult<TResult> {
  const [data, setData] = useState<TResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Store params and transform in refs so inline object/function references don't trigger re-render loops
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const transformRef = useRef(transform);
  transformRef.current = transform;

  // Serialize params for stable dependency checking
  const paramsKey = JSON.stringify(params);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiClient.get<TData>(url, { params: paramsRef.current });
      
      const currentTransform = transformRef.current;
      const result = currentTransform ? currentTransform(response.data) : (response.data as unknown as TResult);
      setData(result);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(err?.message || 'An error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, [url, paramsKey]);

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled, fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
