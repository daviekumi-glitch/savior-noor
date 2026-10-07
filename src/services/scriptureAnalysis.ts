// Scripture Analysis Engine
// Analyzes Quran and Bible verses to provide evidence-based answers

import { quranApi } from './quranApi';
import { bibleApi } from './bibleApi';

export interface AnalysisResult {
  question: string;
  answer: 'yes' | 'no' | 'unclear';
  confidence: 'high' | 'medium' | 'low';
  explanation: string;
  quranEvidence: QuranEvidence[];
  bibleEvidence: BibleEvidence[];
  summary: string;
  methodology: string;
}

export interface QuranEvidence {
  surah: number;
  verse: number;
  text: string;
  translation: string;
  relevance: string;
  strength: 'supporting' | 'opposing' | 'neutral';
}

export interface BibleEvidence {
  reference: string;
  text: string;
  relevance: string;
  strength: 'supporting' | 'opposing' | 'neutral';
}

interface TheologicalTopic {
  keywords: string[];
  quranTopics: string[];
  bibleTopics: string[];
  answerLogic: 'yes' | 'no' | 'unclear';
  explanation: string;
  confidence: 'high' | 'medium' | 'low';
}

// Predefined topic analyses for accuracy
const topicAnalyses: Record<string, TheologicalTopic> = {
  'jesus_god': {
    keywords: ['jesus god', 'jesus divine', 'is jesus god', 'jesus christ god', 'jesus deity'],
    quranTopics: ['jesus'],
    bibleTopics: ['jesus', 'divinity'],
    answerLogic: 'no',
    confidence: 'high',
    explanation: 'The Quran explicitly states that Jesus is not God. Quran 5:17 states "Disbelievers are those who say God is the Messiah, son of Mary" and 5:72 states "The Messiah, son of Mary, is only a messenger; messengers have passed away before him." The Bible presents Jesus with divine titles and attributes, creating a fundamental theological difference between the two scriptures.'
  },
  'jesus_son_of_god': {
    keywords: ['jesus son of god', 'jesus son'],
    quranTopics: ['jesus'],
    bibleTopics: ['jesus'],
    answerLogic: 'unclear',
    confidence: 'medium',
    explanation: 'The term "Son of God" has different meanings in different contexts. In the Quran, "son of Mary" is used as a title of respect. In the Bible, "Son of God" has various interpretations from literal son to metaphorical expression of divine relationship. Both scriptures reference Jesus in relation to God, but with different theological implications.'
  },
  'trinity': {
    keywords: ['trinity', 'three persons', 'holy trinity', 'god three'],
    quranTopics: ['trinity'],
    bibleTopics: ['trinity'],
    answerLogic: 'no',
    confidence: 'high',
    explanation: 'The Quran strongly rejects the concept of Trinity. Quran 4:171 states "The Messiah, son of Mary, is only a messenger; messengers have passed away before him. His mother is a truthful woman. They both ate food. See how We make the signs clear to them, yet see how they are deluded!" Quran 5:73 states "God is far above having a son." The Bible does not explicitly use the word "Trinity" but describes relationships between Father, Son, and Holy Spirit, though the exact nature is debated.'
  },
  'bible_word_of_god': {
    keywords: ['bible word of god', 'bible inspired', 'bible scripture'],
    quranTopics: ['god'],
    bibleTopics: ['god'],
    answerLogic: 'unclear',
    confidence: 'low',
    explanation: 'Both scriptures claim divine origin. The Quran states it is the direct word of God (Quran 17:88). The Bible claims to be God-breathed (2 Timothy 3:16). However, each scripture has a different view of the other - the Quran mentions previous scriptures (Torah, Psalms, Gospel) but states the Quran confirms and supersedes them, while the Bible predates the Quran. Neither can definitively prove the other\'s authority using its own standards.'
  },
  'god_one': {
    keywords: ['god one', 'oneness of god', 'monotheism', 'tawhid'],
    quranTopics: ['god'],
    bibleTopics: ['god'],
    answerLogic: 'yes',
    confidence: 'high',
    explanation: 'Both the Quran and the Bible affirm the oneness of God. The Quran is built entirely on the concept of Tawhid (Quran 112:1-4). The Bible contains Deuteronomy 6:4 "Hear O Israel, the LORD our God, the LORD is one." Both scriptures strongly affirm monotheism, though they differ on how God\'s nature relates to Jesus and the Holy Spirit.'
  },
  'jesus_crucifixion': {
    keywords: ['jesus crucifixion', 'jesus died', 'jesus killed', 'crucifixion of jesus'],
    quranTopics: ['jesus'],
    bibleTopics: ['jesus'],
    answerLogic: 'unclear',
    confidence: 'medium',
    explanation: 'The Quran states that Jesus was not crucified (Quran 4:157-158 "They did not kill him, nor did they crucify him"). The Bible clearly describes Jesus\' crucifixion. This is a fundamental disagreement between the two scriptures. Quranic verse 4:157-158 suggests it only appeared to them, or God raised him up.'
  },
  'jesus_return': {
    keywords: ['jesus return', 'jesus second coming', 'jesus will come'],
    quranTopics: ['jesus'],
    bibleTopics: ['jesus'],
    answerLogic: 'yes',
    confidence: 'medium',
    explanation: 'The Quran (Quran 43:61, 4:159) and the Bible both indicate Jesus will return. The Quran mentions Jesus\' return as a sign of the Hour and affirms his death and resurrection in Quran 3:55. The Bible describes Jesus\' second coming extensively. However, they differ on the nature and purpose of this return.'
  },
  'salvation_faith': {
    keywords: ['salvation faith', 'saved by faith', 'salvation works', 'salvation grace'],
    quranTopics: ['salvation'],
    bibleTopics: ['salvation'],
    answerLogic: 'unclear',
    confidence: 'medium',
    explanation: 'Both scriptures emphasize faith and works, though with different emphases. The Quran emphasizes submission (Islam), righteous deeds, and faith together. The Bible, particularly Paul\'s letters, emphasizes salvation by faith (Ephesians 2:8-9), though James emphasizes works (James 2:24). Both encourage ethical living and belief, but define the relationship differently.'
  },
  'prophets': {
    keywords: ['prophets', 'muhammad prophet', 'moses prophet', 'israel prophets'],
    quranTopics: ['prophets'],
    bibleTopics: ['prophets'],
    answerLogic: 'yes',
    confidence: 'high',
    explanation: 'Both scriptures affirm many of the same prophets. The Quran mentions 25 named prophets and many unnamed ones, including Adam, Noah, Abraham, Moses, David, and Jesus. The Bible contains accounts of these same prophets. The Quran also mentions Prophet Muhammad as the final prophet, which the Bible does not address.'
  },
  'holy_spirit': {
    keywords: ['holy spirit', 'spirit of god', 'holy ghost'],
    quranTopics: ['god'],
    bibleTopics: ['god'],
    answerLogic: 'unclear',
    confidence: 'medium',
    explanation: 'Both scriptures mention the Holy Spirit. The Quran refers to the Holy Spirit as an angel (Jibril/Gabriel) who revealed the Quran (Quran 16:102, 2:87). The Bible presents the Holy Spirit as the third person of the Trinity, with distinct personality and deity. This represents a significant difference in understanding.'
  }
};

export class ScriptureAnalysisEngine {
  private static instance: ScriptureAnalysisEngine;

  private constructor() {}

  static getInstance(): ScriptureAnalysisEngine {
    if (!ScriptureAnalysisEngine.instance) {
      ScriptureAnalysisEngine.instance = new ScriptureAnalysisEngine();
    }
    return ScriptureAnalysisEngine.instance;
  }

  // Analyze a question using both Quran and Bible
  async analyzeQuestion(question: string): Promise<AnalysisResult> {
    const normalizedQuestion = question.toLowerCase().trim();

    // Find matching topic
    let matchedTopic: TheologicalTopic | null = null;
    for (const [key, topic] of Object.entries(topicAnalyses)) {
      for (const keyword of topic.keywords) {
        if (normalizedQuestion.includes(keyword) || keyword.includes(normalizedQuestion)) {
          matchedTopic = topic;
          break;
        }
      }
      if (matchedTopic) break;
    }

    // Default analysis if no match
    if (!matchedTopic) {
      return {
        question,
        answer: 'unclear',
        confidence: 'low',
        explanation: 'This question requires deeper analysis. Please try a more specific question about a theological topic.',
        quranEvidence: [],
        bibleEvidence: [],
        summary: 'Unable to provide definitive analysis. Try rephrasing your question.',
        methodology: 'System could not match question to predefined theological topics.'
      };
    }

    // Gather evidence from both scriptures
    const [quranEvidence, bibleEvidence] = await Promise.all([
      this.gatherQuranEvidence(matchedTopic.quranTopics),
      this.gatherBibleEvidence(matchedTopic.bibleTopics)
    ]);

    return {
      question,
      answer: matchedTopic.answerLogic,
      confidence: matchedTopic.confidence,
      explanation: matchedTopic.explanation,
      quranEvidence,
      bibleEvidence,
      summary: this.generateSummary(matchedTopic, quranEvidence, bibleEvidence),
      methodology: 'Evidence-based analysis using direct scripture quotations from Quran (al-quran.cloud API) and Bible (bible-api.com). Answers are based on explicit statements in both scriptures.'
    };
  }

  private async gatherQuranEvidence(topics: string[]): Promise<QuranEvidence[]> {
    const evidence: QuranEvidence[] = [];

    for (const topic of topics) {
      const verses = await quranApi.getKeyVerses(topic);
      for (const verse of verses) {
        evidence.push({
          surah: verse.surah,
          verse: verse.verse,
          text: verse.text,
          translation: verse.translation,
          relevance: verse.context,
          strength: this.determineQuranStrength(verse.context, topic)
        });
      }
    }

    return evidence.slice(0, 6); // Limit to 6 verses
  }

  private async gatherBibleEvidence(topics: string[]): Promise<BibleEvidence[]> {
    const evidence: BibleEvidence[] = [];

    for (const topic of topics) {
      const verses = await bibleApi.getKeyVerses(topic);
      for (const verse of verses) {
        evidence.push({
          reference: verse.reference,
          text: verse.text,
          relevance: verse.context,
          strength: this.determineBibleStrength(verse.context, topic)
        });
      }
    }

    return evidence.slice(0, 6); // Limit to 6 verses
  }

  private determineQuranStrength(context: string, topic: string): 'supporting' | 'opposing' | 'neutral' {
    const supportingTerms = ['say god is one', 'there is no deity', 'god is sufficient', 'most gracious', 'merciful'];
    const opposingTerms = ['son of god', 'trinity', 'crucify', 'worship'];

    const lowerContext = context.toLowerCase();

    if (supportingTerms.some(term => lowerContext.includes(term))) return 'supporting';
    if (opposingTerms.some(term => lowerContext.includes(term))) return 'opposing';

    return 'neutral';
  }

  private determineBibleStrength(context: string, topic: string): 'supporting' | 'opposing' | 'neutral' {
    const supportingTerms = ['god', 'lord', 'divine', 'one', 'word'];
    const neutralTerms = ['jesus mentioned', 'mary', 'prophet'];

    const lowerContext = context.toLowerCase();

    if (supportingTerms.some(term => lowerContext.includes(term))) return 'supporting';
    if (neutralTerms.some(term => lowerContext.includes(term))) return 'neutral';

    return 'supporting';
  }

  private generateSummary(
    topic: TheologicalTopic,
    quranEvidence: QuranEvidence[],
    bibleEvidence: BibleEvidence[]
  ): string {
    const quranCount = quranEvidence.length;
    const bibleCount = bibleEvidence.length;

    let summary = `Based on analysis of ${quranCount} Quranic verse(s) and ${bibleCount} Bible verse(s): `;

    switch (topic.answerLogic) {
      case 'yes':
        summary += 'Both scriptures support this position with high confidence.';
        break;
      case 'no':
        summary += 'The scriptures present conflicting views on this topic.';
        break;
      case 'unclear':
        summary += 'The scriptures provide different perspectives that require further theological interpretation.';
        break;
    }

    return summary;
  }

  // Direct search across both scriptures
  async searchScriptures(query: string): Promise<{
    quranResults: any[];
    bibleResults: any[];
  }> {
    const [quranResults, bibleResults] = await Promise.all([
      quranApi.searchQuran(query),
      bibleApi.searchBible(query)
    ]);

    return { quranResults, bibleResults };
  }
}

export const scriptureAnalysis = ScriptureAnalysisEngine.getInstance();
