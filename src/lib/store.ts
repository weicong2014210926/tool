import { create } from 'zustand';

export type Theme = 'light' | 'dark' | 'system';
export type Lang = 'zh' | 'en';

interface AppState {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Language
  lang: Lang;
  setLang: (lang: Lang) => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Favorites
  favorites: string[];
  addFavorite: (toolId: string) => void;
  removeFavorite: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;

  // History
  history: string[];
  addToHistory: (toolId: string) => void;
  clearHistory: () => void;
}

function getStoredTheme(): Theme {
  const stored = localStorage.getItem('utility-tools-theme');
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  return 'system';
}

function getStoredFavorites(): string[] {
  try {
    return JSON.parse(localStorage.getItem('utility-tools-favorites') || '[]');
  } catch { return []; }
}

function getStoredHistory(): string[] {
  try {
    return JSON.parse(localStorage.getItem('utility-tools-history') || '[]');
  } catch { return []; }
}

function getStoredLang(): Lang {
  const stored = localStorage.getItem('utility-tools-lang');
  if (stored === 'zh' || stored === 'en') return stored;
  // Default to zh for Chinese users, en for others
  if (typeof navigator !== 'undefined' && navigator.language.startsWith('zh')) return 'zh';
  return 'zh';
}

export const useAppStore = create<AppState>((set, get) => ({
  theme: getStoredTheme(),
  setTheme: (theme) => {
    localStorage.setItem('utility-tools-theme', theme);
    set({ theme });
  },
  toggleTheme: () => {
    const current = get().theme;
    const next = current === 'light' ? 'dark' : current === 'dark' ? 'system' : 'light';
    localStorage.setItem('utility-tools-theme', next);
    set({ theme: next });
  },

  lang: getStoredLang(),
  setLang: (lang) => {
    localStorage.setItem('utility-tools-lang', lang);
    set({ lang });
  },

  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  favorites: getStoredFavorites(),
  addFavorite: (toolId) => {
    const favs = [...new Set([...get().favorites, toolId])];
    localStorage.setItem('utility-tools-favorites', JSON.stringify(favs));
    set({ favorites: favs });
  },
  removeFavorite: (toolId) => {
    const favs = get().favorites.filter((f) => f !== toolId);
    localStorage.setItem('utility-tools-favorites', JSON.stringify(favs));
    set({ favorites: favs });
  },
  isFavorite: (toolId) => get().favorites.includes(toolId),

  history: getStoredHistory(),
  addToHistory: (toolId) => {
    const hist = [toolId, ...get().history.filter((h) => h !== toolId)].slice(0, 20);
    localStorage.setItem('utility-tools-history', JSON.stringify(hist));
    set({ history: hist });
  },
  clearHistory: () => {
    localStorage.removeItem('utility-tools-history');
    set({ history: [] });
  },
}));
