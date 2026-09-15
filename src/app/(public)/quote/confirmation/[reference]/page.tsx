import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2Icon } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/button";
import { getQuoteByReference } from "@/lib/data/quotes";

export const metadata: Metadata = { title: "Quote Request Received" };

export default async function QuoteConfirmationPage(props: PageProps<"/quote/confirmation/[reference]">) {
  const { reference } = await props.params;
  const quote = await getQuoteByReference(reference);
  if (!quote) notFound();

  return (
    <Section containerClassName="max-w-xl text-center">
      <CheckCircle2Icon className="text-industrial mx-auto size-14" strokeWidth={1.5} />
      <h1 className="font-heading mt-6 text-3xl font-bold tracking-tight">Quote Request Received</h1>
      <p className="text-muted-foreground mt-4 text-lg">
        Thank you, {quote.full_name}. Our team will review your request and get back to you shortly.
      </p>

      <div className="bg-secondary/60 mt-8 rounded-lg px-6 py-4">
        <p className="text-muted-foreground text-sm">Your reference number</p>
        <p className="font-heading mt-1 text-2xl font-bold tracking-wide">{quote.reference_number}</p>
      </div>

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/machinery">Continue Browsing Machinery</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </Section>
  );
}
