export type Platform = 'instagram' | 'linkedin' | 'email' | 'google_ads' | 'product_description';

export interface GenerateContentRequest {
  productName: string;
  productDescription: string;
  targetAudience: string;
  platform: Platform;
  tone: string;
  goal: string;
  keywords: string[];
}

export interface ContentVariation {
  content: string;
  hashtags: string[];
  cta: string;
  score: number;
}

export interface AiContentResponse {
  platform: Platform | string;
  variations: ContentVariation[];
}

export interface GeneratedContentResponse {
  id: number;
  platform: Platform | string;
  productName: string;
  aiContent: AiContentResponse;
  createdAt: string;
}

export interface GeneratedContentHistoryItem {
  id: number;
  platform: Platform | string;
  productName: string;
  createdAt: string;
}
