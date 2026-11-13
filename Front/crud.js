console.log("crud.js cargado correctamente");

const listadoProductos = document.getElementById("lista-productos");
const buscador = document.getElementById("buscador");

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


//Modificacion
const modalModificar = document.getElementById("modal-modificar");
const formModificarContent = document.getElementById("form-modificar");

function iniciarModificacion(id) {
    const productoEncontrado = productosGlobales.find(prod => prod.id === id);

    if (!productoEncontrado) {
        return alert("Error: No se encontró el producto.");
    }
    renderizarFormModificar(productoEncontrado);
    // Mostramos el modal
    modalModificar.style.display = "flex";
}

function renderizarFormModificar(producto) {
    // Inyectamos los inputs y botones dentro del formulario del modal
    formModificarContent.innerHTML = `
        <input type="hidden" name="id" value="${producto.id}">

        <label for="categoriaProd">Categoria</label>
        <select name="categoria" id="categoriaProd" required>
            <option value="invierno" ${producto.categoria === 'invierno' ? 'selected' : ''}>Invierno</option>
            <option value="verano" ${producto.categoria === 'verano' ? 'selected' : ''}>Verano</option>
        </select>

        <label for="imagenProd">Imagen</label>
        <input type="text" name="imagen" id="imagenProd" value="${producto.imagen}" required>

        <label for="nombreProd">Nombre</label>
        <input type="text" name="nombre" id="nombreProd" value="${producto.nombre}" required>

        <label for="precioProd">Precio</label>
        <input type="number" name="precio" id="precioProd" min="1" value="${producto.precio}" required>

        <label for="activoProd">Activo</label>
        <select name="activo" id="activoProd" required>
            <option value="1" ${String(producto.activo) === '1' ? 'selected' : ''}>Activo</option>
            <option value="0" ${String(producto.activo) === '0' ? 'selected' : ''}>Inactivo</option>
        </select>

        <div class="botones-modal">
            <button type="submit">Actualizar producto</button>
            <button type="button" id="cerrar-modal-modificar">Cancelar</button>
        </div>
    `;

    // Lógica para cerrar el modal con el botón "Cancelar"
    document.getElementById("cerrar-modal-modificar").addEventListener("click", () => {
        modalModificar.style.display = "none";
    });
}

// CERRAR MODAL (si hacés clic afuera del cuadro)
modalModificar.addEventListener("click", event => {
    if (event.target === modalModificar) {
        modalModificar.style.display = "none";
    }
});

// ACTUALIZAR PRODUCTO (PUT) - Evento asignado al form del modal
formModificarContent.addEventListener("submit", async event => {
    event.preventDefault(); 

    const formData = new FormData(event.target);
    const formObj = Object.fromEntries(formData.entries());

    // Optimizacion 5: Cambiamos algunos datos del formulario
    formObj.id = Number(formObj.id);
    formObj.activo = Number(formObj.activo);
    formObj.precio = Number(formObj.precio);
    formObj.nombre = formObj.nombre.trim();
    formObj.categoria = formObj.categoria.trim();
    
    // NOTA: Recuerda validar los datos (validarFormulario) si es necesario

    try {
        const response = await fetch(`${urlBase}/api/products`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formObj)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(data.message);
            modalModificar.style.display = "none";
            return mostrarMensaje("error", data.message);
        }

        // Ocultamos el modal al terminar exitosamente
        modalModificar.style.display = "none";
        mostrarMensaje("exito", data.message);
        setTimeout(obtenerProductos, 1500);

    } catch (error) {
        console.error("Error al enviar los datos:", error);
        modalModificar.style.display = "none";
        mostrarMensaje("error", "Error al enviar la informacion");
    }
});

obtenerProductos();

//CREACION
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

// CERRAR MODAL (con el botón Cancelar)
btnCerrar.addEventListener("click", () => {
    formCrear.reset();
    modal.style.display = "none";
});

// CERRAR MODAL (si hacés clic afuera del cuadro)
modal.addEventListener("click", event => {
    if (event.target === modal) {
        formCrear.reset();
        modal.style.display = "none";
    }
});

// CREAR PRODUCTO (POST)
formCrear.addEventListener("submit", async event => {

    event.preventDefault(); // Evitamos el envío por defecto del <form>

    // Obtenemos la data del formulario
    const formData = new FormData(event.target);
    console.log(formData);

    // Transformamos este objeto nativo del <form> en un objeto literal JS
    const formObj = Object.fromEntries(formData.entries());

    // Optimización 3: Cambiamos algunos datos del formulario
    formObj.precio = Number(formObj.precio); // Convertimos el precio en un número para poder validarlo como tal
    formObj.nombre = formObj.nombre.trim();
    formObj.imagen = formObj.imagen.trim();
    console.log(formObj);

    // El objeto con la info del formulario se lo pasamos a la función para validar los campos
    const errores = validarFormulario(formObj);

    console.log(errores);

    // Si hay errores, mostramos mensaje de error y terminamos acá, no hacemos la petición
    if (errores.length > 0) {
        return mostrarListaErrores(errores);
    }

    try {
        const response = await fetch(`${urlBase}/api/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formObj)
        });

        // Mostramos por consola la respuesta cruda del servidor
        console.log(response);

        // Parseamos el JSON del body de la response para poder acceder al valor de message
        const data = await response.json();

        // Optimización 4: Filtramos errores 400 o 500
        if (!response.ok) {
            modal.style.display = "none";
            return mostrarMensaje("error", data.message);
        }

        let mensajeExito = `${data.message} con id ${data.productId}`;
        
        formCrear.reset();
        modal.style.display = "none";
        mostrarMensaje("exito", mensajeExito); // Producto creado exitosamente con su ID
        setTimeout(obtenerProductos, 1500); // Recargamos la tabla después de mostrar el mensaje

    } catch (error) {
        console.error("Error al hacer la solicitud: ", error);
        modal.style.display = "none";
        mostrarMensaje("error", "Error al enviar la información");
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


//DELETE
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