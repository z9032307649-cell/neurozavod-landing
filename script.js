/* ============================================================
   НЕЙРОЗАВОД — Main script
   Scroll reveals + smooth scroll
   ============================================================ */

function initScrollReveals() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  const targets = document.querySelectorAll(
    '.section-title, .section-sub, .defining-block, .check-list, ' +
    '.comparison, .punch-line, .agent-card, .story, .story-act, ' +
    '.story-bridge, .quote, .guarantee-card, .declaration-headline, ' +
    '.declaration-text, .audit-list, .audit-finale, .faq-item, ' +
    '.final-cta, .footer-grid'
  );
  targets.forEach(el => {
    el.classList.add('reveal');
    obs.observe(el);
  });
}

document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const id = link.getAttribute('href');
  if (id === '#' || id.length < 2) return;
  const target = document.querySelector(id);
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.addEventListener('DOMContentLoaded', initScrollReveals);
