import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboardIcon,
  MessageSquareIcon,
  FileTextIcon,
  ShoppingCartIcon,
  PackageIcon,
  CogIcon,
  FactoryIcon,
  WarehouseIcon,
  ReceiptIcon,
  DollarSignIcon,
  PenToolIcon,
  ImageIcon,
  UsersIcon,
} from "lucide-react";
import type { StaffRole } from "@/lib/auth/get-profile";

export type AdminNavItem = {
  label: string;
  href: string;
  roles: StaffRole[];
  icon: LucideIcon;
};

export const adminNav: AdminNavItem[] = [
  { label: "Overview", href: "/admin", roles: ["super_admin", "admin", "finance", "sales", "content_manager"], icon: LayoutDashboardIcon },
  { label: "Contact Inquiries", href: "/admin/contact", roles: ["super_admin", "admin", "sales"], icon: MessageSquareIcon },
  { label: "Quotes", href: "/admin/quotes", roles: ["super_admin", "admin", "sales"], icon: FileTextIcon },
  { label: "Orders", href: "/admin/orders", roles: ["super_admin", "admin", "sales"], icon: ShoppingCartIcon },
  { label: "Products", href: "/admin/products", roles: ["super_admin", "admin"], icon: PackageIcon },
  { label: "Machinery", href: "/admin/machinery", roles: ["super_admin", "admin"], icon: CogIcon },
  { label: "Production Lines", href: "/admin/production-lines", roles: ["super_admin", "admin"], icon: FactoryIcon },
  { label: "Inventory", href: "/admin/inventory", roles: ["super_admin", "admin"], icon: WarehouseIcon },
  { label: "Expenses", href: "/admin/expenses", roles: ["super_admin", "admin", "finance"], icon: ReceiptIcon },
  { label: "Finance", href: "/admin/finance", roles: ["super_admin", "admin", "finance"], icon: DollarSignIcon },
  { label: "CMS", href: "/admin/cms", roles: ["super_admin", "admin", "content_manager"], icon: PenToolIcon },
  { label: "Media Library", href: "/admin/media", roles: ["super_admin", "admin", "content_manager"], icon: ImageIcon },
  { label: "Users & Staff", href: "/admin/users", roles: ["super_admin"], icon: UsersIcon },
];
