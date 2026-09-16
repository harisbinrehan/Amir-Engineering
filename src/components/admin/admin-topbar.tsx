"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOutIcon, MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { adminNav } from "@/lib/content/admin-nav";
import type { StaffRole } from "@/lib/auth/get-profile";
import { signOutAdmin } from "@/lib/actions/auth";
import { cn } from "@/lib/utils";

export function AdminTopbar({ fullName, role }: { fullName: string; role: StaffRole }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const items = adminNav.filter((item) => item.roles.includes(role));
  const initials = fullName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="bg-background flex h-16 shrink-0 items-center justify-between border-b px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="lg:hidden" onClick={() => setMobileOpen(true)}>
          <MenuIcon />
        </Button>
        <span className="text-muted-foreground text-sm capitalize">{role.replace("_", " ")}</span>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium">{fullName}</p>
        </div>
        <Avatar className="size-8">
          <AvatarFallback>{initials || "U"}</AvatarFallback>
        </Avatar>
        <form action={signOutAdmin}>
          <Button variant="ghost" size="icon" type="submit" aria-label="Sign out">
            <LogOutIcon className="size-4" />
          </Button>
        </form>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="border-b">
            <SheetTitle className="font-heading">Admin Portal</SheetTitle>
          </SheetHeader>
          <nav className="space-y-0.5 p-3">
            {items.map((item) => {
              const isActive = item.href === "/admin" ? pathname === "/admin" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm font-medium",
                    isActive ? "bg-secondary" : "text-muted-foreground",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </header>
  );
}
