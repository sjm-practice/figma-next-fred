# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

No test runner is configured.

## Architecture

This project uses **Next.js App Router** with React 19 and Tailwind CSS v4.

- `src/app/layout.tsx` — Root layout; sets up Geist fonts and global metadata
- `src/app/page.tsx` — Homepage (rendered at `/`)
- `src/app/globals.css` — Global styles; Tailwind v4 is configured here via `@import "tailwindcss"`

TypeScript path alias: `@/*` → `./src/*`

Tailwind v4 drops the `tailwind.config.js` file — configuration lives in CSS via `@theme` blocks in `globals.css`.
