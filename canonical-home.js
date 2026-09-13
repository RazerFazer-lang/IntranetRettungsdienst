(()=>{
  // Single source of truth for the learning-center Startseite.
  // This handler intentionally bypasses app.js's legacy click delegation.
  const $=s=>document.querySelector(s);
  const closeDrawer=()=>{
    $('#sidebar')?.classList.remove('open');
    document.body.classList.remove('nav-drawer-open','sidebar-collapsed');
  };
  const activateHome=()=>{
    document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.view==='dashboard'));
    const crumb=$('#breadcrumbCurrent');
    if(crumb)crumb.textContent='Startseite';
    closeDrawer();
  };
  const renderLearningHome=()=>{
    activateHome();
    if(typeof window.render==='function')window.render();
    // A final invariant: the canonical home must be the learning-center view.
    requestAnimationFrame(()=>{
      if(!$('.learn-hero')){
        activateHome();
        if(typeof window.render==='function')window.render();
      }
    });
  };
  window.__rdCanonicalHome=renderLearningHome;

  document.addEventListener('click',e=>{
    const target=e.target?.closest?.('.brand,[data-view="dashboard"],[data-suite-route="dashboard"]');
    if(!target)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    renderLearningHome();
  },true);

  // Keep the initial state canonical after all application scripts are ready.
  setTimeout(()=>{
    if($('.learn-hero')){
      activateHome();
    }else if(typeof window.render==='function'){
      renderLearningHome();
    }
  },0);
})();
