This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



Here are some details for if I need to start this up with claude for later: 

I'm building a typing practice web app similar to Monkeytype using TypeScript, Bun, Next.js (App Router), and Supabase. The app allows users to import .txt files (books) and practice typing by typing through the book word by word.

**Core Features:**
- Users can upload multiple .txt files
- Real-time word validation with error highlighting
- Track typing speed (WPM) and accuracy per session
- Save progress for each book (current word position)
- Can't backspace to previous words (like Monkeytype)
- Switch between books while preserving progress

**Tech Stack:**
- TypeScript throughout
- Bun runtime
- Next.js 15 App Router (Server & Client Components)
- Supabase (PostgreSQL + Auth)
- Tailwind CSS

**What We've Completed:**
1. ✅ Project setup with Next.js + Bun
2. ✅ Supabase database with tables: profiles, books, reading_progress
3. ✅ Row Level Security policies
4. ✅ Authentication (signup, login, logout) with middleware
5. ✅ Book upload functionality (parses .txt files, counts words)
6. ✅ Book management (list, delete)
7. ✅ Dashboard showing books with progress bars

**Database Schema:**
- `profiles`: user data (linked to auth.users)
- `books`: id, user_id, title, content, word_count, timestamps
- `reading_progress`: id, user_id, book_id, current_word_index, total_words_typed, total_errors, total_time_seconds, last_session_wpm, last_session_accuracy, timestamps

**File Structure:**
- `lib/supabase/client.ts` - Browser Supabase client
- `lib/supabase/server.ts` - Server Supabase client
- `lib/types/database.ts` - TypeScript types
- `app/actions/auth.ts` - Server actions for auth
- `app/actions/books.ts` - Server actions for books
- `app/login/page.tsx` - Login page
- `app/signup/page.tsx` - Signup page
- `app/dashboard/page.tsx` - Dashboard (server component)
- `app/dashboard/components/BookUpload.tsx` - Upload component
- `app/dashboard/components/BookList.tsx` - Book list component
- `middleware.ts` - Auth middleware for route protection

**Next Step:**
We need to build the typing reader interface at `/reader/[bookId]` where users actually type through the book. This needs:
- Display current word and upcoming words
- Real-time validation as user types
- Highlight errors immediately
- Prevent backspacing to previous words
- Track WPM and accuracy
- Save progress to database
- Handle word-by-word navigation

I'm a beginner learning these technologies. Guide me step-by-step, waiting for confirmation before proceeding to the next objective.
