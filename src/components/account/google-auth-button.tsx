"use client";

import { useTransition } from "react";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons/social-icons";
import { signInWithGoogle } from "@/lib/actions/auth";

/**
 * A plain button that calls the server action directly (rather than binding
 * it to a nested <form>) — this component is used inside LoginForm's and
 * RegisterForm's own <form>, and HTML doesn't allow a <form> inside a
 * <form>.
 */
export function GoogleAuthButton({ redirectPath = "/account" }: { redirectPath?: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      disabled={isPending}
      onClick={() => startTransition(() => signInWithGoogle(redirectPath))}
    >
      {isPending ? <Loader2Icon className="animate-spin" /> : <GoogleIcon className="size-4" />}
      Continue with Google
    </Button>
  );
}
