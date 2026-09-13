/*
 * Rettungsdienst Intranet – stabile Checklisten
 * Eine Datei, ein Controller, ein Event-Handler auf #app.
 * Keine MutationObserver, keine document-level click capture und keine konkurrierenden Renderer.
 */
(function(){
  'use strict';

  const C={
    'ABCDE':{
      desc:'Strukturierte Erstbeurteilung von Eigenschutz bis Übergabe.',
      questions:[
        ['Eigenschutz','Kann die Einsatzstelle sicher betreten und bearbeitet werden?',[['Ja','normal'],['Nein / Gefahr','critical'],['Unklar','warning']],'Sicherheit zuerst. Bei Gefahr nicht weiter in die Detailabfrage gehen.'],
        ['Reaktion','Reagiert die Person adäquat auf Ansprache?',[['Ja','normal'],['Eingeschränkt','warning'],['Nein','critical']],'Vigilanz und zeitlichen Verlauf der Veränderung beachten.'],
        ['Atemweg','Ist der Atemweg frei und ohne offensichtliche Bedrohung?',[['Ja','normal'],['Auffällig','warning'],['Unklar','critical']],'Atemweg hat bei akuter Bedrohung Vorrang vor weiteren Detailfragen.'],
        ['Atmung','Ist die Atmung ausreichend und ohne relevante Auffälligkeiten?',[['Ja','normal'],['Auffällig','warning'],['Keine normale Atmung','critical']],'Bei deutlicher Verschlechterung den lokalen Notfallalgorithmus priorisieren.'],
        ['Kreislauf','Wirkt die Kreislaufsituation stabil?',[['Ja','normal'],['Auffällig','warning'],['Instabil','critical']],'Bei Instabilität prioritäre Maßnahmen nicht durch weitere Fragen verzögern.'],
        ['Blutung','Besteht eine relevante äußere Blutung oder ein begründeter Verdacht?',[['Nein','normal'],['Ja','critical'],['Unklar','warning']],'Blutung aktiv erneut beurteilen und lokalen Blutungsablauf beachten.'],
        ['Neurologie','Bestehen neue neurologische Auffälligkeiten oder eine relevante Vigilanzänderung?',[['Nein','normal'],['Ja','warning'],['Unklar','warning']],'Beginn, letzte sichere Normalität und Verlauf möglichst genau dokumentieren.'],
        ['Beschwerden','Sind Hauptbeschwerde, Lokalisation und Verlauf klar erfasst?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Leitsymptom und zeitlichen Verlauf konkret dokumentieren.'],
        ['Exposition','Wurden Verletzungen, Haut, Temperatur und Umgebung berücksichtigt?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Bei Trauma, Hitze, Kälte oder Exposition gezielt nachfassen.'],
        ['Vitalwerte','Sind die relevanten Vitalparameter erhoben und bewertet?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Zeitpunkt der Erhebung und relevante Veränderungen dokumentieren.'],
        ['Re-Evaluation','Wurde nach relevanter Veränderung erneut systematisch beurteilt?',[['Ja','normal'],['Noch nicht','warning'],['Nicht erforderlich','normal']],'Nach Veränderung oder Maßnahme erneut ABCDE-orientiert beurteilen.'],
        ['Übergabe','Sind Zeitverlauf, Befunde, Veränderungen und offene Punkte dokumentiert?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Strukturiert und nachvollziehbar an das nächste Team übergeben.']
      ],
      plan:[
        ['P1 · Sofort','Eigenschutz und unmittelbare Gefahren kontrollieren.'],
        ['P1 · Sofort','Kritische Auffälligkeiten nach lokalem Notfall-/Reanimationsalgorithmus priorisieren.'],
        ['P2 · Danach','Monitoring, vollständige Untersuchung und Re-Evaluation vervollständigen.'],
        ['P3 · Transport','Ziel- und Transportentscheidung nach lokaler SOP bzw. ärztlicher Vorgabe.'],
        ['P4 · Abschluss','Befunde, Verlauf, Zeiten und Übergabe dokumentieren.']
      ],meds:[]
    },
    'Reanimation':{
      desc:'Geführte Reanimationsabfrage für Sicherheit, Team, Ablauf, Verlauf und Übergabe.',
      questions:[
        ['Einsatzstelle','Ist der Zugang zur Person sicher möglich?',[['Ja','normal'],['Nein / Gefahr','critical'],['Unklar','warning']],'Eigenschutz und sichere Arbeitsumgebung vor weiterer Versorgung klären.'],
        ['Bewusstsein','Ist die Person nicht bzw. nicht adäquat reagierend?',[['Ja','critical'],['Nein','normal'],['Unklar','warning']],'Bei fehlender Reaktion den lokalen Reanimationspfad priorisieren.'],
        ['Atmung','Ist eine normale Atmung sicher vorhanden?',[['Ja','normal'],['Auffällig / unklar','warning'],['Nein','critical']],'Keine normale Atmung ist ein unmittelbarer Prioritätspunkt.'],
        ['Alarmierung','Sind erforderliche Ressourcen nach lokalem Ablauf alarmiert?',[['Ja','normal'],['Teilweise','warning'],['Nein','critical']],'Ressourcen und weitere Unterstützung frühzeitig organisieren.'],
        ['Team','Sind Rollen und Zuständigkeiten klar verteilt?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Klare Rollen reduzieren Verzögerungen und Kommunikationsfehler.'],
        ['Defibrillation','Ist AED/Defibrillator verfügbar bzw. angefordert?',[['Ja','normal'],['Unterwegs','warning'],['Nein','critical']],'Gerät und lokalen Reanimationsalgorithmus priorisieren.'],
        ['Atemweg / Beatmung','Ist eine lokale Strategie für Atemweg und Beatmung festgelegt?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Nur nach aktuellem lokalen Algorithmus und vorhandener Qualifikation handeln.'],
        ['Reversible Ursachen','Werden reversible Ursachen systematisch nach lokalem Algorithmus berücksichtigt?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Sonderumstände und Verlauf fortlaufend berücksichtigen.'],
        ['Zeitpunkte','Sind Beginn und relevante Zeitpunkte dokumentiert?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Zeitliche Nachvollziehbarkeit für Verlauf und Übergabe sichern.'],
        ['Zustandsänderung','Gab es eine relevante Zustandsänderung oder Rückkehr eines Kreislaufs?',[['Nein','normal'],['Ja','warning'],['Unklar','warning']],'Bei Zustandsänderung sofort neu beurteilen und passenden lokalen Pfad wählen.'],
        ['Post-Reanimation','Ist bei ROSC der lokale Post-Reanimationspfad vorbereitet?',[['Ja','normal'],['Teilweise','warning'],['Nicht zutreffend','normal']],'Post-Reanimationsversorgung und Zielpfad nach lokaler SOP.'],
        ['Übergabe','Sind Reanimationsdauer, Verlauf und Maßnahmen nachvollziehbar dokumentiert?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Zeiten, Verlauf und relevante Maßnahmen strukturiert übergeben.']
      ],
      plan:[
        ['P1 · Sofort','Sicherheit, Hilfe und lokalen Reanimationsalgorithmus priorisieren.'],
        ['P1 · Sofort','Bei fehlender normaler Atmung den Reanimationsablauf ohne Verzögerung verfolgen.'],
        ['P1 · Sofort','Defibrillation und Teamressourcen nach lokalem Algorithmus organisieren.'],
        ['P2 · Laufend','Zeitpunkte, Zustandsänderungen und relevante Maßnahmen dokumentieren.'],
        ['P3 · Nach ROSC','Post-Reanimationspfad und Zielklinik nach lokaler SOP vorbereiten.'],
        ['P4 · Übergabe','Ausgangslage, Verlauf, Zeiten und Maßnahmen vollständig übergeben.']
      ],meds:['Epinephrin Injector']
    },
    'Übergabe':{
      desc:'Strukturierte Übergabe, damit Situation, Verlauf, Risiken und weiteres Vorgehen nicht verloren gehen.',
      questions:[
        ['Situation','Kann das aktuelle Hauptproblem in einem klaren Satz benannt werden?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Mit dem aktuell wichtigsten Problem beginnen.'],
        ['Zeitverlauf','Sind Beginn, Verlauf und entscheidende Zeitpunkte bekannt?',[['Ja','normal'],['Teilweise','warning'],['Nein / unbekannt','warning']],'Beginn und letzte relevante Veränderung konkret nennen.'],
        ['Anamnese','Sind relevante Vorerkrankungen und Dauermedikation erhoben?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Nur relevante Informationen priorisieren.'],
        ['Allergien','Sind Allergien bzw. Unverträglichkeiten bekannt oder als unbekannt dokumentiert?',[['Ja','normal'],['Nein bekannt','normal'],['Unklar','warning']],'Unbekannte Allergien ausdrücklich benennen.'],
        ['Befunde','Sind die wesentlichen Befunde und Vitalwerte nachvollziehbar dokumentiert?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Aktuellen Zustand mit relevanten Veränderungen nennen.'],
        ['Verlauf','Sind relevante Veränderungen zeitlich nachvollziehbar festgehalten?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Was hat sich wann verändert?'],
        ['Maßnahmen','Sind relevante Maßnahmen und Zeitpunkte dokumentiert?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Maßnahme und Reaktion gemeinsam nennen.'],
        ['Reaktion','Ist die Reaktion auf relevante Maßnahmen beschrieben?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Reaktion und aktuellen Zustand gegenüberstellen.'],
        ['Risiken','Sind aktuelle Risiken, Warnzeichen und offene Probleme benannt?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Offene Probleme nicht nur andeuten, sondern klar nennen.'],
        ['Empfehlung','Ist das weitere Vorgehen eindeutig formuliert?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Nächsten Schritt nach lokalem Ablauf festhalten.'],
        ['Rückfragen','Wurden offene Punkte geklärt und Rückfragen ermöglicht?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Rückfragen und Übergabebestätigung ermöglichen.'],
        ['Dokumentation','Ist die Übergabe selbst und der aktuelle Zustand dokumentiert?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Übergabe und Zustand zeitnah dokumentieren.']
      ],
      plan:[
        ['P1 · Vor Übergabe','Lebensbedrohliche Auffälligkeiten und unmittelbare Risiken zuerst nennen.'],
        ['P2 · Kerninfos','Situation, Zeitverlauf, Hintergrund und wesentliche Befunde zusammenfassen.'],
        ['P2 · Verlauf','Reaktionen und relevante Veränderungen nennen.'],
        ['P3 · Weiteres Vorgehen','Offene Aufgaben und nächsten Schritt eindeutig benennen.'],
        ['P4 · Abschluss','Rückfragen klären und Übergabe dokumentieren.']
      ],meds:[]
    },
    'Trauma':{
      desc:'Traumaabfrage von Einsatzstelle und Mechanismus bis Re-Evaluation und Übergabe.',
      questions:[
        ['Einsatzstelle','Ist die Unfall-/Gewaltstelle sicher und der Zugang kontrolliert?',[['Ja','normal'],['Teilweise','warning'],['Nein / Gefahr','critical']],'Gefahrenkontrolle vor weiterer Detailabfrage.'],
        ['Mechanismus','Ist der Unfall- oder Ereignismechanismus nachvollziehbar?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Mechanismus und mögliche Verletzungsmuster zusammen betrachten.'],
        ['Blutung','Besteht eine relevante äußere Blutung oder Verdacht auf relevanten Blutverlust?',[['Nein','normal'],['Ja','critical'],['Unklar','warning']],'Blutung aktiv suchen und lokalen Blutungsablauf beachten.'],
        ['Atemweg / Atmung','Gibt es relevante Auffälligkeiten von Atemweg oder Atmung?',[['Nein','normal'],['Ja','warning'],['Unklar','warning']],'Bei akuter Bedrohung sofort lokalen Trauma-/Notfallalgorithmus priorisieren.'],
        ['Kreislauf','Gibt es Hinweise auf Kreislaufinstabilität oder schlechte Perfusion?',[['Nein','normal'],['Ja','critical'],['Unklar','warning']],'Bei Instabilität Detailabfragen nachrangig.'],
        ['Neurologie','Bestehen neue Bewusstseins- oder neurologische Auffälligkeiten?',[['Nein','normal'],['Ja','warning'],['Unklar','warning']],'Neurologischen Verlauf und Zeitpunkt dokumentieren.'],
        ['Verletzungsmuster','Sind relevante Verletzungen systematisch erfasst?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Nach dem lebensbedrohlichen zuerst den vollständigen Körperkontext prüfen.'],
        ['Begleitverletzungen','Wurde erneut nach übersehenen Begleitverletzungen gesucht?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Re-Evaluation verhindert Übersehen weiterer Verletzungen.'],
        ['Wärmeerhalt','Ist der Wärmeerhalt berücksichtigt?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Wärmeverlust aktiv begrenzen und Verlauf dokumentieren.'],
        ['Schmerz','Sind Schmerzstärke, Lokalisation und Verlauf erfasst?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Schmerzverlauf nach lokalen Standards dokumentieren.'],
        ['Re-Evaluation','Wurde nach Maßnahmen und Veränderungen erneut beurteilt?',[['Ja','normal'],['Noch nicht','warning'],['Nicht erforderlich','normal']],'Nach jeder relevanten Veränderung erneut beurteilen.'],
        ['Übergabe','Sind Mechanismus, Befunde, Verlauf und offene Risiken vollständig?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Traumamechanismus und relevante Befunde strukturiert übergeben.']
      ],
      plan:[
        ['P1 · Sofort','Eigenschutz und Gefahrenkontrolle sicherstellen.'],
        ['P1 · Sofort','Lebensbedrohliche Blutung sowie Atemwegs-/Atmungs-/Kreislaufprobleme nach lokalem Traumaalgorithmus priorisieren.'],
        ['P2 · Danach','Verletzungsmuster und Begleitverletzungen vervollständigen.'],
        ['P2 · Danach','Monitoring, Schmerzverlauf und Re-Evaluation fortführen.'],
        ['P3 · Transport','Zielklinik und Transportstrategie nach lokalem Zuweisungspfad.'],
        ['P4 · Übergabe','Mechanismus, Befunde, Veränderungen und offene Risiken übergeben.']
      ],meds:['Tranexamsäure','Metamizol']
    },
    'Pädiatrie':{
      desc:'Altersgerechte Abfrage für Verhalten, Atmung, Kreislauf, Fremdanamnese und Sicherheit.',
      questions:[
        ['Alter / Gewicht','Sind Alter und ein für den lokalen Ablauf geeignetes Gewicht bekannt?',[['Ja','normal'],['Ungefähr','warning'],['Nein','warning']],'Bei Unsicherheit lokale pädiatrische Hilfsmittel und Vorgaben nutzen.'],
        ['Verhalten','Ist das Verhalten altersgerecht oder relevant verändert?',[['Unauffällig','normal'],['Verändert','warning'],['Unklar','warning']],'Veränderung gegenüber dem Ausgangszustand erfragen.'],
        ['Bewusstsein','Ist die Reaktionslage altersgerecht?',[['Ja','normal'],['Eingeschränkt','warning'],['Nein','critical']],'Deutliche Vigilanzstörung priorisieren.'],
        ['Atmung','Gibt es auffällige Atemarbeit oder relevante Atemprobleme?',[['Nein','normal'],['Ja','critical'],['Unklar','warning']],'Kinder können sich rasch verändern; Verlauf eng beobachten.'],
        ['Kreislauf / Perfusion','Gibt es auffällige Perfusions- oder Kreislaufzeichen?',[['Nein','normal'],['Ja','critical'],['Unklar','warning']],'Altersabhängige Zeichen und Verlauf nach lokalem Standard bewerten.'],
        ['Fremdanamnese','Liegen Angaben von Eltern, Bezugspersonen oder Zeugen vor?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Fremdanamnese besonders bei kleinen Kindern wichtig.'],
        ['Vorerkrankungen','Sind relevante Vorerkrankungen und Dauermedikation bekannt?',[['Ja','normal'],['Nein','warning'],['Unklar','warning']],'Relevante Dauertherapie und bekannte Risiken dokumentieren.'],
        ['Trinken / Essen','Besteht eine relevante Veränderung von Trinken, Essen oder Ausscheidungen?',[['Nein','normal'],['Ja','warning'],['Unklar','warning']],'Verlauf und mögliche Dehydratationszeichen berücksichtigen.'],
        ['Fieber / Infekt','Gibt es Hinweise auf Infekt mit verändertem Allgemeinzustand?',[['Nein','normal'],['Ja','warning'],['Unklar','warning']],'Allgemeinzustand und Dynamik beachten.'],
        ['Sicherheit / Umfeld','Gibt es relevante Sicherheits-, Betreuungs- oder Kinderschutzaspekte?',[['Nein','normal'],['Ja','warning'],['Unklar','warning']],'Sachlich dokumentieren und lokale Vorgaben beachten.'],
        ['Re-Evaluation','Wurde die Entwicklung nach relevanten Veränderungen erneut beurteilt?',[['Ja','normal'],['Noch nicht','warning'],['Nicht erforderlich','normal']],'Kinder engmaschig re-evaluieren, wenn der Zustand schwankt.'],
        ['Übergabe','Sind Alter, Gewicht, Verlauf und Befunde klar dokumentiert?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Übergabe alters- und entwicklungsbezogen strukturieren.']
      ],
      plan:[
        ['P1 · Sofort','Bei deutlicher Verschlechterung Atemweg, Atmung und Kreislauf nach lokalem Algorithmus priorisieren.'],
        ['P1 · Sofort','Alters-/gewichtsbezogene lokale Abläufe und passende Ressourcen nutzen.'],
        ['P2 · Danach','Fremdanamnese, Verlauf und Vorerkrankungen vervollständigen.'],
        ['P2 · Danach','Monitoring und Re-Evaluation altersgerecht fortführen.'],
        ['P3 · Transport','Geeigneten pädiatrischen Zielpfad nach lokalem Vorgehen klären.'],
        ['P4 · Übergabe','Alter, Gewicht, Verlauf, Befunde und Beobachtungen vollständig übergeben.']
      ],meds:[]
    },
    'Geburt':{
      desc:'Getrennte strukturierte Abfrage für Mutter und Kind.',
      questions:[
        ['Schwangerschaftswoche','Ist die Schwangerschaftswoche bekannt oder plausibel eingegrenzt?',[['Ja','normal'],['Ungefähr','warning'],['Unbekannt','warning']],'Zeitpunkt und relevante Schwangerschaftsdaten dokumentieren.'],
        ['Geburtsphase','Ist der aktuelle Geburtsfortschritt nachvollziehbar?',[['Ja','normal'],['Teilweise','warning'],['Unklar','warning']],'Geburtsphase und Verlauf gemeinsam betrachten.'],
        ['Mutter – Zustand','Ist die Mutter hinsichtlich Bewusstsein, Atmung und Kreislauf stabil?',[['Ja','normal'],['Auffällig','warning'],['Instabil / unklar','critical']],'Mutter und Kind immer getrennt beurteilen.'],
        ['Blutung','Besteht eine relevante Blutung oder entsprechender Verdacht?',[['Nein','normal'],['Ja','critical'],['Unklar','warning']],'Blutung sofort nach lokalem geburtshilflichem Ablauf priorisieren.'],
        ['Wehen / Verlauf','Sind Beginn, Häufigkeit und Verlauf der Beschwerden nachvollziehbar?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Verlauf und relevante Zeitpunkte dokumentieren.'],
        ['Kind – Zustand','Ist der Zustand des Kindes nach lokalem Ablauf erfasst?',[['Ja','normal'],['Teilweise','warning'],['Noch nicht','warning']],'Bei Geburt Mutter und Kind getrennt weiterführen.'],
        ['Geburtszeitpunkt','Ist der tatsächliche Geburtszeitpunkt dokumentiert?',[['Ja','normal'],['Ungefähr','warning'],['Nein','warning']],'Zeitpunkt möglichst exakt festhalten.'],
        ['Wärmeerhalt','Ist der Wärmeerhalt von Mutter und Kind berücksichtigt?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Wärmeverlust aktiv vermeiden.'],
        ['Komplikationen','Sind relevante Komplikationen oder Risiken bekannt?',[['Nein','normal'],['Ja','warning'],['Unklar','warning']],'Komplikationen konkret benennen und lokalen Ablauf nutzen.'],
        ['Ressourcen','Sind passende geburtshilfliche/neonatale Ressourcen organisiert?',[['Ja','normal'],['Teilweise','warning'],['Nein / unklar','warning']],'Ressourcen frühzeitig nach lokalem Ablauf aktivieren.'],
        ['Re-Evaluation','Werden Mutter und Kind getrennt wiederholt beurteilt?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Bei Veränderung jeweils eigenen lokalen Pfad wählen.'],
        ['Übergabe','Sind Schwangerschaft, Verlauf, Zeiten und Zustand von Mutter und Kind dokumentiert?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Getrennte Statusangaben an das aufnehmende Team übergeben.']
      ],
      plan:[
        ['P1 · Sofort','Mutter und Kind getrennt beurteilen und kritische Probleme priorisieren.'],
        ['P1 · Sofort','Relevante Blutung und akute Komplikationen nach lokaler SOP priorisieren.'],
        ['P2 · Danach','Geburtsphase, Zeiten und relevante Anamnese vervollständigen.'],
        ['P2 · Danach','Wärmeerhalt und Re-Evaluation von Mutter und Kind fortführen.'],
        ['P3 · Transport','Geburtshilflichen/neonatalen Zielpfad nach lokalem Standard klären.'],
        ['P4 · Übergabe','Mutter und Kind getrennt, mit Zeiten und Verlauf, übergeben.']
      ],meds:[]
    },
    'Intoxikation':{
      desc:'Intoxikationsabfrage für Eigenschutz, Substanz, Verlauf, Vitalfunktionen und Übergabe.',
      questions:[
        ['Eigenschutz','Ist die Expositionsgefahr für Team und Umgebung beherrscht?',[['Ja','normal'],['Nein / Gefahr','critical'],['Unklar','warning']],'Eigenschutz und weitere Exposition zuerst klären.'],
        ['Substanz','Ist die mögliche Substanz oder das Produkt bekannt?',[['Ja','normal'],['Vermutet','warning'],['Unbekannt','warning']],'Verpackung und Produktinformationen sichern.'],
        ['Menge','Ist eine ungefähre Menge bekannt?',[['Ja','normal'],['Ungefähr','warning'],['Nein','warning']],'Schätzung ausdrücklich als solche kennzeichnen.'],
        ['Zeitpunkt','Ist der mögliche Expositionszeitpunkt bekannt?',[['Ja','normal'],['Ungefähr','warning'],['Nein','warning']],'Zeitpunkt bzw. letzte sichere Beobachtung dokumentieren.'],
        ['Aufnahmeweg','Ist der Aufnahme-/Expositionsweg bekannt?',[['Ja','normal'],['Unklar','warning'],['Nein','warning']],'Aufnahmeweg kann für weitere lokale Schritte relevant sein.'],
        ['Begleitstoffe','Sind weitere Medikamente, Drogen oder Substanzen möglich?',[['Nein','normal'],['Ja','warning'],['Unklar','warning']],'Mehrfachintoxikation mitdenken und dokumentieren.'],
        ['Bewusstsein','Ist die Reaktionslage verändert?',[['Nein','normal'],['Ja','critical'],['Unklar','warning']],'Bewusstseinsstörung priorisieren.'],
        ['Atmung','Ist die Atmung auffällig?',[['Nein','normal'],['Ja','critical'],['Unklar','warning']],'Atemweg und Atmung haben Vorrang.'],
        ['Kreislauf','Ist der Kreislauf auffällig oder instabil?',[['Nein','normal'],['Ja','critical'],['Unklar','warning']],'Kreislaufinstabilität sofort priorisieren.'],
        ['Verpackung','Sind Verpackung, Präparatname oder weitere Hinweise verfügbar?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Informationen für lokale Giftinformation/SOP sichern.'],
        ['Fremdanamnese','Sind Zeugen oder andere Quellen für die Anamnese vorhanden?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Fremdanamnese mit Quelle dokumentieren.'],
        ['Übergabe / Giftinfo','Sind relevante Informationen für lokalen Giftinformations-/SOP-Weg vorbereitet?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Substanz, Menge, Zeitpunkt, Weg und Verlauf strukturiert weitergeben.']
      ],
      plan:[
        ['P1 · Sofort','Eigenschutz und Expositionskontrolle sicherstellen.'],
        ['P1 · Sofort','Bewusstseins-, Atemwegs-, Atmungs- und Kreislaufprobleme priorisieren.'],
        ['P2 · Danach','Substanz, Menge, Zeitpunkt, Aufnahmeweg und Begleitstoffe erheben.'],
        ['P2 · Danach','Verpackungen und sonstige Hinweise sichern.'],
        ['P3 · Fachinformation','Lokalen Giftinformations-/SOP-Weg und ärztliche Vorgaben nutzen.'],
        ['P4 · Übergabe','Toxikologieinformationen, Verlauf und Zeitpunkte vollständig übergeben.']
      ],meds:['Naloxon']
    },
    'Psychiatrie':{
      desc:'Psychiatrische Abfrage mit Eigenschutz, Kontakt, Orientierung und Eigen-/Fremdgefährdung.',
      questions:[
        ['Eigenschutz','Ist das Umfeld für Patient und Team ausreichend sicher?',[['Ja','normal'],['Nein / Gefahr','critical'],['Unklar','warning']],'Eigenschutz und Teampositionierung zuerst.'],
        ['Kontakt','Ist ein ruhiger und nachvollziehbarer Kontakt möglich?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Kommunikation ruhig, klar und nachvollziehbar halten.'],
        ['Bewusstsein','Ist die Reaktionslage unauffällig?',[['Ja','normal'],['Eingeschränkt','warning'],['Nein','critical']],'Akute Bewusstseinsänderung kann eine somatische Ursache haben.'],
        ['Orientierung','Ist die Person ausreichend zu Person, Ort und Situation orientiert?',[['Ja','normal'],['Teilweise','warning'],['Nein / unklar','warning']],'Veränderungen sachlich dokumentieren.'],
        ['Eigengefährdung','Gibt es Hinweise auf aktuelle Selbstgefährdung?',[['Nein','normal'],['Ja','critical'],['Unklar','warning']],'Bei konkreter Gefahr lokalen Schutz-/Alarmierungsweg aktivieren.'],
        ['Fremdgefährdung','Gibt es Hinweise auf aktuelle Fremdgefährdung?',[['Nein','normal'],['Ja','critical'],['Unklar','warning']],'Sicherheitslage und Unterstützung nach lokalem Ablauf organisieren.'],
        ['Agitation','Besteht deutliche Unruhe oder schwer steuerbares Verhalten?',[['Nein','normal'],['Ja','warning'],['Unklar','warning']],'Deeskalation und Eigenschutz priorisieren.'],
        ['Substanzen','Sind Alkohol, Drogen oder andere Substanzen möglich?',[['Nein','normal'],['Ja','warning'],['Unklar','warning']],'Substanzbedingte Ursachen mitdenken.'],
        ['Vorerkrankungen','Sind relevante psychiatrische/somatische Vorerkrankungen und Medikamente bekannt?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Fremdanamnese einbeziehen, wenn möglich.'],
        ['Körperliche Ursache','Gibt es Hinweise auf eine somatische oder neurologische Ursache?',[['Nein','normal'],['Ja','warning'],['Unklar','warning']],'Psychische Symptome nicht vorschnell rein psychiatrisch einordnen.'],
        ['Re-Evaluation','Wurde nach Beruhigung oder Veränderung erneut beurteilt?',[['Ja','normal'],['Noch nicht','warning'],['Nicht erforderlich','normal']],'Bei Zustandsänderung erneut systematisch beurteilen.'],
        ['Dokumentation','Sind Beobachtungen, Aussagen und Risiken sachlich dokumentiert?',[['Ja','normal'],['Teilweise','warning'],['Nein','warning']],'Aussagen und Beobachtungen getrennt und nachvollziehbar dokumentieren.']
      ],
      plan:[
        ['P1 · Sofort','Eigenschutz, Teampositionierung und sichere Umgebung priorisieren.'],
        ['P1 · Sofort','Eigen-/Fremdgefährdung nach lokalem Schutz- und Alarmierungsweg behandeln.'],
        ['P2 · Danach','Kontakt, Orientierung, somatische Ursachen und mögliche Substanzen strukturieren.'],
        ['P2 · Danach','Re-Evaluation nach relevanten Veränderungen fortführen.'],
        ['P3 · Weiteres Vorgehen','Psychiatrischen/ärztlichen Zielpfad und notwendige Unterstützung klären.'],
        ['P4 · Übergabe','Aussagen, Verhalten, Risiken und Verlauf sachlich übergeben.']
      ],meds:['Midazolam','Lorazepam']
    }
  };

  window.RD_CHECKLISTS=C;
  let activeId=null;
  let activeIndex=0;
  let showResult=false;

  const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const root=()=>document.getElementById('app');
  const key=id=>'rd-checklist-stable-'+id;
  function load(id){
    const total=C[id].questions.length;
    try{
      const x=JSON.parse(localStorage.getItem(key(id))||'{}');
      if(x&&Array.isArray(x.answers)){
        const a=Array(total).fill(null);
        x.answers.slice(0,total).forEach((v,i)=>{if(Number.isInteger(v)&&v>=0)a[i]=v});
        return a;
      }
    }catch(e){}
    return Array(total).fill(null);
  }
  function save(id,a){try{localStorage.setItem(key(id),JSON.stringify({answers:a}))}catch(e){}}
  function answered(a){return a.filter(v=>v!==null).length}
  function level(q,a){return a==null?'open':q.answers[a][1]}
  function label(q,a){return a==null?'Offen':q.answers[a][0]}
  function crumb(text){const b=document.getElementById('breadcrumbCurrent');if(b)b.textContent=text}

  function list(){
    activeId=null;showResult=false;activeIndex=0;crumb('Checklisten');
    const r=root();if(!r)return;
    r.innerHTML='<div class="view-title"><div><span class="eyebrow red">CHECKLISTEN</span><h1>Geführte Einsatzabfragen</h1><p>Frage für Frage durchgehen, kritische Antworten erkennen und am Ende den priorisierten Abschluss anzeigen.</p></div></div><div class="category-grid checklist-enhanced-grid">'+Object.keys(C).map(id=>{
      const c=C[id],a=load(id),done=answered(a),pct=c.questions.length?Math.round(done/c.questions.length*100):0;
      return '<button type="button" class="panel checklist-card clx-card" data-cl-open="'+esc(id)+'"><div class="clx-card-head"><span class="clx-icon">✓</span><h3>'+esc(id)+'</h3></div><p>'+esc(c.desc)+'</p><div class="clx-progress"><span>'+done+'/'+c.questions.length+' Fragen</span><b>'+pct+'%</b></div><div class="clx-track"><i style="width:'+pct+'%"></i></div><span class="clx-open">Abfrage starten / fortsetzen →</span></button>';
    }).join('')+'</div>';
  }

  function detail(){
    const c=C[activeId],a=load(activeId),total=c.questions.length;
    if(answered(a)===total){showResult=true;result();return}
    if(a[activeIndex]!==null){const n=a.findIndex(v=>v===null);activeIndex=n<0?total-1:n}
    const q=c.questions[activeIndex];crumb(activeId+' / Abfrage '+(activeIndex+1));
    const selected=a[activeIndex];
    const r=root();if(!r)return;
    const steps=c.questions.map((x,i)=>'<button type="button" class="clx-step '+(i===activeIndex?'active ':'')+(a[i]!==null?level(x,a[i]):'')+'" data-cl-jump="'+i+'"><span>'+(i+1)+'</span><strong>'+esc(x.title)+'</strong><small>'+(a[i]===null?'offen':esc(label(x,a[i])))+'</small></button>').join('');
    const answers=q.answers.map((x,i)=>'<button type="button" class="clx-answer '+(selected===i?'selected ':'')+x[1]+'" data-cl-answer="'+i+'"><strong>'+esc(x[0])+'</strong><small>'+(x[1]==='critical'?'kritisch – sofort priorisieren':x[1]==='warning'?'auffällig / unklar – weiter prüfen':'unauffällig / planmäßig')+'</small></button>').join('');
    const hint=(selected===null?'<span>💡 Wähle die Antwort, die die aktuelle Lage am besten beschreibt.</span>':(level(q,selected)==='critical'?'<span>🚨 <b>Kritische Antwort:</b> Diesen Befund nicht durch weitere Detailfragen verzögern. Lokalen Notfall-/SOP-Pfad prüfen.</span>':level(q,selected)==='warning'?'<span>⚠ <b>Auffälliger/unklarer Befund:</b> Kontext und Verlauf aktiv weiter prüfen.</span>':'<span>✓ Befund dokumentiert. Im Verlauf weiter beobachten und bei Veränderung re-evaluieren.</span>'));
    const done=answered(a),pct=Math.round(done/total*100);
    r.innerHTML='<div class="view-title"><div><span class="eyebrow red">CHECKLISTE / '+(activeIndex+1)+' VON '+total+'</span><h1>'+esc(activeId)+'</h1><p>'+esc(c.desc)+'</p></div><button type="button" class="back" data-cl-back>← Übersicht</button></div><div class="clx-layout"><aside class="clx-sidebar clx-panel"><div class="clx-panel-title">Fragenübersicht</div><div class="clx-steps">'+steps+'</div><div class="clx-mini"><span>Fortschritt</span><b>'+done+'/'+total+' · '+pct+'%</b><div class="clx-track"><i style="width:'+pct+'%"></i></div></div></aside><div class="clx-main"><section class="clx-panel clx-question '+(selected!==null&&level(q,selected)==='critical'?'is-critical':selected!==null&&level(q,selected)==='warning'?'is-warning':'')+'"><div class="clx-question-top"><span class="clx-number">FRAGE '+(activeIndex+1)+'</span><span class="clx-status '+(selected===null?'normal':level(q,selected))+'">'+(selected===null?'OFFEN':level(q,selected)==='critical'?'KRITISCH':level(q,selected)==='warning'?'ACHTUNG':'OK')+'</span></div><h2>'+esc(q.title)+'</h2><p class="clx-qtext">'+esc(q.text)+'</p><div class="clx-hint">'+hint+'</div><div class="clx-answers">'+answers+'</div><div class="clx-actions"><button type="button" class="secondary" data-cl-prev '+(activeIndex===0?'disabled':'')+'>← Zurück</button><button type="button" class="primary" data-cl-next '+(selected===null?'disabled':'')+'>'+ (activeIndex===total-1?'Auswertung anzeigen':'Nächste Frage →')+'</button></div></section>'+medBlock(c.meds)+'</div></div>';
  }

  function result(){
    const c=C[activeId],a=load(activeId),rows=c.questions.map((q,i)=>({q:q,a:a[i]}));
    const critical=rows.filter(x=>x.a!==null&&level(x.q,x.a)==='critical');
    const warning=rows.filter(x=>x.a!==null&&level(x.q,x.a)==='warning');
    crumb(activeId+' / Auswertung');const r=root();if(!r)return;
    r.innerHTML='<div class="view-title"><div><span class="eyebrow red">ABFRAGE ABGESCHLOSSEN</span><h1>'+esc(activeId)+' – Was jetzt?</h1><p>Priorisierte Ausbildungs-/RP-Orientierung. Lokale SOPs, Algorithmen und fachliche Anordnungen haben Vorrang.</p></div><button type="button" class="back" data-cl-back>← Übersicht</button></div><div class="clx-result-grid"><section class="clx-panel '+(critical.length?'is-critical':'')+'"><div class="clx-panel-title">🚨 P1 · Sofort prüfen</div>'+ (critical.length?critical.map(x=>'<div class="clx-result-row critical"><span>!</span><div><strong>'+esc(x.q.title)+'</strong><small>Antwort: '+esc(label(x.q,x.a))+' · lokalen Notfall-/SOP-Pfad prüfen</small></div></div>').join(''):'<div class="clx-ok">Keine kritisch markierte Antwort.</div>')+'</section><section class="clx-panel"><div class="clx-panel-title">🟠 P2 · Auffällig / offen</div>'+ (warning.length?warning.map(x=>'<div class="clx-result-row warning"><span>!</span><div><strong>'+esc(x.q.title)+'</strong><small>'+esc(label(x.q,x.a))+' · Kontext und Verlauf prüfen</small></div></div>').join(''):'<div class="clx-ok">Keine zusätzlichen Warnpunkte.</div>')+'</section><section class="clx-panel"><div class="clx-panel-title">✅ P3/P4 · Maßnahmen und Abschluss</div>'+c.plan.map((p,i)=>'<div class="clx-result-row"><span>'+(i+1)+'</span><div><strong>'+esc(p[0])+'</strong><small>'+esc(p[1])+'</small></div></div>').join('')+'</section></div><section class="clx-panel clx-full"><div class="clx-panel-title">📋 Fragenprotokoll</div><div class="clx-result-grid inner">'+rows.map((x,i)=>'<button type="button" class="clx-log '+(x.a===null?'warning':level(x.q,x.a))+'" data-cl-jump="'+i+'"><span>'+(i+1)+'</span><div><strong>'+esc(x.q.title)+'</strong><small>'+esc(label(x.q,x.a))+'</small></div></button>').join('')+'</div></section>'+medBlock(c.meds)+'<div class="clx-actions"><button type="button" class="secondary" data-cl-reset>↻ Abfrage zurücksetzen</button><button type="button" class="primary" data-cl-back>← Zur Checkliste</button></div>';
  }

  function medBlock(names){
    if(!names||!names.length)return '';
    return '<section class="clx-panel clx-meds"><div class="clx-panel-title">💊 Medikamentenbezug</div><p>Nur Registerverweis für Ausbildung/RP. Keine Dosierung oder eigenständige Therapieanweisung.</p><div class="clx-med-grid">'+names.map(n=>'<button type="button" class="clx-med" data-cl-med="'+esc(n)+'"><strong>'+esc(n)+'</strong><small>Im Medikamentenregister prüfen</small></button>').join('')+'</div></section>';
  }

  function handle(e){
    const t=e.target&&e.target.closest?e.target.closest('[data-cl-open],[data-cl-back],[data-cl-jump],[data-cl-answer],[data-cl-prev],[data-cl-next],[data-cl-reset],[data-cl-med]'):null;
    if(!t)return;
    e.preventDefault();
    if(t.hasAttribute('data-cl-open')){activeId=t.getAttribute('data-cl-open');activeIndex=0;showResult=false;detail();return}
    if(t.hasAttribute('data-cl-back')){if(showResult||activeId){activeId=null;activeIndex=0;showResult=false;list()}else{list()}return}
    if(t.hasAttribute('data-cl-jump')){activeIndex=Math.max(0,Math.min(Number(t.getAttribute('data-cl-jump'))||0,C[activeId].questions.length-1));showResult=false;detail();return}
    if(t.hasAttribute('data-cl-answer')){const a=load(activeId);a[activeIndex]=Number(t.getAttribute('data-cl-answer'));save(activeId,a);detail();return}
    if(t.hasAttribute('data-cl-prev')){activeIndex=Math.max(0,activeIndex-1);detail();return}
    if(t.hasAttribute('data-cl-next')){if(load(activeId)[activeIndex]===null)return;if(activeIndex>=C[activeId].questions.length-1){showResult=true;result()}else{activeIndex++;detail()}return}
    if(t.hasAttribute('data-cl-reset')){const a=Array(C[activeId].questions.length).fill(null);save(activeId,a);activeIndex=0;showResult=false;detail();return}
    if(t.hasAttribute('data-cl-med')){const n=t.getAttribute('data-cl-med');window.__checklistReturnId=activeId;try{window.currentView='medikamente';activeId=null;showResult=false;if(typeof window.render==='function')window.render();setTimeout(function(){const input=document.getElementById('medSearch');if(input){input.value=n;input.dispatchEvent(new Event('input',{bubbles:true}))}},0)}catch(err){}return}
  }

  function bind(){
    const r=root();if(!r||r.__stableChecklistBound)return;
    r.__stableChecklistBound=true;r.addEventListener('click',handle,false);
  }

  window.renderChecklisten=function(){bind();if(activeId&&C[activeId]){showResult?result():detail()}else list()};
  bind();
})();
