# SAVIOR NOOR

**Divine Scripture Analysis - Evidence-Based Quran & Bible Comparison**

SAVIOR NOOR is an interfaith scripture analysis application that provides honest, evidence-based answers to theological questions using real Quran and Bible API integrations. No hallucinations, only verified scripture references.

## Features

- **Quran Analysis**: Fetches real verses from al-quran.cloud API
- **Bible Analysis**: Fetches real verses from bible-api.com
- **Evidence-Based Answers**: Yes/No/Unclear with confidence levels
- **Verse Proofs**: Direct scripture references with translations
- **Dark/Light Mode**: Toggle between themes
- **Export Analysis**: Download analysis results as JSON
- **Copy to Clipboard**: Easily copy verse references

## Supported Topics

- Is Jesus God?
- The Trinity
- Jesus Crucifixion
- Oneness of God (Monotheism)
- Salvation
- Prophets
- Holy Spirit
- Jesus Return (Second Coming)

## Tech Stack

- React 18 + TypeScript
- Vite 6
- Tailwind CSS 3
- Lucide React Icons
- Quran API: al-quran.cloud
- Bible API: bible-api.com

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 8+

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/savior-noor.git
cd savior-noor

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

## API Sources

### Quran API
- **Provider**: al-quran.cloud
- **Endpoint**: `https://api.al-quran.cloud/v1`
- **Features**: Verse lookup, surah retrieval, translations

### Bible API
- **Provider**: bible-api.com
- **Endpoint**: `https://bible-api.com`
- **Features**: Verse lookup, multiple translations

## GitHub Actions CI/CD

The project includes automated CI/CD workflows:

- **Push/PR**: Runs linting, type checking, and build
- **Main branch**: Deploys to GitHub Pages

## Project Structure

```
savior-noor/
├── src/
│   ├── services/
│   │   ├── quranApi.ts          # Quran API integration
│   │   ├── bibleApi.ts          # Bible API integration
│   │   └── scriptureAnalysis.ts  # Analysis engine
│   ├── types/
│   │   └── index.ts             # TypeScript types
│   ├── App.tsx                  # Main application
│   └── main.tsx                 # Entry point
├── .github/
│   └── workflows/
│       └── deploy.yml           # CI/CD workflow
├── public/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## Usage

1. Ask a theological question in the search box
2. Or select a predefined topic from the popular topics
3. View the analysis with YES/NO/UNCLEAR answer
4. Review Quran and Bible evidence with verse references
5. Copy verses or export the full analysis

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License

---

**SAVIOR NOOR** - Seeking Truth Through Divine Scripture
