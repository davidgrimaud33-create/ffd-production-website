// Abgeschlossene Projekte: AMAR & LENA, Auszeichnungen, Standbilder mit Zoom.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execSync } from 'node:child_process';
import { startServer, openPage } from './helpers.mjs';

let srv;
before(async () => { srv = await startServer(); });
after(async () => { await srv.close(); });

const OLD = execSync('git show main:public/index.html', { cwd: new URL('..', import.meta.url).pathname, encoding: 'utf8' });
const YT = OLD.match(/https:\/\/youtu\.be\/[\w-]+/)[0];

async function withPage(fn, opts) {
  const { page, browser } = await openPage(srv.url + '/', opts);
  try { await fn(page); } finally { await browser.close(); }
}

test('meta line', async () => {
  await withPage(async (page) => {
    const t = await page.$eval('[data-project="amar"] .project-byline', (e) => e.textContent);
    assert.match(t, /Kurzfilm · 2024 · 15:15 Min\./);
  });
});

test('laurels', async () => {
  await withPage(async (page) => {
    assert.equal(await page.locator('ul.laurels > li.laurel').count(), 6);
    assert.equal(await page.locator('.laurel.is-nom').count(), 1);
    assert.match(await page.$eval('ul.laurels', (e) => e.textContent), /Istanbul Women Film Awards/);
    assert.match(await page.$eval('.laurel.is-nom', (e) => e.textContent), /Nominiert/);
  });
});

test('laurels wrap on mobile without overflow', async () => {
  await withPage(async (page) => {
    const o = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    assert.ok(o <= 0, 'horizontal overflow ' + o);
  }, { width: 375, height: 800 });
});

test('youtube link', async () => {
  await withPage(async (page) => {
    const a = page.locator('[data-project="amar"] a[href*="youtu"]');
    assert.equal(await a.count(), 1);
    assert.equal(await a.getAttribute('href'), YT);
    assert.equal(await a.getAttribute('target'), '_blank');
    assert.match(await a.getAttribute('rel'), /noopener/);
    assert.equal(await page.locator('iframe').count(), 0);
  });
});

test('zoom', async () => {
  await withPage(async (page) => {
    const btn = page.locator('#abgeschlossen .stills button[data-zoom]').first();
    assert.equal(await page.locator('#abgeschlossen .stills button[data-zoom]').count(), 4);
    const src = await btn.locator('img').getAttribute('src');
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await page.waitForFunction(() => document.querySelector('#dlg-img')?.open);
    assert.match(await page.$eval('#dlg-img img', (e) => e.getAttribute('src')), new RegExp(src.replace('.', '\\.') + '$'));
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('#dlg-img').open);
  });
});

test('zoom closes on backdrop click', async () => {
  await withPage(async (page) => {
    const btn = page.locator('#abgeschlossen .project-media button[data-zoom]');
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await page.waitForFunction(() => document.querySelector('#dlg-img')?.open);
    await page.mouse.click(3, 3);
    await page.waitForFunction(() => !document.querySelector('#dlg-img').open);
  });
});

test('credits', async () => {
  await withPage(async (page) => {
    const t = await page.$eval('[data-project="amar"]', (e) => e.textContent.replace(/\s+/g, ' '));
    assert.match(t, /Regie: Peter Klomfass, Frieda Yovogan/);
    assert.doesNotMatch(t, /Ein Film von/);
  });
});

test('stills have intrinsic size', async () => {
  await withPage(async (page) => {
    const bad = await page.$$eval('#abgeschlossen img', (is) => is.filter((i) => !(i.getAttribute('width') && i.getAttribute('height'))).length);
    assert.equal(bad, 0);
  });
});
