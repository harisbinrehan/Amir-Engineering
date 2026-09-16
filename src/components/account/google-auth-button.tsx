"use client";

import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons/social-icons";
import { signInWithGoogle } from "@/lib/actions/auth";

export function GoogleAuthButton({ redirectPath = "/account" }: { redirectPath?: string }) {
  return (
    <form action={signInWithGoogle.bind(null, redirectPath)}>
      <Button type="submit" variant="outline" className="w-full">
        <GoogleIcon className="size-4" />
        Continue with Google
      </Button>
    </form>
  );
}
