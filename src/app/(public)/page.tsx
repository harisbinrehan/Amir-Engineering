import { Hero } from "@/components/home/hero";
import { BusinessesIntro } from "@/components/home/businesses-intro";
import { TrustIntro } from "@/components/home/trust-intro";
import { MachineryShowcase } from "@/components/home/machinery-showcase";
import { VideoShowcase } from "@/components/home/video-showcase";
import { ProductionLinesTeaser } from "@/components/home/production-lines-teaser";
import { FoodProductsTeaser } from "@/components/home/food-products-teaser";
import { ProjectsTeaser } from "@/components/home/projects-teaser";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { CtaSection } from "@/components/home/cta-section";
import { siteConfig } from "@/lib/content/site-config";

export const revalidate = 60;

export default function HomePage() {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.legalName,
    url: siteConfig.url,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${siteConfig.contact.address.line1}, ${siteConfig.contact.address.line2}`,
      addressLocality: siteConfig.contact.address.city,
      addressRegion: siteConfig.contact.address.region,
      postalCode: siteConfig.contact.address.postalCode,
      addressCountry: siteConfig.contact.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.contact.coordinates.lat,
      longitude: siteConfig.contact.coordinates.lng,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.contact.phone,
      email: siteConfig.contact.email,
      contactType: "sales",
    },
    sameAs: Object.values(siteConfig.social),
  };

  return (
    <>
      <script
        type="application/ld+json"
         
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <Hero />
      <BusinessesIntro />
      <TrustIntro />
      <MachineryShowcase />
      <VideoShowcase />
      <ProductionLinesTeaser />
      <FoodProductsTeaser />
      <ProjectsTeaser />
      <TestimonialsSection />
      <CtaSection />
    </>
  );
}
