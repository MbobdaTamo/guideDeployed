-- Adminer 4.8.0 MySQL 5.5.5-10.3.27-MariaDB-0+deb10u1 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `Guide`;
CREATE TABLE `Guide` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) NOT NULL,
  `password` varchar(40) NOT NULL,
  `email` varchar(60) NOT NULL,
  `country` varchar(60) NOT NULL,
  `city` varchar(60) NOT NULL,
  `quater` varchar(60) NOT NULL,
  `wage` int(24) NOT NULL COMMENT 'per hours',
  `contact` int(11) NOT NULL COMMENT 'phone number',
  `type` varchar(30) NOT NULL COMMENT 'Enterprise or person',
  `currency` varchar(20) NOT NULL,
  `description` varchar(200) NOT NULL,
  `imgName` varchar(200) NOT NULL,
  `profilImg0` varchar(200) NOT NULL,
  `profilImg1` varchar(200) NOT NULL,
  `profilImg2` varchar(200) NOT NULL,
  `profilImg3` varchar(200) NOT NULL,
  `idRectoImg` varchar(200) NOT NULL,
  `idVersoImg` varchar(200) NOT NULL,
  `deleted` int(11) NOT NULL DEFAULT 0 COMMENT '0 or 1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `Place`;
CREATE TABLE `Place` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` int(11) NOT NULL COMMENT 'house, hotel,field',
  `rate` int(11) NOT NULL COMMENT 'out of 5',
  `environment` int(11) NOT NULL COMMENT 'rate out of 5',
  `accessibility` int(11) NOT NULL COMMENT 'rate out of 5',
  `price` bigint(20) NOT NULL,
  `numberOfRoom` int(11) NOT NULL,
  `toiletType` int(11) NOT NULL,
  `bathRoomType` int(11) NOT NULL,
  `position` int(11) NOT NULL COMMENT 'rez de chaussez, first level',
  `veranda` int(11) NOT NULL,
  `garden` int(11) NOT NULL,
  `monthlyPrice` int(20) NOT NULL,
  `dailyPrice` int(20) NOT NULL,
  `hourlyPrice` int(20) NOT NULL,
  `superficies` int(20) NOT NULL,
  `description` varchar(350) NOT NULL,
  `imgName` varchar(200) NOT NULL,
  `img0` varchar(200) NOT NULL,
  `img1` varchar(200) NOT NULL,
  `img2` varchar(200) NOT NULL,
  `img3` varchar(200) NOT NULL,
  `guide` int(11) NOT NULL,
  `deleted` int(11) NOT NULL DEFAULT 0 COMMENT '1 or 0',
  PRIMARY KEY (`id`),
  KEY `guide` (`guide`),
  CONSTRAINT `Place_ibfk_1` FOREIGN KEY (`guide`) REFERENCES `Guide` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(30) NOT NULL,
  `email` varchar(40) NOT NULL,
  `password` varchar(40) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `userReview`;
CREATE TABLE `userReview` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `rate` int(11) NOT NULL COMMENT '0 to 5',
  `liked` int(11) NOT NULL COMMENT '1 or 0 ( yes or no)',
  `problem` varchar(300) NOT NULL,
  `guide` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `guide` (`guide`),
  CONSTRAINT `userReview_ibfk_1` FOREIGN KEY (`guide`) REFERENCES `Guide` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- 2023-04-23 07:10:35
