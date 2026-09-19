"""Generate CleverSolutions hours work statement as .xlsx + .csv (stdlib only)."""

from __future__ import annotations

import csv
import zipfile
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "CleverSolutions-Work-Hours-Statement.xlsx"
OUT_FALLBACK = ROOT / "docs" / "CleverSolutions-Work-Hours-Statement-client.xlsx"
OUT.parent.mkdir(parents=True, exist_ok=True)

SUMMARY_ROWS = [
    ["Field", "Value"],
    ["Project", "CleverSolutions — Product Gallery / Representative Website"],
    ["Client / Brand", "CleverSolutions (Bulgaria, bg-BG)"],
    ["Repository", "https://github.com/NRGoranov/cleverSolution"],
    ["Work date(s)", "2026-08-09 — 2026-09-19 (site build, catalogue, brand, UX, remaining publishes)"],
    ["Role", "Full-stack web development (Next.js / React / TypeScript)"],
    [
        "Nature of work",
        "Greenfield rebuild of product gallery site (not e-commerce checkout)",
    ],
    ["Primary CTA", "Phone + email (contact form on page, send disabled until reliable)"],
    [
        "Stack delivered",
        "Next.js 16.3, React 19.2, TypeScript, Tailwind CSS, Zod, Motion, Playwright, Resend, Vercel-ready",
    ],
    ["Agreed project envelope", "50 h total (do not exceed)"],
    ["Total billable hours (mapped)", "50"],
    ["Day 1 — 09.08.2026", "6.5 h — project setup, content system, data layer, design tokens"],
    ["Day 2 — 10.08.2026", "7.0 h — pages, navigation, contact API, SEO, smoke tests"],
    ["Day 3 — 11.08.2026", "6.5 h — upgrade, brand polish, navbar motion, DriftWall backgrounds, handoff"],
    ["Day 4 — 20.08.2026", "5.0 h — kitchen catalogue Excel import (39 SKUs + images)"],
    ["Day 5 — 21.08.2026", "0.75 h — catalogue text cleanup"],
    ["Day 6 — 22.08.2026", "3.5 h — orange brand, logo/favicon, bilingual About page"],
    ["Day 7 — 23.08.2026", "3.5 h — hero links, image fit, hours statement, navbar/DriftWall layout"],
    ["Day 8 — 31.08.2026", "3.75 h — FAQ/legal pages; portfolio-style mobile menu (overlay, roll-down)"],
    ["Day 9 — 16.09.2026", "2.0 h — contact warning + live phone/email; nav stacking above sections"],
    ["Day 10 — 17.09.2026", "3.0 h — readable current-page highlights; first 17 wristbands; this statement"],
    ["Day 11 — 18.09.2026", "6.5 h — publish kitchen 75 SKUs + remaining 35 wristbands (work ready locally)"],
    ["Day 12 — 19.09.2026", "2.0 h — DriftWall photos from new catalogue; final publish QA"],
    [
        "Live on GitHub now",
        "39 kitchen SKUs (live) + 17 vinyl/plastic wristbands; FAQ/legal; contact via phone/email",
    ],
    [
        "Publish next few days (already executed locally)",
        "Kitchen → 75 SKUs with new subcategories/photos; wristbands → 52 SKUs (silicone, textile, Tyvek, thermal, RFID)",
    ],
    [
        "Outside this 50 h envelope",
        "Real security + cleaning catalogues if/when the client sends files (still demo SKUs)",
    ],
    [
        "Currency note",
        "Hours are task-based estimates inside the agreed 50 h project total; adjust rate as agreed",
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
        "2",
        "package.json, app/, tailwind.config.ts, AGENTS.md",
    ],
    [
        "2",
        "2026-08-09",
        "Content & i18n",
        "Bulgarian content system for all UI strings",
        "UI must be bg-BG; single editable copy source for non-developer updates",
        "Centralized content/bg.ts for site, nav, hero, categories, product, contact, footer",
        "1",
        "content/bg.ts",
    ],
    [
        "3",
        "2026-08-09",
        "Data architecture",
        "Zod-validated product data layer for 4 categories; hand-editable placeholders",
        "No CMS; real data from paper records later; schema must stay stable",
        "ProductSchema; per-category files; draft/published; optional price; index helpers",
        "1.75",
        "data/products/*",
    ],
    [
        "4",
        "2026-08-09",
        "Design system",
        "Tokens, typography, skeletons, SSR-safe motion primitives",
        "Loading states must match layouts; Framer SSR blank-page risk",
        "Ink/canvas tokens; skeleton shimmer; ScrollReveal safe mount pattern",
        "1.75",
        "globals.css, components/skeletons, components/motion",
    ],
    [
        "5",
        "2026-08-10",
        "Layout & navigation",
        "Header/Footer; category nav; mobile menu; subcategory dropdowns",
        "Four categories; English URL slugs with Bulgarian labels",
        "Sticky header, hover dropdowns, responsive drawer, footer structure",
        "1.25",
        "components/layout/Header.tsx, Footer.tsx",
    ],
    [
        "6",
        "2026-08-10",
        "Home page",
        "Hero, category grid, featured products, contact CTA block",
        "Brand-first hero with local product photography",
        "Hero10 image fan; HomeSections; primary/secondary CTAs",
        "1.5",
        "components/home/*, components/ui/hero-10.tsx, app/page.tsx",
    ],
    [
        "7",
        "2026-08-10",
        "Category & product pages",
        "Galleries, coming-soon states, product detail with gallery/specs/JSON-LD",
        "SEO without checkout; async App Router params on Next 16",
        "CategoryPageContent; ProductGallery/Specs; generateStaticParams; contact deep-link",
        "1.75",
        "app/{kitchen,security,wristbands,vacuums}, app/product/[slug]/*",
    ],
    [
        "8",
        "2026-08-10",
        "Contact & email",
        "Contact page + Resend API Route Handler",
        "Production email path with env-based configuration",
        "Validated form; POST /api/contact; .env.example",
        "1.25",
        "app/contact, components/contact/ContactForm.tsx, app/api/contact",
    ],
    [
        "9",
        "2026-08-10",
        "Assets, SEO & QA",
        "Local images, metadata/sitemap, Playwright smoke tests",
        "No remote stock dependency; regression safety before handoff",
        "public/images/*; robots/sitemap; e2e smoke suite (14 paths)",
        "1.25",
        "public/images, SEO files, e2e/smoke.spec.ts",
    ],
    [
        "10",
        "2026-08-11",
        "Platform upgrade",
        "Upgrade to Next.js 16 and React 19; fix breaking changes",
        "Codemod hung; params Promise migration; build verification",
        "Manual dep upgrade; async params fixes; verified production build",
        "1.25",
        "package.json, product page params, eslint-config-next 16",
    ],
    [
        "11",
        "2026-08-11",
        "Brand & UX polish",
        "Teal accent, scrollbar, product card Details flow, scroll-to-top, footer credit",
        "Monochrome UI; cards pushed contact too early; mobile polish",
        "brand tokens; ProductCard Details CTA; ScrollToTop; subtle NRG footer link",
        "1.25",
        "globals.css, tailwind.config.ts, ProductCard, ScrollToTop, Footer",
    ],
    [
        "12",
        "2026-08-11",
        "Navbar motion",
        "Port NRGxPortfolio scroll-shrink navbar behaviour",
        "Client wanted same motion language as portfolio site",
        "Scroll-shrink pill header, cursor sheen, underline hovers, animated mobile menu",
        "1",
        "components/layout/Header.tsx",
    ],
    [
        "13",
        "2026-08-11",
        "Homepage backgrounds",
        "DriftWall full-page backdrop; layered category/contact panels; inner-page teal gradient",
        "Hero atmosphere vs readable content sections; footer above fixed background",
        "DriftWall + HomePageBackground; MainBackground route switch; PageGradientBackground",
        "1.75",
        "DriftWall.jsx, HomePageBackground, PageGradientBackground, HomeSections",
    ],
    [
        "14",
        "2026-08-11",
        "Bugfixes & DX",
        "React 19 script warning, Windows .next cache, JSON-LD, dev scripts",
        "Balancer script tag; dev server lock; console warnings",
        "Removed react-wrap-balancer; clean/dev:fresh; data-scroll-behavior; JSON-LD pattern",
        "0.75",
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
        "data/products/kitchenware.ts",
    ],
    [
        "18",
        "2026-08-22",
        "Brand & About",
        "Orange/black palette, logo mark favicon, bilingual За нас page",
        "Client asked for About copy, warmer color, logo colors black+orange",
        "Brand tokens #FF6000; BrandLogo; /about BG+EN; nav/footer; icon/apple-icon/favicon",
        "3.5",
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
        "scripts/generate-work-statement.py, docs/CleverSolutions-Work-Hours-Statement-client.*",
    ],
    [
        "21",
        "2026-08-23",
        "Layout polish — published",
        "Fill DriftWall on wide screens; full-width then compact scrolled navbar",
        "Backdrop columns stopped at 7 on large monitors; navbar did not span the viewport",
        "Filled DriftWall to viewport; 100vw top bar; compact centered pill on scroll; type tweaks",
        "1.25",
        "Header.tsx, DriftWall, globals.css; commits 28b89d4, d5afbe9, a680154",
    ],
    [
        "22",
        "2026-08-31",
        "Legal & FAQ — published",
        "FAQ and legal pages; portfolio-style mobile navbar",
        "No FAQ/privacy/terms; burger menu needed to match NRGxPortfolio behaviour",
        "Added /faq /privacy /terms; FAQ JSON-LD; mobile menu copied from portfolio pattern",
        "2.25",
        "app/faq, app/privacy, app/terms, FaqPreview, Header.tsx; commit 398477d",
    ],
    [
        "23",
        "2026-08-31",
        "Mobile nav — published",
        "Menu must float over the page, roll down, no burger border",
        "Open menu expanded/stuck the header and pushed the whole layout",
        "Portal overlay; height animation from the bar; borderless burger; page no longer shifts",
        "1.5",
        "Header.tsx; commits 5c9dad8, fdb698f",
    ],
    [
        "24",
        "2026-09-16",
        "Contact & FAQ — published",
        "Disable unreliable send; live phone/email; clickable FAQ answers",
        "Form did not send smoothly; old placeholder contacts; FAQ had no links",
        "Warning + disabled submit; +359 888 250 818 and office@cleversolution.bg; markdown FAQ links",
        "1.5",
        "ContactForm.tsx, content/bg.ts, FaqAnswer.tsx, lib/faq.ts; commit 0b532af",
    ],
    [
        "25",
        "2026-09-16",
        "Navbar stacking — published",
        "Desktop bar and category dropdowns above page sections",
        "Menus painted under hero/category cards (overflow + z-index)",
        "Raised header stacking; overflow visible; dropdowns sit on top of content",
        "0.5",
        "Header.tsx, app/layout.tsx; commit bf7a3af",
    ],
    [
        "26",
        "2026-09-17",
        "UX + catalogue — published",
        "Readable current-page highlights; first third of wristband catalogue",
        "Active labels matched the peach background; wristbands still demo SKUs",
        "Darker/slightly scaled current item; 5px chip padding; 17 vinyl + Superband/SureImage SKUs live",
        "2.5",
        "Header, CategorySubnav, data/products/wristbands.ts, public/images/products/wristbands/*; commit aa2e01f",
    ],
    [
        "27",
        "2026-09-18",
        "Kitchen catalogue — publish next days",
        "Expand kitchen from 39 to 75 SKUs with new subcategories and photos",
        "Client sent a fuller Equipment Excel (all sheets, WAVE 1, fridge tables, ranges)",
        "Executed locally: importer + 75 published products, 8 kitchen subs; commit to main in the next days",
        "3.5",
        "scripts/import-catalogue.py, data/products/kitchenware.ts, content/bg.ts, public/images/products/*",
    ],
    [
        "28",
        "2026-09-18",
        "Wristbands catalogue — publish next days",
        "Remaining two-thirds of wristbands (35 SKUs)",
        "17 of 52 live; silicone, textile, Tyvek, thermal, RFID, holographic plastic still local",
        "Executed locally from scheme.xlsx + Word docs; publish remaining families in the next days",
        "3",
        "data/products/wristbands.ts, import-wristbands.py, public/images/products/wristbands/*",
    ],
    [
        "29",
        "2026-09-17",
        "Billing — this statement",
        "Map remaining work into the agreed 50 h envelope",
        "Previous log stopped at 31.5 h and still quoted 24–36 h extra for 150–180 SKUs",
        "Extended log through 19.09; remaining publishes sit inside 50 h; no overshoot",
        "0.5",
        "scripts/generate-work-statement.py, docs/CleverSolutions-Work-Hours-Statement-client.*",
    ],
    [
        "30",
        "2026-09-19",
        "Wrap-up — scheduled",
        "Homepage DriftWall photos from new SKUs; publish QA; close 50 h envelope",
        "New kitchen/wristband photos not yet on the live backdrop; remaining git publish",
        "Swap DriftWall tiles to new catalogue shots; verify category/product routes after push",
        "2",
        "lib/hero-drift-images.ts, GitHub main, Playwright smoke",
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
        "Remaining 150–180 SKUs not yet on the site",
        "Original estimate assumed a much larger mixed catalogue",
        "Client files covered kitchen (75) + wristbands (52). Those fit inside the 50 h cap; security/vacuums stay demo until new files arrive",
        "Kitchen + wristbands mapped in this envelope; other categories waiting on client",
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
        "Visible warning; send disabled; phone +359 888 250 818 and office@cleversolution.bg",
        "Resolved (form stays off until delivery is stable)",
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
]

INV_HEADERS = ["Area", "Items delivered"]
INVENTORY = [
    [
        "Public routes",
        "/ · /about · /faq · /privacy · /terms · /kitchen · /security · /wristbands · /vacuums · /product/[slug] · /contact",
    ],
    ["API", "POST /api/contact (present; send button disabled until reliable)"],
    [
        "Data model",
        "Zod Product schema; 39 kitchen SKUs live (75 ready to publish); 17 wristbands live (52 ready to publish); security/vacuums still samples",
    ],
    [
        "UI surfaces",
        "Hero, FAQ accordion with links, legal pages, category grids, product cards/detail, contact warning + phone/email, coming soon, skeletons",
    ],
    ["SEO", "Metadata, Open Graph, JSON-LD Product + FAQ, sitemap/robots"],
    ["Tests", "Playwright smoke + site-health (contact disabled-form checks)"],
    ["Ops", "Vercel-oriented Next 16 app; env example; clean/dev:fresh scripts"],
    [
        "Git milestones",
        "910e54c initial · 4c816f6 kitchen 39 · e0cd666 brand/About · 398477d FAQ/mobile nav · 0b532af contact/phone · aa2e01f 17 wristbands",
    ],
]

REMAINING_HEADERS = [
    "Work package",
    "SKU / scope",
    "Execution",
    "Hours (inside 50 h)",
    "Status",
    "Notes",
]

REMAINING_ROWS = [
    [
        "Kitchen expansion",
        "+36 SKUs (39 → 75) + new subcategories/photos",
        "Already built locally — commit 18.09",
        "3.5",
        "Scheduled publish",
        "Hours in log ID 27",
    ],
    [
        "Wristbands remainder",
        "+35 SKUs (17 → 52)",
        "Already built locally — commit 18.09",
        "3",
        "Scheduled publish",
        "Hours in log ID 28",
    ],
    [
        "DriftWall + publish QA",
        "New photos on homepage; verify routes after push",
        "Scheduled 19.09",
        "2",
        "Scheduled wrap-up",
        "Hours in log ID 30",
    ],
    [
        "This hours statement",
        "Map work to 50 h cap",
        "Executed 17.09",
        "0.5",
        "Done",
        "Hours in log ID 29",
    ],
    [
        "Security + cleaning real catalogue",
        "Still 8 demo SKUs",
        "Waiting on client Excel/photos",
        "0",
        "Out of envelope",
        "Not billed inside 50 h unless new files arrive",
    ],
    [
        "Contact form send",
        "Button stays disabled",
        "Re-enable only when delivery is stable",
        "0",
        "Parked",
        "Use wrap-up buffer only if requested inside 50 h",
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


def sheet_xml(rows: list[list[object]]) -> str:
    max_c = max(len(r) for r in rows)
    max_r = len(rows)
    lines = [
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"'
        ' xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">',
        f'<dimension ref="A1:{col_letter(max_c)}{max_r}"/>',
        "<sheetData>",
    ]
    for r_idx, row in enumerate(rows, start=1):
        lines.append(f'<row r="{r_idx}">')
        for c_idx, val in enumerate(row, start=1):
            ref = f"{col_letter(c_idx)}{r_idx}"
            if is_number(val) and not (
                isinstance(val, str) and val.startswith("0") and len(val) > 1 and "." not in val
            ):
                # keep IDs like "1" as numbers is fine; hours as numbers
                if r_idx == 1:
                    text = escape(str(val))
                    lines.append(f'<c r="{ref}" t="inlineStr"><is><t>{text}</t></is></c>')
                else:
                    lines.append(f'<c r="{ref}" t="n"><v>{float(val)}</v></c>')
            else:
                text = escape(str(val))
                lines.append(f'<c r="{ref}" t="inlineStr"><is><t>{text}</t></is></c>')
        lines.append("</row>")
    lines.append("</sheetData></worksheet>")
    return "".join(lines)


def main() -> None:
    sheets: list[tuple[str, list[list[object]]]] = [
        ("Summary", SUMMARY_ROWS),
        ("Hours Log", [DETAIL_HEADERS] + DETAILS),
        ("Problems Solutions", [PS_HEADERS] + PROBLEMS),
        ("Deliverables", [INV_HEADERS] + INVENTORY),
        ("Mapped remaining", [REMAINING_HEADERS] + REMAINING_ROWS),
    ]

    sheet_files: list[tuple[str, str]] = []
    workbook_sheets: list[str] = []
    for i, (name, rows) in enumerate(sheets, start=1):
        path = f"xl/worksheets/sheet{i}.xml"
        sheet_files.append((path, sheet_xml(rows)))
        workbook_sheets.append(
            f'<sheet name="{escape(name)}" sheetId="{i}" r:id="rId{i}"/>'
        )

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
        + "</Relationships>"
    )

    content_types = (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>'
        '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
        '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
        '<Default Extension="xml" ContentType="application/xml"/>'
        '<Override PartName="/xl/workbook.xml" '
        'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
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
    try:
        with zipfile.ZipFile(target, "w", compression=zipfile.ZIP_DEFLATED) as z:
            _write_xlsx(z, content_types, root_rels, workbook, wb_rels, sheet_files)
    except PermissionError:
        target = OUT
        with zipfile.ZipFile(target, "w", compression=zipfile.ZIP_DEFLATED) as z:
            _write_xlsx(z, content_types, root_rels, workbook, wb_rels, sheet_files)

    csv_path = target.with_suffix(".csv")
    total = sum(float(r[6]) for r in DETAILS)
    with csv_path.open("w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(DETAIL_HEADERS)
        w.writerows(DETAILS)
        w.writerow([])
        w.writerow(["TOTAL HOURS", "", "", "", "", "", total, ""])
        w.writerow([])
        w.writerow(["MAPPED REMAINING (inside 50 h envelope)"])
        w.writerow(REMAINING_HEADERS)
        w.writerows(REMAINING_ROWS)
        w.writerow([])
        w.writerow(
            [
                "Project envelope",
                "50 h agreed total",
                "Logged work + scheduled publishes = 50 h; no extra 150–180 SKU quote",
                "50",
                "",
                "Security/vacuums real data is outside this envelope until files arrive",
            ]
        )

    print(f"Wrote {target}")
    print(f"Wrote {csv_path}")
    print(f"Total hours: {total}")


def _write_xlsx(z, content_types, root_rels, workbook, wb_rels, sheet_files):
    z.writestr("[Content_Types].xml", content_types)
    z.writestr("_rels/.rels", root_rels)
    z.writestr("xl/workbook.xml", workbook)
    z.writestr("xl/_rels/workbook.xml.rels", wb_rels)
    for path, data in sheet_files:
        z.writestr(path, data)


if __name__ == "__main__":
    main()
