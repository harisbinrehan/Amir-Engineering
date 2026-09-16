"use client";

import { useState } from "react";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons/social-icons";
import { createClient } from "@/lib/supabase/client";

/**
 * Initiates Google OAuth from the browser client, not a server action. The
 * PKCE code verifier this generates is stored in a cookie by the browser
 * client itself, so it's guaranteed to still be there when Google redirects
 * back to our /auth/callback — starting the flow from a server action
 * instead made that verifier's survival across the server → Google → server
 * round trip unreliable, which was silently failing the session exchange.
 */
export function GoogleAuthButton({ redirectPath = "/account" }: { redirectPath?: string }) {
  const [isPending, setIsPending] = useState(false);

  const handleClick = async () => {
    setIsPending(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectPath)}`,
      },
    });
    if (error) setIsPending(false);
  };

  return (
    <Button type="button" variant="outline" className="w-full" disabled={isPending} onClick={handleClick}>
      {isPending ? <Loader2Icon className="animate-spin" /> : <GoogleIcon className="size-4" />}
      Continue with Google
    </Button>
  );
}
