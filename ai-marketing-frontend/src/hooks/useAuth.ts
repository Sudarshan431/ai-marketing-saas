import { useMutation, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getCurrentUser, login, register } from '../api/authApi';
import { getApiErrorMessage } from '../api/http';
import { queryClient } from '../api/queryClient';
import { useAuthStore } from '../stores/authStore';
import { useToastStore } from '../stores/toastStore';
import type { LoginRequest, RegisterRequest } from '../types/auth';

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const pushToast = useToastStore((state) => state.pushToast);

  return useMutation({
    mutationFn: (request: LoginRequest) => login(request),
    onSuccess: (response) => {
      setAuth(response.token, response.user);
      pushToast({ kind: 'success', message: 'Welcome back.' });
      void queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (error) => {
      pushToast({ kind: 'error', message: getApiErrorMessage(error) });
    },
  });
}

export function useRegister() {
  const setAuth = useAuthStore((state) => state.setAuth);
  const pushToast = useToastStore((state) => state.pushToast);

  return useMutation({
    mutationFn: (request: RegisterRequest) => register(request),
    onSuccess: (response) => {
      setAuth(response.token, response.user);
      pushToast({ kind: 'success', message: 'Account created.' });
      void queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onError: (error) => {
      pushToast({ kind: 'error', message: getApiErrorMessage(error) });
    },
  });
}

export function useCurrentUser() {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);

  const query = useQuery({
    queryKey: ['me'],
    queryFn: getCurrentUser,
    enabled: Boolean(token),
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  return query;
}
