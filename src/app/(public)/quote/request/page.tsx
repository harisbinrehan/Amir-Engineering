import type { Metadata } from "next";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { QuoteRequestForm } from "@/components/quote/quote-request-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Request a Quote",
  description: "Request a quote for machinery or a complete production line from Amir Engineering.",
};

export default async function QuoteRequestPage(props: PageProps<"/quote/request">) {
  const params = await props.searchParams;
  const machineryId = typeof params.machineryId === "string" ? params.machineryId : undefined;
  const productionLineId =
    typeof params.productionLineId === "string" ? params.productionLineId : undefined;

  let subjectLabel: string | undefined;

  if (machineryId || productionLineId) {
    const supabase = await createClient();
    if (machineryId) {
      const { data } = await supabase.from("machinery").select("name").eq("id", machineryId).maybeSingle();
      subjectLabel = data?.name;
    } else if (productionLineId) {
      const { data } = await supabase
        .from("production_lines")
        .select("name")
        .eq("id", productionLineId)
        .maybeSingle();
      subjectLabel = data?.name;
    }
  }

  return (
    <Section containerClassName="max-w-2xl">
      <Breadcrumbs items={[{ label: "Request a Quote" }]} />
      <h1 className="font-heading mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Request a Quote</h1>
      <p className="text-muted-foreground mt-3 text-lg">
        Tell us about your production requirements and our team will get back to you with a tailored quote.
      </p>

      <div className="mt-10">
        <QuoteRequestForm
          machineryId={machineryId}
          productionLineId={productionLineId}
          subjectLabel={subjectLabel}
        />
      </div>
    </Section>
  );
}
