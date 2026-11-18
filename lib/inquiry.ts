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
    return parsed.filter(isInquiryItem);
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

export function inquiryHas(slug: string): boolean {
  return readInquiry().some((item) => item.slug === slug);
}

function isSameProduct(a: InquiryItem, b: InquiryItem): boolean {
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

export function mergeInquiryLabel(label: string) {
  const name = label.trim();
  if (!name) return;

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
