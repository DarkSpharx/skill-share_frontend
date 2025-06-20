import { fetchData } from "../../lib/fetchData.js";
import { AuthManager } from "../../services/auth.js";
import { validateRegisterForm } from "../../services/validate.js";

function updateProfileTitle() {
  const user = AuthManager.getUser();
  if (user && user.username) {
    document.getElementById("profile-title").textContent = `${user.username} `;
    document.getElementById("profile-title").style.color = "#f9b233";
  }
}

// Appel initial
updateProfileTitle();

document.addEventListener("DOMContentLoaded", () => {
  const API_URL = document.querySelector("#api-url").value;
  const infoForm = document.querySelector("#info-form");
  const msg = document.querySelector(".verify-msg");

  // désactiver le boutton subbmit
  const submitInfoButton = infoForm.querySelector("button");
  submitInfoButton.setAttribute("disabled", true);

  if (
    !AuthManager.isLoggedIn("Vous devez etre connecté pour voir votre profil")
  ) {
    return;
  }

  const user = AuthManager.getUser();

  if (!user) {
    AuthManager.logout();
    return;
  }

  const usernameInput = document.querySelector("#username");
  const emailInput = document.querySelector("#email");
  // Gestion des infos actuelles du user connecté
  usernameInput.value = user.username;
  emailInput.value = user.email;

  usernameInput.addEventListener("change", () => {
    submitInfoButton.removeAttribute("disabled");
  });

  emailInput.addEventListener("change", () => {
    submitInfoButton.removeAttribute("disabled");
  });

  infoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    // Réinitialiser les messages d'erreurs
    infoForm
      .querySelectorAll(".error")
      .forEach((span) => (span.textContent = ""));

    const { valid, errors, data } = validateRegisterForm(infoForm);

    if (!valid) {
      for (const [field, message] of Object.entries(errors)) {
        const errorSpan = infoForm.querySelector(`[data-error="${field}"]`);
        if (errorSpan) errorSpan.textContent = message;
        const input = document.querySelector(`[name="${field}"]`);
        if (input) {
          input.classList.add("error-input");
        }
      }

      msg.textContent = "";
      return;
    }
    const infoData = new FormData(infoForm);
    const jsonData = {};
    infoData.forEach((value, key) => {
      jsonData[key] = value;
    });
    try {
      const result = await fetchData({
        route: "/api/user/update",
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
        // mise à jour du user en local
        const updateUser = { ...user, ...jsonData };
        localStorage.setItem("user", JSON.stringify(updateUser));
        msg.textContent = result.message;
        msg.style.color = "green";
        AuthManager.updateNavbar();
        updateProfileTitle();
      }
    } catch (error) {
      msg.textContent = error.message;
      msg.style.color = "red";
    }
  });

  // traitement du changement d'avatar (pas le film)
  const avatarImg = document.getElementById("user-avatar");
  const UPLOADS_URL = document.getElementById("uploads-url")?.value;

  if (user.avatar) {
    avatarImg.src = `${API_URL}/uploads/avatar/${user.avatar}`;
  } else {
    avatarImg.src = "/images/default-avatar.png";
  }

  // Gérer le formulaire d'avatar
  const avatarForm = document.getElementById("avatar-form");
  const avatarInput = document.getElementById("avatar-input");
  const avatarMsg = document.getElementById("avatar-msg");

  avatarForm?.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Préparer le fichier pour l'upload
    const formData = new FormData();
    const file = avatarInput.files[0];
    if (!file) {
      avatarMsg.textContent = "Veuillez sélectionner un fichier";
      avatarMsg.className = "error";
      return;
    }
    formData.append("avatar", file);

    try {
      const result = await fetchData({
        route: "/api/user/update-avatar",
        api: API_URL,
        options: {
          method: "POST",
          body: formData,
        },
      });

      if (result.success) {
        // Mettre à jour l'avatar dans le localStorage
        const updatedUser = { ...user, avatar: result.avatar };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // Mettre à jour l'image
        avatarImg.src = `${API_URL}/uploads/avatar/${updatedUser.avatar}`;
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'avatar:", error);
    }
  });

  // Gérer la demande de réinitialisation du mot de passe
  const resetBtn = document.getElementById("request-reset-btn");
  const resetMsg = document.getElementById("reset-msg");

  resetBtn?.addEventListener("click", async () => {
    try {
      const result = await fetchData({
        route: "/api/user/request-reset",
        api: API_URL,
        options: {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email }),
        },
      });

      if (result.success) {
        resetMsg.textContent = "Un email de réinitialisation vous a été envoyé";
        resetMsg.className = "success";
        resetBtn.disabled = true;
      }
    } catch (error) {
      resetMsg.textContent = error.message || "Erreur lors de la demande";
      resetMsg.className = "error";
    }
  });
});
