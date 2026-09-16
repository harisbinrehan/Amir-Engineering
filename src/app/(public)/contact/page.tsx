import type { Metadata } from "next";
import { MailIcon, MapPinIcon, PhoneIcon, ClockIcon, NavigationIcon } from "lucide-react";
import { Section } from "@/components/layout/section";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { WhatsappIcon } from "@/components/icons/social-icons";
import { siteConfig } from "@/lib/content/site-config";

const { lat, lng } = siteConfig.contact.coordinates;
const mapEmbedSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=16&output=embed`;

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
    value: `${siteConfig.contact.address.line1}, ${siteConfig.contact.address.line2}, ${siteConfig.contact.address.city} ${siteConfig.contact.address.postalCode}`,
    href: siteConfig.contact.mapsUrl,
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
        <div className="mt-8 relative overflow-hidden rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="absolute inset-y-0 right-0 w-64 bg-gradient-to-l from-[#25D366]/10 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground">Need immediate assistance?</h3>
              <p className="mt-1 text-sm text-muted-foreground">Message us directly on WhatsApp for a quick response.</p>
            </div>
            <Button
              asChild
              size="lg"
              className="w-full shrink-0 gap-2 bg-[#25D366] text-white shadow-md shadow-[#25D366]/20 hover:bg-[#25D366]/90 sm:w-auto"
            >
              <a href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer">
                <WhatsappIcon className="size-5" />
                Start a Conversation
              </a>
            </Button>
          </div>
        </div>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {contactCards.map((card) => (
            <div key={card.label} className="border-border bg-card rounded-lg border p-5">
              <card.icon className="text-industrial size-5" />
              <p className="text-muted-foreground mt-3 text-xs tracking-wide uppercase">{card.label}</p>
              {card.href ? (
                <a
                  href={card.href}
                  target={card.href.startsWith("http") ? "_blank" : undefined}
                  rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="mt-1 block text-sm font-medium hover:underline"
                >
                  {card.value}
                </a>
              ) : (
                <p className="mt-1 text-sm font-medium">{card.value}</p>
              )}
            </div>
          ))}
        </div>

        <div className="border-border mt-8 overflow-hidden rounded-lg border">
          <iframe
            src={mapEmbedSrc}
            className="h-80 w-full sm:h-96"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Amir Engineering location on Google Maps"
          />
          <div className="bg-card flex items-center justify-between gap-4 p-4">
            <p className="text-muted-foreground text-sm">
              {siteConfig.contact.address.line1}, {siteConfig.contact.address.line2}, {siteConfig.contact.address.city}
            </p>
            <Button variant="outline" size="sm" asChild>
              <a href={siteConfig.contact.mapsUrl} target="_blank" rel="noopener noreferrer">
                <NavigationIcon className="size-3.5" />
                Get Directions
              </a>
            </Button>
          </div>
        </div>

      </Section>
    </>
  );
}
