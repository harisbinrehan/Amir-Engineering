export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

export type NavSection = NavLink & {
  children?: NavLink[];
};

/** Primary desktop navigation, left of the Shop / Request Quote CTAs. */
export const primaryNav: NavSection[] = [
  {
    label: "Our Businesses",
    href: "/fine-foods",
    description: "Two established, connected businesses — food manufacturing and industrial engineering.",
    children: [
      { label: "Fine Foods Industries", href: "/fine-foods", description: "Food Manufacturing & Consumer Products · Since 1988" },
      { label: "Amir Engineering", href: "/amir-engineering", description: "Engineering, Machinery & Industrial Solutions · Since 2005" },
    ],
  },
  {
    label: "Machinery",
    href: "/machinery",
    description: "Industrial machinery for noodle, pasta and vermicelli production.",
    children: [
      { label: "All Machinery", href: "/machinery" },
      { label: "Noodle Machinery", href: "/machinery?category=noodle-machinery" },
      { label: "Macaroni Machinery", href: "/machinery?category=macaroni-machinery" },
      { label: "Pasta Machinery", href: "/machinery?category=pasta-machinery" },
      { label: "Vermicelli Machinery", href: "/machinery?category=vermicelli-machinery" },
      { label: "Extruders", href: "/machinery?category=extruders" },
      { label: "Drying Systems", href: "/machinery?category=drying-systems" },
      { label: "Packaging Machinery", href: "/machinery?category=packaging-machinery" },
    ],
  },
  {
    label: "Food Products",
    href: "/products",
    description: "Finished noodles, macaroni, pasta and vermicelli products.",
  },
  {
    label: "Production Lines",
    href: "/production-lines",
    description: "Complete, turnkey production lines from raw material to packaging.",
  },
  { label: "Solutions", href: "/solutions" },
  { label: "About Us", href: "/about" },
  { label: "Projects", href: "/projects" },
  { label: "Contact", href: "/contact" },
];

export const utilityNav: NavLink[] = [
  { label: "Shop", href: "/products" },
  { label: "Request a Quote", href: "/quote/request" },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Machinery",
    links: [
      { label: "Noodle Machinery", href: "/machinery?category=noodle-machinery" },
      { label: "Macaroni Machinery", href: "/machinery?category=macaroni-machinery" },
      { label: "Pasta Machinery", href: "/machinery?category=pasta-machinery" },
      { label: "Vermicelli Machinery", href: "/machinery?category=vermicelli-machinery" },
      { label: "Production Lines", href: "/production-lines" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Fine Foods Industries", href: "/fine-foods" },
      { label: "Amir Engineering", href: "/amir-engineering" },
      { label: "Projects", href: "/projects" },
      { label: "Solutions", href: "/solutions" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Shop",
    links: [
      { label: "Food Products", href: "/products" },
      { label: "Cart", href: "/cart" },
      { label: "My Account", href: "/account" },
      { label: "Track an Order", href: "/track-order" },
    ],
  },
  {
    title: "Get in Touch",
    links: [
      { label: "Request a Quote", href: "/quote/request" },
      { label: "Contact Sales", href: "/contact" },
    ],
  },
];
