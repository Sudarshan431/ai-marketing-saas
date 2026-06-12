import { create } from 'zustand';

import type { GeneratedContentResponse } from '../types/content';

interface ContentState {
  latestResult: GeneratedContentResponse | null;
  selectedContent: GeneratedContentResponse | null;
  setLatestResult: (result: GeneratedContentResponse | null) => void;
  setSelectedContent: (content: GeneratedContentResponse | null) => void;
}

export const useContentStore = create<ContentState>((set) => ({
  latestResult: null,
  selectedContent: null,
  setLatestResult: (latestResult) => set({ latestResult }),
  setSelectedContent: (selectedContent) => set({ selectedContent }),
}));
