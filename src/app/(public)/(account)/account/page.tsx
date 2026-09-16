import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PackageIcon, MapPinIcon, HeartIcon, LogOutIcon } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getCurrentProfile } from "@/lib/auth/get-profile";
import { signOut } from "@/lib/actions/auth";

export const metadata: Metadata = { title: "My Account" };

const links = [
  { href: "/account/orders", label: "Order History", icon: PackageIcon },
  { href: "/account/addresses", label: "Addresses", icon: MapPinIcon },
  { href: "/account/wishlist", label: "Wishlist", icon: HeartIcon },
];

export default async function AccountPage() {
  const session = await getCurrentProfile();
  if (!session) redirect("/login?redirectTo=/account");

  return (
    <Section containerClassName="max-w-2xl">
      <h1 className="font-heading text-2xl font-bold tracking-tight">
        Welcome, {session.profile.full_name ?? "there"}
      </h1>
      <p className="text-muted-foreground mt-1 text-sm">{session.user.email}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {links.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="hover:border-industrial/60 transition-colors">
              <CardContent className="flex flex-col items-center gap-2 py-6 text-center">
                <link.icon className="text-industrial size-6" />
                <span className="text-sm font-medium">{link.label}</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <form action={signOut} className="mt-8 border-t border-border pt-8">
        <Button type="submit" variant="destructive" className="w-full sm:w-auto gap-2">
          <LogOutIcon className="size-4" />
          Sign out
        </Button>
      </form>
    </Section>
  );
}
