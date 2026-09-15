import type { Metadata } from "next";
import { MailIcon, MapPinIcon, PhoneIcon, ClockIcon } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/icons/social-icons";
import { EmptyState } from "@/components/common/empty-state";
import { siteConfig } from "@/lib/content/site-config";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Amir Engineering for machinery inquiries, food product orders and support.",
};

const contactCards = [
  {
    icon: PhoneIcon,
    label: "Phone",
    value: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phone}`,
  },
  {
    icon: MailIcon,
    label: "Email",
    value: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
  },
  {
    icon: MapPinIcon,
    label: "Address",
    value: `${siteConfig.contact.address.line1}, ${siteConfig.contact.address.city}, ${siteConfig.contact.address.country}`,
  },
  {
    icon: ClockIcon,
    label: "Business Hours",
    value: siteConfig.contact.hours,
  },
];

export default function ContactPage() {
  return (
    <>
      <Section containerClassName="max-w-3xl" className="pb-8">
        <Breadcrumbs items={[{ label: "Contact" }]} />
        <h1 className="font-heading mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Contact Us</h1>
        <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
          Reach out for machinery inquiries, production line consultations, or food product orders — our team
          typically responds within one business day.
        </p>
        <Button
          size="lg"
          asChild
          className="mt-6 bg-[#25D366] text-white hover:bg-[#25D366]/90"
        >
          <a href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer">
            <WhatsappIcon className="size-4" />
            Chat on WhatsApp
          </a>
        </Button>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contactCards.map((card) => (
            <div key={card.label} className="border-border bg-card rounded-lg border p-5">
              <card.icon className="text-industrial size-5" />
              <p className="text-muted-foreground mt-3 text-xs tracking-wide uppercase">{card.label}</p>
              {card.href ? (
                <a href={card.href} className="mt-1 block text-sm font-medium hover:underline">
                  {card.value}
                </a>
              ) : (
                <p className="mt-1 text-sm font-medium">{card.value}</p>
              )}
            </div>
          ))}
        </div>

        <EmptyState
          className="mt-12"
          title="Contact form coming soon"
          description="For now, please reach us directly by phone, email or WhatsApp above."
        />
      </Section>
    </>
  );
}
