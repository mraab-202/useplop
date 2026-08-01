// =============================================
// PLOP — Landing Page
// =============================================

// Mobile nav toggle
(function () {
  const nav = document.querySelector('.nav');
  const btn = document.querySelector('.nav-menu-btn');
  if (!nav || !btn) return;

  function setOpen(open) {
    nav.classList.toggle('menu-open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  btn.addEventListener('click', function () {
    setOpen(!nav.classList.contains('menu-open'));
  });

  // Close after choosing a destination
  document.querySelectorAll('.nav-mobile-link').forEach(function (link) {
    link.addEventListener('click', function () { setOpen(false); });
  });

  // Close on Escape or when tapping outside the header
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
  document.addEventListener('click', function (e) {
    if (nav.classList.contains('menu-open') && !nav.contains(e.target)) setOpen(false);
  });
})();
