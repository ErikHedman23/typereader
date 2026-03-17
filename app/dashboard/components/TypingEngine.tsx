"use client";

import { useState, useEffect, useRef } from "react";
import {
    parseBookIntoWords,
    getWordWindow,
    type WordToken,
} from "@/lib/utils/text";
import { useTypingStats } from "@/app/reader/hooks/useTypingStats";
import { useAutoSave } from "@/app/reader/hooks/useAutoSave";

type TypingEngineProps = {
    bookContent: string;
    initialWordIndex: number;
    bookId: string;
};

type WordStatus = "pending" | "correct" | "incorrect" | "current";

export default function TypingEngine({
    bookContent,
    initialWordIndex,
    bookId,
}: TypingEngineProps) {
    const [words] = useState<WordToken[]>(() =>
        parseBookIntoWords(bookContent),
    );
    const [currentWordIndex, setCurrentWordIndex] = useState(initialWordIndex);
    const [currentInput, setCurrentInput] = useState("");
    const [wordStatuses, setWordStatuses] = useState<
        Map<number, "correct" | "incorrect">
    >(new Map());
    const [hasError, setHasError] = useState(false);
    const textContainerRef = useRef<HTMLDivElement>(null);
    const currentWordRef = useRef<HTMLSpanElement>(null);
    const hiddenInputRef = useRef<HTMLInputElement>(null);
    const { stats, startTimer, recordWord } = useTypingStats();

    useAutoSave(
        {
            bookId,
            currentWordIndex,
            totalWordsTyped: stats.totalWordsTyped,
            totalErrors: stats.totalErrors,
            totalTimeSeconds: stats.elapsedSeconds,
            lastSessionWpm: stats.currentWpm,
            lastSessionAccuracy: stats.currentAccuracy,
        },
        currentWordIndex > initialWordIndex,
    );

    useEffect(() => {
        hiddenInputRef.current?.focus();
        currentWordRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }, []);

    useEffect(() => {
        currentWordRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }, [currentWordIndex]);

    useEffect(() => {
        const handleClick = () => {
            hiddenInputRef.current?.focus();
        };
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, []);
    const currentWord = words[currentWordIndex];
    const isComplete = currentWordIndex >= words.length;
    const getWordStatus = (wordIndex: number): WordStatus => {
        if (wordIndex === currentWordIndex) return "current";
        if (wordIndex > currentWordIndex) return "pending";
        return wordStatuses.get(wordIndex) || "pending";
    };

    const handleInputChange = (value: string) => {
        if (stats.startTime === null && value.length > 0) {
            startTimer();
        }
        setCurrentInput(value);

        if (value.length > 0 && !currentWord.text.startsWith(value)) {
            setHasError(true);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && currentInput.length === 0) {
            e.preventDefault();
            return;
        }

        if (e.key === " ") {
            e.preventDefault();

            if (currentInput.trim().length > 0) {
                const wasCorrect: boolean =
                    currentInput === currentWord.text && !hasError;
                setWordStatuses((prev) =>
                    new Map(prev).set(
                        currentWordIndex,
                        wasCorrect ? "correct" : "incorrect",
                    ),
                );
                recordWord(!wasCorrect);
                setCurrentWordIndex((prev) => prev + 1);
                setCurrentInput("");
                setHasError(false);
            }
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    if (isComplete) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center space-y-4">
                    <h2 className="text-3xl font-bold text-gray-900">
                        🎉 Book Complete!
                    </h2>
                    <p className="text-gray-600">
                        You have finished typing through this book.
                    </p>

                    <div className="mt-8 rounded-lg bg-gray-50 p-6 inline-block">
                        <h3 className="font-semibold text-gray-900 mb-4">
                            Final Statistics
                        </h3>
                        <div className="grid grid-cols-2 gap-6 text-left">
                            <div>
                                <div className="text-sm text-gray-600">
                                    Words Typed
                                </div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {stats.totalWordsTyped}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">
                                    Errors
                                </div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {stats.totalErrors}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">
                                    Average WPM
                                </div>
                                <div className="text-2xl font-bold text-blue-600">
                                    {stats.currentWpm}
                                </div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-600">
                                    Accuracy
                                </div>
                                <div className="text-2xl font-bold text-green-600">
                                    {stats.currentAccuracy.toFixed(1)}%
                                </div>
                            </div>
                            <div className="col-span-2">
                                <div className="text-sm text-gray-600">
                                    Total Time
                                </div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {formatTime(stats.elapsedSeconds)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Stats Bar */}
            <div className="grid grid-cols-5 gap-3">
                <div className="rounded-lg bg-blue-50 px-4 py-3">
                    <div className="text-xs text-blue-600 font-medium">WPM</div>
                    <div className="text-2xl font-bold text-blue-700">
                        {stats.currentWpm}
                    </div>
                </div>
                <div className="rounded-lg bg-green-50 px-4 py-3">
                    <div className="text-xs text-green-600 font-medium">
                        Accuracy
                    </div>
                    <div className="text-2xl font-bold text-green-700">
                        {stats.currentAccuracy.toFixed(1)}%
                    </div>
                </div>
                <div className="rounded-lg bg-red-50 px-4 py-3">
                    <div className="text-xs text-red-600 font-medium">
                        Errors
                    </div>
                    <div className="text-2xl font-bold text-red-700">
                        {stats.totalErrors}
                    </div>
                </div>
                <div className="rounded-lg bg-purple-50 px-4 py-3">
                    <div className="text-xs text-purple-600 font-medium">
                        Time
                    </div>
                    <div className="text-2xl font-bold text-purple-700">
                        {formatTime(stats.elapsedSeconds)}
                    </div>
                </div>
                <div className="rounded-lg bg-gray-100 px-4 py-3">
                    <div className="text-xs text-gray-600 font-medium">
                        Progress
                    </div>
                    <div className="text-2xl font-bold text-gray-700">
                        {((currentWordIndex / words.length) * 100).toFixed(0)}%
                    </div>
                </div>
            </div>

            {/* Current Word Input Display */}
            <div className="rounded-lg border-2 border-blue-500 bg-blue-50 p-4">
                <div className="text-sm text-blue-700 font-medium mb-2">
                    Current Word:
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-3xl font-mono font-bold text-gray-400">
                        {currentWord.text}
                    </div>
                    <div className="text-3xl font-mono font-bold text-blue-700 border-b-4 border-blue-500 min-w-[200px]">
                        {currentInput}
                        <span className="animate-pulse">|</span>
                    </div>
                </div>
            </div>

            {/* Book Text Display */}
            <div
                ref={textContainerRef}
                className="rounded-lg bg-gray-50 p-8 max-h-[500px] overflow-y-auto border border-gray-200"
                onClick={() => hiddenInputRef.current?.focus()}
            >
                <div className="text-xl leading-relaxed select-none cursor-text font-mono">
                    {words.map((word) => {
                        const status = getWordStatus(word.index);
                        const isCurrent = word.index === currentWordIndex;

                        return (
                            <span
                                key={word.index}
                                ref={isCurrent ? currentWordRef : null}
                                className={`
                      transition-colors duration-150
                      ${status === "current" ? "bg-yellow-200 font-bold px-1 rounded" : ""}
                      ${status === "correct" ? "text-green-600" : ""}
                      ${status === "incorrect" ? "text-red-500 line-through decoration-2" : ""}
                      ${status === "pending" ? "text-gray-500" : ""}
                    `}
                            >
                                {word.text}{" "}
                            </span>
                        );
                    })}
                </div>
            </div>

            {/* Hidden Input */}
            <input
                ref={hiddenInputRef}
                type="text"
                value={currentInput}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                className="opacity-0 absolute pointer-events-none"
                autoComplete="off"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck="false"
            />

            {/* Instructions */}
            <div className="text-center text-sm text-gray-500 space-y-1">
                <p>
                    Type the highlighted word and press{" "}
                    <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">
                        Space
                    </kbd>{" "}
                    to continue
                </p>
                <p className="text-xs">
                    Click anywhere to refocus • Scroll to see your progress
                </p>
            </div>
        </div>
    );
}
