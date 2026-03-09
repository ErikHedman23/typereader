export type WordToken = {
  text: string;
  index: number;
};

/**
 * Parse book content into individual word tokens.
 * Preserve whitespace and punctuation as part of words.
 */
export function parseBookIntoWords(content: string): WordToken[] {
  const words = content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);

  return words.map((text, index) => ({
    text,
    index,
  }));
}

/**
 * Get a slice of words for display (current + preview)
 * @param words
 * @param currentIndex
 * @param previewCount
 * @returns A slice of words centered around the current index with preview words before and after.
 */
export function getWordWindow(
  words: WordToken[],
  currentIndex: number,
  previewCount: number = 20,
): WordToken[] {
  const start = Math.max(0, currentIndex);
  const end = Math.min(words.length, currentIndex + previewCount);
  return words.slice(start, end);
}
