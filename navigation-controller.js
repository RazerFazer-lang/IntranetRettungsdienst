(()=>{
  const SUITE_VIEWS=new Set(['dashboard','abcde','dokumentation','medlernen','gefahren','psychiatrie','ausbildung','pruefung','wissensdatenbank','suche','statistik']);
  const $=s=>document.querySelector(s);
  const closeDrawer=()=>{
    $('#sidebar')?.classList.remove('open');
    document.body.classList.remove('nav-drawer-open','sidebar-collapsed');
  };
  const setActive=view=>document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===view));
  const breadcrumb=text=>{const el=$('#breadcrumbCurrent');if(el)el.textContent=text};
  const cleanupScenes=()=>document.getElementById('einsatzlagenSection')?.remove();

  function ensureLagebilderButton(){
    const nav=$('.nav');
    if(!nav||nav.querySelector('[data-view="lagebilder"]'))return;
    const b=document.createElement('button');
    b.className='nav-item';
    b.dataset.view='lagebilder';
    b.innerHTML='<span>🖼️</span> Lagebilder / Einsatzlagen';
    const anchor=nav.querySelector('[data-view="notfallbilder"]');
    if(anchor)anchor.insertAdjacentElement('afterend',b);else nav.appendChild(b);
  }

  function openSuite(view){
    if(!SUITE_VIEWS.has(view)||typeof window.render!=='function')return false;
    setActive(view);
    breadcrumb(view==='dashboard'?'Dashboard':document.querySelector(`[data-view="${view}"]`)?.textContent?.trim()||'Training');
    cleanupScenes();
    window.render();
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

  // Sidebar entries belonging to the training suite are handled here instead
  // of relying on the legacy app.js renderer, which does not know these views.
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('.nav-item');
    if(!b)return;
    const view=b.dataset.view;
    if(!SUITE_VIEWS.has(view))return;
    e.preventDefault();
    e.stopImmediatePropagation();
    openSuite(view);
  },true);

  // Dashboard cards, quick-start buttons and global-search results use data-suite-route.
  document.addEventListener('click',e=>{
    const route=e.target.closest?.('[data-suite-route]')?.dataset.suiteRoute;
    if(!route||!SUITE_VIEWS.has(route))return;
    e.preventDefault();
    e.stopImmediatePropagation();
    openSuite(route);
  },true);

  // Dedicated Lagebilder navigation is the only special navigation item.
  document.addEventListener('click',e=>{
    const b=e.target.closest?.('.nav-item[data-view="lagebilder"]');
    if(!b)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    openLagebilder();
  },true);

  // The legacy Notfallbilder renderer is wrapped by einsatzlagen.js. Keep that
  // legacy file untouched, but always remove its injected panel immediately
  // after a normal Notfallbilder render so Lagebilder remain isolated.
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
