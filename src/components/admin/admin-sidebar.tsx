"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNav } from "@/lib/content/admin-nav";
import type { StaffRole } from "@/lib/auth/get-profile";
import { BrandLogoDarkText } from "@/components/icons/logo";
import { cn } from "@/lib/utils";

export function AdminSidebar({ role }: { role: StaffRole }) {
  const pathname = usePathname();
  const items = adminNav.filter((item) => item.roles.includes(role));

  return (
    <aside className="bg-sidebar text-sidebar-foreground hidden w-64 shrink-0 flex-col border-r border-sidebar-border lg:flex">
      <div className="flex h-16 items-center gap-2 px-6">
        <BrandLogoDarkText className="h-8" />
      </div>
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {items.map((item) => {
          const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
