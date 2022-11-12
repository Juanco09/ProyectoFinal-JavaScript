let productosAgregados = localStorage.getItem("productosEnCarrito");
productosAgregados = JSON.parse(productosAgregados);
const contenidoPagar = document.getElementById("productosPagar");
let costoTotal = localStorage.getItem("costoTotal");
let numProdCarrito = localStorage.getItem("numProdCarrito");
const finalizarCompra = document.getElementById("btn Finalizar");
const inputFields = document.querySelectorAll("input");
const inputValidos = Array.from(inputFields).filter(input => input.value !== "");

//pintar los productos del carrito en el cuadro de pago
productosAgregados.forEach((producto)=> {
    const prodPay = document.createElement("div");
    prodPay.classList.add("item"); 
    prodPay.innerHTML = ` 
    <span class="precio">$${producto.precio*producto.encarrito}</span>
    <p class="nombreProd">${producto.encarrito} x ${producto.nombre}</p>
    <p class="varProd">${producto.variedad}</p>
     `;
     contenidoPagar.appendChild(prodPay);
});

const totalPay = document.createElement("div");
totalPay.classList.add("total");
totalPay.innerHTML =`
    Total <span class="precio">$${costoTotal}</span>
`;
contenidoPagar.appendChild(totalPay);

finalizarCompra.addEventListener("click", () => {
    var a = document.forms["Form"]["nombre_ap"].value;
    var b = document.forms["Form"]["mm"].value;
    var c = document.forms["Form"]["aa"].value;
    var d = document.forms["Form"]["numeroTarj"].value;
    var e = document.forms["Form"]["cvc"].value;
    var f = document.forms["Form"]["direcCorreo"].value;
    if (!a || !b || !c || !d || !e || !f) {
        Swal.fire({
            icon: 'error',
            title: 'Error..',
            text: '¡Debe llenar todos los campos solicitados!',
          })
        return false;
    } else {
            carrito = [];
            localStorage.setItem("productosEnCarrito", JSON.stringify(carrito))
            localStorage.setItem("numProdCarrito",  0);
            localStorage.setItem("costoTotal", 0);
            Swal.fire({
                title: "¡Excelente, " + document.forms["Form"]["nombre_ap"].value + "!",
                text: "Se ha realizado tu pago de $" + costoTotal + ". Recibirás la factura en tu correo electrónico.",
                icon: 'success',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Volver al Inicio'
              }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "./index.html";
                } 
              })
    }
});