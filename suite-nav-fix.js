(()=>{
const suiteViews=['dashboard','abcde','dokumentation','medlernen','gefahren','psychiatrie','ausbildung','pruefung','wissensdatenbank','suche','statistik'];
function install(){document.querySelectorAll('.nav-item').forEach(b=>{const v=b.dataset.view;if(!suiteViews.includes(v)||b.dataset.suiteBound)return;b.dataset.suiteBound='1';b.addEventListener('click',()=>setTimeout(()=>{if(window.render){try{window.render()}catch(e){const fn={dashboard:window.__rdSuiteDashboard,abcde:window.__rdSuiteAbcde}[v];if(fn)fn()}}},0))})}
install();setTimeout(install,250);setTimeout(install,800);
})();
