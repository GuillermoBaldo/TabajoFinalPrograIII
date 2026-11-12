
/*============================
    Modelos producto
============================*/

import connection from "../database/db.js"; // Importo la conexion a la BBDD


////////////////////////////////
// Seleccionar todos los productos
const selectAllProducts = () => {

    const sql = "SELECT id, nombre, precio, imagen, activo FROM productos";

    return connection.query(sql);
}


////////////////////////////////
// Seleccionar producto por ID
const selectProductById = (id) => {

    const sql = "SELECT id, nombre, precio, imagen, activo FROM productos WHERE id = ?";

    return connection.query(sql, [id]);
}


////////////////////////////////
// Crear producto
const insertNewProduct = (nombre, imagen, categoria, precio) => {

    const sql = "INSERT INTO productos (nombre, imagen, categoria, precio) VALUES (?, ?, ?, ?)";

    return connection.query(sql, [nombre, imagen, categoria, precio]);
}


////////////////////////////////
// Actualizar producto
const updateProduct = (nombre, imagen, precio, categoria, activo, id) => {

    const sql = "UPDATE productos SET nombre = ?, imagen = ?, precio = ?, categoria = ?, activo = ? WHERE id = ?";

    return connection.query(sql, [nombre, imagen, precio, categoria, activo, id]);
}


////////////////////////////////
// Eliminar producto
const deleteProduct = (id) => {

    const sql = "DELETE FROM productos WHERE id = ?";

    return connection.query(sql, [id]);
}


export default {
    selectAllProducts,
    selectProductById,
    insertNewProduct,
    updateProduct,
    deleteProduct
}
