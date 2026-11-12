import express from "express";
import cors from "cors";

import enviroment from "./src/api/config/enviroment.js";
import connection from "./src/api/database/db.js";
import { loggerUrl, validateId } from "./src/api/middlewares/middlewares.js";

const app = express();
const PORT = 4000;
/*=================
    Middlewares
=================*/
app.use(cors()); // Middleware CORS basico para permitir todas las solicitudes

app.use(express.json()); // Middleware para parsear el JSON recibido en el cuerpo de las solicitudes POST y PUT

// Middleware logger para analizar las solicitudes por la consola
app.use(loggerUrl)




app.get('/', (req, res) => {
    res.send('¡Servidor Express funcionando correctamente!');
});


// GET all products
app.get("/api/products", async (req, res) => {

    // Optimizacion 1: Manejo de errores con try catch
    try {

        // Optimizacion 2: No seleccionar todo, solo traer las columnas necesarias (mas eficiente en memoria, en red)
        const sql = "SELECT id, nombre, precio, imagen, activo FROM productos";
        const [rows, tables] = await connection.query(sql);

        // Optimizacion 3: Respuesta mas limpia con codigo semantico
        if (rows.length === 0) {
            return res.status(404).json({
                message: "No se encontraron productos"
            });
        }

        res.status(200).json({
            payload: rows
        });

    } catch (error) {
        console.log("Error obteniendo productos: ", error);

        // Optimizacion 4: Error 500 si fallo la conexion a la BBDD
        res.status(500).json({
            message: "Error interno del servidor"
        });
    }
});


// GET product by id
app.get("/api/products/:id", validateId, async (req, res) => {
    // Usamos req.id que ya fue parseado y validado como entero por validateId
    const id = req.id;

    try {
        // Usamos el signo ? como placeholder en lugar de interpolar ${id}
        const sql = `SELECT id, nombre, precio, imagen, activo FROM productos WHERE id = ${id}`;

        const [rows] = await connection.query(sql);

        if (rows.length === 0) {
            return res.status(404).json({
                message: `No se encontró producto con id: ${id}`
            });
        }

        res.status(200).json({
            payload: rows[0] // Opcional: devolver solo el objeto del producto si es por ID
        });

    } catch (error) {
        console.log("Error obteniendo productos por id: ", error);

        res.status(500).json({
            message: "Error interno del servidor"
        });
    }
});

app.delete("/api/products/:id", validateId, async (req, res) => {
    // Usamos req.id que ya fue parseado y validado como entero por validateId
    const id = req.id;

    try {
        // Acá sí usamos el signo ? como placeholder para evitar inyección SQL
        const sql = "DELETE FROM productos WHERE id = ?";

        // Pasamos el id como segundo parámetro en un arreglo
        const [result] = await connection.query(sql, [id]);

        // affectedRows nos dice cuántas filas fueron eliminadas
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: `No se encontró producto con id: ${id} para eliminar`
            });
        }

        res.status(200).json({
            message: `Producto con id: ${id} eliminado exitosamente`
        });

    } catch (error) {
        console.log("Error eliminando producto por id: ", error);

        res.status(500).json({
            message: "Error interno del servidor"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

