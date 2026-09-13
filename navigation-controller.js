(()=>{
  const SUITE_VIEWS=new Set(['dashboard','abcde','dokumentation','medlernen','gefahren','psychiatrie','ausbildung','pruefung','wissensdatenbank','suche','statistik']);
  const STANDARD_VIEWS={
    abfrage:['Abfragehilfe','renderAbfrage'],
    notfallbilder:['Notfallbilder','renderNotfallbilder'],
    checklisten:['Checklisten','renderChecklisten'],
    medikamente:['Medikamente','renderMedikamente'],
    manv:['MANV / Sichtung','renderManv'],
    rechner:['Rechner','renderRechner'],
    wissen:['Wissen','renderWissen']
  };
  const $=s=>document.querySelector(s);
  const closeDrawer=()=>{
    $('#sidebar')?.classList.remove('open');
    document.body.classList.remove('nav-drawer-open','sidebar-collapsed');
    $('#mobileMenu')?.setAttribute('aria-expanded','false');
  };
  const setActive=view=>document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
  const breadcrumb=text=>{const el=$('#breadcrumbCurrent');if(el)el.textContent=text};
  const cleanupScenes=()=>document.getElementById('einsatzlagenSection')?.remove();
  const navButton=(icon,label)=>`<span class="nav-icon">${icon}</span><span class="nav-label">${label}</span>`;

  function ensureLagebilderButton(){
    const nav=$('.nav');
    if(!nav||nav.querySelector('[data-view="lagebilder"]'))return;
    const b=document.createElement('button');
    b.className='nav-item';
    b.dataset.view='lagebilder';
    b.innerHTML=navButton('🖼️','Lagebilder / Einsatzlagen');
    const anchor=nav.querySelector('[data-view="notfallbilder"]');
    if(anchor)anchor.insertAdjacentElement('afterend',b);else nav.appendChild(b);
  }

  function openStandard(view){
    const meta=STANDARD_VIEWS[view];
    if(!meta||typeof window[meta[1]]!=='function')return false;
    cleanupScenes();
    setActive(view);
    breadcrumb(meta[0]);
    window[meta[1]]();
    if(typeof window.bindDynamic==='function')window.bindDynamic();
    closeDrawer();
    return true;
  }

  function openLagebilder(){
    if(typeof window.renderEinsatzlagen!=='function')return false;
    ensureLagebilderButton();
    cleanupScenes();
    const host=$('#app');
    if(!host)return false;
    host.innerHTML='<div class="view-title"><div><span class="eyebrow red">LAGEBILDER</span><h1>Realistische Einsatzlagen</h1><p>Eigenständiger Bereich für realistische Einsatzorte und Lageszenarien.</p></div></div><section id="einsatzlagenSection" class="panel einsatzlagen-panel"></section>';
    setActive('lagebilder');
    breadcrumb('Lagebilder / Einsatzlagen');
    window.renderEinsatzlagen();
    closeDrawer();
    return true;
  }

  // Standard pages and the standalone Lagebilder page are owned here. Training-suite
  // navigation is intentionally left to ausbildung-suite.js so its internal view state
  // remains synchronized with the sidebar and dashboard cards.
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('.nav-item');
    if(!b)return;
    const view=b.dataset.view;
    if(SUITE_VIEWS.has(view)){
      closeDrawer();
      return;
    }
    if(view==='lagebilder'){
      e.preventDefault();e.stopImmediatePropagation();openLagebilder();return;
    }
    if(STANDARD_VIEWS[view]){
      e.preventDefault();e.stopImmediatePropagation();openStandard(view);
    }
  },true);

  // Let the training suite handle its own route state; only close the mobile drawer.
  document.addEventListener('click',e=>{
    if(e.target.closest?.('[data-suite-route]')){
      setTimeout(closeDrawer,0);
      return;
    }
  },true);

  const oldNotfall=window.renderNotfallbilder;
  if(typeof oldNotfall==='function'&&!window.__rdNotfallCleanupWrapped){
    window.__rdNotfallCleanupWrapped=true;
    window.renderNotfallbilder=function(){
      oldNotfall();
      cleanupScenes();
      setTimeout(cleanupScenes,0);
      setTimeout(cleanupScenes,50);
    };
  }

  ensureLagebilderButton();
  setTimeout(ensureLagebilderButton,250);
  setTimeout(ensureLagebilderButton,800);
})();
