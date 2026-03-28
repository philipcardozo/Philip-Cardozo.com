/* ─── Navbar scroll effect ──────────────────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ─── Mobile nav toggle ─────────────────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close menu when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─── Scroll reveal ─────────────────────────────────────────────────── */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings slightly
        const siblings = entry.target.parentElement
          ? [...entry.target.parentElement.children].filter(el => el.classList.contains('reveal'))
          : [];
        const idx = siblings.indexOf(entry.target);
        const delay = Math.min(idx * 80, 320);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

// Apply reveal class and observe
const revealTargets = [
  '.exp-card',
  '.proj-card',
  '.tl-card',
  '.add-card',
  '.stat',
];

revealTargets.forEach(selector => {
  document.querySelectorAll(selector).forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });
});

/* ─── Stats counter animation ───────────────────────────────────────── */
function animateValue(el, start, end, suffix, duration) {
  const startTime = performance.now();
  const isFloat   = String(end).includes('.');
  const decimals  = isFloat ? String(end).split('.')[1].length : 0;

  function step(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value    = start + (end - start) * eased;
    el.textContent = value.toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const numEl = entry.target.querySelector('.stat-number');
      if (!numEl) return;

      const raw = numEl.dataset.value;
      if (!raw) return;

      const end    = parseFloat(raw);
      const suffix = numEl.dataset.suffix || '';
      animateValue(numEl, 0, end, suffix, 1400);
      statsObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.5 }
);

// Prep stat numbers for animation
const statData = [
  { value: '1.38',  suffix: '' },
  { value: '68',    suffix: 'K+' },
  { value: '20',    suffix: 'M+' },
  { value: '843',   suffix: '' },
  { value: '217',   suffix: '' },
  { value: '3.6',   suffix: '' },
];

document.querySelectorAll('.stat').forEach((el, i) => {
  const numEl = el.querySelector('.stat-number');
  if (!numEl || !statData[i]) return;
  numEl.dataset.value  = statData[i].value;
  numEl.dataset.suffix = statData[i].suffix;
  // Store the small tag if present
  const small = numEl.querySelector('small');
  numEl._small = small ? small.outerHTML : '';
  // Set initial text
  numEl.textContent = '0';
  // Re-append small tag after animation via custom end handler
  statsObserver.observe(el);
});

// Patch: restore small tags and suffixes after counter finishes
// Re-run a version that appends small back
document.querySelectorAll('.stat').forEach((el, i) => {
  const numEl = el.querySelector('.stat-number');
  if (!numEl || !statData[i]) return;

  const origObserverCallback = (entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const ne = entry.target.querySelector('.stat-number');
      if (!ne) return;

      const end    = parseFloat(ne.dataset.value);
      const suffix = ne.dataset.suffix || '';
      const small  = ne._small || '';

      const startTime = performance.now();
      const isFloat   = String(end).includes('.');
      const decimals  = isFloat ? String(end).split('.')[1].length : 0;

      function step(now) {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / 1400, 1);
        const eased    = 1 - Math.pow(1 - progress, 3);
        const value    = (end * eased).toFixed(decimals);
        ne.innerHTML   = value + suffix + (progress >= 1 && small ? small : '');
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  };

  const obs = new IntersectionObserver(origObserverCallback, { threshold: 0.5 });
  obs.observe(el);
});

/* ─── Active nav link on scroll ─────────────────────────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${entry.target.id}`
            ? 'var(--white)'
            : '';
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));
