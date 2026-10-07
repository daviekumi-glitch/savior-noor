// Types for SAVIOR NOOR - Interfaith Scripture Analysis App

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

export interface ScripturalAnalysis {
  question: string;
  answer: 'yes' | 'no' | 'unclear';
  confidence: 'high' | 'medium' | 'low';
  quranEvidence: QuranEvidence[];
  bibleEvidence: BibleEvidence[];
  explanation: string;
  relatedTopics: string[];
}

export interface QuranEvidence {
  surah: number;
  verse: number;
  text: string;
  translation: string;
  relevance: string;
  arabicText: string;
}

export interface BibleEvidence {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  translation: string;
  relevance: string;
}

export interface SearchResult {
  type: 'quran' | 'bible';
  source: string;
  content: string;
  reference: string;
  relevance: string;
}

export interface TopicCategory {
  id: string;
  name: string;
  icon: string;
  questions: string[];
  description: string;
}

export interface AppState {
  currentView: 'home' | 'analyze' | 'search' | 'topics' | 'settings';
  isLoading: boolean;
  error: string | null;
  analysis: ScripturalAnalysis | null;
  searchResults: SearchResult[];
  selectedTopic: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
