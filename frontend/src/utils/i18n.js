// i18n utility for loading and accessing translations

const translations = {
  en: null,
  hi: null,
  ta: null,
  te: null,
  kn: null,
  ml: null,
  bn: null,
};

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'മലയാളം' },
  { code: 'bn', name: 'বাংলা' },
];

const DEFAULT_LANGUAGE = 'en';

// Load translation file dynamically
async function loadTranslation(languageCode) {
  if (translations[languageCode]) {
    return translations[languageCode];
  }

  try {
    const response = await fetch(`/locales/${languageCode}.json`);
    if (!response.ok) throw new Error(`Failed to load ${languageCode}`);
    const data = await response.json();
    translations[languageCode] = data;
    return data;
  } catch (error) {
    console.warn(`Failed to load ${languageCode}, falling back to English:`, error);
    if (languageCode !== DEFAULT_LANGUAGE) {
      return loadTranslation(DEFAULT_LANGUAGE);
    }
    return {};
  }
}

// Get nested translation value using dot notation
function getNestedTranslation(obj, path) {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return path; // Return the key path if translation not found
    }
  }
  
  return current;
}

// Get language from localStorage or return default
export function getSavedLanguage() {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  return localStorage.getItem('language') || DEFAULT_LANGUAGE;
}

// Save language to localStorage
export function saveLanguage(languageCode) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('language', languageCode);
  }
}

// Get translation by key (supports dot notation like 'brand.name')
export async function getTranslation(languageCode, key) {
  const data = await loadTranslation(languageCode);
  return getNestedTranslation(data, key);
}

// Batch load translations for a language
export async function loadAllTranslations(languageCode) {
  return loadTranslation(languageCode);
}

// Get supported languages list
export function getSupportedLanguages() {
  return SUPPORTED_LANGUAGES;
}

// Get language name by code
export function getLanguageName(code) {
  const lang = SUPPORTED_LANGUAGES.find(l => l.code === code);
  return lang ? lang.name : DEFAULT_LANGUAGE;
}

// Check if language is supported
export function isLanguageSupported(code) {
  return SUPPORTED_LANGUAGES.some(l => l.code === code);
}
