// Sammelt die Inhalte aus content/ (gepflegt über Pages CMS) und schreibt sie nach public/data/.
// Läuft automatisch in der GitHub Action vor dem Veröffentlichen. Lokal: node scripts/build-content.mjs
// Keine Abhängigkeiten, nur Node.
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'public', 'data');
mkdirSync(out, { recursive: true });

const PROJEKTE = ['ffd', 'schweigen', 'amar'];
const STATUS = ['vorproduktion', 'crowdfunding', 'dreh', 'post', 'fertig'];
const str = v => (typeof v === 'string' ? v.trim() : '');
const isDate = v => /^\d{4}-\d{2}-\d{2}/.test(str(v));
const safeLink = v => (/^https?:\/\/\S+$/i.test(str(v)) ? str(v) : '');
// Nur Bilder von der eigenen Website zulassen
const safeImg = v => { const s = str(v).replace(/^\/?/, '/'); return /^\/img\/[\w./-]+\.(jpe?g|png|webp)$/i.test(s) && !s.includes('..') ? s : '' };
const warn = (f, m) => console.warn(`⚠ ${f}: ${m}`);

/* ---------- Meldungen ---------- */
const dir = join(root, 'content', 'news');
const news = [];
for (const f of existsSync(dir) ? readdirSync(dir).filter(f => f.endsWith('.json')) : []) {
  let d;
  try { d = JSON.parse(readFileSync(join(dir, f), 'utf8')) } catch (e) { warn(f, 'kein gültiges JSON, übersprungen'); continue }
  if (d.sichtbar === false) continue;
  const item = {
    id: f.replace(/\.json$/, ''),
    datum: str(d.datum).slice(0, 10),
    projekt: PROJEKTE.includes(d.projekt) ? d.projekt : 'ffd',
    de: { titel: str(d.titel_de), text: str(d.text_de), bild_text: str(d.bild_text_de) },
    en: { titel: str(d.titel_en), text: str(d.text_en), bild_text: str(d.bild_text_en) },
    bild: safeImg(d.bild),
    link: safeLink(d.link),
  };
  if (!isDate(item.datum) || !item.de.titel || !item.de.text) { warn(f, 'Datum, deutscher Titel oder Text fehlt, übersprungen'); continue }
  if (!item.en.titel || !item.en.text) warn(f, 'englische Fassung fehlt, es wird Deutsch angezeigt');
  if (str(d.bild) && !item.bild) warn(f, `Bildpfad „${d.bild}“ ungültig, Bild weggelassen`);
  news.push(item);
}
news.sort((a, b) => b.datum.localeCompare(a.datum) || b.id.localeCompare(a.id));
writeFileSync(join(out, 'news.json'), JSON.stringify(news));
console.log(`✓ ${news.length} Meldungen → public/data/news.json`);

/* ---------- Crowdfunding ---------- */
const num = v => (Number.isFinite(+v) && +v >= 0 ? Math.round(+v) : 0);
let cf = {};
try { cf = JSON.parse(readFileSync(join(root, 'content', 'crowdfunding.json'), 'utf8')) } catch (e) { warn('crowdfunding.json', 'nicht lesbar, Standardwerte') }
const crowd = {
  status: STATUS.includes(cf.status) ? cf.status : 'vorproduktion',
  ziel: num(cf.ziel) || 7500,
  gesammelt: num(cf.gesammelt),
  unterstuetzende: num(cf.unterstuetzende),
  stand: isDate(cf.stand) ? str(cf.stand).slice(0, 10) : '',
};
writeFileSync(join(out, 'crowdfunding.json'), JSON.stringify(crowd));
console.log(`✓ Crowdfunding ${crowd.gesammelt} / ${crowd.ziel} € → public/data/crowdfunding.json`);
