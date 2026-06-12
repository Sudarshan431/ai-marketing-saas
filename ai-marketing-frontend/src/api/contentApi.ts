import { api, unwrapResponse } from './http';
import type {
  GenerateContentRequest,
  GeneratedContentHistoryItem,
  GeneratedContentResponse,
} from '../types/content';

export async function generateContent(
  request: GenerateContentRequest,
): Promise<GeneratedContentResponse> {
  const response = await api.post('/api/content/generate', request);
  return unwrapResponse<GeneratedContentResponse>(response);
}

export async function getContentHistory(): Promise<GeneratedContentHistoryItem[]> {
  const response = await api.get('/api/content/history');
  return unwrapResponse<GeneratedContentHistoryItem[]>(response);
}

export async function getContentDetails(id: number): Promise<GeneratedContentResponse> {
  const response = await api.get(`/api/content/${id}`);
  return unwrapResponse<GeneratedContentResponse>(response);
}

export async function deleteContent(id: number): Promise<void> {
  await api.delete(`/api/content/${id}`);
}
