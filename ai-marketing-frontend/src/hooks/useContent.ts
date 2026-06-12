import { useMutation, useQuery } from '@tanstack/react-query';

import {
  deleteContent,
  generateContent,
  getContentDetails,
  getContentHistory,
} from '../api/contentApi';
import { getApiErrorMessage } from '../api/http';
import { queryClient } from '../api/queryClient';
import { useContentStore } from '../stores/contentStore';
import { useToastStore } from '../stores/toastStore';
import type { GenerateContentRequest } from '../types/content';

export function useGenerateContent() {
  const setLatestResult = useContentStore((state) => state.setLatestResult);
  const pushToast = useToastStore((state) => state.pushToast);

  return useMutation({
    mutationFn: (request: GenerateContentRequest) => generateContent(request),
    onSuccess: (response) => {
      setLatestResult(response);
      pushToast({ kind: 'success', message: 'Content generated.' });
      void queryClient.invalidateQueries({ queryKey: ['content-history'] });
    },
    onError: (error) => {
      pushToast({ kind: 'error', message: getApiErrorMessage(error) });
    },
  });
}

export function useHistory() {
  return useQuery({
    queryKey: ['content-history'],
    queryFn: getContentHistory,
  });
}

export function useContentDetails(id?: number) {
  return useQuery({
    queryKey: ['content-details', id],
    queryFn: () => getContentDetails(id!),
    enabled: Number.isFinite(id),
  });
}

export function useDeleteContent() {
  const pushToast = useToastStore((state) => state.pushToast);

  return useMutation({
    mutationFn: (id: number) => deleteContent(id),
    onSuccess: () => {
      pushToast({ kind: 'success', message: 'Content deleted.' });
      void queryClient.invalidateQueries({ queryKey: ['content-history'] });
    },
    onError: (error) => {
      pushToast({ kind: 'error', message: getApiErrorMessage(error) });
    },
  });
}
