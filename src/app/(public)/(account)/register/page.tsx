import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { RegisterForm } from "@/components/account/register-form";

export const metadata: Metadata = { title: "Create Account" };

export default function RegisterPage() {
  return (
    <Section containerClassName="max-w-sm">
      <h1 className="font-heading text-center text-2xl font-bold tracking-tight">Create Account</h1>
      <p className="text-muted-foreground mt-2 text-center text-sm">
        Register to track orders and manage your details.
      </p>
      <div className="mt-8">
        <RegisterForm />
      </div>
    </Section>
  );
}
