import { useState, useEffect, useRef } from "react";

type TypingStats = {
  startTime: number | null;
  totalWordsTyped: number;
  totalErrors: number;
  currentWpm: number;
  currentAccuracy: number;
  elapsedSeconds: number;
};

type FinalTypingStats = {
  stats: number;
  startTimer: number;
  recordWord: (hadError: boolean) => TypingStats;
  resetStats: () => TypingStats;
};

export function useTypingStats(): FinalTypingStats {
  const [stats, setStats] = useState<TypingStats>({
    startTime: null,
    totalWordsTyped: 0,
    totalErrors: 0,
    currentWpm: 0,
    currentAccuracy: 100,
    elapsedSeconds: 0,
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimer = () => {
    if (stats.startTime === null) {
      setStats((prev) => ({ ...prev, startTime: Date.now() }));
    }
  };

  useEffect(() => {
    if (stats.startTime !== null) {
      timerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - stats.startTime!) / 1000);
        setStats((prev) => ({ ...prev, elapsedSeconds: elapsed }));
      }, 1000);
      return () => {
        if (timerRef.current) {
          clearInterval(timerRef.current);
        }
      };
    }
  }, [stats.startTime]);

  const recordWord = (hadError: boolean) => {
    setStats((prev) => {
      const newTotalWords = prev.totalWordsTyped + 1;
      const newTotalErrors = prev.totalErrors + (hadError ? 1 : 0);
      const elapsedMinutes = prev.elapsedSeconds / 60;
      const wpm =
        elapsedMinutes > 0 ? Math.round(newTotalWords / elapsedMinutes) : 0;
      const accuracy =
        newTotalWords > 0
          ? ((newTotalWords - newTotalErrors) / newTotalWords) * 100
          : 100;

      return {
        ...prev,
        totalWordsTyped: newTotalWords,
        totalErrors: newTotalErrors,
        currentWpm: wpm,
        currentAccuracy: Math.max(0, accuracy),
      };
    });
  };

  const resetStats = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStats({
      startTime: null,
      totalWordsTyped: 0,
      totalErrors: 0,
      currentWpm: 0,
      currentAccuracy: 100,
      elapsedSeconds: 0,
    });
  };

  return {
    stats: stats,
    startTimer,
    recordWord,
    resetStats,
  };
}
