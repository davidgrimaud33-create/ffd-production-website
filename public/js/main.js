/* FFD Production – Startseite (Relaunch).
   Grundlage: sanftes Scrollen (Lenis), Ankerlinks, Alias für alte Adressen.
   Spätere Teile (Intro, Navigation, Unterstützen-Dialog, Impressum, Vita-Reiter) hängen sich an window.FFD.
   Regeln: Inhalte nie per CSS/JS vorab verstecken, Animationen nur mit gsap.from; bei reduzierter Bewegung kein Lenis. */
(()=>{
'use strict';
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasGsap=!!(window.gsap&&window.ScrollTrigger);
if(hasGsap) gsap.registerPlugin(ScrollTrigger);

/* Sanftes Scrollen: Lenis nur ohne reduzierte Bewegung, getaktet über GSAP (sonst eigenes rAF) */
const lenis=(window.Lenis&&!reduce)?new Lenis({duration:1.1}):null;
if(lenis){
  if(hasGsap){ lenis.on('scroll',ScrollTrigger.update); gsap.ticker.add(t=>lenis.raf(t*1000)); gsap.ticker.lagSmoothing(0) }
  else { const raf=t=>{ lenis.raf(t); requestAnimationFrame(raf) }; requestAnimationFrame(raf) }
}

/* Zu einem Abschnitt scrollen. immediate: ohne Animation (z. B. beim Laden mit Anker). */
function go(id,immediate){
  const el=document.getElementById(id); if(!el) return false;
  /* Nachgeladene Inhalte (News, Bilder) können das Ziel während des Scrollens verschieben: am Ende nachkorrigieren. */
  if(lenis){ if(immediate) lenis.resize(); lenis.scrollTo(el,{immediate:!!immediate,force:true,onComplete:()=>{
    if(Math.abs(el.getBoundingClientRect().top)>2){ lenis.resize(); lenis.scrollTo(el,{force:true,duration:.4}) } }}) }
  else el.scrollIntoView({behavior:(reduce||immediate)?'auto':'smooth',block:'start'});
  return true;
}
/* Abschnitts-Navigation (Pfeile, Punkte, Menü): scrollen und den Fokus auf den Abschnitt setzen,
   damit Tastatur und Screenreader dort weitermachen. tabindex=-1: fokussierbar, aber nicht in der Tab-Reihenfolge. */
function scrollToId(id){
  if(!go(id,false)) return;
  const el=document.getElementById(id);
  if(!el.hasAttribute('tabindex')) el.setAttribute('tabindex','-1');
  el.focus({preventScroll:true});
}

window.FFD=Object.assign(window.FFD||{},{scrollToId,lenis,reduce});

/* Alle Ankerlinks (auch später eingefügte) laufen über scrollToId und setzen den Hash ohne Sprung */
document.addEventListener('click',e=>{
  if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey) return;
  const a=e.target.closest('a[href^="#"]'); if(!a) return;
  const id=decodeURIComponent(a.getAttribute('href').slice(1));
  if(!id||!document.getElementById(id)) return;   // z. B. #impressum: bleibt für den Dialog frei
  e.preventDefault();
  scrollToId(id);
  history.replaceState(null,'','#'+id);
});

/* Alte Adressen (bereits geteilte Links) auf die neuen Abschnitte umbiegen */
const ALIAS={projekt:'projekte',aktuelles:'news',filme:'abgeschlossen',ueber:'geschichte'};
function initialHash(){
  let id=decodeURIComponent(location.hash.slice(1)); if(!id) return null;
  if(ALIAS[id]){ id=ALIAS[id]; history.replaceState(null,'','#'+id) }
  return document.getElementById(id)?id:null;
}
const startId=initialHash();
if(startId){
  if('scrollRestoration' in history) history.scrollRestoration='manual';
  go(startId,true);
  /* Bilder, Schriften und nachgeladene Meldungen verschieben die Lage noch: Ziel festhalten, bis der Besucher
     selbst scrollt/tippt oder 4 s vergangen sind. */
  let pinned=true;
  const unpin=()=>{ pinned=false; ro&&ro.disconnect(); EV.forEach(t=>removeEventListener(t,unpin)) };
  const EV=['wheel','touchstart','keydown','pointerdown'];
  EV.forEach(t=>addEventListener(t,unpin,{passive:true}));
  const ro=window.ResizeObserver?new ResizeObserver(()=>{ if(pinned) go(startId,true) }):null;
  ro&&ro.observe(document.body);
  addEventListener('load',()=>{ if(pinned) go(startId,true); hasGsap&&ScrollTrigger.refresh() },{once:true});
  setTimeout(unpin,4000);
}

/* Intro: Logo sanft einblenden (nur ohne reduzierte Bewegung) */
if(hasGsap&&!reduce) gsap.from('.intro-logo',{opacity:0,scale:.98,duration:1.2,ease:'power2.out'});

/* Punkte-Navigation: aktiver Abschnitt = der, der die Mitte des Viewports schneidet; im Intro ausgeblendet */
const dots=document.querySelector('.dots');
if(dots&&window.IntersectionObserver){
  const links=[...dots.querySelectorAll('a[href^="#"]')];
  const setActive=id=>{
    dots.classList.toggle('is-on',id!=='intro');
    links.forEach(a=>{ if(a.getAttribute('href')==='#'+id) a.setAttribute('aria-current','true'); else a.removeAttribute('aria-current') });
  };
  const io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting) setActive(e.target.id) }),{rootMargin:'-50% 0px -50% 0px'});
  document.querySelectorAll('main > section').forEach(s=>io.observe(s));
}

/* Mobiles Menü: Dialog, Lenis während der Anzeige anhalten */
const menu=document.getElementById('menu'), menuBtn=document.querySelector('.menu-btn');
if(menu&&menuBtn&&menu.showModal){
  /* Fokus zurück auf den Menü-Knopf nur bei Esc oder „Schließen“; nach einem Link-Klick bekommt der Ziel-Abschnitt den Fokus. */
  let refocus=true;
  const closeMenu=()=>{ if(menu.open){ menu.close(); window.FFD.lenis?.start() } };
  menuBtn.addEventListener('click',()=>{ menu.showModal(); menuBtn.setAttribute('aria-expanded','true'); window.FFD.lenis?.stop() });
  menu.addEventListener('close',()=>{ menuBtn.setAttribute('aria-expanded','false'); window.FFD.lenis?.start(); if(refocus) menuBtn.focus({preventScroll:true}); refocus=true });
  menu.querySelector('.menu-close').addEventListener('click',closeMenu);
  menu.addEventListener('click',e=>{ if(e.target.closest('a[href^="#"]')){ refocus=false; closeMenu() } });
  matchMedia('(min-width:761px)').addEventListener('change',e=>{ if(e.matches) closeMenu() });
}
/* Finanzierung: Zahlen aus data/crowdfunding.json (gepflegt über Pages CMS). Ohne Daten bleibt der statische Text stehen. */
const fmt=n=>Math.round(n).toLocaleString('de-DE');
const CF_STATUS={vorproduktion:'In Vorproduktion',crowdfunding:'Crowdfunding läuft',dreh:'In Dreharbeiten',post:'In Postproduktion',fertig:'Finanzierung abgeschlossen'};
fetch('data/crowdfunding.json',{cache:'no-cache'}).then(r=>r.ok?r.json():null).catch(()=>null).then(cf=>{
  if(!cf||!(cf.ziel>0)) return;
  const st=document.getElementById('cf-status'), goal=document.getElementById('cf-goal'), bar=document.querySelector('.cf-bar'), txt=document.getElementById('cf-text');
  if(st&&CF_STATUS[cf.status]) st.textContent=CF_STATUS[cf.status];
  if(goal) goal.textContent=fmt(cf.ziel)+' €';
  const goalTxt=document.getElementById('cf-goal-text'); if(goalTxt) goalTxt.textContent=fmt(cf.ziel)+' Euro';
  if(bar&&txt&&cf.gesammelt>0){
    const pct=Math.min(100,cf.gesammelt/cf.ziel*100);
    bar.hidden=false; txt.hidden=false;
    bar.setAttribute('aria-label',Math.round(pct)+' % des Finanzierungsziels erreicht');
    const parts=[fmt(cf.gesammelt)+' € von '+fmt(cf.ziel)+' € erreicht'];
    if(cf.unterstuetzende>0) parts.push(fmt(cf.unterstuetzende)+' Unterstützer:innen');
    if(cf.stand){ const [y,m,d]=cf.stand.split('-'); parts.push('Stand '+d+'.'+m+'.'+y) }
    txt.textContent=parts.join(' · ');
    const fill=bar.firstElementChild;
    if(hasGsap&&!reduce&&fill){ fill.style.setProperty('--p',pct+'%'); gsap.from(fill,{width:0,duration:1.2,ease:'power2.out',scrollTrigger:{trigger:bar,start:'top 90%',once:true}}) }
    else if(fill) fill.style.setProperty('--p',pct+'%');
  }
  hasGsap&&ScrollTrigger.refresh();
});

/* Unterstützen-Dialog: Kontodaten, GiroCode (EPC-QR), Kopieren-Knöpfe */
const BANK={name:'FFD Production Film',iban:'DE14 1001 1001 2849 3506 03',bic:'',ref:'Unterstützung Produktion Dem Schweigen so nah'}; // Auch im <noscript>-Block in index.html ändern.
/* Gemeinsames Dialog-Muster: Lenis anhalten/fortsetzen, Klick auf den Hintergrund und [data-close] schließen (Esc nativ) */
const bindDialog=d=>{
  d.addEventListener('close',()=>window.FFD.lenis?.start());
  d.addEventListener('click',e=>{ if(e.target===d) d.close() });
  d.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>d.close()));
};
const openDialog=d=>{ d.showModal(); window.FFD.lenis?.stop() };
const dB=document.getElementById('dlg-bank');
if(dB&&dB.showModal){
  let amount=60;
  const $=id=>document.getElementById(id);
  const renderBank=()=>{
    $('b-name').textContent=BANK.name; $('b-iban').textContent=BANK.iban; $('b-ref').textContent=BANK.ref;
    const epc=['BCD','002','1','SCT',BANK.bic,BANK.name,BANK.iban.replace(/\s/g,''),amount?('EUR'+amount.toFixed(2)):'','','',BANK.ref].join('\n'), box=$('qr');
    if(window.qrcode){
      if(qrcode.stringToBytesFuncs&&qrcode.stringToBytesFuncs['UTF-8']) qrcode.stringToBytes=qrcode.stringToBytesFuncs['UTF-8'];
      const q=qrcode(0,'M'); q.addData(epc); q.make(); box.innerHTML=q.createSvgTag({cellSize:4,margin:0,scalable:true});
    } else box.textContent='QR-Code konnte nicht geladen werden.';
  };
  bindDialog(dB);
  /* Auch Links (Startbild): ohne JS springen sie zum Abschnitt „Unterstützen“, mit JS öffnet der Dialog. */
  document.querySelectorAll('[data-open="bank"]').forEach(b=>b.addEventListener('click',e=>{ e.preventDefault(); renderBank(); openDialog(dB) }));
  dB.querySelectorAll('.amounts button').forEach(b=>b.addEventListener('click',()=>{
    dB.querySelectorAll('.amounts button').forEach(x=>x.setAttribute('aria-pressed',x===b)); amount=+b.dataset.amt; renderBank() }));
  dB.querySelectorAll('.copy').forEach(b=>b.addEventListener('click',()=>{
    const el=$(b.dataset.copy), lbl=b.textContent;
    const sel=()=>{ const r=document.createRange(); r.selectNodeContents(el); const s=getSelection(); s.removeAllRanges(); s.addRange(r) };
    const done=()=>{ b.textContent='Kopiert'; b.classList.add('ok'); setTimeout(()=>{ b.textContent=lbl; b.classList.remove('ok') },1600) };
    try{ navigator.clipboard.writeText(el.textContent.trim()).then(done,sel) }catch(e){ sel() } }));
}

/* Bild-Zoom (Plakat, Standbilder) */
const dI=document.getElementById('dlg-img'), zoomImg=document.getElementById('zoom');
if(dI&&zoomImg&&dI.showModal){
  bindDialog(dI);
  document.querySelectorAll('[data-zoom]').forEach(b=>b.addEventListener('click',()=>{
    const im=b.querySelector('img'); zoomImg.src=im.currentSrc||im.src; zoomImg.alt=im.alt; openDialog(dI) }));
}

/* Vita: Reiter (ARIA-Tabs). Ohne JS bleiben alle Bereiche sichtbar; `hidden` setzt erst dieses Skript. */
const vtabs=[...document.querySelectorAll('#vita [role="tab"]')];
if(vtabs.length){
  const sel=(i,focus)=>vtabs.forEach((t,k)=>{
    const on=k===i, p=document.getElementById(t.getAttribute('aria-controls'));
    t.setAttribute('aria-selected',on); t.tabIndex=on?0:-1; if(p) p.hidden=!on;
    if(on&&focus) t.focus();
  });
  sel(0);
  vtabs.forEach((t,i)=>{
    t.addEventListener('click',()=>sel(i));
    t.addEventListener('keydown',e=>{
      const n=vtabs.length, k={ArrowRight:(i+1)%n,ArrowLeft:(i+n-1)%n,Home:0,End:n-1}[e.key];
      if(k===undefined) return; e.preventDefault(); sel(k,true);
    });
  });
}

/* Impressum-Dialog: Fußzeilenlink und Direktaufruf über #impressum (z. B. von der Datenschutzseite) */
const dImp=document.getElementById('dlg-imp');
if(dImp&&dImp.showModal){
  bindDialog(dImp);
  document.querySelectorAll('[data-open="imp"]').forEach(a=>a.addEventListener('click',e=>{
    if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey) return;
    e.preventDefault(); openDialog(dImp);
  }));
  if(location.hash==='#impressum') openDialog(dImp);
}
})();
