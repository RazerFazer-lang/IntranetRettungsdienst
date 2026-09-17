(()=>{
  const root=document.getElementById('rdStartup');
  if(!root)return;
  document.body.classList.add('rd-startup-active');
  const bar=root.querySelector('.rd-startup-progress>span');
  const stages=[...root.querySelectorAll('.rd-startup-stage')];
  const setStage=(index,percent)=>{
    stages.forEach((el,i)=>el.classList.toggle('active',i===index));
    stages.forEach((el,i)=>el.classList.toggle('done',i<index));
    if(bar)bar.style.width=`${percent}%`;
  };
  const finish=()=>{
    setStage(3,100);
    root.setAttribute('aria-hidden','true');
    root.classList.add('is-leaving');
    document.body.classList.remove('rd-startup-active');
    window.setTimeout(()=>root.remove(),520);
  };
  const init=async()=>{
    setStage(0,26);
    await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
    setStage(1,54);
    if(window.RD_DATA&&window.RD_MEDS){};
    await new Promise(r=>setTimeout(r,70));
    setStage(2,78);
    try{
      if('serviceWorker' in navigator){
        await Promise.race([
          navigator.serviceWorker.ready,
          new Promise(r=>setTimeout(r,700))
        ]);
      }
    }catch{}
    await new Promise(r=>setTimeout(r,80));
    finish();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
