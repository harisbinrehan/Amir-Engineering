/**
 * Deterministic placeholder imagery (picsum.photos, seeded) used until real
 * factory/product photography is supplied. `PlaceholderImage` is the single
 * chokepoint that renders these — see src/components/common/placeholder-image.tsx.
 */

export function placeholderImageUrl(
  seed: string,
  width: number = 1200,
  height: number = 800,
) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`;
}

export const heroImages = {
  machinery: placeholderImageUrl("amir-hero-machinery", 1920, 1080),
  foodProducts: placeholderImageUrl("amir-hero-food", 1920, 1080),
};

export const factoryImages = [
  placeholderImageUrl("amir-factory-1", 1600, 1000),
  placeholderImageUrl("amir-factory-2", 1600, 1000),
  placeholderImageUrl("amir-factory-3", 1600, 1000),
  placeholderImageUrl("amir-factory-4", 1600, 1000),
];

export const teamImages = [
  placeholderImageUrl("amir-team-1", 600, 600),
  placeholderImageUrl("amir-team-2", 600, 600),
  placeholderImageUrl("amir-team-3", 600, 600),
  placeholderImageUrl("amir-team-4", 600, 600),
];
