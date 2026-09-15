import Link from "next/link";
import { MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";
import { FacebookIcon, LinkedinIcon, YoutubeIcon, InstagramIcon } from "@/components/icons/social-icons";
import { footerNav } from "@/lib/content/nav-links";
import { siteConfig } from "@/lib/content/site-config";

export function SiteFooter() {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <Link href="/" className="font-heading flex items-center gap-2 text-lg font-bold">
            <span className="bg-industrial text-industrial-foreground flex size-8 items-center justify-center rounded-md text-sm">
              AE
            </span>
            Amir Engineering
          </Link>
          <p className="text-primary-foreground/70 mt-4 max-w-sm text-sm leading-relaxed">
            {siteConfig.description}
          </p>
          <div className="text-primary-foreground/70 mt-6 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <MapPinIcon className="size-4 shrink-0" />
              <span>
                {siteConfig.contact.address.line1}, {siteConfig.contact.address.city},{" "}
                {siteConfig.contact.address.country}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneIcon className="size-4 shrink-0" />
              <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-primary-foreground">
                {siteConfig.contact.phone}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MailIcon className="size-4 shrink-0" />
              <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-primary-foreground">
                {siteConfig.contact.email}
              </a>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <a href={siteConfig.social.facebook} aria-label="Facebook" className="text-primary-foreground/70 hover:text-primary-foreground">
              <FacebookIcon className="size-5" />
            </a>
            <a href={siteConfig.social.linkedin} aria-label="LinkedIn" className="text-primary-foreground/70 hover:text-primary-foreground">
              <LinkedinIcon className="size-5" />
            </a>
            <a href={siteConfig.social.youtube} aria-label="YouTube" className="text-primary-foreground/70 hover:text-primary-foreground">
              <YoutubeIcon className="size-5" />
            </a>
            <a href={siteConfig.social.instagram} aria-label="Instagram" className="text-primary-foreground/70 hover:text-primary-foreground">
              <InstagramIcon className="size-5" />
            </a>
          </div>
        </div>

        {footerNav.map((column) => (
          <div key={column.title}>
            <h3 className="font-heading text-sm font-semibold tracking-wide uppercase">{column.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-primary-foreground/70 hover:text-primary-foreground text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-primary-foreground/10 border-t">
        <div className="text-primary-foreground/60 mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
          </p>
          <p>{siteConfig.contact.hours}</p>
        </div>
      </div>
    </footer>
  );
}
