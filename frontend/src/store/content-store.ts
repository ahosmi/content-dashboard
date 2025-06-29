import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Platform = 'youtube' | 'instagram' | 'twitter';
export type ContentStatus = 'idea' | 'scripted' | 'filmed' | 'scheduled';

export interface Content {
  id: string;
  title: string;
  platform: Platform;
  status: ContentStatus;
  plannedDate: Date;
  tags: string[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AIGeneration {
  id: string;
  topic: string;
  platform: Platform;
  suggestions: string[];
  createdAt: Date;
}

interface ContentStore {
  contents: Content[];
  aiGenerations: AIGeneration[];
  currentView: 'dashboard' | 'calendar' | 'ai-lab';
  searchQuery: string;
  selectedPlatforms: Platform[];
  selectedStatuses: ContentStatus[];
  
  // Actions
  setCurrentView: (view: 'dashboard' | 'calendar' | 'ai-lab') => void;
  addContent: (content: Omit<Content, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateContent: (id: string, updates: Partial<Content>) => void;
  deleteContent: (id: string) => void;
  setSearchQuery: (query: string) => void;
  setSelectedPlatforms: (platforms: Platform[]) => void;
  setSelectedStatuses: (statuses: ContentStatus[]) => void;
  addAIGeneration: (generation: Omit<AIGeneration, 'id' | 'createdAt'>) => void;
  getFilteredContents: () => Content[];
  getContentsByDate: (date: Date) => Content[];
  clearAllData: () => void;
}

export const useContentStore = create<ContentStore>()(
  persist(
    (set, get) => ({
      contents: [],
      aiGenerations: [],
      currentView: 'dashboard',
      searchQuery: '',
      selectedPlatforms: [],
      selectedStatuses: [],

      setCurrentView: (view) => set({ currentView: view }),

      addContent: (content) => {
        const newContent: Content = {
          ...content,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        set((state) => ({ contents: [...state.contents, newContent] }));
      },

      updateContent: (id, updates) => {
        set((state) => ({
          contents: state.contents.map((content) =>
            content.id === id
              ? { ...content, ...updates, updatedAt: new Date() }
              : content
          )
        }));
      },

      deleteContent: (id) => {
        set((state) => ({
          contents: state.contents.filter((content) => content.id !== id)
        }));
      },

      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedPlatforms: (platforms) => set({ selectedPlatforms: platforms }),
      setSelectedStatuses: (statuses) => set({ selectedStatuses: statuses }),

      addAIGeneration: (generation) => {
        const newGeneration: AIGeneration = {
          ...generation,
          id: crypto.randomUUID(),
          createdAt: new Date()
        };
        set((state) => ({ aiGenerations: [newGeneration, ...state.aiGenerations] }));
      },

      getFilteredContents: () => {
        const { contents, searchQuery, selectedPlatforms, selectedStatuses } = get();
        
        return contents.filter((content) => {
          const matchesSearch = !searchQuery || 
            content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            content.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
          
          const matchesPlatform = selectedPlatforms.length === 0 || 
            selectedPlatforms.includes(content.platform);
          
          const matchesStatus = selectedStatuses.length === 0 || 
            selectedStatuses.includes(content.status);
          
          return matchesSearch && matchesPlatform && matchesStatus;
        });
      },

      getContentsByDate: (date) => {
        const { contents } = get();
        return contents.filter((content) => {
          const contentDate = new Date(content.plannedDate);
          return contentDate.toDateString() === date.toDateString();
        });
      },

      clearAllData: () => {
        set({
          contents: [],
          aiGenerations: [],
          currentView: 'dashboard',
          searchQuery: '',
          selectedPlatforms: [],
          selectedStatuses: []
        });
      }
    }),
    {
      name: 'content-storage',
    }
  )
);