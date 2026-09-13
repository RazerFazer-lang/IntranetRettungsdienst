(()=>{
  const suiteViews=['dashboard','abcde','dokumentation','medlernen','gefahren','psychiatrie','ausbildung','pruefung','wissensdatenbank','suche','statistik'];
  // The legacy global renderer does not know these training views. Never call it
  // here because it would immediately replace the training screen with Dashboard.
  document.addEventListener('click',e=>{
    const route=e.target.closest?.('[data-suite-route]');
    if(!route)return;
    const view=route.dataset.suiteRoute;
    if(!suiteViews.includes(view))return;
    const btn=document.querySelector(`.nav-item[data-view="${view}"]`);
    if(btn && btn!==route){
      e.preventDefault();
      btn.click();
    }
  });
})();
