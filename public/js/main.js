(()=>{
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const hasGsap=!!(window.gsap&&window.ScrollTrigger);
if(hasGsap) gsap.registerPlugin(ScrollTrigger);
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];

/* ---------- Sprache: Deutsch ist die Vorlage, Englisch wird beim Laden eingesetzt ---------- */
const EN={
  "Prototyp · Entwurf 3 · DeepMetis für FFD Production": "Prototype · Draft 3 · DeepMetis for FFD Production",
  "Datenschutzerklärung und weitere Bilder folgen": "Privacy policy and further images to follow",
  "In Entwicklung": "In development",
  "Filme": "Films",
  "Über": "About",
  "Kontakt": "Contact",
  "Unterstützen": "Support",
  "Unabhängige Filmproduktion aus Berlin": "Independent film production from Berlin",
  "Gegründet 2022": "Founded 2022",
  "Scrollen öffnet das Bild ↓": "Scroll to open the frame ↓",
  "Worum es geht": "What we do",
  "FFD Production entwickelt und realisiert eigene Filmprojekte. Gesellschaftlich relevante Stoffe, persönlich und nah an den Figuren erzählt.": "FFD Production develops and produces its own film projects. Socially relevant stories, told personally and close to the characters.",
  "Geschichten, die bleiben.": "Stories that stay.",
  "Aktuell in Entwicklung": "Currently in development",
  "Kurzfilm · Arbeitstitel": "Short film · working title",
  "Vorproduktion": "Pre-production",
  "Kurzfilm (AT) · von Farouk El-Khalili & Simone Geißler": "Short film (working title) · by Farouk El-Khalili & Simone Geißler",
  "Als eine Polizistin ins Haus eines langjährigen Familienfreundes gerufen wird, glaubt sie an dessen Ehefrau Spuren von Misshandlung zu sehen. Kann sie ihrem Instinkt trauen oder steigert sie sich rein, weil sie an das familiäre Trauma erinnert wird, dem sie selbst schon einmal entkommen musste?": "When a police officer is called to the home of a long-standing family friend, she believes she sees signs of abuse on his wife. Can she trust her instinct, or is she reading too much into it because it reminds her of the family trauma she once had to escape herself?",
  "Jetzt unterstützen": "Support now",
  "Synopsis lesen": "Read the synopsis",
  "An Jörgs (48) Geburtstagsfeier gehören sein Kripo-Kollege Thomas (42) und dessen Schwester Steffi (45) zu den letzten Gästen. Sie feiern auch das Ende einer langen Ermittlung, bei der Jörg Thomas das Leben rettete. Seine Ehefrau Renée (45) ist ebenfalls anwesend, die beiden wirken wie ein harmonisches Paar, das sich kleine liebevolle Gesten schenkt. Auch das Verhältnis zwischen den Geschwistern ist sehr nahe, näher als die meisten sich stehen. Der Abend klingt entspannt aus, doch am nächsten Tag werden Steffi und ihr Kollege (31) zu einem abgebrochenen Notruf beordert. Die Adresse ist nicht unbekannt.": "At Jörg's (48) birthday party, his fellow detective Thomas (42) and Thomas's sister Steffi (45) are among the last guests. They are also celebrating the end of a long investigation during which Jörg saved Thomas's life. Jörg's wife Renée (45) is there too; the two seem a harmonious couple who exchange small, affectionate gestures. The bond between the siblings is also very close, closer than most. The evening winds down peacefully, but the next day Steffi and her colleague (31) are sent to an emergency call that was cut off. The address is not unfamiliar.",
  "Jörg öffnet die Haustür, überrascht und mit Blutspuren an der Hand. Renée sei die Treppe hinuntergestürzt und habe sich im Schock verwählt. Er habe bereits den Rettungsdienst gerufen. Obwohl Steffi Jörg als liebevollen und loyalen Menschen kennt, rät ihr ihr Instinkt genauer hinzusehen. Sie besteht darauf, Renée zu sehen, und ist geschockt von ihrem Anblick: Kratzer im Gesicht, eine aufgeplatzte Lippe, Würgemale am Hals – wie ein Treppensturz sieht das nicht aus. Doch Renée verteidigt verbissen ihren Mann. Auch Jörgs Fassade bröckelt nicht. Er zeigt sich weiterhin als besorgter Ehemann, der Steffi das Misstrauen nicht übelnimmt.": "Jörg opens the front door, surprised, with traces of blood on his hand. Renée fell down the stairs, he says, and dialled the wrong number in shock. He has already called an ambulance. Although Steffi knows Jörg as a loving and loyal person, her instinct tells her to look more closely. She insists on seeing Renée and is shocked by what she finds: scratches on her face, a split lip, strangulation marks on her neck. This does not look like a fall down the stairs. Yet Renée doggedly defends her husband. Jörg's façade does not crack either. He remains the concerned husband who does not hold Steffi's suspicion against her.",
  "Am Abend sucht Steffi bei Thomas Halt und Rat. Doch statt Verständnis erntet sie zunächst Widerstand. Ihr Bruder arbeitet seit Jahren Seite an Seite mit Jörg. Er verdankt ihm sein Leben und kann sich das Bild eines gewalttätigen Ehemanns nicht vorstellen. Doch auch Thomas weiß, wie das ist, wenn das eigene Haus eine Parallelwelt ist, deren Geschehnisse eisern geheim gehalten werden. Die Geschwister suchen Halt beieinander wie damals, und gleichzeitig fürchtet sich Steffi vor dem, wozu Thomas in der Lage ist.": "That evening Steffi turns to Thomas for support and advice. But instead of understanding, she first meets resistance. Her brother has worked side by side with Jörg for years. He owes him his life and cannot picture him as a violent husband. Yet Thomas, too, knows what it is like when your own home is a parallel world whose events are kept strictly secret. The siblings seek comfort in each other as they did back then, and at the same time Steffi fears what Thomas is capable of.",
  "Thema": "Theme",
  "Laut UN Women erlebt in Deutschland weniger als alle vier Minuten eine Frau Partnerschaftsgewalt. Und doch, die Taten bleiben im Dunkeln.": "According to UN Women, a woman in Germany experiences intimate partner violence less than every four minutes. And yet the acts remain in the dark.",
  "Dem Schweigen so nah zeigt, wie gut die Gewalt vor der Außenwelt verborgen wird, selbst vor dem engsten Umfeld. Doch Steffi, motiviert durch ihr eigenes familiäres Trauma, sieht jetzt hin. Und doch steht sie selbst als Polizistin den Geschehnissen machtlos gegenüber. Der Film erzählt von der Komplexität häuslicher Gewalt, wie schwer es bleibt, wirklich zu helfen, selbst für die, die genau dafür ausgebildet sind, und wie das Trauma auch nach Jahrzehnten die Betroffenen lenkt.": "Dem Schweigen so nah shows how well violence is hidden from the outside world, even from those closest. But Steffi, driven by her own family trauma, now looks. And yet, even as a police officer, she is powerless in the face of what happens. The film tells of the complexity of domestic violence, of how hard it remains to truly help, even for those trained to do exactly that, and of how trauma still steers those affected decades later.",
  "Produktion": "Production",
  "Regie": "Director",
  "Exposé": "Treatment",
  "Format": "Format",
  "Kurzfilm": "Short film",
  "Finanzierung": "Funding",
  "Finanzierungsziel": "Funding goal",
  "7.500": "7,500",
  "Dafür wird das Geld eingesetzt": "What the money is used for",
  "Gagen": "Fees for cast and crew",
  "Technik": "Equipment",
  "Drehort und Ausstattung": "Location and production design",
  "Postproduktion": "Post-production",
  "Festivaleinreichungen": "Festival submissions",
  "Barrierefreie Fassung": "Accessible version",
  "Brauchst du Hilfe?": "Do you need help?",
  "Hilfetelefon „Gewalt gegen Frauen“: rund um die Uhr, kostenfrei, anonym.": "German helpline “Violence against Women”: around the clock, free of charge, anonymous.",
  "Filme · realisiert": "Films · completed",
  "Filmografie": "Filmography",
  "Kurzfilm · 2024 · FFD Production": "Short film · 2024 · FFD Production",
  "Auf YouTube ansehen ↗": "Watch on YouTube ↗",
  "Ein Film von Peter Klomfass": "A film by Peter Klomfass",
  "Farouk El-Khalili spielt Amar und war als Produzent und Co-Autor beteiligt. Der Film wurde international auf Festivals präsentiert und mehrfach ausgezeichnet.": "Farouk El-Khalili plays Amar and was involved as producer and co-writer. The film was shown at festivals internationally and won several awards.",
  "Länge": "Length",
  "15:15 Min.": "15:15 min",
  "Premiere": "Premiere",
  "Crowdfunding, Eigenmittel": "Crowdfunding, own funds",
  "Auszeichnungen": "Awards",
  "5 Preise, 1 Nominierung": "5 awards, 1 nomination",
  "Buch": "Written by",
  "Besetzung": "Cast",
  "Preise und Auszeichnungen": "Awards and nominations",
  "Gewonnen": "Won",
  "Nominiert": "Nominated",
  "Sonderpreis Liebe, Glaube, Hoffnung": "Special award “Liebe, Glaube, Hoffnung”",
  "Standbilder und Plakat © FFD Production": "Stills and poster © FFD Production",
  "in Arbeit": "in progress",
  "AT": "WT",
  "Kurzfilm · Regie: Simone Geißler": "Short film · Director: Simone Geißler",
  "Kurzfilm · Regie: Peter Klomfass, Frieda Yovogan": "Short film · Directors: Peter Klomfass, Frieda Yovogan",
  "Kurzfilm · Regie: Ewa Wikiel": "Short film · Director: Ewa Wikiel",
  "Regie: Ewa Wikiel": "Director: Ewa Wikiel",
  "Bild folgt": "Image to follow",
  "Über FFD Production": "About FFD Production",
  "Produktion · Entwicklung · Regie": "Production · Development · Directing",
  "Fotos oben und links: Ronny Wunderlich": "Photos top and left: Ronny Wunderlich",
  "Schauspieler · Autor · Produzent": "Actor · Writer · Producer",
  "Farouk El-Khalili, 1981 in Berlin geboren, studierte Schauspiel am Berlin Acting Studio. Er arbeitet als Schauspieler, Model, Moderator und Sprecher für Film, Fernsehen und Theater.": "Farouk El-Khalili, born in Berlin in 1981, studied acting at Berlin Acting Studio. He works as an actor, model, presenter and voice artist for film, television and theatre.",
  "FFD Production wurde 2022 von dem Berliner Schauspieler, Autor und Produzenten Farouk El-Khalili gegründet. Die unabhängige Produktionsfirma entwickelt und realisiert eigene Filmprojekte mit einem besonderen Fokus auf gesellschaftlich relevante Stoffe und eine persönliche, charakterorientierte Erzählweise.": "FFD Production was founded in 2022 by the Berlin actor, writer and producer Farouk El-Khalili. The independent production company develops and produces its own film projects, with a particular focus on socially relevant material and a personal, character-driven way of telling stories.",
  "Mit dem Kurzfilm Amar & Lena (2024) realisierte FFD Production eine erste eigene Produktion, bei der El-Khalili als Produzent und Co-Autor beteiligt war. Der Film wurde international auf Festivals präsentiert und mehrfach ausgezeichnet.": "With the short film Amar & Lena (2024), FFD Production completed a first production of its own, with El-Khalili involved as producer and co-writer. The film was shown at festivals internationally and won several awards.",
  "Aktuell entwickelt FFD Production den Kurzspielfilm Dem Schweigen so nah (AT), bei dem El-Khalili als Produzent und Simone Geißler (Haus der Stille) als Regisseurin beteiligt ist.": "FFD Production is currently developing the short fiction film Dem Schweigen so nah (working title), with El-Khalili as producer and Simone Geißler (Haus der Stille) as director.",
  "Gegründet": "Founded",
  "Sitz": "Based in",
  "Verband": "Association",
  "Film und Fernsehen · Auswahl": "Film and television · selection",
  "ZDF / Odeon Fiction · Regie: Marijana Verhoef": "ZDF / Odeon Fiction · Director: Marijana Verhoef",
  "FFD Production · Regie: Peter Klomfass": "FFD Production · Director: Peter Klomfass",
  "Kino, ARD · Regie: Franziska Meyer Price": "Cinema, ARD · Director: Franziska Meyer Price",
  "TV-Serie, ZDF": "TV series, ZDF",
  "TV-Serie, ZDFneo · Regie: Christoph Schnee": "TV series, ZDFneo · Director: Christoph Schnee",
  "TV-Film, ZDF · Regie: Thomas Stuber": "TV film, ZDF · Director: Thomas Stuber",
  "Theater · Auswahl": "Theatre · selection",
  "Deutsche Oper Berlin · Regie: Christoph Loy": "Deutsche Oper Berlin · Director: Christoph Loy",
  "Schlosspark Theater · Regie: Irene Christ": "Schlosspark Theater · Director: Irene Christ",
  "Spilwut · Regie: Roman Streisand": "Spilwut · Director: Roman Streisand",
  "Lassen Sie uns über Film reden.": "Let's talk about film.",
  "Koproduktion, Förderung, Presse oder Unterstützung eines Projekts: Schreiben Sie uns.": "Co-production, funding, press or support for a project: write to us.",
  "E-Mail": "Email",
  "Kopieren": "Copy",
  "Kopiert": "Copied",
  "Anschrift": "Address",
  "Schauspielanfragen": "Acting enquiries",
  "Agentur FREHSE": "Agentur FREHSE",
  "Telefon": "Phone",
  "Impressum": "Legal notice",
  "Datenschutz folgt": "Privacy policy to follow",
  "Rechtliches": "Legal",
  "Schließen": "Close",
  "Inhaber: Farouk El-Khalili": "Owner: Farouk El-Khalili",
  "Rechtsform: Einzelunternehmen": "Legal form: sole proprietorship",
  "Telefon: +49 1520 3408257": "Phone: +49 1520 3408257",
  "E-Mail: ffd_production@t-online.de": "Email: ffd_production@t-online.de",
  "Inhaltlich verantwortlich": "Responsible for content",
  "Unterstützen · Überweisung": "Support · Bank transfer",
  "Überweisen Sie direkt auf das Konto von FFD Production. Mit dem QR-Code füllt Ihre Banking-App alle Angaben automatisch aus.": "Transfer directly to FFD Production's account. With the QR code, your banking app fills in all the details automatically (SEPA transfers).",
  "Betrag wählen (optional)": "Choose an amount (optional)",
  "Eigener Betrag": "Custom amount",
  "Kontoinhaber": "Account holder",
  "Verwendungszweck": "Payment reference",
  "GiroCode mit der Banking-App scannen": "Scan the GiroCode with your banking app",
  "Oder per PayPal": "Or via PayPal",
  "PayPal öffnen ↗": "Open PayPal ↗",
  "Link kopieren": "Copy link",
  "Start": "Start",
  "Entwicklung": "Development",
  "Geschichten, die bleiben": "Stories that stay",
  "QR-Code konnte nicht geladen werden.": "The QR code could not be loaded.",
  "FFD Production, zum Seitenanfang": "FFD Production, back to top",
  "Hauptnavigation": "Main navigation",
  "Logo FFD Production: silberne Buchstaben im Lichtkegel eines Projektors": "FFD Production logo: silver letters in the beam of a projector",
  "Plakat Dem Schweigen so nah: eine weiße Rose mit Blutspuren auf einem Steinboden, dahinter fällt Licht durch eine angelehnte Tür": "Poster for Dem Schweigen so nah: a white rose with traces of blood on a stone floor, light falling through a door left ajar behind it",
  "Danke": "Thank you",
  "Ansehen": "Watch",
  "Amar & Lena auf YouTube ansehen": "Watch Amar & Lena on YouTube",
  "Standbild aus Amar & Lena: Ein Paar steht nachts Stirn an Stirn unter einer Laterne vor einem Fabrikgebäude": "Still from Amar & Lena: a couple stand forehead to forehead at night under a street lamp in front of a factory building",
  "Plakat": "Poster",
  "Filmplakat Amar & Lena vergrößern": "Enlarge the Amar & Lena poster",
  "Filmplakat Amar & Lena: Ein Paar steht Stirn an Stirn vor einem Backsteingebäude mit erleuchteten Fenstern": "Amar & Lena poster: a couple stand forehead to forehead in front of a brick building with lit windows",
  "Größer": "Enlarge",
  "Standbild vergrößern": "Enlarge still",
  "Standbild aus Amar & Lena: Vier Menschen sitzen an einem gedeckten Tisch, eine Frau legt einem Mann die Hand auf die Schulter": "Still from Amar & Lena: four people sit at a laid table, a woman places her hand on a man's shoulder",
  "Standbild aus Amar & Lena: Eine Frau mit grünem Schal steht vor einer breiten Steintreppe": "Still from Amar & Lena: a woman with a green scarf stands in front of a wide stone staircase",
  "Standbild aus Amar & Lena: Zwei Frauen sprechen auf einem Waldweg, zwei weitere sehen zu": "Still from Amar & Lena: two women talk on a forest path while two others look on",
  "Zum Film": "View film",
  "Porträt Farouk El-Khalili in schwarzer Lederjacke, mit offenem Haar und ernstem Blick": "Portrait of Farouk El-Khalili in a black leather jacket, hair loose, with a serious look",
  "Porträt Farouk El-Khalili, lachend, mit zurückgebundenen Haaren": "Portrait of Farouk El-Khalili, laughing, hair tied back",
  "Farouk El-Khalili im Halbprofil vor dunklem Hintergrund": "Farouk El-Khalili in half profile against a dark background",
  "Bild in groß": "Enlarged image",
  "Betrag": "Amount",
  "GiroCode für die Überweisung": "GiroCode for the bank transfer"
};
const LANG=(()=>{ let l='de'; try{ l=localStorage.getItem('ffd-lang')||l }catch(e){} if(location.hash==='#en') l='en'; if(location.hash==='#de') l='de'; return l==='en'?'en':'de' })();
const T=s=>(LANG==='en'&&EN[s])||s;
if(LANG==='en'){ document.documentElement.lang='en';
  const tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT), nodes=[]; while(tw.nextNode()) nodes.push(tw.currentNode);
  nodes.forEach(n=>{ const p=n.parentNode&&n.parentNode.nodeName; if(p==='SCRIPT'||p==='STYLE') return; const raw=n.nodeValue, key=raw.replace(/\s+/g,' ').trim(); if(!key||!EN[key]) return;
    n.nodeValue=raw.match(/^\s*/)[0]+EN[key]+raw.match(/\s*$/)[0] });
  $$('[alt],[aria-label],[data-cursor]').forEach(el=>['alt','aria-label','data-cursor'].forEach(a=>{ const v=el.getAttribute(a); if(v&&EN[v]) el.setAttribute(a,EN[v]) })) }
$$('.lang button').forEach(b=>{ b.setAttribute('aria-pressed',b.dataset.lang===LANG); b.addEventListener('click',()=>{ if(b.dataset.lang===LANG) return;
  try{ localStorage.setItem('ffd-lang',b.dataset.lang) }catch(e){} location.hash=b.dataset.lang; location.reload() }) });

/* ---------- Daten ---------- */
const BANK={name:'FFD Production Film',iban:'DE14 1001 1001 2849 3506 03',bic:'',ref:'Unterstützung Produktion Dem Schweigen so nah'}; // Konto laut „Kontodaten Paypal etc.“, Verwendungszweck laut Farouk El-Khalili (13.11.2026)
const TAPE=[['Dem Schweigen so nah',0],['Produktion',1],['Amar & Lena',0],['Entwicklung',1],['Geschichten, die bleiben',0],['Regie',1]].map(([n,k])=>[n==='Regie'&&LANG==='en'?'Directing':T(n),k]);

/* ---------- Platzhalterbilder: Lichtkegel eines Projektors mit Staub ---------- */
const RNG=seed=>{let s=(seed+3)*48271%2147483647;return()=>(s=s*48271%2147483647)/2147483647};
function size(cv,cap=1.5){const cw=cv.clientWidth,ch=cv.clientHeight; if(!cw||!ch) return null;
  const d=Math.min(devicePixelRatio||1,cap),w=Math.round(cw*d),h=Math.round(ch*d); if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h} return {w,h,d}}
function dust(c,w,h,d,seed,t,n,ang){const r=RNG(seed+11), dx=Math.cos(ang), dy=Math.sin(ang), L=Math.hypot(w,h);
  for(let i=0;i<n;i++){const a=r(), sp=(r()-.5)*.34, ph=r()*6.28, sz=(.6+r()*1.6)*d, v=.004+r()*.012;
    const u=(a+t*.00002*v*60)%1, px=-w*.05+dx*L*u-dy*L*u*sp, py=-h*.1+dy*L*u+dx*L*u*sp;
    c.globalAlpha=(.25+.75*Math.abs(Math.sin(t*.0009+ph)))*(1-u)*.8; c.beginPath(); c.arc(px,py,sz,0,7); c.fill()}
  c.globalAlpha=1}
function paint(cv,seed,t=0){
  const s=size(cv); if(!s) return; const {w,h,d}=s, c=cv.getContext('2d');
  let g=c.createLinearGradient(0,0,w,h); g.addColorStop(0,'#1F4A55'); g.addColorStop(.75,'#16171A'); c.fillStyle=g; c.fillRect(0,0,w,h);
  const ang=.42+seed*.11+Math.sin(t*.0003+seed)*.025, L=Math.hypot(w,h)*1.25;
  c.save(); c.globalCompositeOperation='screen'; c.translate(-w*.05,-h*.1); c.rotate(ang);
  g=c.createLinearGradient(0,0,L,0); g.addColorStop(0,'rgba(245,242,236,.6)'); g.addColorStop(.45,'rgba(227,163,59,.2)'); g.addColorStop(1,'rgba(227,163,59,0)');
  c.fillStyle=g; c.beginPath(); c.moveTo(0,0); c.lineTo(L,-L*.17); c.lineTo(L,L*.17); c.closePath(); c.fill(); c.restore();
  c.fillStyle='#F5F2EC'; dust(c,w,h,d,seed,t,46,ang);
  g=c.createRadialGradient(w/2,h/2,Math.min(w,h)*.3,w/2,h/2,Math.max(w,h)*.75); g.addColorStop(0,'rgba(22,23,26,0)'); g.addColorStop(1,'rgba(22,23,26,.55)');
  c.fillStyle=g; c.fillRect(0,0,w,h);
}
const dustCv=$('#dust');
function paintDust(t){const s=size(dustCv,1.25); if(!s) return; const c=dustCv.getContext('2d'); c.clearRect(0,0,s.w,s.h); c.fillStyle='#DDE5E6'; dust(c,s.w,s.h,s.d,7,t,70,.62)}

/* ---------- Filmkorn ---------- */
const grain=$('#grain'), tiles=[];
for(let k=0;k<4;k++){const cv=document.createElement('canvas');cv.width=cv.height=160;const c=cv.getContext('2d'),id=c.createImageData(160,160);
  for(let i=0;i<id.data.length;i+=4){const v=Math.random()*255;id.data[i]=id.data[i+1]=id.data[i+2]=v;id.data[i+3]=255}c.putImageData(id,0,0);tiles.push(`url(${cv.toDataURL()})`)}
let gi=0; grain.style.backgroundImage=tiles[0]; if(!reduce) setInterval(()=>{grain.style.backgroundImage=tiles[gi=(gi+1)%4]},110);

/* ---------- Sanftes Scrollen ---------- */
const lenis=(window.Lenis&&!reduce)?new Lenis({duration:1.15}):null;
if(lenis){ if(hasGsap){lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0)} else {const raf=t=>{lenis.raf(t);requestAnimationFrame(raf)};requestAnimationFrame(raf)} }
$$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const el=document.getElementById(a.getAttribute('href').slice(1)); if(!el) return; e.preventDefault(); lenis?lenis.scrollTo(el,{offset:-60}):el.scrollIntoView({behavior:reduce?'auto':'smooth'})}));

/* ---------- Wörter aufteilen ---------- */
$$('[data-split]').forEach(el=>{const out=[]; el.childNodes.forEach(n=>{const cls=n.nodeType===1?n.className:''; n.textContent.split(/\s+/).filter(Boolean).forEach(w=>out.push(`<span class="w"><span class="i ${cls}">${w.replace(/&/g,'&amp;')}</span></span>`))}); el.innerHTML=out.join(' ')});

/* ---------- Laufband ---------- */
const track=$('#track'); const names=TAPE.map(([n,s])=>`<span${s?' class="s"':''}>${n.replace(/&/g,'&amp;')}</span>`).join(''); track.innerHTML=names.repeat(4);
let tx=0,lastY=scrollY,vel=0;

/* ---------- Finanzierungsfelder (Muster) ---------- */
const cnt=$('#cnt'), fmt=n=>Math.round(n).toLocaleString(LANG==='en'?'en-GB':'de-DE');

/* ---------- Dialog ---------- */
const dB=$('#dlg-bank'), dI=$('#dlg-img'), dImp=$('#dlg-imp'), zoom=$('#zoom');
$$('[data-open="imp"]').forEach(b=>b.addEventListener('click',()=>{dImp.showModal(); lenis&&lenis.stop()}));
[dB,dI,dImp].forEach(d=>{d.addEventListener('close',()=>lenis&&lenis.start()); d.addEventListener('click',e=>{if(e.target===d)d.close()})});
$$('[data-zoom]').forEach(b=>b.addEventListener('click',()=>{const im=b.querySelector('img'); zoom.src=im.src; zoom.alt=im.alt; dI.showModal(); lenis&&lenis.stop()}));
$$('[data-close]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
let amount=50;
function renderBank(){
  $('#b-name').textContent=BANK.name; $('#b-iban').textContent=BANK.iban; $('#b-ref').textContent=BANK.ref;
  const epc=['BCD','002','1','SCT',BANK.bic,BANK.name,BANK.iban.replace(/\s/g,''),amount?('EUR'+amount.toFixed(2)):'','','',BANK.ref].join('\n'); const box=$('#qr');
  if(window.qrcode){ if(qrcode.stringToBytesFuncs&&qrcode.stringToBytesFuncs['UTF-8']) qrcode.stringToBytes=qrcode.stringToBytesFuncs['UTF-8'];
    const q=qrcode(0,'M'); q.addData(epc); q.make(); box.innerHTML=q.createSvgTag({cellSize:4,margin:0,scalable:true}) } else box.textContent=T('QR-Code konnte nicht geladen werden.') }
$$('[data-open="bank"]').forEach(b=>b.addEventListener('click',()=>{ renderBank(); dB.showModal(); lenis&&lenis.stop() }));
$$('.amounts button').forEach(b=>b.addEventListener('click',()=>{$$('.amounts button').forEach(x=>x.setAttribute('aria-pressed',x===b)); amount=+b.dataset.amt; renderBank()}));
$$('.copy').forEach(b=>b.addEventListener('click',()=>{ const el=document.getElementById(b.dataset.copy);
  const sel=()=>{const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r)};
  const lbl=b.textContent, done=()=>{b.textContent=T('Kopiert');b.classList.add('ok');setTimeout(()=>{b.textContent=lbl;b.classList.remove('ok')},1600)};
  try{ navigator.clipboard.writeText(el.textContent).then(done,sel) }catch(e){ sel() } }));

/* ---------- Mauszeiger ---------- */
const cur=$('.cursor'), curL=$('.cursor span'); let mx=innerWidth/2,my=innerHeight/2,cx=mx,cy=my;
addEventListener('pointermove',e=>{mx=e.clientX;my=e.clientY});
if(fine){ document.addEventListener('pointerover',e=>{const t=e.target.closest('[data-cursor]'); cur.classList.toggle('big',!!t); if(t) curL.textContent=t.dataset.cursor}) }

/* ---------- Logo-Bild: quer für breite Bildschirme, hochkant (9:16) für Handys ---------- */
const logoImg=$('#logo-img'), LOGO_L=logoImg.src, LOGO_P='img/logo-hochkant.jpg';
// Je Bildfassung: Bildmaße und die Achse des Lichtstrahls (von oben links zur Ecke des F), Breite des Strahls am Anfang und am Ende
const VAR={l:{W:1536,H:1024,x0:55,y0:-45,dx:400,dy:380,w0:210,w1:30, logo:[445,325,1060,685], band:[.60,.02,1.02,.80], neb:[[.86,.30,.30,'52,116,148',.24],[.74,.86,.26,'40,84,120',.16],[.95,.72,.16,'227,163,59',.05]]},
           p:{W:900,H:1600,x0:-37,y0:448,dx:225,dy:207,w0:120,w1:16, logo:[199,650,701,933], band:[.30,.02,1.05,.42], neb:[[.78,.20,.5,'52,116,148',.24],[.3,.84,.5,'40,84,120',.16],[.85,.9,.3,'227,163,59',.05]]}};
let variant='';
function pickLogo(){ const st=$('.stage'), w=st.clientWidth, h=st.clientHeight; if(!w||!h) return; const v=w/h<.8?'p':'l';
  if(v!==variant){ variant=v; logoImg.src=v==='p'?LOGO_P:LOGO_L; bq=0; STARS=makeStars(VAR[v]) } }

/* ---------- Kosmos: Sternenfeld in drei Tiefen, dichter nach rechts, mit einem Sternenband und zartem Nebel ---------- */
const scv=$('#stars'), sctx=scv.getContext('2d'); let STARS=[];
function makeStars(V){ const r=RNG(97), out=[], [lx0,ly0,lx1,ly1]=V.logo, [bx0,by0,bx1,by1]=V.band, bl=Math.hypot(bx1-bx0,(by1-by0)*V.H/V.W);
  const ok=(x,y,band)=>{ // Wahrscheinlichkeit, dass hier ein Stern steht
    const m=70, inLogo=Math.max(0,Math.min(1,Math.min(x-lx0+m,lx1+m-x,y-ly0+m,ly1+m-y)/m));           // hinter dem Logo keine Sterne
    const right=Math.max(0,Math.min(1,(x/V.W-.18)/.55)), bd=(V.x0+V.dx*((y-V.y0)/V.dy)-x), beam=Math.max(0,Math.min(1,(Math.abs(bd)-40)/160)); // links und am Lichtstrahl dünner
    return (1-inLogo)*(band?1:(.12+.88*right*right))*(.25+.75*beam) };
  const add=(n,layer,band)=>{ let tries=0; while(n>0&&tries++<40000){ let x,y;
      if(band){ const u=r(), g=(r()+r()+r()-1.5)*.09; x=(bx0+(bx1-bx0)*u-(by1-by0)/bl*g)*V.W; y=(by0+(by1-by0)*u)*V.H+(bx1-bx0)/bl*g*V.W } else { x=r()*V.W; y=r()*V.H }
      if(x<0||x>V.W||y<0||y>V.H||r()>ok(x,y,band)) continue; n--;
      const tint=r(); out.push({x,y,l:layer,s:layer===0?.7+r()*.55:layer===1?1.25+r()*.8:1.5+r()*1.1,a:layer===0?.4+r()*.45:layer===1?.65+r()*.35:.8+r()*.2,
        ph:r()*6.28,tw:.3+r()*1.2,c:tint<.12?'255,214,150':tint<.45?'190,214,255':'232,240,250'}) } };
  add(950,0,false); add(700,0,true); add(260,1,false); add(110,1,true); add(36,2,false); return out }
function paintStars(t,p){ const V=VAR[variant]; if(!bq||!V) return; const c=sctx, q=bq, W=V.W*q, H=V.H*q; c.clearRect(0,0,scv.width,scv.height);
  for(const [nx,ny,nr,col,al] of V.neb){ const g=c.createRadialGradient(nx*W,ny*H,0,nx*W,ny*H,nr*W); g.addColorStop(0,`rgba(${col},${al})`); g.addColorStop(.5,`rgba(${col},${al*.4})`); g.addColorStop(1,`rgba(${col},0)`); c.fillStyle=g; c.fillRect(0,0,W,H) }
  const PX=[.004,.011,.026], mxo=fine?(mx/innerWidth-.5):0, myo=fine?(my/innerHeight-.5):0;      // nahe Sterne verschieben sich stärker: Tiefe
  for(const s of STARS){ const k=PX[s.l], x=(s.x+(-mxo*k*1.6-t*.0000009*k*60)*V.W)*q, y=(s.y+(-myo*k*1.2-p*k*2.2)*V.H)*q;
    const a=s.a*(s.l?(.7+.3*Math.sin(t*.0012*s.tw+s.ph)):1);
    if(s.l===2){ const R=s.s*4.2; const g=c.createRadialGradient(x,y,0,x,y,R); g.addColorStop(0,`rgba(${s.c},${a})`); g.addColorStop(.25,`rgba(${s.c},${a*.45})`); g.addColorStop(1,`rgba(${s.c},0)`); c.fillStyle=g; c.fillRect(x-R,y-R,R*2,R*2) }
    else { c.globalAlpha=a; c.fillStyle=`rgb(${s.c})`; c.fillRect(x,y,s.s,s.s); c.globalAlpha=1 } } }

/* ---------- Staub im Lichtstrahl: treibt mit leichtem Wind in dieselbe Richtung wie die größeren Partikel ---------- */
const bcv=$('#beamdust'), bctx=bcv.getContext('2d'); let bq=0;
// Korngröße in Gerätepixeln: fast alle zwischen einem halben und einem ganzen Pixel, wenige etwas größer
const BP=(()=>{const r=RNG(41),a=[]; for(let i=0;i<1400;i++) a.push({u:r(),o:(r()+r()+r()-1.5)/1.5,v:.5+r(),s:r()<.03?1.15+r()*.4:.5+r()*r()*.5,ph:r()*6.28,tw:.6+r()*1.6}); return a})();
function beamSize(){ pickLogo(); const st=$('.stage'), w=st.clientWidth, h=st.clientHeight, V=VAR[variant]; if(!w||!h||!V) return;   // Zeichenfläche so fein wie der Bildschirm
  const q=Math.min(2,Math.max(w/V.W,h/V.H)*(devicePixelRatio||1));
  if(Math.abs(q-bq)>.01){ bq=q; bcv.width=scv.width=Math.round(V.W*q); bcv.height=scv.height=Math.round(V.H*q) } }
function paintBeam(t){ beamSize(); const V=VAR[variant]; if(!bq||!V) return; const c=bctx, q=bq; c.clearRect(0,0,bcv.width,bcv.height); c.fillStyle='rgb(226,238,248)';
  const L=Math.hypot(V.dx,V.dy), ax=V.dx/L, ay=V.dy/L, sw=L/552;
  for(const p of BP){ const u=(p.u+t*.000016*p.v)%1, w=V.w0+(V.w1-V.w0)*u, d=u*L;
    const lat=p.o*w+(Math.sin(t*.0005*p.tw+p.ph)*6+Math.sin(t*.00013+p.ph*2)*10)*(1-u)*sw, x=V.x0+ax*d-ay*lat, y=V.y0+ay*d+ax*lat;
    c.globalAlpha=Math.min(1,u/.12,(1-u)/.1)*(.35+.65*Math.max(0,1-Math.abs(p.o)))*(.45+.55*Math.abs(Math.sin(t*.0011*p.tw+p.ph)));
    c.fillRect(x*q,y*q,p.s,p.s) }
  c.globalAlpha=1 }

/* ---------- Vorspann-Zähler ---------- */
(()=>{const n=$('#ldn'); if(!n||reduce) return; const t0=performance.now(); const tick=()=>{const k=Math.min(1,(performance.now()-t0)/1250); n.textContent=Math.round(k*100); if(k<1) requestAnimationFrame(tick)}; tick()})();

/* ---------- Abschnittsanzeige ---------- */
const pill=$('#pill'), SECS=[['.hero','Start'],['#projekt','In Entwicklung'],['#filme','Filme'],['#ueber','Über'],['#kontakt','Kontakt']].map(([q,t])=>[$(q),T(t)]); let pillI=-1;
function pillUpdate(){ let i=0; SECS.forEach(([el],k)=>{ if(el.getBoundingClientRect().top<innerHeight*.55) i=k });
  pill.classList.toggle('off',scrollY<40||!!document.querySelector('dialog[open]'));
  if(i!==pillI){ pillI=i; $('#pill-n').textContent='0'+(i+1); $('#pill-t').textContent=SECS[i][1] } }
addEventListener('scroll',pillUpdate,{passive:true}); pillUpdate();

/* ---------- Filmografie: Vorschaubild folgt der Zeile ---------- */
(()=>{ const wrap=$('#fg'), pv=$('#fg-pv'), im=$('#fg-img'), tag=$('#fg-tag'); if(!wrap||!fine) return;
  const SRC={s:()=>$('.poster2 img').src,a:()=>$('.shot.poster img').src,z:()=>'img/zahra.jpg'};
  $$('.fg-row',wrap).forEach(r=>{ r.addEventListener('pointerenter',()=>{ $$('.fg-row',wrap).forEach(x=>x.classList.toggle('act',x===r)); wrap.classList.add('on');
      const k=r.dataset.pv; if(k){im.src=SRC[k](); im.hidden=false; tag.hidden=true} else {im.hidden=true; tag.hidden=false}
      pv.style.top=(r.offsetTop+r.offsetHeight/2)+'px' }) });
  wrap.addEventListener('pointerleave',()=>wrap.classList.remove('on')) })();

/* ---------- Bildschleife ---------- */
const tc=$('#tc'), win=$('.win'), scenes=$$('canvas[data-scene]').map(cv=>({cv,seed:+cv.dataset.scene,vis:false}));
let winVis=true;
const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.target===win){winVis=e.isIntersecting;return} const s=scenes.find(s=>s.cv===e.target); if(s) s.vis=e.isIntersecting }),{rootMargin:'80px'});
io.observe(win); scenes.forEach(s=>io.observe(s.cv));
const paintStatic=()=>{scenes.forEach(s=>paint(s.cv,s.seed,4000)); paintDust(4000); paintBeam(4000); paintStars(4000,0)};
const t0=performance.now(), pad=n=>String(n).padStart(2,'0');
function frame(now){
  const t=now-t0;
  if(winVis){ paintDust(t); paintBeam(t); const hr=$('.hero').getBoundingClientRect(); paintStars(t,Math.min(1,Math.max(0,-hr.top/Math.max(1,hr.height-innerHeight)))); const fr=Math.floor(t/1000*24); tc.textContent=`${pad(Math.floor(fr/86400))}:${pad(Math.floor(fr/1440)%60)}:${pad(Math.floor(fr/24)%60)}:${pad(fr%24)}` }
  scenes.forEach(s=>{ if(s.vis) paint(s.cv,s.seed,t) });
  const y=scrollY; vel+=((y-lastY)-vel)*.2; lastY=y; tx-=.9+Math.abs(vel)*.5; const q=track.scrollWidth/4; if(q&&-tx>q) tx+=q; track.style.transform=`translate3d(${tx}px,0,0) skewX(${Math.max(-10,Math.min(10,-vel*.4))}deg)`;
  if(fine){ cx+=(mx-cx)*.22; cy+=(my-cy)*.22; cur.style.transform=`translate3d(${cx}px,${cy}px,0)` }
  requestAnimationFrame(frame);
}

/* ---------- Scroll-Choreografie ---------- */
function choreo(){
  const stage=$('.stage'), phone=innerWidth<=760;
  if(!hasGsap||reduce) return;
  gsap.timeline({scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom bottom',scrub:.7}})
    .fromTo(stage,{'--iy':phone?'33%':'24%','--ix':phone?'4%':'22%','--sc':phone?.93:.74},{'--iy':'0%','--ix':'0%','--sc':1,ease:'power2.inOut',duration:1},0)
    .to('.hero-foot,.hero-top',{opacity:0,duration:.3},0).to({}, {duration:.3});
  $$('[data-split="rise"]').forEach(el=>gsap.from(el.querySelectorAll('.i'),{yPercent:115,duration:1.1,ease:'expo.out',stagger:.07,scrollTrigger:{trigger:el,start:'top 90%',once:true}}));
  gsap.fromTo('[data-split="fill"] .i',{opacity:.18},{opacity:1,stagger:.1,ease:'none',scrollTrigger:{trigger:'.statement',start:'top 75%',end:'bottom 60%',scrub:.5}});
  gsap.from('.statement .quote',{opacity:0,x:-30,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.statement .quote',start:'top 88%',once:true}});
  gsap.from('.theme .fq',{opacity:0,x:-24,duration:1,ease:'power3.out',scrollTrigger:{trigger:'.theme',start:'top 85%',once:true}});
  ScrollTrigger.create({trigger:cnt,start:'top 90%',once:true,onEnter:()=>{const o={v:0}; gsap.to(o,{v:+cnt.dataset.to,duration:1.8,ease:'power2.out',onUpdate:()=>cnt.textContent=fmt(o.v)})}});
  gsap.from('.uses li',{opacity:0,x:-18,duration:.6,ease:'power3.out',stagger:.06,scrollTrigger:{trigger:'.uses',start:'top 90%',once:true}});
  gsap.from('.crew div',{opacity:0,x:-24,duration:.7,ease:'power3.out',stagger:.08,scrollTrigger:{trigger:'.crew',start:'top 88%',once:true}});
  gsap.from('.fund .left .frame',{clipPath:'inset(50% 0 50% 0)',duration:1.3,ease:'expo.out',scrollTrigger:{trigger:'.fund',start:'top 80%',once:true}});
  gsap.fromTo('.film-hero .frame',{scale:.78},{scale:1,ease:'none',scrollTrigger:{trigger:'.film-hero',start:'top 90%',end:'top 12%',scrub:.6}});
  gsap.to('.stills .shot:nth-child(2)',{yPercent:-22,ease:'none',scrollTrigger:{trigger:'.stills',start:'top bottom',end:'bottom top',scrub:true}});
  gsap.to('.stills .shot:nth-child(3)',{yPercent:-10,ease:'none',scrollTrigger:{trigger:'.stills',start:'top bottom',end:'bottom top',scrub:true}});
  gsap.from('.fg-row',{y:36,opacity:0,duration:.8,ease:'expo.out',stagger:.08,clearProps:'all',scrollTrigger:{trigger:'#fg',start:'top 88%',once:true}});
  gsap.fromTo('.film-hero img',{yPercent:-6,scale:1.14},{yPercent:6,scale:1.14,ease:'none',scrollTrigger:{trigger:'.film-hero',start:'top bottom',end:'bottom top',scrub:true}});
  gsap.from('.shot.poster',{y:60,rotate:-3,opacity:0,duration:1.1,ease:'expo.out',clearProps:'all',scrollTrigger:{trigger:'.film',start:'top 82%',once:true}});
  gsap.from('.stills .shot',{clipPath:'inset(100% 0 0 0)',duration:1.1,ease:'expo.out',stagger:.12,clearProps:'clipPath',scrollTrigger:{trigger:'.stills',start:'top 88%',once:true}});
  gsap.from('.facts div',{opacity:0,y:18,duration:.6,ease:'power3.out',stagger:.06,scrollTrigger:{trigger:'.facts',start:'top 90%',once:true}});
  gsap.from('.about .frame',{clipPath:'inset(0 0 100% 0)',duration:1.4,ease:'expo.out',scrollTrigger:{trigger:'.about',start:'top 78%',once:true}});
  gsap.fromTo('#giant',{'--ls':'-.08em',opacity:.5},{'--ls':'.1em',opacity:1,ease:'none',scrollTrigger:{trigger:'#giant',start:'top bottom',end:'bottom bottom',scrub:.6}});
}

const syn=$('#syn'); syn&&syn.addEventListener('toggle',()=>{hasGsap&&ScrollTrigger.refresh()});
function start(){ paintStatic(); choreo(); if(!reduce) requestAnimationFrame(frame); if(hasGsap) ScrollTrigger.refresh() }
(document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(start);
let rz; addEventListener('resize',()=>{clearTimeout(rz); rz=setTimeout(()=>{paintStatic(); hasGsap&&ScrollTrigger.refresh()},150)});
})();
