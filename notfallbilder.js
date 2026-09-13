const RD_NOTFALL_EXTRAS = [
  // KRITISCH
  ['cardiac-arrest','Herz-Kreislauf-Stillstand','Reanimation','Kritisch','Bewusstlosigkeit oder fehlende normale Atmung; sofortige lokale Reanimationsstruktur priorisieren.'],
  ['resp-arrest','Respiratorisches Versagen','Atmung','Kritisch','Schwere Atemstörung mit akuter Bedrohung; lokale Notfallstrategie sofort priorisieren.'],
  ['shock','Schock / Kreislaufversagen','Herz & Kreislauf','Kritisch','Akute Kreislaufinstabilität oder Zeichen einer schweren Perfusionsstörung.'],
  ['massive-bleeding','Massive Blutung','Trauma','Kritisch','Lebensbedrohliche Blutung oder rascher Blutverlust.'],
  ['severe-anaphylaxis','Schwere Anaphylaxie','Allergie','Kritisch','Atemweg-, Atmungs- oder Kreislaufbeteiligung bei allergischer Reaktion.'],
  ['status-epilepticus','Status epilepticus / anhaltender Krampfanfall','Neurologie','Kritisch','Anhaltender oder wiederkehrender Anfall mit fehlender Erholung.'],
  ['severe-stroke','Schwerer Schlaganfallverdacht','Neurologie','Kritisch','Akute neurologische Ausfälle mit deutlicher Beeinträchtigung oder Bewusstseinsstörung.'],
  ['severe-trauma','Schweres Trauma / Polytrauma','Trauma','Kritisch','Mehrere relevante Verletzungen oder Verdacht auf unmittelbar lebensbedrohliche Verletzung.'],
  ['severe-burn','Schwere Verbrennung / Verätzung','Trauma','Kritisch','Großflächige, tiefe oder kritisch lokalisierte thermische bzw. chemische Verletzung.'],
  ['drowning-arrest','Ertrinkungsunfall mit Atem-/Kreislaufstillstand','Umwelt','Kritisch','Wasserunfall mit fehlender normaler Atmung oder Kreislaufstillstand.'],
  ['severe-intox','Schwere Intoxikation mit Bewusstseinsstörung','Intoxikation','Kritisch','Vergiftung mit Bewusstlosigkeit, schwerer Atemstörung oder Kreislaufproblemen.'],
  ['septic-shock','Schwere Infektion / Sepsisverdacht mit Instabilität','Infektiologie','Kritisch','Infektionsverdacht mit deutlicher Verschlechterung oder Kreislaufinstabilität.'],
  ['eclampsia','Eklampsie / Krampfanfall in der Schwangerschaft','Geburt','Kritisch','Schwangerschaft mit Krampfanfall oder schwerer akuter Verschlechterung.'],
  ['postpartum-hemorrhage','Starke Blutung nach Geburt','Geburt','Kritisch','Relevante postpartale Blutung oder Kreislaufbeeinträchtigung.'],
  ['peds-arrest','Pädiatrischer Kreislauf-/Atemstillstand','Pädiatrie','Kritisch','Kind mit fehlender normaler Atmung oder Kreislaufstillstand.'],

  // SEHR HOCH
  ['severe-dyspnea','Schwere Atemnot','Atmung','Sehr Hoch','Ausgeprägte Dyspnoe, deutliche Atemarbeit oder Sprechfähigkeit stark eingeschränkt.'],
  ['severe-asthma','Schwerer Asthmaanfall','Atmung','Sehr Hoch','Deutliche obstruktive Atemproblematik mit möglicher Verschlechterung.'],
  ['severe-copd','Schwere COPD-Exazerbation','Atmung','Sehr Hoch','Deutliche Verschlechterung gegenüber dem Ausgangszustand.'],
  ['chest-pain-red','Brustschmerz mit Warnzeichen','Herz & Kreislauf','Sehr Hoch','Thorakaler Schmerz mit Begleitzeichen wie Dyspnoe, Synkope oder ausgeprägter Instabilität.'],
  ['acs','Akutes Koronarsyndrom – Verdacht','Herz & Kreislauf','Sehr Hoch','Akuter Brustschmerz oder vergleichbare Ischämiezeichen; lokale SOP beachten.'],
  ['malignant-arrhythmia','Bedrohliche Herzrhythmusstörung','Herz & Kreislauf','Sehr Hoch','Symptomatische Rhythmusstörung mit Kreislauf- oder Bewusstseinsbeeinträchtigung.'],
  ['syncope-redflag','Synkope mit Warnzeichen','Herz & Kreislauf','Sehr Hoch','Bewusstseinsverlust mit kardialen, neurologischen oder traumatischen Warnhinweisen.'],
  ['gi-bleeding','Akute starke gastrointestinale Blutung','Gastroenterologie','Sehr Hoch','Hämatemesis, Meläna oder relevante Blutung mit klinischer Beeinträchtigung.'],
  ['acute-abdomen','Akutes Abdomen mit Warnzeichen','Gastroenterologie','Sehr Hoch','Starke akute Bauchbeschwerden mit deutlicher Verschlechterung oder Kreislaufauffälligkeit.'],
  ['severe-headache','Plötzlicher stärkster Kopfschmerz','Neurologie','Sehr Hoch','Akuter ungewöhnlich starker Kopfschmerz oder neurologische Begleitzeichen.'],
  ['new-seizure','Erstmaliger Krampfanfall','Neurologie','Sehr Hoch','Neuer Krampfanfall mit Abklärungsbedarf und möglicher Wiederholung.'],
  ['altered-consciousness','Akute Bewusstseinsstörung','Neurologie','Sehr Hoch','Neue relevante Vigilanzminderung oder unklare Bewusstseinsänderung.'],
  ['hypoglycemia-neuro','Hypoglykämie mit neurologischen Symptomen','Stoffwechsel','Sehr Hoch','Unterzuckerung mit deutlicher Vigilanz- oder Verhaltensveränderung.'],
  ['hyperglycemic-crisis','Verdacht auf hyperglykämische Krise','Stoffwechsel','Sehr Hoch','Deutliche Verschlechterung bei ausgeprägter Hyperglykämie oder passender Klinik.'],
  ['major-trauma','Relevantes Trauma','Trauma','Sehr Hoch','Hochenergetischer Mechanismus oder Verdacht auf relevante innere Verletzung.'],
  ['pelvic-trauma','Becken-/Hochenergie-Trauma','Trauma','Sehr Hoch','Relevantes Trauma mit möglicher Becken- oder großer innerer Verletzung.'],
  ['spinal-trauma','Wirbelsäulentrauma mit Neurologie','Trauma','Sehr Hoch','Trauma mit neuen motorischen, sensiblen oder Bewusstseinsauffälligkeiten.'],
  ['inhalation-burn','Inhalationstrauma / Rauchgasexposition','Trauma','Sehr Hoch','Rauch-/Brandexposition mit Atemwegs- oder Atemproblemen.'],
  ['major-poisoning','Schwere Vergiftung','Intoxikation','Sehr Hoch','Unklare Vergiftung mit deutlicher klinischer Beeinträchtigung.'],
  ['peds-dyspnea','Kind mit deutlicher Atemnot','Pädiatrie','Sehr Hoch','Altersabhängig deutlich erhöhte Atemarbeit oder klinische Verschlechterung.'],
  ['peds-altered','Kind mit Bewusstseinsstörung','Pädiatrie','Sehr Hoch','Neue deutliche Vigilanz- oder Reaktionsstörung.'],
  ['peds-seizure','Kind mit Krampfanfall','Pädiatrie','Sehr Hoch','Krampfanfall bei Kind, insbesondere erstmalig oder mit anhaltender Auffälligkeit.'],
  ['pregnancy-bleeding','Schwangere mit relevanter Blutung','Geburt','Sehr Hoch','Schwangerschaft mit stärkeren Blutungen oder zusätzlicher Instabilität.'],
  ['pregnancy-pain','Schwangere mit starken Schmerzen / Warnzeichen','Geburt','Sehr Hoch','Akute Schwangerschaftsbeschwerden mit deutlichen Warnzeichen.'],

  // HOCH
  ['moderate-dyspnea','Atemnot mittelgradig','Atmung','Hoch','Atemnot mit erhöhter Atemarbeit, aber ohne offensichtlichen Atemstillstand.'],
  ['moderate-asthma','Asthmaexazerbation','Atmung','Hoch','Symptomatische Verschlechterung einer bekannten obstruktiven Erkrankung.'],
  ['moderate-copd','COPD-Exazerbation','Atmung','Hoch','Atemwegsbeschwerden deutlich über dem individuellen Ausgangsniveau.'],
  ['palpitations-symptomatic','Palpitationen mit Beschwerden','Herz & Kreislauf','Hoch','Herzrasen/Herzstolpern mit Schwindel, Dyspnoe oder Brustbeschwerden.'],
  ['hypertensive-symptomatic','Symptomatisch hoher Blutdruck','Herz & Kreislauf','Hoch','Deutliche Beschwerden bei erhöhten Blutdruckwerten; Kontext entscheidet.'],
  ['fever-unwell','Fieber mit deutlichem Krankheitsgefühl','Infektiologie','Hoch','Fieber mit auffälligem Allgemeinzustand oder rascher Verschlechterung.'],
  ['suspected-sepsis','Infektionsverdacht / Sepsis-Risiko','Infektiologie','Hoch','Infektion mit systemischen Warnzeichen oder deutlicher Verschlechterung.'],
  ['severe-vomiting','Anhaltendes Erbrechen','Gastroenterologie','Hoch','Starkes oder anhaltendes Erbrechen mit möglicher Dehydratation oder Verschlechterung.'],
  ['renal-colic','Nierenkolik','Urologie','Hoch','Starke kolikartige Flankenschmerzen, ggf. mit Begleitsymptomen.'],
  ['urinary-retention','Akuter Harnverhalt','Urologie','Hoch','Akute Unfähigkeit zur Miktion mit Beschwerden.'],
  ['fracture-suspected','Frakturverdacht','Trauma','Hoch','Akute Verletzung mit Fehlstellung, starken Schmerzen oder Funktionsverlust.'],
  ['dislocation','Luxationsverdacht','Trauma','Hoch','Akute Fehlstellung oder deutlicher Funktionsverlust eines Gelenks.'],
  ['head-injury','Schädel-Hirn-Trauma mit Beschwerden','Trauma','Hoch','Kopfverletzung mit relevanten Beschwerden, Erbrechen oder Veränderung des Zustands.'],
  ['wound-large','Größere Wunde','Trauma','Hoch','Tiefe, klaffende oder schwer versorgbare Verletzung ohne massive Blutung.'],
  ['moderate-burn','Relevante Verbrennung','Trauma','Hoch','Verbrennung mit größerer Ausdehnung oder sensibler Lokalisation.'],
  ['allergic-reaction','Allergische Reaktion ohne Schock','Allergie','Hoch','Ausgedehnte Reaktion oder relevante Schleimhaut-/Hautbeteiligung ohne manifeste Instabilität.'],
  ['intoxication-alert','Intoxikation mit Bewusstseinsveränderung','Intoxikation','Hoch','Substanzaufnahme mit auffälligem Verhalten oder Vigilanzveränderung.'],
  ['psych-agitated','Akute psychische Krise mit starker Agitation','Psychiatrie','Hoch','Ausgeprägte Unruhe, Desorientierung oder mögliche Eigen-/Fremdgefährdung.'],
  ['suicidal-crisis','Akute Suizidkrise','Psychiatrie','Hoch','Konkrete Selbstgefährdung oder akute suizidale Krise.'],
  ['postpartum-pain','Akute Beschwerden nach Geburt','Geburt','Hoch','Relevante Beschwerden im Wochenbett oder direkt nach Geburt.'],
  ['peds-fever','Fieber bei Kind mit reduziertem Allgemeinzustand','Pädiatrie','Hoch','Fieber plus deutlich verändertes Verhalten oder Allgemeinzustand.'],
  ['peds-vomiting','Kind mit anhaltendem Erbrechen','Pädiatrie','Hoch','Anhaltendes Erbrechen mit deutlicher Beeinträchtigung oder Dehydratationszeichen.'],
  ['peds-injury','Relevante Verletzung bei Kind','Pädiatrie','Hoch','Trauma beim Kind mit stärkeren Schmerzen, Funktionsverlust oder auffälligem Verhalten.'],

  // MITTEL
  ['mild-dyspnea','Leichte Atemnot','Atmung','Mittel','Leichte Dyspnoe ohne offensichtliche Warnzeichen; Verlauf beachten.'],
  ['stable-chest-pain','Brustbeschwerden ohne aktuelle Warnzeichen','Herz & Kreislauf','Mittel','Thorakale Beschwerden ohne erkennbare akute Instabilität.'],
  ['stable-palpitations','Palpitationen ohne Warnzeichen','Herz & Kreislauf','Mittel','Herzstolpern/Herzrasen ohne Synkope oder deutliche Instabilität.'],
  ['mild-abdominal','Bauchschmerz ohne Warnzeichen','Gastroenterologie','Mittel','Akute Bauchbeschwerden ohne offensichtliche Red Flags.'],
  ['gastroenteritis','Gastroenteritis','Gastroenterologie','Mittel','Erbrechen/Durchfall bei zunächst stabilem Allgemeinzustand.'],
  ['constipation','Akute Obstipation','Gastroenterologie','Mittel','Verstopfung bzw. erschwerte Darmentleerung ohne deutliche Warnzeichen.'],
  ['urinary-tract','Harnwegsbeschwerden','Urologie','Mittel','Dysurie oder Harnwegsbeschwerden ohne relevante Systemzeichen.'],
  ['musculoskeletal-pain','Akute Muskel-/Gelenkbeschwerden','Bewegungsapparat','Mittel','Akute Schmerzen ohne offensichtliches Trauma oder neurologische Ausfälle.'],
  ['sprain','Distorsion / Verstauchung','Trauma','Mittel','Verletzung eines Gelenks mit Schmerzen und Funktionseinschränkung.'],
  ['minor-fracture','Stabiler Frakturverdacht','Trauma','Mittel','Frakturverdacht ohne deutliche Instabilität oder starke systemische Begleitzeichen.'],
  ['minor-burn','Kleinere Verbrennung','Trauma','Mittel','Begrenzte Verbrennung ohne kritische Lokalisation.'],
  ['superficial-wound','Oberflächliche Wunde','Trauma','Mittel','Kleine Verletzung ohne relevante Blutung oder Funktionsverlust.'],
  ['fever-stable','Fieber bei stabilem Allgemeinzustand','Infektiologie','Mittel','Fieber ohne deutliche Kreislauf-, Atem- oder Bewusstseinsauffälligkeit.'],
  ['cough','Akuter Husten','Atmung','Mittel','Husten ohne deutliche Atemnot oder relevante Warnzeichen.'],
  ['sore-throat','Akute Halsschmerzen','HNO','Mittel','Halsschmerz ohne relevante Atemwegs- oder Schluckproblematik.'],
  ['migraine-known','Bekannte Migräne','Neurologie','Mittel','Typischer Kopfschmerz bei bekanntem Verlauf ohne neue Warnzeichen.'],
  ['back-pain','Akute Rückenschmerzen','Bewegungsapparat','Mittel','Rückenschmerz ohne neue neurologische Defizite oder Trauma.'],
  ['anxiety','Akute Angst-/Panikattacke','Psychiatrie','Mittel','Akute starke Angst oder Panik ohne andere offensichtliche Bedrohungszeichen.'],
  ['insomnia','Akute Schlafstörung / Erschöpfung','Allgemein','Mittel','Ausgeprägte, aber stabile Beschwerden ohne akuten Notfallhinweis.'],
  ['pregnancy-nausea','Schwangerschaftsübelkeit ohne Warnzeichen','Geburt','Mittel','Übelkeit/Erbrechen bei stabilem Zustand und ohne Blutung oder starke Schmerzen.'],

  // NIEDRIG
  ['mild-cold','Leichte Erkältung','Allgemein','Niedrig','Leichte Infektzeichen ohne relevante Atemwegs- oder Kreislaufprobleme.'],
  ['mild-headache','Leichter Kopfschmerz','Neurologie','Niedrig','Leichte, bekannte oder unspezifische Kopfschmerzen ohne Warnzeichen.'],
  ['minor-backpain','Leichter Rückenschmerz','Bewegungsapparat','Niedrig','Muskuloskelettale Beschwerden ohne Trauma oder neurologische Ausfälle.'],
  ['minor-joint-pain','Leichte Gelenkbeschwerden','Bewegungsapparat','Niedrig','Leichte Gelenkschmerzen mit erhaltener Funktion.'],
  ['minor-nausea','Leichte Übelkeit','Gastroenterologie','Niedrig','Übelkeit ohne relevantes Erbrechen oder deutliche Verschlechterung.'],
  ['mild-diarrhea','Leichter Durchfall','Gastroenterologie','Niedrig','Durchfall bei stabilem Allgemeinzustand.'],
  ['skin-rash','Hautausschlag ohne Systemzeichen','Dermatologie','Niedrig','Hautveränderung ohne Atemwegs-, Kreislauf- oder Bewusstseinsstörung.'],
  ['mild-eczema','Ekzem / Hautreizung','Dermatologie','Niedrig','Lokale Hautbeschwerden ohne akute Systembeteiligung.'],
  ['minor-injury','Kleine Verletzung','Trauma','Niedrig','Kleine Prellung oder oberflächliche Verletzung.'],
  ['bruise','Prellung / Hämatom','Trauma','Niedrig','Lokale Verletzung mit begrenzter Symptomatik.'],
  ['earache','Ohrenschmerzen','HNO','Niedrig','Ohrbeschwerden ohne relevante Allgemeinsymptome.'],
  ['toothache','Zahnschmerzen','Zahn','Niedrig','Akute Zahnbeschwerden ohne Atemwegs- oder Kreislaufbeteiligung.'],
  ['mild-dysuria','Leichte Beschwerden beim Wasserlassen','Urologie','Niedrig','Leichte urologische Beschwerden ohne Fieber oder Flankenschmerz.'],
  ['chronic-pain','Bekannte chronische Schmerzen','Allgemein','Niedrig','Beschwerdezunahme ohne neue Warnzeichen.'],
  ['medication-question','Frage zur bestehenden Medikation','Allgemein','Niedrig','Informationsbedarf ohne akute Verschlechterung.'],

  // SEHR NIEDRIG
  ['minor-skin-lesion','Kleine Hautläsion','Dermatologie','Sehr Niedrig','Begrenzte, stabile Hautveränderung ohne akute Systemzeichen.'],
  ['small-abrasion','Kleine Schürfwunde','Trauma','Sehr Niedrig','Oberflächliche Verletzung mit geringer Symptomatik.'],
  ['minor-bruise','Kleiner blauer Fleck / leichte Prellung','Trauma','Sehr Niedrig','Kleine lokale Verletzung ohne Funktionsverlust.'],
  ['stable-chronic','Stabile chronische Beschwerde','Allgemein','Sehr Niedrig','Bekannte Beschwerde ohne aktuelle deutliche Verschlechterung.'],
  ['mild-muscle-ache','Leichte Muskelschmerzen','Bewegungsapparat','Sehr Niedrig','Unspezifische, leichte Muskelschmerzen ohne Trauma.'],
  ['mild-fatigue','Leichte Müdigkeit / Abgeschlagenheit','Allgemein','Sehr Niedrig','Unspezifische stabile Beschwerden ohne Warnzeichen.'],
  ['mild-runny-nose','Leichter Schnupfen','HNO','Sehr Niedrig','Leichte obere Atemwegsbeschwerden ohne Atemnot.'],
  ['minor-scratch','Kleine oberflächliche Hautverletzung','Trauma','Sehr Niedrig','Kleine Läsion ohne relevante Blutung oder Funktionsstörung.']
].map(x=>({id:x[0],title:x[1],cat:x[2],priority:x[3],desc:x[4]}));

// Add the large realistic catalogue after app.js has loaded its base catalogue.
const existingIds=new Set(RD_DATA.common.map(x=>x.id));
RD_DATA.common.push(...RD_NOTFALL_EXTRAS.filter(x=>!existingIds.has(x.id)));

const RD_PRIORITY_ORDER=['Kritisch','Sehr Hoch','Hoch','Mittel','Niedrig','Sehr Niedrig'];
const RD_PRIORITY_CLASS={'Kritisch':'critical','Sehr Hoch':'very-high','Hoch':'high','Mittel':'medium','Niedrig':'low','Sehr Niedrig':'very-low'};
const RD_PRIORITY_ICON={'Kritisch':'🚨','Sehr Hoch':'🔴','Hoch':'🟠','Mittel':'🟡','Niedrig':'🟢','Sehr Niedrig':'⚪'};

function priorityClass(priority){return RD_PRIORITY_CLASS[priority]||'medium'}
function priorityIcon(priority){return RD_PRIORITY_ICON[priority]||'•'}
function card(x,i){return `<button class="card tone-${['red','blue','green','amber'][i%4]} priority-card" data-guide="${x.id}"><div class="card-topline"><div class="card-icon">${iconFor(i)}</div><span class="priority-chip ${priorityClass(x.priority)}">${priorityIcon(x.priority)} ${esc(x.priority)}</span></div><h3>${esc(x.title)}</h3><p>${esc(x.desc)}</p><span class="card-meta">${esc(x.cat)}</span></button>`}
function resultItem(x){return `<div class="result-card"><div><strong>${esc(x.title)}</strong><div style="color:var(--muted);font-size:12px;margin-top:4px">${esc(x.cat)} · <span class="badge priority-badge ${priorityClass(x.priority)}">${priorityIcon(x.priority)} ${esc(x.priority)}</span></div></div><button data-guide="${x.id}">Öffnen</button></div>`}
function renderNotfallbilder(){
  const counts=Object.fromEntries(RD_PRIORITY_ORDER.map(p=>[p,RD_DATA.common.filter(x=>x.priority===p).length]));
  app.innerHTML=`<div class="view-title"><div><span class="eyebrow red">NOTFALLBILDER</span><h1>Realistische Einsatzsituationen</h1><p>${RD_DATA.common.length} strukturierte Einsatzbilder mit sechs Ausbildungs-/RP-Prioritätsstufen. Die Einstufung ist <strong>keine reale Triage</strong>; lokale SOPs und validierte Systeme haben Vorrang.</p></div></div><div class="panel priority-legend"><div class="panel-title">Prioritätsübersicht</div><div class="priority-grid">${RD_PRIORITY_ORDER.map(p=>`<button class="priority-filter ${priorityClass(p)} ${p==='Kritisch'?'active':''}" data-priority-filter="${p}"><span>${priorityIcon(p)}</span><strong>${esc(p)}</strong><small>${counts[p]} Bilder</small></button>`).join('')}<button class="priority-filter all active" data-priority-filter="all"><span>▦</span><strong>Alle</strong><small>${RD_DATA.common.length} Bilder</small></button></div></div><div class="panel" style="margin-top:16px"><div class="search" style="margin:0;max-width:none"><input id="notfallSearch" placeholder="Notfallbild suchen … z. B. Brustschmerz, Fraktur, Fieber"><button id="notfallSearchBtn">Suchen</button></div></div><div class="section-head" style="margin-top:22px"><div><h2 id="notfallCount">Alle ${RD_DATA.common.length} Einsatzbilder</h2><p>Sortiert von höchster zu niedrigster Ausbildungspriorität.</p></div></div><div id="caseGrid" class="cards">${RD_DATA.common.slice().sort((a,b)=>RD_PRIORITY_ORDER.indexOf(a.priority)-RD_PRIORITY_ORDER.indexOf(b.priority)||a.title.localeCompare(b.title,'de')).map((x,i)=>card(x,i)).join('')}</div>`;
  document.querySelectorAll('[data-priority-filter]').forEach(b=>b.onclick=()=>renderPrioritySelection(b.dataset.priorityFilter));
  const input=document.getElementById('notfallSearch');
  const btn=document.getElementById('notfallSearchBtn');
  if(input){input.oninput=()=>renderPrioritySelection('all',input.value);input.onkeydown=e=>{if(e.key==='Enter')renderPrioritySelection('all',input.value)}}
  if(btn)btn.onclick=()=>renderPrioritySelection('all',input?.value||'');
  document.querySelectorAll('[data-guide]').forEach(b=>b.onclick=()=>openGuide(b.dataset.guide));
}
function renderPrioritySelection(priority,query=''){
  const q=(query||'').trim().toLowerCase();
  const selected=priority==='all'?null:priority;
  const arr=RD_DATA.common.filter(x=>(!selected||x.priority===selected)&&(!q||[x.title,x.cat,x.desc].some(v=>v.toLowerCase().includes(q)))).sort((a,b)=>RD_PRIORITY_ORDER.indexOf(a.priority)-RD_PRIORITY_ORDER.indexOf(b.priority)||a.title.localeCompare(b.title,'de'));
  document.querySelectorAll('[data-priority-filter]').forEach(b=>b.classList.toggle('active',b.dataset.priorityFilter===(selected||'all')));
  const grid=document.getElementById('caseGrid');if(!grid)return;
  grid.innerHTML=arr.length?arr.map((x,i)=>card(x,i)).join(''):`<div class="empty">Keine passenden Einsatzbilder gefunden.</div>`;
  const title=document.getElementById('notfallCount');if(title)title.textContent=`${arr.length} Einsatzbilder${selected?' · '+selected:''}${q?' · Suche: '+query:''}`;
  document.querySelectorAll('[data-guide]').forEach(b=>b.onclick=()=>openGuide(b.dataset.guide));
}

// Keep the original generic priority filter usable from any older UI component.
filterPriority=function(priority){renderPrioritySelection(priority)};
// The global search should cover the enlarged catalogue.
filterAbfrage=function(q){const term=(q||'').trim().toLowerCase(),box=document.getElementById('abfrageResults');if(!box)return;const arr=RD_DATA.common.filter(x=>[x.title,x.cat,x.desc].some(v=>v.toLowerCase().includes(term))).sort((a,b)=>RD_PRIORITY_ORDER.indexOf(a.priority)-RD_PRIORITY_ORDER.indexOf(b.priority));box.innerHTML=arr.length?arr.map(resultItem).join(''):`<div class="empty">Keine passenden Treffer gefunden.</div>`;document.querySelectorAll('[data-guide]').forEach(b=>b.onclick=()=>openGuide(b.dataset.guide))};
render();
