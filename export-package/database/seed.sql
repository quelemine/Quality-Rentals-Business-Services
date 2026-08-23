-- Quality Rental Services Seed Data
-- Insert initial data into database

USE quality_rentals;

-- Insert Categories
INSERT INTO categories (id, name, slug, icon_name) VALUES
(1, 'Canopy / Tents', 'canopy-tents', 'TentIcon'),
(2, 'Tables & Chairs', 'tables-chairs', 'ArmchairIcon'),
(3, 'Water Tanks', 'water-tanks', 'ContainerIcon'),
(4, 'Event Equipment', 'event-equipment', 'LayersIcon');

-- Insert Products
INSERT INTO products (id, category_id, name, slug, description, image_url, is_available, stock_quantity) VALUES
(101, 1, 'Luxury Wedding High-Peak Tent', 'luxury-wedding-high-peak-tent', 'Premium 20x40 elegant white high-peak tent perfect for weddings, garden galas, and VIP corporate outdoor gatherings.', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800', true, 5),
(102, 1, 'Standard Party Canopy (20x20)', 'standard-party-canopy-20x20', 'Heavy-duty outdoor pop-up canopy shading up to 40 seated guests comfortably. Ideal for backyard birthdays.', 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800', true, 12),
(103, 2, 'Gold Phoenix Banquet Chair', 'gold-phoenix-banquet-chair', 'Exquisite gold resin frame with plush white vinyl padding. Stackable and beautifully design-forward for formal galas.', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800', true, 450),
(104, 2, '6ft Round Wooden Banquet Table', '6ft-round-wooden-banquet-table', 'Heavy-duty plywood circular table with foldaway steel legs. Seats 8 to 10 guests seamlessly. Requires table linens.', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800', true, 35),
(105, 3, '1000L Heavy-Duty Water Storage Tank', '1000l-heavy-duty-water-storage-tank', 'Food-grade UV-stabilized plastic vertical water reservoir to guarantee uncompromised water availability for massive open-air venues.', 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800', true, 8),
(106, 4, 'Outdoor Sound & PA System Kit', 'outdoor-sound-pa-system-kit', 'Dual 15-inch active loudspeaker configuration matching with adjustable tripod mounts, a mixer board, and two wireless microphones.', 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800', false, 0),
(107, 4, 'Silent Eco-Diesel Generator (10kVA)', 'silent-eco-diesel-generator-10kva', 'Soundproof, reliable remote mobile power station designed to provide consistent energy output for lighting, music, and catering.', 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800', true, 3);

-- Insert Gallery Items
INSERT INTO gallery (id, title, image_url, tag) VALUES
(1, 'Elegant Botanical Garden Wedding', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', 'Weddings'),
(2, 'Corporate Annual Leadership Gala', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800', 'Corporate Events'),
(3, 'Neon Theme 30th Birthday Bash', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800', 'Birthday Parties');
