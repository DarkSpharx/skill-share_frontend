export class AuthManager {
  static isLoggedIn() {
    const token = localStorage.getItem("JWTtoken");
    // routes nécessitant une connexion
    const protectedPaths = ["/account"];
    const currentPath = window.location.pathname;

    if (!token || this.isTokenExpired(token)) {
      this.logout();
      if (protectedPaths.includes(currentPath)) {
        window.location.href = `/login?redirect=${encodeURIComponent(
          currentPath
        )}`;
      }
      return false;
    }
    return true;
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
    const isAdmin = this.isAdmin();

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

  static isAdmin() {
    const roleStr = localStorage.getItem("role");
    if (!roleStr) return false;
    try {
      const roles = JSON.parse(roleStr);
      return Array.isArray(roles) && roles.includes("ROLE_ADMIN");
    } catch {
      return false;
    }
  }

  static logout() {
    localStorage.removeItem("JWTtoken");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
  }
}
