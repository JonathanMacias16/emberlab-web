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

## Brand Identity

- **Name meaning**: "Ember" refers to the spark released by a burning ember — that small spark is what ignites a great fire. EmberLab represents that initial creative spark that drives big results.
- **Logo**: An asymmetric asterisk shape made of 4 bars (horizontal, vertical, and two diagonals) of different lengths/sizes, plus two small separated sparkle accents on the shorter bars. The asymmetry is intentional — it represents an organic, living spark rather than a rigid geometric shape.
- **Logo file**: `public/logo.svg` — 7 SVG paths: 2 sparkle shapes + 4 bars (horizontal, vertical, 2 diagonals), all in `#E83F40` (brand red).
- **Brand color**: Red (`--red: #e73f40`) is the primary brand/logo color.

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

## Routes

- `app/page.tsx` — Coming soon page (root `/`). Dark purple background, BreathingFire animated logo, headline, "coming soon" text.
- `app/web/page.tsx` — Full EmberLab landing page with all sections (Nav, Hero, Problema, Pilares, ParaTi, Proceso, Resultados, Portfolio, CTAFinal, Footer).
- `app/logo-animations/page.tsx` — Internal playground showcasing all 9 animated logo variants (not linked publicly).
- `app/studio/[[...tool]]/` — Sanity Studio route.

## Animated Logo Variants

All logo animations live in `app/logo-animations/page.tsx` and use the same 6 SVG paths (4 bars + 2 sparkles) from `public/logo.svg`. Each is a self-contained Framer Motion component that accepts a `playKey` prop to replay. Available animations:

| Name | ID | Description |
|---|---|---|
| **Spark Ignite** | `spark-ignite` | Bars scale in from center staggered, sparkles pop with backOut |
| **Ember Pulse** | `ember-pulse` | Continuous drop-shadow glow pulse, sparkles flicker opacity/scale |
| **Staggered Spin** | `staggered-spin` | Each bar rotates from a different angle into position (used in SplashScreen) |
| **Draw On** | `draw-on` | SVG pathLength stroke draws each bar, then fills with color |
| **Flame Flicker** | `flame-flicker` | Organic x/y micro-movement simulating real flame motion |
| **Scatter & Assemble** | `scatter-assemble` | Pieces fly in from 4 directions with spring physics |
| **Breathing Fire** | `breathing-fire` | Scale oscillation [1→1.08→1] + color shift red→orange→red on bars, red→gold→red on sparkles. **Used on coming soon page (`/`).** |
| **Rotate Reveal** | `rotate-reveal` | Full logo group spins -270° in with spring elastic |
| **Sparkle Orbit** | `sparkle-orbit` | Sparkles orbit in opposite directions around the static logo |

**Reusable animated logo components extracted so far:**
- `components/animations/SplashScreen.tsx` — Uses Staggered Spin variant (looping), shown as splash gate on `/web`.
- `components/animations/AnimatedLogoPhrase.tsx` — Logo + 4 SVG text lines animating with clipPath write-on effect, used in ProblemaDark section.

**SVG path constants** (shared across all variants):
- `BAR_H`, `BAR_V`, `BAR_DIAG_1`, `BAR_DIAG_2` — the 4 asymmetric bars
- `SPARKLE_1` (transformOrigin `88px 28px`), `SPARKLE_2` (transformOrigin `20px 22px`) — the two sparkle accents
- All paths use `viewBox="0 0 118 118"` with center at `59px 59px`

## Component Organization

UI components are in `components/` organized by type: `components/ui/`, `components/sections/`, `components/animations/`.
