import express from "express";
import helmet from "helmet";
import path from "path";
import indexRoutes from "./routes/index.js";
import dotenv from "dotenv";
// configuration du .env
dotenv.config();
// création de l'application
const app = express();
const API_URL = process.env.API_URL;
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "localhost:*",
        ],
        connectSrc: ["'self'", "ws://localhost:*", API_URL],
        imgSrc: ["'self'", "data:", "blob:", API_URL],
        styleSrc: ["'self'", "'unsafe-inline'"],
        formAction: ["'self'"],
        baseUri: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: false,
  })
);
const __dirname__ = path.resolve();
// initialisation du moteur de templates
app.set("view engine", "ejs");
app.set("views", path.join(__dirname__, "views"));
// configuration des assets static => /public
app.use(express.static(path.join(__dirname__, "public")));
// import du router
app.use("/", indexRoutes);
// mise en écoute du serveur
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Serveur disponoble ici : http://localhost:${PORT}`);
});
