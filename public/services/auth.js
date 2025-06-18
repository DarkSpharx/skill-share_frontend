export class AuthManager {
  static isLoggedIn(message) {
    // return !!localStorage.getItem('JWTtoken');
    const token = localStorage.getItem("JWTtoken");
    // Routes sans connexion

    if (!token || this.isTokenExpired(token)) {
      this.redirectUserToLogin(message);
      return false;
    }
    return true;
  }

  static redirectUserToLogin(message) {
    // console.log(message);
    const notAllowedPaths = ["%2Fcompetences", "%2Faccount", "%2Fdashboard"];
    const currentPath = encodeURIComponent(window.location.pathname);
    this.logout();
    if (notAllowedPaths.includes(currentPath)) {
      window.location.href = `/login?redirect=${currentPath}${
        message ? `&message=${encodeURIComponent(message)}` : ""
      }`;
    }
    return false;
  }

  static hasRole(role) {
    const token = localStorage.getItem("JWTtoken");
    if (!token) return false;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role.includes(`ROLE_${role}`);
  }

  // Vérifie si le token est expiré
  static isTokenExpired(token) {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp < Date.now() / 1000;
    } catch {
      return true;
    }
  }

  // Récupère l'utilisateur courant
  static getUser() {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  }

  // Met à jour la navbar selon l'état de connexion
  static updateNavbar() {
    const navLinks = document.querySelector(".nav-links");

    if (!navLinks) {
      console.log("Element UL non trouvé");
      return;
    }
    const isLoggedIn = this.isLoggedIn();
    const user = this.getUser();
    // const isAdmin = this.isAdmin();
    const isAdmin = this.hasRole("ADMIN");

    if (isLoggedIn && user) {
      navLinks.innerHTML = `
        <li><a href="#" id="logout-btn">Déconnexion</a></li>
        <li><a href="/shareskill">Partagez vos compétences</a></li>
        ${
          isAdmin
            ? '<li><a href="/dashboard"><i class="fas fa-user-gear"></i> Dashboard</a></li>'
            : `<li><a href="/account"><i class="fas fa-user"></i> ${user.username}</a></li>`
        }
      `;

      const logoutBtn = document.querySelector("#logout-btn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", (e) => {
          e.preventDefault();
          this.logout();
          window.location.href = "/";
        });
      }
    }
  }

  static checkAdminAccess() {
    this.isLoggedIn();
    console.log(this.hasRole("ADMIN"));

    if (!this.hasRole("ADMIN")) {
      console.warn("Accés refusé : utilisateur non admin");
      this.redirectUserToLogin(
        "Vous devez etre admin pour accéder au dashboard"
      );
      return false;
    }
    return true;
  }

  static logout() {
    localStorage.removeItem("JWTtoken");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    document.cookie =
      "JWTtoken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
}
