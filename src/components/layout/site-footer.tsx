import Link from "next/link";
import { MailIcon, PhoneIcon, MapPinIcon } from "lucide-react";
import { FacebookIcon, LinkedinIcon, YoutubeIcon, InstagramIcon } from "@/components/icons/social-icons";
import { footerNav } from "@/lib/content/nav-links";
import { siteConfig } from "@/lib/content/site-config";

export function SiteFooter() {
  return (
    <footer className="bg-surface-dark text-surface-dark-foreground mt-auto">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-6 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <p className="text-surface-dark-foreground/70 max-w-sm text-sm leading-relaxed">
            {siteConfig.description}
          </p>
          <div className="text-surface-dark-foreground/70 mt-6 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <MapPinIcon className="size-4 shrink-0" />
              <a href={siteConfig.contact.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-surface-dark-foreground">
                {siteConfig.contact.address.line1}, {siteConfig.contact.address.line2},{" "}
                {siteConfig.contact.address.city}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <PhoneIcon className="size-4 shrink-0" />
              <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-surface-dark-foreground">
                {siteConfig.contact.phone}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MailIcon className="size-4 shrink-0" />
              <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-surface-dark-foreground">
                {siteConfig.contact.email}
              </a>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4">
            <a href={siteConfig.social.facebook} aria-label="Facebook" className="text-surface-dark-foreground/70 hover:text-surface-dark-foreground">
              <FacebookIcon className="size-5" />
            </a>
            <a href={siteConfig.social.linkedin} aria-label="LinkedIn" className="text-surface-dark-foreground/70 hover:text-surface-dark-foreground">
              <LinkedinIcon className="size-5" />
            </a>
            <a href={siteConfig.social.youtube} aria-label="YouTube" className="text-surface-dark-foreground/70 hover:text-surface-dark-foreground">
              <YoutubeIcon className="size-5" />
            </a>
            <a href={siteConfig.social.instagram} aria-label="Instagram" className="text-surface-dark-foreground/70 hover:text-surface-dark-foreground">
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
                  <Link href={link.href} className="text-surface-dark-foreground/70 hover:text-surface-dark-foreground text-sm">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-surface-dark-foreground/10 border-t">
        <div className="text-surface-dark-foreground/60 mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.legalName}. All rights reserved.
          </p>
          <p>{siteConfig.contact.hours}</p>
        </div>
      </div>
    </footer>
  );
}
