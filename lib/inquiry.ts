import { getAllPublishedProducts, getProductBySlug } from "@/data/products";

export const INQUIRY_STORAGE_KEY = "cs-inquiry";
export const INQUIRY_EVENT = "cs-inquiry-change";

export type InquiryItem = {
  slug: string;
  name: string;
  colorId?: string;
  colorName?: string;
};

export type InquiryAddResult = "added" | "already" | "updated";

function canUseStorage() {
  return typeof window !== "undefined";
}

function isInquiryItem(value: unknown): value is InquiryItem {
  if (!value || typeof value !== "object") return false;
  const item = value as InquiryItem;
  return typeof item.slug === "string" && typeof item.name === "string";
}

export function readInquiry(): InquiryItem[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(INQUIRY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return normalizeInquiry(parsed.filter(isInquiryItem));
  } catch {
    return [];
  }
}

function writeInquiry(items: InquiryItem[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(INQUIRY_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(INQUIRY_EVENT));
}

export function formatInquiryItem(item: InquiryItem): string {
  return item.colorName ? `${item.name} — ${item.colorName}` : item.name;
}

export function formatInquiryForSubmit(items: InquiryItem[]): string {
  return items.map(formatInquiryItem).join("; ");
}

export function inquiryHas(item: Pick<InquiryItem, "slug" | "name">): boolean {
  return readInquiry().some((existing) => isSameProduct(existing, item));
}

function isSameProduct(
  a: Pick<InquiryItem, "slug" | "name">,
  b: Pick<InquiryItem, "slug" | "name">
): boolean {
  return a.slug === b.slug || a.name === b.name;
}

export function addToInquiry(item: InquiryItem): InquiryAddResult {
  const items = readInquiry();
  const index = items.findIndex((existing) => isSameProduct(existing, item));

  if (index === -1) {
    writeInquiry([...items, item]);
    return "added";
  }

  const existing = items[index];
  const sameColor =
    (existing.colorId ?? "") === (item.colorId ?? "") &&
    (existing.colorName ?? "") === (item.colorName ?? "");

  if (sameColor && existing.slug === item.slug) {
    return "already";
  }

  const next = [...items];
  next[index] = { ...existing, ...item };
  writeInquiry(next);
  return sameColor ? "already" : "updated";
}

export function removeFromInquiry(slug: string) {
  writeInquiry(readInquiry().filter((item) => item.slug !== slug));
}

export function clearInquiry() {
  writeInquiry([]);
}

function findPublishedProductByLabel(label: string) {
  const products = getAllPublishedProducts();
  return (
    products.find((product) => product.name === label) ??
    products.find((product) => label.startsWith(`${product.name} — `))
  );
}

function resolveInquiryItem(item: InquiryItem): InquiryItem {
  if (item.slug && !item.slug.startsWith("query:")) {
    const bySlug = getProductBySlug(item.slug);
    if (bySlug) {
      return { ...item, slug: bySlug.slug, name: bySlug.name };
    }
  }

  const byName = findPublishedProductByLabel(item.name);
  if (!byName) return item;

  const colorPrefix = `${byName.name} — `;
  const colorName =
    item.colorName ??
    (item.name.startsWith(colorPrefix)
      ? item.name.slice(colorPrefix.length)
      : undefined);

  return {
    slug: byName.slug,
    name: byName.name,
    colorId: item.colorId,
    colorName,
  };
}

function normalizeInquiry(items: InquiryItem[]): InquiryItem[] {
  const result: InquiryItem[] = [];

  for (const raw of items) {
    const item = resolveInquiryItem(raw);
    const index = result.findIndex((existing) => isSameProduct(existing, item));

    if (index === -1) {
      result.push(item);
      continue;
    }

    const existing = result[index];
    const preferResolved =
      item.slug.startsWith("query:") && !existing.slug.startsWith("query:")
        ? existing
        : !item.slug.startsWith("query:")
          ? item
          : { ...existing, ...item };
    result[index] = preferResolved;
  }

  return result;
}

export function inquiryItemHref(item: InquiryItem): string | null {
  const resolved = resolveInquiryItem(item);
  if (!resolved.slug || resolved.slug.startsWith("query:")) return null;

  const published = getProductBySlug(resolved.slug);
  return published ? `/product/${published.slug}` : null;
}

export function mergeInquiryLabel(label: string) {
  const name = label.trim();
  if (!name) return;

  const match = findPublishedProductByLabel(name);
  if (match) {
    const colorPrefix = `${match.name} — `;
    addToInquiry({
      slug: match.slug,
      name: match.name,
      colorName: name.startsWith(colorPrefix)
        ? name.slice(colorPrefix.length)
        : undefined,
    });
    return;
  }

  const items = readInquiry();
  if (
    items.some(
      (item) =>
        item.name === name ||
        formatInquiryItem(item) === name ||
        name.startsWith(`${item.name} — `)
    )
  ) {
    return;
  }

  addToInquiry({ slug: `query:${name}`, name });
}
