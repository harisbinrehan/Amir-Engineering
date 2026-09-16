"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MenuIcon, ShoppingCartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useCart } from "@/lib/cart/cart-context";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { primaryNav, utilityNav } from "@/lib/content/nav-links";
import { MobileNavDrawer } from "@/components/layout/mobile-nav-drawer";
import { AdaptiveBrandLogo } from "@/components/icons/adaptive-brand-logo";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const isSectionActive = (item: (typeof primaryNav)[number]) =>
    isActive(item.href) || (item.children?.some((child) => isActive(child.href)) ?? false);

  return (
    <header className="bg-background/95 border-border sticky top-0 z-50 border-b backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center">
          <AdaptiveBrandLogo className="h-6 sm:h-8" />
        </Link>

        <NavigationMenu viewport={false} className="hidden xl:flex">
          <NavigationMenuList>
            {primaryNav.map((item) =>
              item.children ? (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuTrigger className={cn("whitespace-nowrap", isSectionActive(item) && "text-industrial")}>
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-72 gap-1 p-2">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <NavigationMenuLink asChild>
                            <Link href={child.href}>{child.label}</Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ) : (
                <NavigationMenuItem key={item.href}>
                  <NavigationMenuLink asChild className={cn("whitespace-nowrap", isActive(item.href) && "text-industrial")}>
                    <Link href={item.href}>{item.label}</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ),
            )}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild className="hidden md:inline-flex">
            <Link href={utilityNav[0].href}>{utilityNav[0].label}</Link>
          </Button>
          <Button asChild className="bg-industrial text-industrial-foreground hover:bg-industrial/90 hidden sm:inline-flex">
            <Link href={utilityNav[1].href}>{utilityNav[1].label}</Link>
          </Button>
          <ThemeToggle />
          <Button variant="outline" size="icon" asChild className="relative">
            <Link href="/cart" aria-label="View cart">
              <ShoppingCartIcon />
              {itemCount > 0 && (
                <span className="bg-food text-food-foreground absolute -top-1.5 -right-1.5 flex size-4.5 items-center justify-center rounded-full text-[10px] font-semibold">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="xl:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon />
          </Button>
        </div>
      </div>

      <MobileNavDrawer open={mobileOpen} onOpenChange={setMobileOpen} />
    </header>
  );
}
