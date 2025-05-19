# CenterPlus Shooting Range – Technical Specification

**Version**: 1.5 (full, self‑contained)
**Date**: 2025‑05‑18
**Prepared for**: *roocode* orchestrator agent
**Author**: Pavlo Hryshchenko ([kraken@sharkscode.com](mailto:kraken@sharkscode.com))

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Baseline (Create T3)](#2-baseline-create-t3)
3. [Technology Stack](#3-technology-stack)
4. [Repository Layout](#4-repository-layout)
5. [Environment Setup](#5-environment-setup)
6. [Internationalisation (i18n)](#6-internationalisation-i18n)
7. [Brand & Colour System](#7-brand--colour-system)
8. [Public Site – Pages & Routes](#8-public-site--pages--routes)
9. [Admin Dashboard – Pages & Routes](#9-admin-dashboard--pages--routes)
10. [React Components Catalogue](#10-react-components-catalogue)
11. [Styling & Tailwind 4 Configuration](#11-styling--tailwind-4-configuration)
12. [Accessibility Checklist](#12-accessibility-checklist)
13. [Performance & Core Web Vitals Targets](#13-performance--core-web-vitals-targets)
14. [SEO & Structured Data](#14-seo--structured-data)
15. [Backend API (NestJS)](#15-backend-api-nestjs)
16. [Database Schema (Prisma)](#16-database-schema-prisma)
17. [CI/CD & GitHub Actions](#17-cicd--github-actions)
18. [DigitalOcean Infrastructure](#18-digitalocean-infrastructure)
19. [Testing Strategy](#19-testing-strategy)
20. [Security & Compliance](#20-security--compliance)
21. [Glossary](#21-glossary)

---

## 1. Introduction

This document contains **all** technical details required to design, develop, deploy, and maintain the new CenterPlus shooting‑range platform. It is self‑contained so that the automated development orchestrator (*roocode*) can ingest and execute it without additional context.

Goals:

* **Mobile‑first UX** implemented with Next 14 (App Router + Server Components).
* **Internationalised** content: Ukrainian default (`uk`) & English (`en`).
* **Headless‑ready content** with full CRUD admin panel.
* **Binotel** telephony integration (callback widget, call‑tracking, SMS).
* **< 2 s LCP** & Core Web Vitals ≥ 90.
* **Zero‑downtime CI/CD** to DigitalOcean App Platform & Droplet.

---

## 2. Baseline (Create T3)

The repository is already bootstrapped with **Create T3 App** (Next 14 + tRPC + Tailwind 4 + Prisma + next‑auth). Follow the mandatory cleanup so the scaffold is free of demo artefacts.

### 2.1 Mandatory Cleanup

| Path                                | Action                                              |
| ----------------------------------- | --------------------------------------------------- |
| `src/pages/index.tsx`               | Replace with `<HomePage>` (see §8).                 |
| `src/pages/posts.tsx`               | **Delete**.                                         |
| `src/server/api/routers/example.ts` | **Delete** (demo tRPC route).                       |
| `src/components/Example.tsx`        | **Delete**.                                         |
| `public/next.svg`, `public/t3.svg`  | Remove or replace.                                  |
| `src/pages/_app.tsx`                | Keep but strip demo `Toaster`, `Analytics` imports. |
| `src/server/api/root.ts`            | Remove `example` router registration.               |

> *roocode step*: run `pnpm dlx rimraf` for listed files or invoke `scripts/cleanup-t3-demo.ts`; ensure `pnpm lint` succeeds afterward.

### 2.2 Retained / Adjusted Packages

| Package                              | Decision                                       |
| ------------------------------------ | ---------------------------------------------- |
| **next‑auth**                        | Remove (switch to Clerk); delete related code. |
| **@trpc/server / @trpc/react-query** | Retain for thin internal RPC.                  |
| **Tailwind 4**                       | Already aligned with design system.            |
| **Prisma**                           | Continue; schema in §16.                       |

---

## 3. Technology Stack

| Layer                 | Tech                                                      | Purpose                                   |
| --------------------- | --------------------------------------------------------- | ----------------------------------------- |
| **Frontend**          | Next.js 14, React 19, TypeScript, Tailwind 4, next‑intl 3 | Public & admin UI.                        |
| **Design System**     | shadcn/ui, Radix UI                                       | Accessible primitives.                    |
| **Form / Validation** | React‑Hook‑Form + Zod                                     | Stepper forms.                            |
| **State/Query**       | tRPC (React Query)                                        | Client ↔ backend RPC.                     |
| **Backend API**       | NestJS 11, Prisma 6                                       | Modular, REST + optional GraphQL.         |
| **Database**          | DigitalOcean Managed PostgreSQL 15                        | Daily backups + PITR.                     |
| **Telephony**         | Binotel REST API + Webhooks                               | Callback, call logs, SMS.                 |
| **Object Storage**    | DigitalOcean Spaces + CDN                                 | Images, PDFs, OG‑images.                  |
| **Auth**              | Clerk JWT/OAuth                                           | RBAC roles (`ADMIN`, `EDITOR`, `VIEWER`). |
| **Analytics**         | Plausible CE                                              | GDPR‑friendly, no cookies.                |
| **DevOps**            | Turborepo, PNPM, Docker, GitHub Actions                   | Monorepo orchestration.                   |

---

## 4. Repository Layout

```text
centerplus/
 ├─ src/                    # Create‑T3 root (Next)
 │   ├─ pages/              # Legacy Pages Router (gradual migration to /app)
 │   ├─ app/                # New App Router structure
 │   ├─ components/         # React UI components
 │   ├─ server/
 │   │   └─ api/            # tRPC routers
 │   └─ styles/             # Tailwind globals
 ├─ apps/
 │   └─ api/                # NestJS backend (stand‑alone)
 ├─ packages/
 │   ├─ ui/                 # Shared UI (shadcn variants)
 │   └─ config/             # eslint, prettier, tailwind, tsconfig
 ├─ locales/                # uk.json, en.json
 ├─ prisma/                 # schema.prisma & migrations
 ├─ docker/
 └─ .github/workflows/
```

---

## 5. Environment Setup

```bash
# 1. remove demo artefacts
pnpm dlx rimraf src/pages/{index,posts}.tsx \
              src/server/api/routers/example.ts \
              src/components/Example.tsx \
              public/{next,t3}.svg

# 2. install & bootstrap
pnpm i -g turbo
pnpm install
cp .env.example .env  # fill secrets (see §15.6)
docker compose up -d  # start Postgres (and optional Redis)
pnpm turbo run dev    # web 3000, admin 3000/admin, api 4000
```

---

## 6. Internationalisation (i18n)

| Aspect                 | Spec                                                             |
| ---------------------- | ---------------------------------------------------------------- |
| **Locales**            | `uk` (default), `en`.                                            |
| **Library**            | `next-intl` v3 (Server Components compatible).                   |
| **Messages**           | `locales/{locale}.json`, flat keys.                              |
| **Routing**            | Locale prefix: `/uk/...`, `/en/...`.                             |
| **Detection**          | `middleware.ts` (Accept‑Language + cookie).                      |
| **Switcher Component** | `<LanguageSwitcher locale={current}/>` invokes `router.replace`. |
| **SEO**                | `hreflang` alternates, `<html lang>` per page.                   |
| **Sitemap**            | `next-sitemap` creates `sitemap-uk.xml`, `sitemap-en.xml`.       |

```js
// next.config.mjs
export default {
  i18n: { locales: ['uk', 'en'], defaultLocale: 'uk', localeDetection: false },
  experimental: { appDir: true },
};
```

---

## 7. Brand & Colour System

| Token                | HEX                                        | Role                        |
| -------------------- | ------------------------------------------ | --------------------------- |
| `--clr-base`         | **#4B5320**                                | Dark olive base.            |
| `--clr-base-light`   | **#667C3E**                                | Lighter olive for surfaces. |
| `--clr-accent`       | **#FDCB3E**                                | CTA & highlights.           |
| `--clr-accent-hover` | `color-mix(in srgb, #FDCB3E 80%, #4B5320)` | Hover state.                |

*Accent text colour:* `#1B1B1B` for 4.5 : 1 contrast.  Use gradients `135deg` from `--clr-base` → `--clr-base-light` as section backgrounds.

```css
:root {
  --clr-base:#4B5320;
  --clr-base-light:#667C3E;
  --clr-accent:#FDCB3E;
  --clr-accent-hover:color-mix(in srgb, #FDCB3E 80%, #4B5320);
}
```

---

## 8. Public Site – Pages & Routes

(All under `/[locale]/`.)

| Route            | Component          | Purpose               | Data           |
| ---------------- | ------------------ | --------------------- | -------------- |
| `/`              | `<HomePage>`       | Hero, benefits, CTA.  | Static + CMS.  |
| `/ranges`        | `<RangesPage>`     | List 25 m/50 m/100 m. | CMS `Range`.   |
| `/ranges/[slug]` | `<RangeDetails>`   | Gallery, specs.       | CMS.           |
| `/training`      | `<TrainingPage>`   | Course catalogue.     | CMS `Course`.  |
| `/prices`        | `<PricesPage>`     | Price table + PDF.    | CMS + Spaces.  |
| `/booking`       | `<BookingStepper>` | 3‑step booking.       | tRPC ↔ NestJS. |
| `/faq`           | `<FAQPage>`        | FAQs.                 | CMS `FAQ`.     |
| `/contact`       | `<ContactPage>`    | Map, form.            | Static.        |
| `/legal/privacy` | `<PrivacyPolicy>`  | Privacy docs.         | Markdown.      |

---

## 9. Admin Dashboard – Pages & Routes

| Route                   | Component          | Functionality               |
| ----------------------- | ------------------ | --------------------------- |
| `/admin`                | `<AdminDashboard>` | KPIs, revenue charts.       |
| `/admin/bookings`       | `<BookingTable>`   | CRUD + calendar.            |
| `/admin/content/[type]` | `<ContentManager>` | Manage Ranges/Courses/FAQs. |
| `/admin/media`          | `<MediaLibrary>`   | Spaces file manager.        |
| `/admin/users`          | `<UserTable>`      | Roles & invites.            |
| `/admin/settings`       | `<SettingsPage>`   | Brand, Binotel creds.       |

---

## 10. React Components Catalogue

| Component            | Purpose                        |
| -------------------- | ------------------------------ |
| `<Navbar>`           | Sticky top nav, locale switch. |
| `<Footer>`           | Contact info, socials.         |
| `<HeroSection>`      | Full‑width intro.              |
| `<RangeCard>`        | Grid item.                     |
| `<PriceTable>`       | Responsive price list.         |
| `<BookingForm>`      | Stepper booking.               |
| `<FAQAccordion>`     | Collapsible list.              |
| `<LanguageSwitcher>` | UA/EN toggle.                  |
| `<GradientSection>`  | Gradient wrapper.              |
| `<CallWidget>`       | Binotel callback button.       |

---

## 11. Styling & Tailwind 4 Configuration

`tailwind.config.mjs` excerpt:

```js
export default {
  content:[ './src/**/*.{js,ts,jsx,tsx,mdx}', './packages/ui/**/*.{js,ts,jsx,tsx}', './locales/**/*.json' ],
  theme:{
    extend:{
      colors:{ base:{ DEFAULT:'var(--clr-base)', light:'var(--clr-base-light)' }, accent:{ DEFAULT:'var(--clr-accent)', hover:'var(--clr-accent-hover)' } },
      fontFamily:{ sans:['InterVariable','ui-sans-serif','system-ui'] },
      boxShadow:{ card:'0 8px 24px rgba(0,0,0,.12)' },
      borderRadius:{ xl:'1.25rem' },
      gradientColorStops:{ start:'var(--clr-base)', end:'var(--clr-base-light)' },
    },
  },
  plugins:[ '@tailwindcss/typography', '@tailwindcss/forms', 'tailwindcss-animate' ],
};
```

`globals.css`:

```css
@tailwind base;@tailwind components;@tailwind utilities;
.section-gradient{background-image:linear-gradient(135deg,var(--clr-base)0%,var(--clr-base-light)100%)}
.btn-primary{@apply bg-[var(--clr-accent)] text-[#1B1B1B] hover:bg-[var(--clr-accent-hover)] rounded-xl px-5 py-3 font-medium transition-colors}
```

---

## 12. Accessibility Checklist

* WCAG 2.1 AA contrast.
* Focus outlines via `:focus-visible`.
* Full keyboard nav.
* `prefers-reduced-motion` support.
* `<html lang>` per locale.

---

## 13. Performance & Core Web Vitals Targets

| Metric | Target  | Notes                     |
| ------ | ------- | ------------------------- |
| LCP    | < 1.8 s | `next/image`, edge cache. |
| CLS    | < 0.1   | Size hints.               |
| TTFB   | < 0.2 s | Server Components, CDN.   |
| INP    | < 50 ms | Hydration strategy.       |

---

## 14. SEO & Structured Data

* Dynamic meta via Next 14 metadata API.
* `next-sitemap` for locale sitemaps.
* JSON‑LD: `LocalBusiness`, `Product`, `FAQPage`.
* OG images via `@vercel/og`.

---

## 15. Backend API (NestJS)

### 15.1 Modules

The backend is organised into discrete NestJS modules following the **feature-first** principle:

* `Auth`
* `Booking`
* `Range`
* `Course`
* `Media`
* `CallLog`

### 15.2 Endpoints (REST)

| Method / Path                | Description         |
| ---------------------------- | ------------------- |
| `POST /auth/login`           | Clerk JWT exchange. |
| `GET /ranges`                | List ranges.        |
| `POST /bookings`             | Create booking.     |
| `POST /binotel/webhook/call` | Call log.           |

### 15.3 Env Vars (`apps/api/.env`)

```
DATABASE_URL=postgres://user:pass@db:5432/centerplus
JWT_SECRET=...
CLERK_SECRET_KEY=...
SPACES_KEY=...
SPACES_SECRET=...
BINOTEL_API_KEY=...
BINOTEL_SECRET=...
BINOTEL_WIDGET_ID=...
DEFAULT_LOCALE=uk
SUPPORTED_LOCALES=uk,en
```

---

## 16. Database Schema (Prisma)

```prisma
model User{ id String @id @default(cuid()) email String @unique role Role @default(VIEWER) bookings Booking[] }
model Booking{ id String @id @default(cuid()) userId String rangeId String date DateTime status BookingStatus @default(PENDING) paid Boolean @default(false) User User @relation(fields:[userId],references:[id]) Range Range @relation(fields:[rangeId],references:[id]) }
model Range{ id String @id @default(cuid()) slugUk String @unique slugEn String @unique titleUk String titleEn String length Int contentUk Json contentEn Json bookings Booking[] }
model Course{ id String @id @default(cuid()) slugUk String @unique slugEn String @unique titleUk String titleEn String priceUa Int priceEn Int contentUk Json contentEn Json }
model FAQ{ id String @id @default(cuid()) questionUk String questionEn String answerUk String answerEn String }
model CallLog{ id String @id @default(cuid()) callerId String calledAt DateTime @default(now()) durationSec Int recordingUrl String? metadata Json? }
enum Role{ ADMIN EDITOR VIEWER }
enum BookingStatus{ PENDING CONFIRMED CANCELED }
```

---

## 17. CI/CD & GitHub Actions

`.github/workflows/ci.yml`:

```yaml
name: CI
on: [push]

jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: {version: 9}
      - run: pnpm install --frozen-lockfile
      - run: pnpm turbo run lint test --parallel
  deploy:
    needs: build-test
    runs-on: ubuntu-latest
    steps:
      - uses: digitalocean/app_action@v1
        with:
          token: ${{ secrets.DO_TOKEN }}
          app_name: centerplus
      - name: Migrate DB
        run: ssh ${{ secrets.DROPLET_SSH }} "cd /srv/api && docker compose exec api npx prisma migrate deploy"
```

---

## 18. DigitalOcean Infrastructure

| Resource         | Plan                      | Purpose                    |
| ---------------- | ------------------------- | -------------------------- |
| App Platform     | Basic 1 vCPU / 1 GB       | Next.js SSR (web + admin). |
| Droplet          | Premium AMD 2 vCPU / 4 GB | NestJS API + workers.      |
| Managed Postgres | 1 vCPU / 1 GB             | Primary DB.                |
| Spaces + CDN     | 250 GB                    | Media.                     |
| VPC              | Default                   | Private traffic.           |
| Monitoring       | Enabled                   | CPU ≥ 80 %, LCP > 2 s.     |

---

## 19. Testing Strategy

| Layer         | Tool                        |
| ------------- | --------------------------- |
| Unit          | Jest                        |
| Component     | RTL + Storybook + Chromatic |
| E2E           | Playwright (uk & en flows)  |
| i18n          | Snapshot rendered strings   |
| Accessibility | axe‑lighthouse              |
| Performance   | Lighthouse CI               |
| Webhooks      | Supertest mocks             |

---

## 20. Security & Compliance

* HTTPS + HSTS (preload).
* CSP allow `*.binotel.com`.
* GDPR compliance via Plausible (no cookies).
* Rate limiting, Helmet headers, OWASP controls.

---

## 21. Glossary

| Term | Definition                |
| ---- | ------------------------- |
| LCP  | Largest Contentful Paint  |
| CLS  | Cumulative Layout Shift   |
| INP  | Interaction to Next Paint |
| PITR | Point‑in‑Time Restore     |
| RBAC | Role‑Based Access Control |
| TRPC | Type‑safe RPC for TS      |

---

**End of document – version 1.5 (full, no omissions)**