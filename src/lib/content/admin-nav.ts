import type { StaffRole } from "@/lib/auth/get-profile";

export type AdminNavItem = {
  label: string;
  href: string;
  roles: StaffRole[];
};

export const adminNav: AdminNavItem[] = [
  { label: "Overview", href: "/admin", roles: ["super_admin", "admin", "finance", "sales", "content_manager"] },
  { label: "Quotes", href: "/admin/quotes", roles: ["super_admin", "admin", "sales"] },
  { label: "Orders", href: "/admin/orders", roles: ["super_admin", "admin", "sales"] },
  { label: "Products", href: "/admin/products", roles: ["super_admin", "admin"] },
  { label: "Machinery", href: "/admin/machinery", roles: ["super_admin", "admin"] },
  { label: "Production Lines", href: "/admin/production-lines", roles: ["super_admin", "admin"] },
  { label: "Inventory", href: "/admin/inventory", roles: ["super_admin", "admin"] },
  { label: "Expenses", href: "/admin/expenses", roles: ["super_admin", "admin", "finance"] },
  { label: "Finance", href: "/admin/finance", roles: ["super_admin", "admin", "finance"] },
  { label: "CMS", href: "/admin/cms", roles: ["super_admin", "admin", "content_manager"] },
  { label: "Media Library", href: "/admin/media", roles: ["super_admin", "admin", "content_manager"] },
  { label: "Users & Staff", href: "/admin/users", roles: ["super_admin"] },
];
