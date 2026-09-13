(()=>{
  // UI fixes are intentionally limited to presentation/state refreshes.
  // Navigation, brand/home routing and the mobile drawer are owned by navigation-controller.js.
  const STORE='rd-suite-progress-v2';
  const LEARNING_IDS=['abcde','dokumentation','medlernen','gefahren','psychiatrie','pruefung','wissensdatenbank'];
  const $=s=>document.querySelector(s);

  function readProgress(){
    try{return JSON.parse(localStorage.getItem(STORE)||'{}')||{}}
    catch{return{}}
  }

  function refreshDashboardProgress(){
    const root=$('.learn-hero');
    if(!root)return;
    const state=readProgress();
    const completed=state.completed&&typeof state.completed==='object'?state.completed:{};
    const done=LEARNING_IDS.filter(id=>completed[id]).length;
    const total=LEARNING_IDS.length;
    const pct=Math.round(done*100/total);

    // Keep both dashboard representations in sync with the canonical learning state.
    root.querySelector('.learn-progress-meta strong')?.replaceChildren(document.createTextNode(`${pct}%`));
    root.querySelector('.suite-progress span')?.style.setProperty('width',`${pct}%`);
    root.querySelector('.learn-hero-progress small')?.replaceChildren(document.createTextNode(`${done} von ${total} Lernmodulen abgeschlossen`));

    const firstStat=$('.learn-stats .suite-stat strong');
    if(firstStat)firstStat.textContent=`${done}/${total}`;
  }

  function enforceHomeLabel(){
    const home=$('[data-view="dashboard"] .nav-label');
    if(home)home.textContent='Startseite';
    const crumb=$('#breadcrumbCurrent');
    if(crumb&&$('[data-view="dashboard"]')?.classList.contains('active'))crumb.textContent='Startseite';
  }

  const refresh=()=>{
    enforceHomeLabel();
    refreshDashboardProgress();
    setTimeout(enforceHomeLabel,50);
    setTimeout(refreshDashboardProgress,50);
    setTimeout(refreshDashboardProgress,250);
  };

  document.addEventListener('click',e=>{
    if(e.target.closest?.('[data-view="dashboard"],[data-suite-route="dashboard"]'))refresh();
  });
  window.addEventListener('load',refresh);
  refresh();
})();
