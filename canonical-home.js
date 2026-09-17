(()=>{
  // Canonical landing page: the visual main menu. Existing application views remain reachable via the sidebar and tiles.
  const $=s=>document.querySelector(s);
  const closeDrawer=()=>{
    $('#sidebar')?.classList.remove('open');
    document.body.classList.remove('nav-drawer-open','sidebar-collapsed');
    $('#mobileMenu')?.setAttribute('aria-expanded','false');
  };
  const activateHome=()=>{
    document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view==='dashboard'));
    const crumb=$('#breadcrumbCurrent');
    if(crumb)crumb.textContent='Hauptmenü';
    closeDrawer();
  };
  const OPERATIONAL=[
    ['abfrage','☷','Abfragehilfe','Strukturierte Abfragen für Leitsymptome und Einsatzsituationen.','critical'],
    ['notfallbilder','✚','Notfallbilder','Schneller Einstieg in häufige Einsatzbilder und Lagebeispiele.','red'],
    ['checklisten','✓','Checklisten','Kompakte Listen für wiederkehrende Ausbildungs- und RP-Abläufe.','green'],
    ['medikamente','▣','Medikamente','Dein lokales Medikamenten-Lexikon für das RP-/Ausbildungssetup.','amber'],
    ['krankheiten-plus','📚','Krankheitsbilder','Vollständiger ICD-10-GM-2026-Katalog mit 14.370 Einträgen.','blue'],
    ['manv','⚠','MANV / Sichtung','Schnellzugriff auf den MANV- und Sichtungsbereich.','critical'],
    ['rechner','▦','Schnellrechner','Praktische Rechner und strukturierte Kurzberechnungen.','blue'],
    ['wissen','▤','Wissen','Kompakte Wissenskarten und Grundlagen für Ausbildung und RP.','green']
  ];
  const LEARNING=[
    ['ausbildung','🎓','Ausbildungsmodus','Lernpfad und Modulübersicht.'],
    ['dokumentation','📋','Einsatzdokumentation','Trainingsfälle nachvollziehbar dokumentieren.'],
    ['pruefung','🏆','Prüfungsmodus','Prüfungen und Wissensstand unter Zeitdruck trainieren.'],
    ['statistik','📊','Statistik & Fortschritt','Lernstand, Ergebnisse und Modulfortschritt.'],
    ['wissensdatenbank','📚','Wissensdatenbank','Aktive Lernkarten zum Wiederholen.'],
    ['suche','🔎','Globale Suche','Intranet- und Lerninhalte gezielt durchsuchen.']
  ];
  const route=key=>{
    if(key.startsWith('suite:')){
      const value=key.slice(6);
      const b=document.createElement('button');
      b.type='button';b.dataset.suiteRoute=value;b.setAttribute('aria-hidden','true');b.style.cssText='position:fixed;left:-10000px;top:-10000px';
      document.body.appendChild(b);b.click();setTimeout(()=>b.remove(),0);return;
    }
    const b=document.querySelector(`.nav-item[data-view="${CSS.escape(key)}"]`);
    if(b){b.click();return;}
    if(key==='lagebilder'&&typeof window.renderEinsatzlagen==='function'&&typeof window.openLagebilder==='function')window.openLagebilder();
  };
  const renderMainMenu=()=>{
    const app=$('#app');if(!app)return;
    activateHome();
    app.innerHTML=`<div class="rd-mainmenu">
      <section class="rd-mainmenu-hero">
        <div class="rd-mainmenu-kicker"><i></i><span>SYSTEM ONLINE · LOKAL BETRIEBSBEREIT</span></div>
        <h1>Hauptmenü</h1>
        <p>Alles Wichtige für Einsatzhilfe, Ausbildung und RP an einem Ort. Wähle direkt einen Bereich – die bestehende Navigation bleibt jederzeit verfügbar.</p>
        <div class="rd-mainmenu-hero-row">
          <div class="rd-mainmenu-status"><span>● <b>Offline</b> bereit</span><span>▣ Lokale Daten</span><span>14.370 Krankheitskatalog-Einträge</span></div>
          <button class="suite-btn primary" type="button" data-main-route="suite:ausbildung">🎓 Ausbildungsmodus</button>
        </div>
      </section>

      <section class="rd-mainmenu-section">
        <div class="rd-mainmenu-section-head"><div><h2>Einsatz &amp; Nachschlagen</h2><p>Die wichtigsten Bereiche mit einem Klick erreichbar.</p></div></div>
        <div class="rd-mainmenu-grid">${OPERATIONAL.map(x=>`<button class="rd-mainmenu-tile ${x[4]}" type="button" data-main-route="${x[0]}"><span class="rd-mainmenu-icon">${x[1]}</span><h3>${x[2]}</h3><p>${x[3]}</p><span class="rd-mainmenu-arrow">›</span></button>`).join('')}</div>
      </section>

      <section class="rd-mainmenu-section">
        <div class="rd-mainmenu-section-head"><div><h2>Sofortzugriff</h2><p>Kurze Wege für häufig verwendete Funktionen.</p></div></div>
        <div class="rd-mainmenu-featured">
          <button class="rd-mainmenu-feature" type="button" data-main-route="lagebilder"><span class="rd-mainmenu-feature-icon">🖼️</span><div><strong>Lagebilder / Einsatzlagen</strong><span>Realistische Szenarien direkt öffnen.</span></div></button>
          <button class="rd-mainmenu-feature" type="button" data-main-route="suite:dokumentation"><span class="rd-mainmenu-feature-icon">📋</span><div><strong>Dokumentation</strong><span>Trainingsbericht und Fallbearbeitung.</span></div></button>
          <button class="rd-mainmenu-feature" type="button" data-main-route="suite:statistik"><span class="rd-mainmenu-feature-icon">📊</span><div><strong>Fortschritt</strong><span>Aktuellen Lernstand kontrollieren.</span></div></button>
        </div>
      </section>

      <section class="rd-mainmenu-section">
        <div class="rd-mainmenu-section-head"><div><h2>Ausbildung</h2><p>Trainieren, prüfen und Lernstand verfolgen.</p></div><button class="rd-mainmenu-link" type="button" data-main-route="suite:ausbildung">Lernpfad öffnen →</button></div>
        <div class="rd-mainmenu-grid">${LEARNING.map(x=>`<button class="rd-mainmenu-tile" type="button" data-main-route="suite:${x[0]}"><span class="rd-mainmenu-icon">${x[1]}</span><h3>${x[2]}</h3><p>${x[3]}</p><span class="rd-mainmenu-arrow">›</span></button>`).join('')}</div>
      </section>

      <section class="rd-mainmenu-learning">
        <div class="panel"><div class="rd-mainmenu-learning-copy"><strong>Du suchst etwas Bestimmtes?</strong><p>Nutze die globale Suche oder den Notfall-Schnellzugriff oben rechts.</p></div><div class="rd-mainmenu-quick"><button type="button" data-main-route="suite:suche">🔎 Suche öffnen</button><button type="button" data-main-route="abfrage">☷ Abfragehilfe</button><button type="button" data-main-route="krankheiten-plus">📚 Krankheitsbilder</button></div></div>
      </section>

      <div class="rd-mainmenu-meta"><span>RD INTRANET · Hauptmenü</span><span><strong>Lokaler Modus</strong> · Ausbildungs-/RP-Inhalte</span></div>
    </div>`;
    app.querySelectorAll('[data-main-route]').forEach(b=>b.addEventListener('click',()=>route(b.dataset.mainRoute)));
  };

  window.__rdCanonicalHome=renderMainMenu;
  window.__rdMainMenuReady=true;

  document.addEventListener('click',e=>{
    const target=e.target?.closest?.('.brand,[data-view="dashboard"],[data-suite-route="dashboard"]');
    if(!target)return;
    e.preventDefault();e.stopImmediatePropagation();renderMainMenu();
  },true);

  // The start state is always the visual main menu.
  setTimeout(()=>renderMainMenu(),0);
})();
