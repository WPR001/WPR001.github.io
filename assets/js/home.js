/* The full publication list stays available when JavaScript is disabled. */
(() => {
  const filters = document.querySelector('.publication-filters');
  const publications = Array.from(document.querySelectorAll('.publication'));
  const status = document.getElementById('publication-status');
  if (!filters || !publications.length || !status) return;
  filters.hidden = false;
  filters.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-filter]');
    if (!button || !filters.contains(button)) return;
    const category = button.dataset.filter;
    let visibleCount = 0;
    publications.forEach((publication) => {
      publication.hidden = category !== 'all' && publication.dataset.category !== category;
      if (!publication.hidden) visibleCount += 1;
    });
    filters.querySelectorAll('button').forEach((filter) => {
      filter.setAttribute('aria-pressed', String(filter === button));
    });
    status.textContent = `${visibleCount} publications shown: ${category === 'all' ? 'all publications' : category === 'conference' ? 'conference papers' : 'preprints'}.`;
  });
})();
