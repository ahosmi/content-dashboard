import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

// Mock authentication - in a real app, this would call your backend API
const mockAuth = {
  async login(email: string, password: string): Promise<User | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation - in real app, this would be handled by your backend
    if (email && password.length >= 6) {
      return {
        id: crypto.randomUUID(),
        email,
        name: email.split('@')[0],
        createdAt: new Date()
      };
    }
    return null;
  },
  
  async register(name: string, email: string, password: string): Promise<User | null> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation
    if (name && email && password.length >= 6) {
      return {
        id: crypto.randomUUID(),
        email,
        name,
        createdAt: new Date()
      };
    }
    return null;
  }
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const user = await mockAuth.login(email, password);
          if (user) {
            set({ user, isAuthenticated: true, isLoading: false });
            return true;
          } else {
            set({ isLoading: false });
            return false;
          }
        } catch (error) {
          set({ isLoading: false });
          return false;
        }
      },

      register: async (name: string, email: string, password: string) => {
        set({ isLoading: true });
        try {
          const user = await mockAuth.register(name, email, password);
          if (user) {
            set({ user, isAuthenticated: true, isLoading: false });
            return true;
          } else {
            set({ isLoading: false });
            return false;
          }
        } catch (error) {
          set({ isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);