import { useEffect, useRef } from "react";
import { updateReadingProgress } from "@/app/actions/books";

type AutoSaveData = {
  bookId: string;
  currentWordIndex: number;
  totalWordsTyped: number;
  totalErrors: number;
  totalTimeSeconds: number;
  lastSessionWpm: number;
  lastSessionAccuracy: number;
};

export function useAutoSave(data: AutoSaveData, enabled: boolean) {
  const lastSavedIndex = useRef(data.currentWordIndex);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (data.currentWordIndex !== lastSavedIndex.current) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(async () => {
        await updateReadingProgress(data.bookId, {
          current_word_index: data.currentWordIndex,
          total_words_typed: data.totalWordsTyped,
          total_errors: data.totalErrors,
          total_time_seconds: data.totalTimeSeconds,
          last_session_wpm: data.lastSessionWpm,
          last_session_accuracy: data.lastSessionAccuracy,
        });

        lastSavedIndex.current = data.currentWordIndex;
        console.log("Progress saved: ", data.currentWordIndex);
      }, 2000);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [data, enabled]);

  useEffect(() => {
    return () => {
      if (enabled && data.currentWordIndex !== lastSavedIndex.current) {
        updateReadingProgress(data.bookId, {
          current_word_index: data.currentWordIndex,
          total_words_typed: data.totalWordsTyped,
          total_errors: data.totalErrors,
          total_time_seconds: data.totalTimeSeconds,
          last_session_wpm: data.lastSessionWpm,
          last_session_accuracy: data.lastSessionAccuracy,
        });
      }
    };
  }, [enabled, data]);
}
