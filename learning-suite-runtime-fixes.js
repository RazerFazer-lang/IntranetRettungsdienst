(()=>{
  const STORE='rd-suite-progress-v2';
  const safeState=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'{}')}catch{return {}}};
  const save=s=>localStorage.setItem(STORE,JSON.stringify({...s,updatedAt:Date.now()}));
  document.addEventListener('click',e=>{
    const btn=e.target.closest?.('[data-action="hazard-check"]');
    if(!btn)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const s=safeState();
    const selected=document.querySelector('input[name="hazard-answer"]:checked');
    const fb=document.getElementById('hazardFeedback');
    if(!selected){if(fb)fb.innerHTML='<div class="suite-note suite-danger">Bitte eine Antwort auswählen.</div>';return;}
    const correct=Number(selected.value)===0;
    s.hazardAnswered=Math.min(6,Number(s.hazardAnswered||0)+1);
    s.hazardCorrect=Number(s.hazardCorrect||0)+(correct?1:0);
    if(fb)fb.innerHTML=correct?'<div class="suite-note">✅ Richtige Schwerpunktsetzung.</div>':'<div class="suite-note suite-danger">❌ Trainingshinweis: Eigenschutz, Gefahrenbereich und Unterstützung zuerst berücksichtigen.</div>';
    if(s.hazardAnswered>=6){s.completed=Object.assign({},s.completed,{gefahren:s.hazardCorrect>=4});s.hazardIndex=0}else{s.hazardIndex=(Number(s.hazardIndex||0)+1)%6}
    save(s);
    setTimeout(()=>window.render?.(),20);
  },true);
})();
