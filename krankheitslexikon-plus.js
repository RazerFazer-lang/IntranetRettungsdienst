(()=> {
  if(window.__rdKrankheitslexikonPlus)return;
  window.__rdKrankheitslexikonPlus=true;
  const BASE=[{"id":"dx-0000","name":"Sepsis","category":"Infektiologie","code":"A41","aliases":"Blutvergiftung","summary":"Sepsis ist ein Krankheitsbild aus dem Bereich Infektiologie.","focus":"Infektiöse Erkrankung; Fokus auf Infektionszeichen, Verlauf, Exposition und mögliche systemische Beteiligung.","redFlags":"Auffällige Vitalparameter, Bewusstseinsänderung oder rasche Verschlechterung ernst nehmen.","education":"Für Ausbildung/Strukturierung: Anamnese, klinische Untersuchung, Verlauf und relevante Befunde systematisch erfassen.","source":"ICD-10-GM 2026 Kapitel-/Kodierungsstruktur und kuratierte Ausbildungsbegriffe"}];
  const EXTRA=Array.isArray(window.RD_KRANKHEITSLEXIKON_EXTRA)?window.RD_KRANKHEITSLEXIKON_EXTRA:[];
  let DATA=[];
  const PAGE_SIZE=96;
  let page=1;
  let currentQuery='';
  let currentCategory='Alle';
  let datasetReady=false;
  let datasetPromise=null;
  const app=document.getElementById('app');
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
  const uniq=arr=>[...new Set(arr.filter(Boolean))];
  const nav=()=>{
    const old=document.querySelector('.nav-item[data-view="krankheiten"],.nav-item[data-view="krankheiten-plus"]');
    if(old){old.dataset.view='krankheiten-plus';old.innerHTML='<span class="nav-icon">📚</span><span class="nav-label">Krankheitsbilder</span>';return old;}
    const navEl=document.querySelector('.nav');
    if(!navEl)return null;
    const b=document.createElement('button');b.className='nav-item';b.dataset.view='krankheiten-plus';b.innerHTML='<span class="nav-icon">📚</span><span class="nav-label">Krankheitsbilder</span>';navEl.appendChild(b);return b;
  };
  const merge=official=>{
    const officialList=Array.isArray(official)&&official.length>10000?official:[];
    if(officialList.length)return officialList.filter(x=>x&&x.code&&x.name);
    const byCode=new Map();
    for(const x of EXTRA)if(x?.code&&x?.name)byCode.set(String(x.code),x);
    for(const x of BASE)if(x?.code)byCode.set(String(x.code),x);
    return [...byCode.values()];
  };
  const ensureDataset=()=>{
    if(datasetReady)return Promise.resolve();
    if(datasetPromise)return datasetPromise;
    datasetPromise=new Promise((resolve,reject)=>{
      const finish=()=>{DATA=merge(window.RD_ICD10GM_ALL);datasetReady=true;resolve()};
      if(Array.isArray(window.RD_ICD10GM_ALL)&&window.RD_ICD10GM_ALL.length){finish();return;}
      const existing=document.querySelector('script[data-rd-icd-all="true"]');
      if(existing){existing.addEventListener('load',finish,{once:true});existing.addEventListener('error',()=>reject(new Error('krankheitslexikon-all-2026.js konnte nicht geladen werden')),{once:true});return;}
      const s=document.createElement('script');s.src='./krankheitslexikon-all-2026.js';s.async=false;s.dataset.rdIcdAll='true';s.onload=finish;s.onerror=()=>reject(new Error('krankheitslexikon-all-2026.js konnte nicht geladen werden'));document.body.appendChild(s);
    });
    return datasetPromise;
  };
  function filtered(){const q=currentQuery.trim().toLowerCase();return DATA.filter(x=>(currentCategory==='Alle'||x.category===currentCategory)&&(!q||`${x.name} ${x.code} ${x.category} ${x.aliases||''}`.toLowerCase().includes(q)));}
  function draw(){
    nav();document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view==='krankheiten-plus'));
    const list=filtered();const totalPages=Math.max(1,Math.ceil(list.length/PAGE_SIZE));page=Math.min(page,totalPages);const start=(page-1)*PAGE_SIZE;const rows=list.slice(start,start+PAGE_SIZE);
    const CATS=['Alle',...uniq(DATA.map(x=>x.category))].sort((a,b)=>a==='Alle'?-1:b==='Alle'?1:a.localeCompare(b,'de'));
    const officialCount=Array.isArray(window.RD_ICD10GM_ALL)?window.RD_ICD10GM_ALL.length:0;
    const sourceLabel=officialCount>10000?'BfArM ICD-10-GM 2026 · vollständiger terminaler Katalog':'Kuratierter Fallback · vollständiger BfArM-Katalog wird nach CI-Generierung geladen';
    app.innerHTML=`<div class="view-title disease-plus-hero"><div><span class="eyebrow red">MEDIZINISCHES KRANKHEITSLEXIKON</span><h1>Krankheitsbilder &amp; Erkrankungen</h1><p>Vollständiger Offline-Katalog der terminalen ICD-10-GM-2026-Kodes. Suche nach Diagnose, ICD-Code, Synonym oder Fachbereich.</p></div></div><section class="disease-plus-toolbar panel"><div class="disease-plus-search"><input id="dxSearch" value="${esc(currentQuery)}" placeholder="z. B. Sepsis, Herzinfarkt, COPD, Meningitis, Eklampsie …" autocomplete="off"></div><select id="dxCategory">${CATS.map(c=>`<option value="${esc(c)}" ${c===currentCategory?'selected':''}>${esc(c)}</option>`).join('')}</select><button class="suite-btn primary" id="dxReset" type="button">Zurücksetzen</button><div class="disease-plus-meta">${list.length.toLocaleString('de-DE')} Treffer · ${DATA.length.toLocaleString('de-DE')} Einträge · Offizieller Datensatz: ${officialCount.toLocaleString('de-DE')} · Seite ${page}/${totalPages}</div></section><section class="disease-plus-source panel"><div><strong>Quelle &amp; Zweck</strong><span>${sourceLabel}. Terminale ICD-10-GM-2026-Kodes werden als konkrete Einträge angezeigt.</span></div><a href="https://klassifikationen.bfarm.de/icd-10-gm/kode-suche/htmlgm2026/index.htm" target="_blank" rel="noopener noreferrer">BfArM ICD-10-GM 2026 ↗</a></section><section id="dxResults" class="disease-plus-grid">${rows.map(x=>`<article class="disease-plus-card" tabindex="0" data-id="${esc(x.id)}"><div class="disease-plus-top"><span class="disease-plus-cat">${esc(x.category)}</span>${x.code?`<span class="disease-plus-code">${esc(x.code)}</span>`:''}</div><h2>${esc(x.name)}</h2><p>${esc(x.summary||x.name)}</p><div class="disease-plus-actions"><button class="suite-btn" type="button" data-dx-open="${esc(x.id)}">Details</button></div></article>`).join('')||'<div class="suite-note">Keine Treffer. Suchbegriff oder Fachbereich ändern.</div>'}</section><div class="disease-pagination">${Array.from({length:totalPages},(_,i)=>`<button type="button" class="disease-page ${i+1===page?'active':''}" data-page="${i+1}">${i+1}</button>`).slice(Math.max(0,page-3),Math.min(totalPages,page+2)).join('')}</div><div class="modal hidden" id="dxModal" role="dialog" aria-modal="true" aria-labelledby="dxTitle"><div class="modal-card disease-plus-modal"><div class="modal-head"><div><span class="eyebrow red">KRANKHEITSBILD</span><h2 id="dxTitle"></h2></div><button type="button" class="close dx-close" id="dxClose" aria-label="Schließen">×</button></div><div id="dxBody"></div></div></div>`;
    const open=id=>{const x=DATA.find(d=>d.id===id);if(!x)return;document.getElementById('dxTitle').textContent=x.name;document.getElementById('dxBody').innerHTML=`<div class="dx-detail-grid"><div class="dx-detail-item"><small>Fachbereich</small><strong>${esc(x.category)}</strong></div><div class="dx-detail-item"><small>ICD-10-GM</small><strong>${esc(x.code||'—')}</strong></div></div><div class="dx-detail-block"><h3>Kurzübersicht</h3><p>${esc(x.summary||x.name)}</p></div><div class="dx-detail-block"><h3>Worauf achten?</h3><p>${esc(x.focus||'Strukturiert Anamnese, Untersuchung und Verlauf erfassen.')}</p></div><div class="dx-detail-block"><h3>Warnzeichen</h3><p>${esc(x.redFlags||'Klinische Warnzeichen und relevante Veränderungen im Verlauf beachten.')}</p></div><div class="dx-detail-block"><h3>Ausbildungsfokus</h3><p>${esc(x.education||'Krankheitsbild erkennen, Befunde strukturieren und Verlauf dokumentieren.')}</p></div><div class="dx-detail-block"><h3>Suchbegriffe</h3><p>${esc(x.aliases||x.name)}</p></div><div class="suite-note">Ausbildungs-/Orientierungsinhalt. Keine individuelle Diagnose oder Therapieanweisung; lokale SOPs, Leitlinien und ärztliche Anordnungen haben Vorrang. Quelle: ${esc(x.source||'BfArM ICD-10-GM 2026')}.</div>`;document.getElementById('dxModal').classList.remove('hidden');};
    document.getElementById('dxSearch').addEventListener('input',e=>{currentQuery=e.target.value;page=1;draw()});document.getElementById('dxCategory').addEventListener('change',e=>{currentCategory=e.target.value;page=1;draw()});document.getElementById('dxReset').addEventListener('click',()=>{currentQuery='';currentCategory='Alle';page=1;draw()});document.getElementById('dxResults').addEventListener('click',e=>{const b=e.target.closest('[data-dx-open]');if(b)open(b.dataset.dxOpen)});document.getElementById('dxResults').addEventListener('keydown',e=>{if(e.key==='Enter'){const card=e.target.closest('.disease-plus-card');if(card)open(card.dataset.id)}});document.querySelectorAll('.disease-page').forEach(b=>b.addEventListener('click',()=>{page=Number(b.dataset.page)||1;draw()}));document.getElementById('dxClose').addEventListener('click',()=>document.getElementById('dxModal').classList.add('hidden'));document.getElementById('dxModal').addEventListener('click',e=>{if(e.target.id==='dxModal')e.target.classList.add('hidden')});
  }
  async function render(){await ensureDataset();draw()}
  window.renderKrankheitenPlus=()=>render();
  window.addEventListener('click',e=>{const b=e.target.closest?.('.nav-item[data-view="krankheiten-plus"]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();render().catch(err=>{console.error(err);app.innerHTML='<div class="suite-note suite-danger">Das vollständige Krankheitslexikon konnte nicht geladen werden.</div>'});document.querySelectorAll('.nav-item').forEach(x=>x.classList.toggle('active',x===b));const crumb=document.getElementById('breadcrumbCurrent');if(crumb)crumb.textContent='Krankheitsbilder';},true);
  nav();
})();
