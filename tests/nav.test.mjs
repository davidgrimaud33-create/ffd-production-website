// Intro-Logo, Punkte-Navigation und mobiles Menü.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer, openPage } from './helpers.mjs';

let srv;
before(async () => { srv = await startServer(); });
after(async () => { await srv.close(); });

async function withPage(path, opts, fn) {
  const o = await openPage(srv.url + path, opts);
  try { await fn(o); } finally { await o.browser.close(); }
}
const topOf = (page, id) => page.$eval('#' + id, (el) => el.getBoundingClientRect().top);
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const hiddenNow = (page) => page.$eval('.dots', (d) => { const s = getComputedStyle(d); return s.visibility === 'hidden' || parseFloat(s.opacity) < 0.05; });

test('logo click goes to news', async () => {
  await withPage('/', {}, async ({ page }) => {
    assert.equal(await page.$eval('.intro-logo img', (i) => i.getAttribute('alt')), 'FFD Production');
    assert.match(await page.$eval('.intro-hint', (e) => e.textContent), /Klicken oder scrollen/);
    await page.click('.intro-logo');
    await wait(2000);
    const t = await topOf(page, 'news');
    assert.ok(t >= -5 && t <= 80, `#news top ${t}`);
  });
});

test('dots hidden on intro, visible later', async () => {
  await withPage('/', {}, async ({ page }) => {
    assert.equal(await page.$$eval('.dots a', (a) => a.length), 8);
    assert.ok(await hiddenNow(page), 'Punkte im Intro sichtbar');
    await page.evaluate(() => window.FFD.scrollToId('abgeschlossen'));
    await wait(2200);
    assert.ok(!(await hiddenNow(page)), 'Punkte später unsichtbar');
    assert.equal(await page.$eval('.dots a[href="#abgeschlossen"]', (a) => a.getAttribute('aria-current')), 'true');
    assert.equal(await page.$$eval('.dots a[aria-current="true"]', (a) => a.length), 1);
  });
});

test('dot label on hover and focus', async () => {
  await withPage('/', {}, async ({ page }) => {
    await page.evaluate(() => window.FFD.scrollToId('projekte'));
    await wait(2200);
    const lab = (name) => page.$eval(`.dots a[aria-label="${name}"]`, (a) => {
      const l = [...a.querySelectorAll('*')].find((e) => e.textContent.trim() === a.getAttribute('aria-label'));
      return !!l && l.offsetWidth > 0 && parseFloat(getComputedStyle(l).opacity) > 0.5;
    });
    await page.hover('.dots a[aria-label="Kontakt"]');
    await wait(500);
    assert.ok(await lab('Kontakt'), 'Label bei Hover');
    await page.mouse.move(700, 450);
    await wait(500);
    assert.ok(!(await lab('Kontakt')), 'Label ohne Hover versteckt');
    await page.focus('.dots a[aria-label="Vita"]');
    await wait(500);
    assert.ok(await lab('Vita'), 'Label bei Fokus');
  });
});

test('mobile 390', async () => {
  await withPage('/', { width: 390, height: 800 }, async ({ page }) => {
    assert.equal(await page.$eval('.dots', (d) => getComputedStyle(d).display), 'none');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth) <= 390);
    assert.ok(await page.$eval('.menu-btn', (b) => b.offsetWidth > 0));
    await page.click('.menu-btn');
    await wait(300);
    assert.ok(await page.$eval('#menu', (d) => d.open));
    assert.equal(await page.$eval('.menu-btn', (b) => b.getAttribute('aria-expanded')), 'true');
    assert.equal(await page.$$eval('#menu a[href^="#"]', (a) => a.length), 8);
    await page.keyboard.press('Escape');
    await wait(300);
    assert.ok(!(await page.$eval('#menu', (d) => d.open)));
    assert.equal(await page.$eval('.menu-btn', (b) => b.getAttribute('aria-expanded')), 'false');
    await page.click('.menu-btn');
    await wait(300);
    await page.click('#menu a[href="#kontakt"]');
    await wait(2500);
    assert.ok(!(await page.$eval('#menu', (d) => d.open)));
    const t = await topOf(page, 'kontakt');
    assert.ok(t >= -5 && t <= 80, `#kontakt top ${t}`);
  });
});
