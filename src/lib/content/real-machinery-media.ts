/**
 * Real machinery photography supplied by the client (public/machinery/*.jpg).
 * These are all extrusion-line photos for macaroni/pasta/vermicelli-type dough
 * extrusion equipment — visually representative of that whole equipment
 * family, so they're reused across noodle/macaroni/pasta/vermicelli/extruder
 * categories. They do NOT resemble drying tunnels or bagging/packaging
 * equipment, so drying-systems, packaging-machinery, continuous-belt-dryer
 * and automatic-bag-packaging-machine are deliberately left unmapped here —
 * showing an extruder photo for those would itself be a wrong/irrelevant
 * image. Leave them on the neutral placeholder until real photos exist.
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
