// Vita Farouk (Reiter), Kontakt, Fußzeile, Impressum-Dialog.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer, openPage } from './helpers.mjs';

let srv;
before(async () => { srv = await startServer(); });
after(async () => { await srv.close(); });

async function withPage(fn, opts, path = '/') {
  const { page, browser } = await openPage(srv.url + path, opts);
  try { await fn(page); } finally { await browser.close(); }
}

test('tabs', async () => {
  await withPage(async (page) => {
    const tabs = page.locator('#vita [role="tablist"] [role="tab"]');
    assert.deepEqual(await tabs.allTextContents(), ['Film', 'Fernsehen', 'Theater']);
    await page.waitForFunction(() => document.querySelectorAll('#vita [role="tabpanel"][hidden]').length === 2);
    assert.equal(await tabs.nth(0).getAttribute('aria-selected'), 'true');
    assert.equal(await page.locator('#vita [role="tabpanel"]:visible').count(), 1);
    await tabs.nth(0).focus();
    await page.keyboard.press('ArrowRight');
    assert.equal(await tabs.nth(1).getAttribute('aria-selected'), 'true');
    assert.equal(await page.evaluate(() => document.activeElement.textContent.trim()), 'Fernsehen');
    assert.equal(await tabs.nth(1).getAttribute('tabindex'), '0');
    assert.equal(await tabs.nth(0).getAttribute('tabindex'), '-1');
    await page.keyboard.press('End');
    assert.equal(await tabs.nth(2).getAttribute('aria-selected'), 'true');
    await page.keyboard.press('Home');
    assert.equal(await tabs.nth(0).getAttribute('aria-selected'), 'true');
    await tabs.nth(2).click();
    const panel = page.locator('#' + (await tabs.nth(2).getAttribute('aria-controls')));
    assert.ok(await panel.isVisible());
    assert.match(await panel.textContent(), /Deutsche Oper Berlin/);
    assert.equal(await page.locator('#vita [role="tabpanel"]:visible').count(), 1);
  });
});

test('tabs no-JS', async () => {
  await withPage(async (page) => {
    assert.equal(await page.locator('#vita [role="tabpanel"]').count(), 3);
    assert.equal(await page.locator('#vita [role="tabpanel"]:visible').count(), 3);
    assert.equal(await page.locator('#vita [hidden]').count(), 0);
  }, { js: false });
});

test('ausbildung', async () => {
  await withPage(async (page) => {
    const t = await page.locator('#vita').textContent();
    assert.match(t, /Berlin Acting Studio/);
    assert.match(t, /BFFS/);
  });
});

test('contact cards', async () => {
  await withPage(async (page) => {
    assert.equal(await page.locator('#kontakt .contact-card').count(), 2);
    assert.equal(await page.locator('#kontakt .contact-card:nth-child(1) a[href="mailto:ffd_production@t-online.de"]').count() >= 1, true);
    const right = page.locator('#kontakt .contact-card:nth-child(2)');
    assert.equal(await right.locator('a[href="mailto:anfrage@agenturfrehse.com"]', { hasText: 'Agentur anschreiben' }).count(), 1);
    assert.ok(await page.getByText('FREHSE').first().isVisible());
    assert.ok(await page.locator('#kontakt a[href^="tel:"]').count() >= 2);
    assert.ok(await page.locator('#kontakt h2').count() >= 1);
  });
});

test('nach oben', async () => {
  await withPage(async (page) => {
    assert.equal(await page.locator('#kontakt .next').getAttribute('href'), '#intro');
  });
});

test('impressum', async () => {
  await withPage(async (page) => {
    await page.waitForSelector('#dlg-imp[open]');
  }, {}, '/#impressum');
  await withPage(async (page) => {
    const link = page.locator('footer a[href="impressum.html"]');
    assert.equal(await link.count(), 1);
    assert.equal(await page.locator('#dlg-imp[open]').count(), 0);
    await link.click();
    await page.waitForSelector('#dlg-imp[open]');
    assert.match(await page.locator('#dlg-imp').textContent(), /Einzelunternehmen/);
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('#dlg-imp').open);
  });
});

test('impressum text identical to impressum.html', async () => {
  const norm = (ps) => ps.map((p) => p.textContent.replace(/\s+/g, ' ').trim());
  let legal;
  await withPage(async (page) => { legal = await page.locator('main.legal .in p').evaluateAll((ps) => ps.map((p) => p.textContent.replace(/\s+/g, ' ').trim())); }, {}, '/impressum.html');
  await withPage(async (page) => {
    const dlg = await page.locator('#dlg-imp p').evaluateAll((ps) => ps.map((p) => p.textContent.replace(/\s+/g, ' ').trim()));
    assert.ok(dlg.length >= 4);
    assert.deepEqual(dlg, legal);
  });
});

test('footer', async () => {
  await withPage(async (page) => {
    const t = (await page.locator('footer').textContent()).replace(/\s+/g, ' ');
    for (const s of ['Impressum', 'Datenschutz', '© 2026 FFD Production', 'Gestaltung & Umsetzung: DeepMetis GmbH']) assert.ok(t.includes(s), s);
  });
});
