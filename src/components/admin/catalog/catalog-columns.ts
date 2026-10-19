export const CATALOG_COLUMNS = [
  { key: "category", label: "Category" },
  { key: "price", label: "Price" },
  { key: "stock", label: "Stock" },
  { key: "status", label: "Status" },
  { key: "updated", label: "Updated" },
] as const;

export type CatalogColumnKey = (typeof CATALOG_COLUMNS)[number]["key"];

const STORAGE_KEY = "admin-catalog-columns";

export function loadColumnPrefs(): Record<CatalogColumnKey, boolean> {
  const all = Object.fromEntries(CATALOG_COLUMNS.map((c) => [c.key, true])) as Record<CatalogColumnKey, boolean>;
  if (typeof window === "undefined") return all;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return all;
    const parsed = JSON.parse(raw);
    return { ...all, ...parsed };
  } catch {
    return all;
  }
}

export function saveColumnPrefs(prefs: Record<CatalogColumnKey, boolean>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // ignore — a per-viewer convenience only
  }
}
