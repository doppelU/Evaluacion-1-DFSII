# ◆ CIRCUITO — Tienda de Tecnología

Proyecto académico — Evaluación Parcial N°1, asignatura **DSY1104 Desarrollo Fullstack II**, Duoc UC.

Tienda web de productos tecnológicos construida con **HTML5, CSS3, Bootstrap 5 y JavaScript**, sin backend ni base de datos (persistencia local mediante `LocalStorage` y `SessionStorage`), según lo autorizado por el docente para esta primera entrega.

## Integrantes

- David Ulloa


## Funcionalidades

| Rol | Funcionalidades |
|---|---|
| **Administrador** | Login, catálogo, mantenedor de productos (CRUD), mantenedor de usuarios (CRUD) |
| **Cliente** | Login, catálogo, carrito de compras con control de stock y confirmación de compra |

## Tecnologías

- HTML5 semántico (`header`, `nav`, `main`, `section`, `article`, `aside`, `footer`)
- CSS3 con hoja de estilos externa y sistema de diseño propio (`css/styles.css`)
- Bootstrap 5.3.3 (CDN)
- JavaScript (vanilla) — validaciones de formulario personalizadas, sin frameworks
- `LocalStorage` (usuarios, productos) y `SessionStorage` (sesión, carrito)

## Estructura del proyecto

circuito/
├── index.html # redirige a login o catálogo según la sesión
├── login.html
├── catalogo.html
├── admin.html # mantenedor (solo Administrador)
├── carrito.html # carrito (solo Cliente)
├── css/
│ └── styles.css
└── js/
├── db.js # capa de datos: seed y helpers de storage
├── login.js
├── catalogo.js
├── admin.js
└── carrito.js


## Cómo ejecutar el proyecto

Este proyecto usa `LocalStorage`, por lo que **no funciona bien abriendo el HTML directamente con doble clic** (`file://`). Debe levantarse con un servidor local:

**Opción recomendada (Node):**
```bash
npx serve .
```

**Alternativa (VS Code):**
Extensión **Live Server** → clic derecho en `login.html` → *Open with Live Server*.

Luego abre `login.html` en el navegador.

## Usuarios de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Administrador | `admin@circuito.cl` | `admin123` |
| Cliente | `cliente@circuito.cl` | `cliente123` |

## Documentación

- `ERS_CIRCUITO.docx` — Especificación de Requisitos de Software
- `Planilla_Requerimientos_CIRCUITO.xlsx` — Planilla de requerimientos (Anexo 2)

## Limitaciones conocidas

- No hay backend ni base de datos: los datos viven en el navegador de cada usuario y no se comparten entre dispositivos.
- El control de acceso por rol es solo a nivel de interfaz; no constituye una medida de seguridad real (no hay backend que la respalde).
- Las contraseñas se almacenan en texto plano en `LocalStorage`, aceptable solo para el alcance académico de esta entrega.
