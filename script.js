document.addEventListener("DOMContentLoaded", () => {
  emailjs.init("e0J6Ub-O34oAlNDmN"); // Inicialización

  const form = document.getElementById("form-contacto");
  const mensaje = document.getElementById("mensaje-enviado");

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    emailjs.sendForm("service_z7hd523", "template_contacto", this)
      .then(() => {
        mensaje.textContent = "✅ Mensaje de contacto enviado correctamente";
        mensaje.style.color = "#2ecc71";
        mensaje.classList.remove("oculto");
        form.reset();

        // Ocultar mensaje después de 5 segundos
        setTimeout(() => mensaje.classList.add("oculto"), 5000);
      })
      .catch((error) => {
        console.error("Error al enviar contacto:", error);
        mensaje.textContent = "❌ Error al enviar el mensaje";
        mensaje.style.color = "#e74c3c";
        mensaje.classList.remove("oculto");

        setTimeout(() => mensaje.classList.add("oculto"), 5000);
      });
  });
});
