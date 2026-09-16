"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { primaryNav, utilityNav } from "@/lib/content/nav-links";
import { AdaptiveBrandLogo } from "@/components/icons/adaptive-brand-logo";
import { cn } from "@/lib/utils";

export function MobileNavDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-sm gap-0 p-0">
        <SheetHeader className="border-b">
          <SheetTitle className="flex items-center">
            <AdaptiveBrandLogo className="h-10" />
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 overflow-y-auto p-4">
          {primaryNav.map((item) => (
            <div key={item.href} className="border-border border-b py-1 last:border-none">
              {item.children ? (
                <button
                  type="button"
                  className="flex w-full items-center justify-between py-2.5 text-left text-sm font-medium"
                  onClick={() => setExpanded(expanded === item.href ? null : item.href)}
                  aria-expanded={expanded === item.href}
                >
                  {item.label}
                  <ChevronDownIcon
                    className={cn("size-4 transition-transform", expanded === item.href && "rotate-180")}
                  />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className="block py-2.5 text-sm font-medium"
                  onClick={() => onOpenChange(false)}
                >
                  {item.label}
                </Link>
              )}
              {item.children && expanded === item.href && (
                <div className="flex flex-col gap-1 pb-2 pl-3">
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="text-muted-foreground py-1.5 text-sm"
                      onClick={() => onOpenChange(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2 border-t p-4">
          <Button variant="outline" asChild onClick={() => onOpenChange(false)}>
            <Link href={utilityNav[0].href}>{utilityNav[0].label}</Link>
          </Button>
          <Button
            asChild
            className="bg-industrial text-industrial-foreground hover:bg-industrial/90"
            onClick={() => onOpenChange(false)}
          >
            <Link href={utilityNav[1].href}>{utilityNav[1].label}</Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
