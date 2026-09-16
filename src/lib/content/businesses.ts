/**
 * The two established, connected businesses this site represents. Keep their
 * histories and identities distinct — never describe one as a "brand of" or
 * subsidiary of the other unless that relationship is explicitly confirmed.
 */

export const homeIntro = {
  eyebrow: "Two Established Businesses. One Vision for the Future.",
  title: "Decades of Experience. Built for What's Next.",
  body: "From food manufacturing since 1988 to engineering and industrial solutions since 2005, our businesses continue to evolve through manufacturing, technology and innovation.",
};

export const businesses = {
  fineFoods: {
    name: "Fine Foods Industries",
    since: 1988,
    sinceLabel: "Since 1988",
    tagline: "Food Manufacturing & Consumer Products",
    description:
      "Established in 1988, Fine Foods Industries represents the food manufacturing and consumer-products side of our business — now being developed further with modern food-production capabilities, including a planned, fully automated noodle production line.",
    href: "/fine-foods",
    ctaLabel: "Explore Fine Foods Industries",
  },
  amirEngineering: {
    name: "Amir Engineering",
    since: 2005,
    sinceLabel: "Since 2005",
    tagline: "Engineering, Machinery & Industrial Solutions",
    description:
      "Established in 2005, Amir Engineering designs and manufactures industrial machinery, food-processing equipment and complete production lines — covering automation, manufacturing, installation and industrial services.",
    href: "/amir-engineering",
    ctaLabel: "Explore Amir Engineering",
  },
} as const;
