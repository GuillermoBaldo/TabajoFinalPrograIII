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
        <div class="tabla-contenedor">
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
                <td>
                    <img class="card-img" src="${prod.imagen}" alt="${prod.nombre}">
                </td>
                <td>${prod.id}</td>
                <td class="nombre-producto">${prod.nombre}</td>
                <td class="precio-producto">$ ${prod.precio}</td>
                <td class="acciones">
                    <button class="btn-modificar" onclick="modificarProducto(${prod.id})">
                        Modificar
                    </button>
                    <button class="btn-eliminar" onclick="eliminarProducto(${prod.id})">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    });

    htmlTabla += `
                </tbody>
            </table>
        </div>
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

// NUEVO
// MODAL CREAR PRODUCTO
const modal = document.getElementById("modal-crear");
const btnCrear = document.getElementById("btn-crear");
const btnCerrar = document.getElementById("cerrar-modal");
const formCrear = document.getElementById("form-crear");

// ABRIR MODAL
btnCrear.addEventListener("click", () => {
    modal.style.display = "flex";
});

// CERRAR MODAL
btnCerrar.addEventListener("click", () => {
    modal.style.display = "none";
});


// CREAR PRODUCTO
formCrear.addEventListener("submit", async event => {

    event.preventDefault();

    // Obtenemos los datos del formulario
    const formData = new FormData(event.target);

    // Convertimos FormData en objeto
    const formObj = Object.fromEntries(formData.entries());

    // Convertimos los datos
    formObj.price = Number(formObj.price);
    formObj.name = formObj.name.trim();

    // Validamos los datos
    const errores = validarFormulario(formObj);

    if (errores.length > 0) {
        alert(errores.join("\n"));
        return;
    }

    try {

        const response = await fetch(`${urlBase}/api/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formObj)
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message);
            return;
        }

        alert("Producto creado correctamente");

        formCrear.reset();
        modal.style.display = "none";

        obtenerProductos();

    } catch (error) {
        console.error("Error al crear producto:", error);
        alert("Error al enviar la información");
    }
});

function validarFormulario(data) {

    const errores = [];

    if (!data.name || !data.image || !data.price || !data.category) {
        errores.push("Faltan campos requeridos");
    }

    if (!data.name || data.name.trim().length < 2) {
        errores.push("El nombre debe tener al menos 2 caracteres");
    }

    if (!data.image) {
        errores.push("Debe incluirse una imagen");
    }

    if (typeof data.price !== "number" || data.price <= 0) {
        errores.push("El precio debe ser mayor a 0");
    }

    if (!data.category) {
        errores.push("Debe seleccionar una categoría");
    }

    return errores;
}
