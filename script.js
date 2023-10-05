let productos = [
  {
    id: 1,
    nombre: "Ladrillos",
    categoria: "End Grain",
    stock: 5,
    precio: 25000,
    tamaño: "30 cm x 45 cm",
    rutaImagen: "ladrillos3.jpg",
    item: "ladrillos",
  },
  {
    id: 2,
    nombre: "Cuadros",
    categoria: "End Grain",
    stock: 5,
    precio: 23000,
    tamaño: "30 cm x 45 cm",
    rutaImagen: "cuadros3.jpg",
    item: "cuadros",
  },
  {
    id: 3,
    nombre: "Gaucha",
    categoria: "Edge Grain",
    stock: 5,
    precio: 20000,
    tamaño: "30 cm x 45 cm",
    rutaImagen: "guarda3.jpg",
    item: "cuadros",
  },
]

let carrito = []
//Recupero el carrito almacenado en el storage
let stringCarritoRecuperado = localStorage.getItem("carritoMarcWoodds")
if (stringCarritoRecuperado) {
  carrito = JSON.parse(stringCarritoRecuperado)
}

renderizarCarrito(carrito)

renderizarProductos(productos, carrito)

function renderizarProductos(productos, carrito) {
  let contenedor = document.getElementById("contenedorProductos")

  productos.forEach((producto) => {
    let tarjeta = document.createElement("div")
    tarjeta.className = "col-lg-4 col-md-6 col-sm-12"
    tarjeta.innerHTML = `
  <a href=./pages/tablas.html#${producto.item}>
      <img src=./media/tablas/${producto.rutaImagen} alt=${producto.nombre} class="img-fluid" />
    </a>
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
        id: productoBuscado.id,
        nombre: productoBuscado.nombre,
        precioUnitario: productoBuscado.precio,
        unidades: 1,
        subtotal: productoBuscado.precio,
      })
    }
    
    productoBuscado.stock--
    //guardo el carrito el el local storage
    localStorage.setItem("carritoMarcWoodds",JSON.stringify(carrito))
    //alert("Se agregó producto al carrito")
        Swal.fire({
      //position: 'top-end',
      icon: 'success',
      title: 'Tabla agregada al carrito',
      showConfirmButton: false,
      timer: 1500
    })

  } else {
    alert("No hay más stock del producto seleccionado")
  }

  //console.log(carrito)

  renderizarCarrito(carrito)
}
function renderizarCarrito(productoEnCarrito) {
  let divCarrito = document.getElementById("carrito") //aca está el div que creé en el index.html
  divCarrito.innerHTML = ""
  productoEnCarrito.forEach((producto) => {
    let tarjetaProdCarrito = document.createElement("div")
    tarjetaProdCarrito.innerHTML = `
      <p >Modelo:  ${producto.nombre}</p>
      <p >Cantidad: ${producto.unidades}</p>
      <p >Precio Unitario: $ ${producto.precioUnitario}.-</p>
      <p >Sub Total: $ ${producto.subtotal}.-</p>
      <hr color="#eef1f5" />
    `
    divCarrito.appendChild(tarjetaProdCarrito)
  })
//let carritoJson = JSON.stringify(carrito)
//localStorage.setItem("carritoMarcWoodds",carritoJson)
}

let botonVerOcultar = document.getElementById("idBotonVerOcultarCarrito")
botonVerOcultar.addEventListener("click", verOcultarCarrito)

function verOcultarCarrito() {
  let carrito = document.getElementById("carrito")
  carrito.classList.toggle("oculta")
  contenedorProductos.classList.toggle("oculta")
}

let botonVaciarCarrito = document.getElementById("idBotonVaciarCarrito")
botonVaciarCarrito.addEventListener("click", vaciarCarrito)

function vaciarCarrito() {
  localStorage.removeItem("carritoMarcWoodds")
  carrito=[]
  renderizarCarrito(carrito)
}