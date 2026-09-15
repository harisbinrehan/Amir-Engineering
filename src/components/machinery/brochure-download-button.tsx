import { DownloadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BrochureDownloadButton({ brochureUrl }: { brochureUrl: string | null }) {
  if (!brochureUrl) {
    return (
      <Button variant="outline" size="lg" disabled title="Brochure coming soon">
        <DownloadIcon />
        Brochure Coming Soon
      </Button>
    );
  }

  return (
    <Button variant="outline" size="lg" asChild>
      <a href={brochureUrl} target="_blank" rel="noopener noreferrer">
        <DownloadIcon />
        Download Brochure
      </a>
    </Button>
  );
}
