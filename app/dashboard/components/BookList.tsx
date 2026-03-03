"use client";
import { deleteBook } from "@/app/actions/books";
import { useState } from "react";
import Link from "next/link";

type Book = {
    id: string;
    title: string;
    word_count: number;
    created_at: string;
    progress: {
        current_word_index: number;
        total_words_typed: number;
        total_errors: number;
        last_session_wpm: number | null;
        last_session_accuracy: number | null;
    } | null;
};

type BookListProps = {
    books: Book[];
};

export default function BookList({ books }: BookListProps) {
    const [deletingId, setDeletingId] = useState<string | null>(null);

    async function handleDelete(bookId: string) {
        if (
            !confirm(
                "Are you sure you want to delete this book?  This action cannot be undone.",
            )
        ) {
            return;
        }

        setDeletingId(bookId);
        await deleteBook(bookId);
        setDeletingId(null);
    }

    if (books.length === 0) {
        return (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
                <p className="text-gray-500">
                    No books uploaded yet. Upload your first book to get
                    started!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {books.map((book) => {
                const progressPercentage = book.progress
                    ? Math.round(
                          (book.progress.current_word_index / book.word_count) *
                              100,
                      )
                    : 0;

                return (
                    <div
                        key={book.id}
                        className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {book.title}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {book.word_count.toLocaleString()} words
                                </p>

                                {book.progress &&
                                    book.progress.current_word_index > 0 && (
                                        <div className="mt-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600">
                                                    Progress
                                                </span>
                                                <span className="font-medium text-gray-900">
                                                    {progressPercentage}%
                                                </span>
                                            </div>
                                            <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                                                <div
                                                    className="h-2 rounded-full bg-blue-600 transition-all"
                                                    style={{
                                                        width: `${progressPercentage}%`,
                                                    }}
                                                />
                                            </div>

                                            {book.progress.last_session_wpm && (
                                                <div className="mt-2 flex gap-4 text-sm text-gray-600">
                                                    <span>
                                                        WPM:{" "}
                                                        {book.progress.last_session_wpm.toFixed(
                                                            0,
                                                        )}
                                                    </span>
                                                    <span>
                                                        Accuracy:{" "}
                                                        {book.progress.last_session_accuracy?.toFixed(
                                                            1,
                                                        )}
                                                        %
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                            </div>

                            <div className="ml-4 flex flex-col gap-2">
                                <Link
                                    href={`/reader/${book.id}`}
                                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 text-center"
                                >
                                    {progressPercentage > 0
                                        ? "Continue"
                                        : "Start"}
                                </Link>
                                <button
                                    onClick={() => handleDelete(book.id)}
                                    disabled={deletingId === book.id}
                                    className="rounded-md border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                                >
                                    {deletingId === book.id
                                        ? "Deleting..."
                                        : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
