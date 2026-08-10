"""Generate CleverSolutions hours work statement as .xlsx + .csv (stdlib only)."""

from __future__ import annotations

import csv
import zipfile
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "docs" / "CleverSolutions-Work-Hours-Statement.xlsx"
OUT.parent.mkdir(parents=True, exist_ok=True)

SUMMARY_ROWS = [
    ["Field", "Value"],
    ["Project", "CleverSolutions — Product Gallery / Representative Website"],
    ["Client / Brand", "CleverSolutions (Bulgaria, bg-BG)"],
    ["Repository", "https://github.com/NRGoranov/cleverSolution"],
    ["Work date(s)", "2026-08-10"],
    ["Role", "Full-stack web development (Next.js / React / TypeScript)"],
    [
        "Nature of work",
        "Greenfield rebuild of product gallery site (not e-commerce checkout)",
    ],
    ["Primary CTA", "Contact form (Resend) — not cart/checkout"],
    [
        "Stack delivered",
        "Next.js 16.3, React 19.2, TypeScript, Tailwind CSS, Zod, Motion, Playwright, Resend, Vercel-ready",
    ],
    ["Total billable hours (estimated)", "32.5"],
    [
        "Currency note",
        "Hours are task-based estimates matching delivered scope; adjust rates as needed",
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
        "2026-08-10",
        "Discovery & setup",
        "Read rebuild brief; scaffold Next.js App Router project with TypeScript, Tailwind, ESLint, project conventions",
        "Empty workspace; need production-ready base aligned to brief (gallery not store)",
        "Scaffolded Next.js app; configured path aliases, Tailwind tokens, fonts (display + sans with Cyrillic), base layout shell",
        "2.0",
        "package.json, app/, tailwind.config.ts, AGENTS.md conventions",
    ],
    [
        "2",
        "2026-08-10",
        "Content & i18n",
        "Bulgarian content system for all UI strings",
        "UI must be bg-BG; editors need one place for copy",
        "Centralized content/bg.ts with site, nav, hero, categories, product, contact, footer strings",
        "1.5",
        "content/bg.ts",
    ],
    [
        "3",
        "2026-08-10",
        "Data architecture",
        "Zod-validated product data layer for 4 categories; hand-editable placeholders",
        "No CMS; real data arrives later from paper records; must avoid schema churn",
        "ProductSchema + per-category TS files; draft vs published; optional priceBgn; empty images = placeholder; index helpers",
        "3.0",
        "data/products/{schema,index,kitchenware,security,wristbands,vacuums}.ts",
    ],
    [
        "4",
        "2026-08-10",
        "Design system",
        "Visual system: tokens, typography, skeletons, motion primitives",
        "Need maintainable UI; loading states must match layout; SSR motion pitfalls",
        "Canvas/ink tokens; skeleton shimmer; ScrollReveal with SSR-safe mount (avoid opacity:0 blank page)",
        "2.0",
        "app/globals.css, components/skeletons, components/motion",
    ],
    [
        "5",
        "2026-08-10",
        "Layout & navigation",
        "Header/Footer with category nav, mobile menu, subcategory dropdowns",
        "Four unrelated categories need clear IA; English routes for URLs, BG labels",
        "Sticky header, hover dropdowns with English query slugs, responsive drawer menu, footer links + contact",
        "2.0",
        "components/layout/Header.tsx, Footer.tsx",
    ],
    [
        "6",
        "2026-08-10",
        "Home page",
        "Hero + category grid + featured products + contact CTA",
        "Brand-first hero with real product photography (not stock collage)",
        "Hero10 fan of local hero images; HomeSections for categories/featured/contact; primary CTAs",
        "2.5",
        "components/home/*, components/ui/hero-10.tsx, app/page.tsx, public/images/hero",
    ],
    [
        "7",
        "2026-08-10",
        "Category pages",
        "Kitchen / Security / Wristbands / Vacuums galleries + empty/coming-soon states",
        "Some categories sparse; drafts must stay hidden",
        "Shared CategoryPageContent; ComingSoon state; product grids filtered to published only",
        "2.0",
        "app/{kitchen,security,wristbands,vacuums}, lib/category-page.tsx",
    ],
    [
        "8",
        "2026-08-10",
        "Product detail",
        "Product page: gallery, specs, description, JSON-LD, contact deep-link",
        "SEO + conversion without checkout; async params on modern Next",
        "Dynamic /product/[slug]; generateStaticParams; metadata; gallery/specs; contact?product=; Product JSON-LD",
        "2.5",
        "app/product/[slug]/*, components/products/*, lib/product-jsonld.ts",
    ],
    [
        "9",
        "2026-08-10",
        "Contact & email",
        "Contact page + API Route Handler with Resend",
        "Need production email path with env-based config",
        "Validated form UI; POST /api/contact; .env.example for RESEND_* and site URL",
        "2.0",
        "app/contact, components/contact/ContactForm.tsx, app/api/contact, .env.example",
    ],
    [
        "10",
        "2026-08-10",
        "Media & assets",
        "Local image pipeline for hero and kitchen sample products",
        "Avoid remote Unsplash dependency; empty image arrays must degrade gracefully",
        "public/images structure; ImagePlaceholder; Next Image usage",
        "1.5",
        "public/images/products/sample-*, ImagePlaceholder.tsx",
    ],
    [
        "11",
        "2026-08-10",
        "Routing & SEO",
        "English public routes; sitemap/robots/metadata; remove Cyrillic URL friction",
        "Cyrillic/Latin slug confusion; need stable English paths with BG UI",
        "Routes: /, /kitchen, /security, /wristbands, /vacuums, /product/[slug], /contact; metadata + SEO files",
        "1.5",
        "app routes, lib/site-config.ts, SEO files",
    ],
    [
        "12",
        "2026-08-10",
        "QA automation",
        "Playwright smoke tests for critical paths",
        "Need regression safety for gallery + contact flows",
        "e2e smoke suite (home, categories, product, contact, draft hidden); playwright config",
        "1.5",
        "e2e/smoke.spec.ts, playwright.config.ts",
    ],
    [
        "13",
        "2026-08-10",
        "Platform upgrade",
        "Upgrade Next.js 14 to 16 and React 19; fix breaking changes",
        "Interactive codemod hung; App Router async params; dependency engine warnings",
        "Manual dependency bump; params Promise fixes; Vercel plugin guidance; verified build",
        "2.5",
        "package.json, product page params, eslint-config-next 16",
    ],
    [
        "14",
        "2026-08-10",
        "DevOps / DX",
        "Fix Windows .next lock/corruption and blank-page SSR motion issues",
        "Dev server hung on Starting; corrupted .next; Framer opacity:0 hid content",
        "npm run clean / dev:fresh scripts; ScrollReveal mounts plain div until client ready",
        "1.5",
        "package.json scripts, ScrollReveal.tsx",
    ],
    [
        "15",
        "2026-08-10",
        "UX iteration",
        "Product cards: brief info + full-width Details CTA; equal-height cards",
        "Cards previously over-emphasized contact; need browse then detail flow",
        "Details CTA; mt-auto pinned button; grid items-stretch; contact CTA only on detail",
        "1.5",
        "ProductCard.tsx, ProductGrid.tsx, skeletons, content/bg.ts",
    ],
    [
        "16",
        "2026-08-10",
        "Brand & polish",
        "Site teal accent + custom scrollbar matching brand",
        "Default OS scrollbar + grey-only UI felt unfinished",
        "brand tokens in Tailwind/CSS; primary/CTAs/header/footer; scrollbar WebKit + Firefox; selection/focus",
        "1.5",
        "globals.css, tailwind.config.ts, lib/utils.ts, Header/Footer/CTAs",
    ],
    [
        "17",
        "2026-08-10",
        "Bugfix",
        "React 19 console error: script tag while rendering (hero)",
        "react-wrap-balancer injects script; React 19 forbids that client path",
        "Removed Balancer; CSS text-balance; uninstalled dependency; data-scroll-behavior on html",
        "1.0",
        "hero-10.tsx, app/layout.tsx, package.json",
    ],
    [
        "18",
        "2026-08-10",
        "Handoff",
        "Git commits, GitHub push, documentation of hours for reporting",
        "Need auditable history + hours justification artifact",
        "Committed/pushed main; produced this Excel work statement",
        "0.5",
        "git history, docs/CleverSolutions-Work-Hours-Statement.xlsx",
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
        "Monochrome UI lacked brand identity",
        "Site felt generic",
        "Teal brand accent + branded scrollbar/selection/CTAs",
        "Resolved",
    ],
]

INV_HEADERS = ["Area", "Items delivered"]
INVENTORY = [
    [
        "Public routes",
        "/ · /kitchen · /security · /wristbands · /vacuums · /product/[slug] · /contact",
    ],
    ["API", "POST /api/contact (Resend)"],
    [
        "Data model",
        "Zod Product schema; 4 category datasets; published/draft; optional price & buyUrl",
    ],
    [
        "UI surfaces",
        "Hero, category grids, product cards/detail/gallery/specs, contact form, coming soon, skeletons",
    ],
    ["SEO", "Metadata, Open Graph, JSON-LD Product, sitemap/robots (as implemented)"],
    ["Tests", "Playwright smoke tests"],
    ["Ops", "Vercel-oriented Next 16 app; env example; clean/dev:fresh scripts"],
    [
        "Git milestones",
        "910e54c initial site · a38c483 Next 16 upgrade · follow-up commit brand/UX/bugfixes + this statement",
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

    with zipfile.ZipFile(OUT, "w", compression=zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", content_types)
        z.writestr("_rels/.rels", root_rels)
        z.writestr("xl/workbook.xml", workbook)
        z.writestr("xl/_rels/workbook.xml.rels", wb_rels)
        for path, data in sheet_files:
            z.writestr(path, data)

    csv_path = OUT.with_suffix(".csv")
    total = sum(float(r[6]) for r in DETAILS)
    with csv_path.open("w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f)
        w.writerow(DETAIL_HEADERS)
        w.writerows(DETAILS)
        w.writerow([])
        w.writerow(["TOTAL HOURS", "", "", "", "", "", total, ""])

    print(f"Wrote {OUT}")
    print(f"Wrote {csv_path}")
    print(f"Total hours: {total}")


if __name__ == "__main__":
    main()
