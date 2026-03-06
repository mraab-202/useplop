// =============================================
// PLOP — Landing Page Interactivity
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  // Scroll animations
  initScrollAnimations();

  // Form handling
  initForms();
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

// ----- Form Handling -----
function initForms() {
  const forms = document.querySelectorAll('#hero-form, #cta-form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const email = input.value.trim();

      if (!email) return;

      // Replace form with success message
      const successEl = document.createElement('div');
      successEl.className = 'form-success show';
      successEl.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
        You're on the list! We'll be in touch.
      `;

      form.style.display = 'none';
      form.parentNode.insertBefore(successEl, form.nextSibling);

      // Also hide the note below the form
      const note = form.nextElementSibling?.nextElementSibling;
      if (note && (note.classList.contains('hero-note') || note.classList.contains('cta-note'))) {
        note.style.display = 'none';
      }

      // TODO: Send email to your backend
      // fetch('/api/subscribe', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });

      console.log('Subscription email:', email);
    });
  });
}
