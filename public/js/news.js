/* Meldungen („Aktuelles“): liest data/news.json (erzeugt von scripts/build-content.mjs) und baut die Liste.
   Startseite: <div data-news="home" data-limit="3">, Archiv news.html: <div data-news="all">.
   Texte kommen aus dem CMS und werden nur als Text eingesetzt, nie als HTML. */
(()=>{
const LANG=(()=>{ let l='de'; try{ l=localStorage.getItem('ffd-lang')||l }catch(e){} if(location.hash==='#en') l='en'; if(location.hash==='#de') l='de'; return l==='en'?'en':'de' })();
const L=(de,en)=>LANG==='en'?en:de;
const PROJ={ffd:['FFD Production','FFD Production'],schweigen:['Dem Schweigen so nah','Dem Schweigen so nah'],amar:['Amar & Lena','Amar & Lena']};
const date=s=>{ const [y,m,d]=s.split('-').map(Number); return new Date(Date.UTC(y,m-1,d)).toLocaleDateString(LANG==='en'?'en-GB':'de-DE',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}) };
const el=(tag,cls,text)=>{ const e=document.createElement(tag); if(cls) e.className=cls; if(text!=null) e.textContent=text; return e };

function paragraphs(text){ const box=el('div','nw-text');
  text.split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean).forEach(par=>{ const p=el('p'); par.split('\n').forEach((line,i)=>{ if(i) p.appendChild(el('br')); p.appendChild(document.createTextNode(line)) }); box.appendChild(p) });
  return box }

function item(n,mode){ const t=(LANG==='en'&&n.en.titel&&n.en.text)?n.en:n.de;
  const a=el('article','nw'); a.id=n.id; if(n.bild) a.classList.add('has-img');
  if(n.bild){ const f=el('div','nw-img'), im=el('img'); im.src=n.bild; im.alt=t.bild_text||''; im.loading='lazy'; im.decoding='async'; f.appendChild(im); a.appendChild(f) }
  const body=el('div','nw-body');
  const meta=el('div','nw-meta label soft'); const tm=el('time',null,date(n.datum)); tm.dateTime=n.datum; meta.append(tm,el('span','nw-proj',L(...PROJ[n.projekt]||PROJ.ffd)));
  body.append(meta, el(mode==='home'?'h3':'h2','nw-title',t.titel), paragraphs(t.text));
  const act=el('div','nw-act');
  if(mode==='home'){ const more=el('a','nw-more label',L('Weiterlesen','Read more')+' →'); more.href='news.html#'+n.id; act.appendChild(more) }
  if(n.link){ const ln=el('a','nw-more label',L('Mehr dazu','Find out more')+' ↗'); ln.href=n.link; ln.target='_blank'; ln.rel='noopener'; act.appendChild(ln) }
  if(act.children.length) body.appendChild(act);
  a.appendChild(body); return a }

const boxes=[...document.querySelectorAll('[data-news]')]; if(!boxes.length) return;
fetch('data/news.json',{cache:'no-cache'}).then(r=>r.ok?r.json():[]).catch(()=>[]).then(list=>{
  boxes.forEach(box=>{ const mode=box.dataset.news, lim=+box.dataset.limit||Infinity, sec=box.closest('[data-news-section]');
    const items=list.slice(0,lim);
    if(!items.length){ if(mode==='all') box.appendChild(el('p','nw-empty',L('Noch keine Meldungen.','No news yet.'))); return }
    items.forEach(n=>box.appendChild(item(n,mode)));
    if(sec) sec.hidden=false;
    if(mode==='all'&&location.hash.length>3){ const t=document.getElementById(location.hash.slice(1)); if(t){ t.classList.add('hl'); t.scrollIntoView() } }
  });
  window.ScrollTrigger&&ScrollTrigger.refresh();
});

/* Archivseite: feste Texte übersetzen (data-en) und Sprachumschalter */
if(document.body.dataset.page==='news'){
  if(LANG==='en'){ document.documentElement.lang='en'; document.querySelectorAll('[data-en]').forEach(e=>e.textContent=e.dataset.en); document.title='News · FFD Production' }
  document.querySelectorAll('.lang button').forEach(b=>{ b.setAttribute('aria-pressed',b.dataset.lang===LANG); b.addEventListener('click',()=>{ if(b.dataset.lang===LANG) return;
    try{ localStorage.setItem('ffd-lang',b.dataset.lang) }catch(e){} location.hash=b.dataset.lang; location.reload() }) });
}
})();
