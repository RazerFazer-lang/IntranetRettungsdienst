(()=>{
  const STANDARD={
    dashboard:['Dashboard','renderDashboard'],
    abfrage:['Abfragehilfe','renderAbfrage'],
    notfallbilder:['Notfallbilder','renderNotfallbilder'],
    checklisten:['Checklisten','renderChecklisten'],
    medikamente:['Medikamente','renderMedikamente'],
    manv:['MANV / Sichtung','renderManv'],
    rechner:['Rechner','renderRechner'],
    wissen:['Wissen','renderWissen']
  };
  const SUITE=new Set(['dashboard','abcde','dokumentation','medlernen','gefahren','psychiatrie','ausbildung','pruefung','wissensdatenbank','suche','statistik']);
  const $=s=>document.querySelector(s);
  const closeDrawer=()=>{document.body.classList.remove('sidebar-collapsed');document.body.classList.remove('nav-drawer-open');$('#sidebar')?.classList.remove('open');};
  const breadcrumb=t=>{const b=$('#breadcrumbCurrent');if(b)b.textContent=t;};
  const setActive=v=>document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view===v));
  const cleanup=()=>document.getElementById('einsatzlagenSection')?.remove();

  function openStandard(view){
    const meta=STANDARD[view];
    if(!meta||typeof window[meta[1]]!=='function')return false;
    cleanup();
    setActive(view);
    breadcrumb(meta[0]);
    window[meta[1]]();
    if(typeof window.bindDynamic==='function')window.bindDynamic();
    closeDrawer();
    return true;
  }

  document.addEventListener('click',e=>{
    const b=e.target.closest?.('.nav-item');
    if(!b)return;
    const view=b.dataset.view;
    if(view==='lagebilder'||SUITE.has(view))return;
    if(STANDARD[view]){
      e.preventDefault();
      e.stopImmediatePropagation();
      openStandard(view);
    }
  },true);

  function setupDrawer(){
    const btn=$('#mobileMenu'),sidebar=$('#sidebar');
    if(!btn||!sidebar||btn.dataset.navFixBound)return;
    btn.dataset.navFixBound='1';
    btn.setAttribute('aria-expanded','false');
    const setOpen=open=>{
      const mobile=window.matchMedia('(max-width: 800px)').matches;
      sidebar.classList.toggle('open',open&&mobile);
      document.body.classList.toggle('nav-drawer-open',open&&mobile);
      document.body.classList.toggle('sidebar-collapsed',!open&&!mobile);
      btn.setAttribute('aria-expanded',String(open));
    };
    btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const mobile=window.matchMedia('(max-width: 800px)').matches;const open=mobile?sidebar.classList.contains('open'):!document.body.classList.contains('sidebar-collapsed');setOpen(!open);});
    document.addEventListener('click',e=>{
      if(!window.matchMedia('(max-width: 800px)').matches)return;
      if(!sidebar.classList.contains('open'))return;
      if(e.target.closest('#sidebar')||e.target.closest('#mobileMenu'))return;
      setOpen(false);
    });
    window.addEventListener('resize',()=>{if(window.matchMedia('(min-width: 801px)').matches){sidebar.classList.remove('open');document.body.classList.remove('nav-drawer-open');}});
    sidebar.addEventListener('click',e=>{if(e.target.closest('.nav-item'))setOpen(false);});
  }

  setupDrawer();
  setTimeout(setupDrawer,250);
  setTimeout(setupDrawer,800);
})();
