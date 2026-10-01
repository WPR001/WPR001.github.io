/* Progressive enhancements: filtering and figure previews have native fallbacks. */
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

  const dialog = document.querySelector('.figure-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const figureImage = document.getElementById('figure-dialog-image');
  const figureTitle = document.getElementById('figure-dialog-title');
  const figureCaption = document.getElementById('figure-dialog-caption');
  const figureSource = document.getElementById('figure-dialog-source');
  const figureOriginal = document.getElementById('figure-dialog-original');
  let opener = null;

  document.querySelectorAll('.figure-preview').forEach((link) => {
    link.addEventListener('click', (event) => {
      // Preserve the browser's new-tab and download shortcuts.
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      opener = link;
      figureTitle.textContent = link.dataset.title;
      figureCaption.textContent = `${link.dataset.caption}. ${link.dataset.sourceNote}.`;
      figureImage.src = link.href;
      figureImage.alt = link.querySelector('img').alt;
      figureSource.href = link.dataset.source;
      figureOriginal.href = link.href;
      dialog.showModal();
      document.body.classList.add('figure-is-open');
    });
  });

  dialog.querySelector('.figure-dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right ||
        event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('figure-is-open');
    if (opener) opener.focus({ preventScroll: true });
  });
})();
