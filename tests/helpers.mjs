// Test-Helfer: statischer Server auf public/ und Chrome über playwright-core (channel 'chrome').
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, normalize, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp',
  '.woff2': 'font/woff2', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8',
};

export function startServer() {
  const server = http.createServer(async (req, res) => {
    try {
      let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      if (path.endsWith('/')) path += 'index.html';
      const file = normalize(join(ROOT, path));
      if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
      const s = await stat(file).catch(() => null);
      if (!s || !s.isFile()) { res.writeHead(404).end('not found'); return; }
      res.writeHead(200, { 'content-type': TYPES[extname(file).toLowerCase()] || 'application/octet-stream', 'cache-control': 'no-store' });
      res.end(await readFile(file));
    } catch (e) { res.writeHead(500).end(String(e)); }
  });
  return new Promise((resolve) => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ url: `http://127.0.0.1:${port}`, close: () => new Promise((r) => server.close(() => r())) });
    });
  });
}

export async function openPage(url, { width = 1440, height = 900, js = true, reducedMotion = false } = {}) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const context = await browser.newContext({
    viewport: { width, height }, javaScriptEnabled: js,
    reducedMotion: reducedMotion ? 'reduce' : 'no-preference',
  });
  const page = await context.newPage();
  const external = [];
  page.on('request', (req) => {
    const u = new URL(req.url());
    if (u.protocol === 'data:' || u.protocol === 'blob:' || u.protocol === 'about:') return;
    if (!['127.0.0.1', 'localhost'].includes(u.hostname)) external.push(req.url());
  });
  await page.goto(url, { waitUntil: 'load' });
  return { page, browser, external };
}
