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
INSERT INTO products (category_id, name, slug, description, image_url, is_available, stock_quantity) VALUES
(1, 'Luxury Wedding High-Peak Tent', 'luxury-wedding-high-peak-tent', 'Premium 20x40 elegant white high-peak tent perfect for weddings, garden galas, and VIP corporate outdoor gatherings.', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800', true, 10),
(1, 'Standard Party Canopy (20x20)', 'standard-party-canopy-20x20', 'Heavy-duty outdoor pop-up canopy shading up to 40 seated guests comfortably. Ideal for backyard birthdays.', 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800', true, 25),
(1, 'Garden Party Tent (10x10)', 'garden-party-tent-10x10', 'Compact and elegant pop-up tent perfect for small gatherings, garden parties, and intimate celebrations.', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800', true, 30),
(1, 'Premium Tent Setup', 'premium-tent-setup', 'Spacious tent with elegant event-ready layout. Perfect for large weddings and corporate events with premium finish.', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800', true, 15),
(1, 'Heavy Duty Canopy', 'heavy-duty-canopy', 'Strong canopy for weather-ready events. Reinforced frame and weather-resistant material for outdoor durability.', 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800', true, 20),
(2, 'Gold Phoenix Banquet Chair', 'gold-phoenix-banquet-chair', 'Exquisite gold resin frame with plush white vinyl padding. Stackable and beautifully design-forward for formal galas.', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800', true, 500),
(2, '6ft Round Wooden Banquet Table', '6ft-round-wooden-banquet-table', 'Heavy-duty plywood circular table with foldaway steel legs. Seats 8 to 10 guests seamlessly. Requires table linens.', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800', true, 50),
(2, 'White Plastic Folding Chair', 'white-plastic-folding-chair', 'Durable and lightweight folding chair with comfortable contoured back. Perfect for casual events and outdoor seating.', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800', true, 300),
(2, 'Banquet Table', 'banquet-table', 'Durable banquet tables for large gatherings. Sturdy construction with smooth surface for dining and events.', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800', true, 40),
(2, 'Gold Phoenix Chair', 'gold-phoenix-chair', 'Classic chair style for elegant spaces. Timeless design with comfortable seating for formal occasions.', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800', true, 200),
(2, 'Rectangular Folding Table', 'rectangular-folding-table', 'Versatile 6ft rectangular folding table with easy setup. Perfect for buffets, registration desks, and casual dining.', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800', true, 60),
(3, '1000L Heavy-Duty Water Storage Tank', '1000l-heavy-duty-water-storage-tank', 'Food-grade UV-stabilized plastic vertical water reservoir to guarantee uncompromising water availability for massive open-air venues.', 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800', true, 15),
(3, '500L Portable Water Tank', '500l-portable-water-tank', 'Compact horizontal water tank with easy-carry handles. Ideal for smaller events and temporary water supply needs.', 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800', true, 20),
(3, 'Water Tank', 'water-tank', 'Large-capacity water tank for events and backups. Reliable water storage solution for outdoor venues.', 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800', true, 10),
(4, 'Outdoor Sound & PA System Kit', 'outdoor-sound-pa-system-kit', 'Dual 15-inch active loudspeaker configuration matching with adjustable tripod mounts, a mixer board, and two wireless microphones.', 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800', true, 10),
(4, 'Silent Eco-Diesel Generator (10kVA)', 'silent-eco-diesel-generator-10kva', 'Soundproof, reliable remote mobile power station designed to provide consistent energy output for lighting, music, and catering.', 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800', true, 8),
(4, 'LED Stage Lighting Package', 'led-stage-lighting-package', 'Professional LED lighting system with color-changing capabilities, DMX controller, and mounting hardware. Perfect for concerts and stage performances.', 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800', true, 12),
(4, 'Event Generator', 'event-generator', 'Dependable power backup for outdoor venues. Reliable generator for lighting, sound systems, and catering equipment.', 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800', true, 10),
(4, 'Portable Stage Platform', 'portable-stage-platform', 'Modular stage platform system with easy assembly. Perfect for performances, presentations, and elevated displays.', 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800', true, 15),
(2, 'Cocktail High Table', 'cocktail-high-table', 'Elegant high-top cocktail table with sleek design. Perfect for networking events, cocktail hours, and standing receptions.', 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800', true, 50),
(4, 'Wireless Microphone System', 'wireless-microphone-system', 'Professional wireless microphone system with handheld and lapel options. Crystal clear audio for speeches and presentations.', 'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800', true, 15);

-- Insert Gallery Items
INSERT INTO gallery (id, title, image_url, tag) VALUES
(1, 'Elegant Botanical Garden Wedding', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800', 'Weddings'),
(2, 'Corporate Annual Leadership Gala', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800', 'Corporate Events'),
(3, 'Neon Theme 30th Birthday Bash', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800', 'Birthday Parties');
