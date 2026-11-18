das # Relaunch FFD Production – Design

Stand: 16.11.2026 · Branch `relaunch` · Grundlage: `../WEBSITE FFD & DEM SCHWEIGEN SO NAH/FFD-Production_Website-Konzept.pdf` (Farouk El-Khalili, 16.11.2026)

## Warum

Farouk (Inhaber, Auftraggeber) hat ein Konzept geschickt, wie die Seite in Aufbau und Funktion umgebaut werden soll. Die heutige Seite folgt einer anderen Reihenfolge (Hero → Statement → Laufband → Projekt → News → Filme → Über → Kontakt) und einem anderen Look (silber/petrol, Lora/Oswald). Neu: feste Reihenfolge von 9 Abschnitten, jeder mit beschriftetem Pfeil zum nächsten, durchgehend schwarz und ruhig „wie ein Kinosaal“, Bilder und Filmstills im Vordergrund. Der Besucher soll immer wissen, was als Nächstes kommt.

Erfolg = Farouk erkennt sein Konzept 1:1 wieder, kann News und Crowdfunding-Zahlen weiter selbst pflegen, und nichts Bestehendes (Unterstützen-Dialog, Impressum, Datenschutz-Versprechen, Deploy) geht verloren.

## Ziele

- Neue Gestaltung **Richtung A „streng nach Konzept“** (vom Nutzer gewählt, Mockup im Brainstorming):
  - Hintergrund `#0C0C0C`, Flächen/Karten `#161616`, Text `#F2EEE6`, Akzent `#C9A24A` (Pfeile, Buttons, Preise, Labels), Nebentext `#A39D92`.
  - Titel in Inter, leicht (300), große Größen, leicht negative Laufweite; Labels Inter 600 Versalien, weite Laufweite (~0,3em), in Gold. Fließtext Inter 400.
  - Buttons: Primär gefüllt Gold mit dunkler Schrift, sekundär Gold-Kontur.
- 9 Abschnitte in fester Reihenfolge, jeder mit eigenem Anker:
  `#intro` · `#news` · `#projekte` · `#abgeschlossen` · `#vita-ffd` · `#geschichte` · `#gruender` · `#vita` · `#kontakt`
- Am Ende jedes Abschnitts: Label mit Name des nächsten Abschnitts + Pfeil ↓ (Gold, zentriert), Klick scrollt sanft dorthin. Im Kontakt stattdessen „Nach oben ↑“ zum Intro.
- Jeder Abschnitt mind. `100svh` hoch; lange Abschnitte (Projekte, Vita) dürfen – vor allem mobil – höher sein.
- Navigation **Variante 1** (vom Nutzer gewählt): Punkte am rechten Rand, aktiver Punkt gold, beim Hover/Fokus erscheint der Abschnittsname. Auf dem Intro ausgeblendet. Mobil (< 760 px) keine Punkte, stattdessen kleiner runder „☰“-Knopf unten rechts, öffnet eine Liste der 8 Abschnitte (Dialog/Overlay, schließbar mit Esc und Klick außerhalb).
- Seitentitel: „FFD Production – Unabhängige Filmproduktion aus Berlin“ + Meta-Description (1 Satz). Open-Graph-Tags beibehalten bzw. anpassen.

## Abschnitte im Detail

**00 Intro (`#intro`)** – nur das vorhandene Logo „FFD PRODUCTION in Silver Thrum“ (Quelle: `../WEBSITE FFD & DEM SCHWEIGEN SO NAH/FFD Production/FFD PRODUCTION in Silver Thrum 1x1.jpg`, als Web-JPG nach `public/img/`) mittig auf Schwarz, Ränder per radialer Maske weich ins Schwarz geblendet (das Bild hat dunkelblauen, nicht exakt schwarzen Grund). Sanftes Einblenden (GSAP `from`, nicht per CSS vorab versteckt). Darunter klein „Klicken oder scrollen“. Logo ist ein Link auf `#news`. Normales Scrollen führt ebenfalls zu News. Kein Header, keine Leader-Animation mit Zähler (die lose „0“ entfällt damit), kein Laufband, kein Statement.

**01 News (`#news`)** – Feed, neueste oben: Datum (Gold, `TT.MM.JJJJ`), Titel, kurzer Text, ggf. Bild rechts (fehlt das Bild: kein Platzhalter). 3 Meldungen sichtbar, Button „Ältere News“ blendet die übrigen im selben Abschnitt ein. Daten weiter aus `public/data/news.json` (Pages CMS, `content/news/`). `news.html` entfällt (Links darauf entfernen; Datei löschen). Ohne JS: Hinweis/Fallback wie heute (Abschnitt bleibt sinnvoll, nicht leer und kaputt).

**02 Aktuelle Projekte (`#projekte`)** – „Dem Schweigen so nah“ (AT): Key Visual (vorhandenes Plakat `plakat-dem-schweigen-so-nah.jpg`), Titel, Status-Zeile „Kurzfilm · In Vorproduktion“ (Status aus `crowdfunding.json`), Handlung, Thema, Team (Texte aus heutigem `#projekt` übernehmen). Finanzierung: Ziel 7.500 €, wofür das Geld verwendet wird, Fortschrittsbalken „X von 7.500 € erreicht“ (aus `crowdfunding.json`, bei 0 € ausblenden wie heute), Button **„Projekt unterstützen“** öffnet den bestehenden Dialog (Überweisung mit GiroCode + PayPal). Hinweis Hilfetelefon „Gewalt gegen Frauen“ 116 016 bleibt. UN-Women-Statistik bekommt Quelle und Jahr (falls im heutigen Text vorhanden: ergänzen; sonst Platzhalter `[Quelle, Jahr – liefert Farouk]`). Überall „Unterstützen“ statt „Spenden“.
Rot gehört zur Filmwelt von „Dem Schweigen so nah“ und darf innerhalb dieses Projekt-Blocks (Titel-Akzent) bleiben; die Seite selbst bleibt Gold.

**03 Abgeschlossene Projekte (`#abgeschlossen`)** – „AMAR & LENA“: Titel, „Kurzfilm · 2024 · 15:15 Min.“, Kurzbeschreibung, Plakat, Standbilder (die 4 vorhandenen Stills, Klick vergrößert wie heute), Team. **Preise prominent** als Lorbeer-Kacheln (5 Preise + 1 Nominierung, Daten aus dem heutigen HTML; Nominierung optisch gedämpft). Button „Film ansehen ↗“ als normaler Link zu YouTube (neuer Tab, `rel="noopener"`), **kein Einbetten**. Regie-Credit: der Widerspruch („Ein Film von Peter Klomfass“ vs. Regie Klomfass + Yovogan) wird nicht aufgelöst, sondern neutral nur als „Regie: Peter Klomfass, Frieda Yovogan“ geführt und mit HTML-Kommentar `<!-- TODO Credits von Farouk bestätigen -->` markiert.

**04 Vita FFD Production (`#vita-ffd`)** – Zeitstrahl, neuestes oben: in Arbeit *Dem Schweigen so nah*, 2024 *AMAR & LENA*, 2022 *Smoke*, 2019–2020 *Zahra – A Declaration of Love to Godard*. Pro Eintrag Jahr, Titel, Format, Funktion von FFD/Farouk (wo bekannt), ggf. Festival/Preis. Kein „Bild folgt“; Bilder nur, wo vorhanden (z. B. `zahra.jpg`), sonst ohne Bild.

**05 Geschichte (`#geschichte`)** – Zitat „Geschichten, die bleiben.“, Gründung 2022 in Berlin, unabhängige Filmproduktion, Haltung (gesellschaftlich relevante Themen, persönliche Erzählweise) – Texte aus heutigem „Über“. Bedeutung des Namens „FFD“: Platzhalter `[Text liefert Farouk]`. Set-Foto: vorhandenes passendes Bild verwenden, sonst weglassen.

**06 Der Gründer (`#gruender`)** – großes Porträt (`farouk-portraet-gross.jpg`), „Farouk El-Khalili“, „Schauspieler · Autor · Produzent“, kurzer persönlicher Ich-Text. Bis Farouk liefert: Platzhalter klar markiert `[Persönlicher Text in Ich-Form – liefert Farouk]`, darunter die vorhandene Kurzbio als Übergang.

**07 Vita (`#vita`)** – Reiter **Film · Fernsehen · Theater** (zugängliche Tabs: `role=tablist`, Pfeiltasten). Einträge aus heutigem „Film und Fernsehen · Auswahl“ und „Theater · Auswahl“ (Film/Fernsehen aufteilen: Kino/FFD-Kurzfilme → Film, TV-Serien/TV-Filme → Fernsehen). Darunter Ausbildung (Berlin Acting Studio) und Mitgliedschaft BFFS. Links „Showreel“ und „Profil bei der Agentur“ als Platzhalter-Links (`href="#"` + TODO), bis Farouk URLs liefert. Ohne JS: alle drei Listen untereinander sichtbar.

**08 Kontakt (`#kontakt`)** – zwei klar getrennte Karten: links **FFD Production / Farouk El-Khalili** (E-Mail, Telefon, Anschrift; für Produktion, Kooperationen, Presse; Button „E-Mail schreiben“ = `mailto:`), rechts **Agentur FREHSE · Schauspiel** (Tanja Frehse, E-Mail, Telefon; Button „Agentur anschreiben“ = `mailto:anfrage@agenturfrehse.com`, *Entscheidung des Umsetzers*: keine Agentur-URL bekannt, daher kein geratener Link). Social-Media-Links nur, wenn Farouk welche liefert (sonst weglassen). „Nach oben ↑“. Fußzeile: Impressum · Datenschutz · © 2026 FFD Production · Gestaltung & Umsetzung: DeepMetis GmbH (wie heute).

## Nicht-Ziele

- Keine englische Fassung im Entwurf: EN-Umschalter entfällt vorerst (offene Frage an Farouk). Das `EN`-Wörterbuch-Prinzip wird nicht gepflegt; die Struktur soll aber Texte nicht so verstreuen, dass EN später unmöglich wird.
- Projekte kommen nicht ins CMS. Projekt-Blöcke sind im HTML gleich aufgebaut (`<article class="project">`), damit „Dem Schweigen so nah“ später per Umziehen des Blocks zu den abgeschlossenen Projekten wandern kann.
- Keine eigene Domain, kein Deploy auf `main` in dieser Phase.
- Blender-Hero (Branch `hero-blender`) wird **nicht** übernommen.
- Kein Laufband, kein Statement-Block, keine Kopfleiste, kein Custom-Cursor, kein Riesen-„FFD“ im Footer.

## Anti-Ziele (wäre ein Fehlschlag, auch wenn es „funktioniert“)

- Externe Ressourcen: keine Google Fonts, kein CDN, kein YouTube-Embed, kein Tracking. Die Datenschutzerklärung verspricht „keine Daten an Dritte“.
- Inhalte, die ohne JavaScript unsichtbar sind (Animationen nur per `gsap.from`).
- Platzhalter, die wie echte Inhalte aussehen (z. B. erfundene Zitate oder Credits). Platzhalter immer in eckigen Klammern sichtbar markiert.
- Bunte oder verspielte Gestaltung; der Look bleibt dunkel, ruhig, Gold nur als Akzent.
- Bruch der CMS-Pipeline (Farouk speichert weiterhin auf `main`).

## Randbedingungen

- Statisch, kein Framework, kein npm/Bundler. Dateien: `public/index.html`, `public/css/style.css`, `public/js/main.js`, `public/js/news.js` werden neu geschrieben bzw. angepasst. `fonts.css`: nur Inter wird gebraucht (Lora/Oswald/Source Serif nicht mehr laden; Fontdateien dürfen im Repo bleiben).
- Bibliotheken nur lokal aus `public/vendor/` (GSAP + ScrollTrigger 3.12.5, Lenis 1.1.14, qrcode). Lenis kennt keine `anchors`-Option → Ankerlinks über `lenis.scrollTo()`.
- `prefers-reduced-motion`: kein Smooth-Scroll (Sprünge), keine Einblendungen.
- Doppelt gepflegte Stellen (siehe `CLAUDE.md`): Impressum (`#dlg-imp` und `impressum.html`), Kontodaten (`BANK` in `main.js` und `<noscript>` in `#projekte`). Das Laufband `TAPE` entfällt → aus `CLAUDE.md` streichen.
- `scripts/build-content.mjs` und `.pages.yml` bleiben unverändert, solange keine Felder sich ändern. `news.html` entfällt → in `build-content.mjs`/`CLAUDE.md` evtl. Verweise anpassen.
- `datenschutz.html`: PayPal nennen (prüfen, ob schon drin), YouTube-Link (externer Link, keine Einbettung) kurz erwähnen. Im Look an die neue Seite angleichen (gleiches CSS).
- Anrede durchgehend „Sie“ (wie heute; offene Frage an Farouk, bis dahin Sie).
- Bilder: JPG, max. ~1800 px, möglichst < 250 KB. Quellmaterial nie ins Repo kopieren.
- Responsiv: 1440 px Desktop und 390 px Mobil sind die Prüfbreiten.

## Ansätze (im Gespräch abgewogen)

- **A – Neuer Branch im bestehenden Repo, Oberfläche neu, Unterbau bleibt.** Gewählt. Behält CMS, Unterstützen-Dialog, Impressum/Datenschutz, Vendor-Libs und Deploy-Action; Branch-Vorschau zur Abnahme.
- B – Freier Prototyp außerhalb des Repos, später übertragen: doppelte Arbeit, keine echten News. Verworfen.
- C – Bestehende Seite schrittweise umbauen: schleppt altes CSS mit, passt nicht zum neuen Look. Verworfen.

Look-Richtungen (Mockup gezeigt): **A streng nach Konzept** (gewählt), B Konzept mit Lora + silbergrau ans Logo angepasst, C Kinosaal mit Petrol-Schimmer.
Navigation: **1 Punkte am Rand** (gewählt), 2 Kopfleiste mit Menü, 3 nur Pfeile.

## Ablauf

1. Lokal auf Branch `relaunch` entwickeln (`node scripts/build-content.mjs`, `python3 -m http.server 8000 -d public`).
2. Screenshots 1440/390 prüfen, `/interface-review` vor Abnahme.
3. Erst auf Ansage des Nutzers: Branch pushen → Cloudflare-Vorschau (`wrangler pages deploy public --branch relaunch`) zur Abnahme durch Farouk. Kein Merge auf `main` ohne Freigabe.

## Alte Adressen weiterleiten (*Entscheidung des Umsetzers*)

Bereits geteilte Links dürfen nicht ins Leere laufen:
- `public/_redirects` (Cloudflare Pages): `/news.html  /#news  301`.
- Kleiner Alias in `main.js` beim Laden: `#projekt`→`#projekte`, `#aktuelles`→`#news`, `#filme`→`#abgeschlossen`, `#ueber`→`#geschichte` (per `history.replaceState`, dann scrollen). `#impressum` öffnet weiter den Dialog.

## Dem Umsetzer überlassen

- Genaue Abstände, Typo-Skala, Animations-Timings (ruhig, kurz), Form der Lorbeer-Kacheln.
- Ob die Punkte-Navigation `IntersectionObserver` oder ScrollTrigger nutzt.
- Struktur von `main.js` (darf von Grund auf neu sein; Bank-/QR-/Crowdfunding-Logik übernehmen).
- Aufteilung der Vita-Einträge auf Film vs. Fernsehen nach gesundem Menschenverstand.

## Platzhalter / liefert Farouk

Bedeutung „FFD“ · persönlicher Ich-Text · korrekte Credits AMAR & LENA · UN-Women-Quelle + Jahr · Showreel- und Agentur-Profil-URL · Social-Media-Links · ggf. Set-Foto · Entscheidung EN, du/Sie, eigene Domain.
