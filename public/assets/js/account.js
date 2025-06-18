import { fetchData } from "../../lib/fetchData.js";
import { AuthManager } from "../../services/auth.js";

document.addEventListener("DOMContentLoaded", () => {
  const API_URL = document.querySelector("#api-url").value;
  const infoForm = document.querySelector("#info-form");
  const msg = document.querySelector("#verify-msg");

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

  // gestion des infos du user connecté (ici le pseudo username)
  document.querySelector("#username").value = user.username;

  infoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const infoData = new FormData(infoForm);

    //////////////////////////////// C LA MERDE ///////////////////////////////////////////////
    try {
      const result = await fetchData({
        route: "/api/user/update",
        api: API_URL,
        options: {
          method: "POST",
          body: JSON.stringify(infoData),
        },
      });
      if (!result.success) {
        throw new Error(result.error);
      }
      if (result.success) {
        result.message;
        msg.textContent = `Bienvenu ${result.user.username} !`;
        msg.style.color = "green";
        msg.style.textAlign = "center";

        const jsonData = {};
        formData.forEach((value, key) => {
          if (key !== "avatar") {
            jsonData[key] = value;
          }
        });
      }
    } catch (error) {
      msg.textContent = error.message;
      msg.style.color = "red";
      msg.style.textAlign = "center";
    }
  });
});
