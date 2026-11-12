console.log("hola desde js")

const contenedorProductos = document.getElementById("contenedor-productos");
const urlBase = "http://localhost:4000";


async function obtenerProductos() {
    try {
        const response = await fetch(`${urlBase}/api/products`);
        console.log(response);

        const data = await response.json();

        // En data tenemos payload: arrayDeObjetos
        const productos = data.payload;
        console.table(productos);

        renderizarProductos(productos);

    } catch (error) {
        console.error("Error al hacer la solicitud: ", error);
    }
}

function mostrarMensaje(message) {
    contenedorProductos.innerHTML = `        
                <p class="mensaje error">${message}</p>
            `;
}

buscador.addEventListener("submit", async event => {
    event.preventDefault(); // Evitamos el envio por defecto del formulario

    // Cuando hay un solo valor en un evento, como el idProd, podemos extraerlo asi
    const idProd = event.target.idProd.value.trim(); // form de evento + id del input + valor del id + trim() limpiar espacios

    // Optimizacion 2: Verificamos si hay un id antes de mandarlo
    if (!idProd) {
        return mostrarMensaje("Ingresa un id valido");
    }


    try {
        const response = await fetch(`${urlBase}/api/products/${idProd}`);
        console.log(response);

        const data = await response.json();

        // Optimizacion 3: Filtramos errores 400 o 500
        if (!response.ok) {
            return mostrarMensaje(data.message);
            // el return hace que esta funcion termine
        }

        // Tomamos el primer (y único) elemento del arreglo
        const producto = data.payload[0];

        // Ahora sí lo envolvemos en un arreglo para el forEach
        renderizarProductos([producto]);

    } catch (error) {
        console.error("Error al hacer la solicitud: ", error);
        mostrarMensaje("Fallo la conexion con el servidor");
    }
});


function renderizarProductos(array) {
    let htmlProducto = "";

    array.forEach(prod => {
        htmlProducto += `
            <div class="carta-producto">
                <img class="card-img" src="${prod.imagen}" alt="${prod.nombre}">
                    <h4>${prod.nombre}</h4>
                    <p>$ ${prod.precio}</p>
                    <button onclick"agregarCarrito">Agregar al carrito</button>
            </div>`
            ;
    });

    contenedorProductos.innerHTML = htmlProducto;
}
obtenerProductos();