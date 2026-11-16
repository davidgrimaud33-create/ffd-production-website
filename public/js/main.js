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
  if(lenis){ if(immediate) lenis.resize(); lenis.scrollTo(el,{immediate:!!immediate,force:true}) }
  else el.scrollIntoView({behavior:(reduce||immediate)?'auto':'smooth',block:'start'});
  return true;
}
function scrollToId(id){ go(id,false) }

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
})();
