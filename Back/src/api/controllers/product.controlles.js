/*============================
    Controladores producto
============================*/

// Importamos todos los metodos del modelo con el nombre ProductModels
import ProductModels from "../models/product.models.js";


/////////////////////////
// GET all products
export const getAllProducts = async (req, res) => {

    // Optimizacion 1: Manejo de errores con try catch
    try {

        // El controlador llama al modelo y espera a que la promesa se resuelva
        const [rows, tables] = await ProductModels.selectAllProducts();


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
}



/////////////////////////
// GET product by id
export const getProductById = async (req, res) => {

    // Optimizacion 2: Manejo de errores con try catch
    try {

        // Este controlador llama al modelo y le pasa el id, para que el modelo haga la consulta pasandole el parametro que le envio el controlador
        const [rows] = await ProductModels.selectProductById(req.id);

        // Optimizacion 5: Devolvemos un codigo 404 para producto no encontrado
        if (rows.length === 0) {
            return res.status(404).json({
                message: `No se encontro producto con id: ${req.id}`
            });
        }

        res.status(200).json({
            payload: rows
        });

    } catch (error) {
        console.log("Error obteniendo productos por id: ", error);

        // Optimizacion 3: Error 500 si fallo la conexion a la BBDD
        res.status(500).json({
            message: "Error interno del servidor"
        });
    }
}



/////////////////////////
// POST product
export const createProduct = async (req, res) => {

    // Optimización 2: Manejo de errores con try catch
    try {
        // Hacemos el destructuring de un objeto que parseamos previamente a traves del middleware express.json()
        const { categoria, imagen, nombre, precio } = req.body;
    
        const [rows] = await ProductModels.insertNewProduct(nombre, imagen, categoria, precio);

        console.log(rows);

        res.status(201).json({
            message: "Producto creado exitosamente",
            productId: rows.insertId // Optimización 4: Le pasamos el nuevo id del prod
        });

    } catch (error) {
        console.log("Error creando un producto: ", error);

        // Optimización 3: Error 500 si falló la conexión a la BBDD
        res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};



/////////////////////////
// PUT product
export const modifyProduct = async (req, res) => {

    // Optimización 2: Manejo de errores con try catch
    try {
        // Desestructuramos los campos en español (con activo = 1 por defecto si no viene)
        const { categoria, imagen, nombre, precio, activo = 1, id } = req.body;
    
        // Mantenemos el orden exacto de argumentos: (nombre, imagen, precio, categoria, activo, id)
        const [result] = await ProductModels.updateProduct(nombre, imagen, precio, categoria, activo, id);

        console.log(result);

        if (result.changedRows === 0) {
            return res.status(404).json({
                message: "No se actualizó el producto o no hubo cambios"
            });
        }
        
        return res.status(200).json({
            message: "Producto actualizado correctamente"
        });

    } catch (error) {
        console.log("Error actualizando un producto: ", error);

        // Optimización 3: Error 500 si falló la conexión a la BBDD
        res.status(500).json({
            message: "Error interno del servidor"
        });
    }
};

/////////////////////////
// DELETE product
export const removeProduct = async (req, res) => {
    
    // Optimizacion 2: Manejo de errores con try catch
    try {
        
    
        await ProductModels.deleteProduct(req.id);
    
        res.status(200).json({
            message: `Producto con id ${req.id} eliminado exitosamente`
        });


    } catch (error) {
        console.log("Error eliminando producto: ", error);

        // Optimizacion 3: Error 500 si fallo la conexion a la BBDD
        res.status(500).json({
            message: "Error interno del servidor"
        });
    }
}