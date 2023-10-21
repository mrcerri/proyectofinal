fetch("./prod.json") // acá el fetch me retorna un objeto Response
  .then((respuesta) => respuesta.json()) // este metodo pasa de Response a JS
  .then((productos) => principal(productos))
  .catch((error) => console.log(error))

function principal(productos) {
  let CarritoRecuperado = localStorage.getItem("carritoMarcWoodds")
  let carrito = CarritoRecuperado ? JSON.parse(CarritoRecuperado) : []

  renderizarCarrito(carrito)
  renderizarProductos(productos, carrito)

  let botonVerOcultar = document.getElementById("idBotonVerOcultarCarrito")
  botonVerOcultar.addEventListener("click", verOcultarCarrito)
}

function renderizarProductos(productos, carrito) {
  let contenedor = document.getElementById("contenedorProductos")

  productos.forEach((producto) => {
    let tarjeta = document.createElement("div")
    tarjeta.className = "col-lg-4 col-md-6 col-sm-12"
    tarjeta.innerHTML = `
  <p >
      <img src=./media/tablas/${producto.rutaImagen} alt=${producto.nombre} class="img-fluid" />
    </p>
      <p class=titulo2>Modelo ${producto.nombre}</p>
      <p class=textosimple>Tamaño: ${producto.tamaño}</p>
      <p class=titulo1>$ ${producto.precio}.-</p>
      <button id = ${producto.id} class = 'btn btn-outline-dark btn-sm' > Agregar al carrito </button>
  
  `
    contenedor.append(tarjeta)
    let botonAgregarAlCarrito = document.getElementById(producto.id)
    botonAgregarAlCarrito.addEventListener("click", (e) =>
      agregarAlCarrito(productos, carrito, e)
    )
  })
}
function agregarAlCarrito(productos, carrito, e) {
  let productoBuscado = productos.find(
    (producto) => producto.id === Number(e.target.id)
  )
  let productoEnCarrito = carrito.find(
    (producto) => producto.id === productoBuscado.id
  )

  if (productoBuscado.stock > 0) {
    if (productoEnCarrito) {
      productoEnCarrito.unidades++
      productoEnCarrito.subtotal =
        productoEnCarrito.unidades * productoEnCarrito.precioUnitario
    } else {
      carrito.push({
        rutaImagen: productoBuscado.rutaImagen,
        id: productoBuscado.id,
        nombre: productoBuscado.nombre,
        precioUnitario: productoBuscado.precio,
        unidades: 1,
        subtotal: productoBuscado.precio,
      })
    }

    productoBuscado.stock--
    //guardo el carrito el el local storage
    localStorage.setItem("carritoMarcWoodds", JSON.stringify(carrito))

    Swal.fire({
      title: "Tabla agregada al carrito!",
      text: `Modelo: ${productoBuscado.nombre}, $${productoBuscado.precio}.-`,
      imageUrl: `./media/tablas/${productoBuscado.rutaImagen}`,
      imageWidth: 400,
      imageHeight: 200,
      icon: "success",
      showConfirmButton: false,
      timer: 2000,
    })
  } else {
    alert("No hay más stock del producto seleccionado")
  }

  renderizarCarrito(carrito)
}
function renderizarCarrito(productoEnCarrito) {
  if (productoEnCarrito.length > 0) {
    let divCarrito = document.getElementById("carrito") //aca está el div que creé en el index.html
    divCarrito.innerHTML = ""
    productoEnCarrito.forEach((producto) => {
      let tarjetaProdCarrito = document.createElement("div")
      tarjetaProdCarrito.innerHTML = `
    <p ><img src=./media/tablas/${producto.rutaImagen} class="img-fluid" width=200/></p>
      <p>Modelo:  ${producto.nombre}</p>
      <p>Cantidad: ${producto.unidades}</p>
      <p>Precio Unitario: $ ${producto.precioUnitario}.-</p>
      <p>Sub Total: $ ${producto.subtotal}.-</p>
      <hr color="#eef1f5" />
    `
      divCarrito.appendChild(tarjetaProdCarrito)
    })
    let botonFc = document.createElement("button")
    botonFc.classList.add("btn")
    botonFc.classList.add("btn-outline-dark")
    botonFc.classList.add("btn-lg")
    botonFc.innerHTML = "Finalizar compra"
    botonFc.addEventListener("click", vaciarCarrito)
    divCarrito.appendChild(botonFc)
  }
}
function verOcultarCarrito() {
  let carrito = document.getElementById("carrito")
  carrito.classList.toggle("oculta")
  contenedorProductos.classList.toggle("oculta")
}
function vaciarCarrito() {
  Swal.fire({
    title: "Gracias por su compra",
    icon: "info",
    showConfirmButton: false,
    timer: 2000,
  })
  let carrito = document.getElementById("carrito")
  carrito.innerHTML = ""
  carrito.classList.add("oculta")
  contenedorProductos.classList.remove("oculta")
  localStorage.removeItem("carritoMarcWoodds")
}
