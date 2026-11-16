// News-Feed: 3 sichtbar, „Ältere News“, Datumsformat, Leerzustand, nur Text.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer, openPage } from './helpers.mjs';
import { chromium } from 'playwright-core';

let srv;
before(async () => { srv = await startServer(); });
after(async () => { await srv.close(); });

const mk = (i, extra = {}) => ({
  id: `n${i}`, datum: `2026-11-${String(20 - i).padStart(2, '0')}`, projekt: 'ffd',
  de: { titel: `Titel ${i}`, text: `Text ${i}\n\nZweiter Absatz ${i}` }, en: { titel: '', text: '' }, ...extra,
});

// Route muss vor goto stehen, daher eigener Browser statt openPage.
async function withNews(fixture, fn, status = 200) {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
  await page.route('**/data/news.json', (r) => status === 200
    ? r.fulfill({ status, contentType: 'application/json', body: JSON.stringify(fixture) })
    : r.fulfill({ status, body: 'nope' }));
  try { await page.goto(srv.url + '/', { waitUntil: 'load' }); await fn(page); } finally { await browser.close(); }
}
const visible = (page, sel) => page.$$eval(sel, (els) => els.filter((e) => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden').length);

test('shows 3 of 5 and reveals rest', async () => {
  await withNews([0, 1, 2, 3, 4].map((i) => mk(i)), async (page) => {
    await page.waitForSelector('.nw');
    assert.equal(await visible(page, '.nw'), 3);
    await page.click('#news-more');
    await page.waitForFunction(() => document.querySelectorAll('.nw').length === 5);
    assert.equal(await visible(page, '.nw'), 5);
    assert.equal(await page.$('#news-more').then((b) => b && b.isVisible()), null);
  });
});

test('no more button for 3 or fewer', async () => {
  await withNews([mk(0), mk(1)], async (page) => {
    await page.waitForSelector('.nw');
    assert.equal(await page.$('#news-more'), null);
  });
});

test('date format', async () => {
  await withNews([mk(0, { datum: '2026-11-12' })], async (page) => {
    await page.waitForSelector('.nw time');
    assert.equal(await page.$eval('.nw time', (t) => t.textContent), '12.11.2026');
    assert.equal(await page.$eval('.nw time', (t) => t.getAttribute('datetime')), '2026-11-12');
  });
});

test('no image placeholder', async () => {
  await withNews([mk(0)], async (page) => {
    await page.waitForSelector('.nw');
    assert.equal(await page.$('.nw img'), null);
    assert.ok(!/Bild/.test(await page.$eval('.nw', (e) => e.textContent)));
  });
});

test('image and link', async () => {
  await withNews([mk(0, { bild: 'img/zahra.jpg', link: 'https://example.org/x', de: { titel: 'Mit Bild', text: 'T', bild_text: 'Standbild Zahra' } })], async (page) => {
    await page.waitForSelector('.nw');
    assert.equal(await page.$$eval('.nw.has-img', (e) => e.length), 1);
    const img = await page.$eval('.nw-img img[alt]', (i) => ({ alt: i.alt, loading: i.getAttribute('loading'), decoding: i.getAttribute('decoding'), ar: getComputedStyle(i).aspectRatio, fit: getComputedStyle(i).objectFit }));
    assert.equal(img.alt, 'Standbild Zahra');
    assert.equal(img.loading, 'lazy');
    assert.equal(img.decoding, 'async');
    assert.equal(img.ar, '4 / 3');
    assert.equal(img.fit, 'cover');
    assert.equal(await page.$$eval('a.nw-more[target="_blank"][rel~="noopener"][href="https://example.org/x"]', (a) => a.length), 1);
  });
});

test('entries without date are skipped', async () => {
  await withNews([mk(0), null, { ...mk(1), datum: '' }, mk(2)], async (page) => {
    await page.waitForSelector('.nw');
    assert.equal(await page.$$eval('.nw', (e) => e.length), 2);
  });
});

test('empty list and 404', async () => {
  for (const [fx, st] of [[[], 200], [null, 404]]) {
    await withNews(fx, async (page) => {
      await page.waitForSelector('.nw-empty');
      assert.equal(await page.$eval('.nw-empty', (e) => e.textContent), 'Derzeit keine Meldungen.');
      assert.ok(await page.$eval('#news', (e) => e.getClientRects().length > 0));
    }, st);
  }
});

test('text is text', async () => {
  await withNews([mk(0, { de: { titel: '<b>x</b>', text: '<i>y</i>' } })], async (page) => {
    await page.waitForSelector('.nw');
    assert.equal(await page.$eval('.nw h3', (e) => e.textContent), '<b>x</b>');
    assert.equal(await page.$$eval('[data-news] b, [data-news] i', (e) => e.length), 0);
  });
});

test('no news.html links, feed markup', async () => {
  const o = await openPage(srv.url + '/');
  try {
    assert.equal(await o.page.$$eval('a[href*="news.html"]', (a) => a.length), 0);
    assert.equal(await o.page.$$eval('div.feed[data-news][data-limit="3"]', (a) => a.length), 1);
  } finally { await o.browser.close(); }
});
