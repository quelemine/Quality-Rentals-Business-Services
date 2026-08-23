-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: quality_rentals
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `quality_rentals`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `quality_rentals` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `quality_rentals`;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `icon_name` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Canopy / Tents','canopy-tents','TentIcon','2026-08-18 12:04:36'),(2,'Tables & Chairs','tables-chairs','ArmchairIcon','2026-08-18 12:04:36'),(3,'Water Tanks','water-tanks','ContainerIcon','2026-08-18 12:04:36'),(4,'Event Equipment','event-equipment','LayersIcon','2026-08-18 12:04:36');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gallery`
--

DROP TABLE IF EXISTS `gallery`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `gallery` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `tag` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gallery`
--

LOCK TABLES `gallery` WRITE;
/*!40000 ALTER TABLE `gallery` DISABLE KEYS */;
INSERT INTO `gallery` VALUES (1,'Elegant Botanical Garden Wedding','https://images.unsplash.com/photo-1519741497674-611481863552?w=800','Weddings','2026-08-18 12:04:36'),(2,'Corporate Annual Leadership Gala','https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800','Corporate Events','2026-08-18 12:04:36'),(3,'Neon Theme 30th Birthday Bash','https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800','Birthday Parties','2026-08-18 12:04:36');
/*!40000 ALTER TABLE `gallery` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category_id` int(11) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) NOT NULL,
  `is_available` tinyint(1) DEFAULT 1,
  `stock_quantity` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=108 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (101,1,'Luxury Wedding High-Peak Tent','luxury-wedding-high-peak-tent','Premium 20x40 elegant white high-peak tent perfect for weddings, garden galas, and VIP corporate outdoor gatherings.','https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',1,5,'2026-08-18 12:04:36'),(102,1,'Standard Party Canopy (20x20)','standard-party-canopy-20x20','Heavy-duty outdoor pop-up canopy shading up to 40 seated guests comfortably. Ideal for backyard birthdays.','https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',1,12,'2026-08-18 12:04:36'),(103,2,'Gold Phoenix Banquet Chair','gold-phoenix-banquet-chair','Exquisite gold resin frame with plush white vinyl padding. Stackable and beautifully design-forward for formal galas.','https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800',1,450,'2026-08-18 12:04:36'),(104,2,'6ft Round Wooden Banquet Table','6ft-round-wooden-banquet-table','Heavy-duty plywood circular table with foldaway steel legs. Seats 8 to 10 guests seamlessly. Requires table linens.','https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800',1,35,'2026-08-18 12:04:36'),(105,3,'1000L Heavy-Duty Water Storage Tank','1000l-heavy-duty-water-storage-tank','Food-grade UV-stabilized plastic vertical water reservoir to guarantee uncompromised water availability for massive open-air venues.','https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800',1,8,'2026-08-18 12:04:36'),(106,4,'Outdoor Sound & PA System Kit','outdoor-sound-pa-system-kit','Dual 15-inch active loudspeaker configuration matching with adjustable tripod mounts, a mixer board, and two wireless microphones.','https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=800',0,0,'2026-08-18 12:04:36'),(107,4,'Silent Eco-Diesel Generator (10kVA)','silent-eco-diesel-generator-10kva','Soundproof, reliable remote mobile power station designed to provide consistent energy output for lighting, music, and catering.','https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800',1,3,'2026-08-18 12:04:36');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quote_items`
--

DROP TABLE IF EXISTS `quote_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quote_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `quote_request_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL CHECK (`quantity` > 0),
  PRIMARY KEY (`id`),
  KEY `quote_request_id` (`quote_request_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `quote_items_ibfk_1` FOREIGN KEY (`quote_request_id`) REFERENCES `quote_requests` (`id`) ON DELETE CASCADE,
  CONSTRAINT `quote_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quote_items`
--

LOCK TABLES `quote_items` WRITE;
/*!40000 ALTER TABLE `quote_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `quote_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quote_requests`
--

DROP TABLE IF EXISTS `quote_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quote_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `event_date` date NOT NULL,
  `duration_days` int(11) NOT NULL DEFAULT 1,
  `delivery_type` varchar(20) DEFAULT NULL CHECK (`delivery_type` in ('Self Pickup','Delivery Required')),
  `delivery_address` text DEFAULT NULL,
  `special_notes` text DEFAULT NULL,
  `status` varchar(20) DEFAULT 'Pending' CHECK (`status` in ('Pending','Reviewed','Approved','Cancelled')),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quote_requests`
--

LOCK TABLES `quote_requests` WRITE;
/*!40000 ALTER TABLE `quote_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `quote_requests` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-21  1:53:52
