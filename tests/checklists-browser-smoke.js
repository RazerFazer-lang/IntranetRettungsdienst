const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const port = 4173;

function mime(file) {
  const ext = path.extname(file).toLowerCase();
  return ({
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.webmanifest': 'application/manifest+json',
  })[ext] || 'application/octet-stream';
}

const server = http.createServer((req, res) => {
  const requestPath = decodeURIComponent((req.url || '/').split('?')[0]);
  const relative = requestPath === '/' ? '/index.html' : requestPath;
  const file = path.join(root, relative);
  if (!file.startsWith(root)) {
    res.writeHead(403); res.end(); return;
  }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, {'Content-Type': mime(file), 'Cache-Control': 'no-store'});
    res.end(data);
  });
});

(async () => {
  await new Promise(resolve => server.listen(port, '127.0.0.1', resolve));
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', err => errors.push(`pageerror: ${err.message}`));
  page.on('console', msg => { if (msg.type() === 'error') errors.push(`console: ${msg.text()}`); });

  try {
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle', timeout: 10000 });

    await page.locator('.nav-item[data-view="checklisten"]').click({ timeout: 5000 });
    await page.locator('[data-stable-open="ABCDE"]').waitFor({ state: 'visible', timeout: 5000 });

    await page.locator('[data-stable-open="ABCDE"]').click({ timeout: 5000 });
    await page.getByText('CHECKLISTE / 1 VON 12', { exact: false }).waitFor({ state: 'visible', timeout: 5000 });

    await page.locator('[data-stable-answer="0"]').click({ timeout: 5000 });
    await page.locator('[data-stable-next]').click({ timeout: 5000 });
    await page.getByText('CHECKLISTE / 2 VON 12', { exact: false }).waitFor({ state: 'visible', timeout: 5000 });

    await page.locator('[data-stable-jump="5"]').click({ timeout: 5000 });
    await page.getByText('CHECKLISTE / 6 VON 12', { exact: false }).waitFor({ state: 'visible', timeout: 5000 });

    await page.locator('[data-stable-prev]').click({ timeout: 5000 });
    await page.getByText('CHECKLISTE / 5 VON 12', { exact: false }).waitFor({ state: 'visible', timeout: 5000 });

    await page.locator('[data-stable-back]').click({ timeout: 5000 });
    await page.locator('[data-stable-open="ABCDE"]').waitFor({ state: 'visible', timeout: 5000 });

    if (errors.length) throw new Error(errors.join('\n'));
    console.log('browser checklist smoke test: PASS');
  } finally {
    await browser.close();
    await new Promise(resolve => server.close(resolve));
  }
})().catch(err => {
  console.error(err.stack || err);
  process.exit(1);
});
