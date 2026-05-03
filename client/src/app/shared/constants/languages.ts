// Мовні коди та їх відображення
export const LANGUAGE_MAP = {
  'uk': { label: 'Українська', code: 'uk' },
  'en': { label: 'Англійська', code: 'en' },
  'pl': { label: 'Польська', code: 'pl' },
  'de': { label: 'Німецька', code: 'de' },
  'fr': { label: 'Французька', code: 'fr' },
  'other': { label: 'Інша', code: 'other' },
};

export const LANGUAGES = Object.values(LANGUAGE_MAP).map(l => l.label);

export const LANGUAGE_CODES = Object.values(LANGUAGE_MAP).map(l => l.code);

// Функція для отримання коду мови за назвою
export function getLanguageCode(label: string): string {
  const entry = Object.values(LANGUAGE_MAP).find(l => l.label === label);
  return entry?.code || 'uk'; // За замовчуванням українська
}

// Функція для отримання назви мови за кодом
export function getLanguageLabel(code: string): string {
  return LANGUAGE_MAP[code as keyof typeof LANGUAGE_MAP]?.label || 'Інша';
}

// Функція для форматування з урахуванням мови
export function formatWithLocale(value: any, locale: string = 'uk', options?: Intl.NumberFormatOptions): string {
  try {
    // Якщо це невідомий мовний код, використовуємо українську
    if (value instanceof Date) {
      return value.toLocaleDateString(locale === 'other' ? 'uk' : locale);
    }
    if (typeof value === 'number') {
      return value.toLocaleString(locale === 'other' ? 'uk' : locale, options);
    }
    return String(value);
  } catch (e) {
    // У разі помилки просто повертаємо значення як рядок
    return String(value);
  }
}
