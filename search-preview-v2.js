(() => {
  const icons = ['♥','🫁','🧠','✚','⚠','✦'];
  const escapeHtml = (value = '') => String(value).replace(/[&<>\"']/g, ch => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#039;'
  }[ch]));

  const getData = () => {
    try {
      return (typeof RD_DATA !== 'undefined' && RD_DATA && Array.isArray(RD_DATA.common)) ? RD_DATA : null;
    } catch (_) {
      return null;
    }
  };

  const getResults = query => {
    const data = getData();
    if (!data) return [];
    const term = String(query || '').trim().toLowerCase();
    if (!term) return data.common.slice(0, 6);
    return data.common
      .filter(item => [item.title, item.cat, item.desc]
        .some(value => String(value || '').toLowerCase().includes(term)))
      .slice(0, 7);
  };

  const ensurePreview = input => {
    if (!input || !input.parentElement) return null;
    let box = input.parentElement.querySelector('.live-search-preview-v2');
    if (!box) {
      box = document.createElement('div');
      box.className = 'live-search-preview-v2 hidden';
      input.parentElement.style.position = 'relative';
      input.parentElement.appendChild(box);
    }
    return box;
  };

  const hidePreview = input => {
    const box = input && ensurePreview(input);
    if (box) box.classList.add('hidden');
  };

  const renderPreview = input => {
    const box = ensurePreview(input);
    if (!box) return;
    const query = input.value.trim();
    const results = getResults(query);

    if (!query) {
      box.classList.add('hidden');
      box.innerHTML = '';
      return;
    }

    if (!results.length) {
      box.innerHTML = '<div class="live-empty-v2">Keine direkten Treffer gefunden.</div>';
      box.classList.remove('hidden');
      return;
    }

    box.innerHTML = results.map((item, index) => `
      <button type="button" class="live-result-v2" data-live-guide-v2="${escapeHtml(item.id)}">
        <span class="live-icon-v2">${icons[index % icons.length]}</span>
        <span class="live-copy-v2">
          <strong>${escapeHtml(item.title)}</strong>
          <small>${escapeHtml(item.cat)} · ${escapeHtml(item.desc)}</small>
        </span>
        <span class="badge ${item.priority === 'Kritisch' ? 'red' : ''}">${escapeHtml(item.priority)}</span>
      </button>
    `).join('');
    box.classList.remove('hidden');
  };

  const openGuideResult = (id, input) => {
    hidePreview(input);
    try {
      if (typeof openGuide === 'function') {
        openGuide(id);
        return;
      }
    } catch (_) {}
    const target = document.querySelector(`[data-guide="${CSS.escape(id)}"]`);
    if (target) target.click();
  };

  const wire = input => {
    if (!input || input.dataset.livePreviewV2 === '1') return;
    input.dataset.livePreviewV2 = '1';
    input.addEventListener('input', () => renderPreview(input));
    input.addEventListener('focus', () => {
      if (input.value.trim()) renderPreview(input);
    });
    input.addEventListener('keydown', event => {
      if (event.key === 'Escape') hidePreview(input);
      if (event.key === 'Enter') hidePreview(input);
    });
  };

  const wireAll = () => {
    document.querySelectorAll('#globalSearch, #abfrageSearch').forEach(wire);
  };

  document.addEventListener('DOMContentLoaded', wireAll);
  wireAll();
  new MutationObserver(wireAll).observe(document.body, { childList: true, subtree: true });

  document.addEventListener('click', event => {
    const result = event.target.closest('[data-live-guide-v2]');
    if (result) {
      const input = result.closest('.search')?.querySelector('input');
      openGuideResult(result.dataset.liveGuideV2, input);
      return;
    }

    document.querySelectorAll('.live-search-preview-v2').forEach(box => {
      const input = box.parentElement?.querySelector('input');
      if (event.target !== input && !box.contains(event.target)) box.classList.add('hidden');
    });
  });
})();
