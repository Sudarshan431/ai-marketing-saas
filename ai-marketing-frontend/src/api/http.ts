import axios, { AxiosError } from 'axios';

import type { ApiErrorPayload, ApiResponse } from '../types/api';
import { useAuthStore } from '../stores/authStore';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 35_000,
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

export function unwrapResponse<T>(response: { data: ApiResponse<T> }): T {
  return response.data.data;
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    return (
      error.response?.data?.message ??
      error.message ??
      'Request failed. Please try again.'
    );
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'Unexpected error. Please try again.';
}
