/**
 * Progress storage utilities for persisting reading sessions
 */

const SESSION_STORAGE_KEY = 'rsvp-reading-session';
const PREFERENCES_STORAGE_KEY = 'rsvp-reading-preferences';

/**
 * Save the current reading session to localStorage
 * @param {Object} session - The session data to save
 * @param {string} session.text - The full text being read
 * @param {number} session.currentWordIndex - Current position in the text
 * @param {number} session.totalWords - Total word count
 * @param {Object} session.settings - Reader settings
 * @param {string|null} session.activePresetId - Active preset document
 * @returns {boolean} Whether the save was successful
 */
export function saveSession(session) {
  try {
    const data = {
      text: session.text,
      currentWordIndex: session.currentWordIndex,
      totalWords: session.totalWords,
      settings: session.settings,
      activePresetId: session.activePresetId ?? null,
      savedAt: Date.now()
    };
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save session:', error);
    return false;
  }
}

/**
 * Load a saved reading session from localStorage
 * @returns {Object|null} The saved session data or null if none exists
 */
export function loadSession() {
  try {
    const data = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load session:', error);
    return null;
  }
}

/**
 * Check if a saved session exists
 * @returns {boolean} Whether a saved session exists
 */
export function hasSession() {
  try {
    return localStorage.getItem(SESSION_STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

/**
 * Clear the saved session from localStorage
 * @returns {boolean} Whether the clear was successful
 */
export function clearSession() {
  try {
    localStorage.removeItem(SESSION_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear session:', error);
    return false;
  }
}

/**
 * Get a summary of the saved session without loading full text
 * @returns {Object|null} Summary with wordIndex, totalWords, savedAt, or null
 */
export function getSessionSummary() {
  try {
    const data = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!data) return null;
    const parsed = JSON.parse(data);
    return {
      currentWordIndex: parsed.currentWordIndex,
      totalWords: parsed.totalWords,
      savedAt: parsed.savedAt,
      hasText: !!parsed.text
    };
  } catch {
    return null;
  }
}

/**
 * Save reader preferences to localStorage.
 * @param {Object} preferences - The preferences to save
 * @param {Object} preferences.settings - Reader settings
 * @param {string|null} preferences.activePresetId - Last active preset document
 * @returns {boolean} Whether the save was successful
 */
export function savePreferences(preferences) {
  try {
    const data = {
      settings: preferences.settings,
      activePresetId: preferences.activePresetId ?? null,
      savedAt: Date.now()
    };
    localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save preferences:', error);
    return false;
  }
}

/**
 * Load reader preferences from localStorage.
 * @returns {Object|null} The saved preferences or null if none exist
 */
export function loadPreferences() {
  try {
    const data = localStorage.getItem(PREFERENCES_STORAGE_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load preferences:', error);
    return null;
  }
}

/**
 * Clear saved reader preferences from localStorage.
 * @returns {boolean} Whether the clear was successful
 */
export function clearPreferences() {
  try {
    localStorage.removeItem(PREFERENCES_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Failed to clear preferences:', error);
    return false;
  }
}

/**
 * Calculate word index from a percentage
 * @param {number} percentage - Percentage (0-100)
 * @param {number} totalWords - Total word count
 * @returns {number} The word index
 */
export function percentageToWordIndex(percentage, totalWords) {
  if (!totalWords || totalWords <= 0) return 0;
  const clamped = Math.max(0, Math.min(100, percentage));
  return Math.floor((clamped / 100) * totalWords);
}

/**
 * Calculate percentage from word index
 * @param {number} wordIndex - Current word index
 * @param {number} totalWords - Total word count
 * @returns {number} The percentage (0-100)
 */
export function wordIndexToPercentage(wordIndex, totalWords) {
  if (!totalWords || totalWords <= 0) return 0;
  return Math.round((wordIndex / totalWords) * 100);
}
