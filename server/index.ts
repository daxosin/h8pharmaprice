// server/index.ts
import express, { type Request, type Response, type NextFunction } from "express";
import { createServer } from "node:http";

// Ces imports existent déjà dans ton projet selon tes captures
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";

const app = express();

// Sécurité/réseau de base
app.disable("x-powered-by");
app.set("trust proxy", true);

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Petit middleware de log (durée, statut)
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    log?.(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
  });
  next();
});

// Route santé (pour tests/monitoring)
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Tes routes applicatives
registerRoutes?.(app);

// HTTP server (utile pour Vite en dev ou WebSocket)
const server = createServer(app);

// Bootstrap asynchrone pour gérer DEV/PROD
(async () => {
  // En DEV: Vite middleware; en PROD: fichiers statiques (build Vite)
  if (app.get("env") === "development") {
    await setupVite?.(app, server);
  } else {
    serveStatic?.(app);
  }

  // IMPORTANT: port dynamique pour Coolify/containers
  const port = parseInt(process.env.PORT || "3000", 10);

  server.listen(
    { port, host: "0.0.0.0", reusePort: true },
    () => log?.(`✅ serving on port ${port}`)
  );
})().catch((err) => {
  console.error("Fatal bootstrap error:", err);
  process.exit(1);
});
