"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { signInWithPassword } from "@/lib/actions/auth";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await signInWithPassword(email, password);

    if (!result.success) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    const redirectTo = searchParams.get("redirectTo") ?? "/admin";
    router.push(redirectTo);
    router.refresh();
  };

  return (
    <form onSubmit={onSubmit}>
      <FieldGroup>
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
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FieldContent>
        </Field>

        {error && <FieldError>{error}</FieldError>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2Icon className="animate-spin" />}
          Sign In
        </Button>
      </FieldGroup>
    </form>
  );
}
