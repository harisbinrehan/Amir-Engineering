/**
 * Real machinery photography supplied by the client (public/machinery/*.jpg).
 * These are all extrusion-line photos for macaroni/pasta/vermicelli-type dough
 * extrusion equipment — visually representative of that whole equipment
 * family, so they're reused across noodle/macaroni/pasta/vermicelli/extruder
 * categories.
 *
 * drying-systems and packaging-machinery don't resemble that equipment, so
 * they use free-license stock photos (public/stock/*.jpg — Pexels License,
 * free for commercial use) as representative category imagery instead of an
 * unrelated extruder photo. These are catalog-browsing illustrations, not a
 * claim that this exact unit is the specific quoted machine.
 */

export const heroMachineryImage = "/machinery/macaroni-line-03.jpg";

export const realMachineryImagesBySlug: Record<string, string[]> = {
  "macaroni-extrusion-machine": [
    "/machinery/macaroni-line-01.jpg",
    "/machinery/extruder-01.jpg",
    "/machinery/macaroni-line-02.jpg",
    "/machinery/macaroni-line-03.jpg",
    "/machinery/macaroni-line-04.jpg",
  ],
  "short-cut-pasta-extruder": [
    "/machinery/extruder-01.jpg",
    "/machinery/extruder-02.jpg",
    "/machinery/macaroni-line-02.jpg",
    "/machinery/tabletop-extruder.jpg",
  ],
  "automatic-noodle-production-machine": ["/machinery/macaroni-line-04.jpg", "/machinery/factory-floor-01.jpg"],
  "fresh-noodle-cutting-machine": ["/machinery/tabletop-extruder.jpg"],
  "vermicelli-processing-machine": ["/machinery/extruder-02.jpg", "/machinery/factory-floor-02.jpg"],
  "twin-screw-food-extruder": ["/machinery/extruder-01.jpg", "/machinery/macaroni-line-02.jpg"],
  "continuous-belt-dryer": ["/stock/drying-systems.jpg"],
  "automatic-bag-packaging-machine": ["/stock/packaging-machinery.jpg"],
};

export const realCategoryImagesBySlug: Record<string, string> = {
  "noodle-machinery": "/machinery/macaroni-line-04.jpg",
  "macaroni-machinery": "/machinery/macaroni-line-01.jpg",
  "pasta-machinery": "/machinery/macaroni-line-03.jpg",
  "vermicelli-machinery": "/machinery/extruder-02.jpg",
  extruders: "/machinery/extruder-01.jpg",
};

/** Real factory-floor / workshop photography for the About page gallery. */
export const factoryFloorImages = [
  "/machinery/factory-floor-01.jpg",
  "/machinery/factory-floor-02.jpg",
  "/machinery/macaroni-line-04.jpg",
  "/machinery/tabletop-extruder.jpg",
];

/** Production-line imagery — real client photos where the line matches, a licensed stock photo as fallback. */
export const productionLineFallbackImage = "/stock/production-line.jpg";
export const realProductionLineImagesBySlug: Record<string, string> = {
  "noodle-production-line": "/machinery/macaroni-line-04.jpg",
};
