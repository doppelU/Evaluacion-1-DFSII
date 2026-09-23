/* ============================================================
   CIRCUITO - Capa de datos (localStorage / sessionStorage)
   No hay backend: todo se persiste localmente en el navegador.
   ============================================================ */

const DB_KEYS = {
  USUARIOS: "circuito_usuarios",
  PRODUCTOS: "circuito_productos",
  SESION: "circuito_sesion",
  CARRITO: "circuito_carrito",
};

/* ---------- Seed inicial ---------- */

function seedUsuarios() {
  return [
    {
      id: 1,
      nombre: "Administrador",
      email: "admin@circuito.cl",
      password: "admin123",
      rol: "admin",
    },
    {
      id: 2,
      nombre: "Cliente Demo",
      email: "cliente@circuito.cl",
      password: "cliente123",
      rol: "cliente",
    },
  ];
}

function seedProductos() {
  return [
    {
      id: 1,
      nombre: "Teclado mecánico Aurora TKL",
      descripcion: "Switches lineales, retroiluminación RGB por tecla, layout TKL.",
      precio: 54990,
      stock: 14,
      categoria: "Perifericos",
      imagen: "https://picsum.photos/seed/circuito-kb/600/400",
    },
    {
      id: 2,
      nombre: "Mouse Vortex Wireless",
      descripcion: "Sensor óptico 16000 DPI, 60 hrs de batería, agarre ergonómico.",
      precio: 32990,
      stock: 22,
      categoria: "Perifericos",
      imagen: "https://picsum.photos/seed/circuito-mouse/600/400",
    },
    {
      id: 3,
      nombre: "Monitor Nébula 27\" 165Hz",
      descripcion: "Panel IPS QHD, 165Hz, 1ms, ideal para diseño y gaming.",
      precio: 219990,
      stock: 7,
      categoria: "Pantallas",
      imagen: "https://picsum.photos/seed/circuito-monitor/600/400",
    },
    {
      id: 4,
      nombre: "Audífonos Pulse ANC",
      descripcion: "Cancelación activa de ruido, 30 hrs de autonomía, drivers 40mm.",
      precio: 69990,
      stock: 18,
      categoria: "Audio",
      imagen: "https://picsum.photos/seed/circuito-audio/600/400",
    },
    {
      id: 5,
      nombre: "SSD NVMe Rapida 1TB",
      descripcion: "Lectura hasta 7000 MB/s, disipador incluido, PCIe Gen4.",
      precio: 74990,
      stock: 30,
      categoria: "Componentes",
      imagen: "https://picsum.photos/seed/circuito-ssd/600/400",
    },
    {
      id: 6,
      nombre: "Webcam Cristal 4K",
      descripcion: "Grabación 4K30, enfoque automático, micrófono dual.",
      precio: 45990,
      stock: 11,
      categoria: "Perifericos",
      imagen: "https://picsum.photos/seed/circuito-webcam/600/400",
    },
    {
      id: 7,
      nombre: "Hub USB-C Nexo 8-en-1",
      descripcion: "HDMI 4K, lector SD, 3x USB 3.0, PD 100W passthrough.",
      precio: 27990,
      stock: 25,
      categoria: "Accesorios",
      imagen: "https://picsum.photos/seed/circuito-hub/600/400",
    },
    {
      id: 8,
      nombre: "Silla ergonómica Vertice",
      descripcion: "Soporte lumbar ajustable, reclinable 135°, malla transpirable.",
      precio: 159990,
      stock: 5,
      categoria: "Mobiliario",
      imagen: "https://picsum.photos/seed/circuito-silla/600/400",
    },
  ];
}

/* ---------- Inicialización ---------- */

function initDB() {
  if (!localStorage.getItem(DB_KEYS.USUARIOS)) {
    localStorage.setItem(DB_KEYS.USUARIOS, JSON.stringify(seedUsuarios()));
  }
  if (!localStorage.getItem(DB_KEYS.PRODUCTOS)) {
    localStorage.setItem(DB_KEYS.PRODUCTOS, JSON.stringify(seedProductos()));
  }
}

/* ---------- Helpers genéricos ---------- */

function getUsuarios() {
  return JSON.parse(localStorage.getItem(DB_KEYS.USUARIOS)) || [];
}
function saveUsuarios(usuarios) {
  localStorage.setItem(DB_KEYS.USUARIOS, JSON.stringify(usuarios));
}
function getProductos() {
  return JSON.parse(localStorage.getItem(DB_KEYS.PRODUCTOS)) || [];
}
function saveProductos(productos) {
  localStorage.setItem(DB_KEYS.PRODUCTOS, JSON.stringify(productos));
}

function nextId(lista) {
  return lista.length ? Math.max(...lista.map((i) => i.id)) + 1 : 1;
}

/* ---------- Sesión ---------- */

function getSesion() {
  return JSON.parse(sessionStorage.getItem(DB_KEYS.SESION));
}
function setSesion(usuario) {
  sessionStorage.setItem(
    DB_KEYS.SESION,
    JSON.stringify({ id: usuario.id, nombre: usuario.nombre, rol: usuario.rol })
  );
}
function cerrarSesion() {
  sessionStorage.removeItem(DB_KEYS.SESION);
  sessionStorage.removeItem(DB_KEYS.CARRITO);
  window.location.href = "login.html";
}

/* Protege una página: exige sesión y, opcionalmente, un rol específico */
function protegerPagina(rolRequerido) {
  const sesion = getSesion();
  if (!sesion) {
    window.location.href = "login.html";
    return null;
  }
  if (rolRequerido && sesion.rol !== rolRequerido) {
    window.location.href = "catalogo.html";
    return null;
  }
  return sesion;
}

/* ---------- Carrito (por sesión de navegador) ---------- */

function getCarrito() {
  return JSON.parse(sessionStorage.getItem(DB_KEYS.CARRITO)) || [];
}
function saveCarrito(carrito) {
  sessionStorage.setItem(DB_KEYS.CARRITO, JSON.stringify(carrito));
}
function agregarAlCarrito(productoId, cantidad = 1) {
  const carrito = getCarrito();
  const item = carrito.find((i) => i.productoId === productoId);
  if (item) {
    item.cantidad += cantidad;
  } else {
    carrito.push({ productoId, cantidad });
  }
  saveCarrito(carrito);
}
function contarItemsCarrito() {
  return getCarrito().reduce((acc, i) => acc + i.cantidad, 0);
}

function formatoCLP(valor) {
  return valor.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}

initDB();
