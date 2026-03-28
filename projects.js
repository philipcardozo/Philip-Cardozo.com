/* ─── Filter System ──────────────────────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const featCards  = document.querySelectorAll('.feat-card');
const projCards  = document.querySelectorAll('.proj-full-card');
const allCards   = [...featCards, ...projCards];

// Compute counts per category
const categories = ['quant', 'ml', 'research', 'systems'];
categories.forEach(cat => {
  const el = document.getElementById(`count-${cat}`);
  if (!el) return;
  const count = allCards.filter(c => (c.dataset.category || '').includes(cat)).length;
  el.textContent = count;
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    allCards.forEach(card => {
      const cats = card.dataset.category || '';
      const show = filter === 'all' || cats.includes(filter);
      card.classList.toggle('hidden', !show);
    });

    // Update active count badge
    const activeEl = document.getElementById(`count-all`);
    if (filter === 'all' && activeEl) activeEl.textContent = allCards.length;
  });
});

/* ─── Scroll Reveal ──────────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.children].filter(
          el => el.classList.contains('reveal')
        );
        const idx   = siblings.indexOf(entry.target);
        const delay = Math.min(idx * 70, 280);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
);

[...featCards, ...projCards].forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

/* ─── Navbar scroll effect (reuse from main) ─────────────────────────── */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* ─── Mobile nav toggle ──────────────────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}
