/**
 * Генерує триграми з тексту (послідовності з 3 символів)
 * Наприклад, для "книга" триграми: ["кни", "ниг", "ига"]
 */
export const generateTrigrams = (text) => {
  if (!text || text.length < 3) return [];
  
  const normalized = text.toLowerCase().trim();
  const trigrams = new Set();
  
  for (let i = 0; i <= normalized.length - 3; i++) {
    trigrams.add(normalized.substring(i, i + 3));
  }
  
  return Array.from(trigrams);
};

/**
 * Обчислює коефіцієнт подібності між пошуковим запитом та триграмами
 * Використовується для ранжування результатів
 */
export const calculateSimilarity = (searchText, trigrams) => {
  if (!trigrams || trigrams.length === 0) return 0;
  
  const searchTrigrams = generateTrigrams(searchText);
  if (searchTrigrams.length === 0) return 0;
  
  const matches = searchTrigrams.filter(t => trigrams.includes(t)).length;
  return matches / searchTrigrams.length;
};

/**
 * Шукає книги за триграмами з назви
 */
export const searchByTrigrams = (searchText) => {
  const trigrams = generateTrigrams(searchText);
  if (trigrams.length === 0) return null;
  
  return {
    trigrams: { $in: trigrams },
    similarity: { $gte: 0.3 }, // мінімум 30% подібності
  };
};
