"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { bg } from "@/content/bg";
import { categories } from "@/data/products";
import { BrandLogo } from "@/components/layout/BrandLogo";
import { cn } from "@/lib/utils";

type NavCategory = (typeof categories)[number];

const SCROLL_START = 40;
const SCROLL_RANGE = 140;
const SPRING = { stiffness: 260, damping: 36, mass: 0.7 };
const COMPACT_MAX_WIDTH_PX = 80 * 16; // 80rem
const COMPACT_SIDE_PAD_PX = 16;

function desktopNavLinkClass(isActive: boolean) {
  return cn(
    "relative inline-flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-1 text-sm font-medium transition-[color,background-color] duration-200 ease-out lg:px-2.5",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2",
    "after:pointer-events-none after:absolute after:inset-x-2 after:bottom-0.5 after:h-px after:rounded-full after:bg-brand after:origin-center after:transition-[transform,opacity] after:duration-200 after:ease-out",
    isActive
      ? "text-zinc-900 after:scale-x-100 after:opacity-90"
      : "text-zinc-700 after:scale-x-0 after:opacity-0 hover:bg-zinc-900/[0.04] hover:text-zinc-900 hover:after:scale-x-100 hover:after:opacity-80"
  );
}

function mobileNavLinkClass(isActive: boolean) {
  return cn(
    "flex items-center justify-between rounded-2xl border px-4 py-3.5 text-lg font-medium transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2",
    isActive
      ? "border-brand/25 bg-brand/[0.07] text-brand"
      : "border-transparent text-zinc-900 hover:border-zinc-200 hover:bg-zinc-50"
  );
}

function MobileLinkChevron() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="shrink-0 text-zinc-400"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

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
        className={desktopNavLinkClass(active)}
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
          className={cn(
            "transition-transform duration-200 ease-out",
            open && "rotate-180"
          )}
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </Link>

      <div
        id={menuId}
        role="menu"
        className={cn(
          "absolute left-0 top-full z-50 min-w-[12rem] pt-2 transition-all duration-200 ease-out",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-1 opacity-0"
        )}
      >
        <ul className="rounded-lg border border-zinc-200 bg-white/95 py-2 shadow-soft-lg backdrop-blur-sm">
          {category.subcategories.map((sub) => (
            <li key={sub.href} role="none">
              <Link
                role="menuitem"
                href={sub.href}
                className="block px-4 py-2 text-sm text-zinc-700 transition-colors duration-200 hover:bg-zinc-50 hover:text-zinc-900"
              >
                {sub.name}
              </Link>
            </li>
          ))}
          <li role="none" className="mt-1 border-t border-zinc-100 pt-1">
            <Link
              role="menuitem"
              href={category.href}
              className="block px-4 py-2 text-sm font-medium text-zinc-900 transition-colors duration-200 hover:bg-zinc-50"
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
  const [allowCursorSheen, setAllowCursorSheen] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const menuOpenValue = useMotionValue(0);
  const viewportWidth = useMotionValue(1200);

  const { scrollY } = useScroll();
  const rawProgress = useTransform(
    scrollY,
    [SCROLL_START, SCROLL_START + SCROLL_RANGE],
    [0, 1],
    { clamp: true }
  );
  const springConfig = reduceMotion
    ? { stiffness: 1000, damping: 100, mass: 0.1 }
    : SPRING;
  const progress = useSpring(rawProgress, springConfig);
  const menuOpenProgress = useSpring(menuOpenValue, springConfig);

  useEffect(() => {
    const syncViewport = () => viewportWidth.set(window.innerWidth);
    syncViewport();
    window.addEventListener("resize", syncViewport);
    return () => window.removeEventListener("resize", syncViewport);
  }, [viewportWidth]);

  const wrapPaddingTop = useTransform(progress, [0, 1], [0, 12]);
  const wrapPaddingX = useTransform(progress, [0, 1], [0, COMPACT_SIDE_PAD_PX]);
  const headerScale = useTransform(progress, [0, 1], [1, 0.94]);
  // Full viewport at top → compact centered pill when scrolled (pixel lerp).
  const headerMaxWidth = useTransform(
    [progress, viewportWidth],
    ([p, vw]) => {
      const width = Number(vw);
      const compact = Math.min(
        COMPACT_MAX_WIDTH_PX,
        Math.max(320, width - COMPACT_SIDE_PAD_PX * 2)
      );
      return width + (compact - width) * Number(p);
    }
  );
  // Compact pill (9999) → rounded card (16) while the menu is open, like NRGxPortfolio.
  const borderRadius = useTransform(
    [progress, menuOpenProgress],
    ([value, menu]) => {
      const p = Number(value);
      const m = Math.min(1, Math.max(0, Number(menu)));
      const pill = p * 9999;
      if (p > 0.35) return pill + (16 - pill) * m;
      return pill;
    }
  );
  const rowHeight = useTransform(progress, [0, 1], [64, 52]);
  const rowPaddingX = useTransform(progress, [0, 1], [16, 24]);
  const shadowBlur = useTransform(progress, [0, 1], [0, 16]);
  const shadowAlpha = useTransform(progress, [0, 1], [0, 0.08]);
  const headerShadow = useMotionTemplate`0 4px ${shadowBlur}px rgba(24, 24, 27, ${shadowAlpha})`;

  useEffect(() => {
    menuOpenValue.set(menuOpen ? 1 : 0);
  }, [menuOpen, menuOpenValue]);

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

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMenuOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setAllowCursorSheen(fine.matches && !motionQuery.matches);
      setReduceMotion(motionQuery.matches);
    };
    sync();
    fine.addEventListener("change", sync);
    motionQuery.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      motionQuery.removeEventListener("change", sync);
    };
  }, []);

  const updateHeaderGlow = useCallback((clientX: number, clientY: number) => {
    const el = headerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = ((clientX - r.left) / r.width) * 100;
    const y = ((clientY - r.top) / r.height) * 100;
    el.style.setProperty("--nav-glow-x", `${x}%`);
    el.style.setProperty("--nav-glow-y", `${y}%`);
  }, []);

  const onHeaderPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!allowCursorSheen || e.pointerType === "touch") return;
    updateHeaderGlow(e.clientX, e.clientY);
  };

  const onHeaderPointerEnter = (e: React.PointerEvent<HTMLElement>) => {
    if (!allowCursorSheen || e.pointerType === "touch") return;
    updateHeaderGlow(e.clientX, e.clientY);
  };

  const menuTransition = reduceMotion
    ? { duration: 0.01 }
    : { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <motion.div
      className={cn(
        "z-50 w-full",
        menuOpen ? "fixed top-0 left-0 right-0" : "sticky top-0"
      )}
      style={{
        paddingTop: wrapPaddingTop,
        paddingLeft: wrapPaddingX,
        paddingRight: wrapPaddingX,
      }}
    >
      <motion.header
        ref={headerRef}
        onPointerMove={onHeaderPointerMove}
        onPointerEnter={onHeaderPointerEnter}
        className={cn(
          "group/header relative mx-auto w-full border border-transparent border-b-zinc-200/90 bg-white/90 backdrop-blur-xl supports-[backdrop-filter]:bg-white/80",
          menuOpen ? "overflow-visible" : "overflow-hidden"
        )}
        style={{
          width: "100%",
          maxWidth: headerMaxWidth,
          borderRadius,
          scale: headerScale,
          transformOrigin: "top center",
          boxShadow: headerShadow,
        }}
      >
        {allowCursorSheen ? (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 ease-out group-hover/header:opacity-100"
            style={{
              background:
                "radial-gradient(360px circle at var(--nav-glow-x, 50%) var(--nav-glow-y, 35%), rgba(255, 96, 0, 0.10), transparent 50%)",
            }}
          />
        ) : null}

        {/* Desktop */}
        <motion.div
          className="relative z-[1] mx-auto hidden max-w-6xl items-center justify-between md:flex"
          style={{
            height: rowHeight,
            paddingLeft: rowPaddingX,
            paddingRight: rowPaddingX,
          }}
        >
          <BrandLogo priority className="px-1.5 py-0.5" />

          <nav
            className="flex items-center gap-0.5 lg:gap-2"
            aria-label="Основна навигация"
          >
            <Link href="/" className={desktopNavLinkClass(pathname === "/")}>
              {bg.nav.home}
            </Link>
            <Link
              href="/about"
              className={desktopNavLinkClass(pathname === "/about")}
            >
              {bg.nav.about}
            </Link>
            {categories.map((category) => (
              <CategoryDropdown
                key={category.id}
                category={category}
                active={pathname === category.href}
              />
            ))}
            <Link
              href="/faq"
              className={desktopNavLinkClass(pathname === "/faq")}
            >
              {bg.nav.faq}
            </Link>
            <Link
              href="/contact"
              className={desktopNavLinkClass(pathname === "/contact")}
            >
              {bg.nav.contact}
            </Link>
          </nav>
        </motion.div>

        {/* Mobile top row */}
        <motion.div
          className="relative z-[1] flex items-center justify-between md:hidden"
          style={{
            height: rowHeight,
            paddingLeft: rowPaddingX,
            paddingRight: rowPaddingX,
          }}
        >
          <BrandLogo
            className="px-1.5 py-0.5"
            imageClassName="h-7 w-auto"
          />

          <button
            type="button"
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200",
              menuOpen
                ? "border-brand/35 bg-brand/10 text-brand"
                : "border-zinc-200 bg-white/80 text-zinc-700 hover:border-brand/25 hover:text-zinc-900"
            )}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? bg.nav.menuClose : bg.nav.menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <motion.svg
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </motion.svg>
            ) : (
              <motion.svg
                key="open"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </motion.svg>
            )}
          </button>
        </motion.div>

        <AnimatePresence initial={false}>
          {menuOpen ? (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={menuTransition}
              className="relative z-[1] overflow-hidden border-t border-zinc-200 md:hidden"
            >
              <nav
                className="max-h-[80vh] overflow-y-auto px-4 py-5"
                aria-label="Мобилна навигация"
              >
                <ul className="space-y-1">
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{
                      duration: 0.22,
                      delay: 0,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      href="/"
                      className={mobileNavLinkClass(pathname === "/")}
                    >
                      {bg.nav.home}
                      <MobileLinkChevron />
                    </Link>
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{
                      duration: 0.22,
                      delay: 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      href="/about"
                      className={mobileNavLinkClass(pathname === "/about")}
                    >
                      {bg.nav.about}
                      <MobileLinkChevron />
                    </Link>
                  </motion.li>
                  {categories.map((category, index) => {
                    const expanded = expandedCategory === category.id;
                    return (
                      <motion.li
                        key={category.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -6 }}
                        transition={{
                          duration: 0.22,
                          delay: (index + 2) * 0.05,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="py-1"
                      >
                        <div className="flex items-center justify-between">
                          <Link
                            href={category.href}
                            className={cn(
                              "block flex-1 rounded-2xl px-4 py-3 text-lg font-medium transition-all duration-200",
                              pathname === category.href
                                ? "text-brand"
                                : "text-zinc-900 hover:bg-zinc-50"
                            )}
                          >
                            {category.name}
                          </Link>
                          <button
                            type="button"
                            className="rounded-full p-2 text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-800"
                            aria-expanded={expanded}
                            aria-label={category.name}
                            onClick={() =>
                              setExpandedCategory(
                                expanded ? null : category.id
                              )
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
                              className={cn(
                                "transition-transform duration-200",
                                expanded && "rotate-180"
                              )}
                              aria-hidden="true"
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </button>
                        </div>
                        <AnimatePresence initial={false}>
                          {expanded ? (
                            <motion.ul
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{
                                duration: 0.22,
                                ease: [0.22, 1, 0.36, 1],
                              }}
                              className="mb-2 space-y-1 overflow-hidden pl-3"
                            >
                              {category.subcategories.map((sub) => (
                                <li key={sub.href}>
                                  <Link
                                    href={sub.href}
                                    className="block rounded-lg px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-50 hover:text-zinc-900"
                                  >
                                    {sub.name}
                                  </Link>
                                </li>
                              ))}
                            </motion.ul>
                          ) : null}
                        </AnimatePresence>
                      </motion.li>
                    );
                  })}
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{
                      duration: 0.22,
                      delay: (categories.length + 2) * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      href="/faq"
                      className={mobileNavLinkClass(pathname === "/faq")}
                    >
                      {bg.nav.faq}
                      <MobileLinkChevron />
                    </Link>
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{
                      duration: 0.22,
                      delay: (categories.length + 3) * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Link
                      href="/contact"
                      className={mobileNavLinkClass(pathname === "/contact")}
                    >
                      {bg.nav.contact}
                      <MobileLinkChevron />
                    </Link>
                  </motion.li>
                </ul>
              </nav>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.header>
    </motion.div>
  );
}
