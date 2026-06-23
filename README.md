# JENVERSE

A premium AI workspace for **knowledge generation** and **image creation**.

> **MVP V1 — Frontend only.** This release ships a fully designed, interactive
> UI powered entirely by mock data. No backend or AI APIs are wired yet; the
> data layer is intentionally isolated so the integration phase can swap mocks
> for live calls without touching the UI.

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

- **Dashboard** — stat cards, weekly usage chart, activity feed, quick actions, recent projects.
- **Knowledge AI** — chat-style text generation workspace with conversation history, model picker and prompt starters.
- **Image AI** — prompt composer (model / style / aspect ratio) with a generated-image gallery.
- **Projects** — filterable project grid with status, progress, members and a create-project dialog.
- **History** — searchable, filterable log of every generation.
- **Settings** — profile, workspace, billing, API keys and notification preferences.

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

## Roadmap

1. **V1 (this release)** — Frontend with mock data.
2. **V2** — Supabase auth + persistence; wire OpenAI & Gemini for real generations.
3. **V3** — Team collaboration, billing, and usage metering.
