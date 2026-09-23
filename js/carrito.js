document.addEventListener("DOMContentLoaded", () => {
  const sesion = protegerPagina("cliente"); // solo cliente ve el carrito
  if (!sesion) return;

  document.getElementById("nombreUsuario").textContent = sesion.nombre;
  document.getElementById("btnCerrarSesion").addEventListener("click", cerrarSesion);
  document.getElementById("btnVaciarCarrito").addEventListener("click", vaciarCarrito);
  document.getElementById("btnConfirmarCompra").addEventListener("click", confirmarCompra);

  renderCarrito();
});

function renderCarrito() {
  const carrito = getCarrito();
  const productos = getProductos();
  document.getElementById("badgeCarrito").textContent = contarItemsCarrito();

  const vacio = carrito.length === 0;
  document.getElementById("carritoVacio").classList.toggle("d-none", !vacio);
  document.getElementById("carritoContenido").classList.toggle("d-none", vacio);
  if (vacio) return;

  let total = 0;
  let items = 0;

  const filas = carrito
    .map((item) => {
      const producto = productos.find((p) => p.id === item.productoId);
      if (!producto) return "";
      const subtotal = producto.precio * item.cantidad;
      total += subtotal;
      items += item.cantidad;

      return `
      <tr>
        <td>
          <div class="d-flex align-items-center gap-2">
            <img src="${producto.imagen}" style="width:52px;height:40px;object-fit:cover;border-radius:6px;">
            <span>${producto.nombre}</span>
          </div>
        </td>
        <td>${formatoCLP(producto.precio)}</td>
        <td>
          <div class="d-flex align-items-center gap-2">
            <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${producto.id}, -1)">−</button>
            <span>${item.cantidad}</span>
            <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${producto.id}, 1)">+</button>
          </div>
        </td>
        <td>${formatoCLP(subtotal)}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-danger" onclick="quitarDelCarrito(${producto.id})">Quitar</button>
        </td>
      </tr>`;
    })
    .join("");

  document.getElementById("tablaCarrito").innerHTML = filas;
  document.getElementById("resumenItems").textContent = items;
  document.getElementById("resumenTotal").textContent = formatoCLP(total);
}

function cambiarCantidad(productoId, delta) {
  const carrito = getCarrito();
  const item = carrito.find((i) => i.productoId === productoId);
  if (!item) return;

  const producto = getProductos().find((p) => p.id === productoId);
  item.cantidad += delta;

  if (item.cantidad <= 0) {
    saveCarrito(carrito.filter((i) => i.productoId !== productoId));
  } else if (producto && item.cantidad > producto.stock) {
    item.cantidad = producto.stock; // no se puede pedir más que el stock disponible
    saveCarrito(carrito);
  } else {
    saveCarrito(carrito);
  }
  renderCarrito();
}

function quitarDelCarrito(productoId) {
  const carrito = getCarrito().filter((i) => i.productoId !== productoId);
  saveCarrito(carrito);
  renderCarrito();
}

function vaciarCarrito() {
  if (!confirm("¿Vaciar todo el carrito?")) return;
  saveCarrito([]);
  renderCarrito();
}

function confirmarCompra() {
  const carrito = getCarrito();
  if (carrito.length === 0) return;

  // Descuenta stock de forma simulada (no hay backend/BBDD real)
  const productos = getProductos();
  carrito.forEach((item) => {
    const producto = productos.find((p) => p.id === item.productoId);
    if (producto) producto.stock = Math.max(0, producto.stock - item.cantidad);
  });
  saveProductos(productos);
  saveCarrito([]);

  alert("¡Compra confirmada! Gracias por tu pedido.");
  renderCarrito();
}
