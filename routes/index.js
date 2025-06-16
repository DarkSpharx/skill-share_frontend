import express from "express";
const router = express.Router();

const globals = {
  API_URL: process.env.API_URL || "http://localhost:8000",
};

router.get("/", (req, res) => {
  res.render("layout", { title: "Accueil", view: "pages/home" });
});

router.get("/register", (req, res) => {
  res.render("layout", {
    title: "Inscription",
    view: "pages/register",
    ...globals,
  });
});

router.get("/verify-email", (req, res) => {
  res.render("layout", {
    title: "Vérification email",
    view: "pages/verify-email",
    ...globals,
  });
});

router.get("/login", (req, res) => {
  res.render("layout", {
    title: "Connexion",
    view: "pages/login",
    ...globals,
  });
});

router.get("/reset-password", (req, res) => {
  res.render("layout", {
    title: "Réinitialisation mot de passe",
    view: "pages/reset-password",
    ...globals,
  });
});

router.get("/account", (req, res) => {
  res.render("layout", {
    title: "Profile",
    view: "pages/account",
    ...globals,
  });
});

export default router;
