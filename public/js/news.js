/* News-Feed: liest data/news.json (erzeugt von scripts/build-content.mjs), zeigt 3, der Rest hinter „Ältere News“.
   Texte kommen aus dem CMS und werden nur als Text eingesetzt, nie als HTML. Nur Deutsch. */
(()=>{
const el=(tag,cls,text)=>{ const e=document.createElement(tag); if(cls) e.className=cls; if(text!=null) e.textContent=text; return e };
const date=s=>{ const [y,m,d]=s.split('-'); return `${d}.${m}.${y}` };

function item(n){ const t=n.de||{};
  const a=el('article','nw'); a.id=n.id;
  const tm=el('time','nw-date',date(n.datum)); tm.dateTime=n.datum; a.appendChild(tm);
  const body=el('div','nw-body'); body.appendChild(el('h3','nw-title',t.titel||''));
  const box=el('div','nw-text');
  (t.text||'').split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean).forEach(par=>{ const p=el('p'); par.split('\n').forEach((line,i)=>{ if(i) p.appendChild(el('br')); p.appendChild(document.createTextNode(line)) }); box.appendChild(p) });
  body.appendChild(box);
  if(n.link){ const ln=el('a','nw-more','Mehr dazu ↗'); ln.href=n.link; ln.target='_blank'; ln.rel='noopener'; body.appendChild(ln) }
  a.appendChild(body);
  if(n.bild){ const f=el('div','nw-img'), im=el('img'); im.src=n.bild; im.alt=t.bild_text||''; im.loading='lazy'; im.decoding='async'; f.appendChild(im); a.appendChild(f); a.classList.add('has-img') }
  return a }

const box=document.querySelector('[data-news]'); if(!box) return;
const limit=+box.dataset.limit||3;
fetch('data/news.json',{cache:'no-cache'}).then(r=>r.ok?r.json():[]).catch(()=>[]).then(list=>{
  if(!Array.isArray(list)) list=[];
  list=list.filter(n=>n&&n.datum);   // unvollständige Einträge nicht anzeigen
  if(!list.length) box.appendChild(el('p','nw-empty','Derzeit keine Meldungen.'));
  list.forEach((n,i)=>{ const a=item(n); if(i>=limit) a.hidden=true; box.appendChild(a) });
  if(list.length>limit){
    const btn=el('button','btn-ghost','Ältere News'); btn.id='news-more'; btn.type='button';
    btn.addEventListener('click',()=>{ box.querySelectorAll('.nw[hidden]').forEach(a=>a.hidden=false); btn.remove(); window.ScrollTrigger&&ScrollTrigger.refresh() });
    box.after(btn);
  }
  window.ScrollTrigger&&ScrollTrigger.refresh();
});
})();
