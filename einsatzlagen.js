const RD_EINSATZLAGEN = [
  ['verkehr','Verkehrsunfall – Pkw frontal','Verkehr','Zwei Pkw nach Frontalzusammenstoß, unklare Verletztenzahl, Verkehr läuft noch.'],
  ['verkehr-seitlich','Verkehrsunfall – Seitenaufprall','Verkehr','Pkw nach Seitenkollision, mögliche eingeschlossene Person, Unfallstelle absichern.'],
  ['verkehr-mehrfach','Verkehrsunfall – mehrere Fahrzeuge','Verkehr','Kettenkollision mit mehreren Fahrzeugen und unklarer Lageübersicht.'],
  ['lkw','Lkw-Unfall','Verkehr','Schwerer Lkw-Unfall auf Straße oder Autobahn, möglicher Gefahrguttransport prüfen.'],
  ['motorrad','Motorradunfall','Verkehr','Motorrad liegt auf Fahrbahn, Fahrerin oder Fahrer verletzt, Verkehrssicherung erforderlich.'],
  ['fahrrad','Fahrradunfall','Verkehr','Kollision oder Sturz mit Fahrrad, weitere Verkehrsteilnehmer in der Nähe.'],
  ['e-bike','E-Bike-Unfall','Verkehr','Sturz oder Kollision mit E-Bike, möglicher höherer Aufprallmechanismus.'],
  ['roller','E-Scooter-Unfall','Verkehr','Sturz oder Kollision mit E-Scooter im öffentlichen Verkehrsraum.'],
  ['bus','Busunfall','Verkehr','Bus mit mehreren möglichen Betroffenen; Fahrgastraum und Zugänglichkeit beachten.'],
  ['zug','Bahnunfall','Verkehr','Ereignis im Gleisbereich oder an Bahnsteig; Zugang und Eigenschutz priorisieren.'],
  ['bahnsteig','Medizinischer Notfall am Bahnsteig','Öffentlicher Raum','Akuter medizinischer Notfall an einem stark frequentierten Bahnsteig.'],
  ['unfall-autobahn','Unfall auf Autobahn','Verkehr','Unfall auf Autobahn mit hohem Folgeunfallrisiko und begrenzter Zugänglichkeit.'],
  ['stau','Medizinischer Notfall im Stau','Verkehr','Betroffene Person sitzt in dichtem Verkehr; Anfahrt und Übergabe organisieren.'],
  ['parkplatz','Unfall auf Parkplatz','Verkehr','Kollision oder Sturz auf Parkplatz eines Einkaufs- oder Veranstaltungsortes.'],
  ['garage','Unfall in Garage','Verkehr','Verletzung nach Unfall oder Arbeitsereignis in einer Garage oder Tiefgarage.'],

  ['wohnung','Medizinischer Notfall in Wohnung','Wohnung','Notfall in privater Wohnung mit begrenztem Raum und typischer Wohnumgebung.'],
  ['wohnzimmer','Bewusstlose Person im Wohnzimmer','Wohnung','Person im Wohnbereich vorgefunden, Lage beim Erstkontakt unklar.'],
  ['bad-sturz','Sturz im Badezimmer','Wohnung','Sturz auf engem Raum im Badezimmer, Zugang und Verletzungsmuster zunächst unklar.'],
  ['treppe','Sturz im Treppenhaus','Wohnung','Person nach Treppensturz im Hausflur oder Treppenhaus.'],
  ['bett','Erkrankte Person im Bett','Wohnung','Akute Erkrankung bei liegender Person im Schlafzimmer.'],
  ['tuer-oeffnung','Notfall hinter verschlossener Tür','Wohnung','Hilferufe oder auffällige Situation hinter verschlossener Tür.'],
  ['wohnung-allein','Alleinlebende Person in hilfsbedürftiger Lage','Wohnung','Person lebt allein und kann sich nach Ereignis nicht selbst helfen.'],
  ['rauchmelder','Rauchmelder ausgelöst – Person in Wohnung','Feuer','Rauchmelder aktiv, Person möglicherweise noch in der Wohnung.'],
  ['keller','Notfall im Keller','Wohnung','Person im Kellerbereich verletzt oder erkrankt, Zugang und Beleuchtung beachten.'],
  ['dachboden','Notfall auf Dachboden','Wohnung','Verletzung oder Erkrankung auf schwer zugänglichem Dachboden.'],
  ['aufzug','Notfall im Aufzug','Technik','Person in Aufzug eingeschlossen oder medizinisch auffällig.'],
  ['aufzug-stillstand','Aufzugstillstand mit medizinischem Problem','Technik','Eingeschlossene Person berichtet über akute Beschwerden.'],
  ['seniorenheim','Notfall im Pflege-/Seniorenheim','Pflege','Bewohner mit akutem Ereignis in einer betreuten Einrichtung.'],
  ['wohngruppe','Notfall in Wohngruppe','Soziales','Mehrere Bewohner oder Betreuende vor Ort, Situation kann dynamisch sein.'],

  ['brand-wohnung','Wohnungsbrand','Feuer','Wohnungsbrand mit möglicher Rauchgasexposition und unbekannter Personenlage.'],
  ['mehrfamilienhaus','Brand im Mehrfamilienhaus','Feuer','Brandereignis in einem Mehrfamilienhaus mit potenziell mehreren Betroffenen.'],
  ['kellerbrand','Kellerbrand','Feuer','Rauchentwicklung und Feuer im Kellerbereich eines Gebäudes.'],
  ['garagenbrand','Garagenbrand','Feuer','Brand in Garage oder Nebenanlage, mögliche Fahrzeuge oder Gasflaschen vor Ort.'],
  ['hallenbrand','Hallen-/Industriebrand','Feuer','Großes Brandereignis in Halle oder Gewerbeobjekt mit möglicher Räumung.'],
  ['rauchgas','Rauchgasexposition nach Brand','Feuer','Person nach Brandereignis mit möglicher Rauchinhalation.'],
  ['chemiebrand','Brand mit unbekanntem Gefahrstoff','Gefahrstoff','Brandereignis mit unbekanntem Stoff; Gefahrstofflage nicht ausgeschlossen.'],
  ['waldbrand','Wald- oder Vegetationsbrand','Feuer','Brand im Freigelände mit möglicher Gefährdung von Personen und Zufahrten.'],
  ['müllbrand','Müll-/Containerbrand','Feuer','Brand an Container, Müllplatz oder Recyclingbereich.'],
  ['fahrzeugbrand','Fahrzeugbrand','Feuer','Brennendes Fahrzeug, mögliche Insassen oder Exposition durch Rauch.'],
  ['akku-brand','Akku-/Lithium-Ionen-Brand','Feuer','Brand eines Akkus oder Elektrogeräts mit besonderer Gefahrenlage.'],

  ['gasgeruch','Gasgeruch in Gebäude','Gefahrstoff','Gasgeruch oder Verdacht auf austretendes Gas in Gebäude oder Keller.'],
  ['co-alarm','CO-Melder ausgelöst','Gefahrstoff','Kohlenmonoxid-Warnung in Wohn- oder Arbeitsbereich.'],
  ['chemikalie','Chemikalienaustritt','Gefahrstoff','Unklarer Stoffaustritt in Betrieb, Gebäude oder Außenbereich.'],
  ['ammoniak','Reizstoff-/Ammoniakaustritt','Gefahrstoff','Austritt eines stark reizenden Stoffes, betroffene Personen möglich.'],
  ['saeure','Säure-/Laugenunfall','Gefahrstoff','Flüssigkeitsfreisetzung mit möglicher Kontakt- oder Aerosolexposition.'],
  ['rauch-arbeitsplatz','Rauchentwicklung am Arbeitsplatz','Gefahrstoff','Unklare Rauchentwicklung in Produktions- oder Arbeitsbereich.'],
  ['unbekannte-substanz','Unbekanntes Pulver / unbekannte Substanz','Gefahrstoff','Unbekannter Stoff in Raum oder Behälter, Lage zunächst nicht klassifizierbar.'],
  ['tankstelle','Ereignis an Tankstelle','Gefahrstoff','Unfall, Feuer oder medizinischer Notfall im Tankstellenbereich.'],

  ['baustelle','Arbeitsunfall auf Baustelle','Arbeit','Verletzte Person auf Baustelle mit Maschinen, Höhen oder Baustoffen.'],
  ['sturz-hoehe','Sturz aus Höhe','Arbeit','Sturz von Leiter, Gerüst, Dach oder anderer Höhe.'],
  ['einklemmung','Person eingeklemmt','Technische Hilfe','Person zwischen Fahrzeug, Maschine oder Konstruktion eingeklemmt.'],
  ['maschine','Arbeitsunfall an Maschine','Arbeit','Verletzungsereignis an Produktionsmaschine mit möglicher komplexer Lage.'],
  ['stromunfall','Stromunfall','Arbeit','Person nach Kontakt mit elektrischer Anlage oder Leitung.'],
  ['landwirtschaft','Landwirtschaftlicher Unfall','Arbeit','Unfall mit Traktor, Anhänger, Tierhaltung oder landwirtschaftlicher Maschine.'],
  ['forst','Forstunfall','Arbeit','Verletzte Person im Wald, häufig erschwerte Zufahrt und Ortung.'],
  ['lager','Unfall im Lager','Arbeit','Verletzung durch Stapler, Regalsysteme oder herabfallende Lasten.'],
  ['kran','Kran-/Hebevorgang-Unfall','Arbeit','Unfall mit Lastaufnahme, Kran oder Hebeeinrichtung.'],
  ['schacht','Unfall in Schacht / Grube','Technische Hilfe','Person in tiefer oder schlecht zugänglicher Öffnung.'],
  ['bauschutt','Einsturz-/Verschüttungslage','Technische Hilfe','Bauteil oder Material eingestürzt, Person möglicherweise verschüttet.'],

  ['fussball','Medizinischer Notfall beim Fußball','Sport','Spieler oder Zuschauer mit akutem Ereignis am Sportplatz.'],
  ['sporthalle','Notfall in Sporthalle','Sport','Unfall oder medizinischer Notfall während Training oder Veranstaltung.'],
  ['fitness','Notfall im Fitnessstudio','Sport','Akutes Ereignis zwischen Trainingsgeräten und vielen Personen.'],
  ['schwimmbad','Notfall im Schwimmbad','Wasser','Medizinischer Notfall im Schwimmbadbereich.'],
  ['sprungturm','Unfall am Sprungturm','Wasser','Sturz oder Unfall nach Sprung ins Wasser.'],
  ['klettern','Unfall beim Klettern','Sport','Sturz oder Verletzung an Kletterwand oder Kletteranlage.'],
  ['reitsport','Reitunfall','Sport','Sturz vom Pferd oder Unfall im Reitbetrieb.'],
  ['skatepark','Unfall im Skatepark','Sport','Sturz mit Skateboard, BMX oder Scooter.'],
  ['wandern','Notfall beim Wandern','Freizeit','Person im Gelände erkrankt oder gestürzt, Zugang kann erschwert sein.'],
  ['bergung','Bergungs-/Rettungslage im Gelände','Freizeit','Person an schwer zugänglicher Stelle, zusätzliche Rettungsmittel möglich.'],

  ['ertrinken','Ertrinkungsunfall','Wasser','Person nach Wasserunfall aus See, Fluss, Bad oder Schwimmbad.'],
  ['eis-einbruch','Einbruch ins Eis','Wasser','Person im oder unter dünnem Eis, Eigenschutz besonders relevant.'],
  ['wasser-sport','Unfall beim Wassersport','Wasser','Unfall mit Boot, SUP, Kanu oder anderem Wassersportgerät.'],
  ['bootsunfall','Bootsunfall','Wasser','Personenunfall oder Kollision auf einem Gewässer.'],
  ['hitze','Hitzeereignis im Freien','Umwelt','Person mit Beschwerden bei hoher Außentemperatur oder direkter Sonne.'],
  ['unterkuehlung','Unterkühlung im Freien','Umwelt','Person nach Kälteexposition mit ausgeprägtem Kältegefühl oder Schwäche.'],
  ['unwetter','Notfall nach Unwetter','Umwelt','Verletzung oder Erkrankung nach Sturm, Starkregen oder Hagel.'],
  ['hochwasser','Notfall bei Hochwasser','Umwelt','Person in überschwemmtem Bereich oder nach Wassereintritt.'],
  ['baumsturz','Baumsturz / Trümmerlage','Umwelt','Person durch umgestürzten Baum oder Trümmer gefährdet oder verletzt.'],

  ['einkaufszentrum','Notfall im Einkaufszentrum','Öffentlicher Raum','Akuter medizinischer Notfall in stark frequentierter Umgebung.'],
  ['supermarkt','Notfall im Supermarkt','Öffentlicher Raum','Kunde oder Mitarbeitende mit akutem medizinischem Ereignis.'],
  ['restaurant','Notfall im Restaurant','Gastronomie','Gast oder Mitarbeitende mit medizinischem Problem im laufenden Betrieb.'],
  ['hotel','Notfall im Hotel','Beherbergung','Notfall in Hotelzimmer, Lobby oder Gemeinschaftsbereich.'],
  ['schule','Notfall in Schule','Bildung','Schüler, Lehrkraft oder Mitarbeitende mit akutem Ereignis.'],
  ['kindergarten','Notfall in Kindertagesstätte','Bildung','Akutes Ereignis bei Kind oder Betreuungspersonal.'],
  ['universitaet','Notfall an Hochschule','Bildung','Notfall in Hörsaal, Büro, Labor oder Campusbereich.'],
  ['veranstaltung','Notfall bei Veranstaltung','Veranstaltung','Akuter Notfall bei Konzert, Messe oder größerer Veranstaltung.'],
  ['konzert','Notfall im Konzert-/Festivalbereich','Veranstaltung','Medizinischer Notfall in dicht besuchtem Veranstaltungsgelände.'],
  ['stadion','Notfall im Stadion','Veranstaltung','Akutes Ereignis auf Tribüne oder im Innenbereich eines Stadions.'],
  ['kino','Notfall im Kino','Öffentlicher Raum','Person mit akutem Ereignis im Kinosaal oder Foyer.'],
  ['kirche','Notfall in Kirche','Öffentlicher Raum','Medizinischer Notfall während Gottesdienst oder Veranstaltung.'],
  ['friedhof','Notfall auf Friedhof','Öffentlicher Raum','Akuter Notfall im Freigelände mit teilweise abgelegenen Wegen.'],
  ['oeffentliche-toilette','Notfall in öffentlicher Toilette','Öffentlicher Raum','Person in abgeschlossener oder schwer einsehbarer Sanitäranlage.'],

  ['gewalt','Gewaltlage mit verletzter Person','Sicherheit','Verletzte Person in Lage mit möglicher fortbestehender Gefährdung.'],
  ['messerverletzung','Verletzung nach mutmaßlicher Messerattacke','Sicherheit','Verletzte Person nach Gewaltereignis; Sicherheitslage zunächst beachten.'],
  ['schlagerei','Verletzte Person nach Schlägerei','Sicherheit','Mehrere Beteiligte möglich, Konfliktlage kann noch bestehen.'],
  ['polizei','Medizinischer Notfall in Polizeigewahrsam','Sicherheit','Person in Gewahrsam mit akutem medizinischem Problem.'],
  ['justizvollzug','Notfall in Justizvollzugsanstalt','Sicherheit','Medizinischer Notfall in gesichertem Bereich.'],
  ['psych-krise','Akute psychiatrische Krisensituation','Psychiatrie','Ausgeprägte Unruhe, Verwirrtheit oder besondere Kommunikationslage.'],
  ['suizidlage','Akute Selbstgefährdung','Psychiatrie','Hinweise auf akute Selbstgefährdung; Lage und Umgebung zunächst sichern lassen.'],
  ['aggression','Aggressive Person im öffentlichen Raum','Sicherheit','Dynamische Lage mit medizinischer und sicherheitsbezogener Komponente.'],

  ['geburt','Geburt im Wohnbereich','Geburt','Geburt hat bereits begonnen oder steht unmittelbar bevor.'],
  ['geburt-unterwegs','Geburt im Fahrzeug','Geburt','Geburtssituation in Pkw oder anderem Fahrzeug.'],
  ['schwanger-sturz','Sturz einer Schwangeren','Geburt','Schwangerschaft und Trauma gleichzeitig relevant.'],
  ['neugeborenes','Akuter Notfall beim Neugeborenen','Geburt','Neugeborenes mit auffälligem Zustand kurz nach Geburt.'],
  ['kind-sturz','Sturz eines Kindes','Pädiatrie','Kind nach Sturz in Wohnung, Schule, Spielplatz oder öffentlichem Raum.'],
  ['kind-beton','Kind in besonderer Lage','Pädiatrie','Akuter Kindernotfall mit erschwerter Kommunikation oder ungewöhnlichem Umfeld.'],
  ['kindergruppe','Mehrere betroffene Kinder','Pädiatrie','Mehrere Kinder nach gemeinsamem Ereignis, z. B. Ausflug oder Veranstaltung.'],

  ['tierbiss','Tierbiss','Tier / Trauma','Verletzung nach Hundebiss, Katzenbiss oder anderem Tierkontakt.'],
  ['pferdeunfall','Unfall mit Pferd','Tier / Trauma','Sturz, Tritt oder Quetschung im Zusammenhang mit Pferden.'],
  ['insektenstich','Starke Reaktion nach Insektenstich','Allergie','Person nach Stichereignis mit deutlicher lokaler oder systemischer Reaktion.'],
  ['schlangenbiss','Schlangenbiss / Reptilienkontakt','Tier / Umwelt','Bissereignis mit unbekannter Art oder möglicher Giftwirkung.'],

  ['mehrere','Mehrere Verletzte nach gemeinsamem Ereignis','MANV','Mehrere Betroffene nach Unfall, Brand, Veranstaltung oder anderer Lage.'],
  ['eingestuerzt','Teilgebäude eingestürzt','MANV','Einsturz mit mehreren möglichen Betroffenen und eingeschränktem Zugang.'],
  ['massenanfall','Großschadenslage','MANV','Unübersichtliche Lage mit hoher Betroffenenzahl und mehreren Einsatzkräften.'],
  ['evakuierung','Medizinische Lage bei Evakuierung','MANV','Mehrere vulnerable Personen während einer Evakuierung betreuungsbedürftig.'],
  ['pflegestufe','Evakuierung einer Pflegeeinrichtung','MANV','Viele mobilitätseingeschränkte Bewohner müssen nach Störereignis betreut werden.'],
  ['ausfall-strom','Stromausfall mit medizinischen Problemen','Infrastruktur','Längerer Stromausfall mit Auswirkungen auf vulnerable Personen oder Einrichtungen.'],
  ['hitze-massenlage','Hitzeereignis bei Großveranstaltung','MANV','Mehrere Personen mit hitzebedingten Beschwerden auf einem Veranstaltungsgelände.'],
  ['lebensmittel','Gemeinsame Beschwerden nach Lebensmittelereignis','MANV','Mehrere Personen mit zeitlich ähnlichem Krankheitsbeginn nach gemeinsamer Exposition.'],
  ['wasserrohr','Wasserschaden mit betroffenen Personen','Infrastruktur','Wasserschaden in Gebäude mit möglichen Sturz-, Strom- oder Evakuierungsrisiken.'],
  ['stromleitung','Beschädigte Stromleitung / Gefahrenstelle','Technische Hilfe','Beschädigte elektrische Infrastruktur mit möglicherweise betroffenen Personen.'],
  ['unbekannt','Unklare Einsatzlage','Sonderlage','Alarmstichwort und tatsächliche Lage stimmen zunächst nicht eindeutig überein.']
];

function rdSceneIcon(type){
  const icons={verkehr:'🚗',arbeit:'🏗️',feuer:'🔥',gefahrstoff:'☣️',wohnung:'🏠',technik:'⚙️','technische hilfe':'🛠️',sport:'⚽',wasser:'🌊',umwelt:'🌳','öffentlicher raum':'🏙️','öffentlich':'🏙️',veranstaltung:'🎪',sicherheit:'🛡️',psychiatrie:'🧠',geburt:'👶',pädiatrie:'🧸',manv:'🚨',infrastruktur:'⚡',freizeit:'🥾',gastronomie:'🍽️','tier / trauma':'🐕','allergie':'🐝',pflege:'🏥',bildung:'🏫','technische hilfe':'🛠️','umwelt':'🌲'};
  return icons[type.toLowerCase()]||'🚑';
}

function renderEinsatzlagen(){
  const host=document.getElementById('einsatzlagenSection');
  if(!host)return;
  host.innerHTML=`<div class="einsatzlagen-head"><div><span class="eyebrow red">LAGEBILDER</span><h2>Realistische Einsatzlagen</h2><p>${RD_EINSATZLAGEN.length} typische Einsatzorte und Lageszenarien für Ausbildung, RP und Simulation.</p></div><div class="einsatzlagen-tools"><input id="einsatzlagenSearch" type="search" placeholder="Einsatzlage suchen …"><select id="einsatzlagenCategory"><option value="all">Alle Kategorien</option>${[...new Set(RD_EINSATZLAGEN.map(x=>x[2]))].sort((a,b)=>a.localeCompare(b,'de')).map(c=>`<option>${esc(c)}</option>`).join('')}</select></div></div><div id="einsatzlagenGrid" class="einsatzlagen-grid"></div>`;
  const search=document.getElementById('einsatzlagenSearch');
  const category=document.getElementById('einsatzlagenCategory');
  const draw=()=>{
    const q=(search?.value||'').trim().toLowerCase(); const c=category?.value||'all';
    const rows=RD_EINSATZLAGEN.filter(x=>(c==='all'||x[2]===c)&&(!q||x.slice(0,4).some(v=>v.toLowerCase().includes(q))));
    document.getElementById('einsatzlagenGrid').innerHTML=rows.length?rows.map(x=>`<article class="einsatzlage-card"><div class="einsatzlage-visual"><span>${rdSceneIcon(x[2])}</span><small>${esc(x[2])}</small></div><div class="einsatzlage-body"><h3>${esc(x[1])}</h3><p>${esc(x[3])}</p></div></article>`).join(''):`<div class="empty">Keine passenden Einsatzlagen gefunden.</div>`;
  };
  search.oninput=draw; category.onchange=draw; draw();
}

function mountEinsatzlagen(){
  const page=document.getElementById('app');
  if(!page||!document.getElementById('caseGrid')||document.getElementById('einsatzlagenSection'))return;
  const section=document.createElement('section'); section.id='einsatzlagenSection'; section.className='panel einsatzlagen-panel';
  const grid=document.getElementById('caseGrid');
  if(grid&&grid.parentElement){grid.parentElement.insertAdjacentElement('beforebegin',section); renderEinsatzlagen();}
}

const rdOldNotfallbilderRender=window.renderNotfallbilder;
if(typeof rdOldNotfallbilderRender==='function'){
  window.renderNotfallbilder=function(){rdOldNotfallbilderRender(); setTimeout(mountEinsatzlagen,0);};
}

const rdNav=document.querySelector('.nav');
if(rdNav){rdNav.addEventListener('click',e=>{const b=e.target.closest('[data-view="notfallbilder"]');if(b)setTimeout(mountEinsatzlagen,30);});}
setTimeout(mountEinsatzlagen,100);
