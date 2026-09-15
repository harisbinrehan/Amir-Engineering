import Link from "next/link";
import { FileTextIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RequestQuoteButton({
  machineryId,
  productionLineId,
}: {
  machineryId?: string;
  productionLineId?: string;
}) {
  const params = new URLSearchParams();
  if (machineryId) params.set("machineryId", machineryId);
  if (productionLineId) params.set("productionLineId", productionLineId);

  return (
    <Button
      size="lg"
      asChild
      className="bg-industrial text-industrial-foreground hover:bg-industrial/90"
    >
      <Link href={`/quote/request?${params.toString()}`}>
        <FileTextIcon />
        Request a Quote
      </Link>
    </Button>
  );
}
