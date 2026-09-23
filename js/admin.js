let modalProducto, modalUsuario;

document.addEventListener("DOMContentLoaded", () => {
  const sesion = protegerPagina("admin"); // solo admin puede entrar
  if (!sesion) return;

  document.getElementById("nombreUsuario").textContent = sesion.nombre;
  document.getElementById("btnCerrarSesion").addEventListener("click", cerrarSesion);

  modalProducto = new bootstrap.Modal(document.getElementById("modalProducto"));
  modalUsuario = new bootstrap.Modal(document.getElementById("modalUsuario"));

  renderTablaProductos();
  renderTablaUsuarios();

  document.getElementById("formProducto").addEventListener("submit", guardarProducto);
  document.getElementById("formUsuario").addEventListener("submit", guardarUsuario);

  // Si viene desde el catálogo con #productos, abre esa pestaña
  if (window.location.hash === "#productos") {
    document.querySelector('[data-bs-target="#panelProductos"]').click();
  }
});

/* ================= PRODUCTOS ================= */

function renderTablaProductos() {
  const productos = getProductos();
  const tbody = document.getElementById("tablaProductos");
  tbody.innerHTML = productos
    .map(
      (p) => `
      <tr>
        <td><img src="${p.imagen}" alt="${p.nombre}" style="width:56px;height:40px;object-fit:cover;border-radius:6px;"></td>
        <td>${p.nombre}</td>
        <td><span class="categoria-pill">${p.categoria}</span></td>
        <td>${formatoCLP(p.precio)}</td>
        <td>${p.stock}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-accent" onclick="abrirModalProducto(${p.id})">Editar</button>
          <button class="btn btn-sm btn-outline-danger" onclick="eliminarProducto(${p.id})">Eliminar</button>
        </td>
      </tr>`
    )
    .join("");
}

function abrirModalProducto(id) {
  const form = document.getElementById("formProducto");
  form.reset();
  form.classList.remove("was-validated");
  form.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"));
  document.getElementById("productoId").value = "";
  document.getElementById("tituloModalProducto").textContent = "Nuevo producto";

  // Sugerencias de categoría a partir de las ya existentes (datalist = "sugerencias")
  const categorias = [...new Set(getProductos().map((p) => p.categoria))];
  document.getElementById("listaCategorias").innerHTML = categorias
    .map((c) => `<option value="${c}"></option>`)
    .join("");

  if (id) {
    const producto = getProductos().find((p) => p.id === id);
    if (producto) {
      document.getElementById("tituloModalProducto").textContent = "Editar producto";
      document.getElementById("productoId").value = producto.id;
      document.getElementById("productoNombre").value = producto.nombre;
      document.getElementById("productoDescripcion").value = producto.descripcion;
      document.getElementById("productoPrecio").value = producto.precio;
      document.getElementById("productoStock").value = producto.stock;
      document.getElementById("productoCategoria").value = producto.categoria;
      document.getElementById("productoImagen").value = producto.imagen;
    }
  }
  modalProducto.show();
}

function validarFormularioProducto() {
  let valido = true;
  const campos = [
    { el: document.getElementById("productoNombre"), ok: (v) => v.trim().length >= 3 },
    { el: document.getElementById("productoDescripcion"), ok: (v) => v.trim().length >= 10 },
    { el: document.getElementById("productoPrecio"), ok: (v) => Number(v) > 0 },
    { el: document.getElementById("productoStock"), ok: (v) => v !== "" && Number(v) >= 0 },
    { el: document.getElementById("productoCategoria"), ok: (v) => v.trim().length > 0 },
  ];
  campos.forEach(({ el, ok }) => {
    const esValido = ok(el.value);
    el.classList.toggle("is-invalid", !esValido);
    el.classList.toggle("is-valid", esValido);
    if (!esValido) valido = false;
  });
  return valido;
}

function guardarProducto(e) {
  e.preventDefault();
  if (!validarFormularioProducto()) return; // los mensajes ya se muestran bajo cada campo

  const productos = getProductos();
  const id = document.getElementById("productoId").value;

  const datos = {
    nombre: document.getElementById("productoNombre").value.trim(),
    descripcion: document.getElementById("productoDescripcion").value.trim(),
    precio: Number(document.getElementById("productoPrecio").value),
    stock: Number(document.getElementById("productoStock").value),
    categoria: document.getElementById("productoCategoria").value.trim(),
    imagen: document.getElementById("productoImagen").value.trim() || "https://picsum.photos/seed/circuito-generico/600/400",
  };

  if (id) {
    const idx = productos.findIndex((p) => p.id === Number(id));
    productos[idx] = { ...productos[idx], ...datos };
  } else {
    datos.id = nextId(productos);
    productos.push(datos);
  }

  saveProductos(productos);
  renderTablaProductos();
  modalProducto.hide();
}

function eliminarProducto(id) {
  if (!confirm("¿Eliminar este producto? Esta acción no se puede deshacer.")) return;
  const productos = getProductos().filter((p) => p.id !== id);
  saveProductos(productos);
  renderTablaProductos();
}

/* ================= USUARIOS ================= */

function renderTablaUsuarios() {
  const usuarios = getUsuarios();
  const tbody = document.getElementById("tablaUsuarios");
  tbody.innerHTML = usuarios
    .map(
      (u) => `
      <tr>
        <td>${u.nombre}</td>
        <td>${u.email}</td>
        <td><span class="badge-rol">${u.rol === "admin" ? "Administrador" : "Cliente"}</span></td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-accent" onclick="abrirModalUsuario(${u.id})">Editar</button>
          <button class="btn btn-sm btn-outline-danger" onclick="eliminarUsuario(${u.id})">Eliminar</button>
        </td>
      </tr>`
    )
    .join("");
}

function abrirModalUsuario(id) {
  const form = document.getElementById("formUsuario");
  form.reset();
  form.querySelectorAll(".is-invalid").forEach((el) => el.classList.remove("is-invalid"));
  document.getElementById("usuarioId").value = "";
  document.getElementById("tituloModalUsuario").textContent = "Nuevo usuario";

  if (id) {
    const usuario = getUsuarios().find((u) => u.id === id);
    if (usuario) {
      document.getElementById("tituloModalUsuario").textContent = "Editar usuario";
      document.getElementById("usuarioId").value = usuario.id;
      document.getElementById("usuarioNombre").value = usuario.nombre;
      document.getElementById("usuarioEmail").value = usuario.email;
      document.getElementById("usuarioPassword").value = usuario.password;
      document.getElementById("usuarioRol").value = usuario.rol;
    }
  }
  modalUsuario.show();
}

function validarFormularioUsuario(usuarios, id) {
  let valido = true;
  const nombre = document.getElementById("usuarioNombre");
  const email = document.getElementById("usuarioEmail");
  const password = document.getElementById("usuarioPassword");
  const feedbackEmail = document.getElementById("feedbackUsuarioEmail");

  const nombreOk = nombre.value.trim().length >= 3;
  nombre.classList.toggle("is-invalid", !nombreOk);
  nombre.classList.toggle("is-valid", nombreOk);
  if (!nombreOk) valido = false;

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailValue = email.value.trim().toLowerCase();
  const formatoOk = regexEmail.test(emailValue);
  const existeCorreo = usuarios.some((u) => u.email.toLowerCase() === emailValue && u.id !== Number(id));

  if (!formatoOk) {
    feedbackEmail.textContent = "Ingresa un correo con formato válido (ej: nombre@dominio.cl).";
  } else if (existeCorreo) {
    feedbackEmail.textContent = "Ya existe un usuario registrado con ese correo.";
  }
  const emailOk = formatoOk && !existeCorreo;
  email.classList.toggle("is-invalid", !emailOk);
  email.classList.toggle("is-valid", emailOk);
  if (!emailOk) valido = false;

  const passwordOk = password.value.length >= 4;
  password.classList.toggle("is-invalid", !passwordOk);
  password.classList.toggle("is-valid", passwordOk);
  if (!passwordOk) valido = false;

  return valido;
}

function guardarUsuario(e) {
  e.preventDefault();
  const usuarios = getUsuarios();
  const id = document.getElementById("usuarioId").value;

  if (!validarFormularioUsuario(usuarios, id)) return; // mensajes ya visibles bajo cada campo

  const email = document.getElementById("usuarioEmail").value.trim().toLowerCase();
  const datos = {
    nombre: document.getElementById("usuarioNombre").value.trim(),
    email,
    password: document.getElementById("usuarioPassword").value,
    rol: document.getElementById("usuarioRol").value,
  };

  if (id) {
    const idx = usuarios.findIndex((u) => u.id === Number(id));
    usuarios[idx] = { ...usuarios[idx], ...datos };
  } else {
    datos.id = nextId(usuarios);
    usuarios.push(datos);
  }

  saveUsuarios(usuarios);
  renderTablaUsuarios();
  modalUsuario.hide();
}

function eliminarUsuario(id) {
  const sesion = getSesion();
  if (sesion.id === id) {
    alert("No puedes eliminar tu propio usuario mientras tienes la sesión activa.");
    return;
  }
  if (!confirm("¿Eliminar este usuario?")) return;
  const usuarios = getUsuarios().filter((u) => u.id !== id);
  saveUsuarios(usuarios);
  renderTablaUsuarios();
}
