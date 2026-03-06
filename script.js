// =============================================
// PLOP — Landing Page Interactivity
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initPricingToggle();
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

// ----- Pricing Toggle -----
function initPricingToggle() {
  const buttons = document.querySelectorAll('.toggle-btn');
  const monthly = document.getElementById('pricing-monthly');
  const yearly = document.getElementById('pricing-yearly');

  if (!buttons.length || !monthly || !yearly) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (btn.dataset.plan === 'yearly') {
        monthly.style.display = 'none';
        yearly.style.display = '';
      } else {
        monthly.style.display = '';
        yearly.style.display = 'none';
      }
    });
  });
}
