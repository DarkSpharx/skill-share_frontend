export class AuthManager {
  static isLoggedIn() {
    // return !!localStorage.getItem("JWTtoken"); // les deux "!" transforme en boolean le return
    if (!token || this.isTokenExpired()) {
      const currentPath = encodeURIComponent(window.location.pathname);
      this.logout();
      window.location.href = `/connexion?redirect=${currentPath}`;
      return false;
    }
    return true;
  }

  // méthode pour récupérer le role (user ou admin)
  static getUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }
  // modification de la nav selon si on est déja connecté ou pas
  static updateNavbar() {
    const navLinks = document.querySelector(".nav-links");

    if (!navLinks) {
      console.log("Element UL non trouvé");
      return;
    }
    const isLoggedIn = this.isLoggedIn();
    const user = this.getUser();

    if (isLoggedIn && user) {
      navLinks.innerHTML = `
      <li><a href="#" id="logout-btn">Déconnexion</a></li>
      <li><a href="/shareskill">Partager vos compétences</a></li>
      <li><a href="/account">Profil</a></li>
      `;

      const logoutBtn = document.querySelector("#logout-btn");
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        this.logout();
        window.location.href = "/";
      });
    }
  }

  static logout() {
    localStorage.removeItem("JWTtoken");
    localStorage.removeItem("user");
  }
}
