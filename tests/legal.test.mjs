// Rechtsseiten: im neuen Look, mit Rückweg zur Startseite, ohne externe Requests.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer, openPage } from './helpers.mjs';

let srv;
before(async () => { srv = await startServer(); });
after(async () => { await srv.close(); });

for (const path of ['/impressum.html', '/datenschutz.html']) {
  test(`legal pages styled: ${path}`, async () => {
    const { page, browser, external } = await openPage(srv.url + path);
    try {
      const sheets = await page.$$eval('link[rel=stylesheet]', (l) => l.map((x) => x.getAttribute('href')));
      assert.ok(sheets.includes('css/style.css'));
      assert.equal(await page.evaluate(() => getComputedStyle(document.body).backgroundColor), 'rgb(12, 12, 12)');
      assert.ok(await page.$('a[href="index.html"]'), 'Link zur Startseite');
      // Lesespalte begrenzt und Kopfzeile gestaltet (nicht Browser-Standard)
      const s = await page.evaluate(() => ({
        max: getComputedStyle(document.querySelector('.legal .in')).maxWidth,
        head: getComputedStyle(document.querySelector('header.top .wrap')).display,
        h1w: getComputedStyle(document.querySelector('h1')).fontWeight,
      }));
      assert.notEqual(s.max, 'none');
      assert.equal(s.head, 'flex');
      assert.equal(s.h1w, '300');
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      assert.deepEqual(external, []);
    } finally { await browser.close(); }
  });
}

test('datenschutz mentions paypal, youtube only as link', async () => {
  const { page, browser } = await openPage(srv.url + '/datenschutz.html');
  try {
    const text = await page.evaluate(() => document.body.innerText);
    assert.match(text, /PayPal/);
    assert.match(text, /YouTube/);
    assert.equal(await page.$('iframe'), null);
  } finally { await browser.close(); }
});
