"use client";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from 'next/link';

export default function Home() {
    const [connected, setConnected] = useState(false);
    useEffect(() => {
        const supabase = createClient();
        supabase
            .from("books")
            .select("count")
            .then(({ error }) => {
                setConnected(!error);
            });
    }, []);

    return (
       <>
            <div className="p-8">
                <h1 className="text-2xl font-bold">Welcome to TypeReader</h1>
                <p>
                    Supabase Status: {connected ? "Connected" : "Not Connected"}
                </p>
            </div>

            <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
                 <div className="text-center">
                   <h1 className="text-6xl font-bold text-gray-900">TypeReader</h1>
                   <p className="mt-4 text-xl text-gray-600">
                     Practice typing by reading your favorite books
                   </p>
                   <div className="mt-8 flex gap-4 justify-center">
                     <Link
                       href="/signup"
                       className="rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white hover:bg-blue-500"
                     >
                       Get Started
                     </Link>
                     <Link
                       href="/login"
                       className="rounded-md border border-gray-300 bg-white px-6 py-3 text-lg font-semibold text-gray-900 hover:bg-gray-50"
                     >
                       Sign In
                     </Link>
                   </div>
                 </div>
               </div>
       </>
    );
}
