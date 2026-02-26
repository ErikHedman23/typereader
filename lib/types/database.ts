export type Book = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  word_count: number;
  created_at: string;
  updated_at: string;
};

export type ReadingProgress = {
  id: string;
  user_id: string;
  book_id: string;
  current_word_index: number;
  total_words_typed: number;
  total_errors: number;
  total_time_seconds: number;
  last_session_wpm: number | null;
  last_session_accuracy: number | null;
  created_at: string;
  updated_at: string;
};

export type BookWithProgress = Book & {
  progress: ReadingProgress | null;
};
