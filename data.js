const RD_DATA = {
  categories: [
    {id:'abcde',icon:'A',tone:'red',title:'ABCDE & Ersteinschätzung',desc:'Systematische Ersteinschätzung, Priorisierung und Re-Evaluation.'},
    {id:'resp',icon:'🫁',tone:'blue',title:'Atmung & Atemnot',desc:'Dyspnoe, Asthma/COPD, Atemwegsprobleme und Hypoxie.'},
    {id:'cardio',icon:'♥',tone:'red',title:'Herz & Kreislauf',desc:'Brustschmerz, Rhythmus, Synkope, Schock und Kreislauf.'},
    {id:'neuro',icon:'🧠',tone:'blue',title:'Neurologie',desc:'Schlaganfall, Krampfanfall, Bewusstsein und neurologische Ausfälle.'},
    {id:'trauma',icon:'✚',tone:'amber',title:'Trauma',desc:'Sturz, Verkehrsunfall, Blutung, Kopf-, Thorax- und Extremitätenverletzungen.'},
    {id:'child',icon:'👶',tone:'green',title:'Pädiatrie',desc:'Besonderheiten bei Säuglingen, Kindern und Jugendlichen.'},
    {id:'obgyn',icon:'♀',tone:'red',title:'Gynäkologie & Geburt',desc:'Schwangerschaft, Geburt und gynäkologische Notfälle.'},
    {id:'toxic',icon:'☣',tone:'amber',title:'Intoxikation',desc:'Unklare Bewusstseinsstörung, Substanzen und Vergiftungen.'},
    {id:'psych',icon:'◉',tone:'blue',title:'Psychiatrie',desc:'Akute Krisen, Eigen-/Fremdgefährdung und Agitation.'},
    {id:'metabolic',icon:'◒',tone:'green',title:'Stoffwechsel',desc:'Hypoglykämie, Hyperglykämie und weitere metabolische Auffälligkeiten.'},
    {id:'environment',icon:'☀',tone:'amber',title:'Umwelt & Temperatur',desc:'Hitze, Unterkühlung, Strom, Ertrinken und Umweltexpositionen.'},
    {id:'infection',icon:'✦',tone:'red',title:'Infektiologie',desc:'Infektionsverdacht, Fieber und systemische Warnzeichen.'}
  ],
  common: [
    {id:'chest',title:'Brustschmerz',cat:'Herz & Kreislauf',priority:'Hoch',desc:'Strukturierte Abfrage bei thorakalen Beschwerden.'},
    {id:'dyspnea',title:'Atemnot',cat:'Atmung',priority:'Hoch',desc:'Atemarbeit, Oxygenierung und Warnzeichen erfassen.'},
    {id:'stroke',title:'Schlaganfallverdacht',cat:'Neurologie',priority:'Kritisch',desc:'Neurologische Ausfälle und Symptombeginn strukturiert erfassen.'},
    {id:'unconscious',title:'Bewusstseinsstörung',cat:'Neurologie',priority:'Kritisch',desc:'Reaktionslage, Atemweg, Atmung und reversible Ursachen.'},
    {id:'seizure',title:'Krampfanfall',cat:'Neurologie',priority:'Hoch',desc:'Akutphase, Dauer, Verletzungen und Verlauf dokumentieren.'},
    {id:'hypo',title:'Hypoglykämie',cat:'Stoffwechsel',priority:'Hoch',desc:'Glukose, Bewusstsein, Anamnese und Verlauf berücksichtigen.'},
    {id:'anaphylaxis',title:'Anaphylaxie',cat:'Allergologie',priority:'Kritisch',desc:'Atemweg, Atmung, Kreislauf und systemische Zeichen.'},
    {id:'trauma',title:'Trauma / Sturz',cat:'Trauma',priority:'Hoch',desc:'Mechanismus, Verletzungsmuster und Warnzeichen.'},
    {id:'bleeding',title:'Starke Blutung',cat:'Trauma',priority:'Kritisch',desc:'Blutungsquelle, Kreislauf und sofortige Basismaßnahmen priorisieren.'},
    {id:'syncope',title:'Synkope / Kollaps',cat:'Herz & Kreislauf',priority:'Hoch',desc:'Ereignis, Prodromi, Verletzung und mögliche kardiale Hinweise.'},
    {id:'palpitation',title:'Herzrasen / Palpitation',cat:'Herz & Kreislauf',priority:'Mittel',desc:'Beginn, Rhythmusgefühl, Begleitsymptome und Verlauf.'},
    {id:'headache',title:'Akuter Kopfschmerz',cat:'Neurologie',priority:'Hoch',desc:'Beginn, Charakter, Begleitsymptome und neurologische Warnzeichen.'},
    {id:'abdominal',title:'Bauchschmerz',cat:'Allgemein',priority:'Hoch',desc:'Schmerzprofil, Abdomen, Begleitsymptome und Red Flags.'},
    {id:'fever',title:'Fieber / Infekt',cat:'Infektiologie',priority:'Mittel',desc:'Allgemeinzustand, Temperatur, Fokus und systemische Warnzeichen.'},
    {id:'sepsis',title:'Infektionsverdacht / Sepsis-Risiko',cat:'Infektiologie',priority:'Kritisch',desc:'Systemische Verschlechterung erkennen und lokale Kriterien beachten.'},
    {id:'asthma',title:'Asthma / Obstruktion',cat:'Atmung',priority:'Hoch',desc:'Atemarbeit, Sprechfähigkeit, Verlauf und bekannte Erkrankungen.'},
    {id:'copd',title:'COPD-Exazerbation',cat:'Atmung',priority:'Hoch',desc:'Veränderung zum Basiszustand und respiratorische Belastung.'},
    {id:'burn',title:'Verbrennung / Verbrühung',cat:'Trauma',priority:'Hoch',desc:'Mechanismus, Ausdehnung, Lokalisation und begleitende Risiken.'},
    {id:'poisoning',title:'Intoxikation / Vergiftung',cat:'Intoxikation',priority:'Hoch',desc:'Substanz, Menge, Zeitpunkt, Bewusstsein und Umfeld erfassen.'},
    {id:'mental',title:'Psychische Krise',cat:'Psychiatrie',priority:'Hoch',desc:'Situation, Kooperation, Eigen- und Fremdgefährdung strukturiert klären.'},
    {id:'pregnancy',title:'Schwangerschaftsbeschwerden',cat:'Gynäkologie',priority:'Hoch',desc:'Schwangerschaftswoche, Beschwerden, Blutung und Warnzeichen.'},
    {id:'birth',title:'Geburt',cat:'Gynäkologie',priority:'Kritisch',desc:'Geburtsphase, Wehen, Blutung und Zustand von Mutter/Kind.'},
    {id:'childresp',title:'Kind mit Atemnot',cat:'Pädiatrie',priority:'Kritisch',desc:'Alter, Atemarbeit, Verhalten und Warnzeichen altersgerecht erfassen.'},
    {id:'drowning',title:'Ertrinkungsereignis',cat:'Umwelt',priority:'Kritisch',desc:'Rettungsmechanismus, Atmung, Bewusstsein und Temperatur.'},
    {id:'hypothermia',title:'Unterkühlung',cat:'Umwelt',priority:'Hoch',desc:'Exposition, Bewusstsein und Kreislauf schonend beurteilen.'}
  ],
  guides: {
    chest:{title:'Brustschmerz – Abfragehilfe',intro:'Strukturierte Orientierung bei neu aufgetretenen thorakalen Beschwerden.',steps:[
      {q:'Wie ist der Patient aktuell?',answers:[['wach & stabil','Keine offensichtliche Bewusstseinsstörung.'],['beeinträchtigt','Allgemeinzustand auffällig oder Vigilanz vermindert.'],['instabil','Lebensbedrohliche Auffälligkeiten möglich.']]},
      {q:'Welche Begleitsymptome bestehen?',answers:[['Dyspnoe','Atemnot oder erhöhte Atemarbeit.'],['Synkope / Beinahe-Synkope','Kurzzeitige Bewusstseinsstörung.'],['neurologische Ausfälle','z. B. Sprach- oder Kraftstörung.'],['keine der genannten','Keine dieser Begleiterscheinungen.']]},
      {q:'Was sollte besonders beachtet werden?',answers:[['Red Flags vorhanden','Zeitkritische Abklärung und lokale SOP beachten.'],['keine Red Flags ersichtlich','Weiterführende Anamnese und Verlaufskontrolle.']]}
    ]},
    dyspnea:{title:'Atemnot – Abfragehilfe',intro:'Systematische Orientierung bei Dyspnoe.',steps:[
      {q:'Wie schwer ist die Atemstörung?',answers:[['mild','Sprechen in ganzen Sätzen möglich.'],['mäßig','Sprechen erschwert, erhöhte Atemarbeit.'],['schwer','Deutliche Atemnot, Sprechen kaum möglich.'],['keine normale Atmung','Sofort nach lokalem Reanimations-/Notfallalgorithmus handeln.']]},
      {q:'Gibt es kritische Zeichen?',answers:[['Bewusstseinsstörung','Vigilanz reduziert oder Patient nicht adäquat.'],['Zyanose / schwere Hypoxie','Auffällige Oxygenierung.'],['Stridor / drohende Atemwegsverlegung','Atemweg als Priorität behandeln.'],['keines davon','Weitere strukturierte Abfrage.']]},
      {q:'Welche Vorgeschichte passt?',answers:[['Asthma / COPD','Bekannte obstruktive Atemwegserkrankung berücksichtigen.'],['Herzerkrankung','Kardiale Ursache mitdenken.'],['Infekt / Fieber','Infektiöse Ursache mitdenken.'],['keine bekannte Vorgeschichte','Breite Differenzialbetrachtung und Verlauf.']]}
    ]},
    stroke:{title:'Schlaganfallverdacht – Abfragehilfe',intro:'Zeitkritische neurologische Ersteinschätzung. Symptombeginn so genau wie möglich erfassen.',steps:[
      {q:'Wann war der Patient zuletzt sicher ohne die Symptome?',answers:[['genaue Uhrzeit bekannt','Zeitpunkt dokumentieren.'],['unbekannt / beim Aufwachen','Last-known-well so gut wie möglich eingrenzen.']]},
      {q:'Welche Ausfälle bestehen?',answers:[['Gesicht / Sprache','Auffälligkeit bei Gesicht, Sprache oder Verständlichkeit.'],['Arm / Bein','Kraft- oder Sensibilitätsstörung.'],['Sehstörung / Koordination','Weitere fokale neurologische Auffälligkeit.'],['keine eindeutigen Ausfälle','Diagnose bleibt offen; Ursachen weiter abklären.']]},
      {q:'Gibt es zusätzliche Warnzeichen?',answers:[['Bewusstseinsstörung','Vigilanz verändert.'],['starker plötzlichster Kopfschmerz','Weitere zeitkritische Ursachen berücksichtigen.'],['Krampfanfall','Anfallsereignis dokumentieren und Ursachen prüfen.'],['nein','Weiter strukturieren und Verlauf beobachten.']]}
    ]},
    unconscious:{title:'Bewusstseinsstörung – Abfragehilfe',intro:'Zuerst lebenswichtige Funktionen sichern; anschließend reversible Ursachen berücksichtigen.',steps:[
      {q:'Reagiert der Patient auf Ansprache?',answers:[['ja, adäquat','Bewusstseinsstörung nicht offensichtlich.'],['eingeschränkt','Vigilanz reduziert.'],['nein','Bewusstlosigkeit / fehlende Reaktion.']]},
      {q:'Ist eine normale Atmung vorhanden?',answers:[['ja','Atemweg und Atmung weiter überwachen.'],['auffällig','Atemweg/Atmung priorisieren.'],['nein / agonale Atmung','Reanimationsalgorithmus anwenden.']]},
      {q:'Welche reversible Ursache sollte mitgedacht werden?',answers:[['Glukose auffällig','Lokalen Hypoglykämie-/Hyperglykämie-Algorithmus beachten.'],['Intoxikation möglich','Substanz, Zeitpunkt und Umfeld erfassen.'],['Trauma möglich','Mechanismus und Verletzungszeichen prüfen.'],['keine klare Ursache','Breite strukturierte Abklärung und Re-Evaluation.']]}
    ]},
    strokePlaceholder:null
  },
  checklists: [
    ['ABCDE','Atemweg · Atmung · Kreislauf · Neurologie · Entkleiden/Umgebung'],
    ['Reanimation','Bewusstlosigkeit, Atmung, Alarmierung und lokaler Reanimationsalgorithmus'],
    ['Übergabe','Situation · Hintergrund · Einschätzung · Empfehlung / weiteres Vorgehen'],
    ['Trauma','Mechanismus · Blutung · Verletzungsmuster · Re-Evaluation · Wärmeerhalt'],
    ['Pädiatrie','Alter · Gewicht · Verhalten · Atmung · Kreislauf · Elternanamnese'],
    ['Geburt','Geburtsphase · Mutter · Blutung · Kind · Wärme · Nachversorgung'],
    ['Intoxikation','Substanz · Menge · Zeitpunkt · Zugang · Fremdgefährdung · Verpackung'],
    ['Psychiatrie','Kontakt · Orientierung · Kooperation · Eigen-/Fremdgefährdung · Umfeld']
  ]
};
