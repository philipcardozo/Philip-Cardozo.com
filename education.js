/* ─── Scroll Reveal ──────────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.children].filter(
          el => el.classList.contains('reveal')
        );
        const idx   = siblings.indexOf(entry.target);
        const delay = Math.min(idx * 60, 300);
        setTimeout(() => entry.target.classList.add('visible'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.07, rootMargin: '0px 0px -24px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ─── Domain Matrix Bar Animation ───────────────────────────────────────
   Bars start at width:0 via CSS, then animate to final widths on reveal   */
const dmBars = document.querySelectorAll('.dm-bar');
// Store target widths and reset to 0 initially
dmBars.forEach(bar => {
  // Support data-w attribute (e.g. data-w="85%") as well as inline style.width
  const target = bar.dataset.w || bar.style.width || '0%';
  bar.dataset.targetWidth = target;
  bar.style.width = '0%';
  bar.style.transition = 'none';
});

const matrixObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Stagger each bar's animation
        dmBars.forEach((bar, i) => {
          setTimeout(() => {
            bar.style.transition = 'width 1s cubic-bezier(0.4, 0, 0.2, 1)';
            bar.style.width = bar.dataset.targetWidth;
          }, i * 30);
        });
        matrixObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

const matrix = document.querySelector('.domain-matrix');
if (matrix) matrixObserver.observe(matrix);

/* ─── Navbar ─────────────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

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
