const categorias = {
    smartphones: [
        { id: 1, nombre: "iPhone 14", precio: 1200 },
        { id: 2, nombre: "Samsung Galaxy S22", precio: 1000 },
    ],
    laptops: [
        { id: 1, nombre: "MacBook Air M1", precio: 1500 },
        { id: 2, nombre: "Dell XPS 13", precio: 1400 },
    ],
    accesorios: [
        { id: 1, nombre: "Auriculares Bose", precio: 300 },
        { id: 2, nombre: "Cargador Rápido", precio: 50 },
    ],
    tablets: [
        { id: 1, nombre: "iPad Pro", precio: 1100 },
        { id: 2, nombre: "Samsung Galaxy Tab", precio: 900 },
    ],
};


let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let sesionActiva = localStorage.getItem("sesionActiva") === "true";


function calcularTotal(precio, cantidad, impuesto = 0.21) {
    return precio * cantidad * (1 + impuesto);
}


function mostrarProductos(categoria, productos) {
    let mensaje = `Ingrese el número del producto que desea comprar, RET para volver al menú anterior o ESC para salir.\n\nProductos en la categoría ${categoria} (precios sin impuestos):\n\n`;
    productos.forEach(producto => {
        mensaje += `${producto.id}) ${producto.nombre} - $${producto.precio}\n`;
    });
    return mensaje;
}


function solicitarCantidad(producto) {
    while (true) {
        const cantidad = prompt(`Ingrese la cantidad de unidades de "${producto.nombre}" que desea comprar, RET para volver al menú anterior o ESC para salir`);

        switch (true) {
            case cantidad === null: 
            case cantidad.toUpperCase() === "ESC":
                return "ESC";

            case cantidad.toUpperCase() === "RET": 
                return "RET";

            case !isNaN(cantidad) && parseInt(cantidad) > 0: 
                return parseInt(cantidad);

            default: 
                alert("Por favor, ingrese una cantidad válida.");
        }
    }
}



function verCarrito() {
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
    } else {
        let mensaje = "Carrito de compras (precios con impuestos incluidos):\n\n";
        let totalGeneral = 0;
        carrito.forEach(item => {
            const totalProducto = calcularTotal(item.producto.precio, item.cantidad);
            mensaje += `${item.cantidad} x ${item.producto.nombre} - Total: $${totalProducto.toFixed(2)}\n`;
            totalGeneral += totalProducto;
        });
        mensaje += `\nTotal general: $${totalGeneral.toFixed(2)}`;
        alert(mensaje);
    }
}


let continuar = true;  

function eliminarProductoDelCarrito() {
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    while (true) {
        let mensaje = "Carrito de compras (precios con impuestos incluidos):\n\nIngrese el número del producto a eliminar, 'VAC' para vaciar el carrito, RET para volver al menú anterior, o ESC para salir\n\n";
        carrito.forEach((item, index) => {
            mensaje += `${index + 1}) ${item.cantidad} x ${item.producto.nombre} - Total: $${calcularTotal(item.producto.precio, item.cantidad).toFixed(2)}\n`;
        });

        const opcion = prompt(mensaje);

        switch (true) {
            case opcion === null: 
            case opcion?.toUpperCase() === "ESC":
                alert("Gracias por usar nuestro sistema de compras.");
                continuar = false;
                return;

            case opcion?.toUpperCase() === "RET": 
                return;

            case opcion?.toUpperCase() === "VAC":
                carrito = [];
                localStorage.setItem("carrito", JSON.stringify(carrito));
                alert("Se vació el carrito.");
                return;

            default: 
                const indexProducto = parseInt(opcion) - 1;

                switch (true) {
                    case isNaN(indexProducto) || indexProducto < 0 || indexProducto >= carrito.length:
                        alert("La opción ingresada no es válida. Por favor intente nuevamente.");
                        break;

                    default:
                        const item = carrito[indexProducto];

                        while (true) {
                            const cantidadAEliminar = prompt(`El producto seleccionado es "${item.producto.nombre}".\nActualmente tienes ${item.cantidad} unidad(es).\nIngrese la cantidad de unidades que desea eliminar, RET para volver al menú anterior o ESC para salir.`);

                            switch (true) {
                                case cantidadAEliminar === null: 
                                case cantidadAEliminar?.toUpperCase() === "ESC":
                                    alert("Gracias por usar nuestro sistema de compras.");
                                    continuar = false;
                                    return;

                                case cantidadAEliminar?.toUpperCase() === "RET": 
                                    break;

                                case !isNaN(cantidadAEliminar) && parseInt(cantidadAEliminar) > 0: 
                                    const cantidad = parseInt(cantidadAEliminar);
                                    if (cantidad >= item.cantidad) {
                                        carrito.splice(indexProducto, 1);
                                        alert(`${item.producto.nombre} se eliminó del carrito.`);
                                    } else {
                                        item.cantidad -= cantidad;
                                        alert(`Se eliminaron ${cantidad} unidad(es) de "${item.producto.nombre}". Quedan ${item.cantidad} unidad(es).`);
                                    }
                                    localStorage.setItem("carrito", JSON.stringify(carrito));
                                    return;

                                default:
                                    alert("Por favor, ingrese una cantidad válida.");
                            }
                            if (cantidadAEliminar?.toUpperCase() === "RET") break;

                        }
                }
        }
    }
}




function seleccionarCategoria() {
    while (true) {
        const categoria = prompt(
            "Seleccione una categoría, ingrese RET para volver al menú anterior o ESC para salir:\n\n1) Smartphones\n2) Laptops\n3) Accesorios\n4) Tablets"
        );

        if (categoria === null || categoria.toUpperCase() === "ESC") {
           return "ESC";
        }

        switch (categoria.toUpperCase()) {
            case "RET":
                return "RET"; 
            case "1":
                return { nombre: "Smartphones", productos: categorias.smartphones };
            case "2":
                return { nombre: "Laptops", productos: categorias.laptops };
            case "3":
                return { nombre: "Accesorios", productos: categorias.accesorios };
            case "4":
                return { nombre: "Tablets", productos: categorias.tablets };
            default:
                alert("La opción ingresada no es válida. Por favor intente nuevamente.");
        }
    }
}


function agregarAlCarrito(nombreCategoria, productoSeleccionado, cantidad) {
    const identificadorProducto = `${nombreCategoria}-${productoSeleccionado.id}`;
    const itemExistente = carrito.find(item => item.identificador === identificadorProducto);

    if (itemExistente) {
        itemExistente.cantidad += cantidad;
        alert(`Se agregaron ${cantidad} unidad(es) adicionales de "${productoSeleccionado.nombre}" al carrito.`);
    } else {
        carrito.push({
            identificador: identificadorProducto,
            producto: productoSeleccionado,
            categoria: nombreCategoria,
            cantidad: cantidad
        });
        alert(`Se agregó ${cantidad} unidad(es) de "${productoSeleccionado.nombre}" al carrito.`);
    }
}


function menuSeleccion() {
    while (continuar) {
        const opcionPrincipal = prompt(
            "Bienvenido a TecStore\nSeleccione una opción o ingrese ESC para salir:\n\n1) Comprar\n2) Ver carrito de compras\n3) Eliminar productos del carrito"
        );

        switch (true) {
            case opcionPrincipal === null:
            case opcionPrincipal?.toUpperCase() === "ESC":
                alert("Gracias por usar nuestro sistema de compras.");
                continuar = false;
                break;

            case opcionPrincipal === "1": 
                let salirDeCompra = false;

                while (!salirDeCompra) {
                    const seleccion = seleccionarCategoria();

                    switch (true) {
                        case seleccion === "ESC":
                            alert("Gracias por usar nuestro sistema de compras.");
                            continuar = false;
                            salirDeCompra = true; 
                            break;

                        case seleccion === "RET": 
                            salirDeCompra = true; 
                            break;

                        default: {
                            const { nombre, productos } = seleccion;
                            let volver = false;

                            while (!volver) {
                                const mensaje = mostrarProductos(nombre, productos);
                                const idProductoSeleccionado = prompt(mensaje);

                                switch (true) {
                                    case idProductoSeleccionado === null:
                                    case idProductoSeleccionado?.toUpperCase() === "ESC":
                                        alert("Gracias por usar nuestro sistema de compras.");
                                        continuar = false;
                                        volver = true;
                                        salirDeCompra = true; 
                                        break;

                                    case idProductoSeleccionado?.toUpperCase() === "RET": 
                                        volver = true; 
                                        break;

                                    default: {
                                        const productoSeleccionado = productos.find(
                                            (p) => p.id === parseInt(idProductoSeleccionado)
                                        );

                                        switch (true) {
                                            case !productoSeleccionado: 
                                                alert("La opción ingresada no es válida. Por favor intente nuevamente.");
                                                break;

                                            default: {
                                                const cantidad = solicitarCantidad(productoSeleccionado);

                                                switch (cantidad) {
                                                    case "RET":
                                                        break;

                                                    case "ESC": 
                                                        alert("Gracias por usar nuestro sistema de compras.");
                                                        continuar = false;
                                                        volver = true;
                                                        salirDeCompra = true;
                                                        break;

                                                    default: 
                                                        agregarAlCarrito(nombre, productoSeleccionado, cantidad);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                break;

            case opcionPrincipal === "2": 
                verCarrito();
                break;

            case opcionPrincipal === "3": 
                eliminarProductoDelCarrito();
                break;

            default: 
                alert("La opción ingresada no es válida. Por favor intente nuevamente.");
        }
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));

    if (sesionActiva) {
        alert("Gracias por usar nuestro sistema de compras.");
    }
}



menuSeleccion();