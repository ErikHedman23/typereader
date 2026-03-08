"use client";

import { uploadBook } from "@/app/actions/books";
import { useState } from "react";

export default function BookUpload() {
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsUploading(true);
        setError(null);
        setSuccess(null);

        const result = await uploadBook(formData);

        if (result.error) {
            setError(result.error);
        } else {
            setSuccess("Book uploaded successfully!");
            const form = document.getElementById(
                "upload-form",
            ) as HTMLFormElement;
            form?.reset();
        }

        setIsUploading(false);
    }

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Upload a Book
            </h2>

            {error && (
                <div className="mb-4 rounded-md bg-red-50 p-4">
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            {success && (
                <div className="mb-4 rounded-md bg-green-50 p-4">
                    <p className="text-sm text-green-800">{success}</p>
                </div>
            )}

            <form id="upload-form" action={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-900"
                    >
                        Book Title (optional)
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        placeholder="Leave empty to use filename"
                        className="mt-1 block w-full rounded-md border text-gray-900 border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label
                        htmlFor="file"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Text File (.txt)
                    </label>
                    <input
                        type="file"
                        name="file"
                        id="file"
                        accept=".txt"
                        required
                        className="mt-1 block w-full text-sm text-gray-900
                  file:mr-4 file:rounded-md file:border-0
                  file:bg-blue-50 file:px-4 file:py-2
                  file:text-sm file:font-semibold file:text-blue-700
                  hover:file:bg-blue-100"
                    />
                    <p className="mt-1 text-xs text-gray-900">
                        Upload a .txt file containing the book you want to type
                        through
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {isUploading ? "Uploading..." : "Upload Book"}
                </button>
            </form>
        </div>
    );
}
