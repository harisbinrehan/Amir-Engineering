-- Guest checkout has no session, so it can never own a row in `addresses`
-- (RLS requires profile_id = auth.uid()). Store the shipping address inline
-- on the order instead of forcing every checkout through the addresses
-- table — logged-in "saved addresses" remain a separate, later feature.
alter table orders
  add column shipping_address_line1 text,
  add column shipping_address_line2 text,
  add column shipping_city text,
  add column shipping_province text,
  add column shipping_postal_code text,
  add column shipping_country text not null default 'Pakistan';
