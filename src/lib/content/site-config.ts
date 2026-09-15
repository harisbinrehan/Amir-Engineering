export const siteConfig = {
  name: "Amir Engineering",
  shortName: "Amir Engineering",
  description:
    "Amir Engineering designs and manufactures industrial machinery and complete production lines for noodles, macaroni, pasta and vermicelli — and produces finished food products for local and international markets.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.amirengineering.com",
  legalName: "Amir Engineering (Pvt.) Ltd.",
  contact: {
    email: "info@amirengineering.com",
    salesEmail: "sales@amirengineering.com",
    phone: "+92 42 3585 0000",
    whatsapp: "+92 300 0000000",
    address: {
      line1: "Industrial Estate, Multan Road",
      city: "Lahore",
      region: "Punjab",
      postalCode: "54000",
      country: "Pakistan",
    },
    hours: "Mon – Sat, 9:00 AM – 6:00 PM (PKT)",
  },
  social: {
    facebook: "https://facebook.com/amirengineering",
    linkedin: "https://linkedin.com/company/amirengineering",
    youtube: "https://youtube.com/@amirengineering",
    instagram: "https://instagram.com/amirengineering",
  },
} as const;
