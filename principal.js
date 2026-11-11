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


function renderizarProductos(array) {
    let htmlProducto = "";

    array.forEach(prod => {
        htmlProducto +=`
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