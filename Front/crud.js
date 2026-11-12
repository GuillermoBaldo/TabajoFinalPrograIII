console.log("crud.js cargado correctamente");

const listadoProductos = document.getElementById("lista-productos");
const buscador = document.getElementById("buscador");
// const urlBase = "http://localhost:4000"; // Ya está declarada en principal.js
const formModificador = document.getElementById("contenedor-form");


let productosGlobales = [];

async function obtenerProductos() {
    try {
        const response = await fetch(`${urlBase}/api/products`);
        const data = await response.json();
        const productos = data.payload;

        productosGlobales = data.payload;

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

        // Tomamos el primer (y único) elemento del arreglo
        const producto = data.payload[0];

        // Ahora sí lo envolvemos en un arreglo para el forEach
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
                    <button class="btn-modificar" onclick="iniciarModificacion(${prod.id})">
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

function iniciarModificacion(id) {
    // Buscamos el producto exacto usando el ID que mandó el botón
    const productoEncontrado = productosGlobales.find(prod => prod.id === id);

    if (!productoEncontrado) {
        return alert("Error: No se encontró el producto.");
    }

    const confirmacion = confirm(`¿Querés actualizar el producto: ${productoEncontrado.nombre}?`);

    if (!confirmacion) {
        alert("Modificacion cancelada");
    } else {
        // Le pasamos el objeto completo al formulario
        renderizarFormModificar(productoEncontrado);
    }
}

function renderizarFormModificar(producto) {
    let htmlForm = `
                <h4>Actualizar producto</h4>

                <form id="updateProductForm">

                    <input type="hidden" name="id" value="${producto.id}">

                    <label for="categoriaProd">Categoria</label>
                    <select name="categoria" id="categoriaProd" required>
                        <option value="invierno">Invierno</option>
                        <option value="verano">Verano</option>
                    </select>

                    <label for="imagenProd">Imagen</label>
                    <input type="text" name="imagen" id="imagenProd" value="${producto.imagen}" required>

                    <label for="nombreProd">Nombre</label>
                    <input type="text" name="nombre" id="nombreProd" value="${producto.nombre}" required>

                    <label for="precioProd">Precio</label>
                    <input type="number" name="precio" id="precioProd" min="1" value="${producto.precio}" required>

                    <label for="activoProd">Activo</label>
                    <select name="activo" id="activoProd" required>
                        <option value="1">Activo</option>
                        <option value="0">Inactivo</option>
                    </select>

                    <input type="submit" value="Actualizar producto">

                </form>
            `;

    formModificador.innerHTML = htmlForm;

    const updateProductForm = document.getElementById("updateProductForm");

    updateProductForm.addEventListener("submit", event => {
        actualizarProducto(event);
    });
}

async function actualizarProducto(event) {
    event.preventDefault(); // Evitamos el envio por defecto del formulario

    const formData = new FormData(event.target);
    const formObj = Object.fromEntries(formData.entries());

    // Optimizacion 5: Cambiamos algunos datos del formulario
    formObj.id = Number(formObj.id);           // FALTABA ESTO
    formObj.activo = Number(formObj.activo);   // FALTABA ESTO
    formObj.precio = Number(formObj.precio);
    formObj.nombre = formObj.nombre.trim();
    formObj.categoria = formObj.categoria.trim();
    console.log(formObj);

    const errores = validarFormulario(formObj);
    console.log(errores);

    if (errores.length > 0) {
        return mostrarListaErrores(errores);
    }

    console.table(formObj);

    try {
        const response = await fetch(`${urlBase}/api/products`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formObj)
        });

        console.log(response);

        const data = await response.json();

        if (!response.ok) {
            console.error(data.message);
            return mostrarMensaje("error", data.message);
        }

        console.log(data.message);

        // Ocultamos el formulario al terminar
        formModificador.innerHTML = "";
        mostrarMensaje("exito", data.message);
        setTimeout(obtenerProductos, 1500);

    } catch (error) {
        console.error("Error al enviar los datos:", error);
        mostrarMensaje("error", "Error al enviar la informacion");
    }
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

    if (!data.nombre || !data.imagen || !data.precio || !data.categoria) {
        errores.push("Faltan campos requeridos");
    }

    if (!data.nombre || data.nombre.trim().length < 2) {
        errores.push("El nombre debe tener al menos 2 caracteres");
    }

    if (!data.imagen) {
        errores.push("Debe incluirse una imagen");
    }

    if (typeof data.precio !== "number" || data.precio <= 0) {
        errores.push("El precio debe ser mayor a 0");
    }

    if (!data.categoria) {
        errores.push("Debe seleccionar una categoría");
    }

    return errores;
}
