import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";
import { getBooks } from "@/app/actions/books";
import BookUpload from "./components/BookUpload";
import BookList from "./components/BookList";

export default async function DashboardPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { books, error } = await getBooks();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Dashboard
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Welcome, {user?.email}
                        </p>
                    </div>
                    <form action={logout}>
                        <button
                            type="submit"
                            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
                        >
                            Logout
                        </button>
                    </form>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-1">
                        <BookUpload />
                    </div>
                    <div className="lg:col-span-2">
                        <h2 className="mb-4 text-xl font-semibold text-gray-900">
                            Your Books
                        </h2>
                        {error ? (
                            <div className="rounded-md bg-red-50 p-4">
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        ) : (
                            <BookList books={books || []} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
