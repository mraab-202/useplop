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

// ── Board finder (hero): find / claim your center's board ──────────────────
(function () {
  var q = document.getElementById('finder-q'), box = document.getElementById('finder-results');
  if (!q || !box) return;
  var API = 'https://app.useplop.com/api/boards';
  var t = null, last = '';
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function emptyState(term) {
    return '<div class="finder-empty">No board for &ldquo;' + esc(term) + '&rdquo; yet. <a href="https://app.useplop.com">Create your board &rarr;</a> &mdash; it takes about two minutes and arrives stocked with current opportunities.</div>';
  }
  function render(boards, term) {
    if (!term) { box.hidden = true; box.innerHTML = ''; return; }
    if (!boards.length) { box.innerHTML = emptyState(term); box.hidden = false; return; }
    box.innerHTML = boards.map(function (b, i) {
      var action = b.claimable
        ? '<button type="button" class="primary" data-claim="' + i + '">Claim admin access</button>'
        : '<span class="muted">Has an admin team</span><a href="https://app.useplop.com/login">Sign in</a>';
      return '<div class="finder-wrap" data-i="' + i + '"><div class="finder-row">' +
        '<i class="finder-swatch" style="background:' + esc(b.primary_color || '#1A1A2E') + '"></i>' +
        '<b>' + esc(b.name) + '</b>' +
        '<span class="finder-actions"><a href="' + esc(b.url) + '" target="_blank" rel="noopener">Open board</a>' + action + '</span>' +
        '</div></div>';
    }).join('');
    box.hidden = false;
    box.querySelectorAll('button[data-claim]').forEach(function (btn) {
      btn.addEventListener('click', function () { openClaim(boards[+btn.getAttribute('data-claim')], btn.closest('.finder-wrap')); });
    });
  }
  function openClaim(b, wrap) {
    var existing = wrap.querySelector('.finder-claim'); if (existing) { existing.querySelector('input').focus(); return; }
    var el = document.createElement('div'); el.className = 'finder-claim';
    el.innerHTML = '<div class="hd">Claim admin access to ' + esc(b.name) + '</div>' +
      '<div class="grid"><input type="email" placeholder="you@university.edu" autocomplete="email">' +
      '<input type="text" placeholder="Your title (e.g. Director)" maxlength="120"><button type="button">Send my invite</button></div>' +
      '<div class="fine">Use your university email &mdash; we verify it matches ' + esc(b.name) + '. You&rsquo;ll get an invite to set your password.</div><div class="msg"></div>';
    wrap.appendChild(el);
    var inputs = el.querySelectorAll('input'), email = inputs[0], title = inputs[1], btn = el.querySelector('button'), msg = el.querySelector('.msg');
    email.focus();
    function submit() {
      msg.className = 'msg'; msg.textContent = '';
      if (!email.value.trim() || !title.value.trim()) { msg.className = 'msg err'; msg.textContent = 'Email and title are both needed.'; return; }
      btn.disabled = true; btn.textContent = 'Sending…';
      fetch(API + '/' + encodeURIComponent(b.slug) + '/claim', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.value.trim(), title: title.value.trim() })
      }).then(function (r) { return r.json().then(function (d) { return { ok: r.ok, d: d }; }); }).then(function (res) {
        if (res.ok && res.d.status === 'invited') { msg.className = 'msg ok'; msg.textContent = '✓ Invite sent to ' + email.value.trim() + ' — open it to set your password and you’re in.'; btn.textContent = 'Sent'; return; }
        if (res.ok && res.d.status === 'pending') { msg.className = 'msg ok'; msg.textContent = '✓ Request received — we’ll confirm and send your invite shortly.'; btn.textContent = 'Requested'; return; }
        msg.className = 'msg err'; msg.textContent = (res.d && res.d.error) || 'Something went wrong — email mike@useplop.com.'; btn.disabled = false; btn.textContent = 'Send my invite';
      }).catch(function () { msg.className = 'msg err'; msg.textContent = 'Network error — try again or email mike@useplop.com.'; btn.disabled = false; btn.textContent = 'Send my invite'; });
    }
    btn.addEventListener('click', submit);
    [email, title].forEach(function (i) { i.addEventListener('keydown', function (e) { if (e.key === 'Enter') submit(); }); });
  }
  q.addEventListener('input', function () {
    clearTimeout(t);
    var term = q.value.trim();
    if (term.length < 2) { render([], ''); return; }
    t = setTimeout(function () {
      last = term;
      fetch(API + '/search?q=' + encodeURIComponent(term)).then(function (r) { return r.json(); }).then(function (d) {
        if (term !== last) return;
        render(d.boards || [], term);
      }).catch(function () { render([], term); });
    }, 180);
  });
})();
