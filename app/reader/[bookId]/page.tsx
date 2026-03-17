import { getBookForReading } from "@/app/actions/books";
import { notFound } from "next/navigation";
import Link from "next/link";
import TypingEngine from "@/app/dashboard/components/TypingEngine";

type Props = {
    params: Promise<{ bookId: string }>;
};

export default async function ReaderPage({ params }: Props) {
    const { bookId } = await params;
    const result = await getBookForReading(bookId);

    if (result.error || !result.book) {
        notFound();
    }
    const { book } = result;
    const currentWordIndex = book.progress?.current_word_index || 0;

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <div className="border-b border-gray-200 bg-white shadow-sm">
                <div className="mx-auto max-w-6xl px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Link
                                href="/dashboard"
                                className="text-sm text-blue-600 hover:text-blue-500 mb-2 inline-flex items-center gap-1"
                            >
                                <span>←</span> Back to Dashboard
                            </Link>
                            <h1 className="text-2xl font-bold text-gray-900">
                                {book.title}
                            </h1>
                            <p className="text-sm text-gray-500">
                                {book.word_count.toLocaleString()} words
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Typing Area */}
            <div className="mx-auto max-w-6xl px-8 py-8">
                <TypingEngine
                    bookContent={book.content}
                    initialWordIndex={currentWordIndex}
                    bookId={book.id}
                />
            </div>
        </div>
    );
}
