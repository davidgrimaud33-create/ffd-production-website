// Aktuelle Projekte: Statuszeile, Finanzierungsbalken, Unterstützen-Dialog, Hotline, Kontodaten ohne JS.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { startServer, openPage } from './helpers.mjs';
import { chromium } from 'playwright-core';

let srv;
before(async () => { srv = await startServer(); });
after(async () => { await srv.close(); });

// BANK aus dem alten main.js (Quelle der Wahrheit für die Kontodaten)
const OLD = execSync('git show main:public/js/main.js', { cwd: new URL('..', import.meta.url).pathname, encoding: 'utf8' });
const pick = (k) => OLD.match(new RegExp(`const BANK=\\{[^}]*${k}:'([^']+)'`))[1];
const BANK = { name: pick('name'), iban: pick('iban'), ref: pick('ref') };

const cf = (o = {}) => ({ status: 'vorproduktion', ziel: 7500, gesammelt: 0, unterstuetzende: 0, stand: '2026-11-15', ...o });

async function withCf(fixture, fn, opts = {}) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await (await browser.newContext({ viewport: { width: opts.width || 1440, height: 900 } })).newPage();
  await page.route('**/data/crowdfunding.json', (r) => r.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(fixture) }));
  try { await page.goto(srv.url + '/', { waitUntil: 'load' }); await fn(page); } finally { await browser.close(); }
}

test('status line', async () => {
  await withCf(cf(), async (page) => {
    await page.waitForFunction(() => document.querySelector('#cf-goal')?.textContent.trim() === '7.500 €');
    assert.match(await page.$eval('#cf-status', (e) => e.textContent), /In Vorproduktion/);
    assert.equal(await page.$eval('.cf-bar', (e) => e.hidden), true);
    assert.equal(await page.$eval('.cf-bar', (e) => getComputedStyle(e).display), 'none');
  });
});

test('progress bar', async () => {
  await withCf(cf({ gesammelt: 2850 }), async (page) => {
    await page.waitForFunction(() => /2\.850 € von 7\.500 € erreicht/.test(document.querySelector('#cf-text')?.textContent || ''));
    assert.equal(await page.$eval('.cf-bar', (e) => getComputedStyle(e).display !== 'none'), true);
    await page.evaluate(() => document.querySelector('.cf-bar').scrollIntoView({ block: 'center' }));
    await page.waitForFunction(() => {
      const b = document.querySelector('.cf-bar'), i = b.querySelector('i');
      return Math.round(i.getBoundingClientRect().width / b.getBoundingClientRect().width * 100) === 38;
    });
  });
});

test('support dialog', async () => {
  await withCf(cf(), async (page) => {
    await page.click('[data-open="bank"]');
    await page.waitForSelector('#dlg-bank[open]');
    assert.equal(await page.$eval('#b-name', (e) => e.textContent.trim()), BANK.name);
    assert.equal(await page.$eval('#b-iban', (e) => e.textContent.trim()), BANK.iban);
    assert.equal(await page.$eval('#b-ref', (e) => e.textContent.trim()), BANK.ref);
    await page.waitForSelector('#qr svg');
    assert.ok(await page.$('#dlg-bank a[href^="https://paypal.me/"]'));
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('#dlg-bank').open);
  });
});

test('dialog fields at 1440: label above value, IBAN on one line', async () => {
  await withCf(cf(), async (page) => {
    await page.click('[data-open="bank"]');
    await page.waitForSelector('#dlg-bank[open]');
    const r = await page.$$eval('#dlg-bank .bank .f', (fs) => fs.map((f) => {
      const dt = f.querySelector('dt').getBoundingClientRect(), dd = f.querySelector('dd');
      const range = document.createRange(); range.selectNodeContents(dd);
      const lines = new Set([...range.getClientRects()].map((x) => Math.round(x.top))).size;
      return { id: dd.id, labelAbove: dt.bottom <= dd.getBoundingClientRect().top + 1, lines };
    }));
    assert.equal(r.length, 3);
    for (const f of r) assert.ok(f.labelAbove, `Label über Wert: ${f.id}`);
    assert.equal(r.find((f) => f.id === 'b-iban').lines, 1, 'IBAN in einer Zeile');
    assert.equal(r.find((f) => f.id === 'b-name').lines, 1, 'Kontoinhaber in einer Zeile');
  });
});

test('dialog closes on backdrop click and restarts scrolling', async () => {
  await withCf(cf(), async (page) => {
    await page.click('[data-open="bank"]');
    await page.waitForSelector('#dlg-bank[open]');
    await page.mouse.click(5, 5);
    await page.waitForFunction(() => !document.querySelector('#dlg-bank').open);
    await page.waitForFunction(() => !document.documentElement.classList.contains('lenis-stopped'));
  });
});

test('hotline and texts', async () => {
  const o = await openPage(srv.url + '/');
  try {
    // „Spende“ nur in Farouks Text zu Stufen und Überweisungshinweis (17.11.2026), sonst überall „Unterstützen“
    await o.page.evaluate(() => { document.querySelectorAll('.tiers .is-free, .support-note').forEach((e) => e.remove()); });
    const t = await o.page.$eval('#projekte', (e) => e.innerText);
    assert.ok(t.includes('116 016'));
    assert.ok(t.includes('Dem Schweigen so nah'));
    assert.match(await o.page.$eval('#projekte .project-byline', (e) => e.textContent), /^Kurzfilm · Arbeitstitel · /);
    assert.ok(!t.includes('Kurzfilm (AT)'));
    assert.equal(await o.page.$$eval('#projekte article.project[data-project="schweigen"] .project-media img', (a) => a.length), 1);
    for (const c of ['.project-body', '.project-meta', '.project-team']) assert.equal(await o.page.$$eval('#projekte ' + c, (a) => a.length), 1, c);
    const body = await o.page.$eval('body', (e) => e.innerText + ' ' + [...document.querySelectorAll('[aria-label],[alt],[title]')].map((x) => x.getAttribute('aria-label') + x.alt + x.title).join(' '));
    assert.ok(!/spende/i.test(body));
    assert.ok(!/spende/i.test(await o.page.$eval('#dlg-bank', (e) => e.textContent)));
  } finally { await o.browser.close(); }
});

test('no-JS bank', async () => {
  const o = await openPage(srv.url + '/', { js: false });
  try {
    await o.page.evaluate(() => { document.querySelectorAll('.tiers .is-free, .support-note').forEach((e) => e.remove()); });
    const t = await o.page.$eval('#projekte', (e) => e.innerText);
    assert.ok(t.includes(BANK.name), 'Kontoinhaber ohne JS');
    assert.ok(t.includes(BANK.iban), 'IBAN ohne JS');
    assert.ok(t.includes(BANK.ref), 'Verwendungszweck ohne JS');
    assert.ok(!/spende/i.test(t));
  } finally { await o.browser.close(); }
});

// Farouks Feedback vom 17.11.2026
test('Ziel steht auch im Aufruftext und folgt den CMS-Daten', async () => {
  await withCf(cf({ ziel: 9000 }), async (page) => {
    await page.waitForFunction(() => document.querySelector('#cf-goal-text')?.textContent.trim() === '9.000 Euro');
  });
});

test('Fallback-Ziel im HTML ist 8.500 €', async () => {
  const { openPage: op } = await import('./helpers.mjs');
  const { page, browser } = await op(srv.url + '/', { js: false });
  try {
    assert.equal(await page.$eval('#cf-goal', (e) => e.textContent.trim()), '8.500 €');
    assert.equal(await page.$eval('#cf-goal-text', (e) => e.textContent.trim()), '8.500 Euro');
  } finally { await browser.close(); }
});

test('Dankeschön-Stufen und Hinweise im Abschnitt Unterstützen', async () => {
  await withCf(cf(), async (page) => {
    const rows = await page.$$eval('#unterstuetzen .tiers tbody th', (e) => e.map((x) => x.textContent.trim()));
    assert.deepEqual(rows, ['Freier Betrag', 'ab 15 €', 'ab 30 €', 'ab 60 €', 'ab 100 €', 'ab 150 €', 'ab 250 €', 'ab 400 €', 'ab 1.000 €', 'ab 500 €', 'ab 1.000 €', 'ab 2.500 €', 'ab 5.000 €']);
    const t = await page.$eval('#unterstuetzen', (e) => e.textContent);
    assert.match(t, /Februar 2027/);
    assert.match(t, /keine Spendenquittungen/);
    assert.match(t, /Rechnung/);
  });
});

test('Projektdaten: Drehbuch, neue Handlung, BKA-Quelle', async () => {
  await withCf(cf(), async (page) => {
    const t = await page.$eval('#projekte', (e) => e.textContent);
    assert.match(t, /Drehbuch\s*Stine Volkmann/);
    assert.doesNotMatch(t, /Exposé/);
    assert.match(t, /Steffi ist Polizistin\. Sie hat gelernt, genau hinzusehen\./);
    assert.doesNotMatch(t, /Jörg/);
    assert.match(t, /265\.942 Opfer häuslicher Gewalt/);
    assert.match(t, /Quelle: Bundeskriminalamt, Lagebild Häusliche Gewalt 2024/);
    assert.doesNotMatch(t, /UN Women/);
  });
});

test('Startbild: Hinweis auf den Film, Knopf öffnet den Dialog', async () => {
  await withCf(cf(), async (page) => {
    assert.match(await page.$eval('#intro', (e) => e.textContent), /Dem Schweigen so nah/);
    await page.click('#intro [data-open="bank"]');
    await page.waitForSelector('#dlg-bank[open]');
  });
});

test('Startbild ohne JS: Knopf führt zum Abschnitt Unterstützen', async () => {
  const { page, browser } = await openPage(srv.url + '/', { js: false });
  try {
    assert.equal(await page.$eval('#intro [data-open="bank"]', (e) => e.getAttribute('href')), '#unterstuetzen');
    assert.ok(await page.$('#unterstuetzen'));
  } finally { await browser.close(); }
});

test('Handy: Plakat bleibt nicht kleben', async () => {
  await withCf(cf(), async (page) => {
    assert.equal(await page.$eval('#projekte .project-media', (e) => getComputedStyle(e).position), 'static');
  }, { width: 390 });
});
