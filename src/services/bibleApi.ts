// Bible API Service - Using bible-api.com
// Free public API with no authentication required

const API_BASE = 'https://bible-api.com';

export class BibleApiService {
  private static instance: BibleApiService;

  private constructor() {}

  static getInstance(): BibleApiService {
    if (!BibleApiService.instance) {
      BibleApiService.instance = new BibleApiService();
    }
    return BibleApiService.instance;
  }

  // Get a specific verse or passage
  async getVerse(reference: string): Promise<{
    reference: string;
    verses: Array<{
      verse: number;
      text: string;
    }>;
    text: string;
    translation: string;
  } | null> {
    try {
      const encodedRef = encodeURIComponent(reference);
      const response = await fetch(`${API_BASE}/${encodedRef}?translation=kjv`);

      if (!response.ok) throw new Error('Failed to fetch Bible verse');

      const data = await response.json();

      if (data.error) {
        console.error('Bible API error:', data.error);
        return null;
      }

      return {
        reference: data.reference,
        verses: data.verses || [],
        text: data.text,
        translation: data.translation
      };
    } catch (error) {
      console.error('Bible API error:', error);
      return null;
    }
  }

  // Get verse with specific translation
  async getVerseWithTranslation(reference: string, translation: string = 'kjv'): Promise<{
    reference: string;
    text: string;
    translation: string;
  } | null> {
    try {
      const encodedRef = encodeURIComponent(reference);
      const response = await fetch(`${API_BASE}/${encodedRef}?translation=${translation}`);

      if (!response.ok) throw new Error('Failed to fetch Bible verse');

      const data = await response.json();

      if (data.error) {
        return null;
      }

      return {
        reference: data.reference,
        text: data.text,
        translation: data.translation
      };
    } catch (error) {
      console.error('Bible API error:', error);
      return null;
    }
  }

  // Search Bible for specific terms (basic search through common passages)
  async searchBible(query: string): Promise<Array<{
    reference: string;
    text: string;
    book: string;
  }>> {
    // Predefined key passages for common theological searches
    const searchTerms = query.toLowerCase();

    const keyPassages = [
      'john 1:1',
      'john 3:16',
      'matthew 1:23',
      'isaiah 9:6',
      'titus 2:13',
      'hebrews 1:8',
      'philippians 2:6',
      'colossians 1:15',
      'romans 9:5',
      '1 john 5:20',
      'genesis 1:1',
      'exodus 20:2',
      'deuteronomy 6:4',
      'isaiah 43:10',
      'mark 12:29',
      'john 14:9',
      'john 10:30',
      'matthew 28:19',
      'luke 1:35',
      'romans 1:3',
      '1 corinthians 8:6',
      '1 timothy 2:5',
      'hebrews 4:15',
      'john 1:14',
      'romans 3:23',
      'ephesians 2:8',
      'titus 3:5'
    ];

    const results: Array<{
      reference: string;
      text: string;
      book: string;
    }> = [];

    // Search through key passages
    for (const passage of keyPassages) {
      if (passage.includes(searchTerms) || searchTerms.includes(passage.split(' ')[0])) {
        const verse = await this.getVerse(passage);
        if (verse && verse.text.toLowerCase().includes(searchTerms)) {
          results.push({
            reference: verse.reference,
            text: verse.text,
            book: verse.reference.split(' ')[0]
          });
        }
      }
    }

    // Direct text search in results
    const allPassages = [
      {ref: 'john 1:1', book: 'John'},
      {ref: 'john 3:16', book: 'John'},
      {ref: 'genesis 1:1', book: 'Genesis'},
      {ref: 'deuteronomy 6:4', book: 'Deuteronomy'},
      {ref: 'isaiah 9:6', book: 'Isaiah'},
      {ref: 'matthew 1:23', book: 'Matthew'},
      {ref: 'philippians 2:6', book: 'Philippians'},
      {ref: 'colossians 1:15', book: 'Colossians'},
      {ref: 'titus 2:13', book: 'Titus'},
      {ref: 'hebrews 1:8', book: 'Hebrews'},
      {ref: 'john 10:30', book: 'John'},
      {ref: 'john 14:9', book: 'John'},
      {ref: 'john 1:14', book: 'John'},
      {ref: '1 john 5:7', book: '1 John'},
      {ref: 'romans 9:5', book: 'Romans'},
      {ref: '1 timothy 3:16', book: '1 Timothy'},
      {ref: 'isaiah 7:14', book: 'Isaiah'},
      {ref: 'micah 5:2', book: 'Micah'}
    ];

    for (const {ref, book} of allPassages) {
      const verse = await this.getVerse(ref);
      if (verse && verse.text.toLowerCase().includes(searchTerms)) {
        if (!results.find(r => r.reference === verse.reference)) {
          results.push({
            reference: verse.reference,
            text: verse.text,
            book
          });
        }
      }
    }

    return results;
  }

  // Get key Bible verses for theological topics
  async getKeyVerses(topic: string): Promise<Array<{
    reference: string;
    text: string;
    context: string;
    book: string;
  }>> {
    // Predefined key verses for common theological topics
    const keyVerseMap: Record<string, Array<{reference: string; context: string}>> = {
      'jesus': [
        {reference: 'John 1:1', context: 'Jesus as the Word'},
        {reference: 'John 1:14', context: 'Jesus as Word made flesh'},
        {reference: 'John 3:16', context: 'God so loved the world'},
        {reference: 'Matthew 1:23', context: 'Immanuel - God with us'},
        {reference: 'Isaiah 9:6', context: 'Wonderful Counselor, Mighty God'},
        {reference: 'Titus 2:13', context: 'Great God and Savior Jesus Christ'},
        {reference: 'Colossians 1:15', context: 'Image of the invisible God'},
        {reference: 'Philippians 2:6', context: 'Form of God'},
        {reference: 'John 10:30', context: 'I and the Father are one'},
        {reference: 'John 14:9', context: 'Anyone who has seen me has seen the Father'}
      ],
      'god': [
        {reference: 'Genesis 1:1', context: 'In the beginning God'},
        {reference: 'Exodus 20:2', context: 'I am the LORD your God'},
        {reference: 'Deuteronomy 6:4', context: 'Hear O Israel - The LORD is one'},
        {reference: 'Isaiah 43:10', context: 'Before me no god was formed'},
        {reference: 'Isaiah 44:6', context: 'I am the first and I am the last'},
        {reference: 'Isaiah 45:5', context: 'There is no other god besides me'}
      ],
      'trinity': [
        {reference: 'Matthew 28:19', context: 'Baptize in name of Father, Son, Holy Spirit'},
        {reference: '2 Corinthians 13:14', context: 'Grace of Lord Jesus Christ...'},
        {reference: '1 Peter 1:2', context: 'Chosen by foreknowledge of Spirit'},
        {reference: 'John 1:1', context: 'Word was with God and was God'},
        {reference: 'Matthew 3:16-17', context: 'Baptism of Jesus - three persons'}
      ],
      'salvation': [
        {reference: 'Romans 3:23', context: 'All have sinned'},
        {reference: 'Romans 6:23', context: 'Wages of sin is death'},
        {reference: 'John 3:16', context: 'Whosoever believes'},
        {reference: 'Ephesians 2:8-9', context: 'By grace through faith'},
        {reference: 'Titus 3:5', context: 'Saved through regeneration'},
        {reference: 'Acts 4:12', context: 'Salvation in no other name'}
      ],
      'prophets': [
        {reference: 'Deuteronomy 18:18', context: 'I will raise up a prophet'},
        {reference: 'John 1:21', context: 'Are you Elijah? Are you the Prophet?'},
        {reference: 'Acts 3:22', context: 'A prophet like Moses'},
        {reference: 'Luke 24:44', context: 'Everything written about me'}
      ],
      'divinity': [
        {reference: 'John 1:1', context: 'The Word was God'},
        {reference: 'John 20:28', context: 'Thomas - My Lord and my God'},
        {reference: 'Romans 9:5', context: 'Christ who is over all, God blessed forever'},
        {reference: 'Titus 2:13', context: 'Our great God and Savior Jesus Christ'},
        {reference: 'Hebrews 1:8', context: 'Your throne O God'}
      ],
      'humanity': [
        {reference: 'Matthew 1:1', context: 'Book of the genealogy of Jesus'},
        {reference: 'Luke 1:31', context: 'You will conceive in your womb'},
        {reference: 'Luke 2:52', context: 'Jesus increased in wisdom'},
        {reference: 'Mark 13:32', context: 'No one knows the hour'},
        {reference: 'Philippians 2:7', context: 'Made in human likeness'}
      ]
    };

    const verseRefs = keyVerseMap[topic.toLowerCase()] || keyVerseMap['jesus'];
    const results: Array<{
      reference: string;
      text: string;
      context: string;
      book: string;
    }> = [];

    for (const ref of verseRefs) {
      const verse = await this.getVerse(ref.reference);
      if (verse) {
        results.push({
          reference: verse.reference,
          text: verse.text,
          context: ref.context,
          book: verse.reference.split(' ')[0]
        });
      }
    }

    return results;
  }

  // Get multiple verses for comprehensive analysis
  async getPassage(reference: string, verses: number = 5): Promise<{
    reference: string;
    text: string;
    verses: string[];
  } | null> {
    try {
      const verseData = await this.getVerse(reference);
      if (!verseData) return null;

      return {
        reference: verseData.reference,
        text: verseData.text,
        verses: verseData.verses.map(v => v.text)
      };
    } catch (error) {
      console.error('Bible passage error:', error);
      return null;
    }
  }
}

export const bibleApi = BibleApiService.getInstance();
