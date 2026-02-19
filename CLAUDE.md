# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- `npm run dev` — Start local dev server with hot reload
- `npm run build` — Production build
- `npm run start` — Serve production build
- `npm run lint` — Run ESLint (flat config, ESLint 9)

No test runner is configured yet.

## Architecture

This is a **Next.js 16 App Router** project using **TypeScript (strict)**, **React 19**, and **Tailwind CSS v4**.

- `app/` — All routes and layouts (App Router file-based routing, no `src/` directory)
- `app/layout.tsx` — Root layout with Geist font setup and metadata
- `app/globals.css` — Global styles, Tailwind v4 config via CSS (`@import "tailwindcss"` + `@theme inline`)
- `public/` — Static assets

Path alias `@/*` maps to the project root (e.g., `@/app/...`, `@/components/...`).

## Key Conventions

- **Tailwind v4**: No `tailwind.config.js`. Configuration is CSS-first in `globals.css` using `@theme inline` for design tokens and CSS custom properties (`--background`, `--foreground`, etc.).
- **Dark mode**: System preference-based via `prefers-color-scheme` media query (not class-based).
- **ESLint**: Flat config format (`eslint.config.mjs`) with `next/core-web-vitals` and `next/typescript` rule sets.
- **Fonts**: Geist Sans and Geist Mono loaded via `next/font/google`, applied as CSS variables.
- **Images**: Use `next/image` (`<Image>`) for optimized image handling.
