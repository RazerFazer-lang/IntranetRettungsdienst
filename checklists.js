/*
 * Stable checklist module.
 * One data model, one renderer, one click handler on #app.
 * No MutationObserver and no competing checklist controllers.
 */
(()=>{
  'use strict';

  const esc=(s='')=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const root=()=>document.getElementById('app');
  const storeKey=id=>`rd-checklist-${id}`;

  const q=(title,text,answers,hint)=>({title,text,answers,hint});
  const a=(label,level='normal')=>({label,level});

  const RD_CHECKLISTS={
    ABCDE:{
      desc:'Strukturierte Erstbeurteilung von Eigenschutz bis Übergabe.',
      questions:[
        q('Eigenschutz','Kann die Einsatzstelle sicher betreten und bearbeitet werden?',[a('Ja'),a('Nein / Gefahr','critical'),a('Unklar','warning')],'Bei Gefahrenlage nicht in Detailfragen verlieren. Eigenschutz und Gefahrenkontrolle haben Vorrang.'),
        q('Reaktion','Reagiert die Person adäquat auf Ansprache?',[a('Ja'),a('Eingeschränkt','warning'),a('Nein','critical')],'Vigilanz und Zeitpunkt einer Veränderung nachvollziehbar dokumentieren.'),
        q('Atemweg','Ist der Atemweg frei und ohne offensichtliche Bedrohung?',[a('Ja'),a('Auffällig','warning'),a('Unklar','critical')],'Bei akuter Bedrohung Atemweg priorisieren und den lokalen Notfallalgorithmus nutzen.'),
        q('Atmung','Ist die Atmung ausreichend und ohne relevante Auffälligkeiten?',[a('Ja'),a('Auffällig','warning'),a('Keine normale Atmung','critical')],'Eine deutliche Verschlechterung darf nicht durch weitere Detailfragen verzögert werden.'),
        q('Kreislauf','Wirkt die Kreislaufsituation stabil?',[a('Ja'),a('Auffällig','warning'),a('Instabil','critical')],'Bei Instabilität prioritäre Maßnahmen vor weiteren Detailfragen durchführen.'),
        q('Blutung','Besteht eine relevante äußere Blutung oder ein begründeter Verdacht?',[a('Nein'),a('Ja','critical'),a('Unklar','warning')],'Blutung aktiv suchen und nach lokalem Blutungsalgorithmus priorisieren.'),
        q('Neurologie','Bestehen neue neurologische Auffälligkeiten oder eine relevante Vigilanzänderung?',[a('Nein'),a('Ja','warning'),a('Unklar','warning')],'Beginn, letzte sichere Normalität und Verlauf möglichst genau festhalten.'),
        q('Beschwerden','Sind Hauptbeschwerde, Lokalisation und Verlauf klar erfasst?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Leitsymptom und zeitlichen Verlauf konkret dokumentieren.'),
        q('Exposition','Wurden Verletzungen, Haut, Temperatur und Umgebung berücksichtigt?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Bei Trauma, Hitze, Kälte oder Exposition gezielt nachfassen.'),
        q('Vitalwerte','Sind die relevanten Vitalparameter erhoben und bewertet?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Erhebungszeitpunkt und relevante Veränderungen nachvollziehbar dokumentieren.'),
        q('Re-Evaluation','Wurde nach relevanter Veränderung erneut systematisch beurteilt?',[a('Ja'),a('Noch nicht','warning'),a('Nicht erforderlich')],'Nach relevanter Veränderung oder Maßnahme erneut ABCDE-orientiert beurteilen.'),
        q('Übergabe','Sind Zeitverlauf, Befunde, Veränderungen und offene Punkte dokumentiert?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Strukturiert und nachvollziehbar an das nächste Team übergeben.')
      ],
      plan:[
        ['P1 · Sofort','Eigenschutz und unmittelbare Gefahren kontrollieren.'],
        ['P1 · Sofort','Kritische Auffälligkeiten nach lokalem Notfall-/Reanimationsalgorithmus priorisieren.'],
        ['P2 · Danach','Monitoring, vollständige Untersuchung und Re-Evaluation vervollständigen.'],
        ['P3 · Transport','Ziel- und Transportentscheidung nach lokaler SOP bzw. ärztlicher Vorgabe.'],
        ['P4 · Abschluss','Befunde, Verlauf, Zeiten und Übergabe dokumentieren.']
      ],
      meds:[]
    },
    Reanimation:{
      desc:'Geführte Reanimationsabfrage für Sicherheit, Team, Ablauf, Verlauf und Übergabe.',
      questions:[
        q('Einsatzstelle','Ist der Zugang zur Person sicher möglich?',[a('Ja'),a('Nein / Gefahr','critical'),a('Unklar','warning')],'Eigenschutz und sichere Arbeitsumgebung zuerst klären.'),
        q('Bewusstsein','Ist die Person nicht bzw. nicht adäquat reagierend?',[a('Ja','critical'),a('Nein'),a('Unklar','warning')],'Bei fehlender Reaktion den lokalen Reanimationspfad priorisieren.'),
        q('Atmung','Ist eine normale Atmung sicher vorhanden?',[a('Ja'),a('Auffällig / unklar','warning'),a('Nein','critical')],'Keine normale Atmung ist ein unmittelbarer Prioritätspunkt.'),
        q('Alarmierung','Sind erforderliche Ressourcen nach lokalem Ablauf alarmiert?',[a('Ja'),a('Teilweise','warning'),a('Nein','critical')],'Weitere Unterstützung nach lokalem Ablauf frühzeitig organisieren.'),
        q('Teamrollen','Sind Rollen, Zuständigkeiten und Kommunikationswege geklärt?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Klare Zuständigkeiten unterstützen einen strukturierten Ablauf.'),
        q('Defibrillation','Ist ein AED/Defibrillator verfügbar bzw. angefordert?',[a('Ja'),a('Unterwegs','warning'),a('Nein','critical')],'Defibrillation entsprechend dem gültigen lokalen Reanimationsalgorithmus organisieren.'),
        q('Atemweg / Beatmung','Ist die lokale Strategie für Atemweg und Beatmung festgelegt?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Konkrete Maßnahmen nach aktuellem lokalen Algorithmus.'),
        q('Reversible Ursachen','Werden reversible Ursachen nach lokalem Algorithmus berücksichtigt?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Sonderumstände und reversible Ursachen systematisch berücksichtigen.'),
        q('Zeitpunkte','Sind Beginn, Rhythmusanalysen und Schlüsselpunkte dokumentiert?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Zeitpunkte während des laufenden Geschehens fortlaufend dokumentieren.'),
        q('ROSC / Verlauf','Gab es eine relevante Zustandsänderung oder Rückkehr eines Kreislaufs?',[a('Nein'),a('Ja','critical'),a('Unklar','warning')],'Bei Zustandsänderung den passenden lokalen Pfad wählen.'),
        q('Post-Reanimation','Ist bei ROSC der lokale Post-Reanimationspfad vorbereitet?',[a('Ja'),a('Teilweise','warning'),a('Nicht zutreffend')],'Post-Reanimationsversorgung und Zielpfad nach lokaler SOP vorbereiten.'),
        q('Übergabe','Sind Reanimationsdauer, Maßnahmen, Zeiten und Verlauf nachvollziehbar?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Strukturierte Übergabe mit Ausgangslage, Verlauf und aktuellem Zustand.')
      ],
      plan:[
        ['P1 · Sofort','Sicherheit prüfen, Hilfe alarmieren und nach lokalem Reanimationsalgorithmus handeln.'],
        ['P1 · Sofort','Bei fehlender normaler Atmung den gültigen Reanimationsablauf priorisieren.'],
        ['P1 · Sofort','Defibrillation und hochwertige Reanimation entsprechend lokalem Algorithmus organisieren.'],
        ['P2 · Laufend','Teamrollen, Zeiten und relevante Ereignisse fortlaufend dokumentieren.'],
        ['P3 · Nach ROSC','Post-Reanimationsversorgung und Transport-/Zielpfad nach lokaler SOP vorbereiten.'],
        ['P4 · Übergabe','Strukturierte Übergabe mit Ausgangslage, Verlauf, Maßnahmen und aktuellen Befunden.']
      ],
      meds:['Epinephrin Injector']
    },
    Übergabe:{
      desc:'Geführte Übergabeabfrage, damit wichtige Informationen nicht verloren gehen.',
      questions:[
        q('Situation','Kann das aktuelle Hauptproblem in einem klaren Satz benannt werden?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Zuerst das aktuelle Hauptproblem und den Grund der Übergabe nennen.'),
        q('Zeitverlauf','Sind Beginn, Verlauf und entscheidende Zeitpunkte bekannt?',[a('Ja'),a('Teilweise','warning'),a('Nein / unbekannt','warning')],'Zeitangaben möglichst konkret und nachvollziehbar machen.'),
        q('Anamnese','Sind relevante Vorerkrankungen und Dauermedikation erfasst?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Unbekannte Angaben ausdrücklich als unbekannt dokumentieren.'),
        q('Allergien','Sind relevante Allergien bzw. Unverträglichkeiten bekannt?',[a('Ja'),a('Nein bekannt'),a('Unklar','warning')],'Allergiestatus klar benennen.'),
        q('Befunde','Sind wesentliche Untersuchungsbefunde und relevante Vitalwerte dokumentiert?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Wichtige Befunde knapp und strukturiert zusammenfassen.'),
        q('Verlauf','Sind relevante Veränderungen während des Einsatzes nachvollziehbar festgehalten?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Dynamik und zeitliche Veränderungen hervorheben.'),
        q('Maßnahmen','Sind relevante bereits durchgeführte Maßnahmen nachvollziehbar dokumentiert?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Maßnahme, Zeitpunkt und relevante Reaktion nennen.'),
        q('Reaktion','Ist festgehalten, wie sich der Patient nach relevanten Maßnahmen verändert hat?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Antwort auf Maßnahmen nicht nur vermuten, sondern beschreiben.'),
        q('Risiken','Sind aktuelle Risiken, Warnzeichen oder offene Probleme ausdrücklich benannt?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Offene Probleme klar und nachvollziehbar nennen.'),
        q('Empfehlung','Ist klar formuliert, was als Nächstes nach lokalem Ablauf geklärt werden muss?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Nächsten Schritt und offene Aufgaben eindeutig benennen.'),
        q('Rückfragen','Wurden offene Punkte geklärt und Rückfragen ermöglicht?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Rückfragen und Übergabebestätigung ermöglichen.'),
        q('Dokumentation','Ist die Übergabe selbst und der aktuelle Zustand dokumentiert?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Übergabe und Zustand zeitnah dokumentieren.')
      ],
      plan:[
        ['P1 · Vor Übergabe','Lebensbedrohliche Auffälligkeiten und unmittelbare Risiken zuerst nennen.'],
        ['P2 · Kerninfos','Situation, Zeitverlauf, Hintergrund und wesentliche Befunde zusammenfassen.'],
        ['P2 · Verlauf','Reaktionen und relevante Veränderungen nennen.'],
        ['P3 · Weiteres Vorgehen','Offene Aufgaben und nächsten Schritt eindeutig benennen.'],
        ['P4 · Abschluss','Rückfragen klären und Übergabe dokumentieren.']
      ],
      meds:[]
    },
    Trauma:{
      desc:'Traumaabfrage von Einsatzstelle und Mechanismus bis Re-Evaluation und Übergabe.',
      questions:[
        q('Einsatzstelle','Ist die Unfall-/Gewaltstelle sicher und der Zugang kontrolliert?',[a('Ja'),a('Teilweise','warning'),a('Nein / Gefahr','critical')],'Gefahrenkontrolle vor weiterer Detailabfrage.'),
        q('Mechanismus','Ist der Unfall- oder Ereignismechanismus nachvollziehbar?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Mechanismus und mögliche Verletzungsmuster gemeinsam betrachten.'),
        q('Blutung','Besteht eine relevante äußere Blutung oder Verdacht auf relevanten Blutverlust?',[a('Nein'),a('Ja','critical'),a('Unklar','warning')],'Blutung aktiv suchen und lokalen Blutungsablauf beachten.'),
        q('Atemweg / Atmung','Gibt es relevante Auffälligkeiten von Atemweg oder Atmung?',[a('Nein'),a('Ja','warning'),a('Unklar','warning')],'Bei akuter Bedrohung den lokalen Trauma-/Notfallalgorithmus priorisieren.'),
        q('Kreislauf','Gibt es Hinweise auf Kreislaufinstabilität oder schlechte Perfusion?',[a('Nein'),a('Ja','critical'),a('Unklar','warning')],'Bei Instabilität Detailabfragen nachrangig.'),
        q('Neurologie','Bestehen neue Bewusstseins- oder neurologische Auffälligkeiten?',[a('Nein'),a('Ja','warning'),a('Unklar','warning')],'Neurologischen Verlauf und Zeitpunkt dokumentieren.'),
        q('Verletzungsmuster','Sind relevante Verletzungen systematisch erfasst?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Nach lebensbedrohlichen Problemen den vollständigen Körperkontext prüfen.'),
        q('Begleitverletzungen','Wurde erneut nach übersehenen Begleitverletzungen gesucht?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Re-Evaluation verhindert Übersehen weiterer Verletzungen.'),
        q('Wärmeerhalt','Ist der Wärmeerhalt berücksichtigt?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Wärmeverlust aktiv begrenzen und Verlauf dokumentieren.'),
        q('Schmerz','Sind Schmerzstärke, Lokalisation und Verlauf erfasst?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Schmerzverlauf nach lokalen Standards dokumentieren.'),
        q('Re-Evaluation','Wurde nach Maßnahmen und Veränderungen erneut beurteilt?',[a('Ja'),a('Noch nicht','warning'),a('Nicht erforderlich')],'Nach jeder relevanten Veränderung erneut beurteilen.'),
        q('Übergabe','Sind Mechanismus, Befunde, Verlauf und offene Risiken vollständig?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Traumamechanismus und relevante Befunde strukturiert übergeben.')
      ],
      plan:[
        ['P1 · Sofort','Eigenschutz und Gefahrenkontrolle sicherstellen.'],
        ['P1 · Sofort','Lebensbedrohliche Blutung sowie Atemwegs-/Atmungs-/Kreislaufprobleme nach lokalem Traumaalgorithmus priorisieren.'],
        ['P2 · Danach','Verletzungsmuster und Begleitverletzungen vervollständigen.'],
        ['P2 · Danach','Monitoring, Schmerzverlauf und Re-Evaluation fortführen.'],
        ['P3 · Transport','Zielklinik und Transportstrategie nach lokalem Zuweisungspfad.'],
        ['P4 · Übergabe','Mechanismus, Befunde, Veränderungen und offene Risiken übergeben.']
      ],
      meds:['Tranexamsäure','Metamizol']
    },
    Pädiatrie:{
      desc:'Altersgerechte Abfrage für Verhalten, Atmung, Kreislauf, Fremdanamnese und Sicherheit.',
      questions:[
        q('Alter / Gewicht','Sind Alter und ein für den lokalen Ablauf geeignetes Gewicht bekannt?',[a('Ja'),a('Ungefähr','warning'),a('Nein','warning')],'Bei Unsicherheit lokale pädiatrische Hilfsmittel und Vorgaben nutzen.'),
        q('Verhalten','Ist das Verhalten altersgerecht oder relevant verändert?',[a('Unauffällig'),a('Verändert','warning'),a('Unklar','warning')],'Veränderung gegenüber dem Ausgangszustand erfragen.'),
        q('Bewusstsein','Ist die Reaktionslage altersgerecht?',[a('Ja'),a('Eingeschränkt','warning'),a('Nein','critical')],'Deutliche Vigilanzstörung priorisieren.'),
        q('Atmung','Gibt es auffällige Atemarbeit oder relevante Atemprobleme?',[a('Nein'),a('Ja','critical'),a('Unklar','warning')],'Kinder können sich rasch verändern; Verlauf eng beobachten.'),
        q('Kreislauf / Perfusion','Gibt es auffällige Perfusions- oder Kreislaufzeichen?',[a('Nein'),a('Ja','critical'),a('Unklar','warning')],'Altersabhängige Zeichen und Verlauf nach lokalem Standard bewerten.'),
        q('Fremdanamnese','Liegen Angaben von Eltern, Bezugspersonen oder Zeugen vor?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Fremdanamnese besonders bei kleinen Kindern wichtig.'),
        q('Vorerkrankungen','Sind relevante Vorerkrankungen und Dauermedikation bekannt?',[a('Ja'),a('Nein','warning'),a('Unklar','warning')],'Relevante Dauertherapie und bekannte Risiken dokumentieren.'),
        q('Trinken / Essen','Besteht eine relevante Veränderung von Trinken, Essen oder Ausscheidungen?',[a('Nein'),a('Ja','warning'),a('Unklar','warning')],'Verlauf und mögliche Dehydratationszeichen berücksichtigen.'),
        q('Fieber / Infekt','Gibt es Hinweise auf Infekt mit verändertem Allgemeinzustand?',[a('Nein'),a('Ja','warning'),a('Unklar','warning')],'Allgemeinzustand und Dynamik beachten.'),
        q('Sicherheit / Umfeld','Gibt es relevante Sicherheits-, Betreuungs- oder Kinderschutzaspekte?',[a('Nein'),a('Ja','warning'),a('Unklar','warning')],'Sachlich dokumentieren und lokale Vorgaben beachten.'),
        q('Re-Evaluation','Wurde die Entwicklung nach relevanten Veränderungen erneut beurteilt?',[a('Ja'),a('Noch nicht','warning'),a('Nicht erforderlich')],'Kinder bei schwankendem Zustand engmaschig re-evaluieren.'),
        q('Übergabe','Sind Alter, Gewicht, Verlauf und Befunde klar dokumentiert?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Übergabe alters- und entwicklungsbezogen strukturieren.')
      ],
      plan:[
        ['P1 · Sofort','Bei deutlicher Verschlechterung Atemweg, Atmung und Kreislauf nach lokalem Algorithmus priorisieren.'],
        ['P1 · Sofort','Alters-/gewichtsbezogene lokale Abläufe und passende Ressourcen nutzen.'],
        ['P2 · Danach','Fremdanamnese, Verlauf und Vorerkrankungen vervollständigen.'],
        ['P2 · Danach','Monitoring und Re-Evaluation altersgerecht fortführen.'],
        ['P3 · Transport','Geeigneten pädiatrischen Zielpfad nach lokalem Vorgehen klären.'],
        ['P4 · Übergabe','Alter, Gewicht, Verlauf, Befunde und Beobachtungen vollständig übergeben.']
      ],
      meds:[]
    },
    Geburt:{
      desc:'Getrennte strukturierte Abfrage für Mutter und Kind.',
      questions:[
        q('Schwangerschaftswoche','Ist die Schwangerschaftswoche bekannt oder plausibel eingegrenzt?',[a('Ja'),a('Ungefähr','warning'),a('Unbekannt','warning')],'Zeitpunkt und relevante Schwangerschaftsdaten dokumentieren.'),
        q('Geburtsphase','Ist der aktuelle Geburtsfortschritt nachvollziehbar?',[a('Ja'),a('Teilweise','warning'),a('Unklar','warning')],'Geburtsphase und Verlauf gemeinsam betrachten.'),
        q('Mutter – Zustand','Ist die Mutter hinsichtlich Bewusstsein, Atmung und Kreislauf stabil?',[a('Ja'),a('Auffällig','warning'),a('Instabil / unklar','critical')],'Mutter und Kind immer getrennt beurteilen.'),
        q('Blutung','Besteht eine relevante Blutung oder entsprechender Verdacht?',[a('Nein'),a('Ja','critical'),a('Unklar','warning')],'Blutung sofort nach lokalem geburtshilflichem Ablauf priorisieren.'),
        q('Wehen / Verlauf','Sind Beginn, Häufigkeit und Verlauf der Beschwerden nachvollziehbar?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Verlauf und relevante Zeitpunkte dokumentieren.'),
        q('Kind – Zustand','Ist der Zustand des Kindes nach lokalem Ablauf erfasst?',[a('Ja'),a('Teilweise','warning'),a('Noch nicht','warning')],'Bei Geburt Mutter und Kind getrennt weiterführen.'),
        q('Geburtszeitpunkt','Ist der tatsächliche Geburtszeitpunkt dokumentiert?',[a('Ja'),a('Ungefähr','warning'),a('Nein','warning')],'Zeitpunkt möglichst exakt festhalten.'),
        q('Wärmeerhalt','Ist der Wärmeerhalt von Mutter und Kind berücksichtigt?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Wärmeverlust aktiv vermeiden.'),
        q('Komplikationen','Sind relevante Komplikationen oder Risiken bekannt?',[a('Nein'),a('Ja','warning'),a('Unklar','warning')],'Komplikationen konkret benennen und lokalen Ablauf nutzen.'),
        q('Ressourcen','Sind passende geburtshilfliche/neonatale Ressourcen organisiert?',[a('Ja'),a('Teilweise','warning'),a('Nein / unklar','warning')],'Ressourcen frühzeitig nach lokalem Ablauf aktivieren.'),
        q('Re-Evaluation','Werden Mutter und Kind getrennt wiederholt beurteilt?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Bei Veränderung jeweils den eigenen lokalen Pfad wählen.'),
        q('Übergabe','Sind Schwangerschaft, Verlauf, Zeiten und Zustand von Mutter und Kind dokumentiert?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Getrennte Statusangaben an das aufnehmende Team übergeben.')
      ],
      plan:[
        ['P1 · Sofort','Mutter und Kind getrennt beurteilen und kritische Probleme priorisieren.'],
        ['P1 · Sofort','Relevante Blutung und akute Komplikationen nach lokaler SOP priorisieren.'],
        ['P2 · Danach','Geburtsphase, Zeiten und relevante Anamnese vervollständigen.'],
        ['P2 · Danach','Wärmeerhalt und Re-Evaluation von Mutter und Kind fortführen.'],
        ['P3 · Transport','Geburtshilflichen/neonatalen Zielpfad nach lokalem Standard klären.'],
        ['P4 · Übergabe','Mutter und Kind getrennt, mit Zeiten und Verlauf, übergeben.']
      ],
      meds:[]
    },
    Intoxikation:{
      desc:'Intoxikationsabfrage für Eigenschutz, Substanz, Verlauf, Vitalfunktionen und Übergabe.',
      questions:[
        q('Eigenschutz','Ist die Expositionsgefahr für Team und Umgebung beherrscht?',[a('Ja'),a('Nein / Gefahr','critical'),a('Unklar','warning')],'Eigenschutz und weitere Exposition zuerst klären.'),
        q('Substanz','Ist die mögliche Substanz oder das Produkt bekannt?',[a('Ja'),a('Vermutet','warning'),a('Unbekannt','warning')],'Verpackung und Produktinformationen sichern.'),
        q('Menge','Ist eine ungefähre Menge bekannt?',[a('Ja'),a('Ungefähr','warning'),a('Nein','warning')],'Schätzung ausdrücklich als solche kennzeichnen.'),
        q('Zeitpunkt','Ist der mögliche Expositionszeitpunkt bekannt?',[a('Ja'),a('Ungefähr','warning'),a('Nein','warning')],'Zeitpunkt bzw. letzte sichere Beobachtung dokumentieren.'),
        q('Aufnahmeweg','Ist der Aufnahme-/Expositionsweg bekannt?',[a('Ja'),a('Unklar','warning'),a('Nein','warning')],'Aufnahmeweg kann für weitere lokale Schritte relevant sein.'),
        q('Begleitstoffe','Sind weitere Medikamente, Drogen oder Substanzen möglich?',[a('Nein'),a('Ja','warning'),a('Unklar','warning')],'Mehrfachintoxikation mitdenken und dokumentieren.'),
        q('Bewusstsein','Ist die Reaktionslage verändert?',[a('Nein'),a('Ja','critical'),a('Unklar','warning')],'Bewusstseinsstörung priorisieren.'),
        q('Atmung','Ist die Atmung auffällig?',[a('Nein'),a('Ja','critical'),a('Unklar','warning')],'Atemweg und Atmung haben Vorrang.'),
        q('Kreislauf','Ist der Kreislauf auffällig oder instabil?',[a('Nein'),a('Ja','critical'),a('Unklar','warning')],'Kreislaufinstabilität sofort priorisieren.'),
        q('Verpackung','Sind Verpackung, Präparatname oder weitere Hinweise verfügbar?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Informationen für lokale Giftinformation/SOP sichern.'),
        q('Fremdanamnese','Sind Zeugen oder andere Quellen für die Anamnese vorhanden?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Fremdanamnese mit Quelle dokumentieren.'),
        q('Übergabe / Giftinfo','Sind relevante Informationen für den lokalen Giftinformations-/SOP-Weg vorbereitet?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Substanz, Menge, Zeitpunkt, Weg und Verlauf strukturiert weitergeben.')
      ],
      plan:[
        ['P1 · Sofort','Eigenschutz und Expositionskontrolle sicherstellen.'],
        ['P1 · Sofort','Bewusstseins-, Atemwegs-, Atmungs- und Kreislaufprobleme priorisieren.'],
        ['P2 · Danach','Substanz, Menge, Zeitpunkt, Aufnahmeweg und Begleitstoffe erheben.'],
        ['P2 · Danach','Verpackungen und sonstige Hinweise sichern.'],
        ['P3 · Fachinformation','Lokalen Giftinformations-/SOP-Weg und ärztliche Vorgaben nutzen.'],
        ['P4 · Übergabe','Toxikologieinformationen, Verlauf und Zeitpunkte vollständig übergeben.']
      ],
      meds:['Naloxon']
    },
    Psychiatrie:{
      desc:'Psychiatrische Abfrage mit Eigenschutz, Kontakt, Orientierung und Eigen-/Fremdgefährdung.',
      questions:[
        q('Eigenschutz','Ist das Umfeld für Patient und Team ausreichend sicher?',[a('Ja'),a('Nein / Gefahr','critical'),a('Unklar','warning')],'Eigenschutz und Teampositionierung zuerst.'),
        q('Kontakt','Ist ein ruhiger und nachvollziehbarer Kontakt möglich?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Kommunikation ruhig, klar und nachvollziehbar halten.'),
        q('Bewusstsein','Ist die Reaktionslage unauffällig?',[a('Ja'),a('Eingeschränkt','warning'),a('Nein','critical')],'Akute Bewusstseinsänderung kann eine somatische Ursache haben.'),
        q('Orientierung','Ist die Person ausreichend zu Person, Ort und Situation orientiert?',[a('Ja'),a('Teilweise','warning'),a('Nein / unklar','warning')],'Veränderungen sachlich dokumentieren.'),
        q('Eigengefährdung','Gibt es Hinweise auf aktuelle Selbstgefährdung?',[a('Nein'),a('Ja','critical'),a('Unklar','warning')],'Bei konkreter Gefahr lokalen Schutz-/Alarmierungsweg aktivieren.'),
        q('Fremdgefährdung','Gibt es Hinweise auf aktuelle Fremdgefährdung?',[a('Nein'),a('Ja','critical'),a('Unklar','warning')],'Sicherheitslage und Unterstützung nach lokalem Ablauf organisieren.'),
        q('Agitation','Besteht deutliche Unruhe oder schwer steuerbares Verhalten?',[a('Nein'),a('Ja','warning'),a('Unklar','warning')],'Deeskalation und Eigenschutz priorisieren.'),
        q('Substanzen','Sind Alkohol, Drogen oder andere Substanzen möglich?',[a('Nein'),a('Ja','warning'),a('Unklar','warning')],'Substanzbedingte Ursachen mitdenken.'),
        q('Vorerkrankungen','Sind relevante psychiatrische/somatische Vorerkrankungen und Medikamente bekannt?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Fremdanamnese einbeziehen, wenn möglich.'),
        q('Körperliche Ursache','Gibt es Hinweise auf eine somatische oder neurologische Ursache?',[a('Nein'),a('Ja','warning'),a('Unklar','warning')],'Psychische Symptome nicht vorschnell rein psychiatrisch einordnen.'),
        q('Re-Evaluation','Wurde nach Beruhigung oder Veränderung erneut beurteilt?',[a('Ja'),a('Noch nicht','warning'),a('Nicht erforderlich')],'Bei Zustandsänderung erneut systematisch beurteilen.'),
        q('Dokumentation','Sind Beobachtungen, Aussagen und Risiken sachlich dokumentiert?',[a('Ja'),a('Teilweise','warning'),a('Nein','warning')],'Aussagen und Beobachtungen getrennt und nachvollziehbar dokumentieren.')
      ],
      plan:[
        ['P1 · Sofort','Eigenschutz, Teampositionierung und sichere Umgebung priorisieren.'],
        ['P1 · Sofort','Eigen-/Fremdgefährdung nach lokalem Schutz- und Alarmierungsweg behandeln.'],
        ['P2 · Danach','Kontakt, Orientierung, somatische Ursachen und mögliche Substanzen strukturieren.'],
        ['P2 · Danach','Re-Evaluation nach relevanten Veränderungen fortführen.'],
        ['P3 · Weiteres Vorgehen','Psychiatrischen/ärztlichen Zielpfad und notwendige Unterstützung klären.'],
        ['P4 · Übergabe','Aussagen, Verhalten, Risiken und Verlauf sachlich übergeben.']
      ],
      meds:['Midazolam','Lorazepam']
    }
  };

  window.RD_CHECKLISTS=RD_CHECKLISTS;
  let activeId=null;
  let activeIndex=0;
  let showingResult=false;

  function load(id){
    const total=RD_CHECKLISTS[id].questions.length;
    try{
      const parsed=JSON.parse(localStorage.getItem(storeKey(id))||'{}');
      if(parsed&&Array.isArray(parsed.answers)){
        return Array.from({length:total},(_,i)=>Number.isInteger(parsed.answers[i])?parsed.answers[i]:null);
      }
    }catch(e){}
    return Array(total).fill(null);
  }
  function save(id,answers){try{localStorage.setItem(storeKey(id),JSON.stringify({answers}))}catch(e){}}
  const answered=arr=>arr.filter(v=>v!==null).length;
  const setCrumb=text=>{const el=document.getElementById('breadcrumbCurrent');if(el)el.textContent=text};

  function renderList(){
    activeId=null;activeIndex=0;showingResult=false;setCrumb('Checklisten');
    const r=root();if(!r)return;
    r.innerHTML=`<div class="view-title"><div><span class="eyebrow red">CHECKLISTEN</span><h1>Geführte Einsatzabfragen</h1><p>Frage für Frage beantworten, kritische Punkte erkennen und am Ende den priorisierten Abschluss anzeigen.</p></div></div><div class="category-grid checklist-enhanced-grid">${Object.entries(RD_CHECKLISTS).map(([id,c])=>{const arr=load(id),done=answered(arr),pct=Math.round(done/c.questions.length*100);return `<button type="button" class="panel checklist-card clx-card" data-cl-open="${esc(id)}"><div class="clx-card-head"><span class="clx-icon">✓</span><h3>${esc(id)}</h3></div><p>${esc(c.desc)}</p><div class="clx-progress"><span>${done}/${c.questions.length} Fragen</span><b>${pct}%</b></div><div class="clx-track"><i style="width:${pct}%"></i></div><span class="clx-open">Abfrage starten / fortsetzen →</span></button>`}).join('')}</div>`;
  }

  function renderDetail(){
    const c=RD_CHECKLISTS[activeId],arr=load(activeId),total=c.questions.length;
    const firstOpen=arr.findIndex(v=>v===null);
    if(firstOpen===-1){showingResult=true;renderResult();return;}
    if(arr[activeIndex]!==null)activeIndex=firstOpen;
    const current=c.questions[activeIndex],selected=arr[activeIndex];
    setCrumb(`${activeId} / Abfrage ${activeIndex+1}`);
    const r=root();if(!r)return;
    const steps=c.questions.map((item,i)=>`<button type="button" class="clx-step ${i===activeIndex?'active ':''}${arr[i]!==null?item.answers[arr[i]].level:''}" data-cl-jump="${i}"><span>${i+1}</span><strong>${esc(item.title)}</strong><small>${arr[i]===null?'offen':esc(item.answers[arr[i]].label)}</small></button>`).join('');
    const answers=current.answers.map((choice,i)=>`<button type="button" class="clx-answer ${selected===i?'selected ':''}${choice.level}" data-cl-answer="${i}"><strong>${esc(choice.label)}</strong><small>${choice.level==='critical'?'kritisch – sofort priorisieren':choice.level==='warning'?'auffällig / unklar – weiter prüfen':'unauffällig / planmäßig'}</small></button>`).join('');
    const hint=selected===null?`<span>💡 ${esc(current.hint)}</span>`:selected!==null&&current.answers[selected].level==='critical'?`<span>🚨 <b>Kritischer Punkt:</b> ${esc(current.hint)}</span>`:selected!==null&&current.answers[selected].level==='warning'?`<span>⚠ <b>Auffälliger / unklarer Punkt:</b> ${esc(current.hint)}</span>`:`<span>✓ ${esc(current.hint)}</span>`;
    const lvl=selected===null?'normal':current.answers[selected].level;
    const done=answered(arr),pct=Math.round(done/total*100);
    r.innerHTML=`<div class="view-title"><div><span class="eyebrow red">CHECKLISTE / ${activeIndex+1} VON ${total}</span><h1>${esc(activeId)}</h1><p>${esc(c.desc)}</p></div><button type="button" class="back" data-cl-back>← Übersicht</button></div><div class="clx-layout"><aside class="clx-sidebar clx-panel"><div class="clx-panel-title">Fragenübersicht</div><div class="clx-steps">${steps}</div><div class="clx-mini"><span>Fortschritt</span><b>${done}/${total} · ${pct}%</b><div class="clx-track"><i style="width:${pct}%"></i></div></div></aside><div class="clx-main"><section class="clx-panel clx-question ${lvl==='critical'?'is-critical':lvl==='warning'?'is-warning':''}"><div class="clx-question-top"><span class="clx-number">FRAGE ${activeIndex+1}</span><span class="clx-status ${lvl}">${selected===null?'OFFEN':lvl==='critical'?'KRITISCH':lvl==='warning'?'ACHTUNG':'OK'}</span></div><h2>${esc(current.title)}</h2><p class="clx-qtext">${esc(current.text)}</p><div class="clx-hint">${hint}</div><div class="clx-answers">${answers}</div><div class="clx-actions"><button type="button" class="secondary" data-cl-prev ${activeIndex===0?'disabled':''}>← Zurück</button><button type="button" class="primary" data-cl-next ${selected===null?'disabled':''}>${activeIndex===total-1?'Auswertung anzeigen':'Nächste Frage →'}</button></div></section>${medBlock(c.meds)}</div></div>`;
  }

  function renderResult(){
    const c=RD_CHECKLISTS[activeId],arr=load(activeId);setCrumb(`${activeId} / Auswertung`);const r=root();if(!r)return;
    const critical=[],warning=[];
    c.questions.forEach((item,i)=>{if(arr[i]===null)warning.push({item,index:i,label:'Offen'});else if(item.answers[arr[i]].level==='critical')critical.push({item,index:i,label:item.answers[arr[i]].label});else if(item.answers[arr[i]].level==='warning')warning.push({item,index:i,label:item.answers[arr[i]].label})});
    r.innerHTML=`<div class="view-title"><div><span class="eyebrow red">ABFRAGE ABGESCHLOSSEN</span><h1>${esc(activeId)} – Was jetzt?</h1><p>Priorisierte Ausbildungs-/RP-Orientierung. Lokale SOPs, Algorithmen und fachliche Anordnungen haben Vorrang.</p></div><button type="button" class="back" data-cl-back>← Übersicht</button></div><div class="clx-result-grid"><section class="clx-panel ${critical.length?'is-critical':''}"><div class="clx-panel-title">🚨 P1 · Sofort prüfen</div>${critical.length?critical.map(x=>`<div class="clx-result-row critical"><span>!</span><div><strong>${esc(x.item.title)}</strong><small>Antwort: ${esc(x.label)} · lokalen Notfall-/SOP-Pfad prüfen</small></div></div>`).join(''):'<div class="clx-ok">Keine kritisch markierte Antwort.</div>'}</section><section class="clx-panel"><div class="clx-panel-title">🟠 P2 · Auffällig / offen</div>${warning.length?warning.map(x=>`<div class="clx-result-row warning"><span>!</span><div><strong>${esc(x.item.title)}</strong><small>${esc(x.label)} · Kontext und Verlauf prüfen</small></div></div>`).join(''):'<div class="clx-ok">Keine zusätzlichen Warnpunkte.</div>'}</section><section class="clx-panel"><div class="clx-panel-title">✅ P3/P4 · Maßnahmen und Abschluss</div>${c.plan.map((p,i)=>`<div class="clx-result-row"><span>${i+1}</span><div><strong>${esc(p[0])}</strong><small>${esc(p[1])}</small></div></div>`).join('')}</section></div><section class="clx-panel clx-full"><div class="clx-panel-title">📋 Fragenprotokoll – anklickbar</div><div class="clx-result-grid inner">${c.questions.map((item,i)=>`<button type="button" class="clx-log ${arr[i]===null?'warning':item.answers[arr[i]].level}" data-cl-jump="${i}"><span>${i+1}</span><div><strong>${esc(item.title)}</strong><small>${arr[i]===null?'Offen':esc(item.answers[arr[i]].label)}</small></div></button>`).join('')}</div></section>${medBlock(c.meds)}<div class="clx-actions"><button type="button" class="secondary" data-cl-reset>↻ Abfrage zurücksetzen</button><button type="button" class="primary" data-cl-back>← Zur Checkliste</button></div>`;
  }

  function medBlock(names){
    if(!Array.isArray(names)||!names.length)return '';
    return `<section class="clx-panel clx-meds"><div class="clx-panel-title">💊 Medikamentenbezug</div><p>Nur Registerverweis für Ausbildung/RP. Keine Dosierung oder eigenständige Therapieanweisung.</p><div class="clx-med-grid">${names.map(n=>`<button type="button" class="clx-med" data-cl-med="${esc(n)}"><strong>${esc(n)}</strong><small>Im Medikamentenregister prüfen</small></button>`).join('')}</div></section>`;
  }

  function handle(event){
    const t=event.target&&event.target.closest?event.target.closest('[data-cl-open],[data-cl-back],[data-cl-jump],[data-cl-answer],[data-cl-prev],[data-cl-next],[data-cl-reset],[data-cl-med]'):null;
    if(!t)return;
    event.preventDefault();
    if(t.hasAttribute('data-cl-open')){activeId=t.getAttribute('data-cl-open');activeIndex=0;showingResult=false;renderDetail();return;}
    if(t.hasAttribute('data-cl-back')){renderList();return;}
    if(t.hasAttribute('data-cl-jump')){activeIndex=Math.max(0,Math.min(Number(t.getAttribute('data-cl-jump'))||0,RD_CHECKLISTS[activeId].questions.length-1));showingResult=false;renderDetail();return;}
    if(t.hasAttribute('data-cl-answer')){const arr=load(activeId);arr[activeIndex]=Number(t.getAttribute('data-cl-answer'));save(activeId,arr);renderDetail();return;}
    if(t.hasAttribute('data-cl-prev')){activeIndex=Math.max(0,activeIndex-1);renderDetail();return;}
    if(t.hasAttribute('data-cl-next')){if(load(activeId)[activeIndex]===null)return;if(activeIndex>=RD_CHECKLISTS[activeId].questions.length-1){showingResult=true;renderResult();}else{activeIndex++;renderDetail();}return;}
    if(t.hasAttribute('data-cl-reset')){save(activeId,Array(RD_CHECKLISTS[activeId].questions.length).fill(null));activeIndex=0;showingResult=false;renderDetail();return;}
    if(t.hasAttribute('data-cl-med')){const name=t.getAttribute('data-cl-med');const nav=document.querySelector('.nav-item[data-view="medikamente"]');if(nav){window.__checklistMedTarget=name;nav.click();setTimeout(()=>{const input=document.getElementById('medSearch');if(input){input.value=name;input.dispatchEvent(new Event('input',{bubbles:true}));}},0);}return;}
  }

  function bind(){const r=root();if(!r||r.__rdChecklistBound)return;r.__rdChecklistBound=true;r.addEventListener('click',handle,false);}
  window.renderChecklisten=()=>{bind();if(activeId&&RD_CHECKLISTS[activeId]){showingResult?renderResult():renderDetail();}else{renderList();}};
  bind();
})();
