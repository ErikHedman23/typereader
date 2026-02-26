"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadBook(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not authenticated" };
  }
  const file = formData.get("file") as File;
  const title = formData.get("title") as string;

  if (!file) {
    return { error: "No file provided" };
  }
  const content = await file.text();
  const words = content
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  const wordCount = words.length;

  if (wordCount === 0) {
    return { error: "File is empty or contains no valid words" };
  }
  const { data, error } = await supabase
    .from("books")
    .insert({
      user_id: user.id,
      title: title || file.name.replace(".txt", ""),
      content: content,
      word_count: wordCount,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }
  await supabase.from("reading_progess").insert({
    user_id: user.id,
    book_id: data.id,
    current_word_index: 0,
    total_words_typed: 0,
    total_errors: 0,
    total_time_seconds: 0,
  });

  revalidatePath("/dashboard");
  return { success: true, book: data };
}

export async function getBooks() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not authenticated" };
  }
  const { data: books, error } = await supabase
    .from("books")
    .select(
      `
      *,
      progress:reading_progress(*)
      `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return { error: error.message };
  }
  const booksWithProgress = books.map((book) => ({
    ...book,
    progress:
      Array.isArray(book.progress) && book.progress.length > 0
        ? book.progress[0]
        : null,
  }));

  return { books: booksWithProgress };
}

export async function deleteBook(bookId: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Not authenticated" };
  }
  const { error } = await supabase
    .from("books")
    .delete()
    .eq("id", bookId)
    .eq("user_id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
