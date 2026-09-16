-- Direct, admin-editable image URL for a product's primary listing/detail
-- image — mirrors product_categories.image_url. Avoids requiring the full
-- media/upload pipeline (still unbuilt) just to manage a product photo.
alter table products add column image_url text;

update products set image_url = '/products/chicken-noodles.jpg' where slug = 'chicken-noodles';
update products set image_url = '/products/masala-noodles.jpg' where slug = 'masala-noodles';
update products set image_url = '/products/classic-elbow-macaroni.jpg' where slug = 'classic-elbow-macaroni';
update products set image_url = '/products/fusilli-pasta.jpg' where slug = 'fusilli-pasta';
update products set image_url = '/products/penne-pasta.jpg' where slug = 'penne-pasta';
update products set image_url = '/products/premium-vermicelli.jpg' where slug = 'premium-vermicelli';
