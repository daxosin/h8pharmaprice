// server/vite.js

import { createServer as createViteServer } from 'vite';
import path from 'path';

export async function setupVite(app, server) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom',
    root: process.cwd(),
  });

  // Utilisation de Vite comme middleware dans Express
  app.use(vite.middlewares);
  console.log("✅ Vite dev server running");
}

export function serveStatic(app) {
  const root = path.resolve(__dirname, '../dist');
  app.use(express.static(root));
  console.log("✅ Serving static files in production");
}

export function log(message) {
  console.log(message);
}
