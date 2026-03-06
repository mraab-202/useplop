// =============================================
// PLOP — Landing Page Interactivity
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
});

// ----- Scroll Animations -----
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    '.feature-card, .step, .section-header, .showcase-browser, .cta-content'
  );

  animatedElements.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  animatedElements.forEach(el => observer.observe(el));
}

