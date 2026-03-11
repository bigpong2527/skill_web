# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run Next.js linting
npm run pages:build  # Build for Cloudflare Pages deployment
```

## Architecture

This is **skills.rest** — a Next.js 15 (App Router) marketplace for AI agent skills, deployed on Cloudflare (Workers + Pages + D1).

### Stack
- **Next.js 15 / React 19** with edge runtime (`export const runtime = 'edge'` in most routes)
- **Cloudflare D1** (SQLite) as the database, accessed via `src/lib/db.ts`
- **Cloudflare R2** for skill zip file storage
- **Tailwind CSS** with dark mode (class-based), custom primary color `#3B82F6`

### Data Layer (`src/lib/db.ts`)
The `query()` function has two modes:
1. **Workers binding** — uses `ctx.env.DB` (D1Database) when running on Cloudflare
2. **HTTP API fallback** — uses `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `D1_DATABASE_ID` env vars for local dev

Full-text search uses SQLite FTS5 with BM25 ranking via a `skills_fts` virtual table. The `filterSkills()` function dynamically builds JOINs and conditions.

Categories are **static** (`src/lib/staticData.ts`) — the DB stores category slugs but icons/names come from the static list.

### Key Types (`src/types.ts`)
- `Skill` — core entity with `slug`, `status` (`'pending'`=published, `'approved'`, `'rejected'`), `author_type` (`Official|Partner|Community`), `complexity` (`Basic|Intermediate|Advanced`), `hotness_score`
- Note: `status = 'pending'` is the live/published state (counterintuitive naming)

### App Router Structure
- `/` — Homepage with hot + recent skills (ISR, `revalidate = 3600`)
- `/explore` — Filterable skill browser (category, keywords, author type, complexity, search)
- `/skill/[slug]` — Individual skill detail page
- `/categories/[slug]` — Category listing
- `/contribute` — Skill submission form
- `/openclaw` — OpenClaw integration page
- `/sitemap-index/[id]` — Paginated sitemap generation

### Components
- `src/components/client/` — Client components (Header, SkillCard, HomeHero, ExploreSidebar, etc.)
- `src/components/server/` — Server components (Footer, MarkdownView)
- `src/components/providers/` — ThemeContext, EnvironmentContext
- Root-level structured data components for SEO (WebSiteStructuredData, CategoryStructuredData, etc.)

### Environment Variables
Required for local dev (HTTP API fallback):
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `D1_DATABASE_ID`

### Cloudflare Deployment
- `wrangler.toml` — D1 binding name is `DB`, node compat enabled
- `schema.sql` — Database schema (run against D1 to initialize)
- `npm run pages:build` uses `@cloudflare/next-on-pages` adapter
