const RD_CHECKLIST_ITEMS={
  'ABCDE':[
    ['Eigenschutz & Einsatzstelle','Gefahren, Umgebung und persönliche Schutzausrüstung berücksichtigen.'],
    ['A – Atemweg','Atemweg und Auffälligkeiten strukturiert beurteilen; lokalen Algorithmus beachten.'],
    ['B – Atmung','Atmung, Atemarbeit und relevante Messwerte erfassen und Verlauf beobachten.'],
    ['C – Kreislauf','Perfusion, Kreislauf und relevante Blutungen strukturiert erfassen.'],
    ['D – Neurologie','Bewusstseinslage, neurologische Auffälligkeiten und reversible Ursachen berücksichtigen.'],
    ['E – Entkleiden / Umgebung','Relevante Befunde vollständig erfassen und Wärmeerhalt sicherstellen.'],
    ['Re-Evaluation','Nach Veränderungen oder Maßnahmen erneut systematisch beurteilen.'],
    ['Dokumentation','Wichtige Befunde, Zeiten und Veränderungen festhalten.']
  ],
  'Reanimation':[
    ['Sicherheit prüfen','Eigenschutz und sichere Einsatzumgebung berücksichtigen.'],
    ['Reaktionslage prüfen','Bewusstsein und Reaktion strukturiert beurteilen.'],
    ['Atmung beurteilen','Normale Atmung bzw. auffällige/fehlende Atmung erkennen.'],
    ['Alarmierung & Team','Lokale Alarmierungs- und Rollenverteilung umsetzen.'],
    ['Lokalen Reanimationsalgorithmus nutzen','Aktuellen lokalen SOP-/Algorithmus verwenden; keine improvisierten Abweichungen.'],
    ['AED/Defibrillator','Gerät nach lokalem Algorithmus bereitstellen und Anweisungen beachten.'],
    ['Teamkommunikation','Maßnahmen, Zuständigkeiten und relevante Zeitpunkte klar kommunizieren.'],
    ['Re-Evaluation / Übergabe','Verlauf dokumentieren und strukturiert an das nächste Team übergeben.']
  ],
  'Übergabe':[
    ['Situation','Warum wurde der Patient vorgestellt? Aktuelles Hauptproblem und Dringlichkeit nennen.'],
    ['Hintergrund','Relevante Vorerkrankungen, Medikamente, Allergien und Ereignisverlauf zusammenfassen.'],
    ['Zeitpunkte','Beginn, letzte sichere Normalität und relevante Veränderungen dokumentieren.'],
    ['Einschätzung','Auffällige Befunde, Vitalwerte und Verlauf kurz und nachvollziehbar darstellen.'],
    ['Bisheriger Verlauf','Relevante bereits erfolgte Maßnahmen und beobachtete Reaktionen nennen.'],
    ['Empfehlung / weiteres Vorgehen','Lokalen Übergabeweg und vereinbarte nächsten Schritte klären.'],
    ['Rückfragen','Verständnis sichern und offene Fragen ausdrücklich klären.'],
    ['Dokumentation','Übergabe und wesentliche Informationen vollständig festhalten.']
  ],
  'Trauma':[
    ['Einsatzstelle & Mechanismus','Sicherheit, Unfallmechanismus und relevante Gefahren erfassen.'],
    ['Blutung','Offensichtliche oder relevante Blutungen erkennen und lokale SOP beachten.'],
    ['Primäre strukturierte Untersuchung','Lebensbedrohliche Auffälligkeiten systematisch priorisieren.'],
    ['Verletzungsmuster','Kopf, Thorax, Abdomen, Becken und Extremitäten gezielt auf Auffälligkeiten prüfen.'],
    ['Neurologischer Status','Bewusstsein und relevante neurologische Veränderungen dokumentieren.'],
    ['Begleitverletzungen','Mechanismus und Befunde im gesamten Patientenkontext re-evaluieren.'],
    ['Wärmeerhalt','Wärmeverlust vermeiden und Umgebung berücksichtigen.'],
    ['Re-Evaluation & Übergabe','Veränderungen, Zeiten und relevante Befunde strukturiert weitergeben.']
  ],
  'Pädiatrie':[
    ['Alter & Gewicht','Alter, ungefähres Gewicht und relevante Besonderheiten erfassen.'],
    ['Bezugsperson / Fremdanamnese','Eltern oder Bezugspersonen gezielt in die Anamnese einbeziehen.'],
    ['Verhalten & Bewusstsein','Verhalten, Kontaktfähigkeit und Bewusstseinslage altersgerecht beurteilen.'],
    ['Atmung','Atemarbeit, Auffälligkeiten und Verlauf strukturiert erfassen.'],
    ['Kreislauf / Perfusion','Perfusion und relevante Messwerte altersgerecht berücksichtigen.'],
    ['Ereignis & Verlauf','Beginn, Auslöser, Vorerkrankungen und zeitlichen Verlauf dokumentieren.'],
    ['Kinderschutz / Umfeld','Auffälligkeiten im Umfeld sachlich wahrnehmen und nach lokalen Vorgaben weiterleiten.'],
    ['Übergabe','Alter, Gewicht, Verlauf und wesentliche Befunde vollständig übergeben.']
  ],
  'Geburt':[
    ['Schwangerschaft & Geburtswoche','Schwangerschaftswoche und relevante Vorgeschichte erfassen.'],
    ['Geburtsphase','Geburtsfortschritt und aktuelle Situation strukturiert beschreiben.'],
    ['Mutter','Bewusstsein, Kreislauf, Atmung und relevante Beschwerden der Mutter erfassen.'],
    ['Blutung','Blutungszeichen erkennen und lokale geburtshilfliche SOP beachten.'],
    ['Kind','Geburtszeitpunkt und Zustand des Neugeborenen strukturiert erfassen.'],
    ['Wärme','Wärmeerhalt für Mutter und Kind berücksichtigen.'],
    ['Nachversorgung','Lokalen Ablauf für weitere Versorgung und Transport berücksichtigen.'],
    ['Übergabe','Wesentliche Zeiten, Befunde und Verlauf klar an das aufnehmende Team übergeben.']
  ],
  'Intoxikation':[
    ['Eigenschutz','Expositionsgefahr und sichere Arbeitsumgebung prüfen.'],
    ['Substanz','Mögliche Substanz(en), Produktname oder Verpackung erfassen.'],
    ['Menge & Zeitpunkt','Ungefähre Menge und Zeitpunkt der Exposition dokumentieren.'],
    ['Applikationsweg','Aufnahmeweg bzw. Expositionsart festhalten.'],
    ['Begleitexpositionen','Weitere Substanzen, Medikamente oder Betroffene berücksichtigen.'],
    ['Bewusstsein & Vitalfunktionen','Bewusstseinslage, Atmung, Kreislauf und Verlauf beobachten.'],
    ['Verpackung / Beweismittel','Produktverpackung oder verfügbare Informationen für die Übergabe sichern.'],
    ['Lokale Giftinfo-/SOP-Struktur','Zuständige lokale Informations- und Übergabewege nutzen.']
  ],
  'Psychiatrie':[
    ['Eigenschutz & Umgebung','Gefahrenquellen, Umfeld und Teampositionierung berücksichtigen.'],
    ['Kontakt herstellen','Ruhig, klar und respektvoll kommunizieren.'],
    ['Orientierung & Zustand','Bewusstsein, Orientierung und relevante Veränderungen erfassen.'],
    ['Eigengefährdung','Hinweise auf Selbstgefährdung strukturiert und ernsthaft ansprechen.'],
    ['Fremdgefährdung','Hinweise auf Gefährdung anderer und das Umfeld berücksichtigen.'],
    ['Kooperation','Kooperationsfähigkeit und notwendige Unterstützung im Team klären.'],
    ['Anamnese / Umfeld','Relevante Vorgeschichte, Substanzen, Medikamente und Fremdanamnese erfassen.'],
    ['Übergabe & Dokumentation','Beobachtungen sachlich dokumentieren und strukturiert übergeben.']
  ]
};

let checklistOpen=null;
let checklistState={};
const checklistKey=id=>'rd-checklist-'+id;
function loadChecklistState(id){
  if(checklistState[id]) return checklistState[id];
  try{const raw=localStorage.getItem(checklistKey(id));checklistState[id]=raw?JSON.parse(raw):Array(RD_CHECKLIST_ITEMS[id].length).fill(false)}catch(e){checklistState[id]=Array(RD_CHECKLIST_ITEMS[id].length).fill(false)}
  return checklistState[id];
}
function saveChecklistState(id,state){checklistState[id]=state;try{localStorage.setItem(checklistKey(id),JSON.stringify(state))}catch(e){}}
function checklistPct(state){return Math.round(state.filter(Boolean).length/state.length*100)}
function renderChecklistList(){
  const entries=RD_DATA.checklists.map((c,i)=>({id:c[0],desc:c[1],tone:['red','blue','green','amber'][i%4],items:RD_CHECKLIST_ITEMS[c[0]]||[]}));
  app.innerHTML=`<div class="view-title"><div><span class="eyebrow">CHECKLISTEN</span><h1>Interaktive Kurzlisten</h1><p>Jede Liste lässt sich öffnen, abhaken, zurücksetzen und lokal im Browser speichern. Für Ausbildung/RP; lokale SOPs haben Vorrang.</p></div></div><div class="category-grid checklist-grid">${entries.map(c=>{const st=loadChecklistState(c.id),pct=checklistPct(st);return `<button class="panel checklist-card" data-checklist="${esc(c.id)}"><div class="panel-title"><span class="checklist-icon tone-${c.tone}">✓</span>${esc(c.id)}</div><p class="muted-text">${esc(c.desc)}</p><div class="checklist-progress"><span><b>${st.filter(Boolean).length}</b>/${st.length} Punkte</span><b>${pct}%</b></div><div class="progress-track"><i style="width:${pct}%"></i></div><span class="checklist-open">Checkliste öffnen →</span></button>`}).join('')}</div>`;
}
function renderChecklistDetail(id){
  const title=id,items=RD_CHECKLIST_ITEMS[id]||[],state=loadChecklistState(id),done=state.filter(Boolean).length,pct=checklistPct(state);
  app.innerHTML=`<div class="view-title"><div><span class="eyebrow red">CHECKLISTE</span><h1>${esc(title)}</h1><p>Arbeitsliste für Ausbildung/RP. Keine individuelle medizinische Handlungsanweisung.</p></div><button class="back" data-checklist-back>← Alle Checklisten</button></div><div class="panel checklist-detail"><div class="checklist-detail-head"><div><div class="panel-title">${done} von ${items.length} erledigt</div><div class="progress-track large"><i style="width:${pct}%"></i></div></div><button class="secondary" data-checklist-reset>↻ Zurücksetzen</button></div><div class="checklist-items">${items.map((it,i)=>`<button class="check-item ${state[i]?'done':''}" data-checkitem="${i}"><span class="check-box">${state[i]?'✓':''}</span><span><strong>${esc(it[0])}</strong><small>${esc(it[1])}</small></span></button>`).join('')}</div><div class="notice" style="margin-top:18px"><strong>Hinweis:</strong> Inhalte dienen der Orientierung. Für reale Versorgung gelten eure aktuellen lokalen SOPs, Anordnungen und fachlichen Standards.</div></div>`;
}
renderChecklisten=function(){if(checklistOpen&&RD_CHECKLIST_ITEMS[checklistOpen])renderChecklistDetail(checklistOpen);else renderChecklistList()};

document.addEventListener('click',e=>{
  const open=e.target.closest('[data-checklist]');
  if(open&&!e.target.closest('[data-checkitem]')){checklistOpen=open.dataset.checklist;renderChecklisten();return}
  const back=e.target.closest('[data-checklist-back]');
  if(back){checklistOpen=null;renderChecklisten();return}
  const reset=e.target.closest('[data-checklist-reset]');
  if(reset&&checklistOpen){const empty=Array(RD_CHECKLIST_ITEMS[checklistOpen].length).fill(false);saveChecklistState(checklistOpen,empty);renderChecklisten();return}
  const item=e.target.closest('[data-checkitem]');
  if(item&&checklistOpen){const state=loadChecklistState(checklistOpen);const idx=Number(item.dataset.checkitem);state[idx]=!state[idx];saveChecklistState(checklistOpen,state);renderChecklisten();return}
});

renderChecklisten();
