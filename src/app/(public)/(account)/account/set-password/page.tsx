import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { SetPasswordForm } from "@/components/account/set-password-form";

export const metadata: Metadata = { title: "Set Your Password" };

export default function SetPasswordPage() {
  return (
    <Section containerClassName="max-w-sm">
      <h1 className="font-heading text-center text-2xl font-bold tracking-tight">Set Your Password</h1>
      <p className="text-muted-foreground mt-2 text-center text-sm">
        Choose a password to finish setting up your account.
      </p>
      <div className="mt-8">
        <SetPasswordForm />
      </div>
    </Section>
  );
}
