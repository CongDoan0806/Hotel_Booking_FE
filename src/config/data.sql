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

