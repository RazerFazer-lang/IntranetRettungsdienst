const RD_DATA = {
  categories: [
    {id:'abcde',icon:'A',tone:'red',title:'ABCDE & Ersteinschätzung',desc:'Systematische Ersteinschätzung und Re-Evaluation.'},
    {id:'resp',icon:'🫁',tone:'blue',title:'Atmung & Atemnot',desc:'Atemnot, Hypoxie, Asthma und respiratorische Notfälle.'},
    {id:'cardio',icon:'♥',tone:'red',title:'Herz & Kreislauf',desc:'Brustschmerz, Rhythmusprobleme, Schock und Synkope.'},
    {id:'neuro',icon:'🧠',tone:'blue',title:'Neurologie',desc:'Schlaganfall, Krampfanfall und Bewusstseinsstörungen.'},
    {id:'trauma',icon:'✚',tone:'amber',title:'Trauma',desc:'Sturz, Verkehrsunfall, Blutung und Verletzung.'},
    {id:'child',icon:'👶',tone:'green',title:'Pädiatrie',desc:'Besondere Besonderheiten bei Kindern und Säuglingen.'},
    {id:'obgyn',icon:'♀',tone:'red',title:'Gynäkologie & Geburt',desc:'Geburt, Schwangerschaft und gynäkologische Notfälle.'},
    {id:'toxic',icon:'☣',tone:'amber',title:'Intoxikation',desc:'Unklare Bewusstseinslage und mögliche Vergiftung.'},
    {id:'psych',icon:'◉',tone:'blue',title:'Psychiatrie',desc:'Akute psychische Krisen und Fremd-/Eigengefährdung.'}
  ],
  common: [
    {id:'chest',title:'Brustschmerz',cat:'Herz & Kreislauf',priority:'Hoch',desc:'Strukturierte Abfrage bei thorakalen Beschwerden.'},
    {id:'dyspnea',title:'Atemnot',cat:'Atmung',priority:'Hoch',desc:'Atemarbeit, Oxygenierung und Warnzeichen erfassen.'},
    {id:'stroke',title:'Schlaganfallverdacht',cat:'Neurologie',priority:'Kritisch',desc:'Neurologische Ausfälle zeitkritisch einordnen.'},
    {id:'unconscious',title:'Bewusstseinsstörung',cat:'Neurologie',priority:'Kritisch',desc:'Bewusstsein, Atemweg, Atmung und reversible Ursachen.'},
    {id:'seizure',title:'Krampfanfall',cat:'Neurologie',priority:'Hoch',desc:'Akutphase, Dauer, Verletzungen und Postiktalphase.'},
    {id:'hypo',title:'Hypoglykämie',cat:'Stoffwechsel',priority:'Hoch',desc:'Bewusstsein, Glukose und Anamnese strukturiert prüfen.'},
    {id:'anaphylaxis',title:'Anaphylaxie',cat:'Allergologie',priority:'Kritisch',desc:'Atemweg, Atmung, Kreislauf und Hautzeichen.'},
    {id:'trauma',title:'Trauma / Sturz',cat:'Trauma',priority:'Hoch',desc:'Mechanismus, Verletzungsmuster und Red Flags.'}
  ],
  guides: {
    chest:{title:'Brustschmerz – Abfragehilfe',intro:'Strukturierte Orientierung bei neu aufgetretenen thorakalen Beschwerden.',steps:[
      {q:'Wie ist der Patient aktuell?',answers:[['wach & stabil','Keine offensichtliche Bewusstseinsstörung.'],['beeinträchtigt','Allgemeinzustand auffällig oder Vigilanz vermindert.'],['instabil','Lebensbedrohliche Auffälligkeiten möglich.']]},
      {q:'Welche Begleitsymptome bestehen?',answers:[['Dyspnoe','Atemnot oder erhöhte Atemarbeit.'],['Synkope / Beinahe-Synkope','Kurzzeitige Bewusstseinsstörung.'],['neurologische Ausfälle','z.B. Sprach- oder Kraftstörung.'],['keine der genannten','Keine dieser Begleiterscheinungen.']]},
      {q:'Was sollte besonders beachtet werden?',answers:[['Red Flags vorhanden','Zeitkritische Abklärung und lokale SOP beachten.'],['keine Red Flags ersichtlich','Weiterführende Anamnese und Verlaufskontrolle.']]}
    ]},
    dyspnea:{title:'Atemnot – Abfragehilfe',intro:'Systematische Orientierung bei Dyspnoe.',steps:[
      {q:'Wie schwer ist die Atemstörung?',answers:[['mild','Sprechen in ganzen Sätzen möglich.'],['mäßig','Sprechen erschwert, erhöhte Atemarbeit.'],['schwer','Deutliche Atemnot, Sprechen kaum möglich.'],['keine normale Atmung','Sofort nach Reanimations-/Notfallalgorithmus handeln.']]},
      {q:'Gibt es kritische Zeichen?',answers:[['Bewusstseinsstörung','Vigilanz reduziert oder Patient nicht adäquat.'],['Zyanose / schwere Hypoxie','Auffällige Oxygenierung.'],['Stridor / drohende Atemwegsverlegung','Atemweg als Priorität behandeln.'],['keines davon','Weitere strukturierte Abfrage.']]}
    ]},
    stroke:{title:'Schlaganfallverdacht – Abfragehilfe',intro:'Zeitkritische neurologische Ersteinschätzung. Symptombeginn so genau wie möglich erfassen.',steps:[
      {q:'Wann war der Patient zuletzt sicher ohne die Symptome?',answers:[['genaue Uhrzeit bekannt','Zeitpunkt dokumentieren.'],['unbekannt / beim Aufwachen','Last-known-well so gut wie möglich eingrenzen.']]},
      {q:'Welche Ausfälle bestehen?',answers:[['Gesicht / Sprache','Auffälligkeit bei Gesicht, Sprache oder Verständlichkeit.'],['Arm / Bein','Kraft- oder Sensibilitätsstörung.'],['Sehstörung / Koordination','Weitere fokale neurologische Auffälligkeit.'],['keine eindeutigen Ausfälle','Diagnose bleibt offen; Ursachen weiter abklären.']]}
    ]},
    unconscious:{title:'Bewusstseinsstörung – Abfragehilfe',intro:'Zuerst lebenswichtige Funktionen sichern; anschließend reversible Ursachen berücksichtigen.',steps:[
      {q:'Reagiert der Patient auf Ansprache?',answers:[['ja, adäquat','Bewusstseinsstörung nicht offensichtlich.'],['eingeschränkt','Vigilanz reduziert.'],['nein','Bewusstlosigkeit / fehlende Reaktion.']]},
      {q:'Ist eine normale Atmung vorhanden?',answers:[['ja','Atemweg und Atmung weiter überwachen.'],['auffällig','Atemweg/Atmung priorisieren.'],['nein / agonale Atmung','Reanimationsalgorithmus anwenden.']]}
    ]}
  }
};
