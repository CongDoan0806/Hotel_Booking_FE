-- insert vào room_types
INSERT INTO "room_types" (room_type_id, name, description, max_people, default_price)
VALUES 
(1,'Single Room', 'A cozy room for one person.', 1, 50.00),
(2,'Double Room', 'A spacious room for two persons.', 2, 100.00),
(3,'Suite', 'A luxurious suite for special occasions.', 4, 200.00);
select * from room_types;
INSERT INTO floors (floor_id, name)
VALUES 
(1,'Floor 1'),
(2,'Floor 2'),
(3,'Floor 3'),
(4,'Floor 4'),
(5,'Floor 5');
-- insert vào room_levels
INSERT INTO "room_levels" (room_level_id, name, description)
VALUES 
(1,'Standard', 'Basic room level with essential amenities.'),
(2,'Deluxe', 'Enhanced room level with additional features.'),
(3,'VIP', 'Luxury room level with premium services.');
select * from room_levels;

-- insert vào rooms
INSERT INTO "rooms" (room_id, name, room_type_id, room_level_id, status, price, description, floor_id)
VALUES 
(1,'Room 1001', 1, 1, 'available', 50.00, 'A cozy single room with a bed and a desk.',1),
(2,'Room 1002', 2, 2, 'available', 100.00, 'A spacious double room with a nice view.',1),
(3,'Room 1003', 2, 2, 'available', 100.00, 'A spacious double room with a nice view.',1),
(4,'Room 1004', 2, 2, 'available', 100.00, 'A spacious double room with a nice view.',1),
(5,'Room 1005', 2, 2, 'available', 100.00, 'A spacious double room with a nice view.',1),
(6,'Room 1006', 2, 2, 'available', 100.00, 'A spacious double room with a nice view.',1),
(7,'Room 1007', 2, 2, 'available', 100.00, 'A spacious double room with a nice view.',1),
(8,'Room 1008', 2, 2, 'available', 100.00, 'A spacious double room with a nice view.',1),
(9,'Room 1009', 2, 2, 'available', 100.00, 'A spacious double room with a nice view.',1),
(10,'Room 1010', 2, 2, 'available', 100.00, 'A spacious double room with a nice view.',1),
(11,'Room 1011', 2, 2, 'available', 100.00, 'A spacious double room with a nice view.',1),
(12,'Room 1012', 2, 2, 'available', 100.00, 'A spacious double room with a nice view.',1),
(13,'Room 1013', 2, 2, 'available', 100.00, 'A spacious double room with a nice view.',1),
(14,'Room 1014', 2, 2, 'available', 100.00, 'A spacious double room with a nice view.',1),
(15,'Room 1015', 2, 2, 'available', 100.00, 'A spacious double room with a nice view.',1),
(16,'Room 1016', 2, 2, 'available', 100.00, 'A spacious double room with a nice view.',1),
(17,'Room 1017', 2, 2, 'available', 100.00, 'A spacious double room with a nice view.',1),
(18,'Room 1018', 2, 2, 'available', 100.00, 'A spacious double room with a nice view.',1),
(19,'Room 1019', 3, 3, 'available', 200.00, 'A luxurious suite with all amenities.',1),
(20,'Room 1020', 3, 3, 'available', 200.00, 'A luxurious suite with all amenities.',1),
(21,'Room 2001', 3, 3, 'available', 200.00, 'A luxurious suite with all amenities.',2),
(22,'Room 2002', 3, 3, 'available', 200.00, 'A luxurious suite with all amenities.',2);
select * from rooms;

-- insert vào room_images
INSERT INTO room_images (room_id, image_url)
VALUES
  (1, '/uploads/rooms/room_1.1.jpg'),
  (1, '/uploads/rooms/room_1.2.jpg'),
  (2, '/uploads/rooms/room_2.1.jpg'),
  (2, '/uploads/rooms/room_2.2.jpg'),
  (3, '/uploads/rooms/room_3.1.jpg'),
  (4, '/uploads/rooms/room_4.1.jpg'),
  (4, '/uploads/rooms/room_4.2.jpg'),
  (4, '/uploads/rooms/room_4.3.jpg'),
  (5, '/uploads/rooms/room_5.1.jpg'),
  (5, '/uploads/rooms/room_5.2.jpg'),
  (7, '/uploads/rooms/room_7.1.jpg'),
  (7, '/uploads/rooms/room_7.2.jpg'),
  (7, '/uploads/rooms/room_7.3.jpg'),
  (8, '/uploads/rooms/room_8.1.jpg'),
  (8, '/uploads/rooms/room_8.2.jpg'),
  (9, '/uploads/rooms/room_9.1.jpg'),
  (9, '/uploads/rooms/room_9.2.jpg'),
  (9, '/uploads/rooms/room_9.3.jpg'),
  (10, '/uploads/rooms/room_10.1.jpg'),
  (10, '/uploads/rooms/room_10.2.jpg'),
  (11, '/uploads/rooms/room_11.1.jpg'),
  (12, '/uploads/rooms/room_12.1.jpg'),
  (13, '/uploads/rooms/room_13.1.jpg'),
  (14, '/uploads/rooms/room_14.1.jpg'),
  (15, '/uploads/rooms/room_15.1.jpg'),
  (15, '/uploads/rooms/room_15.2.jpg'),
  (15, '/uploads/rooms/room_15.3.jpg'),
  (15, '/uploads/rooms/room_15.4.jpg'),
  (15, '/uploads/rooms/room_15.5.jpg'),
  (15, '/uploads/rooms/room_15.6.jpg'),
  (16, '/uploads/rooms/room_16.1.jpg'),
  (16, '/uploads/rooms/room_16.2.jpg'),
  (16, '/uploads/rooms/room_16.3.jpg'),
  (17, '/uploads/rooms/room_17.1.jpg'),
  (17, '/uploads/rooms/room_17.2.jpg'),
  (17, '/uploads/rooms/room_17.3.jpg'),
  (17, '/uploads/rooms/room_17.4.jpg'),
  (17, '/uploads/rooms/room_17.5.jpg'),
  (18, '/uploads/rooms/room_18.1.jpg'),
  (18, '/uploads/rooms/room_18.2.jpg'),
  (18, '/uploads/rooms/room_18.3.jpg'),
  (18, '/uploads/rooms/room_18.4.jpg'),
  (18, '/uploads/rooms/room_18.5.jpg'),
  (19, '/uploads/rooms/room_19.1.jpg'),
  (19, '/uploads/rooms/room_19.2.jpg'),
  (19, '/uploads/rooms/room_19.3.jpg'),
  (19, '/uploads/rooms/room_19.4.jpg'),
  (20, '/uploads/rooms/room_20.1.jpg'),
  (20, '/uploads/rooms/room_20.2.jpg'),
  (20, '/uploads/rooms/room_20.3.jpg'),
  (20, '/uploads/rooms/room_20.4.jpg'),
  (20, '/uploads/rooms/room_20.5.jpg'),
  (21, '/uploads/rooms/room_21.1.jpg'),
  (21, '/uploads/rooms/room_21.2.jpg'),
  (21, '/uploads/rooms/room_21.3.jpg'),
  (21, '/uploads/rooms/room_21.4.jpg'),
  (22, '/uploads/rooms/room_22.1.jpg'),
  (22, '/uploads/rooms/room_22.2.jpg'),
  (22, '/uploads/rooms/room_22.3.jpg'),
  (22, '/uploads/rooms/room_22.4.jpg'),
  (22, '/uploads/rooms/room_22.5.jpg');

INSERT INTO amenities (name, icon, description)
VALUES 
  ('Free Wifi', 'wifi', 'High-speed internet access'),
  ('Air Conditioning', 'air-conditioner', 'Cool your room with ease'),
  ('Room Service', 'room-service', 'Order meals and services from your room'),
  ('Fitness Center', 'dumbbell', 'Access to a full gym'),
  ('Parking', 'car', 'Free on-site parking'),
  ('Restaurant', 'utensils', 'On-site dining options'),
  ('Tea/Coffee Machine', 'coffee', 'Brew your favorite beverages');

INSERT INTO amenities (amenity_id,name, icon, description)
VALUES
  (1,'Free Wi-Fi', '/uploads/amenities/wifi.png', 'Complimentary Wi-Fi access throughout the property.'),
  (2,'Breakfast Included', '/uploads/amenities/tea.png', 'Complimentary breakfast served daily.'),
  (3,'Pets are Welcome', '/uploads/amenities/pet.png', 'Complimentary breakfast served daily.'),
  (4,'Free Parking', '/uploads/amenities/parking.png', 'Free on-site parking available.'),
  (5,'free laundry service', '/uploads/amenities/clothes-crew-neck.png', 'Relax with our spa services.'),
  (6,'Free Entrance Exercise Centre', '/uploads/amenities/sport.png', 'Air conditioning in all rooms.');

  INSERT INTO room_amenities (room_id, amenity_id)
VALUES
  (1, 1), (1, 2), (1, 3), (1, 4),
  (2, 1), (2, 2), (2, 3), (2, 5),
  (3, 1), (3, 4), (3, 5), (3, 6),
  (4, 2), (4, 3), (4, 5),
  (5, 1), (5, 2), (5, 3), (5, 6),
  (6, 1), (6, 2), (6, 4),
  (7, 2), (7, 3), (7, 5), (7, 6),
  (8, 1), (8, 3), (8, 4),
  (9, 1), (9, 2), (9, 5),
  (10, 3), (10, 4), (10, 6),
  (11, 1), (11, 2), (11, 3),
  (12, 1), (12, 4), (12, 5),
  (13, 2), (13, 3), (13, 6),
  (14, 1), (14, 5), (14, 6),
  (15, 2), (15, 4), (15, 5),
  (16, 1), (16, 3), (16, 6),
  (17, 2), (17, 4), (17, 5),
  (18, 1), (18, 3), (18, 6),
  (19, 1), (19, 2), (19, 4),
  (20, 3), (20, 4), (20, 5),
  (21, 1), (21, 2), (21, 6),
  (22, 2), (22, 3), (22, 5);