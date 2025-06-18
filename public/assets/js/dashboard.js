import { AuthManager } from "../../services/auth.js";

window.addEventListener("DOMContentLoaded", () => {
  console.log(AuthManager.checkAdminAccess());
  if (!AuthManager.checkAdminAccess()) {
    return;
  }
  console.log("dashboard admin OK");
});
