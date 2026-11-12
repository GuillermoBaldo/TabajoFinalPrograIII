-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-11-2026 a las 02:22:22
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tpintegrador_tiendaderopa`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) DEFAULT NULL,
  `imagen` varchar(3000) DEFAULT NULL,
  `categoria` varchar(50) DEFAULT NULL,
  `precio` float DEFAULT NULL,
  `activo` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `ventas`
-- --------------------------------------------------------
CREATE TABLE `ventas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `precio_total` decimal(10,2) NOT NULL,
  `user_name` varchar(240) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `usuarios`
-- --------------------------------------------------------
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `contrasenia` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Estructura de tabla para la tabla `productos_ventas`
-- --------------------------------------------------------
CREATE TABLE `productos_ventas` (
  `id_producto` int(11) NOT NULL,
  `id_venta` int NOT NULL,
  KEY `id_producto` (`id_producto`),
  KEY `id_venta` (`id_venta`),
  CONSTRAINT `productos_ventas_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `productos_ventas_ibfk_2` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Volcado de datos para la tabla `productos`
-- --------------------------------------------------------
INSERT INTO `productos` (`id`, `nombre`, `imagen`, `categoria`, `precio`, `activo`) VALUES
(1, 'remera azul', 'https://acdn-us.mitiendanube.com/stores/001/642/173/products/remera-francia-lisa-33d34632687a29608417612242543938-1024-1024.webp?_gl=1*1dk21ym*_ga*NTA4NTM3MTgwLjE3OTQ1MDc5OTI.*_ga_3C9NRTWBCG*czE3OTQ1MDc5OTEkbzEkZzAkdDE3OTQ1MDc5OTEkajYwJGwwJGgw', 'verano', 300, 1),
(2, 'remera roja', 'https://acdn-us.mitiendanube.com/stores/001/127/623/products/img-web-2024-10-19t161936-165-5bea4ea94fad5f52be17293660301187-1024-1024.webp', 'verano', 200, 1),
(3, 'remera amarilla', 'https://acdn-us.mitiendanube.com/stores/005/437/101/products/chatgpt-image-24-oct-2025-02_01_16-p-m-e025e77a1c232651d317613252894580-1024-1024.webp', 'verano', 400, 1),
(4, 'buzo blanco', 'https://acdn-us.mitiendanube.com/stores/001/490/827/products/1-e6669a78b1f8a8c56917532930218694-1024-1024.webp?_gl=1*zbhvcb*_ga*NjI2OTEwNTQ4LjE3OTQ1MTU2NjU.*_ga_4NBLCEBJ28*czE3OTQ1MTU2NjQkbzEkZzAkdDE3OTQ1MTU2NjQkajYwJGwwJGgw*_gcl_au*OTU1NzQ3NTg2LjE3OTQ1MTU2NjU.', 'invierno', 500, 1),
(5, 'bufanda negra', 'https://www.modax.com.ar/media/catalog/product/cache/98762529506172252d110aea0651f54c/1/9/19597.jpg', 'invierno', 100, 1),
(6, 'campera negra', 'https://acdn-us.mitiendanube.com/stores/807/624/products/black-1-e9657b773ac40c5cf717748461761529-1024-1024.webp', 'invierno', 2000, 1),
(7, 'jogging gris', 'https://dcdn-us.mitiendanube.com/stores/982/451/products/1-78261d88b322cec3ac17835240489473-1024-1024.webp', 'invierno', 1500, 1),
(8, 'sweater blanco', 'https://arandu.com.ar/producto/23585-sweater-hombre-lana-virgen-con-botones-color-natural/', 'invierno', 800, 1),
(9, 'bermuda negra', 'https://askdenim.com.ar/wp-content/uploads/2026/04/IMG_1196.jpeg', 'verano', 1100, 1),
(10, 'bermuda azul', 'https://acdn-us.mitiendanube.com/stores/001/702/486/products/bj32102v-11-20b3326d2e857a2beb16722394458013-1024-1024.webp', 'verano', 1000, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
