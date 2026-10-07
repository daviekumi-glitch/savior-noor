// Quran API Service - Using al-quran.cloud API
// Free public API with no authentication required

const API_BASE = 'https://api.al-quran.cloud/v1';

export class QuranApiService {
  private static instance: QuranApiService;

  private constructor() {}

  static getInstance(): QuranApiService {
    if (!QuranApiService.instance) {
      QuranApiService.instance = new QuranApiService();
    }
    return QuranApiService.instance;
  }

  // Get a specific verse from Quran
  async getVerse(surah: number, verse: number): Promise<{
    number: number;
    text: string;
    translation: string;
    surah: number;
  } | null> {
    try {
      const response = await fetch(
        `${API_BASE}/ayah/${surah}:${verse}/editions/quran-uthmani,en.pickthall`
      );

      if (!response.ok) throw new Error('Failed to fetch Quran verse');

      const data = await response.json();

      if (data.status === 'OK' && data.data) {
        const quranText = data.data[0];
        const translation = data.data[1];

        return {
          number: quranText.numberInSurah,
          text: quranText.text,
          translation: translation.text,
          surah: quranText.surah?.number || surah
        };
      }

      return null;
    } catch (error) {
      console.error('Quran API error:', error);
      return null;
    }
  }

  // Get entire surah with translations
  async getSurah(surahNumber: number, translation: string = 'en.pickthall'): Promise<{
    number: number;
    name: string;
    englishName: string;
    verses: Array<{
      number: number;
      text: string;
      translation: string;
    }>;
  } | null> {
    try {
      const response = await fetch(
        `${API_BASE}/surah/${surahNumber}/editions/quran-uthmani,${translation}`
      );

      if (!response.ok) throw new Error('Failed to fetch surah');

      const data = await response.json();

      if (data.status === 'OK' && data.data) {
        const surah = data.data[0];
        const trans = data.data[1];

        return {
          number: surah.number,
          name: surah.name,
          englishName: surah.englishName,
          verses: surah.ayahs.map((ayah: any, index: number) => ({
            number: ayah.numberInSurah,
            text: ayah.text,
            translation: trans.ayahs[index].text
          }))
        };
      }

      return null;
    } catch (error) {
      console.error('Quran API error:', error);
      return null;
    }
  }

  // Search Quran for specific terms
  async searchQuran(query: string): Promise<Array<{
    surah: number;
    verse: number;
    text: string;
    translation: string;
  }>> {
    try {
      // First get all surahs to search through
      const response = await fetch(`${API_BASE}/surah`);
      if (!response.ok) throw new Error('Failed to fetch surah list');

      const data = await response.json();
      const surahs = data.data;

      const results: Array<{
        surah: number;
        verse: number;
        text: string;
        translation: string;
      }> = [];

      // Search through first 10 surahs to avoid timeout (can expand)
      for (let i = 0; i < Math.min(surahs.length, 10); i++) {
        const surah = await this.getSurah(surahs[i].number);
        if (surah) {
          const queryLower = query.toLowerCase();
          surah.verses.forEach(verse => {
            if (verse.translation.toLowerCase().includes(queryLower) ||
                verse.text.includes(query)) {
              results.push({
                surah: surah.number,
                verse: verse.number,
                text: verse.text,
                translation: verse.translation
              });
            }
          });
        }
      }

      return results;
    } catch (error) {
      console.error('Quran search error:', error);
      return [];
    }
  }

  // Get key Quran verses for theological topics
  async getKeyVerses(topic: string): Promise<Array<{
    surah: number;
    verse: number;
    text: string;
    translation: string;
    context: string;
  }>> {
    // Predefined key verses for common theological topics
    const keyVerseMap: Record<string, Array<{surah: number; verse: number; context: string}>> = {
      'jesus': [
        {surah: 3, verse: 45, context: 'Jesus mentioned as Word of God'},
        {surah: 4, verse: 171, context: 'Jesus as word and spirit from God'},
        {surah: 5, verse: 17, context: 'Denial of divinity'},
        {surah: 5, verse: 72, context: 'Warning about associating partners with God'},
        {surah: 19, verse: 88, context: 'Exalted far above'},
        {surah: 112, verse: 1-4, context: 'Oneness of God - Al-Ikhlas'}
      ],
      'god': [
        {surah: 112, verse: 1, context: 'Say God is One'},
        {surah: 2, verse: 255, context: 'Ayat al-Kursi - Throne verse'},
        {surah: 3, verse: 2, context: 'God there is no deity except Him'},
        {surah: 59, verse: 22, context: 'He is God besides whom there is no god'}
      ],
      'trinity': [
        {surah: 4, verse: 171, context: 'People of the Book'},
        {surah: 5, verse: 73, context: 'God is far above three'},
        {surah: 5, verse: 116, context: 'Jesus disclaims worship'}
      ],
      'salvation': [
        {surah: 3, verse: 85, context: 'Submission to God'},
        {surah: 2, verse: 62, context: 'Those who believe and do righteousness'},
        {surah: 10, verse: 64, context: 'No change in God\'s creation'}
      ],
      'prophets': [
        {surah: 2, verse: 136, context: 'Belief in all prophets'},
        {surah: 3, verse: 84, context: 'We believe in God and what was revealed'}
      ]
    };

    const verseRefs = keyVerseMap[topic.toLowerCase()] || keyVerseMap['god'];
    const results: Array<{
      surah: number;
      verse: number;
      text: string;
      translation: string;
      context: string;
    }> = [];

    for (const ref of verseRefs) {
      const verse = await this.getVerse(ref.surah, ref.verse);
      if (verse) {
        results.push({
          surah: verse.surah,
          verse: verse.number,
          text: verse.text,
          translation: verse.translation,
          context: ref.context
        });
      }
    }

    return results;
  }

  // Get verse with multiple translations
  async getVerseTranslations(surah: number, verse: number): Promise<{
    arabic: string;
    translations: Record<string, string>;
  } | null> {
    try {
      const response = await fetch(
        `${API_BASE}/ayah/${surah}:${verse}/editions/quran-uthmani,en.pickthall,en.sahih,en.arberry`
      );

      if (!response.ok) throw new Error('Failed to fetch translations');

      const data = await response.json();

      if (data.status === 'OK' && data.data) {
        const translations: Record<string, string> = {};
        data.data.forEach((edition: any) => {
          translations[edition.language] = edition.text;
        });

        return {
          arabic: data.data[0].text,
          translations
        };
      }

      return null;
    } catch (error) {
      console.error('Quran translations error:', error);
      return null;
    }
  }
}

export const quranApi = QuranApiService.getInstance();
