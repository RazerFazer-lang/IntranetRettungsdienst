const RD_CHECKLISTS={
  'ABCDE':{
    desc:'Strukturierte Erstbeurteilung mit Befunden, Re-Evaluation und priorisierten nächsten Schritten.',
    questions:[
      ['Eigenschutz','Ist die Einsatzstelle sicher und sind relevante Gefahren berücksichtigt?',['ja','nein / Gefahr','unklar']],
      ['Reaktionslage','Ist die Person adäquat ansprechbar und reagiert passend?',['ja','eingeschränkt','nein']],
      ['Atemweg','Ist der Atemweg frei und ohne offensichtliche Bedrohung?',['ja','auffällig','unklar']],
      ['Atmung','Ist die Atmung unauffällig bzw. ohne deutliche Atemnot?',['ja','auffällig','keine normale Atmung']],
      ['Kreislauf','Ist der Kreislauf klinisch stabil ohne deutliche Schockzeichen?',['ja','auffällig','instabil']],
      ['Blutung','Besteht eine relevante äußere Blutung oder ein entsprechender Verdacht?',['nein','ja','unklar']],
      ['Neurologie','Bestehen neue Bewusstseins- oder neurologische Auffälligkeiten?',['nein','ja','unklar']],
      ['Schmerz / Beschwerden','Sind Hauptbeschwerde und Schmerzprofil klar erfasst?',['ja','teilweise','nein']],
      ['Exposition / Umgebung','Wurden relevante Verletzungen, Hautbefunde, Temperatur und Umgebung berücksichtigt?',['ja','teilweise','nein']],
      ['Vitalwerte','Sind die für die Situation relevanten Vitalwerte erhoben und dokumentiert?',['ja','teilweise','nein']],
      ['Re-Evaluation','Wurde nach relevanter Veränderung erneut ABCDE-orientiert beurteilt?',['ja','noch nicht','nicht erforderlich']],
      ['Übergabebereitschaft','Sind Zeitverlauf, Befunde und Veränderungen nachvollziehbar dokumentiert?',['ja','teilweise','nein']]
    ],
    priorities:[
      ['P1 · Sofort','Eigenschutz und unmittelbare Gefahrenkontrolle sicherstellen.'],
      ['P1 · Sofort','Bei kritischer Auffälligkeit Team alarmieren und den gültigen lokalen Notfall-/Reanimationsalgorithmus anwenden.'],
      ['P1 · Sofort','Atemweg, Atmung und Kreislauf nach lokalem Standard priorisieren.'],
      ['P2 · Danach','Monitoring und vollständige strukturierte Untersuchung vervollständigen.'],
      ['P2 · Danach','Relevante Befunde, Verlauf und Veränderungen zeitnah festhalten.'],
      ['P3 · Transport','Transport- und Zielentscheidung nach lokaler SOP bzw. ärztlicher Vorgabe umsetzen.'],
      ['P3 · Übergabe','Situation, Hintergrund, Einschätzung und weiteres Vorgehen strukturiert übergeben.'],
      ['P4 · Abschluss','Re-Evaluation dokumentieren und offene Punkte vor Abschluss klären.']
    ],
    meds:[]
  },
  'Reanimation':{
    desc:'Geführte Reanimationsabfrage mit Sicherheits-, Team-, Ablauf- und Übergabepunkten. Für die konkrete Versorgung gilt ausschließlich der aktuelle lokale Algorithmus.',
    questions:[
      ['Einsatzstelle','Ist der Zugang zur Person sicher möglich?',['ja','nein / Gefahr','unklar']],
      ['Bewusstsein','Ist die Person nicht bzw. nicht adäquat reagierend?',['ja','nein','unklar']],
      ['Atmung','Ist eine normale Atmung sicher vorhanden?',['ja','auffällig / unklar','nein']],
      ['Alarmierung','Sind Notfallteam / weitere Ressourcen gemäß lokalem Ablauf alarmiert?',['ja','teilweise','nein']],
      ['Reanimationsteam','Sind Rollen und Verantwortlichkeiten im Team geklärt?',['ja','teilweise','nein']],
      ['Defibrillation','Ist ein AED/Defibrillator verfügbar bzw. angefordert?',['ja','unterwegs','nein']],
      ['Atemweg / Beatmung','Ist eine geeignete lokale Strategie für Atemweg und Beatmung festgelegt?',['ja','teilweise','nein']],
      ['Reversible Ursachen','Werden reversible Ursachen systematisch nach lokalem Algorithmus gesucht?',['ja','teilweise','nein']],
      ['Zeitpunkte','Sind Beginn, Rhythmusanalysen und relevante Zeitpunkte dokumentiert?',['ja','teilweise','nein']],
      ['ROSC / Verlauf','Gab es eine relevante Zustandsänderung oder Rückkehr eines Kreislaufs?',['nein','ja','unklar']],
      ['Post-Reanimation','Falls Kreislauf zurückgekehrt ist: ist der lokale Post-Reanimationspfad vorbereitet?',['ja','teilweise','nein / nicht zutreffend']],
      ['Übergabe','Sind Reanimationsdauer, Maßnahmen und Verlauf für die Übergabe nachvollziehbar?',['ja','teilweise','nein']]
    ],
    priorities:[
      ['P1 · Sofort','Sicherheit prüfen, Hilfe alarmieren und nach aktuellem lokalen Reanimationsalgorithmus handeln.'],
      ['P1 · Sofort','Bei fehlender normaler Atmung sofort den gültigen Reanimationsablauf priorisieren.'],
      ['P1 · Sofort','Defibrillation und hochwertige Reanimation entsprechend dem lokalen Algorithmus organisieren.'],
      ['P1 · Sofort','Reversible Ursachen und relevante Sonderumstände systematisch berücksichtigen.'],
      ['P2 · Laufend','Teamrollen, Zeitpunkte, Rhythmusanalysen und relevante Maßnahmen fortlaufend dokumentieren.'],
      ['P2 · Laufend','Bei Zustandsänderung sofort neu beurteilen und den passenden lokalen Pfad wählen.'],
      ['P3 · Nach ROSC','Post-Reanimationsversorgung und Transport-/Zielpfad nach lokaler SOP vorbereiten.'],
      ['P4 · Übergabe','Strukturierte Übergabe mit Ausgangslage, Verlauf, Maßnahmen, Zeiten und aktuellem Zustand.']
    ],
    meds:['Epinephrin Injector']
  },
  'Übergabe':{
    desc:'Geführte Übergabeabfrage, damit wichtige Informationen nicht verloren gehen.',
    questions:[
      ['Situation','Ist das aktuelle Hauptproblem in einem Satz klar beschrieben?',['ja','teilweise','nein']],
      ['Zeitverlauf','Sind Beginn und relevante Zeitpunkte bekannt?',['ja','teilweise','nein / unbekannt']],
      ['Anamnese','Sind relevante Vorerkrankungen und Dauermedikation erfasst?',['ja','teilweise','nein']],
      ['Allergien','Sind relevante Allergien bzw. Unverträglichkeiten bekannt?',['ja','nein bekannt','unklar']],
      ['Befunde','Sind die wesentlichen Untersuchungsbefunde und Vitalwerte dokumentiert?',['ja','teilweise','nein']],
      ['Verlauf','Sind relevante Veränderungen während des Einsatzes festgehalten?',['ja','teilweise','nein']],
      ['Maßnahmen','Sind bereits erfolgte relevante Maßnahmen nachvollziehbar dokumentiert?',['ja','teilweise','nein']],
      ['Reaktion','Ist dokumentiert, wie die Person auf relevante Maßnahmen bzw. den Verlauf reagierte?',['ja','teilweise','nein']],
      ['Risiken','Sind aktuelle Risiken oder offene Probleme ausdrücklich genannt?',['ja','teilweise','nein']],
      ['Empfehlung','Ist das weitere Vorgehen bzw. der offene Bedarf klar formuliert?',['ja','teilweise','nein']],
      ['Rückfragen','Wurden Rückfragen ermöglicht und offene Punkte geklärt?',['ja','teilweise','nein']],
      ['Dokumentation','Ist die Übergabe selbst und der aktuelle Zustand dokumentiert?',['ja','teilweise','nein']]
    ],
    priorities:[
      ['P1 · Vor Übergabe','Aktuelle lebensbedrohliche Auffälligkeiten oder unmittelbare Risiken zuerst nennen.'],
      ['P2 · Kerninfos','Situation, Zeitverlauf, Hintergrund und wesentliche Befunde kurz zusammenfassen.'],
      ['P2 · Verlauf','Relevante Veränderungen und Reaktionen auf Maßnahmen nennen.'],
      ['P3 · Weiteres Vorgehen','Offene Aufgaben, Risiken und geplanten nächsten Schritt eindeutig benennen.'],
      ['P4 · Abschluss','Rückfragen klären und die Übergabe vollständig dokumentieren.']
    ],
    meds:[]
  },
  'Trauma':{
    desc:'Traumaabfrage von Einsatzstelle und Mechanismus bis Re-Evaluation, Wärmeerhalt und Übergabe.',
    questions:[
      ['Einsatzstelle','Ist die Unfall-/Gewaltstelle sicher und ist der Mechanismus bekannt?',['ja','teilweise','nein / Gefahr']],
      ['Mechanismus','Ist der Unfallmechanismus bzw. das Ereignis nachvollziehbar dokumentiert?',['ja','teilweise','nein']],
      ['Blutung','Besteht eine relevante äußere Blutung oder ein entsprechender Verdacht?',['nein','ja','unklar']],
      ['Atemweg / Atmung','Gibt es relevante Auffälligkeiten an Atemweg oder Atmung?',['nein','ja','unklar']],
      ['Kreislauf','Gibt es relevante Hinweise auf Kreislaufinstabilität oder schlechte Perfusion?',['nein','ja','unklar']],
      ['Neurologie','Bestehen neue Bewusstseins- oder neurologische Auffälligkeiten?',['nein','ja','unklar']],
      ['Verletzungsmuster','Sind relevante Verletzungen systematisch erfasst?',['ja','teilweise','nein']],
      ['Begleitverletzungen','Wurde der gesamte Körperkontext erneut auf übersehene Verletzungen geprüft?',['ja','teilweise','nein']],
      ['Wärmeerhalt','Ist Wärmeerhalt ausreichend berücksichtigt?',['ja','teilweise','nein']],
      ['Schmerz','Sind Schmerzstärke, Lokalisation und Verlauf dokumentiert?',['ja','teilweise','nein']],
      ['Re-Evaluation','Wurde nach Maßnahmen und relevanten Veränderungen erneut beurteilt?',['ja','noch nicht','nicht erforderlich']],
      ['Übergabe','Sind Mechanismus, Befunde, Verlauf und offene Risiken vollständig?',['ja','teilweise','nein']]
    ],
    priorities:[
      ['P1 · Sofort','Eigenschutz und Gefahrenkontrolle sicherstellen.'],
      ['P1 · Sofort','Lebensbedrohliche Blutungen, Atemwegs-/Atmungs- und Kreislaufprobleme nach lokalem Traumaalgorithmus priorisieren.'],
      ['P1 · Sofort','Bei kritischer Auffälligkeit Teamressourcen und weiteren lokalen Notfallpfad aktivieren.'],
      ['P2 · Danach','Verletzungsmuster vervollständigen und übersehene Begleitverletzungen suchen.'],
      ['P2 · Danach','Monitoring, Schmerz-/Verlaufsdokumentation und Re-Evaluation fortführen.'],
      ['P3 · Transport','Zielklinik und Transportstrategie nach lokalem Trauma-/Zuweisungspfad.'],
      ['P4 · Übergabe','Mechanismus, relevante Befunde, Veränderungen und offene Risiken strukturiert übergeben.']
    ],
    meds:['Tranexamsäure','Metamizol']
  },
  'Pädiatrie':{
    desc:'Altersgerechte Abfrage mit Schwerpunkt auf Verhalten, Atmung, Kreislauf, Fremdanamnese und Sicherheitsaspekten.',
    questions:[
      ['Alter / Gewicht','Sind Alter und ein für die lokale Versorgung verwendbares Gewicht bekannt?',['ja','ungefähr','nein']],
      ['Verhalten','Ist das Verhalten für das Kind plausibel oder deutlich verändert?',['unauffällig','verändert','unklar']],
      ['Bewusstsein','Ist die Reaktionslage altersgerecht?',['ja','eingeschränkt','nein']],
      ['Atmung','Gibt es auffällige Atemarbeit oder andere relevante Atemprobleme?',['nein','ja','unklar']],
      ['Kreislauf / Perfusion','Gibt es auffällige Perfusions- oder Kreislaufzeichen?',['nein','ja','unklar']],
      ['Fremdanamnese','Sind Angaben der Eltern/Bezugspersonen zum Verlauf vorhanden?',['ja','teilweise','nein']],
      ['Vorerkrankungen','Sind relevante Vorerkrankungen und Dauermedikation bekannt?',['ja','nein','unklar']],
      ['Trink-/Essverhalten','Ist eine relevante Veränderung von Trinken, Essen oder Ausscheidungen aufgefallen?',['nein','ja','unklar']],
      ['Fieber / Infekt','Gibt es Hinweise auf einen Infekt oder deutliche Verschlechterung?',['nein','ja','unklar']],
      ['Sicherheit / Umfeld','Gibt es Auffälligkeiten im Umfeld, die für die Versorgung relevant sind?',['nein','ja','unklar']],
      ['Re-Evaluation','Wurde die Entwicklung nach relevanten Veränderungen erneut beurteilt?',['ja','noch nicht','nicht erforderlich']],
      ['Übergabe','Sind Alter, Gewicht, Verlauf und wesentliche Befunde klar dokumentiert?',['ja','teilweise','nein']]
    ],
    priorities:[
      ['P1 · Sofort','Bei deutlicher Verschlechterung Atemweg, Atmung und Kreislauf nach lokalem pädiatrischem Algorithmus priorisieren.'],
      ['P1 · Sofort','Alters- und gewichtsbezogene lokale Abläufe sowie passende Ressourcen einsetzen.'],
      ['P2 · Danach','Fremdanamnese, Verlauf und relevante Vorerkrankungen vervollständigen.'],
      ['P2 · Danach','Monitoring und Re-Evaluation altersgerecht fortführen.'],
      ['P3 · Transport','Geeigneten Zielpfad nach lokalem pädiatrischem Vorgehen klären.'],
      ['P4 · Übergabe','Alter, Gewicht, Verlauf, Befunde und relevante Beobachtungen vollständig übergeben.']
    ],
    meds:[]
  },
  'Geburt':{
    desc:'Geburtsbezogene Abfrage für Mutter und Kind mit klarer Trennung der beiden Patientinnen/Patienten.',
    questions:[
      ['Schwangerschaftswoche','Ist die Schwangerschaftswoche bekannt?',['ja','ungefähr','unbekannt']],
      ['Geburtsphase','Ist der aktuelle Geburtsfortschritt beschrieben?',['ja','teilweise','unklar']],
      ['Mutter – Zustand','Ist die Mutter aktuell kreislauf- und bewusstseinsmäßig stabil?',['ja','auffällig','instabil / unklar']],
      ['Blutung','Besteht eine relevante Blutung oder ein entsprechender Verdacht?',['nein','ja','unklar']],
      ['Wehen / Verlauf','Sind Beginn und Verlauf der Wehen bzw. Beschwerden bekannt?',['ja','teilweise','nein']],
      ['Kind – Zustand','Ist der Zustand des Kindes nach der Geburt erfasst?',['ja','teilweise','noch nicht']],
      ['Geburtszeitpunkt','Ist der tatsächliche Geburtszeitpunkt dokumentiert?',['ja','ungefähr','nein']],
      ['Wärmeerhalt','Ist der Wärmeerhalt von Mutter und Kind berücksichtigt?',['ja','teilweise','nein']],
      ['Komplikationen','Sind relevante Komplikationen oder Risiken bekannt?',['nein','ja','unklar']],
      ['Ressourcen','Sind passende geburtshilfliche/neonatale Ressourcen nach lokalem Ablauf hinzugezogen?',['ja','teilweise','nein / unklar']],
      ['Re-Evaluation','Werden Mutter und Kind getrennt und wiederholt beurteilt?',['ja','teilweise','nein']],
      ['Übergabe','Sind Schwangerschaft, Geburtsverlauf, Zeiten und Zustand von Mutter und Kind dokumentiert?',['ja','teilweise','nein']]
    ],
    priorities:[
      ['P1 · Sofort','Mutter und Kind getrennt beurteilen und bei Instabilität den jeweiligen lokalen Notfallalgorithmus priorisieren.'],
      ['P1 · Sofort','Relevante Blutung und andere akute Komplikationen sofort erkennen und nach lokaler SOP behandeln lassen.'],
      ['P2 · Danach','Geburtsphase, Zeitpunkte und relevante Anamnese vervollständigen.'],
      ['P2 · Danach','Wärmeerhalt und Re-Evaluation von Mutter und Kind fortführen.'],
      ['P3 · Transport','Geburtshilflichen/neonatalen Zielpfad nach lokalem Standard klären.'],
      ['P4 · Übergabe','Mutter und Kind mit getrenntem Status, Zeitpunkten und Verlauf strukturiert übergeben.']
    ],
    meds:[]
  },
  'Intoxikation':{
    desc:'Intoxikationsabfrage mit Eigenschutz, Substanzinformationen, Bewusstsein, Verlauf und Übergabe. Medikamentenhinweise sind ausschließlich Registerverweise – keine Dosierungsanweisung.',
    questions:[
      ['Eigenschutz','Ist die Expositionsgefahr für Team und Umgebung beherrscht?',['ja','nein / Gefahr','unklar']],
      ['Substanz','Ist die mögliche Substanz bzw. das Produkt bekannt?',['ja','vermutet','unbekannt']],
      ['Menge','Ist eine ungefähre Menge oder Dosis bekannt?',['ja','ungefähr','nein']],
      ['Zeitpunkt','Ist der mögliche Expositionszeitpunkt bekannt?',['ja','ungefähr','nein']],
      ['Applikationsweg','Ist der Aufnahmeweg bekannt?',['ja','unklar','nein']],
      ['Begleitstoffe','Sind weitere Medikamente, Drogen oder Substanzen möglich?',['nein','ja','unklar']],
      ['Bewusstsein','Ist die Reaktionslage verändert?',['nein','ja','unklar']],
      ['Atmung','Ist die Atmung auffällig?',['nein','ja','unklar']],
      ['Kreislauf','Ist der Kreislauf auffällig oder instabil?',['nein','ja','unklar']],
      ['Verpackung','Sind Verpackung, Präparatname oder andere Hinweise verfügbar?',['ja','teilweise','nein']],
      ['Fremdanamnese','Sind Personen oder Quellen für eine ergänzende Anamnese vorhanden?',['ja','teilweise','nein']],
      ['Übergabe / Giftinfo','Sind relevante Informationen für den lokalen Giftinformations-/SOP-Weg vorbereitet?',['ja','teilweise','nein']]
    ],
    priorities:[
      ['P1 · Sofort','Eigenschutz und Expositionskontrolle zuerst sicherstellen.'],
      ['P1 · Sofort','Bei Bewusstseins-, Atemwegs-, Atmungs- oder Kreislaufproblemen den lokalen Notfallalgorithmus priorisieren.'],
      ['P2 · Danach','Substanz, Menge, Zeitpunkt, Aufnahmeweg und Begleitstoffe so genau wie möglich erheben.'],
      ['P2 · Danach','Verpackungen und verfügbare Informationen für die weitere Versorgung sichern.'],
      ['P3 · Fachinformation','Lokalen Giftinformations-/SOP-Weg und ärztliche Vorgaben nutzen.'],
      ['P4 · Übergabe','Toxikologieinformationen, Verlauf und relevante Zeitpunkte strukturiert übergeben.']
    ],
    meds:['Naloxon']
  },
  'Psychiatrie':{
    desc:'Strukturierte psychiatrische Abfrage mit Eigenschutz, Kontakt, Orientierung, Eigen-/Fremdgefährdung und Umfeld.',
    questions:[
      ['Eigenschutz','Ist das Umfeld für Patient und Team sicher genug?',['ja','nein / Gefahr','unklar']],
      ['Kontakt','Ist ein ruhiger und nachvollziehbarer Kontakt möglich?',['ja','teilweise','nein']],
      ['Bewusstsein','Ist die Reaktionslage unauffällig?',['ja','eingeschränkt','unklar']],
      ['Orientierung','Ist die Person zu Person, Ort und Situation ausreichend orientiert?',['ja','teilweise','nein / unklar']],
      ['Eigengefährdung','Gibt es Hinweise auf aktuelle Selbstgefährdung?',['nein','ja','unklar']],
      ['Fremdgefährdung','Gibt es Hinweise auf aktuelle Gefährdung anderer?',['nein','ja','unklar']],
      ['Agitation','Besteht deutliche Unruhe, Aggression oder schwer steuerbares Verhalten?',['nein','ja','unklar']],
      ['Substanzen','Sind Alkohol, Drogen oder andere Substanzen möglich?',['nein','ja','unklar']],
      ['Vorerkrankungen / Medikation','Sind relevante psychiatrische oder somatische Vorerkrankungen und Medikamente bekannt?',['ja','teilweise','nein']],
      ['Körperliche Ursache','Gibt es Hinweise auf eine somatische oder neurologische Ursache?',['nein','ja','unklar']],
      ['Re-Evaluation','Wurde die Lage nach Beruhigung oder Veränderung erneut beurteilt?',['ja','noch nicht','nicht erforderlich']],
      ['Dokumentation','Sind Beobachtungen, Aussagen und Risiken sachlich dokumentiert?',['ja','teilweise','nein']]
    ],
    priorities:[
      ['P1 · Sofort','Eigenschutz, Teampositionierung und sichere Umgebung priorisieren.'],
      ['P1 · Sofort','Bei Eigen-/Fremdgefährdung den lokal vorgesehenen Schutz-, Unterstützungs- und Alarmierungsweg aktivieren.'],
      ['P2 · Danach','Kontakt, Orientierung und mögliche somatische bzw. substanzbedingte Ursachen strukturieren.'],
      ['P2 · Danach','Re-Evaluation nach relevanten Veränderungen fortführen.'],
      ['P3 · Weiteres Vorgehen','Lokalen psychiatrischen/ärztlichen Zielpfad und erforderliche Unterstützung klären.'],
      ['P4 · Übergabe','Aussagen, beobachtetes Verhalten, Risiken und Verlauf sachlich und nachvollziehbar übergeben.']
    ],
    meds:['Midazolam','Lorazepam']
  }
};

let checklistOpen=null,checklistAnswers={};
const answerKey=id=>'rd-assessment-'+id;
function loadAnswers(id){
  if(checklistAnswers[id])return checklistAnswers[id];
  const q=RD_CHECKLISTS[id]?.questions||[];let state=Array(q.length).fill(null);
  try{const raw=localStorage.getItem(answerKey(id));if(raw){const parsed=JSON.parse(raw);if(Array.isArray(parsed)&&parsed.length===q.length)state=parsed;}}catch(e){}
  checklistAnswers[id]=state;return state;
}
function saveAnswers(id,state){checklistAnswers[id]=state;try{localStorage.setItem(answerKey(id),JSON.stringify(state))}catch(e){}}
function answeredCount(state){return state.filter(v=>v!==null).length}
function flaggedCount(id,state){const q=RD_CHECKLISTS[id]?.questions||[];return state.reduce((n,v,i)=>{if(v===null)return n;const label=q[i][2][v]||'';return n+(/nein|auffällig|instabil|ja|eingeschränkt|verändert|Gefahr|unklar|noch nicht|nicht/i.test(label)&&!(['Eigenschutz','Situation','Kontakt'].includes(q[i][0])&&label==='ja')?1:0)},0)}
function renderChecklistList(){
  const entries=Object.entries(RD_CHECKLISTS);
  app.innerHTML=`<div class="view-title"><div><span class="eyebrow">CHECKLISTEN / ABFRAGE</span><h1>Geführte Einsatzabfragen</h1><p>Öffnen, Frage für Frage beantworten und am Ende einen priorisierten Maßnahmenplan mit Übergabe-/Dokumentationspunkten erhalten. Für Ausbildung/RP; lokale SOPs haben Vorrang.</p></div></div><div class="category-grid checklist-grid">${entries.map(([id,c])=>{const st=loadAnswers(id),done=answeredCount(st),pct=Math.round(done/st.length*100);return `<button class="panel checklist-card" data-checklist="${esc(id)}"><div class="panel-title"><span class="checklist-icon tone-${['red','blue','green','amber'][done%4]}">✓</span>${esc(id)}</div><p class="muted-text">${esc(c.desc)}</p><div class="checklist-progress"><span><b>${done}</b>/${st.length} Fragen</span><b>${pct}%</b></div><div class="progress-track"><i style="width:${pct}%"></i></div><span class="checklist-open">Abfrage starten / fortsetzen →</span></button>`}).join('')}</div>`;
}
function renderChecklistDetail(id){
  const c=RD_CHECKLISTS[id],state=loadAnswers(id),idx=state.findIndex(v=>v===null),allDone=idx===-1;
  if(allDone)return renderChecklistResult(id);
  const q=c.questions[idx],pct=Math.round(idx/state.length*100);
  app.innerHTML=`<div class="view-title"><div><span class="eyebrow red">ABFRAGE ${idx+1} / ${state.length}</span><h1>${esc(id)}</h1><p>${esc(c.desc)}</p></div><button class="back" data-checklist-back>← Übersicht</button></div><div class="triage"><div class="stepper"><div class="panel-title">Fortschritt</div>${c.questions.map((x,i)=>`<div class="step ${i===idx?'active':''} ${state[i]!==null?'answered':''}"><b>${i+1}</b> · ${esc(x[0])}${state[i]!==null?' ✓':''}</div>`).join('')}<div class="notice">Antworten werden lokal im Browser gespeichert und können später fortgesetzt werden.</div></div><div class="question-card"><span class="eyebrow">FRAGE ${idx+1}</span><h2>${esc(q[0])}</h2><div class="sub">Wähle die Antwort, die die aktuelle Lage am besten beschreibt.</div><div class="answer-grid">${q[2].map((a,i)=>`<button class="answer" data-check-answer="${i}"><strong>${esc(a)}</strong><small>Auswahl speichern und zur nächsten Frage</small></button>`).join('')}</div><div class="notice" style="margin-top:20px"><strong>Hinweis</strong><br>Bei einer kritischen Auffälligkeit nicht auf die Checkliste warten: lokale Notfall-/Reanimationsabläufe und fachliche Entscheidungswege haben Vorrang.</div><div class="completion-actions"><button class="secondary" data-checklist-back>← Übersicht</button><button class="secondary" data-check-reset>↻ Abfrage zurücksetzen</button></div></div></div>`;
}
function renderChecklistResult(id){
  const c=RD_CHECKLISTS[id],state=loadAnswers(id),flags=flaggedCount(id,state),answers=c.questions.map((q,i)=>({q:q[0],a:q[2][state[i]]||'—'}));
  app.innerHTML=`<div class="completion-hero"><span class="eyebrow red">ABFRAGE ABGESCHLOSSEN</span><h1>${esc(id)} – Was jetzt?</h1><p>Alle Fragen wurden beantwortet. Die folgende Reihenfolge ist eine Ausbildungs-/RP-Orientierung und ersetzt keine lokalen SOPs, ärztlichen Anordnungen oder aktuelle Leitlinien.</p><div class="completion-actions"><button class="primary" data-check-restart>↻ Erneut abfragen</button><button class="secondary" data-checklist-back>← Übersicht</button></div></div><div class="two-col section"><div class="panel"><div class="panel-title">Auswertung</div><div class="notice result"><strong>${answers.length} Fragen beantwortet</strong><br>${flags} Antwort(en) wurden als prüf-/prioritätsrelevant markiert. Das ist keine Diagnose oder automatische Triage.</div>${answers.map((x,i)=>`<div class="history-row"><span class="history-number">${i+1}</span><div><strong>${esc(x.q)}</strong><small>${esc(x.a)}</small></div></div>`).join('')}</div><div class="panel"><div class="panel-title">Maßnahmenplan – Reihenfolge</div>${c.priorities.map((x,i)=>`<div class="next-step"><span>${i+1}</span><div><strong>${esc(x[0])}</strong><small>${esc(x[1])}</small></div></div>`).join('')}</div></div>${flags?`<div class="panel section priority-alert"><div class="panel-title">⚠ Priorität prüfen</div><div class="notice"><strong>Mindestens eine Antwort ist auffällig oder unklar.</strong><br>Die konkreten Befunde müssen jetzt aktiv mit dem gültigen lokalen Algorithmus/SOP abgeglichen werden. Die Checkliste bewertet nicht selbst die medizinische Dringlichkeit.</div></div>`:''}<div class="panel section"><div class="panel-title">Medikamente / Register</div><p class="muted-text">Nur als Verweis auf das vorhandene Medikamentenregister. Auswahl, Indikation, Kontraindikationen, Applikation und Dosierung müssen nach eurer gültigen lokalen SOP bzw. ärztlichen Anordnung geprüft werden.</p><div class="med-reference-grid">${c.meds?.length?c.meds.map(name=>`<button class="quick-item" data-medgo="${esc(name)}"><span><strong>${esc(name)}</strong><small>Im Medikamentenregister prüfen</small></span><span class="badge">Öffnen</span></button>`).join(''):`<div class="notice">Für dieses Thema werden hier bewusst keine konkreten Medikamente vorgeschlagen. Nutze das Medikamentenregister nur nach lokalem Schema.</div>`}</div></div><div class="panel section"><div class="panel-title">Abschluss / Dokumentation / Übergabe</div><div class="handover-grid"><div><span class="mini-label">DOKUMENTIEREN</span><p>Fragen, relevante Antworten, Zeitpunkte, Befunde, Veränderungen und bereits erfolgte Maßnahmen festhalten.</p></div><div><span class="mini-label">RE-EVALUATION</span><p>Bei jeder relevanten Veränderung erneut systematisch beurteilen und den lokalen Algorithmus anwenden.</p></div><div><span class="mini-label">ÜBERGABE</span><p>Situation, Hintergrund, Einschätzung, Risiken, Verlauf und weiteres Vorgehen strukturiert übergeben.</p></div></div></div>`;
}
renderChecklisten=function(){if(checklistOpen&&RD_CHECKLISTS[checklistOpen])renderChecklistDetail(checklistOpen);else renderChecklistList()};

document.addEventListener('click',e=>{
  const open=e.target.closest('[data-checklist]');
  if(open){checklistOpen=open.dataset.checklist;renderChecklisten();return}
  const back=e.target.closest('[data-checklist-back]');
  if(back){checklistOpen=null;renderChecklisten();return}
  const reset=e.target.closest('[data-check-reset]');
  if(reset&&checklistOpen){const empty=Array(RD_CHECKLISTS[checklistOpen].questions.length).fill(null);saveAnswers(checklistOpen,empty);renderChecklisten();return}
  const restart=e.target.closest('[data-check-restart]');
  if(restart&&checklistOpen){const empty=Array(RD_CHECKLISTS[checklistOpen].questions.length).fill(null);saveAnswers(checklistOpen,empty);renderChecklisten();return}
  const ans=e.target.closest('[data-check-answer]');
  if(ans&&checklistOpen){const state=loadAnswers(checklistOpen),idx=state.findIndex(v=>v===null);if(idx>=0){state[idx]=Number(ans.dataset.checkAnswer);saveAnswers(checklistOpen,state);renderChecklisten();}return}
  const med=e.target.closest('[data-medgo]');
  if(med){const name=med.dataset.medgo;checklistOpen=null;currentView='medikamente';selectedGuide=null;render();setTimeout(()=>{const input=document.getElementById('medSearch');if(input){input.value=name;filterMeds('search',name);input.scrollIntoView({behavior:'smooth',block:'center'})}},0);return}
});
renderChecklisten();
