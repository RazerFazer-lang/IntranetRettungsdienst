const app = document.getElementById('app');
const breadcrumb = document.getElementById('breadcrumbCurrent');
let currentView = 'dashboard';
let selectedGuide = null;
let guideStep = 0;
let guideHistory = [];

const esc = (s='') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));

function render(){
  breadcrumb.textContent = currentView === 'abfrage' && selectedGuide ? selectedGuide.title : ({dashboard:'Dashboard',abfrage:'Abfragehilfe',notfallbilder:'Notfallbilder',checklisten:'Checklisten',wissen:'Wissen'}[currentView] || 'Dashboard');
  if(currentView==='dashboard') renderDashboard();
  else if(currentView==='abfrage') renderAbfrage();
  else if(currentView==='notfallbilder') renderNotfallbilder();
  else if(currentView==='checklisten') renderChecklisten();
  else renderWissen();
  bindDynamic();
}

function renderDashboard(){
 app.innerHTML = `
 <div class="hero">
  <span class="eyebrow red">DIGITALES RETTUNGSDIENST-INTRANET</span>
  <h1>Strukturiert handeln.<br>Ruhiger entscheiden.</h1>
  <p>Eine lokale digitale Einsatz- und Lernhilfe für strukturierte Abfragen, häufige Notfallbilder und praktische Checklisten.</p>
  <div class="search"><input id="globalSearch" placeholder="Suche: z. B. Atemnot, Schlaganfall, Hypoglykämie …" autocomplete="off"><button id="searchBtn">Suchen</button></div>
 </div>
 <section class="section"><div class="section-head"><div><h2>Häufige Abfragen</h2><p>Schneller Einstieg in typische Einsatzsituationen</p></div><button class="link-btn" data-view="notfallbilder">Alle anzeigen →</button></div>
  <div class="cards">${RD_DATA.common.slice(0,4).map((x,i)=>card(x,i)).join('')}</div>
 </section>
 <section class="section two-col"><div class="panel"><div class="panel-title">Direkter Zugriff</div><div class="quick-list">${RD_DATA.common.slice(0,6).map(x=>`<button class="quick-item" data-guide="${x.id}"><span>${esc(x.title)}<small>${esc(x.cat)}</small></span><span class="badge ${x.priority==='Kritisch'?'red':''}">${esc(x.priority)}</span></button>`).join('')}</div></div>
 <div class="panel"><div class="panel-title">Bereitschafts-Check</div><div class="notice result"><strong>Lokaler Offline-Modus aktiv</strong><br>Die Anwendung benötigt für die Kernfunktionen keine Internetverbindung.</div><div class="notice"><strong>Wichtiger Hinweis</strong><br>Diese Anwendung ersetzt keine lokalen SOPs, Algorithmen, Leitlinien oder ärztliche Anordnungen.</div></div></section>
 <div class="disclaimer">Ausbildungs- und Entscheidungshilfe · Inhalte müssen vor realem Einsatz an den zuständigen Träger, SOP-Stand und regionalen Vorgaben ausgerichtet werden.</div>`;
}

function card(x,i){const tones=['tone-red','tone-blue','tone-green','tone-amber'];const icons=['♥','🫁','🧠','✚'];return `<button class="card ${tones[i%4]}" data-guide="${x.id}"><div class="card-icon">${icons[i%4]}</div><h3>${esc(x.title)}</h3><p>${esc(x.desc)}</p></button>`}

function renderAbfrage(){
 if(selectedGuide) return renderGuide();
 app.innerHTML=`<div class="view-title"><div><span class="eyebrow">ABFRAGEHILFE</span><h1>Womit brauchst du Hilfe?</h1><p>Wähle ein häufiges Leitsymptom oder ein Themengebiet.</p></div></div>
 <div class="panel" style="margin-bottom:15px"><div class="search" style="margin:0;max-width:none"><input id="abfrageSearch" placeholder="Abfrage durchsuchen …"><button id="abfrageSearchBtn">Suchen</button></div></div>
 <div id="abfrageResults" class="search-results" style="margin-bottom:20px">${RD_DATA.common.map(x=>resultItem(x)).join('')}</div>
 <div class="section-head"><div><h2>Themengebiete</h2><p>Systematisch nach Fachbereich einsteigen</p></div></div><div class="category-grid">${RD_DATA.categories.map(c=>`<button class="category-card"><div class="card-icon tone-${c.tone}">${esc(c.icon)}</div><h3>${esc(c.title)}</h3><div class="mini">${esc(c.desc)}</div></button>`).join('')}</div>`;
}
function resultItem(x){return `<div class="result-card"><div><strong>${esc(x.title)}</strong><div style="color:var(--muted);font-size:12px;margin-top:4px">${esc(x.cat)} · <span class="badge ${x.priority==='Kritisch'?'red':''}">${esc(x.priority)}</span></div></div><button data-guide="${x.id}">Öffnen</button></div>`}

function renderGuide(){
 const g=selectedGuide; const step=g.steps[guideStep]; const isLast=guideStep===g.steps.length-1;
 app.innerHTML=`<div class="view-title"><div><span class="eyebrow red">ABFRAGE / ${guideStep+1} VON ${g.steps.length}</span><h1>${esc(g.title)}</h1><p>${esc(g.intro)}</p></div><button class="back" id="backToAbfrage">← Zur Übersicht</button></div>
 <div class="triage"><div class="stepper"><div class="panel-title">Ablauf</div>${g.steps.map((s,i)=>`<div class="step ${i===guideStep?'active':''}"><b>${i+1}</b> · ${esc(s.q)}</div>`).join('')}<div class="notice">Die Antworten dienen der strukturierten Orientierung. Lokale SOPs und qualifizierte klinische Beurteilung haben Vorrang.</div></div>
 <div class="question-card"><span class="eyebrow">SCHRITT ${guideStep+1}</span><h2>${esc(step.q)}</h2><div class="sub">Wähle die Antwort, die am ehesten zur aktuellen Situation passt.</div><div class="answer-grid">${step.answers.map((a,i)=>`<button class="answer" data-answer="${i}"><strong>${esc(a[0])}</strong><small>${esc(a[1])}</small></button>`).join('')}</div>
 ${isLast?'<div class="notice result" style="margin-top:20px"><strong>Abfrage abgeschlossen.</strong><br>Fasse die erhobenen Befunde strukturiert zusammen und wende den geltenden lokalen Algorithmus an.</div>':''}</div></div>`;
}

function renderNotfallbilder(){app.innerHTML=`<div class="view-title"><div><span class="eyebrow">NOTFALLBILDER</span><h1>Häufige Einsatzsituationen</h1><p>Direkteinstieg in strukturierte, symptomorientierte Abfragen.</p></div></div><div class="cards">${RD_DATA.common.map((x,i)=>card(x,i)).join('')}</div><div class="disclaimer">Die Inhalte sind als digitale Lern- und Strukturierungshilfe gedacht und müssen fachlich durch eine zuständige Stelle gepflegt werden.</div>`}
function renderChecklisten(){
 const checks=[['ABCDE','Strukturierte Ersteinschätzung'],['Reanimation','Lokalen Reanimationsalgorithmus öffnen'],['Übergabe','Strukturierte Patientenübergabe'],['Trauma','Traumacheck & Re-Evaluation'],['Pädiatrie','Gewicht, Vitalparameter, Warnzeichen'],['Transport','Vorbereitung und Dokumentation']];
 app.innerHTML=`<div class="view-title"><div><span class="eyebrow">CHECKLISTEN</span><h1>Praktische Kurzlisten</h1><p>Kompakte Erinnerungen für Ausbildung, Vorbereitung und Nachbesprechung.</p></div></div><div class="category-grid">${checks.map(c=>`<div class="panel"><div class="panel-title">${esc(c[0])}</div><p style="color:var(--muted);font-size:12px;line-height:1.5">${esc(c[1])}</p><div class="notice">Lokale Checkliste/SOP hinterlegen, bevor sie produktiv genutzt wird.</div></div>`).join('')}</div>`;
}
function renderWissen(){app.innerHTML=`<div class="view-title"><div><span class="eyebrow">WISSEN</span><h1>Wissensbereich</h1><p>Platz für Ausbildungsinhalte, lokale SOPs und erklärende Kurzartikel.</p></div></div><div class="two-col"><div class="panel"><div class="panel-title">Geplante Wissensmodule</div><div class="quick-list">${['Anatomie & Physiologie','Vitalparameter','Medikamentenkunde','EKG-Grundlagen','Atemweg & Beatmung','Traumaversorgung','Pädiatrische Besonderheiten','Kommunikation & Übergabe'].map(t=>`<div class="quick-item"><span>${t}</span><span class="badge">Modul</span></div>`).join('')}</div></div><div class="panel"><div class="panel-title">Content-Verwaltung</div><p style="color:var(--muted);font-size:12px;line-height:1.6">Die Inhalte liegen als lokale JavaScript-Daten vor. Damit kann das Projekt auf einem privaten Rechner, im LAN oder über eine statische GitHub-Pages-Installation betrieben und versioniert werden.</p></div></div>`}

function openGuide(id){const g=RD_DATA.guides[id]; if(!g){alert('Für diesen Eintrag ist noch kein Detail-Abfragebaum hinterlegt.');return;} selectedGuide=g;guideStep=0;guideHistory=[];currentView='abfrage';render()}
function bindDynamic(){
 document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{currentView=b.dataset.view;selectedGuide=null;render();closeMobile()});
 document.querySelectorAll('[data-guide]').forEach(b=>b.onclick=()=>openGuide(b.dataset.guide));
 const back=document.getElementById('backToAbfrage');if(back)back.onclick=()=>{selectedGuide=null;render()};
 document.querySelectorAll('.answer').forEach(b=>b.onclick=()=>{guideHistory.push(b.querySelector('strong').textContent);if(guideStep<selectedGuide.steps.length-1)guideStep++;render();});
 const sb=document.getElementById('searchBtn');if(sb)sb.onclick=()=>doSearch(document.getElementById('globalSearch').value);
 const gs=document.getElementById('globalSearch');if(gs)gs.addEventListener('keydown',e=>{if(e.key==='Enter')doSearch(gs.value)});
 const as=document.getElementById('abfrageSearch');if(as)as.oninput=()=>filterAbfrage(as.value);
}
function doSearch(q){const term=q.trim().toLowerCase();if(!term){currentView='notfallbilder';render();return}currentView='abfrage';selectedGuide=null;render();const input=document.getElementById('abfrageSearch');input.value=q;filterAbfrage(q)}
function filterAbfrage(q){const term=q.trim().toLowerCase();const box=document.getElementById('abfrageResults');if(!box)return;const arr=RD_DATA.common.filter(x=>[x.title,x.cat,x.desc].some(v=>v.toLowerCase().includes(term)));box.innerHTML=arr.length?arr.map(resultItem).join(''):`<div class="empty">Keine passenden Treffer gefunden.</div>`;document.querySelectorAll('[data-guide]').forEach(b=>b.onclick=()=>openGuide(b.dataset.guide));}
function closeMobile(){document.getElementById('sidebar').classList.remove('open')}
document.getElementById('mobileMenu').onclick=()=>document.getElementById('sidebar').classList.toggle('open');
const em=document.getElementById('emergencyModal');
document.getElementById('emergencyBtn').onclick=()=>{em.classList.remove('hidden');document.getElementById('emergencyGrid').innerHTML=RD_DATA.common.filter(x=>x.priority==='Kritisch').map(x=>`<button data-guide="${x.id}"><strong>${esc(x.title)}</strong><br><small style="color:var(--muted)">${esc(x.desc)}</small></button>`).join('');document.querySelectorAll('#emergencyGrid [data-guide]').forEach(b=>b.onclick=()=>{em.classList.add('hidden');openGuide(b.dataset.guide)})};
document.getElementById('closeEmergency').onclick=()=>em.classList.add('hidden');
em.addEventListener('click',e=>{if(e.target===em)em.classList.add('hidden')});
render();
