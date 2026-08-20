import 'dotenv/config';
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 5173;

// Backend API URL — read from environment variable, fallback to local dev URL
const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:5000';

// Proxy API calls to the main Atideto backend (MongoDB source of truth)
app.use(createProxyMiddleware({
  target: BACKEND_URL,
  changeOrigin: true,
  pathFilter: (path) => path.startsWith('/api/'),
}));

// Serve static files
app.use(express.static(__dirname));

// SPA fallback for client-side routing
app.get('*', (req, res) => {
  // For /verify routes, serve verify.html
  if (req.path.startsWith('/verify')) {
    return res.sendFile(join(__dirname, 'verify.html'));
  }
  // For /preview routes, serve preview.html
  if (req.path.startsWith('/preview')) {
    return res.sendFile(join(__dirname, 'preview.html'));
  }
  // For /offer-letter routes, serve offer-letter-preview.html
  if (req.path.startsWith('/offer-letter')) {
    return res.sendFile(join(__dirname, 'offer-letter-preview.html'));
  }
  // Default to index.html
  res.sendFile(join(__dirname, 'index.html'));
});

const server = app.listen(PORT, '::', () => {
  console.log(`ATIDETO Certificate Frontend: http://localhost:${PORT}`);
  console.log(`  Dashboard : http://localhost:${PORT}/`);
  console.log(`  Preview   : http://localhost:${PORT}/preview.html`);
  console.log(`  Offer Letter Preview: http://localhost:${PORT}/offer-letter-preview.html`);
  console.log(`  Verify    : http://localhost:${PORT}/verify.html`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`\n[INFO] Port ${PORT} is already active at http://localhost:${PORT}`);
    console.log(`  Dashboard : http://localhost:${PORT}/`);
    console.log(`  Offer Letter Preview: http://localhost:${PORT}/offer-letter-preview.html\n`);
    process.exit(0);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});
