(() => {
  const esc = (s='') => String(s).replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'}[c]));
  const ensureBox = input => {
    let box = input.parentElement?.querySelector('.live-search-preview');
    if (!box) {
      box = document.createElement('div');
      box.className = 'live-search-preview hidden';
      input.parentElement.style.position = 'relative';
      input.parentElement.appendChild(box);
    }
    return box;
  };
  const search = (input) => {
    if (!window.RD_DATA || !input) return;
    const q = input.value.trim().toLowerCase();
    const box = ensureBox(input);
    if (q.length < 1) { box.classList.add('hidden'); box.innerHTML=''; return; }
    const results = RD_DATA.common.filter(x => [x.title,x.cat,x.desc].some(v => String(v).toLowerCase().includes(q))).slice(0,6);
    if (!results.length) {
      box.innerHTML = '<div class="live-empty">Keine direkten Treffer gefunden.</div>';
    } else {
      box.innerHTML = results.map((x,i) => `<button type="button" class="live-result" data-live-guide="${esc(x.id)}"><span class="live-icon">${['♥','🫁','🧠','✚','⚠','✦'][i%6]}</span><span class="live-copy"><strong>${esc(x.title)}</strong><small>${esc(x.cat)} · ${esc(x.desc)}</small></span><span class="badge ${x.priority==='Kritisch'?'red':''}">${esc(x.priority)}</span></button>`).join('');
    }
    box.classList.remove('hidden');
  };
  document.addEventListener('input', e => {
    if (e.target.matches('#globalSearch, #abfrageSearch')) search(e.target);
  });
  document.addEventListener('click', e => {
    const hit = e.target.closest('[data-live-guide]');
    if (hit) {
      const id = hit.dataset.liveGuide;
      if (typeof window.openGuide === 'function') window.openGuide(id);
      else document.querySelector(`[data-guide="${CSS.escape(id)}"]`)?.click();
      hit.closest('.live-search-preview')?.classList.add('hidden');
      return;
    }
    document.querySelectorAll('.live-search-preview').forEach(box => { if (!box.contains(e.target) && !box.parentElement.contains(e.target)) box.classList.add('hidden'); });
  });
})();
