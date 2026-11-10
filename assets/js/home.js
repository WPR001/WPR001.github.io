/* Progressive enhancements. Every feature has a native fallback, and each block is independent. */
document.documentElement.classList.add('js');

/* Publication filters */
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
      if (!publication.hidden) {
        visibleCount += 1;
        publication.classList.add('is-visible');
      }
    });
    filters.querySelectorAll('button').forEach((filter) => {
      filter.setAttribute('aria-pressed', String(filter === button));
    });
    status.textContent = `${visibleCount} publications shown: ${category === 'all' ? 'all publications' : category === 'conference' ? 'conference papers' : 'preprints'}.`;
  });
})();

/* Figure dialog */
(() => {
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

/* Demo videos: a large play button over the poster; only one video plays at a time. */
(() => {
  const frames = Array.from(document.querySelectorAll('.demo-frame'));
  const videos = frames.map((frame) => frame.querySelector('video'));
  frames.forEach((frame) => {
    const video = frame.querySelector('video');
    const button = frame.querySelector('.demo-play');
    if (!video || !button) return;
    video.controls = false;
    button.hidden = false;
    button.addEventListener('click', () => {
      button.hidden = true;
      video.controls = true;
      const started = video.play();
      if (started && typeof started.catch === 'function') started.catch(() => {});
      video.focus({ preventScroll: true });
    });
    video.addEventListener('play', () => {
      button.hidden = true;
      video.controls = true;
      videos.forEach((other) => { if (other && other !== video) other.pause(); });
    });
  });
})();

/* Theme toggle: the saved choice wins over the system setting. */
(() => {
  const toggle = document.querySelector('.theme-toggle');
  if (!toggle) return;
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (error) {}
  });
})();

/* Sidebar navigation: mark the section in view. */
(() => {
  const links = Array.from(document.querySelectorAll('.section-nav a[href^="#"]'));
  if (!links.length) return;
  const sections = links.map((link) => document.getElementById(link.getAttribute('href').slice(1)));
  let ticking = false;
  const update = () => {
    ticking = false;
    const line = window.scrollY + window.innerHeight * 0.3;
    let current = 0;
    sections.forEach((section, index) => {
      if (section && section.getBoundingClientRect().top + window.scrollY <= line) current = index;
    });
    // At the bottom of the page the last section may be too short to reach the line.
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = links.length - 1;
    links.forEach((link, index) => link.classList.toggle('is-active', index === current));
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

/* Scroll reveal */
(() => {
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const targets = document.querySelectorAll('.about > *:not(.section-title), .news-list, .demo, .publication, .timeline-item, .contact');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  targets.forEach((target) => {
    target.classList.add('reveal');
    observer.observe(target);
  });
})();
