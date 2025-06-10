import { fetchData } from "../../lib/fetchData.js";
import { validateRegisterForm } from "../../services/validate.js";

document.addEventListener("DOMContentLoaded", () => {
  //redirection si déja connecté
  const registerForm = document.querySelector("#register-form");
  const API_URL = document.querySelector("#api-url").value;
  console.log(API_URL);
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    // réinitialisation des champs erreurs à vide
    registerForm
      .querySelectorAll(".error")
      .forEach((span) => (span.textContent = ""));
    registerForm
      .querySelectorAll(".input")
      .forEach((input) => input.classList.remove("error-input"));
    // validation des données
    const { valid, errors } = validateRegisterForm(registerForm);

    if (!valid) {
      // si les données ne sont pas valides, on affiche les erreurs
      for (const [field, message] of Object.entries(errors)) {
        const errorSpan = registerForm.querySelector(`[data-error="${field}"]`);
        if (errorSpan) {
          errorSpan.textContent = message;
          errorSpan.classList.add("error");
        }
        const input = registerForm.querySelector(`[name="${field}"]`);
        if (input) {
          input.classList.add("error-input");
        }
      }
      return;
    }
    // recupération des saisies via les attributes "name" => clé:valeur
    const formData = new FormData(registerForm);

    const jsonData = {};
    formData.forEach((value, key) => {
      if (key !== "avatar") {
        jsonData[key] = value;
      }
    });

    try {
      const result = await fetchData({
        route: "/api/register",
        api: API_URL,
        options: {
          method: "POST",
          body: JSON.stringify(jsonData),
        },
      });
    } catch (error) {
      // messsage utilisateur
    }
  });
});
