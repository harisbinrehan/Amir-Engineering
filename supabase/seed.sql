-- Placeholder seed data for local development. Real company data replaces
-- this later via the admin portal — nothing here should be treated as
-- production content.

-- ---------------------------------------------------------------------------
-- Machinery categories
-- ---------------------------------------------------------------------------
insert into machinery_categories (id, name, slug, description, sort_order) values
  ('11111111-1111-1111-1111-111111111101', 'Noodle Machinery', 'noodle-machinery', 'Mixing, extrusion, cutting and drying systems for continuous noodle production.', 1),
  ('11111111-1111-1111-1111-111111111102', 'Macaroni Machinery', 'macaroni-machinery', 'High-throughput macaroni extrusion and forming equipment.', 2),
  ('11111111-1111-1111-1111-111111111103', 'Pasta Machinery', 'pasta-machinery', 'Precision pasta lines engineered for consistent shape and texture.', 3),
  ('11111111-1111-1111-1111-111111111104', 'Vermicelli Machinery', 'vermicelli-machinery', 'Complete vermicelli processing systems from raw material to finished strand.', 4),
  ('11111111-1111-1111-1111-111111111105', 'Extruders', 'extruders', 'Twin-screw and single-screw extrusion systems for food processing.', 5),
  ('11111111-1111-1111-1111-111111111106', 'Drying Systems', 'drying-systems', 'Continuous belt and tunnel drying systems.', 6),
  ('11111111-1111-1111-1111-111111111107', 'Packaging Machinery', 'packaging-machinery', 'Automatic weighing, bagging and sealing equipment.', 7);

-- ---------------------------------------------------------------------------
-- Machinery
-- ---------------------------------------------------------------------------
insert into machinery (
  id, category_id, name, slug, short_description, description,
  capacity, power_requirement, dimensions, weight, voltage, material, is_featured
) values
  (
    '22222222-2222-2222-2222-222222222201',
    '11111111-1111-1111-1111-111111111101',
    'Automatic Noodle Production Machine',
    'automatic-noodle-production-machine',
    'Fully automatic noodle line covering mixing, pressing, cutting and folding in one continuous system.',
    'The Automatic Noodle Production Machine is engineered for continuous, high-volume noodle manufacturing. It integrates flour mixing, dough pressing, sheeting, cutting and folding into a single automated line, reducing manual handling and improving consistency across batches. Built on a stainless-steel frame for food-grade durability.',
    '300 – 500 kg/hr', '18.5 kW / 3-phase', '6200 x 1400 x 1800 mm', '2400 kg', '380V / 50Hz', 'Stainless steel (food-grade)', true
  ),
  (
    '22222222-2222-2222-2222-222222222202',
    '11111111-1111-1111-1111-111111111101',
    'Fresh Noodle Cutting Machine',
    'fresh-noodle-cutting-machine',
    'Precision cutting unit for fresh noodle strands with adjustable width settings.',
    'A compact cutting unit designed to slice pressed dough sheets into consistent noodle strands. Interchangeable cutting rollers allow quick changeover between noodle widths.',
    '150 – 250 kg/hr', '4 kW / 3-phase', '1800 x 900 x 1400 mm', '650 kg', '380V / 50Hz', 'Stainless steel', false
  ),
  (
    '22222222-2222-2222-2222-222222222203',
    '11111111-1111-1111-1111-111111111102',
    'Macaroni Extrusion Machine',
    'macaroni-extrusion-machine',
    'Industrial macaroni extruder with interchangeable dies for multiple pasta shapes.',
    'Designed for continuous macaroni production, this extruder uses a twin-screw system for consistent dough compression and shaping. Interchangeable bronze and Teflon dies support a range of macaroni and short-pasta shapes.',
    '400 – 600 kg/hr', '30 kW / 3-phase', '5400 x 1600 x 2100 mm', '3200 kg', '380V / 50Hz', 'Stainless steel + bronze dies', true
  ),
  (
    '22222222-2222-2222-2222-222222222204',
    '11111111-1111-1111-1111-111111111103',
    'Short-Cut Pasta Extruder',
    'short-cut-pasta-extruder',
    'Compact extrusion system for penne, fusilli and other short-cut pasta shapes.',
    'A single-screw extrusion system optimized for short-cut pasta shapes, with an integrated rotary cutter for length control and a vacuum chamber for improved dough quality.',
    '250 – 400 kg/hr', '22 kW / 3-phase', '4200 x 1500 x 1900 mm', '2100 kg', '380V / 50Hz', 'Stainless steel', false
  ),
  (
    '22222222-2222-2222-2222-222222222205',
    '11111111-1111-1111-1111-111111111104',
    'Vermicelli Processing Line Machine',
    'vermicelli-processing-machine',
    'Complete vermicelli forming and cutting system for continuous strand production.',
    'This machine handles dough extrusion, strand forming and cutting for vermicelli production, feeding directly into a drying system for a continuous production flow.',
    '300 – 450 kg/hr', '20 kW / 3-phase', '5000 x 1500 x 1800 mm', '2600 kg', '380V / 50Hz', 'Stainless steel', true
  ),
  (
    '22222222-2222-2222-2222-222222222206',
    '11111111-1111-1111-1111-111111111105',
    'Twin-Screw Food Extruder',
    'twin-screw-food-extruder',
    'Industrial twin-screw extruder suited to a range of food-processing applications.',
    'A versatile twin-screw extruder platform used across noodle, macaroni and pasta lines, with precise temperature and pressure control zones.',
    '350 – 700 kg/hr', '37 kW / 3-phase', '6000 x 1700 x 2200 mm', '3800 kg', '380V / 50Hz', 'Stainless steel', false
  ),
  (
    '22222222-2222-2222-2222-222222222207',
    '11111111-1111-1111-1111-111111111106',
    'Continuous Belt Drying System',
    'continuous-belt-dryer',
    'Multi-tier belt dryer for uniform moisture reduction at production scale.',
    'A continuous multi-tier belt drying tunnel with zoned temperature and humidity control, designed to integrate directly after extrusion or cutting stages.',
    '500 kg/hr input', '45 kW / 3-phase', '12000 x 2200 x 2600 mm', '5200 kg', '380V / 50Hz', 'Galvanized steel + stainless interior', false
  ),
  (
    '22222222-2222-2222-2222-222222222208',
    '11111111-1111-1111-1111-111111111107',
    'Automatic Bag Packaging Machine',
    'automatic-bag-packaging-machine',
    'Automatic weighing, bagging and sealing system for finished food products.',
    'Handles weighing, bag forming, filling and heat-sealing in a single automated unit, configurable for various pack sizes.',
    'Up to 60 bags/min', '6 kW / single-phase', '2400 x 1200 x 2000 mm', '900 kg', '220V / 50Hz', 'Stainless steel', false
  );

insert into machinery_specifications (machinery_id, spec_group, label, value, sort_order) values
  ('22222222-2222-2222-2222-222222222201', 'Performance', 'Production Capacity', '300 – 500 kg/hr', 1),
  ('22222222-2222-2222-2222-222222222201', 'Performance', 'Noodle Thickness Range', '0.8 – 3.0 mm', 2),
  ('22222222-2222-2222-2222-222222222201', 'Construction', 'Frame Material', 'Stainless steel (food-grade)', 1),
  ('22222222-2222-2222-2222-222222222201', 'Construction', 'Control System', 'PLC touchscreen', 2),
  ('22222222-2222-2222-2222-222222222203', 'Performance', 'Production Capacity', '400 – 600 kg/hr', 1),
  ('22222222-2222-2222-2222-222222222203', 'Performance', 'Die Change Time', '< 15 minutes', 2),
  ('22222222-2222-2222-2222-222222222203', 'Construction', 'Die Material', 'Bronze / Teflon-lined', 1);

-- ---------------------------------------------------------------------------
-- Production line: Complete Noodle Production Line
-- ---------------------------------------------------------------------------
insert into production_lines (id, name, slug, short_description, description, capacity, required_space, power_requirement, is_active) values (
  '33333333-3333-3333-3333-333333333301',
  'Complete Noodle Production Line',
  'noodle-production-line',
  'Turnkey noodle production line from raw material intake to packaged, finished product.',
  'A complete, engineered production line covering every stage of noodle manufacturing — from raw material handling through mixing, extrusion, cutting, drying, cooling and packaging — sized to your target output.',
  '300 – 500 kg/hr finished product',
  'Approx. 400 sq. meters',
  'Approx. 120 kW total connected load',
  true
);

insert into production_line_stages (id, production_line_id, name, description, sort_order) values
  ('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333301', 'Raw Material', 'Flour and water intake with automated dosing.', 1),
  ('44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333301', 'Mixing', 'Vacuum dough mixing for consistent hydration.', 2),
  ('44444444-4444-4444-4444-444444444403', '33333333-3333-3333-3333-333333333301', 'Extrusion', 'Dough pressing and sheeting.', 3),
  ('44444444-4444-4444-4444-444444444404', '33333333-3333-3333-3333-333333333301', 'Cutting / Forming', 'Strand cutting to target noodle width.', 4),
  ('44444444-4444-4444-4444-444444444405', '33333333-3333-3333-3333-333333333301', 'Drying', 'Multi-tier belt drying to target moisture content.', 5),
  ('44444444-4444-4444-4444-444444444406', '33333333-3333-3333-3333-333333333301', 'Cooling', 'Ambient cooling before packaging.', 6),
  ('44444444-4444-4444-4444-444444444407', '33333333-3333-3333-3333-333333333301', 'Packaging', 'Automatic weighing, bagging and sealing.', 7);

insert into production_line_machines (production_line_id, machinery_id, stage_id, quantity, sort_order) values
  ('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', '44444444-4444-4444-4444-444444444403', 1, 1),
  ('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222202', '44444444-4444-4444-4444-444444444404', 1, 2),
  ('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222207', '44444444-4444-4444-4444-444444444405', 1, 3),
  ('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222208', '44444444-4444-4444-4444-444444444407', 1, 4);

-- ---------------------------------------------------------------------------
-- Testimonials & FAQs
-- ---------------------------------------------------------------------------
insert into testimonials (author_name, author_title, company_name, quote, rating, sort_order) values
  ('Muhammad Farooq', 'Production Manager', 'Al-Noor Foods', 'Amir Engineering''s noodle line has run reliably since installation — their team supported us through commissioning and beyond.', 5, 1),
  ('Sara Khan', 'Operations Director', 'Khan Pasta Mills', 'The macaroni extrusion system exceeded our capacity targets and the build quality is excellent for the price point.', 5, 2),
  ('Ibrahim Al-Sayed', 'General Manager', 'Gulf Vermicelli Co.', 'We imported a complete vermicelli production line from Amir Engineering — smooth installation and responsive after-sales support.', 4, 3);

insert into faqs (question, answer, category, sort_order) values
  ('Do you offer installation and commissioning support?', 'Yes — our engineering team supports installation, commissioning and operator training for all machinery and production lines.', 'machinery', 1),
  ('Can machinery be customized for a specific production capacity?', 'Most of our machines and production lines can be configured for a target capacity. Share your requirements on the quote request form and our team will recommend a configuration.', 'machinery', 2),
  ('Do you export machinery internationally?', 'Yes, we supply machinery and production lines to customers outside Pakistan. Shipping, documentation and installation support are arranged per project.', 'machinery', 3),
  ('What payment methods are accepted for food product orders?', 'Food product orders can currently be paid via Cash on Delivery or Bank Transfer.', 'shop', 4);
