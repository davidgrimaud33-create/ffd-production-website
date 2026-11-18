# FFD Production – Website

Statische Website der Filmproduktion FFD Production (Inhaber: Farouk El-Khalili, Berlin).
Kein Framework. Bearbeitet wird direkt in `public/`. Einziger Build-Schritt: `scripts/build-content.mjs` für die CMS-Inhalte (siehe unten).

## Aufbau

Der Relaunch (Branch `relaunch`) ist ein One-Pager mit neun Abschnitten. Veröffentlicht wird weiterhin nur von `main` (siehe „Veröffentlichen“).

```
public/            ← alles, was online geht
  index.html       Startseite (One-Pager, alle Abschnitte + Dialoge: Projekt, Unterstützen, Impressum)
  datenschutz.html Datenschutzerklärung (ohne main.js)
  impressum.html   Impressum als eigene Seite (ohne main.js), Ausweichweg ohne JavaScript
  css/fonts.css    Schrift: nur Inter (variabel), Dateien in fonts/ (Lora/Oswald/Source Serif liegen dort noch, werden nicht geladen)
  css/style.css    gesamtes Styling, Farben und Maße als Variablen in :root (Rechtsseiten am Ende der Datei)
  js/main.js       Scroll (Lenis), Punkt-Navigation, Animationen, Projekt- und Unterstützen-Dialog, QR-Code
  js/news.js       Meldungen anzeigen (Abschnitt „News“)
  data/            ERZEUGT, nicht im Repo: news.json, crowdfunding.json
  img/news/        Bilder, die Farouk über das CMS hochlädt
  vendor/          GSAP, ScrollTrigger, Lenis, qrcode-generator (lokale Kopien)
  img/             Bilder als JPG (sprechende Dateinamen)
tests/             Tests (node:test + playwright-core, Chrome über channel 'chrome'), Helfer in tests/helpers.mjs
.github/workflows/deploy.yml   Build + Veröffentlichung zu Cloudflare Pages
content/news/*.json            Meldungen (eine Datei pro Meldung), gepflegt über Pages CMS
content/crowdfunding.json      Phase, Ziel, gesammelter Betrag, Unterstützer:innen, Stand
scripts/build-content.mjs      content/ → public/data/ (prüft Pflichtfelder, Bildpfade, Links)
.pages.yml                     Eingabemasken für Pages CMS
```

Abschnitts-IDs in `index.html` (Reihenfolge): `intro`, `news`, `projekte`, `abgeschlossen`, `vita-ffd`, `geschichte`, `gruender`, `vita`, `kontakt`. Jeder Abschnitt hat unten einen Pfeil zum nächsten (der letzte führt nach oben zu `#intro`). Alte Anker (`#projekt`, `#aktuelles`, `#filme`, `#ueber`) werden auf die neuen umgeleitet.

## Tests

```
node scripts/build-content.mjs
cd tests && npm install && npm test
```
Vor den Tests einmal `build-content.mjs`, damit `public/data/` existiert. Die Tests starten selbst einen lokalen Server auf `public/`.

## Inhalte, die Farouk selbst pflegt (Pages CMS)

Farouk bearbeitet Meldungen und Crowdfunding-Zahlen unter https://app.pagescms.org (als per E-Mail eingeladener Collaborator, ohne GitHub-Account).
Jede Speicherung ist ein Commit auf `main` und geht über die GitHub Action automatisch online.
- Vor eigenen Änderungen deshalb immer erst `git pull`, sonst gibt es Konflikte mit Farouks Commits.
- Felder in `.pages.yml` und `scripts/build-content.mjs` gehören zusammen. Wer ein Feld umbenennt, ändert beide und die vorhandenen Dateien in `content/`.
- Meldungen und Crowdfunding-Zahlen nicht im HTML pflegen, sondern in `content/`. Die Werte im HTML (8.500 €, „Vorproduktion“) sind nur Rückfall, falls `data/` fehlt.
- Die Action verkleinert Bilder in `public/img/news/` beim Veröffentlichen (max. 1800 px), im Repo bleiben die Originale.


**Keine externen Ressourcen einbinden** (kein Google Fonts, kein CDN, keine eingebetteten Videos, kein Tracking). Die Datenschutzerklärung sagt ausdrücklich, dass beim Aufruf keine Daten an Dritte gehen. Wer etwas Externes hinzufügt, muss `datenschutz.html` mit anpassen.

Das Impressum ist ein Dialog auf der Startseite und lässt sich direkt über `index.html#impressum` öffnen. Der Footer-Link zeigt auf `impressum.html`; mit JavaScript öffnet sich stattdessen der Dialog.

**Doppelt gepflegte Stellen (immer beide ändern):**
- Impressum: Dialog `#dlg-imp` in `index.html` und `impressum.html` (ein Test vergleicht die Absätze).
- Kontodaten: `BANK` in `js/main.js` und der `<noscript>`-Block in `#projekte` in `index.html`.

## Zweisprachigkeit (derzeit ausgesetzt)

Derzeit ausgesetzt (Relaunch: nur Deutsch, EN-Entscheidung offen). Es gibt keinen Sprachumschalter und kein `EN`-Wörterbuch in `main.js`; Texte stehen nur auf Deutsch im HTML. Fällt die Entscheidung für Englisch, muss die Umschaltung neu geplant werden. Kommt ein Umschalter mit gespeicherter Sprachwahl zurück, braucht die Datenschutzerklärung dafür wieder einen Abschnitt.

## Lokal ansehen

```
node scripts/build-content.mjs
python3 -m http.server 8000 -d public
```
Dann http://localhost:8000 öffnen. Nicht als Datei per Doppelklick öffnen (Skripte und Daten brauchen einen Server).

## Veröffentlichen

1. Änderungen in `public/` machen und lokal prüfen.
2. Der Relaunch lebt auf Branch `relaunch` (Vorschau per Notfall-Befehl mit `--branch relaunch`). Live geht er erst nach Merge auf `main` und `git push`.
3. Die GitHub Action lädt `public/` zu Cloudflare Pages hoch (ca. 1 Minute).
4. Prüfen: https://ffd-production-website.pages.dev

Repo: `git@github.com:davidgrimaud33-create/ffd-production-website.git`
Cloudflare-Projekt: `ffd-production-website` (Konto david.grimaud33)
Secret im Repo: `CLOUDFLARE_API_TOKEN` (Cloudflare Pages: Edit).
Notfall ohne GitHub: erst `node scripts/build-content.mjs`, dann `npx wrangler pages deploy public --project-name ffd-production-website --branch main`
Vorschau eines Branches (ohne live zu gehen): dasselbe mit `--branch <name>`, ergibt eine eigene Vorschau-URL.

**Suchmaschinen:** Solange die Seite nur unter pages.dev läuft, ist sie auf `noindex` gestellt (Meta-Tag in `index.html`, `impressum.html`, `datenschutz.html` und `X-Robots-Tag` in `public/_headers`). Beim Umzug auf die eigene Domain alle vier Stellen entfernen und in `public/robots.txt` die Sitemap eintragen.

## Regeln

- Das Quellmaterial liegt außerhalb dieses Repos (`../WEBSITE FFD & DEM SCHWEIGEN SO NAH`) und enthält Kontodaten. Nie in dieses Repo kopieren, nur fertige Web-Bilder nach `public/img/`.
- Neue Bilder als JPG, Breite max. ca. 1800 px, möglichst unter 250 KB.
- Commit-Nachrichten auf Deutsch.

## Design-Workflow

Die Design-Skills liegen projektweit in `.claude/skills/`, der Befehl `/critique-screen` in `.claude/commands/`. Herkunft und Lizenzen: `.claude/skills/THIRD_PARTY.md`. Die Skills sind unverändert übernommen; wo sie unserem Stack widersprechen, gilt diese Datei.

1. **Neue Gestaltung oder Animation:** `build-awwwards-quality-sites` als Leitskill, `cinematic-gsap-lenis-motion-system` für Scroll und Bewegung, `build-threejs-scroll-worlds` nur für 3D-Szenen. Genau eine Smooth-Scroll-Bibliothek: Lenis.
2. **Vor jedem Merge:** `/interface-review` auf den Branch bzw. PR.
3. **Animations-Änderungen** zusätzlich mit `review-animations` prüfen. Für ein Gesamt-Audit `improve-animations` nutzen.
4. **Nach dem Deploy der Cloudflare-Vorschau:** Screenshots Desktop (1440 px) und Mobil (390 px), dann `/critique-screen` darauf. Fixes nach P1–P3 abarbeiten.
5. **Pflicht:** Die Einstellung „reduzierte Bewegung“ (`prefers-reduced-motion`) und eine Fassung ohne JavaScript/WebGL. Inhalte müssen ohne JS sichtbar bleiben (Animationen nur per `gsap.from`, nie per CSS vorab ausblenden).

Abweichungen der Skills von unserem Stack:
- Kein npm, kein Bundler. Die Skills zeigen `npm i gsap lenis` und `import …`; wir nutzen die lokalen Kopien in `public/vendor/` (GSAP/ScrollTrigger 3.12.5, Lenis 1.1.14) als `<script>`. Neue Bibliotheken ebenfalls lokal ablegen, nie per CDN (siehe „Keine externen Ressourcen“).
- Lenis 1.1.14 kennt die Option `anchors` aus dem Skill-Beispiel nicht. Ankerlinks laufen bei uns über `lenis.scrollTo()` in `main.js`.
- Tailwind-, React- und Motion-Beispiele (`better-*`, `animate`) gelten sinngemäß für unser reines CSS in `public/css/style.css`; Farben und Abstände über die Variablen in `:root`.
- `critique-brand-consistency` erwartet `mood.md`, `voice.md` und `tokens.md`. Solange es die nicht gibt, prüft der Skill nur gegen `style.css`.
- Texte derzeit nur Deutsch (siehe „Zweisprachigkeit“).
