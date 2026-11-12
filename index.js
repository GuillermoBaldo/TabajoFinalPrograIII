import express from "express";
import cors from "cors";

import enviroment from "./src/api/config/enviroment.js";
import connection from "./src/api/database/db.js";

const app = express();
const PORT = 4000;
/*=================
    Middlewares
=================*/
app.use(cors()); // Middleware CORS basico para permitir todas las solicitudes

app.use(express.json()); // Middleware para parsear el JSON recibido en el cuerpo de las solicitudes POST y PUT

// Middleware logger para analizar las solicitudes por la consola
app.use((req, res, next) => {
    const fecha = new Date();
    console.log(`[${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}] ${req.method} ${req.url}`);
    next(); // Pasa al siguiente middleware (si lo hay) o a la respuesta
});

// Middleware (de ruta) para filtrar ids no validos
const validateId = (req, res, next) => {

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "El id debe ser un numero entero positivo"
        });
    }

    req.id = id;
    next(); // Damos paso al siguiente middleware o a la response
}

// Middleware (de ruta) para validar la informacion de los formularios
const validateProduct = (req, res, next) => {

    const categoriasValidas = ["verano", "invierno"];
    const errores = [];

    const {nombre, imagen, precio, categoria} = req.body;

    // Verificamos que mandamos todos los campos
    if (!nombre || !imagen || !precio || !categoria) {
        errores.push("Faltan campos requeridos");
    }

    // Verificamos el campo nombre
    if (typeof nombre !== "string" || nombre.trim().length < 2) {
        errores.push("El nombre debe tener al menos 2 caracteres");
    }

    // Verificamos el campo precio
    if (typeof precio !== "number" || precio <= 0) {
        errores.push("El precio debe ser un numero mayor a 0");
    }

    // No validaremos imagen porque luego usaremos Multer

    // Verificaremos el campo categoria
    if(!categoriasValidas.includes(categoria)) {
        errores.push("Categoria invalida");
    }

    // Si hay algun error en la lista, directamente devolvemos un 400
    if (errores.length > 0) {
        return res.status(400).json({
            message: "Datos invalidos",
            listaErrores: errores
        });
    }

    next(); // Damos paso al siguiente middleware o a la response
}




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

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

