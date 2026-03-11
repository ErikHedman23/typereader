"use client";

import { useState, useEffect, useRef } from "react";
import {
    parseBookIntoWords,
    getWordWindow,
    type WordToken,
} from "@/lib/utils/text";

type TypingEngineProps = {
    bookContent: string;
    initialWordIndex: number;
    bookId: string;
};

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
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);
    const currentWord = words[currentWordIndex];
    const isComplete = currentWordIndex >= words.length;
    const displayWords = getWordWindow(words, currentWordIndex, 15);

    const handleInputChange = (value: string) => {
        setCurrentInput(value);

        if (value.length === 0) {
            setIsCorrect(null);
        } else if (currentWord.text.startsWith(value)) {
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === " " || e.key === "Enter") {
            e.preventDefault();

            if (currentInput.trim().length > 0) {
                setCurrentWordIndex((prev) => prev + 1);
                setCurrentInput("");
                setIsCorrect(null);
            }
        }
    };

    if (isComplete) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900">
                        🎉 Book Complete!
                    </h2>
                    <p className="mt-2 text-gray-800">
                        You have finished typing through this book.
                    </p>
                </div>
            </div>
        );
    }
    return (
        <div className="space-y-8">
            {/* Text Display */}
            <div className="rounded-lg bg-gray-50 p-8 min-h-[300px]">
                <div className="text-2xl leading-relaxed">
                    {displayWords.map((word, idx) => {
                        const isCurrent = word.index === currentWordIndex;

                        return (
                            <span
                                key={word.index}
                                className={`
                      ${isCurrent ? "bg-blue-200 font-semibold px-1 rounded" : ""}
                      ${!isCurrent && word.index < currentWordIndex ? "text-gray-300" : "text-gray-900"}
                    `}
                            >
                                {word.text}{" "}
                            </span>
                        );
                    })}
                </div>
            </div>

            {/* Input Area */}
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Type the highlighted word:
                    </label>
                    <input
                        ref={inputRef}
                        type="text"
                        value={currentInput}
                        onChange={(e) => handleInputChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className={`
                  w-full text-2xl px-4 py-3 rounded-lg border-2 outline-none transition-colors text-gray-900
                  ${isCorrect === null ? "border-gray-300" : ""}
                  ${isCorrect === true ? "border-green-500 bg-green-50" : ""}
                  ${isCorrect === false ? "border-red-500 bg-red-50" : ""}
                `}
                        placeholder="Start typing..."
                        autoComplete="off"
                        autoCapitalize="off"
                        autoCorrect="off"
                        spellCheck="false"
                    />
                </div>

                <div className="flex items-center justify-between text-sm text-gray-900">
                    <div>
                        Target:{" "}
                        <span className="font-mono font-semibold">
                            {currentWord.text}
                        </span>
                    </div>
                    <div>
                        Progress: {currentWordIndex} / {words.length} words
                    </div>
                </div>

                <p className="text-sm text-gray-500">
                    Press{" "}
                    <kbd className="px-2 py-1 bg-gray-200 rounded">Space</kbd>{" "}
                    or{" "}
                    <kbd className="px-2 py-1 bg-gray-200 rounded">Enter</kbd>{" "}
                    to move to the next word
                </p>
            </div>
        </div>
    );
}
