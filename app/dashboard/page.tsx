import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/actions/auth";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <form action={logout}>
                        <button type="submit" className="rounded-md bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-500">
                            Logout
                        </button>
                    </form>
              </div>
                <p className="text-gray-600">Welcome, { user?.email}</p>
                <p className="mt-4 text-gray-500">Your books will appear here soon...</p>
            </div>
        </div>
    );
}
