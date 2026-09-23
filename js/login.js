document.addEventListener("DOMContentLoaded", () => {
  // Si ya hay sesión activa, no tiene sentido ver el login de nuevo
  const sesionActiva = getSesion();
  if (sesionActiva) {
    window.location.href = "catalogo.html";
    return;
  }

  const form = document.getElementById("formLogin");
  const alerta = document.getElementById("alertaError");
  const btnVerPassword = document.getElementById("btnVerPassword");
  const inputEmail = document.getElementById("email");
  const inputPassword = document.getElementById("password");

  btnVerPassword.addEventListener("click", () => {
    inputPassword.type = inputPassword.type === "password" ? "text" : "password";
  });

  // Validación en vivo: apenas el usuario sale del campo, se revisa
  inputEmail.addEventListener("blur", () => validarEmail());
  inputPassword.addEventListener("blur", () => validarPassword());

  function validarEmail() {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valido = regexEmail.test(inputEmail.value.trim());
    inputEmail.classList.toggle("is-invalid", !valido);
    inputEmail.classList.toggle("is-valid", valido);
    return valido;
  }

  function validarPassword() {
    const valido = inputPassword.value.length >= 4;
    inputPassword.classList.toggle("is-invalid", !valido);
    inputPassword.classList.toggle("is-valid", valido);
    return valido;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alerta.classList.add("d-none");

    const emailValido = validarEmail();
    const passwordValido = validarPassword();
    if (!emailValido || !passwordValido) {
      // Mensajes específicos ya quedan visibles bajo cada campo (invalid-feedback)
      return;
    }

    const email = inputEmail.value.trim().toLowerCase();
    const password = inputPassword.value;

    const usuarios = getUsuarios();
    const usuario = usuarios.find(
      (u) => u.email.toLowerCase() === email && u.password === password
    );

    if (!usuario) {
      mostrarError("Correo o contraseña incorrectos. Verifica tus datos e intenta de nuevo.");
      return;
    }

    setSesion(usuario);
    window.location.href = "catalogo.html";
  });

  function mostrarError(mensaje) {
    alerta.textContent = mensaje;
    alerta.classList.remove("d-none");
  }
});
