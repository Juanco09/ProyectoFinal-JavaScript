
//variables globales
const contenidoTienda = document.getElementById("contenidoTienda");
const inputBusq = document.getElementById("buscarProd");
const verCarrito = document.getElementById("contenido-carrito");
const carritoVaciar = document.getElementById("espacioVaciar");
const spanNumeroCarrito = document.getElementById("modalBtn");
const modal = document.getElementById("simpleModal");
const modalBtn = document.getElementById("modalBtn");
const closeBtn = document.getElementsByClassName("cerrarModal")[0];
const listaProductos =  "./Data/productos.json";
let carrito = [];
let productosAgregados = localStorage.getItem("productosEnCarrito");
productosAgregados = JSON.parse(productosAgregados);
productosAgregados != null && (carrito = productosAgregados);

//---------------FUNCIONES Y EVENTOS----------------//
//Acceder a los datos de mi archivo .json
fetch(listaProductos)
    .then((response) => response.json())
    .then(datos => {
        datos.forEach((producto)=> {
            contenidoTienda.innerHTML += `
                <div class="image"> 
                    <img src="./imágenes/${producto.id}.jpg">
                        <h2>${producto.nombre}<br>${producto.variedad}</h2>
                        <h3>$${producto.precio}</h3>
                        <button class="agregar ${producto.id}" id="agregar${producto.id}">Agregar al Carrito</button>
                </div>    
            `;
            let productosCarr = document.querySelectorAll(".agregar");
            for (let i=0; i < productosCarr.length; i++) {
                productosCarr[i].addEventListener ("click", () => {
                    agregarAlCarrito(datos[i]);
                    displayCarrito(datos[i]);
                })
            }
        });
    });

//funciones para abrir y cerrar el modal "carrito".
function openModal() {
    modal.style.display = "block";
};
function closeModal() {
    modal.style.display = "none";
};
function outsideClick(e) {
    if (e.target == modal){
        modal.style.display = "none";
    };
};

//Eventos del modal "carrito".
modalBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);
window.addEventListener("click", outsideClick);

//funcion para buscar productos
inputBusq.addEventListener("keyup", buscarProductos);
function buscarProductos () {
    let filtrarValor = inputBusq.value.toUpperCase();
    let producto = document.querySelectorAll(".image");
    for (let i=0; i<producto.length; i++){
        let span = (producto[i].querySelector("h2"));
        if (span.innerHTML.toLocaleUpperCase().indexOf(filtrarValor) > -1){
            producto[i].style.display = "initial";
        }else {
            producto[i].style.display="none";
        }
    }
};

//funcion para agregar productos al array carrito
let agregarAlCarrito = (producto) => { 
    if (!carrito.find(({id}) => id === producto.id)) {
        carrito.push({ id: producto.id, 
            nombre: producto.nombre, 
            variedad: producto.variedad, 
            precio: producto.precio, 
            img: producto.img,
            encarrito: producto.encarrito = 1})
        } else {
            carrito = carrito.map(object => {
                if(object.id === producto.id) {
                    return{...object, encarrito: object.encarrito + 1};
                }
                return object;
            });
        }
        localStorage.setItem("productosEnCarrito", JSON.stringify(carrito));
        let costoCarrito = localStorage.getItem("costoTotal");
        costoCarrito = carrito.reduce((acc, cur) => cur.precio *cur.encarrito + acc, 0);
        localStorage.setItem("costoTotal", costoCarrito);
        openModal();
        numCarrito();
        NumCarritoVisible();
};

//funcion para pintar los productos del carrito y el costo total del mismo
function displayCarrito() {
    let productosAgregados = localStorage.getItem("productosEnCarrito");
    productosAgregados = JSON.parse(productosAgregados);
    let costoCarrito = localStorage.getItem("costoTotal");

    if (productosAgregados && verCarrito && carritoVaciar) {
        verCarrito.innerHTML = '';
        carritoVaciar.innerHTML = '';
        if(costoCarrito != 0) {
            verCarrito.innerHTML += `
            <p>Costo Total: $${costoCarrito}</p>
                <button class="learn-more" id="btnPagar">
                    <span class="circle" aria-hidden="true">
                        <span class="icon arrow"></span>
                    </span>
                    <span class="button-text">¡Ir a Pagar!</span>
                </button>
            `;
            carritoVaciar.innerHTML +=`
                <button class="vaciarCarrito" id="vaciarCarrito">Vaciar Carrito</button>
            `;
        } else {
            verCarrito.innerHTML += `
            <p>¡Tu carrito está vacío!</p>
        `;
        }
        Object.values(productosAgregados).map(item => {
            verCarrito.innerHTML +=
            `<div class="agregado">
                <img src="./imágenes/${item.id}.jpg">
                <div class="datosProducto">
                    <p>${item.nombre}</p>
                    <p>${item.variedad}</p>
                    <p>$${item.precio * item.encarrito}</p>
                    <div class="cantidad"><button class="bajar" id="${item.id}"><</button><p>${item.encarrito}</p><button class="subir" id="${item.id}">></button></div>
                    <button class="quitar" id="${item.id}">Eliminar</button>
                </div>
            </div>
            `;
        //evento para eliminar un producto del Carrito.
        const botonEliminar = document.querySelectorAll(".quitar");
        botonEliminar.forEach(btn => {
            btn.addEventListener("click", () => {
                carrito = carrito.filter(item => item.id != btn.id);
                localStorage.setItem("productosEnCarrito", JSON.stringify(carrito));
                costoTotal();
                numCarrito();
                displayCarrito();
                NumCarritoVisible()    
                });
            });
        //evento para vaciar el Carrito.
        const botonVaciar = document.getElementById("vaciarCarrito");
        botonVaciar.addEventListener("click", () => {
            carrito = [];
            localStorage.setItem("productosEnCarrito", JSON.stringify(carrito));
            costoTotal();
            numCarrito();
            displayCarrito();
            verCarrito.innerHTML = `
            <p>Vaciando el Carrito . . .</p>
            `;
            setTimeout (() => {
                verCarrito.innerHTML = `
                <p>¡Tu carrito está vacío!</p>
                `;}, 2000);
            NumCarritoVisible();
            });
        //EVENTOS PARA MODIFICAR CANTIDAD DE CADA PRODUCTO
        let botonBajar = document.querySelectorAll(".bajar");
        botonBajar.forEach(btn => {
            btn.addEventListener ("click", () => {
                carrito = carrito.map(item => {
                    if (item.id === btn.id) {
                        if (item.encarrito > 1) {
                            return {...item, 
                                    id: item.id,
                                    nombre: item.nombre,
                                    variedad: item.variedad,
                                    precio: item.precio,
                                    img: item.img,
                                    encarrito: item.encarrito - 1};
                    
                        } else {
                            carrito = carrito.filter(item => item.id != btn.id);
                        }
                    }  
                return item;
                });
            localStorage.setItem("productosEnCarrito", JSON.stringify(carrito));
            costoTotal();
            numCarrito();
            NumCarritoVisible();
            displayCarrito();
            });        
        });
        let botonSubir = document.querySelectorAll(".subir");
        botonSubir.forEach(btn => {
            btn.addEventListener("click", () => {
                carrito = carrito.map(item => {
                    if (item.id === btn.id) {
                        return {...item, 
                                id: item.id,
                                nombre: item.nombre,
                                variedad: item.variedad,
                                precio: item.precio,
                                img: item.img,
                                encarrito: item.encarrito + 1
                                };
                    }
                return item;
                });
                localStorage.setItem("productosEnCarrito", JSON.stringify(carrito));
                costoTotal();
                numCarrito();
                NumCarritoVisible();
                displayCarrito(); 
            });
        });
        //Evento para dirigirse a la página de pagos.
        document.getElementById("btnPagar").onclick = function () {
            Swal.fire({
                title: '¡Validar Edad!',
                text: "¡Debes ser mayor de 18 años para continuar!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Confirmo ser mayor de 18 años'
              }).then((result) => {
                if (result.isConfirmed) {
                    location.href = "./payment.html"
                }
              })
        }
        });    
    } 
};

//funcion para definir el costo del carrito
function costoTotal () {
let costoCarrito = localStorage.getItem("costoTotal");
costoCarrito = carrito.reduce((acc, cur) => cur.precio*cur.encarrito + acc, 0);
localStorage.setItem("costoTotal", costoCarrito);
}

//funcion para guardar el numero de productos en el carrito
function numCarrito() {
    let numProductos = localStorage.getItem("numProdCarrito");
    numProductos = carrito.reduce((acc, cur) => cur.encarrito + acc, 0);
    localStorage.setItem("numProdCarrito", numProductos);
    numProductos = parseInt(numProductos);
}

//funcion para pintar el numero de productos en el carrito
function NumCarritoVisible() {
    let numProductos = localStorage.getItem("numProdCarrito");
    if (numProductos != 0 && numProductos != null) {
        spanNumeroCarrito.innerHTML +=`
            <span class="abrirCarrito span">${numProductos}</span>
        `;
        } else {
            spanNumeroCarrito.innerHTML="🛒"
        } 
}

displayCarrito();
NumCarritoVisible();