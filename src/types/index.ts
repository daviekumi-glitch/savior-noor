// Enhanced Types for SAVIOR NOOR - Divine Scripture Analysis

export interface QuranVerse {
  number: number;
  text: string;
  translation: string;
  surah: number;
}

export interface BibleVerse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface AnalysisResult {
  id?: string;
  question: string;
  answer: AnswerType;
  confidence: ConfidenceLevel;
  explanation: string;
  quranEvidence: QuranEvidence[];
  bibleEvidence: BibleEvidence[];
  summary: string;
  methodology: string;
  createdAt?: string;
  isBookmarked?: boolean;
}

export type AnswerType = 'yes' | 'no' | 'unclear';
export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type EvidenceStrength = 'supporting' | 'opposing' | 'neutral';

export interface QuranEvidence {
  surah: number;
  verse: number;
  text: string;
  translation: string;
  relevance: string;
  strength: EvidenceStrength;
}

export interface BibleEvidence {
  reference: string;
  text: string;
  relevance: string;
  strength: EvidenceStrength;
}

export interface SearchResult {
  type: ScriptureType;
  source: string;
  content: string;
  reference: string;
  relevance: string;
}

export type ScriptureType = 'quran' | 'bible';

export interface TopicCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  questions: string[];
}

export interface AppSettings {
  theme: 'dark' | 'light' | 'system';
  language: 'en' | 'ar' | 'both';
  fontSize: 'small' | 'medium' | 'large';
  showArabic: boolean;
  autoSaveHistory: boolean;
}

export interface UserStats {
  totalAnalyses: number;
  bookmarksCount: number;
  mostSearchedTopic: string;
  lastAnalysis: string;
  quranVersesViewed: number;
  bibleVersesViewed: number;
}

export interface ComparisonResult {
  topic: string;
  quranView: string;
  bibleView: string;
  agreement: 'agree' | 'disagree' | 'partial';
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

// Storage types
export interface StorageData {
  analysisHistory: AnalysisResult[];
  bookmarks: AnalysisResult[];
  settings: AppSettings;
  stats: UserStats;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  loading?: boolean;
}

// Navigation types
export type NavigationPage = 'home' | 'topics' | 'about' | 'history' | 'bookmarks' | 'compare' | 'settings' | 'dashboard';

// Verse of the Day
export interface VerseOfTheDay {
  scripture: ScriptureType;
  reference: string;
  text: string;
  translation: string;
  date: string;
}

// Comparison types
export interface ComparisonItem {
  id: string;
  topic: string;
  quranEvidence: QuranEvidence[];
  bibleEvidence: BibleEvidence[];
}
