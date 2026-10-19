"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from "lucide-react";
import { adminNav } from "@/lib/content/admin-nav";
import type { StaffRole } from "@/lib/auth/get-profile";
import { AdaptiveBrandLogo } from "@/components/icons/adaptive-brand-logo";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/admin/sidebar-context";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export function AdminSidebar({ role }: { role: StaffRole }) {
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();
  const items = adminNav.filter((item) => item.roles.includes(role));

  return (
    <aside
      className={cn(
        "bg-sidebar text-sidebar-foreground hidden shrink-0 flex-col border-r border-sidebar-border transition-[width] duration-300 ease-in-out lg:flex",
        collapsed ? "w-[68px]" : "w-64",
      )}
    >
      {/* Logo + collapse toggle */}
      <div className={cn("flex h-16 items-center", collapsed ? "justify-center px-2" : "justify-between px-6")}>
        {!collapsed && <AdaptiveBrandLogo className="h-8" />}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="size-8 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {collapsed ? <PanelLeftOpenIcon className="size-4" /> : <PanelLeftCloseIcon className="size-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className={cn("flex-1 space-y-0.5 py-4", collapsed ? "px-2" : "px-3")}>
        {items.map((item) => {
          const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
          const Icon = item.icon;

          const linkContent = (
            <Link
              key={item.href}
              href={item.href}
              prefetch={true}
              className={cn(
                "flex items-center gap-3 rounded-md text-sm font-medium transition-colors",
                collapsed ? "justify-center px-2 py-2" : "px-3 py-2",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          }

          return linkContent;
        })}
      </nav>
    </aside>
  );
}
