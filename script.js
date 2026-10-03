"use strict";

const backToTop = document.querySelector(".back-to-top");
const themeToggle = document.querySelector(".theme-toggle");
const themeToggleLabel = document.querySelector(".theme-toggle-label");
const themeColor = document.querySelector('meta[name="theme-color"]');


function setTheme(isDark) {
  const theme = isDark ? "dark" : "light";
  const action = isDark ? "Activar modo día" : "Activar modo noche";

  document.documentElement.dataset.theme = theme;
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", action);
  themeToggle.setAttribute("title", action);
  themeToggleLabel.textContent = isDark ? "Modo día" : "Modo noche";
  themeColor?.setAttribute("content", isDark ? "#151515" : "#f8f9fa");

  try {
    localStorage.setItem("portfolio-theme", theme);
  } catch {
    // El tema sigue funcionando aunque el navegador bloquee el almacenamiento.
  }
}

let savedTheme = null;
try {
  savedTheme = localStorage.getItem("portfolio-theme");
} catch {
  // Si no se puede leer el almacenamiento, se usa el modo claro.
}
setTheme(savedTheme === "dark");

themeToggle.addEventListener("click", () => {
  setTheme(document.documentElement.dataset.theme !== "dark");
});

function updateBackToTopVisibility() {
  backToTop.classList.toggle("is-visible", window.scrollY > 320);
}

window.addEventListener("scroll", updateBackToTopVisibility, { passive: true });
updateBackToTopVisibility();

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const contactForm = document.querySelector("#contact-form");
const formFeedback = document.querySelector(".form-feedback");

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = contactForm.querySelector(".send-message");
  const formData = new FormData(contactForm);
  const senderName = formData.get("name").trim();
  const recipient = "ismael_aleman2023@hotmail.com";
  const payload = {
    name: senderName,
    email: formData.get("email").trim(),
    message: formData.get("message").trim(),
    _subject: `Mensaje desde el portafolio de ${senderName}`,
    _replyto: formData.get("email").trim()
  };

  submitButton.disabled = true;
  formFeedback.classList.remove("is-error");
  formFeedback.textContent = "Enviando mensaje…";

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (!response.ok || result.success !== "true" && result.success !== true) {
      throw new Error(result.message || "No se pudo enviar el mensaje.");
    }

    contactForm.reset();
    formFeedback.textContent = "¡Mensaje enviado! Gracias por escribirme.";
  } catch (error) {
    formFeedback.classList.add("is-error");
    formFeedback.textContent = error.message || "Hubo un problema. Intentalo de nuevo más tarde.";
  } finally {
    submitButton.disabled = false;
  }
});

