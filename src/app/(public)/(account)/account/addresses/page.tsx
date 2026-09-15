import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PublicStubPage } from "@/components/common/public-stub-page";
import { getCurrentProfile } from "@/lib/auth/get-profile";

export const metadata: Metadata = { title: "Addresses" };

export default async function AccountAddressesPage() {
  const session = await getCurrentProfile();
  if (!session) redirect("/login?redirectTo=/account/addresses");

  return (
    <PublicStubPage
      title="Addresses"
      description="Manage your saved shipping addresses here once the shop launches."
      breadcrumbs={[{ label: "My Account", href: "/account" }, { label: "Addresses" }]}
    />
  );
}
