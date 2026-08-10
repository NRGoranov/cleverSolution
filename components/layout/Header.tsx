"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { bg } from "@/content/bg";
import { categories } from "@/data/products";
import { cn } from "@/lib/utils";

type NavCategory = (typeof categories)[number];

function CategoryDropdown({
  category,
  active,
}: {
  category: NavCategory;
  active: boolean;
}) {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
    >
      <Link
        href={category.href}
        className={cn(
          "inline-flex items-center gap-1 py-2 text-sm font-medium transition-colors hover:text-zinc-500",
          active ? "text-zinc-900" : "text-zinc-700"
        )}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={menuId}
      >
        {category.name}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={cn("transition-transform", open && "rotate-180")}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </Link>

      <div
        id={menuId}
        role="menu"
        className={cn(
          "absolute left-0 top-full z-50 min-w-[12rem] pt-2 transition-all",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        )}
      >
        <ul className="rounded-lg border border-zinc-200 bg-white py-2 shadow-soft-lg">
          {category.subcategories.map((sub) => (
            <li key={sub.href} role="none">
              <Link
                role="menuitem"
                href={sub.href}
                className="block px-4 py-2 text-sm text-zinc-700 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
              >
                {sub.name}
              </Link>
            </li>
          ))}
          <li role="none" className="mt-1 border-t border-zinc-100 pt-1">
            <Link
              role="menuitem"
              href={category.href}
              className="block px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50"
            >
              {bg.featured.viewAll}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setMenuOpen(false);
    setExpandedCategory(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight text-zinc-900"
        >
          {bg.site.name}
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Основна навигация">
          <Link
            href="/"
            className={cn(
              "py-2 text-sm font-medium transition-colors hover:text-zinc-500",
              pathname === "/" ? "text-zinc-900" : "text-zinc-700"
            )}
          >
            {bg.nav.home}
          </Link>
          {categories.map((category) => (
            <CategoryDropdown
              key={category.id}
              category={category}
              active={pathname === category.href}
            />
          ))}
          <Link
            href="/contact"
            className={cn(
              "py-2 text-sm font-medium transition-colors hover:text-zinc-500",
              pathname === "/contact" ? "text-zinc-900" : "text-zinc-700"
            )}
          >
            {bg.nav.contact}
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-zinc-900 md:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? bg.nav.menuClose : bg.nav.menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          )}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          className="max-h-[80vh] overflow-y-auto border-t border-zinc-200 bg-white px-4 py-4 md:hidden"
          aria-label="Мобилна навигация"
        >
          <ul className="space-y-1">
            <li>
              <Link href="/" className="block py-2 text-lg font-medium text-zinc-900">
                {bg.nav.home}
              </Link>
            </li>
            {categories.map((category) => {
              const expanded = expandedCategory === category.id;
              return (
                <li key={category.id} className="border-b border-zinc-100 py-1">
                  <div className="flex items-center justify-between">
                    <Link
                      href={category.href}
                      className="block flex-1 py-2 text-lg font-medium text-zinc-900"
                    >
                      {category.name}
                    </Link>
                    <button
                      type="button"
                      className="rounded p-2 text-zinc-500"
                      aria-expanded={expanded}
                      aria-label={category.name}
                      onClick={() =>
                        setExpandedCategory(expanded ? null : category.id)
                      }
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={cn("transition-transform", expanded && "rotate-180")}
                        aria-hidden="true"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </button>
                  </div>
                  {expanded && (
                    <ul className="mb-2 space-y-1 pl-3">
                      {category.subcategories.map((sub) => (
                        <li key={sub.href}>
                          <Link
                            href={sub.href}
                            className="block py-1.5 text-sm text-zinc-600"
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
            <li>
              <Link
                href="/contact"
                className="block py-2 text-lg font-medium text-zinc-900"
              >
                {bg.nav.contact}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
