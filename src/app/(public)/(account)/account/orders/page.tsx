import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PublicStubPage } from "@/components/common/public-stub-page";
import { getCurrentProfile } from "@/lib/auth/get-profile";

export const metadata: Metadata = { title: "Order History" };

export default async function AccountOrdersPage() {
  const session = await getCurrentProfile();
  if (!session) redirect("/login?redirectTo=/account/orders");

  return (
    <PublicStubPage
      title="Order History"
      description="Your food product orders will appear here once the shop launches."
      breadcrumbs={[{ label: "My Account", href: "/account" }, { label: "Orders" }]}
    />
  );
}
