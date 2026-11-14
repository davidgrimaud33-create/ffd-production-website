# FFD Production – Website

Statische Website der Filmproduktion FFD Production (Inhaber: Farouk El-Khalili, Berlin).
Kein Framework, kein Build-Schritt. Bearbeitet wird direkt in `public/`.

## Aufbau

```
public/            ← alles, was online geht
  index.html       Startseite (One-Pager, alle Sektionen + Dialoge wie Impressum/Spenden)
  datenschutz.html Datenschutzerklärung (nur Deutsch, ohne main.js)
  css/fonts.css    Schriften (Lora, Inter, Oswald, Source Serif 4), Dateien in fonts/
  css/style.css    gesamtes Styling, Farben als Variablen in :root
  js/main.js       Animationen, Sprache DE/EN, Spenden-Dialog, QR-Code
  vendor/          GSAP, ScrollTrigger, Lenis, qrcode-generator (lokale Kopien)
  img/             Bilder als JPG (sprechende Dateinamen)
.github/workflows/deploy.yml   Veröffentlichung zu Cloudflare Pages
```

**Keine externen Ressourcen einbinden** (kein Google Fonts, kein CDN, keine eingebetteten Videos, kein Tracking). Die Datenschutzerklärung sagt ausdrücklich, dass beim Aufruf keine Daten an Dritte gehen. Wer etwas Externes hinzufügt, muss `datenschutz.html` mit anpassen.

Das Impressum ist ein Dialog auf der Startseite und lässt sich direkt über `index.html#impressum` öffnen.

## Zweisprachigkeit (wichtig)

Deutsch ist der Text im HTML. Englisch steht im Wörterbuch `EN` am Anfang von `public/js/main.js`.
Der **Schlüssel ist der deutsche Text selbst** (Leerräume zusammengefasst).
Wer einen deutschen Text im HTML ändert, muss den Schlüssel in `EN` genauso ändern und die englische Übersetzung anpassen. Sonst bleibt der Text auf Englisch deutsch.
Das gilt auch für `alt`, `aria-label` und `data-cursor`.

## Lokal ansehen

```
python3 -m http.server 8000 -d public
```
Dann http://localhost:8000 öffnen. Nicht als Datei per Doppelklick öffnen, das Logo-Canvas braucht einen Server.

## Veröffentlichen

1. Änderungen in `public/` machen und lokal prüfen.
2. Commit auf `main`, dann `git push`.
3. Die GitHub Action lädt `public/` zu Cloudflare Pages hoch (ca. 1 Minute).
4. Prüfen: https://ffd-production-website.pages.dev

Repo: `git@github.com:davidgrimaud33-create/ffd-production-website.git`
Cloudflare-Projekt: `ffd-production-website` (Konto david.grimaud33)
Secret im Repo: `CLOUDFLARE_API_TOKEN` (Cloudflare Pages: Edit).
Notfall ohne GitHub: `npx wrangler pages deploy public --project-name ffd-production-website --branch main`

## Regeln

- Das Quellmaterial liegt außerhalb dieses Repos (`../WEBSITE FFD & DEM SCHWEIGEN SO NAH`) und enthält Kontodaten. Nie in dieses Repo kopieren, nur fertige Web-Bilder nach `public/img/`.
- Neue Bilder als JPG, Breite max. ca. 1800 px, möglichst unter 250 KB.
- Commit-Nachrichten auf Deutsch.
