console.log("crud.js cargado correctamente");

const listadoProductos = document.getElementById("lista-productos");
const buscador = document.getElementById("buscador");
// const urlBase = "http://localhost:4000"; // Ya está declarada en principal.js

async function obtenerProductos() {
    try {
        const response = await fetch(`${urlBase}/api/products`);
        const data = await response.json();
        const productos = data.payload;

        renderizarProductos(productos);
    } catch (error) {
        console.error("Error al hacer la solicitud: ", error);
        mostrarMensaje("Error al cargar los productos");
    }
}

function mostrarMensaje(message) {
    // Corregido: usar listadoProductos en lugar de contenedorProductos
    listadoProductos.innerHTML = `
        <p class="mensaje error">${message}</p>
    `;
}

buscador.addEventListener("submit", async event => {
    event.preventDefault();

    const idProd = event.target.idProd.value.trim();

    // Si borrás el input y le das a consultar, vuelve a cargar la tabla completa
    if (!idProd) {
        return obtenerProductos();
    }

    try {
        const response = await fetch(`${urlBase}/api/products/${idProd}`);
        const data = await response.json();

        if (!response.ok) {
            return mostrarMensaje(data.message);
        }

        // Corregido: soporta tanto si payload viene como objeto único o como array
        const producto = data.payload;


        // Reemplaza la tabla en pantalla mostrando solo el producto encontrado
        renderizarProductos([producto]);

    } catch (error) {
        console.error("Error al hacer la solicitud: ", error);
        mostrarMensaje("Falló la conexión con el servidor");
    }
});

function renderizarProductos(array) {
    let htmlTabla = `
        <table class="tabla-productos">
            <thead>
                <tr>
                    <th>Imagen</th>
                    <th>ID</th>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Acción</th>
                </tr>
            </thead>
            <tbody>
    `;

    array.forEach(prod => {
        htmlTabla += `
            <tr>
                <td><img class="card-img" src="${prod.imagen}" alt="${prod.nombre}" width="50"></td>
                <td>${prod.id}</td>
                <td>${prod.nombre}</td>
                <td>$ ${prod.precio}</td>
                <td>
                    <button onclick="modificarProducto(${prod.id})">modificar</button>
                    <button onclick="eliminarProducto(${prod.id})">eliminar</button>
                </td>
            </tr>
        `;
    });

    htmlTabla += `
            </tbody>
        </table>
    `;

    listadoProductos.innerHTML = htmlTabla;
}

async function eliminarProducto(id) {

    if (!confirm(`¿Estás seguro de que querés eliminar el producto con ID ${id}?`)) {
        return;
    }
    try {
        const response = await fetch(`${urlBase}/api/products/${id}`, {
            method: "DELETE"
        });

        console.log(response);

        const data = await response.json();


        // Optimizacion 3: Filtramos errores 400 o 500
        if (!response.ok) {
            return mostrarMensaje("error", data.message);
            // el return hace que esta funcion termine
        }

        mostrarMensaje("exito", data.message);
        console.log(data.message);
        setTimeout(obtenerProductos, 1500);

    } catch (error) {
        console.error("Error al eliminar un producto: ", error);
        mostrarMensaje("error", "Error al enviar la informacion");
    }
}

obtenerProductos();