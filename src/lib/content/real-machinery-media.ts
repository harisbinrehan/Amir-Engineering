/**
 * Real machinery photography supplied by the client (public/machinery/*.jpg).
 * These are extrusion-line photos for macaroni/pasta-type production —
 * mapped only onto categories and machines that actually match that
 * equipment type. Do not extend this mapping to noodle/vermicelli/drying/
 * packaging machinery without new photos matching those categories.
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
};

export const realCategoryImagesBySlug: Record<string, string> = {
  "macaroni-machinery": "/machinery/macaroni-line-01.jpg",
  "pasta-machinery": "/machinery/macaroni-line-03.jpg",
  extruders: "/machinery/extruder-01.jpg",
};

/** Real factory-floor / workshop photography for the About page gallery. */
export const factoryFloorImages = [
  "/machinery/factory-floor-01.jpg",
  "/machinery/factory-floor-02.jpg",
  "/machinery/macaroni-line-04.jpg",
  "/machinery/tabletop-extruder.jpg",
];
