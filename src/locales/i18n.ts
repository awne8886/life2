import enLocale from './en.json';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  dir: 'ltr' | 'rtl';
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', dir: 'ltr' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', dir: 'ltr' },
  { code: 'fr', name: 'French', nativeName: 'Français', dir: 'ltr' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', dir: 'ltr' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
  { code: 'he', name: 'Hebrew', nativeName: 'עברית', dir: 'rtl' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', dir: 'ltr' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', dir: 'ltr' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', dir: 'ltr' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', dir: 'ltr' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', dir: 'ltr' },
  { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', dir: 'ltr' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', dir: 'ltr' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', dir: 'ltr' }
];

export type LocaleKey = string;

// In-memory locale store initialized with English
const localeStore: Record<string, Record<string, unknown>> = {
  en: enLocale
};

let currentLanguageCode = 'en';

export function setLanguage(code: string): void {
  const found = SUPPORTED_LANGUAGES.find((l) => l.code === code);
  if (found) {
    currentLanguageCode = code;
    document.documentElement.lang = code;
    document.documentElement.dir = found.dir;
  }
}

export function getCurrentLanguage(): LanguageOption {
  return SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguageCode) || SUPPORTED_LANGUAGES[0];
}

/**
 * Access nested translation key, e.g. t('hero.hook')
 */
export function t(path: string, fallback?: string): string {
  const currentDict = localeStore[currentLanguageCode] || localeStore.en;
  const parts = path.split('.');

  let value: unknown = currentDict;
  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = (value as Record<string, unknown>)[part];
    } else {
      value = undefined;
      break;
    }
  }

  if (typeof value === 'string') return value;

  // Fallback to English dictionary
  let fallbackValue: unknown = localeStore.en;
  for (const part of parts) {
    if (fallbackValue && typeof fallbackValue === 'object' && part in fallbackValue) {
      fallbackValue = (fallbackValue as Record<string, unknown>)[part];
    } else {
      fallbackValue = undefined;
      break;
    }
  }

  if (typeof fallbackValue === 'string') return fallbackValue;
  return fallback || path;
}
