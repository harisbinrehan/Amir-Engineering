-- Direct, admin-editable primary image for machinery — mirrors
-- products.image_url (see 0014). Backfilled with the first photo already
-- used per slug via src/lib/content/real-machinery-media.ts.
alter table machinery add column image_url text;

update machinery set image_url = '/machinery/macaroni-line-01.jpg' where slug = 'macaroni-extrusion-machine';
update machinery set image_url = '/machinery/extruder-01.jpg' where slug = 'short-cut-pasta-extruder';
update machinery set image_url = '/machinery/macaroni-line-04.jpg' where slug = 'automatic-noodle-production-machine';
update machinery set image_url = '/machinery/tabletop-extruder.jpg' where slug = 'fresh-noodle-cutting-machine';
update machinery set image_url = '/machinery/extruder-02.jpg' where slug = 'vermicelli-processing-machine';
update machinery set image_url = '/machinery/extruder-01.jpg' where slug = 'twin-screw-food-extruder';
update machinery set image_url = '/stock/drying-systems.jpg' where slug = 'continuous-belt-dryer';
update machinery set image_url = '/stock/packaging-machinery.jpg' where slug = 'automatic-bag-packaging-machine';
