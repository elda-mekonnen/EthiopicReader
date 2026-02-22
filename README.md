# Kidase Reader

A digital reader for the Divine Liturgy (Qidase) of the Ethiopian Orthodox Tewahedo Church. Displays liturgical texts in Ge'ez, Amharic, English, and transliteration with speaker role indicators and section-based navigation.

## Features

- Multilingual text display: Ge'ez, Amharic, English, and transliteration
- 3 main liturgical sections: Kidan (Prayer of the Covenant), Serate Kidase (Preparatory Service), and Fere Kidase (14 Anaphoras)
- 14 Anaphoras including St. Basil, St. Mary, St. Cyril, Apostles, Our Lord, and more
- Speaker role indicators (priest, deacon, congregation)
- Adjustable font size
- Persistent language and display preferences
- Dark theme UI
- Runs on iOS, Android, and web

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Expo Go](https://expo.dev/go) app on your phone (easiest way to run it)

### Install dependencies

```bash
npm install
```

### Run the app

```bash
npx expo start
```

Scan the QR code with the Expo Go app on your phone to open it. You can also press `w` to open it in a web browser.

## Local Admin Server

A browser-based editor for updating the liturgical JSON data files without touching code.

### Run the admin server

```bash
node admin-server.js
```

Then open **http://localhost:3001** in your browser. No npm install needed — uses only Node.js built-ins.

### What you can do

- **Edit** prayer block text in any language (Ge'ez, Amharic, English, Transliteration), block type, and speaker role
- **Add** new sections and blocks
- **Delete** sections and blocks
- **Reorder** by dragging blocks up/down within a section, or drag a block onto a different section to move it there
- **Save to Disk** writes changes directly back to the JSON files in `data/`

All 17 data files are available: `kidan.json`, `serate-kidase.json`, and all 14 anaphoras under `anaphoras/`.

> Changes take effect in the app on next reload — no rebuild required since the data is read from JSON at runtime.

## Project Structure

```
EthiopicReader/
├── app/
│   ├── _layout.tsx              # Root layout (providers, navigation)
│   ├── +not-found.tsx           # 404 screen
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab bar (Kidase, Settings)
│   │   ├── index.tsx            # Home screen — section list & language toggle
│   │   └── settings.tsx         # Settings screen
│   ├── reader/
│   │   └── [section].tsx        # Reader view for Kidan & Serate Kidase
│   └── anaphora/
│       ├── index.tsx            # Anaphora list
│       └── [id].tsx             # Individual anaphora reader
├── components/
│   ├── PrayerBlock.tsx          # Renders a single prayer block
│   ├── PresentationView.tsx     # Presentation/display layout
│   └── SectionDrawer.tsx        # Section navigation drawer
├── context/
│   ├── LanguageContext.tsx       # Language selection state
│   └── FontSizeContext.tsx       # Font size state
├── data/
│   ├── types.ts                 # TypeScript types (PrayerBlock, LiturgicalSection, etc.)
│   ├── kidan.ts                 # Kidan liturgical text
│   ├── serate-kidase.ts         # Serate Kidase liturgical text
│   └── anaphoras/               # 14 anaphora data files
├── constants/                   # Colors, language labels
├── admin-server.js              # Local admin HTTP server (node admin-server.js)
├── admin-ui.html                # Admin UI served by the server
├── app.json                     # Expo config
├── tsconfig.json
└── package.json
```

## Tech Stack

- [Expo](https://expo.dev/) (SDK 54)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Expo Router](https://docs.expo.dev/router/introduction/) (file-based routing)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) (persisted preferences)
