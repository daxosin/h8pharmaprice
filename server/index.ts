import express, { type Request, type Response, type NextFunction } from "express";
import { createServer } from "node:http";

// Importation conditionnelle selon l'environnement
import { registerRoutes } from "./routes";
if (process.env.NODE_ENV !== "production") {
  // DEV : Utilisation de Vite (middleware)
  const { setupVite, log } = await import("./vite.js");
  const server = createServer(app);

  // Bootstrapping asynchrone pour configurer DEV ou PROD
  await setupVite(app, server); // Serveur en mode DEV (rechargement à chaud)
} else {
  // PROD : Servir les fichiers statiques
  const { serveStatic } = await import("./vite.js");
  serveStatic(app); // Serve les fichiers statiques en mode production
}

const app = express();

// Sécurité/réseau de base
app.disable("x-powered-by");
app.set("trust proxy", true);

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enregistrement des routes
registerRoutes(app);

// Gestion du port dynamique pour Coolify/containers
const port = parseInt(process.env.PORT || "3000", 10);

server.listen(port, () => {
  log(`✅ Serving on port ${port}`);
}).catch((err) => {
  console.error("Fatal bootstrap error:", err);
});
