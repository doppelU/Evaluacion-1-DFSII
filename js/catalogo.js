document.addEventListener("DOMContentLoaded", () => {
  const sesion = protegerPagina(); // exige cualquier sesión, admin o cliente
  if (!sesion) return;

  configurarNavbar(sesion);
  renderCarrusel();
  poblarCategorias();
  renderProductos();

  document.getElementById("inputBuscar").addEventListener("input", renderProductos);
  document.getElementById("selectCategoria").addEventListener("change", renderProductos);
  document.getElementById("btnCerrarSesion").addEventListener("click", cerrarSesion);
});

function configurarNavbar(sesion) {
  document.getElementById("nombreUsuario").textContent = sesion.nombre;
  document.getElementById("badgeRol").textContent = sesion.rol === "admin" ? "Administrador" : "Cliente";
  document.getElementById("badgeCarrito").textContent = contarItemsCarrito();

  const esAdmin = sesion.rol === "admin";
  document.getElementById("navItemAdmin").classList.toggle("d-none", !esAdmin);
  document.getElementById("navItemCarrito").classList.toggle("d-none", esAdmin);
}

function renderCarrusel() {
  const productos = getProductos();
  const destacados = [...productos].sort((a, b) => b.stock - a.stock).slice(0, 3);
  const inner = document.getElementById("carruselInner");
  inner.innerHTML = destacados
    .map(
      (p, i) => `
      <div class="carousel-item ${i === 0 ? "active" : ""}">
        <img src="${p.imagen}" class="d-block w-100" alt="${p.nombre}">
        <div class="carousel-caption-circuito">
          <div class="eyebrow">Producto destacado</div>
          <h4 class="mb-1">${p.nombre}</h4>
          <div>${formatoCLP(p.precio)}</div>
        </div>
      </div>`
    )
    .join("");
}

function poblarCategorias() {
  const productos = getProductos();
  const categorias = [...new Set(productos.map((p) => p.categoria))].sort();
  const select = document.getElementById("selectCategoria");
  categorias.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
}

function renderProductos() {
  const sesion = getSesion();
  const productos = getProductos();
  const termino = document.getElementById("inputBuscar").value.trim().toLowerCase();
  const categoria = document.getElementById("selectCategoria").value;

  const filtrados = productos.filter((p) => {
    const coincideTexto = p.nombre.toLowerCase().includes(termino) || p.descripcion.toLowerCase().includes(termino);
    const coincideCategoria = !categoria || p.categoria === categoria;
    return coincideTexto && coincideCategoria;
  });

  const grid = document.getElementById("gridProductos");
  document.getElementById("sinResultados").classList.toggle("d-none", filtrados.length > 0);

  grid.innerHTML = filtrados
    .map((p) => {
      const stockBajo = p.stock <= 5;
      const accion =
        sesion.rol === "admin"
          ? `<a href="admin.html#productos" class="btn btn-outline-accent btn-sm">Editar en mantenedor</a>`
          : `<button class="btn btn-accent btn-sm" onclick="handleAgregarCarrito(${p.id})" ${p.stock === 0 ? "disabled" : ""}>
               ${p.stock === 0 ? "Sin stock" : "Agregar al carrito"}
             </button>`;

      return `
      <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
        <article class="card card-producto">
          <img src="${p.imagen}" alt="${p.nombre}">
          <div class="card-body">
            <span class="categoria-pill">${p.categoria}</span>
            <h6 class="mb-0">${p.nombre}</h6>
            <p class="text-muted mb-1" style="font-size:0.85rem;">${p.descripcion}</p>
            <div class="d-flex justify-content-between align-items-center">
              <span class="precio">${formatoCLP(p.precio)}</span>
              <small class="${stockBajo ? "stock-bajo" : "text-muted"}">Stock: ${p.stock}</small>
            </div>
            <div class="mt-2">${accion}</div>
          </div>
        </article>
      </div>`;
    })
    .join("");
}

function handleAgregarCarrito(productoId) {
  agregarAlCarrito(productoId, 1);
  document.getElementById("badgeCarrito").textContent = contarItemsCarrito();
  const toast = bootstrap.Toast.getOrCreateInstance(document.getElementById("toastCarrito"));
  toast.show();
}
