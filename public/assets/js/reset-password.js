import { fetchData } from "../../lib/fetchData.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("reset-password-form");
  const msg = document.getElementById("reset-msg");
  const API_URL = document.getElementById("api-url").value;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.textContent = "";

    const email = form.email.value.trim();
    const password = form.password.value.trim();
    const confirmPassword = form["confirm-password"].value.trim();

    // Validation simple
    if (!email || !password || !confirmPassword) {
      msg.textContent = "Tous les champs sont obligatoires.";
      msg.style.color = "red";
      return;
    }
    if (password !== confirmPassword) {
      msg.textContent = "Les mots de passe ne correspondent pas.";
      msg.style.color = "red";
      return;
    }
    if (password.length < 6) {
      msg.textContent = "Le mot de passe doit contenir au moins 6 caractères.";
      msg.style.color = "red";
      return;
    }

    try {
      // Appel API pour demander la réinitialisation
      const result = await fetchData({
        route: "/api/reset-password",
        api: API_URL,
        options: {
          method: "POST",
          body: JSON.stringify({ email, password }),
        },
      });

      if (result.success) {
        msg.textContent =
          "Votre mot de passe a été réinitialisé. Vérifiez votre boîte mail pour le lien de confirmation.";
        msg.style.color = "green";
        form.reset();
      } else {
        msg.textContent = result.error || "Erreur lors de la réinitialisation.";
        msg.style.color = "red";
      }
    } catch (error) {
      msg.textContent = error.message || "Erreur serveur.";
      msg.style.color = "red";
    }
  });
});
