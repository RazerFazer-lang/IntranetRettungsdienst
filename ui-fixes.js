(()=>{
  const STORE='rd-suite-progress-v1';
  const LEARNING_IDS=['abcde','dokumentation','medlernen','gefahren','psychiatrie','ausbildung','pruefung','wissensdatenbank','suche'];
  const $=s=>document.querySelector(s);

  function readProgress(){
    try{return JSON.parse(localStorage.getItem(STORE)||'{}')||{};}
    catch{return{};}
  }

  function refreshDashboardProgress(){
    const hero=$('.suite-hero');
    if(!hero)return;
    const state=readProgress();
    const done=state.done&&typeof state.done==='object'?state.done:{};
    const completed=LEARNING_IDS.filter(id=>done[id]).length;
    const total=LEARNING_IDS.length;
    const pct=Math.round((completed/total)*100);

    const progressStrong=$('.suite-stat strong');
    const progressBar=$('.suite-progress span');
    if(progressStrong)progressStrong.textContent=`${pct}%`;
    if(progressBar)progressBar.style.width=`${pct}%`;

    const learningBadge=$('.suite-panel-head .suite-badge');
    if(learningBadge)learningBadge.textContent=`${completed}/${total}`;
  }

  function closeDrawer(){
    $('#sidebar')?.classList.remove('open');
    document.body.classList.remove('nav-drawer-open','sidebar-collapsed');
    $('#mobileMenu')?.setAttribute('aria-expanded','false');
  }

  // Own the hamburger interaction in capture phase so an older duplicate listener
  // cannot toggle the drawer twice.
  document.addEventListener('click',e=>{
    const menu=e.target.closest?.('#mobileMenu');
    if(!menu)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const sidebar=$('#sidebar');
    if(!sidebar)return;
    const open=sidebar.classList.toggle('open');
    menu.setAttribute('aria-expanded',String(open));
    menu.setAttribute('aria-label',open?'Menü schließen':'Menü öffnen');
  },true);

  // The brand/logo is a home control: clicking either the red cross or the RD INTRANET
  // text returns to the training dashboard, not merely the current view.
  document.addEventListener('click',e=>{
    const brand=e.target.closest?.('.brand');
    if(!brand)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const dashboard=$('[data-view="dashboard"]');
    closeDrawer();
    dashboard?.click();
  },true);

  const brand=$('.brand');
  if(brand){
    brand.setAttribute('role','button');
    brand.setAttribute('tabindex','0');
    brand.setAttribute('aria-label','Zur Startseite');
    brand.style.cursor='pointer';
    brand.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){e.preventDefault();brand.click();}
    });
  }

  // The statistics page is not itself a learning module. The dashboard therefore
  // reports completion across the nine actual learning modules instead of producing
  // a misleading 90% ceiling when all learning content is complete.
  const scheduleProgress=()=>{
    refreshDashboardProgress();
    setTimeout(refreshDashboardProgress,50);
    setTimeout(refreshDashboardProgress,250);
  };
  document.addEventListener('click',e=>{
    if(e.target.closest?.('[data-view="dashboard"],[data-suite-route]'))scheduleProgress();
  },false);
  window.addEventListener('load',scheduleProgress);
  scheduleProgress();
})();
