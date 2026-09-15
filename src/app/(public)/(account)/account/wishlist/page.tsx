import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PublicStubPage } from "@/components/common/public-stub-page";
import { getCurrentProfile } from "@/lib/auth/get-profile";

export const metadata: Metadata = { title: "Wishlist" };

export default async function AccountWishlistPage() {
  const session = await getCurrentProfile();
  if (!session) redirect("/login?redirectTo=/account/wishlist");

  return (
    <PublicStubPage
      title="Wishlist"
      description="Save your favorite products here once the shop launches."
      breadcrumbs={[{ label: "My Account", href: "/account" }, { label: "Wishlist" }]}
    />
  );
}
