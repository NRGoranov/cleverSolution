# CleverSolutions

Product gallery / representative site for CleverSolutions (Bulgaria, bg-BG).

## Stack

- Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- Zod-validated product data in `/data/products/`
- Framer Motion / Motion micro-interactions
- Resend contact form
- Playwright e2e smoke tests
- Vercel plugin agent docs in `AGENTS.md`

## Getting started

```bash
npm install
cp .env.example .env.local   # add your RESEND_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes (English)

| Path | Page |
|---|---|
| `/` | Homepage |
| `/kitchen` | Kitchenware |
| `/security` | Security |
| `/wristbands` | Wristbands |
| `/vacuums` | Vacuums |
| `/product/[slug]` | Product detail |
| `/contact` | Contact form |

UI copy remains Bulgarian in `content/bg.ts`.

## Adding products

Edit `data/products/*.ts` (one file per category). Copy a sample entry, fill fields, set `status: "published"`. Images go in `public/images/products/<slug>/` or use remote URLs. Grep for `Примерен` / `Sample` to find placeholders. `priceBgn` is optional and omitted until real prices exist.

## Environment variables

See `.env.example` for `RESEND_API_KEY`, contact emails, and site URL.

## Tests

```bash
npm run test:e2e
```

E2E uses `CONTACT_TEST_MODE=1` (mocks email send).

## Troubleshooting

**`next dev` stuck on "Starting..."**

This is almost always a corrupted or locked `.next` folder (common on Windows if a previous dev server was interrupted or multiple instances ran at once).

1. Stop every terminal running `npm run dev` (Ctrl+C in each).
2. Run:

```bash
npm run dev:fresh
```

That clears `.next` and webpack cache, then starts the server. A clean start should show `Ready in` within a few seconds.

**Blank page / `Invalid or unexpected token` in console**

1. Stop all running dev servers (close other terminals using port 3000).
2. Clear the build cache and restart:

```bash
npm run clean
npm run dev
```

This usually fixes corrupted `.next` chunks (common on Windows when multiple `next dev` instances run).

**No products visible**

Category pages only show entries with `status: "published"`. Drafts stay hidden and show „Очаквайте скоро“ when a category has none published.
