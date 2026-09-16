-- Direct, admin-editable primary image for production lines — mirrors
-- products.image_url / machinery.image_url (0014, 0015).
alter table production_lines add column image_url text;

update production_lines set image_url = '/machinery/macaroni-line-04.jpg' where slug = 'noodle-production-line';
