// Vita FFD Production, Geschichte, Der Gründer.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer, openPage } from './helpers.mjs';

let srv;
before(async () => { srv = await startServer(); });
after(async () => { await srv.close(); });

async function withPage(fn, opts) {
  const { page, browser } = await openPage(srv.url + '/', opts);
  try { await fn(page); } finally { await browser.close(); }
}

test('timeline order', async () => {
  await withPage(async (page) => {
    const years = await page.$$eval('#vita-ffd ol.timeline > li .tl-year', (els) => els.map((e) => e.textContent.trim()));
    assert.deepEqual(years, ['In Arbeit', '2024', '2022', '2019–2020']);
    const titles = await page.$$eval('#vita-ffd ol.timeline > li em', (els) => els.map((e) => e.textContent.replace(/\s+/g, ' ').trim()));
    assert.match(titles[0], /Dem Schweigen so nah/);
    assert.match(titles[1], /AMAR & LENA/);
    assert.match(titles[2], /Smoke/);
    assert.match(titles[3], /Zahra – A Declaration of Love to Godard/);
  });
});

test('timeline image only at Zahra, with dimensions and lazy loading', async () => {
  await withPage(async (page) => {
    assert.equal(await page.locator('#vita-ffd ol.timeline img').count(), 1);
    const img = page.locator('#vita-ffd ol.timeline > li:nth-child(4) img[src*="zahra"]');
    assert.equal(await img.count(), 1);
    assert.equal(await img.getAttribute('loading'), 'lazy');
    assert.ok(await img.getAttribute('width'));
    assert.ok(await img.getAttribute('height'));
  });
});

test('no Bild folgt', async () => {
  await withPage(async (page) => {
    assert.doesNotMatch(await page.evaluate(() => document.body.textContent), /Bild folgt/);
  });
});

test('geschichte', async () => {
  await withPage(async (page) => {
    const t = await page.$eval('#geschichte', (e) => e.textContent);
    assert.match(t, /Geschichten, die bleiben\./);
    assert.match(t, /2022/);
    assert.match(t, /Berlin/);
    assert.match(t, /\[[^\]]*FFD[^\]]*\]/);
  });
});

test('gruender', async () => {
  await withPage(async (page) => {
    const img = page.locator('#gruender img[src*="farouk-portraet-gross"]');
    assert.equal(await img.count(), 1);
    assert.ok((await img.getAttribute('alt')).trim().length > 0);
    assert.ok(await img.getAttribute('width'));
    const t = await page.$eval('#gruender', (e) => e.textContent);
    assert.match(t, /Schauspieler · Autor · Produzent/);
    assert.match(t, /\[[^\]]*liefert Farouk\]/);
    assert.match(t, /Ronny Wunderlich/);
  });
});
