"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2Icon, CheckCircle2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { signUpWithPassword } from "@/lib/actions/auth";
import { GoogleAuthButton } from "@/components/account/google-auth-button";

export function RegisterForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signUpWithPassword(fullName, email, password);

    if (!result.success) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    setSuccess(true);
    setIsSubmitting(false);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <CheckCircle2Icon className="text-industrial size-10" />
        <p className="font-medium">Check your email to confirm your account.</p>
        <Link href="/login" className="text-sm underline">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <FieldGroup>
        <GoogleAuthButton redirectPath="/account" />

        <div className="text-muted-foreground relative flex items-center gap-3 text-xs uppercase before:h-px before:flex-1 before:bg-current/20 after:h-px after:flex-1 after:bg-current/20">
          or
        </div>

        <Field>
          <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
          <FieldContent>
            <Input
              id="fullName"
              autoComplete="name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <FieldContent>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <FieldContent>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FieldContent>
        </Field>

        {error && <FieldError>{error}</FieldError>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2Icon className="animate-spin" />}
          Create Account
        </Button>

        <FieldDescription className="text-center">
          Already have an account? <Link href="/login" className="underline">Sign in</Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
