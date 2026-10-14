"""Generate CleverSolutions hours work statement as a formatted .xlsx + .csv."""

from __future__ import annotations

import csv
import zipfile
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "CleverSolutions-Work-Hours-Statement.xlsx"
OUT_FALLBACK = ROOT / "docs" / "CleverSolutions-Work-Hours-Statement-client.xlsx"
OUT.parent.mkdir(parents=True, exist_ok=True)

ENVELOPE_HOURS = 50

PROJECT = [
    ["Project", "CleverSolutions — Product Gallery / Representative Website"],
    ["Client / Brand", "CleverSolutions (Bulgaria, bg-BG)"],
    ["Repository", "https://github.com/NRGoranov/cleverSolution"],
    ["Work period", "09 Aug 2026 — 07 Oct 2026"],
    ["Role", "Full-stack web development (Next.js / React / TypeScript)"],
    ["Nature of work", "Greenfield rebuild of product gallery site (not e-commerce checkout)"],
    ["Catalogue on site now", "127 real SKUs (75 kitchen + 52 wristbands) + 8 demo placeholders"],
    ["Catalogue target", "~180 SKUs in total"],
    ["Still waiting on client", "~53 SKUs to close the gap, plus Gmail App Password for the form"],
    ["Last data received", "13 Sep 2026"],
    ["Client status", "Told last week he is busy and will send when he has time; no files since 13 Sep. He already knows the project cannot close without them"],
    ["Waiting on remaining files since", "13 Sep 2026 — ~3.5 weeks"],
    ["Primary CTA", "Phone + email live; Gmail SMTP form ready; send waits on client App Password"],
    [
        "Stack delivered",
        "Next.js 16.3, React 19.2, TypeScript, Tailwind CSS, Zod, Motion, Playwright, Nodemailer (Gmail SMTP), Vercel-ready",
    ],
    ["Agreed envelope", "50 h total"],
    ["Hours executed (payable now)", "43.5 h — site + 127 live SKUs"],
    ["Hours held in envelope", "6.5 h — remaining ~53 SKUs, same import pace"],
    ["Email form extra", "Not billed — go-live waits on App Password already requested"],
]

DAILY = [
    ["1", "2026-08-09", "5", "Project setup, content system, data layer, design tokens"],
    ["2", "2026-08-10", "5.5", "Pages, navigation, contact API, SEO, smoke tests"],
    ["3", "2026-08-11", "5", "Upgrade, brand polish, navbar motion, DriftWall, handoff"],
    ["4", "2026-08-20", "5", "Kitchen catalogue Excel import (39 SKUs + images)"],
    ["5", "2026-08-21", "0.75", "Catalogue text cleanup"],
    ["6", "2026-08-22", "3", "Orange brand, logo/favicon, bilingual About page"],
    ["7", "2026-08-23", "3.5", "Hero links, image fit, hours statement, navbar/DriftWall layout"],
    ["8", "2026-08-31", "3.25", "FAQ/legal pages; portfolio-style mobile menu"],
    ["9", "2026-09-16", "2", "Contact warning + live phone/email; nav stacking"],
    ["10", "2026-09-17", "3", "Readable current-page highlights; first 17 wristbands; hours map"],
    ["11", "2026-09-18", "6.5", "Publish kitchen 75 SKUs + remaining 35 wristbands"],
    ["12", "2026-09-19", "1", "DriftWall photos from new catalogue; publish QA"],
    [
        "Held",
        "since 2026-09-13",
        "6.5",
        "Remaining ~53 SKUs to reach ~180 total (security, cleaning, leftover sheets)",
    ],
]

DETAIL_HEADERS = [
    "ID",
    "Date",
    "Phase",
    "Task / Work package",
    "Problem / Challenge",
    "Solution / What was implemented",
    "Hours",
    "Status",
    "Key deliverables / areas",
]

DETAILS = [
    [
        "1",
        "2026-08-09",
        "Discovery & setup",
        "Read rebuild brief; scaffold Next.js App Router project with TypeScript, Tailwind, ESLint",
        "Empty workspace; gallery site (not store); production-ready foundation needed",
        "Scaffolded app; path aliases, Tailwind tokens, Cyrillic fonts, base layout, AGENTS conventions",
        "1.5",
        "Done",
        "package.json, app/, tailwind.config.ts, AGENTS.md",
    ],
    [
        "2",
        "2026-08-09",
        "Content & i18n",
        "Bulgarian content system for all UI strings",
        "UI must be bg-BG; single editable copy source for non-developer updates",
        "Centralized content/bg.ts for site, nav, hero, categories, product, contact, footer",
        "0.75",
        "Done",
        "content/bg.ts",
    ],
    [
        "3",
        "2026-08-09",
        "Data architecture",
        "Zod-validated product data layer for 4 categories; hand-editable placeholders",
        "No CMS; real data from paper records later; schema must stay stable",
        "ProductSchema; per-category files; draft/published; optional price; index helpers",
        "1.5",
        "Done",
        "data/products/*",
    ],
    [
        "4",
        "2026-08-09",
        "Design system",
        "Tokens, typography, skeletons, SSR-safe motion primitives",
        "Loading states must match layouts; Framer SSR blank-page risk",
        "Ink/canvas tokens; skeleton shimmer; ScrollReveal safe mount pattern",
        "1.25",
        "Done",
        "globals.css, components/skeletons, components/motion",
    ],
    [
        "5",
        "2026-08-10",
        "Layout & navigation",
        "Header/Footer; category nav; mobile menu; subcategory dropdowns",
        "Four categories; English URL slugs with Bulgarian labels",
        "Sticky header, hover dropdowns, responsive drawer, footer structure",
        "1",
        "Done",
        "components/layout/Header.tsx, Footer.tsx",
    ],
    [
        "6",
        "2026-08-10",
        "Home page",
        "Hero, category grid, featured products, contact CTA block",
        "Brand-first hero with local product photography",
        "Hero10 image fan; HomeSections; primary/secondary CTAs",
        "1.25",
        "Done",
        "components/home/*, components/ui/hero-10.tsx, app/page.tsx",
    ],
    [
        "7",
        "2026-08-10",
        "Category & product pages",
        "Galleries, coming-soon states, product detail with gallery/specs/JSON-LD",
        "SEO without checkout; async App Router params on Next 16",
        "CategoryPageContent; ProductGallery/Specs; generateStaticParams; contact deep-link",
        "1.25",
        "Done",
        "app/{kitchen,security,wristbands,vacuums}, app/product/[slug]/*",
    ],
    [
        "8",
        "2026-08-10",
        "Contact & email",
        "Contact page + first email API Route Handler",
        "Production email path with env-based configuration",
        "Validated form; POST /api/contact; .env.example (later switched to Gmail SMTP)",
        "1",
        "Done",
        "app/contact, components/contact/ContactForm.tsx, app/api/contact",
    ],
    [
        "9",
        "2026-08-10",
        "Assets, SEO & QA",
        "Local images, metadata/sitemap, Playwright smoke tests",
        "No remote stock dependency; regression safety before handoff",
        "public/images/*; robots/sitemap; e2e smoke suite",
        "1",
        "Done",
        "public/images, SEO files, e2e/smoke.spec.ts",
    ],
    [
        "10",
        "2026-08-11",
        "Platform upgrade",
        "Upgrade to Next.js 16 and React 19; fix breaking changes",
        "Codemod hung; params Promise migration; build verification",
        "Manual dep upgrade; async params fixes; verified production build",
        "1",
        "Done",
        "package.json, product page params, eslint-config-next 16",
    ],
    [
        "11",
        "2026-08-11",
        "Brand & UX polish",
        "Teal accent, scrollbar, product card Details flow, scroll-to-top, footer credit",
        "Monochrome UI; cards pushed contact too early; mobile polish",
        "brand tokens; ProductCard Details CTA; ScrollToTop; subtle NRG footer link",
        "1",
        "Done",
        "globals.css, tailwind.config.ts, ProductCard, ScrollToTop, Footer",
    ],
    [
        "12",
        "2026-08-11",
        "Navbar motion",
        "Port NRGxPortfolio scroll-shrink navbar behaviour",
        "Client wanted same motion language as portfolio site",
        "Scroll-shrink pill header, cursor sheen, underline hovers, animated mobile menu",
        "0.75",
        "Done",
        "components/layout/Header.tsx",
    ],
    [
        "13",
        "2026-08-11",
        "Homepage backgrounds",
        "DriftWall full-page backdrop; layered category/contact panels; inner-page teal gradient",
        "Hero atmosphere vs readable content sections; footer above fixed background",
        "DriftWall + HomePageBackground; MainBackground route switch; PageGradientBackground",
        "1.25",
        "Done",
        "DriftWall.jsx, HomePageBackground, PageGradientBackground, HomeSections",
    ],
    [
        "14",
        "2026-08-11",
        "Bugfixes & DX",
        "React 19 script warning, Windows .next cache, JSON-LD, dev scripts",
        "Balancer script tag; dev server lock; console warnings",
        "Removed react-wrap-balancer; clean/dev:fresh; data-scroll-behavior; JSON-LD pattern",
        "0.5",
        "Done",
        "hero-10.tsx, package.json scripts, app/layout.tsx",
    ],
    [
        "15",
        "2026-08-11",
        "Client handoff prep",
        "Product Excel import template; hours statement; git push to GitHub",
        "Client needs format for 150–180 products; billing documentation",
        "CleverSolutions-Produktov-shablon.xlsx; work-hours statement; commits on main",
        "0.5",
        "Done",
        "docs/*, scripts/generate-product-template.py, GitHub main branch",
    ],
    [
        "16",
        "2026-08-20",
        "Catalogue import",
        "Import kitchen equipment Excel into published products with images",
        "150–180 SKU catalogue; first real data was a multi-sheet Excel with embedded photos",
        "import-catalogue.py: sheet→subcategory map, image extract, slugify, Zod-ready kitchenware.ts",
        "5",
        "Done",
        "scripts/import-catalogue.py, data/products/kitchenware.ts, public/images/products/*",
    ],
    [
        "17",
        "2026-08-21",
        "Catalogue QA",
        "Normalize imported catalogue text endings and incomplete punctuation",
        "Excel cells had truncated sentences and inconsistent spacing",
        "Cleaned descriptions/specs in kitchenware.ts without changing product count",
        "0.75",
        "Done",
        "data/products/kitchenware.ts",
    ],
    [
        "18",
        "2026-08-22",
        "Brand & About",
        "Orange/black palette, logo mark favicon, bilingual За нас page",
        "Client asked for About copy, warmer color, logo colors black+orange",
        "Brand tokens #FF6000; BrandLogo; /about BG+EN; nav/footer; icon/apple-icon/favicon",
        "3",
        "Done",
        "content/bg.ts, app/about, BrandLogo, globals.css, app/icon.png",
    ],
    [
        "19",
        "2026-08-23",
        "Homepage & product photos",
        "Hero fan links to categories; 7-column DriftWall; contain product images",
        "Carousel photos needed to be category buttons; SKU photos cropped out of frames",
        "Clickable hero slides; column-grouped DriftWall; object-contain on cards/gallery",
        "1.75",
        "Done",
        "Hero.tsx, hero-10.tsx, hero-drift-images.ts, ProductCard, ProductGallery",
    ],
    [
        "20",
        "2026-08-23",
        "Billing estimate",
        "Update work-hours statement and remaining 150–180 SKU ballpark",
        "Client needs hours-to-date plus time to finish remaining products",
        "Extended hours log to 31.5 h; Remaining SKUs sheet with scenario ranges",
        "0.5",
        "Done",
        "scripts/generate-work-statement.py, docs/CleverSolutions-Work-Hours-Statement-client.*",
    ],
    [
        "21",
        "2026-08-23",
        "Layout polish",
        "Fill DriftWall on wide screens; full-width then compact scrolled navbar",
        "Backdrop columns stopped at 7 on large monitors; navbar did not span the viewport",
        "Filled DriftWall to viewport; 100vw top bar; compact centered pill on scroll; type tweaks",
        "1.25",
        "Done",
        "Header.tsx, DriftWall, globals.css; commits 28b89d4, d5afbe9, a680154",
    ],
    [
        "22",
        "2026-08-31",
        "Legal & FAQ",
        "FAQ and legal pages; portfolio-style mobile navbar",
        "No FAQ/privacy/terms; burger menu needed to match NRGxPortfolio behaviour",
        "Filled /faq /privacy /terms with brochure copy; FAQ JSON-LD; mobile menu from portfolio pattern",
        "2",
        "Done",
        "app/faq, app/privacy, app/terms, FaqPreview, Header.tsx; commit 398477d",
    ],
    [
        "23",
        "2026-08-31",
        "Mobile nav",
        "Menu must float over the page, roll down, no burger border",
        "Open menu expanded/stuck the header and pushed the whole layout",
        "Portal overlay; height animation from the bar; borderless burger; page no longer shifts",
        "1.25",
        "Done",
        "Header.tsx; commits 5c9dad8, fdb698f",
    ],
    [
        "24",
        "2026-09-16",
        "Contact & FAQ",
        "Disable unreliable send; live phone/email; clickable FAQ answers",
        "Form did not send smoothly; old placeholder contacts; FAQ had no links",
        "Warning + disabled submit; +359 888 250 818 and office@cleversolution.bg; markdown FAQ links",
        "1.5",
        "Done",
        "ContactForm.tsx, content/bg.ts, FaqAnswer.tsx, lib/faq.ts; commit 0b532af",
    ],
    [
        "25",
        "2026-09-16",
        "Navbar stacking",
        "Desktop bar and category dropdowns above page sections",
        "Menus painted under hero/category cards (overflow + z-index)",
        "Raised header stacking; overflow visible; dropdowns sit on top of content",
        "0.5",
        "Done",
        "Header.tsx, app/layout.tsx; commit bf7a3af",
    ],
    [
        "26",
        "2026-09-17",
        "UX + catalogue",
        "Readable current-page highlights; first third of wristband catalogue",
        "Active labels matched the peach background; wristbands still demo SKUs",
        "Darker/slightly scaled current item; 5px chip padding; 17 vinyl + Superband/SureImage SKUs live",
        "2.5",
        "Done",
        "Header, CategorySubnav, data/products/wristbands.ts; commit aa2e01f",
    ],
    [
        "27",
        "2026-09-18",
        "Kitchen catalogue",
        "Expand kitchen from 39 to 75 SKUs with new subcategories and photos",
        "Client sent a fuller Equipment Excel (all sheets, WAVE 1, fridge tables, ranges)",
        "75 published kitchen products, 8 subcategories, photos; live on main",
        "3.5",
        "Done",
        "scripts/import-catalogue.py, data/products/kitchenware.ts; commit 5949e0c",
    ],
    [
        "28",
        "2026-09-18",
        "Wristbands catalogue",
        "Remaining two-thirds of wristbands (35 SKUs)",
        "17 of 52 were live; silicone, textile, Tyvek, thermal, RFID, holographic plastic remaining",
        "All 52 wristbands published from scheme.xlsx + Word docs; live on main",
        "3",
        "Done",
        "data/products/wristbands.ts, import-wristbands.py; commit 5949e0c",
    ],
    [
        "29",
        "2026-09-17",
        "Billing",
        "Map remaining work into the agreed 50 h envelope",
        "Previous log stopped at 31.5 h and still quoted 24–36 h extra for 150–180 SKUs",
        "Extended log through 19.09; remaining publishes sat inside 50 h; no overshoot",
        "0.5",
        "Done",
        "scripts/generate-work-statement.py, docs/CleverSolutions-Work-Hours-Statement-client.*",
    ],
    [
        "30",
        "2026-09-19",
        "Wrap-up",
        "Homepage DriftWall photos from new SKUs; publish QA",
        "New kitchen/wristband photos not yet on the live backdrop",
        "DriftWall tiles swapped to new catalogue shots; category/product routes verified after push",
        "1",
        "Done",
        "lib/hero-drift-images.ts, GitHub main (5949e0c), Playwright smoke",
    ],
    [
        "31",
        "2026-10-07",
        "Contact send + billing",
        "Switch contact form to Gmail SMTP; format this hours statement",
        "Send still off until client mailbox; Resend was not the client's own mail; statement was unstyled and still said 'scheduled'",
        "Nodemailer + App Password path (GoLa-style); form enables when env is set; not billed extra",
        "0",
        "Courtesy — not billed extra",
        "lib/mail.ts, app/api/contact, ContactForm.tsx",
    ],
    [
        "32",
        "Waiting",
        "Remaining catalogue",
        "Import remaining ~53 SKUs to reach ~180 total when client files arrive",
        "Gap is security, cleaning, and leftover sheets. Last data received 13 Sep 2026. Client said last week he is busy; no files since. He already knows the project cannot close without them",
        "6.5 h held in the 50 h envelope at kitchen/wristband import pace (~7 min/SKU). Work starts as soon as Excel/photos arrive",
        "6.5",
        "Waiting on client",
        "data/products/security.ts, vacuums.ts — still 8 demo placeholders",
    ],
]

PS_HEADERS = ["ID", "Problem", "Impact", "Resolution", "Status"]
PROBLEMS = [
    [
        "P1",
        "Empty repo / greenfield rebuild from detailed brief",
        "No existing code to extend",
        "Full scaffold + feature build against placeholder Zod dataset",
        "Resolved",
    ],
    [
        "P2",
        "Product data not ready; must be hand-editable later",
        "Risk of CMS/admin overbuild",
        "File-based Zod data; drafts hidden; Bulgarian editor comments in data files",
        "Resolved",
    ],
    [
        "P3",
        "Windows .next cache lock / corrupted build artifacts",
        "Dev server hung; blocked iteration",
        "clean + dev:fresh scripts; delete .next/cache when locked",
        "Resolved",
    ],
    [
        "P4",
        "Blank page from Framer Motion SSR opacity:0",
        "Homepage appeared empty",
        "ScrollReveal SSR-safe: plain div until mounted",
        "Resolved",
    ],
    [
        "P5",
        "Cyrillic vs Latin URL/slug confusion",
        "Unstable routing/SEO",
        "English route slugs; Bulgarian UI copy only",
        "Resolved",
    ],
    [
        "P6",
        "Next.js interactive upgrade codemod hung",
        "Blocked framework upgrade",
        "Manual Next 16 / React 19 dependency upgrade + API fixes",
        "Resolved",
    ],
    [
        "P7",
        "Next.js warning: missing data-scroll-behavior with smooth scroll",
        "Console noise; route transition scroll UX",
        'Added data-scroll-behavior="smooth" on <html>',
        "Resolved",
    ],
    [
        "P8",
        "React 19: Encountered a script tag from react-wrap-balancer",
        "Console error on homepage hero",
        "Removed library; native CSS text-wrap: balance",
        "Resolved",
    ],
    [
        "P9",
        "Product card conversion path unclear",
        "Contact CTA too early in browse flow",
        "Details button to product page; contact on detail only",
        "Resolved",
    ],
    [
        "P10",
        "DriftWall background readability on homepage",
        "Featured heading hard to read over dark tiles",
        "Frosted panel on featured header; layered section backgrounds",
        "Resolved",
    ],
    [
        "P11",
        "Inner-page teal gradient too strong then invisible",
        "Background tuning iterations",
        "Top-down softer wash; later replaced with warm orange from logo",
        "Resolved",
    ],
    [
        "P12",
        "Product photos overflowed frames / not centered",
        "Catalogue images cropped on cards and detail gallery",
        "object-contain + padding on ProductCard and ProductGallery",
        "Resolved",
    ],
    [
        "P13",
        "Missing За нас and teal palette vs logo",
        "No About page; brand colors did not match black/orange logo",
        "Bilingual /about; #FF6000 tokens; logo + C-mark favicon",
        "Resolved",
    ],
    [
        "P14",
        "Catalogue not yet at ~180 total",
        "127 real SKUs live; ~53 still with the client. Last data received 13 Sep 2026",
        "6.5 h held in the 50 h envelope at kitchen/wristband import pace. Work starts when Excel/photos arrive",
        "Waiting on client — he already knows (~3.5 weeks since last files)",
    ],
    [
        "P15",
        "Mobile burger menu stuck the navbar and pushed the page",
        "Layout jumped; overlay felt like a full-page takeover",
        "Portal menu floats over content; rolls down from the bar; no burger border",
        "Resolved",
    ],
    [
        "P16",
        "Contact form send was not reliable",
        "Enquiries could be lost if users trusted the submit button",
        "SMTP path built; send stays off until App Password. Extra time for go-live is not billed",
        "Courtesy — waiting on client App Password",
    ],
    [
        "P17",
        "Desktop nav and dropdowns sat behind page sections",
        "Category menus unusable over hero/cards",
        "Higher header z-index; overflow visible so menus paint on top",
        "Resolved",
    ],
    [
        "P18",
        "Current-page highlight matched the peach page wash",
        "КАТЕГОРИИ / active chips hard to read; first chip clipped after scale",
        "Darker current-page color; slight scale; 5px left padding on first chip",
        "Resolved",
    ],
    [
        "P19",
        "Project close delayed waiting on client materials",
        "Remaining ~53 SKUs and form go-live cannot finish; final payment is blocked though 127 SKUs and the site are already delivered",
        "Last data received 13 Sep 2026 (~3.5 weeks). Last week client said he is busy and will send when he has time; still no files. He already knows the project cannot close without them. Executed 43.5 h payable now; 6.5 h held; email form extra not billed",
        "Blocked on client",
    ],
]

INV_HEADERS = ["Area", "Items delivered"]
INVENTORY = [
    [
        "Public routes",
        "/ · /about · /faq · /privacy · /terms · /kitchen · /security · /wristbands · /vacuums · /product/[slug] · /contact",
    ],
    [
        "API",
        "POST /api/contact via Nodemailer Gmail SMTP; send button off until EMAIL_USER + EMAIL_PASSWORD are set",
    ],
    [
        "Data model",
        "Zod Product schema; 127 real SKUs live of ~180 total (75 kitchen + 52 wristbands); 8 demo placeholders; ~53 SKUs waiting on client files",
    ],
    [
        "UI surfaces",
        "Hero, FAQ accordion with links, legal pages, category grids, product cards/detail, contact warning + phone/email, coming soon, skeletons",
    ],
    ["SEO", "Metadata, Open Graph, JSON-LD Product + FAQ, sitemap/robots"],
    ["Tests", "Playwright smoke + site-health (contact disabled-form checks until SMTP env)"],
    ["Ops", "Vercel-oriented Next 16 app; env example for Gmail App Password; clean/dev:fresh scripts"],
    [
        "Git milestones",
        "910e54c initial · 4c816f6 kitchen 39 · e0cd666 brand/About · 398477d FAQ/mobile nav · 0b532af contact/phone · aa2e01f 17 wristbands · 5949e0c kitchen 75 + wristbands 52",
    ],
]

OPEN_HEADERS = ["Item", "Scope", "Hours in 50 h envelope", "Status", "Notes"]
OPEN_ROWS = [
    [
        "Remaining ~53 SKUs (~180 total)",
        "Replace 8 demos; import security, cleaning, and leftover sheets",
        "6.5",
        "Waiting on client since 13 Sep 2026",
        "Last data 13.09.2026. Client said last week he is busy. He already knows close needs the files. Log ID 32.",
    ],
    [
        "Contact form go-live",
        "Enable send once client App Password is in env",
        "0",
        "Waiting on client — not billed extra",
        "Instructions already sent. Log ID 31. Courtesy overage.",
    ],
]

REMAINING_HEADERS = [
    "Work package",
    "SKU count",
    "Hours in 50 h",
    "Pace",
    "Status",
    "Notes",
]
REMAINING_ROWS = [
    [
        "Kitchen live",
        "75",
        "9.25",
        "~7 min/SKU",
        "Done",
        "IDs 16, 17, 27",
    ],
    [
        "Wristbands live",
        "52",
        "5.5",
        "~6 min/SKU",
        "Done",
        "IDs 26, 28",
    ],
    [
        "Security + cleaning on site",
        "8 demos",
        "0",
        "—",
        "Placeholder",
        "Not real catalogue",
    ],
    [
        "Remaining to reach ~180 total",
        "~53",
        "6.5",
        "~7 min/SKU",
        "Waiting since 13 Sep 2026",
        "Last data 13.09.2026. Client busy as of last week; he already knows files are required to close",
    ],
    [
        "On site now (real + demo)",
        "135 published / ~180 target",
        "43.5 executed",
        "—",
        "Payable now",
        "127 real + 8 demos; 1 extra vacuum draft is hidden",
    ],
]


def col_letter(n: int) -> str:
    s = ""
    while n:
        n, r = divmod(n - 1, 26)
        s = chr(65 + r) + s
    return s


def is_number(val: object) -> bool:
    if isinstance(val, (int, float)):
        return True
    if isinstance(val, str):
        try:
            float(val)
            return True
        except ValueError:
            return False
    return False


def as_number(val: object) -> bool:
    if val in ("", None):
        return False
    if isinstance(val, str) and val.startswith("0") and len(val) > 1 and "." not in val:
        return False
    return is_number(val)


# Cell styles: 0 default, 1 header, 2 title, 3 section, 4 hours, 5 total label, 6 total hours, 7 wrap
STYLES_XML = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts count="4">
    <font><sz val="11"/><name val="Calibri"/></font>
    <font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
    <font><b/><sz val="16"/><color rgb="FF1A1A1A"/><name val="Calibri"/></font>
    <font><b/><sz val="12"/><color rgb="FF1A1A1A"/><name val="Calibri"/></font>
  </fonts>
  <fills count="5">
    <fill><patternFill patternType="none"/></fill>
    <fill><patternFill patternType="gray125"/></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFFF6000"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFFFE8D6"/><bgColor indexed="64"/></patternFill></fill>
    <fill><patternFill patternType="solid"><fgColor rgb="FFF4F4F5"/><bgColor indexed="64"/></patternFill></fill>
  </fills>
  <borders count="2">
    <border><left/><right/><top/><bottom/><diagonal/></border>
    <border>
      <left style="thin"><color rgb="FFE4E4E7"/></left>
      <right style="thin"><color rgb="FFE4E4E7"/></right>
      <top style="thin"><color rgb="FFE4E4E7"/></top>
      <bottom style="thin"><color rgb="FFE4E4E7"/></bottom>
      <diagonal/>
    </border>
  </borders>
  <cellStyleXfs count="1">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>
  </cellStyleXfs>
  <cellXfs count="8">
    <xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1">
      <alignment vertical="center" wrapText="1"/>
    </xf>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment vertical="center" wrapText="1"/>
    </xf>
    <xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1" applyAlignment="1">
      <alignment vertical="center"/>
    </xf>
    <xf numFmtId="0" fontId="3" fillId="3" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1">
      <alignment vertical="center"/>
    </xf>
    <xf numFmtId="2" fontId="0" fillId="0" borderId="1" xfId="0" applyNumberFormat="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="right" vertical="center"/>
    </xf>
    <xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment vertical="center"/>
    </xf>
    <xf numFmtId="2" fontId="1" fillId="2" borderId="1" xfId="0" applyNumberFormat="1" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment horizontal="right" vertical="center"/>
    </xf>
    <xf numFmtId="0" fontId="0" fillId="4" borderId="1" xfId="0" applyFill="1" applyBorder="1" applyAlignment="1">
      <alignment vertical="center" wrapText="1"/>
    </xf>
  </cellXfs>
</styleSheet>
"""


def cell_xml(ref: str, val: object, style: int, numeric: bool) -> str:
    if numeric:
        return f'<c r="{ref}" s="{style}" t="n"><v>{float(val)}</v></c>'
    text = escape(str(val))
    return f'<c r="{ref}" s="{style}" t="inlineStr"><is><t>{text}</t></is></c>'


def sheet_xml(
    rows: list[list[object]],
    *,
    col_widths: list[float],
    header_rows: set[int] | None = None,
    hours_cols: set[int] | None = None,
    freeze: int = 0,
    title_rows: set[int] | None = None,
    section_rows: set[int] | None = None,
    total_rows: set[int] | None = None,
    zebra: bool = False,
) -> str:
    header_rows = header_rows or set()
    hours_cols = hours_cols or set()
    title_rows = title_rows or set()
    section_rows = section_rows or set()
    total_rows = total_rows or set()
    max_c = max((len(r) for r in rows), default=1)
    max_r = max(len(rows), 1)
    cols = "".join(
        f'<col min="{i}" max="{i}" width="{w}" customWidth="1"/>'
        for i, w in enumerate(col_widths, start=1)
    )
    freeze_xml = ""
    if freeze:
        freeze_xml = (
            "<sheetViews><sheetView workbookViewId=\"0\">"
            f'<pane ySplit="{freeze}" topLeftCell="A{freeze + 1}" '
            'activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>'
        )
    lines = [
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">',
        f'<dimension ref="A1:{col_letter(max_c)}{max_r}"/>',
        freeze_xml,
        f"<cols>{cols}</cols>" if cols else "",
        "<sheetData>",
    ]
    for r_idx, row in enumerate(rows, start=1):
        ht = 22
        if r_idx in title_rows:
            ht = 28
        elif r_idx in header_rows or r_idx in total_rows:
            ht = 24
        elif zebra:
            ht = 36
        lines.append(f'<row r="{r_idx}" ht="{ht}" customHeight="1">')
        for c_idx, val in enumerate(row, start=1):
            ref = f"{col_letter(c_idx)}{r_idx}"
            numeric = as_number(val) and (
                c_idx in hours_cols or (r_idx in total_rows and c_idx in hours_cols)
            )
            if r_idx in title_rows:
                style = 2
                numeric = False
            elif r_idx in section_rows:
                style = 3
                numeric = False
            elif r_idx in total_rows:
                style = 6 if numeric else 5
            elif r_idx in header_rows:
                style = 1
                numeric = False
            elif numeric:
                style = 4
            elif zebra and r_idx % 2 == 0:
                style = 7
            else:
                style = 0
            lines.append(cell_xml(ref, val, style, numeric))
        lines.append("</row>")
    lines.append("</sheetData></worksheet>")
    return "".join(lines)


def summary_sheet(total: float) -> tuple[list[list[object]], dict]:
    rows: list[list[object]] = [
        ["CleverSolutions — Work hours statement", "", "", ""],
        ["", "", "", ""],
        ["Project", "", "", ""],
        ["Field", "Value", "", ""],
    ]
    title_rows = {1}
    section_rows = {3}
    header_rows = {4}
    hours_cols: set[int] = set()
    total_rows: set[int] = set()

    for field, value in PROJECT:
        rows.append([field, value, "", ""])

    rows.append(["", "", "", ""])
    rows.append(["Daily totals", "", "", ""])
    section_rows.add(len(rows))
    rows.append(["Day", "Date", "Hours", "Work"])
    header_rows.add(len(rows))
    hours_cols.add(3)

    for day, date, hours, work in DAILY:
        rows.append([day, date, hours, work])

    executed = sum(float(r[6]) for r in DETAILS if r[7] == "Done")
    held = sum(float(r[6]) for r in DETAILS if "Waiting" in r[7])
    rows.append(["", "Executed — payable now", executed, "Site + 127 live SKUs of ~180 total. Project close is not required to invoice this"])
    total_rows.add(len(rows))
    rows.append(["", "Held — waiting on client", held, "~53 SKUs to finish the catalogue. Same import pace"])
    total_rows.add(len(rows))
    rows.append(["", "Email form extra", 0, "Not billed — App Password already requested"])
    total_rows.add(len(rows))
    rows.append(["", "Envelope total", total, "50 h agreed — remaining catalogue is inside, not extra"])
    total_rows.add(len(rows))

    return rows, {
        "col_widths": [28, 22, 12, 72],
        "header_rows": header_rows,
        "hours_cols": hours_cols,
        "title_rows": title_rows,
        "section_rows": section_rows,
        "total_rows": total_rows,
        "freeze": 0,
        "zebra": False,
    }


def main() -> None:
    total = sum(float(r[6]) for r in DETAILS)
    daily_total = sum(float(r[2]) for r in DAILY)
    if abs(total - ENVELOPE_HOURS) > 0.001:
        raise SystemExit(f"Hours log totals {total}, expected {ENVELOPE_HOURS}")
    if abs(daily_total - ENVELOPE_HOURS) > 0.001:
        raise SystemExit(f"Daily totals {daily_total}, expected {ENVELOPE_HOURS}")

    summary_rows, summary_opts = summary_sheet(total)
    log_rows = [DETAIL_HEADERS] + DETAILS + [
        ["", "", "", "TOTAL", "", "", total, "", "50 h agreed envelope"]
    ]
    problem_rows = [PS_HEADERS] + PROBLEMS
    inventory_rows = [INV_HEADERS] + INVENTORY
    open_rows = [OPEN_HEADERS] + OPEN_ROWS
    remaining_rows = [REMAINING_HEADERS] + REMAINING_ROWS
    executed = sum(float(r[6]) for r in DETAILS if r[7] == "Done")
    held = sum(float(r[6]) for r in DETAILS if "Waiting" in r[7])

    sheets: list[tuple[str, str]] = [
        (
            "Summary",
            sheet_xml(summary_rows, **summary_opts),
        ),
        (
            "Hours Log",
            sheet_xml(
                log_rows,
                col_widths=[6, 14, 20, 42, 42, 48, 10, 16, 42],
                header_rows={1},
                hours_cols={7},
                freeze=1,
                total_rows={len(log_rows)},
                zebra=True,
            ),
        ),
        (
            "Problems Solutions",
            sheet_xml(
                problem_rows,
                col_widths=[8, 42, 36, 48, 28],
                header_rows={1},
                freeze=1,
                zebra=True,
            ),
        ),
        (
            "Deliverables",
            sheet_xml(
                inventory_rows,
                col_widths=[18, 110],
                header_rows={1},
                freeze=1,
                zebra=True,
            ),
        ),
        (
            "Open items",
            sheet_xml(
                open_rows,
                col_widths=[28, 42, 22, 22, 52],
                header_rows={1},
                hours_cols={3},
                freeze=1,
            ),
        ),
        (
            "Remaining SKUs",
            sheet_xml(
                remaining_rows,
                col_widths=[32, 16, 16, 16, 28, 48],
                header_rows={1},
                hours_cols={3},
                freeze=1,
            ),
        ),
    ]

    workbook_sheets = [
        f'<sheet name="{escape(name)}" sheetId="{i}" r:id="rId{i}"/>'
        for i, (name, _) in enumerate(sheets, start=1)
    ]
    workbook = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"'
        ' xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
        f"<sheets>{''.join(workbook_sheets)}</sheets></workbook>"
    )
    wb_rels = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        + "".join(
            f'<Relationship Id="rId{i}" '
            'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" '
            f'Target="worksheets/sheet{i}.xml"/>'
            for i in range(1, len(sheets) + 1)
        )
        + '<Relationship Id="rIdStyles" '
        'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" '
        'Target="styles.xml"/>'
        + "</Relationships>"
    )
    content_types = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        '<Default Extension="xml" ContentType="application/xml"/>'
        '<Override PartName="/xl/workbook.xml" '
        'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
        '<Override PartName="/xl/styles.xml" '
        'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
        + "".join(
            f'<Override PartName="/xl/worksheets/sheet{i}.xml" '
            'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'
            for i in range(1, len(sheets) + 1)
        )
        + "</Types>"
    )
    root_rels = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
        '<Relationship Id="rId1" '
        'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" '
        'Target="xl/workbook.xml"/>'
        "</Relationships>"
    )

    target = OUT_FALLBACK
    payload = (content_types, root_rels, workbook, wb_rels, sheets)
    try:
        with zipfile.ZipFile(target, "w", compression=zipfile.ZIP_DEFLATED) as z:
            _write_xlsx(z, *payload)
    except PermissionError:
        target = OUT
        with zipfile.ZipFile(target, "w", compression=zipfile.ZIP_DEFLATED) as z:
            _write_xlsx(z, *payload)

    csv_path = target.with_suffix(".csv")
    with csv_path.open("w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(["CleverSolutions — Work hours statement"])
        w.writerow([])
        w.writerow(["PROJECT"])
        w.writerow(["Field", "Value"])
        w.writerows(PROJECT)
        w.writerow([])
        w.writerow(["DAILY TOTALS"])
        w.writerow(["Day", "Date", "Hours", "Work"])
        w.writerows(DAILY)
        w.writerow(["", "Executed — payable now", executed, "Site + 127 live SKUs of ~180 total"])
        w.writerow(["", "Held — waiting on client", held, "~53 SKUs to finish the catalogue"])
        w.writerow(["", "Email form extra", 0, "Not billed"])
        w.writerow(["", "Envelope total", total, "50 h agreed"])
        w.writerow([])
        w.writerow(["HOURS LOG"])
        w.writerow(DETAIL_HEADERS)
        w.writerows(DETAILS)
        w.writerow(["", "", "", "TOTAL", "", "", total, "", "50 h agreed envelope"])
        w.writerow([])
        w.writerow(["REMAINING SKUs"])
        w.writerow(REMAINING_HEADERS)
        w.writerows(REMAINING_ROWS)
        w.writerow([])
        w.writerow(["OPEN ITEMS"])
        w.writerow(OPEN_HEADERS)
        w.writerows(OPEN_ROWS)

    print(f"Wrote {target}")
    print(f"Wrote {csv_path}")
    print(f"Total hours: {total} (executed {executed}, held {held})")


def _write_xlsx(z, content_types, root_rels, workbook, wb_rels, sheets):
    z.writestr("[Content_Types].xml", content_types)
    z.writestr("_rels/.rels", root_rels)
    z.writestr("xl/workbook.xml", workbook)
    z.writestr("xl/_rels/workbook.xml.rels", wb_rels)
    z.writestr("xl/styles.xml", STYLES_XML)
    for i, (_, data) in enumerate(sheets, start=1):
        z.writestr(f"xl/worksheets/sheet{i}.xml", data)


if __name__ == "__main__":
    main()
