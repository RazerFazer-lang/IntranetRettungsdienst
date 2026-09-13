(() => {
  const icons = ['♥','🫁','🧠','✚','⚠','✦'];
  const esc = (s='') => String(s).replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));

  function getData(){
    try { return RD_DATA; } catch(e) { return null; }
  }

  function getResults(query='') {
    const data = getData();
    if (!data || !Array.isArray(data.common)) return [];
    const q = query.trim().toLowerCase();
    if (!q) return data.common.slice(0, 6);
    return data.common.filter(x => [x.title,x.cat,x.desc].some(v => String(v).toLowerCase().includes(q))).slice(0, 7);
  }

  function ensurePreview(input) {
    let box = input.parentElement?.querySelector('.live-search-preview');
    if (!box) {
      box = document.createElement('div');
      box.className = 'live-search-preview hidden';
      input.parentElement.style.position = 'relative';
      input.parentElement.appendChild(box);
    }
    return box;
  }

  function renderPreview(input, showEmpty=false) {
    const box = ensurePreview(input);
    const q = input.value.trim();
    const results = getResults(q);
    if (!q && !showEmpty) { box.classList.add('hidden'); box.innerHTML=''; return; }
    if (!results.length) {
      box.innerHTML='<div class="live-empty">Keine direkten Treffer gefunden.</div>';
      box.classList.remove('hidden');
      return;
    }
    box.innerHTML = `${!q ? '<div class="live-preview-title">Schnelltreffer</div>' : ''}` + results.map((x,i)=>`<button type="button" class="live-result" data-live-guide="${esc(x.id)}"><span class="live-icon">${icons[i%icons.length]}</span><span class="live-copy"><strong>${esc(x.title)}</strong><small>${esc(x.cat)} · ${esc(x.desc)}</small></span><span class="badge ${x.priority==='Kritisch'?'red':''}">${esc(x.priority)}</span></button>`).join('');
    box.classList.remove('hidden');
  }

  function wireInput(input) {
    if (!input || input.dataset.liveSearchWired==='1') return;
    input.dataset.liveSearchWired='1';
    input.addEventListener('input',()=>renderPreview(input,true));
    input.addEventListener('focus',()=>renderPreview(input,true));
    input.addEventListener('keydown',e=>{
      if(e.key==='Escape') renderPreview(input,false);
      if(e.key==='Enter') {
        const button=document.getElementById('searchBtn');
        if(input.id==='globalSearch' && button) button.click();
      }
    });
  }

  function wireAll(){
    document.querySelectorAll('#globalSearch,#abfrageSearch').forEach(wireInput);
  }

  document.addEventListener('DOMContentLoaded',wireAll);
  wireAll();
  new MutationObserver(wireAll).observe(document.body,{childList:true,subtree:true});

  document.addEventListener('click',e=>{
    const hit=e.target.closest('[data-live-guide]');
    if(hit){
      const id=hit.dataset.liveGuide;
      if(typeof openGuide==='function') openGuide(id);
      hit.closest('.live-search-preview')?.classList.add('hidden');
      return;
    }
    document.querySelectorAll('.live-search-preview').forEach(box=>{
      const input=box.parentElement?.querySelector('input');
      if(e.target!==input&&!box.contains(e.target)) box.classList.add('hidden');
    });
  });
})();
