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
  // Récupère le token JWT depuis le cookie ou le header Authorization
  const token =
    req.cookies?.JWTtoken ||
    req.headers.authorization?.replace("Bearer ", "") ||
    null;

  if (!token) {
    // Pas de token, accès refusé
    return res.status(404).render("layout", {
      title: "404",
      view: "pages/404",
    });
  }

  try {
    // Vérifie et décode le token
    const payload = jwt.verify(token, JWT_SECRET);

    // Vérifie le rôle
    if (
      payload &&
      payload.role &&
      Array.isArray(payload.role) &&
      payload.role.includes("ROLE_ADMIN")
    ) {
      return res.render("layout", {
        title: "Dashboard",
        view: "pages/dashboard",
        ...globals,
      });
    }
  } catch (e) {
    // Token invalide ou expiré
  }

  // Si pas admin ou erreur, affiche la 404
  return res.status(404).render("layout", {
    title: "404",
    view: "pages/404",
  });
});

export default router;
