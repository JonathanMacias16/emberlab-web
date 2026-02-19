# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

- `npm run dev` — Start local dev server with hot reload
- `npm run build` — Production build
- `npm run start` — Serve production build
- `npm run lint` — Run ESLint (flat config, ESLint 9)

No test runner is configured yet.

## Project Context

**EmberLab** is a web design and development agency website. Currently a marketing landing page (`app/page.tsx`) with responsive design, custom color scheme, and Spanish language support (`lang="es"` in root layout).

## Architecture

This is a **Next.js 16 App Router** project using **TypeScript (strict)**, **React 19**, and **Tailwind CSS v4**.

- `app/` — All routes and layouts (App Router file-based routing, no `src/` directory)
- `app/layout.tsx` — Root layout with metadata and DM Sans font from `next/font/google`
- `app/page.tsx` — Single landing page with 9 sections; components (Logo, ButtonPrimary, SocialIcon) are defined inline here
- `app/globals.css` — Tailwind v4 imported as CSS with custom color variables in `:root`
- `public/` — Static assets (images, SVGs used in landing page)

Path alias `@/*` maps to the project root (e.g., `@/app/...`, `@/components/...`).

## Key Conventions

- **Tailwind v4**: No `tailwind.config.js`. Configuration is CSS-first in `globals.css` using `@import "tailwindcss"`. Design tokens are CSS variables: `--purple`, `--red`, `--green-light`, `--purple-light`, `--purple-soft`, `--red-light`, `--white`.
- **Fonts**: DM Sans (300, 400, 500, 700, 900 weights) loaded via `next/font/google`, applied as CSS variable `--font-dm-sans` with utility class `.font-dm`.
- **Images**: Use `next/image` (`<Image>`) for optimized image handling. Images are organized in `public/` with descriptive names.
- **Color system**: Relies entirely on CSS variables (`var(--colorName)`); no hardcoded colors. All colors defined in `app/globals.css`.
- **ESLint**: Flat config format (`eslint.config.mjs`) with `next/core-web-vitals` and `next/typescript` rule sets.
- **Dependencies**: `framer-motion` installed but not yet used; available for animations on future sections.

## Component Organization

Currently, UI components (Logo, ButtonPrimary, SocialIcon) are co-located in `app/page.tsx`. As the site grows with multiple pages, consider extracting reusable components to a dedicated `components/` directory at the project root.
