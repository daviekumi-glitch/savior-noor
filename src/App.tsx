import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  BookOpen, Search, Sparkles, Moon, Sun, Copy, Check, ArrowRight,
  Shield, Home, Layers, Compass, Info, Menu, X, ChevronRight,
  Quote, Scale, Globe, Zap, Heart, GitBranch, Star, Bookmark,
  Clock, Trash2, Share2, Download, Settings, BarChart3, Users,
  BookmarkPlus, BookmarkCheck, History, RotateCcw, Eye, EyeOff,
  Twitter, Facebook, Linkedin, Link2, AlertCircle, CheckCircle2,
  XCircle, Loader2, RefreshCw, ExternalLink, GitCompare,
  Flame, Trophy, Target, TrendingUp, Calendar, Filter,
  SortAsc, LayoutGrid, List, ChevronDown, Plus, Minus, Bold, Italic, MoreHorizontal
} from 'lucide-react';
import { scriptureAnalysis } from './services/scriptureAnalysis';
import {
  NavigationPage,
  AnalysisResult,
  Toast,
  TopicCategory,
  UserStats
} from './types';
import {
  generateId,
  useToast,
  useTheme,
  useNavigation,
  useCopyToClipboard,
  useExportAnalysis,
  useKeyboardShortcut
} from './hooks/useAppStore';
import { useAnalysisHistory, useBookmarks, useSettings } from './hooks/useAppStore';

// Predefined topics for quick analysis
const predefinedTopics: TopicCategory[] = [
  { id: 'jesus_god', title: 'Is Jesus God?', description: 'Compare Quran and Bible perspectives on Jesus\'s divinity', icon: '✝', category: 'Christology', questions: ['Is Jesus God?', 'Is Jesus Divine?', 'Jesus Christ God'] },
  { id: 'trinity', title: 'The Trinity', description: 'Biblical and Quranic views on the concept of Trinity', icon: '☦', category: 'Theology', questions: ['What is the Trinity?', 'Trinity in Bible', 'Trinity in Quran'] },
  { id: 'jesus_crucifixion', title: 'Jesus Crucifixion', description: 'Did Jesus die on the cross? Evidence from both scriptures', icon: '✝', category: 'Christology', questions: ['Was Jesus Crucified?', 'Jesus Death on Cross', 'Crucifixion Evidence'] },
  { id: 'god_one', title: 'Oneness of God', description: 'Monotheism in Quran and Bible', icon: '☀', category: 'Theology', questions: ['Is God One?', 'Monotheism', 'Tawhid'] },
  { id: 'salvation_faith', title: 'Salvation', description: 'How salvation is achieved according to both scriptures', icon: '🔑', category: 'Soteriology', questions: ['How to be Saved?', 'Salvation by Faith', 'Salvation Works'] },
  { id: 'prophets', title: 'Prophets', description: 'Common prophets in Quran and Bible', icon: '📜', category: 'Prophethood', questions: ['Prophets in Bible', 'Prophets in Quran', 'Common Prophets'] },
  { id: 'holy_spirit', title: 'Holy Spirit', description: 'Nature of the Holy Spirit in both scriptures', icon: '🕊', category: 'Theology', questions: ['What is Holy Spirit?', 'Holy Spirit in Quran', 'Holy Spirit Bible'] },
  { id: 'jesus_return', title: 'Jesus Return', description: 'Second coming of Jesus in Quran and Bible', icon: '🔔', category: 'Eschatology', questions: ['Will Jesus Return?', 'Second Coming', 'Jesus Second Coming'] },
  { id: 'scripture_origin', title: 'Scripture Origin', description: 'Divine inspiration and authority of scriptures', icon: '📖', category: 'Theology', questions: ['Bible Inspired?', 'Quran Revelation', 'Scripture Authority'] },
  { id: 'afterlife', title: 'Afterlife', description: 'Heaven, Hell, and eternal life perspectives', icon: '🌅', category: 'Eschatology', questions: ['Heaven and Hell', 'Eternal Life', 'Afterlife Quran Bible'] },
  { id: 'prayer', title: 'Prayer', description: 'How to pray and worship in both faiths', icon: '🙏', category: 'Practice', questions: ['How to Pray?', 'Prayer in Islam', 'Prayer Christianity'] },
  { id: 'creation', title: 'Creation', description: 'How the world was created', icon: '🌍', category: 'Theology', questions: ['Creation Story', 'How World Created', 'Genesis Quran'] }
];

const features = [
  { icon: Scale, title: 'Evidence-Based', description: 'Real scripture references from authentic APIs', color: 'from-violet-500 to-purple-500' },
  { icon: Zap, title: 'No Hallucination', description: 'Verified answers with verse proofs', color: 'from-amber-500 to-orange-500' },
  { icon: Globe, title: 'Dual Scripture', description: 'Quran and Bible analysis combined', color: 'from-emerald-500 to-teal-500' },
  { icon: Heart, title: 'Unbiased Analysis', description: 'Honest answers without prejudice', color: 'from-rose-500 to-pink-500' },
];

// Skeleton Loader Component
const Skeleton = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-gradient-to-r from-slate-700 to-slate-600 rounded ${className || ''}`} />
);

// Toast Component
const ToastContainer = ({ toasts, remove }: { toasts: Toast[]; remove: (id: string) => void }) => (
  <div className="fixed top-4 right-4 z-[100] space-y-3">
    {toasts.map(toast => (
      <div
        key={toast.id}
        className={`flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl backdrop-blur-xl animate-slideIn ${
          toast.type === 'success' ? 'bg-emerald-500/90 text-white' :
          toast.type === 'error' ? 'bg-red-500/90 text-white' :
          toast.type === 'warning' ? 'bg-amber-500/90 text-white' :
          'bg-blue-500/90 text-white'
        }`}
      >
        {toast.type === 'success' && <CheckCircle2 size={20} />}
        {toast.type === 'error' && <XCircle size={20} />}
        {toast.type === 'warning' && <AlertCircle size={20} />}
        {toast.type === 'info' && <Info size={20} />}
        <span className="font-medium">{toast.message}</span>
        <button onClick={() => remove(toast.id)} className="ml-2 hover:opacity-70 transition-opacity">
          <X size={16} />
        </button>
      </div>
    ))}
  </div>
);

// Answer Badge Component
const AnswerBadge = ({ answer }: { answer: string }) => {
  const config = {
    yes: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30', icon: '✓' },
    no: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', icon: '✗' },
    unclear: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30', icon: '?' }
  }[answer] || { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30', icon: '?' };

  return (
    <span className={`px-5 py-2.5 ${config.bg} ${config.text} border ${config.border} rounded-full text-sm font-bold shadow-lg`}>
      {config.icon} {answer.toUpperCase()}
    </span>
  );
};

// Confidence Badge
const ConfidenceBadge = ({ confidence }: { confidence: string }) => {
  const config = {
    high: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    medium: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
    low: { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30' }
  }[confidence] || { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30' };

  return (
    <span className={`px-3 py-1.5 ${config.bg} ${config.text} border ${config.border} rounded-full text-xs font-semibold`}>
      {confidence.toUpperCase()} CONFIDENCE
    </span>
  );
};

// Stat Card Component
const StatCard = ({ icon: Icon, title, value, color }: { icon: any; title: string; value: string | number; color: string }) => (
  <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-2xl p-6 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
      <Icon className="text-white" size={24} />
    </div>
    <p className="text-3xl font-bold text-white mb-1">{value}</p>
    <p className="text-sm text-slate-400">{title}</p>
  </div>
);

// Evidence Card Component
const EvidenceCard = ({ type, evidence, onCopy, copiedId }: {
  type: 'quran' | 'bible';
  evidence: any;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
}) => {
  const colors = type === 'quran'
    ? { bg: 'from-emerald-950/50 to-slate-900/80', border: 'border-emerald-800/30', icon: 'from-emerald-500 to-teal-500', text: 'text-emerald-400' }
    : { bg: 'from-blue-950/50 to-slate-900/80', border: 'border-blue-800/30', icon: 'from-blue-500 to-indigo-500', text: 'text-blue-400' };

  const strengthColors = {
    supporting: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    opposing: 'bg-red-500/20 text-red-400 border-red-500/30',
    neutral: 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  };

  return (
    <div className={`bg-gradient-to-br ${colors.bg} border ${colors.border} rounded-2xl p-6 hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.icon} flex items-center justify-center shadow-lg`}>
            <BookOpen className="text-white" size={22} />
          </div>
          <div>
            <h4 className={`font-bold text-lg ${colors.text}`}>
              {type === 'quran' ? `Quran ${evidence.surah}:${evidence.verse}` : evidence.reference}
            </h4>
            <p className={`text-sm ${colors.text} opacity-70`}>{evidence.relevance}</p>
          </div>
        </div>
        <button
          onClick={() => onCopy(
            type === 'quran'
              ? `Quran ${evidence.surah}:${evidence.verse}: "${evidence.translation}"`
              : `${evidence.reference}: "${evidence.text}"`,
            `${type}-${evidence.surah || evidence.reference}-${evidence.verse || 0}`
          )}
          className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-slate-400 hover:text-white transition-all"
        >
          {copiedId === `${type}-${evidence.surah || evidence.reference}-${evidence.verse || 0}` ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
        </button>
      </div>

      {type === 'quran' && evidence.text && (
        <p className="text-xl leading-relaxed mb-3 text-amber-300 font-['Noto_Sans_Arabic']">{evidence.text}</p>
      )}
      <p className={`text-sm leading-relaxed ${type === 'quran' ? 'text-slate-300' : 'text-slate-300'} mb-4`}>
        "{type === 'quran' ? evidence.translation : evidence.text}"
      </p>

      <div className="flex flex-wrap gap-2">
        <span className={`px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/50 text-slate-400 border border-slate-700/50`}>
          {evidence.relevance}
        </span>
        <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${strengthColors[evidence.strength]}`}>
          {evidence.strength}
        </span>
      </div>
    </div>
  );
};

function App() {
  // Hooks
  const [question, setQuestion] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toasts, addToast, removeToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const { currentPage, navigate } = useNavigation();
  const { history, addToHistory, clearHistory, deleteFromHistory, stats } = useAnalysisHistory();
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();
  const { settings } = useSettings();
  const { copied, copy } = useCopyToClipboard();
  const { exportAnalysis, exportAllHistory } = useExportAnalysis();
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showArabic, setShowArabic] = useState(true);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedAnalyses, setSelectedAnalyses] = useState<string[]>([]);

  // Keyboard shortcuts
  useKeyboardShortcut('k', () => navigate('home'), { ctrl: true });
  useKeyboardShortcut('b', () => navigate('bookmarks'), { ctrl: true });
  useKeyboardShortcut('h', () => navigate('history'), { ctrl: true });
  useKeyboardShortcut('s', () => navigate('settings'), { ctrl: true });

  // Analyze question
  const analyzeQuestion = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const result = await scriptureAnalysis.analyzeQuestion(query);
      const analysisWithId: AnalysisResult = {
        ...result,
        id: generateId(),
        createdAt: new Date().toISOString(),
        isBookmarked: false
      };
      setAnalysis(analysisWithId);
      addToHistory(analysisWithId);
      addToast('success', 'Analysis completed successfully!');
    } catch (err) {
      setError('Failed to analyze. Please try again.');
      addToast('error', 'Analysis failed. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [addToHistory, addToast]);

  // Handle topic selection
  const handleTopicSelect = useCallback((topicId: string) => {
    const topic = predefinedTopics.find(t => t.id === topicId);
    if (topic) {
      setQuestion(topic.title + '?');
      analyzeQuestion(topic.title + '?');
      navigate('home');
    }
  }, [analyzeQuestion, navigate]);

  // Copy to clipboard
  const copyToClipboard = useCallback(async (text: string, section: string) => {
    await copy(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
    addToast('success', 'Copied to clipboard!');
  }, [copy, addToast]);

  // Share analysis
  const shareAnalysis = useCallback((analysis: AnalysisResult) => {
    const text = `SAVIOR NOOR Analysis: ${analysis.question}\nAnswer: ${analysis.answer.toUpperCase()}\n\nCheck it out at: ${window.location.href}`;

    if (navigator.share) {
      navigator.share({ title: 'SAVIOR NOOR Analysis', text });
    } else {
      copyToClipboard(text, 'share');
    }
  }, [copyToClipboard]);

  // Navigation items
  const navItems = [
    { id: 'home' as NavigationPage, label: 'Home', icon: Home },
    { id: 'topics' as NavigationPage, label: 'Topics', icon: Layers },
    { id: 'dashboard' as NavigationPage, label: 'Dashboard', icon: BarChart3 },
    { id: 'history' as NavigationPage, label: 'History', icon: History },
    { id: 'bookmarks' as NavigationPage, label: 'Bookmarks', icon: Bookmark },
    { id: 'compare' as NavigationPage, label: 'Compare', icon: GitCompare },
    { id: 'about' as NavigationPage, label: 'About', icon: Info },
    { id: 'settings' as NavigationPage, label: 'Settings', icon: Settings },
  ];

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen transition-all duration-500 ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      {/* Toast Container */}
      <ToastContainer toasts={toasts} remove={removeToast} />

      {/* Premium Glass Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-2xl ${isDark ? 'bg-slate-950/80 border-b border-slate-800/50' : 'bg-white/80 border-b border-slate-200/50'} shadow-2xl`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <button onClick={() => navigate('home')} className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center shadow-xl shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-all duration-300 group-hover:scale-105">
                  <Shield className="w-7 h-7 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>SAVIOR NOOR</h1>
                <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Divine Scripture Analysis</p>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.slice(0, 5).map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30 shadow-lg'
                      : `${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`
                  }`}
                >
                  <item.icon size={18} />
                  <span className="hidden xl:inline">{item.label}</span>
                </button>
              ))}
              <div className="relative group">
                <button className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}>
                  <MoreHorizontal size={18} />
                  <span className="hidden xl:inline">More</span>
                </button>
                <div className={`absolute right-0 top-full mt-2 w-48 py-2 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ${isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                  {navItems.slice(5).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        currentPage === item.id ? 'text-amber-400' : isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <item.icon size={18} />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button onClick={toggleTheme} className={`p-2.5 rounded-xl transition-all duration-200 ${isDark ? 'bg-slate-800/50 text-amber-400 hover:bg-slate-700/50 hover:text-amber-300' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`lg:hidden p-2.5 rounded-xl ${isDark ? 'bg-slate-800/50 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`lg:hidden border-t ${isDark ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-200'} backdrop-blur-xl`}>
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => { navigate(item.id); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    currentPage === item.id
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400'
                      : `${isDark ? 'text-slate-400 hover:bg-slate-800/50' : 'text-slate-600 hover:bg-slate-100'}`
                  }`}
                >
                  <item.icon size={20} />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* HOME PAGE */}
        {currentPage === 'home' && (
          <>
            {/* Hero Section */}
            <div className="text-center py-12 lg:py-16 relative">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 rounded-full blur-3xl animate-pulse"></div>
              </div>
              <div className="relative">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold mb-8 shadow-lg shadow-amber-500/10">
                  <Sparkles size={16} />
                  Evidence-Based Scriptural Analysis
                </div>
                <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-black mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Seek Truth Through
                  <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent mt-2">
                    Divine Scripture
                  </span>
                </h2>
                <p className={`text-lg lg:text-xl max-w-2xl mx-auto mb-10 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Get honest, evidence-based answers from Quran and Bible. No hallucinations, only verified scripture references.
                </p>
              </div>
            </div>

            {/* Search Box */}
            <div className="max-w-3xl mx-auto mb-16">
              <div className={`relative rounded-3xl ${isDark ? 'bg-gradient-to-br from-slate-900 to-slate-800/80 border border-slate-700/50' : 'bg-gradient-to-br from-white to-slate-50 border border-slate-200/50'} shadow-2xl shadow-black/10 p-2.5`}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className={`absolute left-5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} size={22} />
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && analyzeQuestion(question)}
                      placeholder="Ask a theological question..."
                      className={`w-full pl-14 pr-5 py-4.5 rounded-2xl bg-transparent text-lg font-medium focus:outline-none transition-colors ${isDark ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'}`}
                    />
                  </div>
                  <button
                    onClick={() => analyzeQuestion(question)}
                    disabled={isLoading || !question.trim()}
                    className="px-8 py-4.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        <span>Analyze</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="max-w-3xl mx-auto mb-8 p-4 bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-2xl text-red-400 backdrop-blur-sm flex items-center gap-3">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="max-w-5xl mx-auto space-y-6 animate-pulse">
                <div className={`rounded-3xl ${isDark ? 'bg-slate-900/50 border border-slate-800/50' : 'bg-white border border-slate-200/50'} p-8`}>
                  <Skeleton className="h-8 w-48 mb-6" />
                  <Skeleton className="h-6 w-full mb-4" />
                  <Skeleton className="h-6 w-3/4" />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Skeleton className="h-96 rounded-3xl" />
                  <Skeleton className="h-96 rounded-3xl" />
                </div>
              </div>
            )}

            {/* Analysis Results */}
            {analysis && !isLoading && (
              <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
                {/* Answer Card */}
                <div className={`rounded-3xl ${isDark ? 'bg-gradient-to-br from-slate-900 to-slate-800/80 border border-slate-700/50' : 'bg-gradient-to-br from-white to-slate-50 border border-slate-200/50'} shadow-2xl shadow-black/10 overflow-hidden`}>
                  <div className="p-6 lg:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                      <h3 className={`text-xl lg:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Analysis Result</h3>
                      <div className="flex items-center gap-3">
                        <AnswerBadge answer={analysis.answer} />
                        <ConfidenceBadge confidence={analysis.confidence} />
                      </div>
                    </div>
                    <p className={`text-lg leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{analysis.explanation}</p>
                    <div className={`mt-6 pt-6 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
                      <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{analysis.summary}</p>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-3 mt-6">
                      <button
                        onClick={() => toggleBookmark(analysis)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all ${
                          isBookmarked(analysis.id)
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : `${isDark ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`
                        }`}
                      >
                        {isBookmarked(analysis.id) ? <BookmarkCheck size={18} /> : <BookmarkPlus size={18} />}
                        {isBookmarked(analysis.id) ? 'Bookmarked' : 'Bookmark'}
                      </button>
                      <button
                        onClick={() => shareAnalysis(analysis)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium ${isDark ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        <Share2 size={18} />
                        Share
                      </button>
                      <button
                        onClick={() => exportAnalysis(analysis)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium ${isDark ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        <Download size={18} />
                        Export
                      </button>
                      <button
                        onClick={() => setShowArabic(!showArabic)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium ${isDark ? 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        {showArabic ? <EyeOff size={18} /> : <Eye size={18} />}
                        {showArabic ? 'Hide Arabic' : 'Show Arabic'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Scripture Evidence Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Quran Evidence */}
                  <div className="space-y-4">
                    <h4 className={`text-lg font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'} flex items-center gap-2`}>
                      <BookOpen size={20} />
                      Quran Evidence ({analysis.quranEvidence.length})
                    </h4>
                    {analysis.quranEvidence.map((evidence, idx) => (
                      <EvidenceCard
                        key={idx}
                        type="quran"
                        evidence={evidence}
                        onCopy={copyToClipboard}
                        copiedId={copiedSection}
                      />
                    ))}
                  </div>

                  {/* Bible Evidence */}
                  <div className="space-y-4">
                    <h4 className={`text-lg font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'} flex items-center gap-2`}>
                      <BookOpen size={20} />
                      Bible Evidence ({analysis.bibleEvidence.length})
                    </h4>
                    {analysis.bibleEvidence.map((evidence, idx) => (
                      <EvidenceCard
                        key={idx}
                        type="bible"
                        evidence={evidence}
                        onCopy={copyToClipboard}
                        copiedId={copiedSection}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-16">
              {features.map((feature, idx) => (
                <div key={idx} className={`group p-6 rounded-2xl ${isDark ? 'bg-slate-900/50 border border-slate-800/50 hover:border-slate-700' : 'bg-white border border-slate-200/50 hover:border-slate-300'} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{feature.title}</h3>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Popular Topics */}
            {!analysis && !isLoading && (
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <Layers className="text-white" size={20} />
                  </div>
                  <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Popular Topics</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {predefinedTopics.slice(0, 8).map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => handleTopicSelect(topic.id)}
                      className={`group p-5 rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                        isDark ? 'bg-gradient-to-br from-slate-900 to-slate-800/80 border border-slate-700/50 hover:border-amber-500/50' : 'bg-gradient-to-br from-white to-slate-50 border border-slate-200/50 hover:border-amber-500/50'
                      }`}
                    >
                      <span className="text-3xl mb-3 block">{topic.icon}</span>
                      <h4 className={`font-bold text-lg mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{topic.title}</h4>
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{topic.category}</span>
                      <p className={`text-sm mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{topic.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* TOPICS PAGE */}
        {currentPage === 'topics' && (
          <div className="py-12">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold mb-6">
                <Compass size={16} />
                Scripture Topics
              </div>
              <h2 className={`text-4xl font-black mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Explore Theological Topics</h2>
              <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Browse through theological topics and discover what both Quran and Bible say.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {predefinedTopics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleTopicSelect(topic.id)}
                  className={`group p-6 rounded-2xl text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                    isDark ? 'bg-gradient-to-br from-slate-900 to-slate-800/80 border border-slate-700/50 hover:border-amber-500/50' : 'bg-gradient-to-br from-white to-slate-50 border border-slate-200/50 hover:border-amber-500/50'
                  }`}
                >
                  <span className="text-5xl mb-4 block">{topic.icon}</span>
                  <h4 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{topic.title}</h4>
                  <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium ${isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{topic.category}</span>
                  <p className={`text-sm mt-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{topic.description}</p>
                  <span className="inline-flex items-center gap-1 text-amber-400 text-sm font-semibold mt-4 group-hover:gap-2 transition-all">
                    Analyze <ChevronRight size={16} />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* DASHBOARD PAGE */}
        {currentPage === 'dashboard' && (
          <div className="py-12">
            <div className="mb-12">
              <h2 className={`text-4xl font-black mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Dashboard</h2>
              <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Your SAVIOR NOOR statistics and insights.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard icon={Target} title="Total Analyses" value={stats.totalAnalyses} color="from-violet-500 to-purple-500" />
              <StatCard icon={Bookmark} title="Bookmarks" value={bookmarks.length} color="from-amber-500 to-orange-500" />
              <StatCard icon={BookOpen} title="Quran Verses" value={stats.quranVersesViewed} color="from-emerald-500 to-teal-500" />
              <StatCard icon={BookOpen} title="Bible Verses" value={stats.bibleVersesViewed} color="from-blue-500 to-indigo-500" />
            </div>

            {/* Recent Activity */}
            <div className={`rounded-3xl ${isDark ? 'bg-slate-900/50 border border-slate-800/50' : 'bg-white border border-slate-200/50'} p-8`}>
              <h3 className={`text-xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>Recent Activity</h3>
              {history.length === 0 ? (
                <div className="text-center py-12">
                  <History className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                  <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`}>No analyses yet. Start by asking a question!</p>
                  <button onClick={() => navigate('home')} className="mt-4 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all">
                    Get Started
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.slice(0, 5).map((item) => (
                    <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl ${isDark ? 'bg-slate-800/50 hover:bg-slate-800' : 'bg-slate-50 hover:bg-slate-100'} transition-colors`}>
                      <div className="flex items-center gap-4">
                        <AnswerBadge answer={item.answer} />
                        <div>
                          <p className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.question}</p>
                          <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{new Date(item.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setAnalysis(item); navigate('home'); }} className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}>
                          <Eye size={18} />
                        </button>
                        <button onClick={() => deleteFromHistory(item.id)} className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* HISTORY PAGE */}
        {currentPage === 'history' && (
          <div className="py-12">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className={`text-4xl font-black mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Analysis History</h2>
                <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{history.length} analyses saved</p>
              </div>
              {history.length > 0 && (
                <div className="flex items-center gap-3">
                  <button onClick={() => exportAllHistory(history)} className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg">
                    <Download size={18} />
                    Export All
                  </button>
                  <button onClick={clearHistory} className="flex items-center gap-2 px-4 py-2.5 bg-red-500/20 text-red-400 border border-red-500/30 font-semibold rounded-xl hover:bg-red-500/30 transition-all">
                    <Trash2 size={18} />
                    Clear All
                  </button>
                </div>
              )}
            </div>

            {history.length === 0 ? (
              <div className={`text-center py-20 rounded-3xl ${isDark ? 'bg-slate-900/50 border border-slate-800/50' : 'bg-white border border-slate-200/50'}`}>
                <History className={`w-20 h-20 mx-auto mb-6 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>No History Yet</h3>
                <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Your analysis history will appear here</p>
                <button onClick={() => navigate('home')} className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg">
                  Start Analyzing
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {history.map((item) => (
                  <div key={item.id} className={`rounded-2xl p-6 ${isDark ? 'bg-slate-900/50 border border-slate-800/50 hover:border-slate-700' : 'bg-white border border-slate-200/50 hover:border-slate-300'} transition-all hover:shadow-xl`}>
                    <div className="flex items-center justify-between mb-4">
                      <AnswerBadge answer={item.answer} />
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleBookmark(item)} className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-800' : 'hover:bg-slate-100'} ${isBookmarked(item.id) ? 'text-amber-400' : isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                          {isBookmarked(item.id) ? <BookmarkCheck size={18} /> : <BookmarkPlus size={18} />}
                        </button>
                        <button onClick={() => deleteFromHistory(item.id)} className={`p-2 rounded-lg ${isDark ? 'hover:bg-slate-800 text-slate-500' : 'hover:bg-slate-100 text-slate-400'}`}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <h4 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.question}</h4>
                    <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.explanation}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{new Date(item.createdAt).toLocaleDateString()}</span>
                      <button onClick={() => { setAnalysis(item); navigate('home'); }} className="text-amber-400 text-sm font-medium hover:text-amber-300 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* BOOKMARKS PAGE */}
        {currentPage === 'bookmarks' && (
          <div className="py-12">
            <div className="mb-12">
              <h2 className={`text-4xl font-black mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Bookmarks</h2>
              <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{bookmarks.length} saved analyses</p>
            </div>

            {bookmarks.length === 0 ? (
              <div className={`text-center py-20 rounded-3xl ${isDark ? 'bg-slate-900/50 border border-slate-800/50' : 'bg-white border border-slate-200/50'}`}>
                <Bookmark className={`w-20 h-20 mx-auto mb-6 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>No Bookmarks Yet</h3>
                <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Save analyses you want to reference later</p>
                <button onClick={() => navigate('home')} className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg">
                  Start Exploring
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarks.map((item) => (
                  <div key={item.id} className={`rounded-2xl p-6 ${isDark ? 'bg-slate-900/50 border border-slate-800/50' : 'bg-white border border-slate-200/50'} hover:shadow-xl transition-all`}>
                    <div className="flex items-center justify-between mb-4">
                      <AnswerBadge answer={item.answer} />
                      <button onClick={() => toggleBookmark(item)} className="p-2 rounded-lg text-amber-400 hover:bg-amber-500/10">
                        <BookmarkCheck size={18} />
                      </button>
                    </div>
                    <h4 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.question}</h4>
                    <p className={`text-sm line-clamp-3 mb-4 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.explanation}</p>
                    <button onClick={() => { setAnalysis(item); navigate('home'); }} className="w-full py-2.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 font-medium rounded-xl hover:from-amber-500/30 hover:to-orange-500/30 transition-all">
                      View Analysis
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* COMPARE PAGE */}
        {currentPage === 'compare' && (
          <div className="py-12">
            <div className="text-center mb-12">
              <h2 className={`text-4xl font-black mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Compare Topics</h2>
              <p className={`text-lg max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Select multiple analyses to compare Quran and Bible perspectives side by side.</p>
            </div>

            {history.length < 2 ? (
              <div className={`text-center py-20 rounded-3xl ${isDark ? 'bg-slate-900/50 border border-slate-800/50' : 'bg-white border border-slate-200/50'}`}>
                <GitCompare className={`w-20 h-20 mx-auto mb-6 ${isDark ? 'text-slate-600' : 'text-slate-300'}`} />
                <h3 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Need More Analyses</h3>
                <p className={`mb-6 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Create at least 2 analyses to compare them</p>
                <button onClick={() => navigate('home')} className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg">
                  Start Analyzing
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {history.slice(0, 6).map((item) => (
                  <div key={item.id} className={`rounded-2xl p-6 ${isDark ? 'bg-slate-900/50 border border-slate-800/50' : 'bg-white border border-slate-200/50'}`}>
                    <div className="flex items-center gap-4 mb-4">
                      <input
                        type="checkbox"
                        checked={selectedAnalyses.includes(item.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAnalyses([...selectedAnalyses, item.id]);
                          } else {
                            setSelectedAnalyses(selectedAnalyses.filter(id => id !== item.id));
                          }
                        }}
                        className="w-5 h-5 rounded accent-amber-500"
                      />
                      <AnswerBadge answer={item.answer} />
                      <h4 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.question}</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-9">
                      <div className={`p-4 rounded-xl ${isDark ? 'bg-emerald-950/30 border border-emerald-800/20' : 'bg-emerald-50 border border-emerald-200'}`}>
                        <p className="text-xs text-emerald-500 font-semibold mb-2">QURAN ({item.quranEvidence.length} verses)</p>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.quranEvidence.slice(0, 2).map(e => e.translation).join(' ')}</p>
                      </div>
                      <div className={`p-4 rounded-xl ${isDark ? 'bg-blue-950/30 border border-blue-800/20' : 'bg-blue-50 border border-blue-200'}`}>
                        <p className="text-xs text-blue-500 font-semibold mb-2">BIBLE ({item.bibleEvidence.length} verses)</p>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.bibleEvidence.slice(0, 2).map(e => e.text).join(' ')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ABOUT PAGE */}
        {currentPage === 'about' && (
          <div className="py-12 max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold mb-6">
                <Info size={16} />
                About SAVIOR NOOR
              </div>
              <h2 className={`text-4xl font-black mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Our Mission</h2>
              <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Providing unbiased, evidence-based scriptural analysis to bridge understanding between faiths.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className={`p-8 rounded-3xl ${isDark ? 'bg-gradient-to-br from-emerald-950/50 to-slate-900/80 border border-emerald-800/30' : 'bg-gradient-to-br from-emerald-50 to-white border border-emerald-200/50'}`}>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-6 shadow-lg">
                  <BookOpen className="text-white" size={24} />
                </div>
                <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Quran API</h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Powered by al-quran.cloud providing authentic Quranic verses and translations.</p>
              </div>
              <div className={`p-8 rounded-3xl ${isDark ? 'bg-gradient-to-br from-blue-950/50 to-slate-900/80 border border-blue-800/30' : 'bg-gradient-to-br from-blue-50 to-white border border-blue-200/50'}`}>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-6 shadow-lg">
                  <BookOpen className="text-white" size={24} />
                </div>
                <h3 className={`text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Bible API</h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Powered by bible-api.com providing accurate Biblical verses and translations.</p>
              </div>
            </div>

            <div className={`p-8 rounded-3xl ${isDark ? 'bg-slate-900/50 border border-slate-800/50' : 'bg-slate-100/50 border border-slate-200/50'}`}>
              <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Key Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((f, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center shrink-0`}>
                      <f.icon className="text-white" size={18} />
                    </div>
                    <div>
                      <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{f.title}</h4>
                      <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{f.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS PAGE */}
        {currentPage === 'settings' && (
          <div className="py-12 max-w-2xl mx-auto">
            <div className="mb-12">
              <h2 className={`text-4xl font-black mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Settings</h2>
              <p className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Customize your SAVIOR NOOR experience.</p>
            </div>

            <div className={`rounded-3xl ${isDark ? 'bg-slate-900/50 border border-slate-800/50' : 'bg-white border border-slate-200/50'} p-8 space-y-6`}>
              {/* Theme */}
              <div className="flex items-center justify-between py-4 border-b border-slate-700/50">
                <div>
                  <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Theme</h4>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Choose your preferred appearance</p>
                </div>
                <div className="flex gap-2">
                  {['dark', 'light'].map((t) => (
                    <button
                      key={t}
                      onClick={() => toggleTheme()}
                      className={`px-4 py-2 rounded-xl font-medium capitalize transition-all ${
                        theme === t
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {t === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Show Arabic */}
              <div className="flex items-center justify-between py-4 border-b border-slate-700/50">
                <div>
                  <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Show Arabic Text</h4>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Display Arabic Quranic verses</p>
                </div>
                <button
                  onClick={() => setShowArabic(!showArabic)}
                  className={`w-14 h-8 rounded-full transition-all ${showArabic ? 'bg-amber-500' : isDark ? 'bg-slate-700' : 'bg-slate-300'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${showArabic ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Clear Data */}
              <div className="pt-4">
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                      clearHistory();
                      addToast('success', 'All data cleared successfully!');
                    }
                  }}
                  className="w-full py-4 bg-red-500/20 text-red-400 border border-red-500/30 font-semibold rounded-xl hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} />
                  Clear All Data
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Premium Footer */}
      <footer className={`mt-20 border-t ${isDark ? 'bg-slate-950/80 border-slate-800/50' : 'bg-slate-100/80 border-slate-200/50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>SAVIOR NOOR</h3>
                <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>Divine Scripture Analysis</p>
              </div>
            </div>
            <p className={`text-center lg:text-left max-w-md ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Evidence-based scriptural analysis using Quran and Bible APIs. No hallucinations, only truth.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-4 py-2 rounded-xl text-sm font-medium ${isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>Quran: al-quran.cloud</span>
              <span className={`px-4 py-2 rounded-xl text-sm font-medium ${isDark ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>Bible: bible-api.com</span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(100px); } to { opacity: 1; transform: translateX(0); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}

export default App;
