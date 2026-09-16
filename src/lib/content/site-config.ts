export const siteConfig = {
  name: "Amir Engineering",
  shortName: "Amir Engineering",
  description:
    "Amir Engineering designs and manufactures industrial machinery and complete production lines for noodles, macaroni, pasta and vermicelli — and produces finished food products for local and international markets.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.amirengineering.com",
  legalName: "Amir Engineering (Pvt.) Ltd.",
  contact: {
    email: "amirengineering.info@gmail.com",
    salesEmail: "amirengineering.info@gmail.com",
    phone: "+92 332 2000011",
    whatsapp: "+92 332 2000011",
    address: {
      line1: "At Shabab Studio, Punj Graeen",
      line2: "Multan Road, Kot Gujra",
      city: "Lahore",
      region: "Punjab",
      postalCode: "54000",
      country: "Pakistan",
    },
    hours: "Mon – Sat, from 8:00 AM (PKT)",
    mapsUrl: "https://maps.app.goo.gl/vqqKrnpdm31QfMRr6",
    coordinates: { lat: 31.4397492, lng: 74.1844621 },
  },
  social: {
    facebook: "https://facebook.com/amirengineering",
    linkedin: "https://linkedin.com/company/amirengineering",
    youtube: "https://youtube.com/@amirengineering",
    instagram: "https://instagram.com/amirengineering",
  },
} as const;
