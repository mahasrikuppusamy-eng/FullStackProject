import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import app from './server/src/app.js';
import { connectDB } from './server/src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

async function bootstrap() {
  // Connect to DB or init memory store with 15 Coimbatore places
  await connectDB();

  if (!isProduction) {
    // In dev mode, mount Vite dev server as middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    // Serve static client build
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌐 AccessAble full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal server boot error:', err);
  process.exit(1);
});
