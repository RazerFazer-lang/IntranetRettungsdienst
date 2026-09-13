(()=>{
  const VIEW='lagebilder';
  const nav=()=>document.querySelector('.nav');
  const app=()=>document.getElementById('app');
  const breadcrumb=()=>document.getElementById('breadcrumbCurrent');

  function addButton(){
    const n=nav();
    if(!n || n.querySelector(`[data-view="${VIEW}"]`)) return;
    const b=document.createElement('button');
    b.className='nav-item';
    b.dataset.view=VIEW;
    b.innerHTML='<span>🖼️</span> Lagebilder / Einsatzlagen';
    const notfall=n.querySelector('[data-view="notfallbilder"]');
    if(notfall) notfall.insertAdjacentElement('afterend',b); else n.appendChild(b);
  }

  function removeScenePanel(){ document.getElementById('einsatzlagenSection')?.remove(); }

  function showLagebilder(){
    const host=app();
    if(!host || typeof renderEinsatzlagen!=='function') return;
    host.innerHTML='<div class="view-title"><div><span class="eyebrow red">LAGEBILDER</span><h1>Realistische Einsatzlagen</h1><p>Eigenständiger Bereich für realistische Einsatzorte und Lageszenarien.</p></div></div><section id="einsatzlagenSection" class="panel einsatzlagen-panel"></section>';
    if(breadcrumb()) breadcrumb().textContent='Lagebilder / Einsatzlagen';
    document.querySelectorAll('.nav-item').forEach(x=>x.classList.toggle('active',x.dataset.view===VIEW));
    renderEinsatzlagen();
  }

  addButton();
  setTimeout(addButton,250);
  setTimeout(addButton,800);

  // Only own the dedicated Lagebilder button. Other navigation is handled by
  // navigation-ui-fix.js / the legacy app, so it cannot get blocked here.
  document.addEventListener('click',e=>{
    const b=e.target.closest?.(`.nav-item[data-view="${VIEW}"]`);
    if(!b)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    showLagebilder();
  },true);

  document.addEventListener('click',e=>{
    const b=e.target.closest?.('.nav-item');
    if(!b || b.dataset.view===VIEW)return;
    setTimeout(removeScenePanel,0);
  });

  const observer=new MutationObserver(()=>{
    const active=document.querySelector('.nav-item.active')?.dataset.view;
    if(active!==VIEW) removeScenePanel();
  });
  observer.observe(document.getElementById('app')||document.body,{childList:true,subtree:true});
})();
