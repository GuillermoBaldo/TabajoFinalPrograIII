import express from "express";
import cors from "cors";

import enviroment from "./src/api/config/enviroment.js";
import connection from "./src/api/database/db.js";

const app = express();
const PORT = 4000;

// Middleware para permitir peticiones CORS (muy recomendado) hola
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('¡Servidor Express funcionando correctamente!');
});

app.get("/api/products", async (req, res) => {
    try {
        const sql = "SELECT * FROM productos";
        const [rows] = await connection.query(sql);
        console.log(rows);
        
        res.status(200).json({
            payload: rows
        });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});