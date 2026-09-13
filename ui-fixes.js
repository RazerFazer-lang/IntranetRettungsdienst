(()=>{
  const STORE='rd-suite-progress-v2';
  const LEARNING_IDS=['abcde','dokumentation','medlernen','gefahren','psychiatrie','pruefung','wissensdatenbank'];
  const $=s=>document.querySelector(s);
  function readProgress(){try{return JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch{return{}}}
  function refreshDashboardProgress(){
    const hero=$('.suite-hero');
    if(!hero)return;
    const state=readProgress();
    const completed=state.completed&&typeof state.completed==='object'?state.completed:{};
    const done=LEARNING_IDS.filter(id=>completed[id]).length;
    const total=LEARNING_IDS.length;
    const pct=Math.round((done/total)*100);
    const progressStrong=$('.suite-stat strong');
    const progressBar=$('.suite-progress span');
    if(progressStrong)progressStrong.textContent=`${pct}%`;
    if(progressBar)progressBar.style.width=`${pct}%`;
    const learningBadge=$('.suite-panel-head .suite-badge');
    if(learningBadge)learningBadge.textContent=`${done}/${total}`;
  }
  function enforceHomeLabel(){
    const home=$('[data-view="dashboard"] .nav-label');
    if(home)home.textContent='Startseite';
    const crumb=$('#breadcrumbCurrent');
    if(crumb&&($('[data-view="dashboard"]')?.classList.contains('active')))crumb.textContent='Startseite';
  }
  function closeDrawer(){
    $('#sidebar')?.classList.remove('open');
    document.body.classList.remove('nav-drawer-open','sidebar-collapsed');
    $('#mobileMenu')?.setAttribute('aria-expanded','false');
  }
  document.addEventListener('click',e=>{
    const menu=e.target.closest?.('#mobileMenu');
    if(!menu)return;
    e.preventDefault();e.stopImmediatePropagation();
    const sidebar=$('#sidebar');
    if(!sidebar)return;
    const open=sidebar.classList.toggle('open');
    menu.setAttribute('aria-expanded',String(open));
    menu.setAttribute('aria-label',open?'Menü schließen':'Menü öffnen');
  },true);
  document.addEventListener('click',e=>{
    const brand=e.target.closest?.('.brand');
    if(!brand)return;
    e.preventDefault();e.stopImmediatePropagation();
    const dashboard=$('[data-view="dashboard"]');
    closeDrawer();
    dashboard?.click();
    setTimeout(enforceHomeLabel,0);
    setTimeout(refreshDashboardProgress,50);
  },true);
  const brand=$('.brand');
  if(brand){
    brand.setAttribute('role','button');
    brand.setAttribute('tabindex','0');
    brand.setAttribute('aria-label','Zur Startseite');
    brand.style.cursor='pointer';
    brand.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();brand.click()}});
  }
  const schedule=()=>{enforceHomeLabel();refreshDashboardProgress();setTimeout(enforceHomeLabel,50);setTimeout(refreshDashboardProgress,250)};
  document.addEventListener('click',e=>{if(e.target.closest?.('[data-view="dashboard"],[data-suite-route]'))schedule()},false);
  window.addEventListener('load',schedule);
  schedule();
})();
