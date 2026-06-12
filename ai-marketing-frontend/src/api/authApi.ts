import { api, unwrapResponse } from './http';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth';

export async function login(request: LoginRequest): Promise<AuthResponse> {
  const response = await api.post('/api/auth/login', request);
  return unwrapResponse<AuthResponse>(response);
}

export async function register(request: RegisterRequest): Promise<AuthResponse> {
  const response = await api.post('/api/auth/register', request);
  return unwrapResponse<AuthResponse>(response);
}

export async function getCurrentUser(): Promise<User> {
  const response = await api.get('/api/auth/me');
  return unwrapResponse<User>(response);
}
