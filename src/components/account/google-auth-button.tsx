"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/icons/social-icons";
import { createClient } from "@/lib/supabase/client";

export function GoogleAuthButton({ redirectPath = "/account" }: { redirectPath?: string }) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data === "oauth_success") {
        router.push(redirectPath);
      } else if (event.data === "oauth_error") {
        setIsPending(false);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [router, redirectPath]);

  const handleClick = async () => {
    setIsPending(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        skipBrowserRedirect: true,
        redirectTo: `${window.location.origin}/auth/callback?popup=true&next=${encodeURIComponent(redirectPath)}`,
      },
    });

    if (data?.url) {
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(
        data.url,
        "google_oauth",
        `width=${width},height=${height},left=${left},top=${top}`
      );

      // Fallback: if popup is blocked or closed manually
      if (!popup) {
        setIsPending(false);
        // Could show a toast here that popup was blocked
      } else {
        const checkPopup = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkPopup);
            // We don't automatically redirect on close, because they might have just closed it.
            // We just stop the loading spinner.
            setIsPending(false);
          }
        }, 1000);
      }
    } else {
      setIsPending(false);
    }
  };

  return (
    <Button type="button" variant="outline" className="w-full" disabled={isPending} onClick={handleClick}>
      {isPending ? <Loader2Icon className="animate-spin" /> : <GoogleIcon className="size-4" />}
      Continue with Google
    </Button>
  );
}
