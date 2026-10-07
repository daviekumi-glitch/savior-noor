// Custom hooks for SAVIOR NOOR

import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  AnalysisResult,
  AppSettings,
  UserStats,
  Toast,
  NavigationPage,
  StorageData
} from '../types';

// Local storage keys
const STORAGE_KEYS = {
  HISTORY: 'savior_noor_history',
  BOOKMARKS: 'savior_noor_bookmarks',
  SETTINGS: 'savior_noor_settings',
  STATS: 'savior_noor_stats'
};

// Default settings
const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  language: 'en',
  fontSize: 'medium',
  showArabic: true,
  autoSaveHistory: true
};

// Default stats
const DEFAULT_STATS: UserStats = {
  totalAnalyses: 0,
  bookmarksCount: 0,
  mostSearchedTopic: '',
  lastAnalysis: '',
  quranVersesViewed: 0,
  bibleVersesViewed: 0
};

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Toast hook
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((type: Toast['type'], message: string, duration = 3000) => {
    const id = generateId();
    setToasts(prev => [...prev, { id, type, message, duration }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}

// Local storage hook
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue] as const;
}

// Analysis history hook
export function useAnalysisHistory() {
  const [history, setHistory] = useLocalStorage<AnalysisResult[]>(STORAGE_KEYS.HISTORY, []);
  const [stats, setStats] = useLocalStorage<UserStats>(STORAGE_KEYS.STATS, DEFAULT_STATS);

  const addToHistory = useCallback((analysis: AnalysisResult) => {
    setHistory(prev => {
      const updated = [analysis, ...prev.filter(h => h.id !== analysis.id)].slice(0, 50);
      return updated;
    });
    setStats(prev => ({
      ...prev,
      totalAnalyses: prev.totalAnalyses + 1,
      lastAnalysis: analysis.createdAt,
      mostSearchedTopic: analysis.question
    }));
  }, [setHistory, setStats]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setStats(DEFAULT_STATS);
  }, [setHistory, setStats]);

  const deleteFromHistory = useCallback((id: string) => {
    setHistory(prev => prev.filter(h => h.id !== id));
  }, [setHistory]);

  return { history, addToHistory, clearHistory, deleteFromHistory, stats };
}

// Bookmarks hook
export function useBookmarks() {
  const [bookmarks, setBookmarks] = useLocalStorage<AnalysisResult[]>(STORAGE_KEYS.BOOKMARKS, []);
  const [stats, setStats] = useLocalStorage<UserStats>(STORAGE_KEYS.STATS, DEFAULT_STATS);

  const addBookmark = useCallback((analysis: AnalysisResult) => {
    const bookmarked = { ...analysis, isBookmarked: true };
    setBookmarks(prev => {
      if (prev.find(b => b.id === analysis.id)) return prev;
      return [bookmarked, ...prev];
    });
    setStats(prev => ({ ...prev, bookmarksCount: prev.bookmarksCount + 1 }));
  }, [setBookmarks, setStats]);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks(prev => prev.filter(b => b.id !== id));
    setStats(prev => ({
      ...prev,
      bookmarksCount: Math.max(0, prev.bookmarksCount - 1)
    }));
  }, [setBookmarks, setStats]);

  const isBookmarked = useCallback((id: string) => {
    return bookmarks.some(b => b.id === id);
  }, [bookmarks]);

  const toggleBookmark = useCallback((analysis: AnalysisResult) => {
    if (!analysis.id) return;
    if (isBookmarked(analysis.id)) {
      removeBookmark(analysis.id);
    } else {
      addBookmark(analysis);
    }
  }, [isBookmarked, addBookmark, removeBookmark]);

  return { bookmarks, addBookmark, removeBookmark, isBookmarked, toggleBookmark };
}

// Settings hook
export function useSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, [setSettings]);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
  }, [setSettings]);

  return { settings, updateSettings, resetSettings };
}

// Theme hook
export function useTheme() {
  const { settings, updateSettings } = useSettings();

  const theme = settings.theme;

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    updateSettings({
      theme: theme === 'dark' ? 'light' : 'dark'
    });
  }, [theme, updateSettings]);

  return { theme, toggleTheme, setTheme: (t: 'dark' | 'light' | 'system') => updateSettings({ theme: t }) };
}

// Navigation hook
export function useNavigation() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('home');
  const [previousPage, setPreviousPage] = useState<NavigationPage | null>(null);

  const navigate = useCallback((page: NavigationPage) => {
    setPreviousPage(currentPage);
    setCurrentPage(page);
  }, [currentPage]);

  const goBack = useCallback(() => {
    if (previousPage) {
      setCurrentPage(previousPage);
      setPreviousPage(null);
    }
  }, [previousPage]);

  return { currentPage, previousPage, navigate, goBack };
}

// Debounce hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Media query hook
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

// Responsive hook
export function useResponsive() {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  return { isMobile, isTablet, isDesktop, isMobileOrTablet: isMobile || isTablet };
}

// Keyboard shortcuts hook
export function useKeyboardShortcut(
  key: string,
  callback: () => void,
  modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean } = {}
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key.toLowerCase() === key.toLowerCase() &&
        (!modifiers.ctrl || e.ctrlKey) &&
        (!modifiers.shift || e.shiftKey) &&
        (!modifiers.alt || e.altKey)
      ) {
        e.preventDefault();
        callback();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, modifiers]);
}

// Copy to clipboard hook
export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (error) {
      console.error('Failed to copy:', error);
      return false;
    }
  }, []);

  return { copied, copy };
}

// Export analysis as JSON
export function useExportAnalysis() {
  const exportAnalysis = useCallback((analysis: AnalysisResult) => {
    const data = {
      ...analysis,
      exportedAt: new Date().toISOString(),
      appVersion: '1.0.0',
      appName: 'SAVIOR NOOR'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `savior-noor-analysis-${analysis.id}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  const exportAllHistory = useCallback((history: AnalysisResult[]) => {
    const data = {
      analyses: history,
      exportedAt: new Date().toISOString(),
      totalCount: history.length,
      appVersion: '1.0.0',
      appName: 'SAVIOR NOOR'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `savior-noor-history-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  return { exportAnalysis, exportAllHistory };
}
