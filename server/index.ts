// server/index.ts
import express, { type Request, type Response, type NextFunction } from "express";
import { createServer } from "node:http";
import type { Server } from "node:http";
import { registerRoutes } from "./routes.js";

// ----- App de base
const app = express();

// Sécurité/réseau de base
app.disable("x-powered-by");
app.set("trust proxy", true);

// Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logger simple
let log: ((msg: string) => void) | undefined;
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    log?.(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms)`);
  });
  next();
});

// Healthcheck
app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok" });
});

// Routes applicatives
registerRoutes?.(app);

// HTTP server
const server: Server = createServer(app);

// ----- Bootstrap async (DEV = Vite, PROD = fichiers statiques)
(async () => {
  if (process.env.NODE_ENV !== "production") {
    const { setupVite, log: viteLog } = await import("./vite.js");
    log = viteLog;
    await setupVite?.(app, server);
  } else {
    const { serveStatic, log: viteLog } = await import("./vite.js");
    log = viteLog;
    serveStatic?.(app);
  }

  const port = parseInt(process.env.PORT ?? "3000", 10);
  server.listen({ port, host: "0.0.0.0" }, () => log?.(`✅ serving on port ${port}`));
})().catch((err) => {
  console.error("Fatal bootstrap error:", err);
  process.exit(1);
});

