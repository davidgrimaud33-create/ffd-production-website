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
const T = { timeout: 5000 };
// Warten, bis der Abschnitt oben angekommen ist (statt fester Pausen)
const atTop = (page, id) => page.waitForFunction((id) => {
  const t = document.getElementById(id).getBoundingClientRect().top; return t >= -5 && t <= 80;
}, id, T);
const dotsHidden = () => { const s = getComputedStyle(document.querySelector('.dots')); return s.visibility === 'hidden' || parseFloat(s.opacity) < 0.05; };
const labelShown = (name) => {
  const a = document.querySelector(`.dots a[aria-label="${name}"]`);
  const l = [...a.querySelectorAll('*')].find((e) => e.textContent.trim() === a.getAttribute('aria-label'));
  return !!l && l.offsetWidth > 0 && parseFloat(getComputedStyle(l).opacity) > 0.5;
};

test('logo click goes to news', async () => {
  await withPage('/', {}, async ({ page }) => {
    assert.equal(await page.$eval('.intro-logo img', (i) => i.getAttribute('alt')), 'FFD Production');
    assert.match(await page.$eval('.intro-hint', (e) => e.textContent), /Klicken oder scrollen/);
    await page.click('.intro-logo');
    await atTop(page, 'news');
  });
});

test('intro logo large enough on mobile, no horizontal scroll', async () => {
  await withPage('/', { width: 390, height: 844 }, async ({ page }) => {
    // Die Wortmarke nimmt ca. 35 % der Bildbreite ein (x 440–930 von 1400 px).
    const mark = await page.$eval('.intro-logo img', (i) => i.getBoundingClientRect().width * (490 / 1400));
    assert.ok(mark >= 220 && mark <= 260, `Wortmarke ${Math.round(mark)} px`);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'horizontales Scrollen');
  });
});

test('intro logo large on desktop, hint and arrow stay in view', async () => {
  await withPage('/', { width: 1440, height: 900 }, async ({ page }) => {
    const mark = await page.$eval('.intro-logo img', (i) => i.getBoundingClientRect().width * (490 / 1400));
    assert.ok(mark >= 420 && mark <= 520, `Wortmarke ${Math.round(mark)} px`);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'horizontales Scrollen');
    const bottom = await page.$eval('#intro .next', (n) => n.getBoundingClientRect().bottom);
    assert.ok(bottom <= 900, `Pfeil unter dem Bildschirmrand (${Math.round(bottom)} px)`);
  });
});

test('dots hidden on intro, visible later', async () => {
  await withPage('/', {}, async ({ page }) => {
    assert.equal(await page.$$eval('.dots a', (a) => a.length), 8);
    assert.ok(await page.evaluate(dotsHidden), 'Punkte im Intro sichtbar');
    await page.evaluate(() => window.FFD.scrollToId('abgeschlossen'));
    await page.waitForFunction(() => document.querySelector('.dots a[href="#abgeschlossen"]').getAttribute('aria-current') === 'true', null, T);
    await page.waitForFunction(`!(${dotsHidden})()`, null, T);
    assert.equal(await page.$$eval('.dots a[aria-current="true"]', (a) => a.length), 1);
  });
});

test('dot label on hover and focus', async () => {
  await withPage('/', {}, async ({ page }) => {
    await page.evaluate(() => window.FFD.scrollToId('projekte'));
    await page.waitForFunction(() => document.querySelector('.dots').classList.contains('is-on'), null, T);
    await page.hover('.dots a[aria-label="Kontakt"]');
    await page.waitForFunction(labelShown, 'Kontakt', T);
    await page.mouse.move(700, 450);
    await page.waitForFunction(`!(${labelShown.toString()})('Kontakt')`, null, T);
    await page.focus('.dots a[aria-label="Vita"]');
    await page.waitForFunction(labelShown, 'Vita', T);
  });
});

test('dot click scrolls and moves focus to the section', async () => {
  await withPage('/', {}, async ({ page }) => {
    await page.evaluate(() => window.FFD.scrollToId('news'));
    await page.waitForFunction(() => document.querySelector('.dots').classList.contains('is-on'), null, T);
    await page.click('.dots a[href="#geschichte"]');
    await atTop(page, 'geschichte');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'geschichte');
    assert.equal(await page.$eval('#geschichte', (s) => s.getAttribute('tabindex')), '-1');
    assert.equal(await page.$eval('#geschichte', (s) => getComputedStyle(s).outlineStyle), 'none');
  });
});

test('mobile 390', async () => {
  await withPage('/', { width: 390, height: 800 }, async ({ page }) => {
    assert.equal(await page.$eval('.dots', (d) => getComputedStyle(d).display), 'none');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth) <= 390);
    // Menü-Knopf: klein, rund, unten rechts
    const b = await page.$eval('.menu-btn', (b) => { const r = b.getBoundingClientRect(); return { w: r.width, right: innerWidth - r.right, bottom: innerHeight - r.bottom, radius: getComputedStyle(b).borderRadius }; });
    assert.ok(b.w > 0 && b.w <= 56, `Breite ${b.w}`);
    assert.ok(b.right <= 32 && b.bottom <= 32, `Lage rechts ${b.right}, unten ${b.bottom}`);
    assert.equal(b.radius, '50%');
    await page.click('.menu-btn');
    await page.waitForFunction(() => document.getElementById('menu').open, null, T);
    assert.equal(await page.$eval('.menu-btn', (b) => b.getAttribute('aria-expanded')), 'true');
    assert.equal(await page.$$eval('#menu a[href^="#"]', (a) => a.length), 8);
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.getElementById('menu').open, null, T);
    assert.equal(await page.$eval('.menu-btn', (b) => b.getAttribute('aria-expanded')), 'false');
    await page.waitForFunction(() => document.activeElement === document.querySelector('.menu-btn'), null, T);
    await page.click('.menu-btn');
    await page.waitForFunction(() => document.getElementById('menu').open, null, T);
    await page.click('#menu a[href="#kontakt"]');
    await page.waitForFunction(() => !document.getElementById('menu').open, null, T);
    await atTop(page, 'kontakt');
    assert.equal(await page.evaluate(() => document.activeElement.id), 'kontakt', 'Fokus auf dem Ziel-Abschnitt, nicht auf dem Menü-Knopf');
  });
});
