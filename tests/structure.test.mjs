// Gerüst der Startseite: Abschnitte, Pfeile, Titel, keine externen Requests, ohne JS, Scrollen, Anker-Alias.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer, openPage } from './helpers.mjs';

const IDS = ['intro', 'news', 'projekte', 'abgeschlossen', 'vita-ffd', 'geschichte', 'gruender', 'vita', 'kontakt'];
const ARROWS = {
  intro: ['News', '#news'],
  news: ['Aktuelle Projekte', '#projekte'],
  projekte: ['Abgeschlossene Projekte', '#abgeschlossen'],
  abgeschlossen: ['Vita FFD Production', '#vita-ffd'],
  'vita-ffd': ['Geschichte', '#geschichte'],
  geschichte: ['Der Gründer', '#gruender'],
  gruender: ['Vita', '#vita'],
  vita: ['Kontakt', '#kontakt'],
  kontakt: ['Nach oben', '#intro'],
};

let srv;
before(async () => { srv = await startServer(); });
after(async () => { await srv.close(); });

async function withPage(path, opts, fn) {
  const o = await openPage(srv.url + path, opts);
  try { await fn(o); } finally { await o.browser.close(); }
}
const topOf = (page, id) => page.$eval('#' + id, (el) => el.getBoundingClientRect().top);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

test('sections in order', async () => {
  await withPage('/', {}, async ({ page }) => {
    const ids = await page.$$eval('main > section', (s) => s.map((x) => x.id));
    assert.deepEqual(ids, IDS);
  });
});

test('arrow labels', async () => {
  await withPage('/', {}, async ({ page }) => {
    for (const id of IDS) {
      const [label, href] = ARROWS[id];
      const got = await page.$eval(`#${id} > .next`, (a) => ({ text: a.textContent.trim(), href: a.getAttribute('href') }));
      assert.equal(got.text, label, `Label in #${id}`);
      assert.equal(got.href, href, `Ziel in #${id}`);
    }
  });
});

test('title', async () => {
  await withPage('/', {}, async ({ page }) => {
    assert.equal(await page.title(), 'FFD Production – Unabhängige Filmproduktion aus Berlin');
    const desc = await page.$eval('meta[name=description]', (m) => m.content.trim());
    assert.ok(desc.length > 0);
  });
});

test('no external requests', async () => {
  await withPage('/', {}, async ({ page, external }) => {
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); }
      window.scrollTo(0, document.body.scrollHeight);
    });
    await wait(500);
    assert.deepEqual(external, []);
    assert.equal(await page.$$eval('iframe', (f) => f.length), 0);
  });
});

test('no-JS shows all sections', async () => {
  await withPage('/', { js: false }, async ({ page }) => {
    const res = await page.$$eval('main > section', (s) => s.map((x) => ({ id: x.id, h: x.offsetHeight, t: x.innerText.trim().length })));
    assert.equal(res.length, IDS.length);
    for (const r of res) {
      assert.ok(r.h >= 300, `#${r.id} Höhe ${r.h}`);
      assert.ok(r.t > 0, `#${r.id} ohne Text`);
    }
  });
});

test('arrow click scrolls', async () => {
  await withPage('/', {}, async ({ page }) => {
    await page.click('#intro .next');
    await wait(2000);
    const t = await topOf(page, 'news');
    assert.ok(t >= -5 && t <= 80, `#news top ${t}`);
  });
});

test('deep link + alias', async () => {
  await withPage('/#vita', {}, async ({ page }) => {
    await wait(1000);
    const t = await topOf(page, 'vita');
    assert.ok(t >= -5 && t <= 80, `#vita top ${t}`);
  });
  await withPage('/#projekt', {}, async ({ page }) => {
    await wait(1000);
    assert.equal(await page.evaluate(() => location.hash), '#projekte');
    const t = await topOf(page, 'projekte');
    assert.ok(t >= -5 && t <= 80, `#projekte top ${t}`);
  });
});

test('reduced motion', async () => {
  await withPage('/', { reducedMotion: true }, async ({ page }) => {
    assert.equal(await page.evaluate(() => window.FFD && window.FFD.lenis), null);
    await page.click('#intro .next');
    await wait(100);
    const t = await topOf(page, 'news');
    assert.ok(t >= -5 && t <= 80, `#news top ${t}`);
  });
});

test('no spenden', async () => {
  await withPage('/', {}, async ({ page }) => {
    const text = await page.evaluate(() => document.body.innerText);
    assert.doesNotMatch(text, /spend/i);
  });
});
