"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2Icon, CheckCircle2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { signInWithPassword, requestPasswordReset } from "@/lib/actions/auth";
import { GoogleAuthButton } from "@/components/account/google-auth-button";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showReset, setShowReset] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);

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

    router.push(searchParams.get("redirectTo") ?? "/account");
    router.refresh();
  };

  const onRequestReset = async () => {
    if (!email) {
      setError("Enter your email above first, then click Forgot password.");
      return;
    }
    setIsSendingReset(true);
    await requestPasswordReset(email);
    setIsSendingReset(false);
    setResetSent(true);
  };

  return (
    <form onSubmit={onSubmit}>
      <FieldGroup>
        <GoogleAuthButton />

        <div className="text-muted-foreground relative flex items-center gap-3 text-xs uppercase before:h-px before:flex-1 before:bg-current/20 after:h-px after:flex-1 after:bg-current/20">
          or
        </div>

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
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <button
              type="button"
              onClick={() => {
                setShowReset(true);
                onRequestReset();
              }}
              className="text-muted-foreground hover:text-foreground text-xs underline"
            >
              Forgot password?
            </button>
          </div>
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

        {showReset && (
          <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
            {isSendingReset ? (
              <Loader2Icon className="size-3.5 animate-spin" />
            ) : (
              resetSent && <CheckCircle2Icon className="text-industrial size-3.5" />
            )}
            {isSendingReset ? "Sending reset link..." : resetSent && "If that email has an account, a reset link is on its way."}
          </p>
        )}

        {error && <FieldError>{error}</FieldError>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2Icon className="animate-spin" />}
          Sign In
        </Button>

        <FieldDescription className="text-center">
          Don&apos;t have an account? <Link href="/register" className="underline">Create one</Link>
        </FieldDescription>
      </FieldGroup>
    </form>
  );
}
