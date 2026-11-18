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
    // Ausnahme: Farouks Text zu Stufen und Überweisungshinweis (17.11.2026)
    const text = await page.evaluate(() => { document.querySelectorAll('.tiers .is-free, .support-note').forEach((e) => e.remove()); return document.body.innerText; });
    assert.doesNotMatch(text, /spend/i);
  });
});

test('every content section has exactly one h2 (the section label)', async () => {
  await withPage('/', {}, async ({ page }) => {
    const res = await page.$$eval('main > section:not(#intro)', (s) => s.map((x) => ({
      id: x.id, n: x.querySelectorAll('h2').length, label: x.querySelector('h2')?.classList.contains('label'),
      first: x.querySelector('h1,h2,h3,h4')?.tagName,
    })));
    assert.equal(res.length, 8);
    for (const r of res) {
      assert.equal(r.n, 1, `#${r.id}: ${r.n} h2`);
      assert.ok(r.label, `#${r.id}: h2 ist nicht das Abschnitts-Label`);
      assert.equal(r.first, 'H2', `#${r.id}: erste Überschrift ${r.first}`);
    }
    // keine Ebene übersprungen (h2 → h4 ohne h3)
    const skips = await page.$$eval('main h1, main h2, main h3, main h4', (hs) => {
      const out = []; let prev = 1;
      for (const h of hs) { const l = +h.tagName[1]; if (l > prev + 1) out.push(h.textContent.trim()); prev = l; }
      return out;
    });
    assert.deepEqual(skips, []);
  });
});

test('no placeholder links that jump to top', async () => {
  await withPage('/', {}, async ({ page }) => {
    assert.equal(await page.$$eval('a[href="#"]', (a) => a.length), 0);
    assert.equal(await page.$$eval('.is-placeholder', (e) => e.length), 0);
    assert.doesNotMatch(await page.evaluate(() => document.body.textContent), /liefert Farouk/);
    const links = await page.$$eval('#vita .vita-links a', (a) => a.map((x) => x.href));
    assert.deepEqual(links, ['https://www.filmmakers.eu/de/actors/farouk-el-khalili/video/30141', 'https://agenturfrehse.com/schauspieler/farouk-el-khalili/']);
  });
});

test('noindex, robots.txt und Favicon', async () => {
  const { readFile } = await import('node:fs/promises');
  const root = new URL('../public/', import.meta.url);
  for (const f of ['index.html', 'impressum.html', 'datenschutz.html']) {
    const h = await readFile(new URL(f, root), 'utf8');
    assert.match(h, /<meta name="robots" content="noindex">/, f);
    assert.match(h, /<link rel="icon" href="favicon.ico"/, f);
  }
  assert.match(await readFile(new URL('robots.txt', root), 'utf8'), /User-agent: \*/);
  assert.match(await readFile(new URL('_headers', root), 'utf8'), /X-Robots-Tag: noindex/);
  for (const f of ['favicon.ico', 'apple-touch-icon.png', 'img/icon-192.png']) {
    const r = await fetch(srv.url + '/' + f);
    assert.equal(r.status, 200, f);
  }
});
