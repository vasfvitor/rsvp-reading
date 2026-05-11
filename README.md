# RSVP Reader

A Svelte-based Rapid Serial Visual Presentation (RSVP) reader for speed reading with PDF and EPUB support.

## Online version / DEMO

Link: https://rsvp.n0name.eu/

<video src="rsvp-clip.mp4" controls width="600"></video>

## What is RSVP?

Rapid Serial Visual Presentation (RSVP) is a technique where text is displayed one word at a time at a fixed focal point. This eliminates the need for eye movements (saccades) during reading, potentially allowing for significantly faster reading speeds.

The app uses **Optimal Recognition Point (ORP)** highlighting - the red letter in each word indicates the point where your eye naturally focuses for fastest word recognition. This is calculated based on word length:

- 1-3 letter words: 1st letter
- 4-5 letter words: 2nd letter
- 6-9 letter words: 3rd letter
- 10+ letter words: 4th letter

## Features

- **PDF, EPUB, TXT & Markdown Support**: Upload documents or load bundled local presets
- **Adjustable reading speed**: 50-1000 words per minute (WPM)
- **ORP highlighting**: Red-highlighted focal letter for faster recognition
- **Monospace display**: Fixed-width font keeps the focal point stable
- **Focus mode**: Minimal UI during reading for distraction-free experience
- **Fade effect**: Optional smooth transitions between words
- **Punctuation pauses**: Configurable extra pause on sentence-ending punctuation
- **Periodic pauses**: Optional pause every N words for comprehension
- **Progress tracking**: Visual progress bar and time remaining
- **Save progress**: Save your reading session and resume later
- **Jump to position**: Skip to any word number or percentage in the text
- **Clickable progress bar**: Click anywhere on the progress bar to jump to that position
- **Keyboard shortcuts**: Full keyboard control for hands-free reading
- **Dark theme**: Easy on the eyes with black background

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/rsvp.git
cd rsvp

# Install dependencies
npm install

# Start development server
npm run dev
```

## Docker

Run the app using Docker Compose:

```bash
cd docker
docker compose up -d
```

The app will be available at http://localhost:8080

To rebuild after changes:

```bash
docker compose up -d --build
```

## Usage

### Running the App

```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Loading Content

**From Bundled Presets:**
1. Add `.pdf`, `.epub`, `.txt`, `.md`, or `.markdown` files to `src/presets/`
2. Run the app in dev mode
3. If there is no saved session, the first preset by filename loads automatically
4. Click the document icon to choose another bundled preset

**From Files:**
1. Click the document icon in the header
2. Click "Upload PDF, EPUB, TXT, or Markdown"
3. Select your supported file
4. The text will be extracted and loaded automatically

**From Text:**
1. Click the document icon in the header
2. Paste or type your text in the textarea
3. Click "Load Text"

### Controls

**Buttons:**
- **Play**: Start reading from the beginning or current position
- **Pause**: Pause reading (UI enters focus mode with minimal controls)
- **Resume**: Continue from where you paused
- **Stop**: Stop and reset to beginning
- **Restart**: Stop and immediately start from beginning

**Keyboard Shortcuts:**
| Key | Action |
|-----|--------|
| `Space` | Play/Pause/Resume |
| `Escape` | Exit focus mode (or close dialogs) |
| `Arrow Up` | Increase speed (+25 WPM) |
| `Arrow Down` | Decrease speed (-25 WPM) |
| `Arrow Left` | Go back one word |
| `Arrow Right` | Skip forward one word |
| `G` | Open jump to position dialog |
| `Ctrl+S` / `Cmd+S` | Save current progress |

### Saving and Resuming Progress

**Save Progress:**
- Click the save icon in the header (floppy disk icon)
- Or press `Ctrl+S` (Windows/Linux) or `Cmd+S` (Mac)
- Your current position, text, and all settings are saved to browser storage

**Resume Reading:**
- When you return to the app, you'll be prompted to resume your saved session
- Click "Resume" to continue from where you left off
- Click "Start Fresh" to begin with the default text

### Jump to Position

**Using the Jump Dialog:**
1. Click the code bracket icon in the header, or press `G`
2. Enter a word number (e.g., `150`) or percentage (e.g., `50%`)
3. Click "Go" or press Enter

**Quick Jump Buttons:**
- Use the preset buttons (Start, 25%, 50%, 75%) for quick navigation

**Clickable Progress Bar:**
- When not playing, click anywhere on the progress bar to jump directly to that position
- The progress bar expands on hover to make clicking easier

### Settings

Click the gear icon to access settings:

- **Words Per Minute**: Reading speed (50-1000 WPM)
- **Enable Fade Effect**: Smooth fade transition between words
- **Fade Duration**: Duration of fade effect (50-300ms)
- **Pause on Punctuation**: Extra pause at sentence endings
- **Punctuation Pause Multiplier**: How much longer to pause (1-4x)
- **Pause Every N Words**: Take a break every N words (0 = disabled)
- **Pause Duration**: Length of periodic pauses (100-2000ms)

## Project Structure

```
rsvp/
├── src/
│   ├── App.svelte              # Main application component
│   ├── app.css                 # Global styles
│   ├── main.js                 # Application entry point
│   ├── lib/
│   │   ├── rsvp-utils.js       # Core RSVP utility functions
│   │   ├── file-parsers.js     # Document parsing utilities
│   │   ├── preset-documents.js # Bundled preset discovery/loading
│   │   ├── progress-storage.js # Session save/load utilities
│   │   └── components/
│   │       ├── RSVPDisplay.svelte   # Word display component
│   │       ├── Controls.svelte      # Playback controls
│   │       ├── Settings.svelte      # Settings panel
│   │       ├── TextInput.svelte     # Text/file input panel
│   │       └── ProgressBar.svelte   # Progress indicator (clickable)
│   └── tests/
│       ├── setup.js                 # Test setup
│       ├── rsvp-utils.test.js       # RSVP utility tests
│       ├── file-parsers.test.js     # File parser tests
│       └── progress-storage.test.js # Progress storage tests
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Testing

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage
```

## API Reference

### Utility Functions (`src/lib/rsvp-utils.js`)

#### `parseText(text)`
Parses input text into an array of words.

```javascript
parseText('Hello world') // ['Hello', 'world']
```

#### `getORPIndex(word)`
Calculates the Optimal Recognition Point index for a word.

```javascript
getORPIndex('hello') // 1 (second letter 'e')
```

#### `getActualORPIndex(word)`
Gets the actual character index for ORP, accounting for leading punctuation.

```javascript
getActualORPIndex('"hello') // 2 (skips the quote)
```

#### `getWordDelay(word, wpm, pauseOnPunctuation, multiplier)`
Calculates the display delay for a word based on WPM and punctuation.

```javascript
getWordDelay('hello', 300) // 200 (ms)
getWordDelay('end.', 300, true, 2) // 400 (ms)
```

#### `formatTimeRemaining(remainingWords, wpm)`
Formats remaining time as MM:SS.

```javascript
formatTimeRemaining(300, 300) // '1:00'
```

#### `splitWordForDisplay(word)`
Splits a word into parts for ORP display.

```javascript
splitWordForDisplay('hello')
// { before: 'h', orp: 'e', after: 'llo' }
```

#### `shouldPauseAtWord(wordIndex, pauseAfterWords)`
Checks if reading should pause at the current word.

```javascript
shouldPauseAtWord(10, 10) // true
shouldPauseAtWord(5, 10)  // false
```

### File Parsers (`src/lib/file-parsers.js`)

#### `parsePDF(file)`
Extracts text content from a PDF file.

#### `parseEPUB(file)`
Extracts text content from an EPUB e-book.

#### `parseFile(file)`
Auto-detects file type and parses accordingly.

#### `getSupportedExtensions()`
Returns supported file extensions (`.pdf,.epub`).

### Progress Storage (`src/lib/progress-storage.js`)

#### `saveSession(session)`
Saves the current reading session to localStorage.

```javascript
saveSession({
  text: 'Your text content...',
  currentWordIndex: 150,
  totalWords: 500,
  settings: { wordsPerMinute: 300 }
}) // true
```

#### `loadSession()`
Loads a saved reading session from localStorage.

```javascript
const session = loadSession()
// { text: '...', currentWordIndex: 150, totalWords: 500, settings: {...}, savedAt: 1234567890 }
```

#### `hasSession()`
Checks if a saved session exists.

```javascript
hasSession() // true or false
```

#### `clearSession()`
Removes the saved session from localStorage.

```javascript
clearSession() // true
```

#### `getSessionSummary()`
Gets session info without loading the full text.

```javascript
getSessionSummary()
// { currentWordIndex: 150, totalWords: 500, savedAt: 1234567890, hasText: true }
```

#### `percentageToWordIndex(percentage, totalWords)`
Converts a percentage to a word index.

```javascript
percentageToWordIndex(50, 100) // 50
percentageToWordIndex(25, 200) // 50
```

#### `wordIndexToPercentage(wordIndex, totalWords)`
Converts a word index to a percentage.

```javascript
wordIndexToPercentage(50, 100) // 50
wordIndexToPercentage(25, 50) // 50
```

## Browser Support

Works in all modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Dependencies

- **pdfjs-dist**: PDF parsing
- **epubjs**: EPUB e-book parsing
- **Svelte 5**: UI framework
- **Vite**: Build tool

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Based on RSVP research in cognitive psychology
- Inspired by various speed reading applications
- Built with [Svelte](https://svelte.dev/) and [Vite](https://vitejs.dev/)
- PDF parsing powered by [PDF.js](https://mozilla.github.io/pdf.js/)
- EPUB parsing powered by [Epub.js](https://github.com/futurepress/epub.js/)
