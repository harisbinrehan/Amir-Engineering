import type { Metadata } from "next";
import { Suspense } from "react";
import { Section } from "@/components/layout/section";
import { LoginForm } from "@/components/account/login-form";

export const metadata: Metadata = { title: "Sign In" };

export default function LoginPage() {
  return (
    <Section containerClassName="max-w-sm">
      <h1 className="font-heading text-center text-2xl font-bold tracking-tight">Sign In</h1>
      <p className="text-muted-foreground mt-2 text-center text-sm">Access your account and order history.</p>
      <div className="mt-8">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </Section>
  );
}
