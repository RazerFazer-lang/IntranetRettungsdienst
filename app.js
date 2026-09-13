const app = document.getElementById('app');
const breadcrumb = document.getElementById('breadcrumbCurrent');
let currentView = 'dashboard';
let selectedGuide = null;
let guideStep = 0;
let guideHistory = [];

const esc = (s='') => String(s).replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));
const iconFor = i => ['♥','🫁','🧠','✚','⚠','✦'][i % 6];

function render(){
  const labels={dashboard:'Dashboard',abfrage:'Abfragehilfe',notfallbilder:'Notfallbilder',checklisten:'Checklisten',wissen:'Wissen',rechner:'Rechner'};
  breadcrumb.textContent = currentView === 'abfrage' && selectedGuide ? selectedGuide.title : (labels[currentView] || 'Dashboard');
  if(currentView==='dashboard') renderDashboard();
  else if(currentView==='abfrage') renderAbfrage();
  else if(currentView==='notfallbilder') renderNotfallbilder();
  else if(currentView==='checklisten') renderChecklisten();
  else if(currentView==='rechner') renderRechner();
  else renderWissen();
  bindDynamic();
}

function renderDashboard(){
 app.innerHTML = `
 <div class="hero">
  <span class="eyebrow red">DIGITALES RETTUNGSDIENST-INTRANET</span>
  <h1>Strukturiert handeln.<br>Ruhiger entscheiden.</h1>
  <p>Lokale digitale Ausbildungs-, Dokumentations- und Entscheidungshilfe für strukturierte Abfragen, häufige Notfallbilder, Checklisten und Rechner.</p>
  <div class="search"><input id="globalSearch" placeholder="Suche: z. B. Atemnot, Schlaganfall, Hypoglykämie …" autocomplete="off"><button id="searchBtn">Suchen</button></div>
 </div>
 <section class="section"><div class="section-head"><div><h2>Häufige Abfragen</h2><p>Schneller Einstieg in typische Einsatzsituationen</p></div><button class="link-btn" data-view="notfallbilder">Alle anzeigen →</button></div>
  <div class="cards">${RD_DATA.common.slice(0,6).map((x,i)=>card(x,i)).join('')}</div>
 </section>
 <section class="section two-col"><div class="panel"><div class="panel-title">Direkter Zugriff</div><div class="quick-list">${RD_DATA.common.slice(0,8).map(x=>`<button class="quick-item" data-guide="${x.id}"><span>${esc(x.title)}<small>${esc(x.cat)}</small></span><span class="badge ${x.priority==='Kritisch'?'red':''}">${esc(x.priority)}</span></button>`).join('')}</div></div>
 <div class="panel"><div class="panel-title">Systemstatus</div><div class="status-row"><span><i class="dot green-dot"></i> Offline-Kernfunktionen</span><b>AKTIV</b></div><div class="status-row"><span><i class="dot blue-dot"></i> Abfragebäume</span><b>${RD_DATA.common.length} Fälle</b></div><div class="status-row"><span><i class="dot amber-dot"></i> Kategorien</span><b>${RD_DATA.categories.length}</b></div><div class="notice"><strong>Wichtiger Hinweis</strong><br>Die Anwendung ersetzt keine lokalen SOPs, Algorithmen, Leitlinien oder ärztliche Anordnungen.</div></div></section>
 <div class="disclaimer">Ausbildungs- und Strukturierungshilfe · Inhalte müssen vor realem Einsatz durch eine zuständige Stelle geprüft und an Träger, SOP-Stand und regionale Vorgaben angepasst werden.</div>`;
}

function card(x,i){return `<button class="card tone-${['red','blue','green','amber'][i%4]}" data-guide="${x.id}"><div class="card-icon">${iconFor(i)}</div><h3>${esc(x.title)}</h3><p>${esc(x.desc)}</p><span class="card-meta">${esc(x.cat)} · ${esc(x.priority)}</span></button>`}

function renderAbfrage(){
 if(selectedGuide) return renderGuide();
 app.innerHTML=`<div class="view-title"><div><span class="eyebrow">ABFRAGEHILFE</span><h1>Womit brauchst du Hilfe?</h1><p>Wähle ein Leitsymptom oder suche gezielt nach einer Einsatzsituation.</p></div></div>
 <div class="panel" style="margin-bottom:15px"><div class="search" style="margin:0;max-width:none"><input id="abfrageSearch" placeholder="Abfrage durchsuchen …"><button id="abfrageSearchBtn">Suchen</button></div></div>
 <div id="abfrageResults" class="search-results" style="margin-bottom:20px">${RD_DATA.common.map(x=>resultItem(x)).join('')}</div>
 <div class="section-head"><div><h2>Themengebiete</h2><p>Systematisch nach Fachbereich einsteigen</p></div></div><div class="category-grid">${RD_DATA.categories.map(c=>`<button class="category-card" data-category="${esc(c.title)}"><div class="card-icon tone-${c.tone}">${esc(c.icon)}</div><h3>${esc(c.title)}</h3><div class="mini">${esc(c.desc)}</div></button>`).join('')}</div>`;
}
function resultItem(x){return `<div class="result-card"><div><strong>${esc(x.title)}</strong><div style="color:var(--muted);font-size:12px;margin-top:4px">${esc(x.cat)} · <span class="badge ${x.priority==='Kritisch'?'red':''}">${esc(x.priority)}</span></div></div><button data-guide="${x.id}">Öffnen</button></div>`}

function buildFallbackGuide(item){
  return {title:item.title+' – Abfragehilfe',intro:'Strukturierte Orientierung anhand des Leitsymptoms. Antworten sind keine individuelle Diagnose.',steps:[
    {q:'Ist der Patient aktuell offensichtlich vital bedroht?',answers:[['kritische Auffälligkeit','Sofortige lokale Notfall-/Reanimationsalgorithmen priorisieren.'],['keine offensichtliche Bedrohung','Strukturiert weiter erheben.']]},
    {q:'Wie hat das Ereignis begonnen?',answers:[['plötzlich','Zeitpunkt und Verlauf exakt dokumentieren.'],['schleichend','Verlauf, Trigger und Veränderung erfassen.'],['unklar','Fremdanamnese und Umfeld einbeziehen.']]},
    {q:'Welche Begleitzeichen bestehen?',answers:[['Bewusstsein auffällig','Vigilanz und reversible Ursachen priorisieren.'],['Atmung auffällig','Atmung und Atemweg weiter beurteilen.'],['Kreislauf auffällig','Perfusion und Kreislaufverlauf beachten.'],['keine der genannten','Weitere symptomorientierte Anamnese.']]},
    {q:'Welche Zusatzinformationen fehlen noch?',answers:[['Medikamente / Vorerkrankungen','Medikation, Allergien und relevante Vorerkrankungen erfassen.'],['Zeitverlauf','Beginn, letzte Normalität und Veränderungen dokumentieren.'],['Umfeld / Mechanismus','Ereignisort, Mechanismus und Fremdanamnese prüfen.'],['nichts Wesentliches','Zusammenfassen, re-evaluieren und lokalen Algorithmus anwenden.']]}
  ]};
}

function renderGuide(){
 const g=selectedGuide; const step=g.steps[guideStep]; const isLast=guideStep===g.steps.length-1;
 app.innerHTML=`<div class="view-title"><div><span class="eyebrow red">ABFRAGE / ${guideStep+1} VON ${g.steps.length}</span><h1>${esc(g.title)}</h1><p>${esc(g.intro)}</p></div><button class="back" id="backToAbfrage">← Zur Übersicht</button></div>
 <div class="triage"><div class="stepper"><div class="panel-title">Ablauf</div>${g.steps.map((s,i)=>`<div class="step ${i===guideStep?'active':''}"><b>${i+1}</b> · ${esc(s.q)}</div>`).join('')}<div class="notice">Die Antworten dienen der strukturierten Orientierung. Lokale SOPs und qualifizierte klinische Beurteilung haben Vorrang.</div></div>
 <div class="question-card"><span class="eyebrow">SCHRITT ${guideStep+1}</span><h2>${esc(step.q)}</h2><div class="sub">Wähle die Antwort, die am ehesten zur aktuellen Situation passt.</div><div class="answer-grid">${step.answers.map((a,i)=>`<button class="answer" data-answer="${i}"><strong>${esc(a[0])}</strong><small>${esc(a[1])}</small></button>`).join('')}</div>
 ${isLast?'<div class="notice result" style="margin-top:20px"><strong>Abfrage abgeschlossen.</strong><br>Fasse die erhobenen Befunde strukturiert zusammen, dokumentiere relevante Zeitpunkte und wende den geltenden lokalen Algorithmus an.</div>':''}</div></div>`;
}

function renderNotfallbilder(){app.innerHTML=`<div class="view-title"><div><span class="eyebrow">NOTFALLBILDER</span><h1>Häufige Einsatzsituationen</h1><p>${RD_DATA.common.length} strukturierte Einstiege – lokal und ohne Backend.</p></div></div><div class="filter-row"><button class="filter active" data-filter="all">Alle</button>${['Kritisch','Hoch','Mittel'].map(p=>`<button class="filter" data-filter="${p}">${p}</button>`).join('')}</div><div id="caseGrid" class="cards">${RD_DATA.common.map((x,i)=>card(x,i)).join('')}</div><div class="disclaimer">Die Inhalte sind als digitale Lern- und Strukturierungshilfe gedacht und müssen fachlich durch eine zuständige Stelle gepflegt werden.</div>`}
function renderChecklisten(){
 app.innerHTML=`<div class="view-title"><div><span class="eyebrow">CHECKLISTEN</span><h1>Praktische Kurzlisten</h1><p>Kompakte Erinnerungen für Ausbildung, Vorbereitung und Nachbesprechung.</p></div></div><div class="category-grid">${RD_DATA.checklists.map(c=>`<div class="panel"><div class="panel-title">${esc(c[0])}</div><p style="color:var(--muted);font-size:12px;line-height:1.5">${esc(c[1])}</p><div class="notice">Lokale Checkliste/SOP hinterlegen, bevor sie produktiv genutzt wird.</div></div>`).join('')}</div>`;
}
function renderRechner(){
 app.innerHTML=`<div class="view-title"><div><span class="eyebrow">RECHNER</span><h1>Praktische Schnellrechner</h1><p>Technische Hilfen für Ausbildung und Vorbereitung. Keine Therapieempfehlungen.</p></div></div>
 <div class="two-col"><div class="panel"><div class="panel-title">BMI</div><div class="calc-grid"><label>Gewicht (kg)<input id="weight" type="number" min="1" step="0.1"></label><label>Größe (cm)<input id="height" type="number" min="30" step="0.1"></label></div><button class="primary" id="bmiBtn">Berechnen</button><div id="bmiResult" class="calc-result">—</div></div>
 <div class="panel"><div class="panel-title">GCS-Merkhilfe</div><div class="gcs-box"><div><b>Augen</b><span>4 spontan · 3 auf Ansprache · 2 Schmerzreiz · 1 keine</span></div><div><b>Sprache</b><span>5 orientiert · 4 verwirrt · 3 unpassend · 2 unverständlich · 1 keine</span></div><div><b>Motorik</b><span>6 befolgt · 5 lokalisiert · 4 zieht zurück · 3 Beugung · 2 Streckung · 1 keine</span></div></div><div class="notice">Nur als Lern-/Dokumentationshilfe; klinische Beurteilung und lokale Vorgaben beachten.</div></div></div>`;
}
function renderWissen(){app.innerHTML=`<div class="view-title"><div><span class="eyebrow">WISSEN</span><h1>Wissensbereich</h1><p>Platz für Ausbildungsinhalte, lokale SOPs und erklärende Kurzartikel.</p></div></div><div class="two-col"><div class="panel"><div class="panel-title">Wissensmodule</div><div class="quick-list">${['Anatomie & Physiologie','Vitalparameter','Medikamentenkunde','EKG-Grundlagen','Atemweg & Beatmung','Traumaversorgung','Pädiatrische Besonderheiten','Kommunikation & Übergabe','Hygiene & Eigenschutz','Dokumentation'].map(t=>`<div class="quick-item"><span>${t}</span><span class="badge">Modul</span></div>`).join('')}</div></div><div class="panel"><div class="panel-title">Content-Verwaltung</div><p style="color:var(--muted);font-size:12px;line-height:1.6">Die Inhalte liegen als lokale JavaScript-Daten vor. So kann das Projekt auf einem privaten Rechner, im LAN oder über GitHub Pages betrieben und versioniert werden.</p><div class="notice result"><strong>${RD_DATA.categories.length} Themenbereiche · ${RD_DATA.common.length} Einsatzbilder</strong><br>Die Datenstruktur ist bewusst erweiterbar.</div></div></div>`}

function openGuide(id){
 const existing=RD_DATA.guides[id];
 if(existing){selectedGuide=existing;}
 else{const item=RD_DATA.common.find(x=>x.id===id); if(!item)return; selectedGuide=buildFallbackGuide(item);}
 guideStep=0;guideHistory=[];currentView='abfrage';render()
}
function bindDynamic(){
 document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{currentView=b.dataset.view;selectedGuide=null;render();closeMobile()});
 document.querySelectorAll('[data-guide]').forEach(b=>b.onclick=()=>openGuide(b.dataset.guide));
 const back=document.getElementById('backToAbfrage');if(back)back.onclick=()=>{selectedGuide=null;render()};
 document.querySelectorAll('.answer').forEach(b=>b.onclick=()=>{guideHistory.push(b.querySelector('strong').textContent);if(guideStep<selectedGuide.steps.length-1)guideStep++;render();});
 const sb=document.getElementById('searchBtn');if(sb)sb.onclick=()=>doSearch(document.getElementById('globalSearch').value);
 const gs=document.getElementById('globalSearch');if(gs)gs.addEventListener('keydown',e=>{if(e.key==='Enter')doSearch(gs.value)});
 const as=document.getElementById('abfrageSearch');if(as)as.oninput=()=>filterAbfrage(as.value);
 document.querySelectorAll('.filter').forEach(b=>b.onclick=()=>filterPriority(b.dataset.filter));
 const bb=document.getElementById('bmiBtn');if(bb)bb.onclick=()=>{const w=parseFloat(document.getElementById('weight').value),h=parseFloat(document.getElementById('height').value);document.getElementById('bmiResult').textContent=(w>0&&h>0)?`BMI: ${(w/Math.pow(h/100,2)).toFixed(1)}`:'Bitte Werte eingeben.'};
}
function filterPriority(priority){document.querySelectorAll('.filter').forEach(b=>b.classList.toggle('active',b.dataset.filter===priority));document.getElementById('caseGrid').innerHTML=RD_DATA.common.filter(x=>priority==='all'||x.priority===priority).map((x,i)=>card(x,i)).join('');bindDynamic()}
function doSearch(q){const term=q.trim().toLowerCase();currentView='abfrage';selectedGuide=null;render();const input=document.getElementById('abfrageSearch');if(input){input.value=q;filterAbfrage(q)}}
function filterAbfrage(q){const term=q.trim().toLowerCase();const box=document.getElementById('abfrageResults');if(!box)return;const arr=RD_DATA.common.filter(x=>[x.title,x.cat,x.desc].some(v=>v.toLowerCase().includes(term)));box.innerHTML=arr.length?arr.map(resultItem).join(''):`<div class="empty">Keine passenden Treffer gefunden.</div>`;document.querySelectorAll('[data-guide]').forEach(b=>b.onclick=()=>openGuide(b.dataset.guide));}
function closeMobile(){document.getElementById('sidebar')?.classList.remove('open')}
document.getElementById('mobileMenu')?.addEventListener('click',()=>document.getElementById('sidebar')?.classList.toggle('open'));
const em=document.getElementById('emergencyModal');
document.getElementById('emergencyBtn')?.addEventListener('click',()=>{em?.classList.remove('hidden');const grid=document.getElementById('emergencyGrid');if(grid){grid.innerHTML=RD_DATA.common.filter(x=>x.priority==='Kritisch').map(x=>`<button data-guide="${x.id}"><strong>${esc(x.title)}</strong><br><small style="color:var(--muted)">${esc(x.desc)}</small></button>`).join('');grid.querySelectorAll('[data-guide]').forEach(b=>b.onclick=()=>{em.classList.add('hidden');openGuide(b.dataset.guide)})}});
document.getElementById('closeEmergency')?.addEventListener('click',()=>em?.classList.add('hidden'));
em?.addEventListener('click',e=>{if(e.target===em)em.classList.add('hidden')});
render();
