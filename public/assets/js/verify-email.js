import { fetchData } from "../../lib/fetchData.js";

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const msg = document.querySelector("#verify-msg");
  const API_URL = document.querySelector("#api-url").value;
  const loginLink = document.querySelector("#login-link");

  if (!token) {
    msg.textContent = "Token non trouvé!";
    msg.style.color = "red";
    return;
  }

  try {
    const result = await fetchData({
      route: "/api/verify-email",
      api: API_URL,
      options: {
        params: { token },
      },
    });
    if (result.success) {
      msg.textContent = result.message;
      msg.style.color = "green";
      loginLink.style.display = "block";
    }
  } catch (error) {
    msg.textContent =
      "Problème dans la vérification de votre email, veuillez contacter l'administrateur : ";
    const contactButton = document.createElement("a");
    contactButton.setAttribute("href", "mailto:adminfred@skillshare.com");
    contactButton.textContent = "Contactez-nous";
    msg.append(contactButton);
    msg.style.color = "red";
  }
});
