"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { createClient } from "@/lib/supabase/client";

/**
 * Landing page for both the "set up your account" invite link (sent after a
 * guest checkout) and a normal "forgot password" recovery link. Supabase's
 * browser client picks up the session from the link automatically on load —
 * this just waits for that, then lets the visitor set a password.
 */
export function SetPasswordForm() {
  const router = useRouter();
  const supabase = createClient();
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setHasSession(!!session);
      setCheckingSession(false);
    });

    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
      setCheckingSession(false);
    });

    return () => subscription.subscription.unsubscribe();
  }, [supabase]);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setIsSubmitting(false);
      return;
    }

    router.push("/account");
    router.refresh();
  };

  if (checkingSession) {
    return <p className="text-muted-foreground text-center text-sm">Verifying your link...</p>;
  }

  if (!hasSession) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground text-sm">
          This link is invalid or has expired. Request a new one from the sign-in page.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <a href="/login">Back to Sign In</a>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="password">New Password</FieldLabel>
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
            <FieldDescription>At least 8 characters.</FieldDescription>
          </FieldContent>
        </Field>

        {error && <FieldError>{error}</FieldError>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting && <Loader2Icon className="animate-spin" />}
          Set Password
        </Button>
      </FieldGroup>
    </form>
  );
}
