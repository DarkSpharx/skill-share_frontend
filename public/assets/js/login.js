import { fetchData } from "../../lib/fetchData.js";
import { AuthManager } from "../../services/auth.js";
import { validateRegisterForm } from "../../services/validate.js";

document.addEventListener("DOMContentLoaded", () => {
  // rediriger la page si l'utilisateur est déjà connecté
  if (AuthManager.isLoggedIn()) {
    window.location.href = "/";
    return;
  }

  const loginform = document.querySelector("#login-form");
  const msg = document.querySelector("#verify-msg");
  const API_URL = document.querySelector("#api-url").value;

  loginform.addEventListener("submit", async (e) => {
    e.preventDefault();

    loginform
      .querySelectorAll(".error")
      .forEach((span) => (span.textContent = ""));
    loginform
      .querySelectorAll(".input")
      .forEach((input) => input.classList.remove("error-input"));
    // validation des données
    const { valid, errors } = validateRegisterForm(loginform);

    if (!valid) {
      // si les données ne sont pas valides, on affiche les erreurs
      for (const [field, message] of Object.entries(errors)) {
        const errorSpan = loginform.querySelector(`[data-error="${field}"]`);
        if (errorSpan) {
          errorSpan.textContent = message;
          errorSpan.classList.add("error");
        }
        const input = loginform.querySelector(`[name="${field}"]`);
        if (input) {
          input.classList.add("error-input");
        }
      }
      return;
    }

    // recupération des saisies via les attributes "name" => clé:valeur
    const formData = new FormData(loginform);

    const jsonData = {};
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });

    try {
      const result = await fetchData({
        route: "/api/login",
        api: API_URL,
        options: {
          method: "POST",
          body: JSON.stringify(jsonData),
        },
      });
      if (!result.success) {
        throw new Error(result.error);
      }
      if (result.success) {
        // stockage du token dans le localStorage
        localStorage.setItem("JWTtoken", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));

        // message de succès et redirection
        msg.textContent = `Bienvenu ${result.user.username} !`;
        msg.style.color = "green";
        msg.style.textAlign = "center";

        // mise a jour de la barre de navigation
        AuthManager.updateNavbar();

        setTimeout(() => {
          window.location.href = "/";
        }, 2000); // 2 secondes
      }
    } catch (error) {
      msg.textContent = error.message;
      msg.style.color = "red";
      msg.style.textAlign = "center";
    }
  });
});
