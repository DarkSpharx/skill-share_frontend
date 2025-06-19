import express from "express";
import jwt from "jsonwebtoken";
const router = express.Router();

const globals = {
  API_URL: process.env.API_URL || "http://localhost:8000",
};

const JWT_SECRET = process.env.JWT_SECRET_KEY || "votre_clé_secrète"; // Mets la même clé que dans ton backend

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
    title: "Profil",
    view: "pages/account",
    username: req.user ? req.user.username : "", // Ajoute cette ligne
    ...globals,
  });
});

router.get("/shareskill", (req, res) => {
  res.render("layout", {
    title: "Partagez vos compétences",
    view: "pages/shareskill",
    ...globals,
  });
});

router.get("/dashboard", (req, res) => {
  res.render("layout", {
    title: "Dashboard",
    view: "pages/dashboard",
    ...globals,
  });
});

// Cette route doit être placée en dernier pour capturer toutes les routes non définies
router.use((req, res, next) => {
  console.log("Route 404 activée pour:", req.path); // Log pour le débogage
  return res.status(404).render("layout", {
    title: "404",
    view: "pages/404",
    ...globals,
  });
});

export default router;
