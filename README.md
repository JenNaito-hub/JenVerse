# JENVERSE

A premium AI workspace for **knowledge generation** and **image creation**.

> **Runs with or without a backend.** Every integration degrades gracefully:
> with an empty `.env.local` the app runs in **demo mode** (mock data, auth
> bypassed, AI returns preview responses). Add a key and that feature switches
> to the real provider automatically — no code changes needed.

## Tech stack

| Layer       | Choice                                   |
| ----------- | ---------------------------------------- |
| Framework   | [Next.js 14](https://nextjs.org) (App Router) |
| Language    | TypeScript                               |
| Styling     | Tailwind CSS                             |
| Components  | shadcn/ui (Radix primitives)             |
| Icons       | lucide-react                             |
| Database\*  | Supabase                                 |
| Text AI\*   | OpenAI                                   |
| Image AI\*  | OpenAI · Google Gemini                   |

\* Planned for the API integration phase — placeholders only in V1.

## Features

- **Auth** — login, signup and password-reset pages backed by Supabase (bypassed in demo mode).
- **Dashboard** — stat cards, weekly usage chart, activity feed, quick actions, recent projects.
- **Knowledge AI** — chat workspace wired to `/api/knowledge` (OpenAI / Gemini) with conversation history, model picker and prompt starters.
- **Image AI** — prompt composer wired to `/api/image` (DALL·E / Gemini) with a generated-image gallery.
- **Templates** — curated prompt library for Knowledge & Image AI with filtering and a "use template" dialog.
- **Projects** — filterable project grid with status, progress, members and a create-project dialog.
- **History** — searchable log of every generation, persisted to Supabase when configured.
- **Settings** — profile, workspace, billing, API keys and notification preferences.

## How the backend wiring works

| Concern        | When configured                                   | Demo fallback                |
| -------------- | ------------------------------------------------- | ---------------------------- |
| **Auth**       | Supabase email/password + protected routes        | Auth bypassed, straight in   |
| **Knowledge**  | OpenAI (`gpt-*`) or Gemini via `/api/knowledge`    | Preview response             |
| **Image**      | OpenAI (DALL·E / GPT Image) or Gemini via `/api/image` | Random sample image     |
| **Data**       | Reads/writes Supabase (`history`, `projects`, …)   | Mock datasets in `src/data`  |

Detection lives in `src/lib/env.ts`; the AI providers in `src/lib/ai/`; the
data-access layer in `src/lib/db.ts`. The Supabase schema is in
`supabase/schema.sql`.

## Design system

| Token            | Value     |
| ---------------- | --------- |
| Canvas / background | `#F5F6F2` |
| Primary (lime)   | `#D7F205` |
| Dark / foreground | `#1F1F1F` |

Tokens are defined as CSS variables in `src/app/globals.css` and mapped in
`tailwind.config.ts`.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3100](http://localhost:3100) — the root route redirects
to `/dashboard`. (The dev server runs on port `3100` so it won't clash with
another app on `3000`.)

### Scripts

| Script              | Description                |
| ------------------- | -------------------------- |
| `npm run dev`       | Start the dev server       |
| `npm run build`     | Production build           |
| `npm run start`     | Serve the production build |
| `npm run lint`      | Lint with ESLint           |
| `npm run typecheck` | Type-check with `tsc`      |

## Project structure

```
src/
├── app/
│   ├── (app)/              # Authenticated app shell (sidebar + topbar)
│   │   ├── dashboard/
│   │   ├── knowledge/
│   │   ├── image/
│   │   ├── projects/
│   │   ├── history/
│   │   └── settings/
│   ├── globals.css         # Design tokens + base styles
│   ├── layout.tsx          # Root layout + providers
│   └── page.tsx            # Redirects to /dashboard
├── components/
│   ├── ui/                 # shadcn/ui primitives
│   ├── layout/             # Sidebar, topbar, mobile nav, logo
│   ├── shared/             # PageHeader, EmptyState
│   ├── dashboard/          # Dashboard feature components
│   ├── knowledge/          # Knowledge AI chat
│   ├── image/              # Image AI studio
│   ├── projects/           # Project cards + views
│   ├── history/            # History list
│   └── settings/           # Settings tabs
├── config/                 # Navigation config
├── data/                   # Mock data (swap for APIs later)
├── lib/                    # Utilities + constants
└── types/                  # Shared TypeScript types
```

## Enabling real providers

1. Copy `.env.example` → `.env.local`.
2. Add any of: `OPENAI_API_KEY`, `GEMINI_API_KEY`, and/or the Supabase keys.
3. For Supabase, create a project and run `supabase/schema.sql` in its SQL editor.
4. Restart `npm run dev`. Configured features switch from mock to live automatically.

## Roadmap

1. **V1** — Frontend with mock data. ✅
2. **V2 (this release)** — Auth, OpenAI/Gemini generation, Supabase persistence with graceful demo fallback. ✅
3. **V3** — Streaming responses, team collaboration, billing & usage metering.
