import React, { useState } from 'react';
import {
  BookOpen, Search, Sparkles, Moon, Sun, Copy, Check, ArrowRight,
  Shield, Home, Layers, Compass, FileText, Info, Menu, X, ChevronRight,
  Quote, Scale, Globe, Zap, Heart, MessageCircle, GitBranch, Star
} from 'lucide-react';
import { scriptureAnalysis, AnalysisResult } from './services/scriptureAnalysis';

// Predefined topics for quick analysis
const predefinedTopics = [
  { id: 'jesus_god', title: 'Is Jesus God?', description: 'Compare Quran and Bible perspectives on Jesus\'s divinity', icon: '✝', category: 'Christology' },
  { id: 'trinity', title: 'The Trinity', description: 'Biblical and Quranic views on the concept of Trinity', icon: '☦', category: 'Theology' },
  { id: 'jesus_crucifixion', title: 'Jesus Crucifixion', description: 'Did Jesus die on the cross? Evidence from both scriptures', icon: '✝', category: 'Christology' },
  { id: 'god_one', title: 'Oneness of God', description: 'Monotheism in Quran and Bible', icon: '☀', category: 'Theology' },
  { id: 'salvation_faith', title: 'Salvation', description: 'How salvation is achieved according to both scriptures', icon: '🔑', category: 'Soteriology' },
  { id: 'prophets', title: 'Prophets', description: 'Common prophets in Quran and Bible', icon: '📜', category: 'Prophethood' },
  { id: 'holy_spirit', title: 'Holy Spirit', description: 'Nature of the Holy Spirit in both scriptures', icon: '🕊', category: 'Theology' },
  { id: 'jesus_return', title: 'Jesus Return', description: 'Second coming of Jesus in Quran and Bible', icon: '🔔', category: 'Eschatology' }
];

const features = [
  { icon: Scale, title: 'Evidence-Based', description: 'Real scripture references from authentic APIs', color: 'from-violet-500 to-purple-500' },
  { icon: Zap, title: 'No Hallucination', description: 'Verified answers with verse proofs', color: 'from-amber-500 to-orange-500' },
  { icon: Globe, title: 'Dual Scripture', description: 'Quran and Bible analysis combined', color: 'from-emerald-500 to-teal-500' },
  { icon: Heart, title: 'Unbiased Analysis', description: 'Honest answers without prejudice', color: 'from-rose-500 to-pink-500' },
];

function App() {
  const [question, setQuestion] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<'home' | 'topics' | 'about'>('home');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const analyzeQuestion = async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    try {
      const result = await scriptureAnalysis.analyzeQuestion(query);
      setAnalysis(result);
    } catch (err) {
      setError('Failed to analyze. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopicSelect = (topicId: string) => {
    const topic = predefinedTopics.find(t => t.id === topicId);
    if (topic) {
      setQuestion(topic.title + '?');
      analyzeQuestion(topic.title + '?');
    }
  };

  const copyToClipboard = async (text: string, section: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const getAnswerBadge = (answer: string) => {
    switch (answer) {
      case 'yes': return <span className="px-5 py-2 bg-gradient-to-r from-emerald-500/20 to-green-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-sm font-bold shadow-lg shadow-emerald-500/10">YES</span>;
      case 'no': return <span className="px-5 py-2 bg-gradient-to-r from-red-500/20 to-rose-500/20 text-red-400 border border-red-500/30 rounded-full text-sm font-bold shadow-lg shadow-red-500/10">NO</span>;
      default: return <span className="px-5 py-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-400 border border-amber-500/30 rounded-full text-sm font-bold shadow-lg shadow-amber-500/10">UNCLEAR</span>;
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    const config = {
      high: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
      medium: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
      low: { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30' }
    };
    const c = config[confidence as keyof typeof config];
    return (
      <span className={`px-3 py-1.5 ${c.bg} ${c.text} border ${c.border} rounded-full text-xs font-semibold`}>
        {confidence.toUpperCase()} CONFIDENCE
      </span>
    );
  };

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'}`}>
      {/* Premium Glass Header */}
      <header className={`sticky top-0 z-50 backdrop-blur-xl ${darkMode ? 'bg-slate-950/80 border-b border-slate-800/50' : 'bg-white/80 border-b border-slate-200/50'} shadow-2xl`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => setActiveView('home')}>
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center shadow-xl shadow-amber-500/30 group-hover:shadow-amber-500/50 transition-all duration-300 group-hover:scale-105">
                  <Shield className="w-7 h-7 text-white drop-shadow-lg" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
              </div>
              <div className="hidden sm:block">
                <h1 className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>SAVIOR NOOR</h1>
                <p className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Divine Scripture Analysis</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { id: 'home', label: 'Home', icon: Home },
                { id: 'topics', label: 'Topics', icon: Layers },
                { id: 'about', label: 'About', icon: Info }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as any)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                    activeView === item.id
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30'
                      : `${darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800/50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`
                  }`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button onClick={() => setDarkMode(!darkMode)} className={`p-2.5 rounded-xl transition-all duration-200 ${darkMode ? 'bg-slate-800/50 text-amber-400 hover:bg-slate-700/50 hover:text-amber-300' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'} backdrop-blur-sm`}>
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`lg:hidden p-2.5 rounded-xl ${darkMode ? 'bg-slate-800/50 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`lg:hidden border-t ${darkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-200'} backdrop-blur-xl`}>
            <div className="px-4 py-4 space-y-2">
              {[
                { id: 'home', label: 'Home', icon: Home },
                { id: 'topics', label: 'Topics', icon: Layers },
                { id: 'about', label: 'About', icon: Info }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveView(item.id as any); setMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    activeView === item.id
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400'
                      : `${darkMode ? 'text-slate-400 hover:bg-slate-800/50' : 'text-slate-600 hover:bg-slate-100'}`
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
        {activeView === 'home' && (
          <>
            {/* Hero Section */}
            <div className="text-center py-12 lg:py-20 relative">
              {/* Background Glow */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 rounded-full blur-3xl"></div>
              </div>

              <div className="relative">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold mb-8 shadow-lg shadow-amber-500/10">
                  <Sparkles size={16} />
                  Evidence-Based Scriptural Analysis
                </div>

                <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-black mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  Seek Truth Through
                  <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent mt-2">
                    Divine Scripture
                  </span>
                </h2>

                <p className={`text-lg lg:text-xl max-w-2xl mx-auto mb-10 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Get honest, evidence-based answers from Quran and Bible. No hallucinations, only verified scripture references.
                </p>
              </div>
            </div>

            {/* Search Box - Premium Card */}
            <div className="max-w-3xl mx-auto mb-16">
              <div className={`relative rounded-3xl ${darkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800/80 border border-slate-700/50' : 'bg-gradient-to-br from-white to-slate-50 border border-slate-200/50'} shadow-2xl shadow-black/10 p-2.5`}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className={`absolute left-5 top-1/2 -translate-y-1/2 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} size={22} />
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && analyzeQuestion(question)}
                      placeholder="Ask a theological question..."
                      className={`w-full pl-14 pr-5 py-4.5 rounded-2xl bg-transparent text-lg font-medium focus:outline-none transition-colors ${darkMode ? 'text-white placeholder-slate-500' : 'text-slate-900 placeholder-slate-400'}`}
                    />
                  </div>
                  <button
                    onClick={() => analyzeQuestion(question)}
                    disabled={isLoading || !question.trim()}
                    className="px-8 py-4.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-2xl hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        <span> Analyze</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-16">
              {features.map((feature, idx) => (
                <div key={idx} className={`group p-6 rounded-2xl ${darkMode ? 'bg-slate-900/50 border border-slate-800/50 hover:border-slate-700' : 'bg-white border border-slate-200/50 hover:border-slate-300'} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{feature.title}</h3>
                  <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="max-w-3xl mx-auto mb-8 p-4 bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/20 rounded-2xl text-red-400 backdrop-blur-sm">
                {error}
              </div>
            )}

            {/* Analysis Results */}
            {analysis && (
              <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn">
                {/* Answer Card - Premium */}
                <div className={`rounded-3xl ${darkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800/80 border border-slate-700/50' : 'bg-gradient-to-br from-white to-slate-50 border border-slate-200/50'} shadow-2xl shadow-black/10 overflow-hidden`}>
                  <div className="p-6 lg:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                      <h3 className={`text-xl lg:text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Analysis Result</h3>
                      <div className="flex items-center gap-3">
                        {getAnswerBadge(analysis.answer)}
                        {getConfidenceBadge(analysis.confidence)}
                      </div>
                    </div>
                    <p className={`text-lg leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{analysis.explanation}</p>
                    <div className={`mt-6 pt-6 border-t ${darkMode ? 'border-slate-700/50' : 'border-slate-200/50'}`}>
                      <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{analysis.summary}</p>
                    </div>
                  </div>
                </div>

                {/* Scripture Evidence Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Quran Evidence */}
                  <div className={`rounded-3xl ${darkMode ? 'bg-gradient-to-br from-emerald-950/50 to-slate-900/80 border border-emerald-800/30' : 'bg-gradient-to-br from-emerald-50 to-white border border-emerald-200/50'} p-6 shadow-xl`}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                        <BookOpen className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-emerald-400">Quran Evidence</h3>
                        <p className="text-sm text-emerald-400/70">{analysis.quranEvidence.length} verse(s) analyzed</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {analysis.quranEvidence.map((evidence, idx) => (
                        <div key={idx} className={`p-5 rounded-2xl ${darkMode ? 'bg-slate-900/60 border border-slate-700/30' : 'bg-white/70 border border-emerald-100/50'} backdrop-blur-sm`}>
                          <div className="flex items-start justify-between mb-3">
                            <span className="text-amber-400 font-bold text-lg">Quran {evidence.surah}:{evidence.verse}</span>
                            <button onClick={() => copyToClipboard(`Quran ${evidence.surah}:${evidence.verse}: "${evidence.translation}"`, `quran-${idx}`)} className={`p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-500' : 'hover:bg-emerald-50 text-slate-400'}`}>
                              {copiedSection === `quran-${idx}` ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                            </button>
                          </div>
                          <p className={`text-lg leading-relaxed mb-3 ${darkMode ? 'text-amber-300' : 'text-amber-700'} font-['Noto_Sans_Arabic']`}>{evidence.text}</p>
                          <p className={`text-sm mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{evidence.translation}</p>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-3 py-1 rounded-lg text-xs font-medium ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{evidence.relevance}</span>
                            <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                              evidence.strength === 'supporting' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                              evidence.strength === 'opposing' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                            }`}>{evidence.strength}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bible Evidence */}
                  <div className={`rounded-3xl ${darkMode ? 'bg-gradient-to-br from-blue-950/50 to-slate-900/80 border border-blue-800/30' : 'bg-gradient-to-br from-blue-50 to-white border border-blue-200/50'} p-6 shadow-xl`}>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <BookOpen className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-blue-400">Bible Evidence</h3>
                        <p className="text-sm text-blue-400/70">{analysis.bibleEvidence.length} verse(s) analyzed</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {analysis.bibleEvidence.map((evidence, idx) => (
                        <div key={idx} className={`p-5 rounded-2xl ${darkMode ? 'bg-slate-900/60 border border-slate-700/30' : 'bg-white/70 border border-blue-100/50'} backdrop-blur-sm`}>
                          <div className="flex items-start justify-between mb-3">
                            <span className="text-blue-400 font-bold text-lg">{evidence.reference}</span>
                            <button onClick={() => copyToClipboard(`${evidence.reference}: "${evidence.text}"`, `bible-${idx}`)} className={`p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-500' : 'hover:bg-blue-50 text-slate-400'}`}>
                              {copiedSection === `bible-${idx}` ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                            </button>
                          </div>
                          <p className={`text-sm leading-relaxed mb-3 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>"{evidence.text}"</p>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`px-3 py-1 rounded-lg text-xs font-medium ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{evidence.relevance}</span>
                            <span className={`px-3 py-1 rounded-lg text-xs font-medium ${
                              evidence.strength === 'supporting' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                              evidence.strength === 'opposing' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                              'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                            }`}>{evidence.strength}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Methodology & Export */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className={`rounded-2xl ${darkMode ? 'bg-slate-900/50 border border-slate-800/50' : 'bg-slate-100/50 border border-slate-200/50'} p-6`}>
                    <h4 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Methodology</h4>
                    <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{analysis.methodology}</p>
                  </div>
                  <button
                    onClick={() => {
                      const exportData = { question: analysis.question, answer: analysis.answer, confidence: analysis.confidence, explanation: analysis.explanation, quranEvidence: analysis.quranEvidence, bibleEvidence: analysis.bibleEvidence, exportedAt: new Date().toISOString() };
                      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url; a.download = `savior-noor-analysis-${Date.now()}.json`; a.click();
                    }}
                    className="flex items-center justify-center gap-2.5 px-6 py-4 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-2xl font-bold hover:from-slate-600 hover:to-slate-700 transition-all shadow-xl hover:shadow-2xl"
                  >
                    <GitBranch size={20} />
                    Export Analysis
                  </button>
                </div>
              </div>
            )}

            {/* Popular Topics */}
            {!analysis && !isLoading && (
              <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <Layers className="text-white" size={20} />
                  </div>
                  <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Popular Topics</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
                  {predefinedTopics.map((topic) => (
                    <button
                      key={topic.id}
                      onClick={() => handleTopicSelect(topic.id)}
                      className={`group p-6 rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                        darkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800/80 border border-slate-700/50 hover:border-amber-500/50' : 'bg-gradient-to-br from-white to-slate-50 border border-slate-200/50 hover:border-amber-500/50'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <span className="text-4xl">{topic.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>{topic.title}</h4>
                            <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{topic.category}</span>
                          </div>
                          <p className={`text-sm mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{topic.description}</p>
                          <span className="inline-flex items-center gap-1 text-amber-400 text-sm font-semibold group-hover:gap-2 transition-all">
                            Analyze <ChevronRight size={16} />
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeView === 'topics' && (
          <div className="py-12">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold mb-6">
                <Compass size={16} />
                Scripture Topics
              </div>
              <h2 className={`text-4xl font-black mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Explore Theological Topics</h2>
              <p className={`text-lg max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Browse through predefined theological topics and discover what both Quran and Bible say.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {predefinedTopics.map((topic, idx) => (
                <button
                  key={topic.id}
                  onClick={() => { handleTopicSelect(topic.id); setActiveView('home'); }}
                  className={`group p-6 rounded-2xl text-left transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                    darkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800/80 border border-slate-700/50 hover:border-amber-500/50' : 'bg-gradient-to-br from-white to-slate-50 border border-slate-200/50 hover:border-amber-500/50'
                  }`}
                >
                  <span className="text-5xl mb-4 block">{topic.icon}</span>
                  <h4 className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{topic.title}</h4>
                  <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium ${darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>{topic.category}</span>
                  <p className={`text-sm mt-3 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{topic.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeView === 'about' && (
          <div className="py-12 max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold mb-6">
                <Info size={16} />
                About SAVIOR NOOR
              </div>
              <h2 className={`text-4xl font-black mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Our Mission</h2>
              <p className={`text-lg ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Providing unbiased, evidence-based scriptural analysis to bridge understanding between faiths.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className={`p-8 rounded-3xl ${darkMode ? 'bg-gradient-to-br from-emerald-950/50 to-slate-900/80 border border-emerald-800/30' : 'bg-gradient-to-br from-emerald-50 to-white border border-emerald-200/50'}`}>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-6 shadow-lg">
                  <BookOpen className="text-white" size={24} />
                </div>
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Quran API</h3>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Powered by al-quran.cloud providing authentic Quranic verses and translations.</p>
              </div>
              <div className={`p-8 rounded-3xl ${darkMode ? 'bg-gradient-to-br from-blue-950/50 to-slate-900/80 border border-blue-800/30' : 'bg-gradient-to-br from-blue-50 to-white border border-blue-200/50'}`}>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-6 shadow-lg">
                  <BookOpen className="text-white" size={24} />
                </div>
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Bible API</h3>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Powered by bible-api.com providing accurate Biblical verses and translations.</p>
              </div>
            </div>

            <div className={`p-8 rounded-3xl ${darkMode ? 'bg-slate-900/50 border border-slate-800/50' : 'bg-slate-100/50 border border-slate-200/50'}`}>
              <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Key Features</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((f, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center shrink-0`}>
                      <f.icon className="text-white" size={18} />
                    </div>
                    <div>
                      <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{f.title}</h4>
                      <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>{f.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Premium Footer */}
      <footer className={`mt-20 border-t ${darkMode ? 'bg-slate-950/80 border-slate-800/50' : 'bg-slate-100/80 border-slate-200/50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>SAVIOR NOOR</h3>
                <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-500'}`}>Divine Scripture Analysis</p>
              </div>
            </div>

            <p className={`text-center lg:text-left max-w-md ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Evidence-based scriptural analysis using Quran and Bible APIs. No hallucinations, only truth.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <span className={`px-4 py-2 rounded-xl text-sm font-medium ${darkMode ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>Quran: al-quran.cloud</span>
              <span className={`px-4 py-2 rounded-xl text-sm font-medium ${darkMode ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>Bible: bible-api.com</span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
      `}</style>
    </div>
  );
}

export default App;
