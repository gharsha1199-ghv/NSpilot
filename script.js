/* ===== Edit these to personalise the site ===== */
var REELS = [
  { title: "Dandiya nights", tag: "Edited Reel", time: "00:00:00:00", video: "my-details/edited-videos/lv_0_20261014033746.mp4", g: "linear-gradient(160deg,#3a1c2e,#16182a 70%)" },
  { title: "Edited Reel 02", tag: "Edited Reel", time: "00:00:00:00", video: "my-details/edited-videos/20261127105451_instagram_5.mp4", g: "linear-gradient(160deg,#1c2f3a,#14161f 70%)" },
  { title: "Edited Reel 03", tag: "Edited Reel", time: "00:00:00:00", video: "my-details/edited-videos/20261127105702_instagram_6.mp4", g: "linear-gradient(160deg,#3a2c1c,#17161c 70%)" },
  { title: "Edited Reel 04", tag: "Edited Reel", time: "00:00:00:00", video: "my-details/edited-videos/20261127105904_instagram_7.mp4", g: "linear-gradient(160deg,#2e1c3a,#14151f 70%)" },
  { title: "Edited Reel 05", tag: "Edited Reel", time: "00:00:00:00", video: "my-details/edited-videos/WhatsApp Video 2026-11-27 at 11.03.36 AM.mp4", g: "linear-gradient(160deg,#1c3a30,#14171c 70%)" }
];
/* ============================================== */

(function () {
  var grid = document.getElementById('reelGrid');
  var modal = document.getElementById('videoModal');
  var modalPlayer = document.getElementById('videoModalPlayer');
  var modalTitle = document.getElementById('videoModalTitle');
  var modalClose = document.getElementById('videoModalClose');

  function formatTc(secs) {
    var total = Math.max(0, Math.floor(secs || 0));
    var m = Math.floor(total / 60), s = total % 60;
    return '00:' + (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s + ':00';
  }

  function closeModal() {
    if (!modal) return;
    modalPlayer.pause();
    modalPlayer.removeAttribute('src');
    modalPlayer.load();
    if (modal.open) modal.close();
  }

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('close', closeModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
  }

  REELS.forEach(function (r) {
    var el = document.createElement(r.video ? 'button' : 'a');
    el.className = 'reel';
    if (r.video) {
      el.type = 'button';
      el.setAttribute('aria-label', 'Play ' + r.title);
    } else {
      el.href = r.url;
      el.target = '_blank';
      el.rel = 'noopener';
      el.setAttribute('aria-label', 'Watch ' + r.title + ' on Instagram');
    }
    el.style.setProperty('--g', r.g);
    el.innerHTML =
      '<span class="tc"></span>' +
      '<span class="play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4l14 8-14 8z"/></svg></span>' +
      '<span class="meta"><h3></h3><span></span></span>';
    var tcEl = el.querySelector('.tc');
    tcEl.textContent = r.time;
    el.querySelector('h3').textContent = r.title;
    el.querySelector('.meta span').textContent = r.tag;

    if (r.video) {
      var thumb = document.createElement('video');
      thumb.className = 'reel-thumb';
      thumb.src = r.video;
      thumb.muted = true;
      thumb.playsInline = true;
      thumb.preload = 'metadata';
      thumb.addEventListener('loadedmetadata', function () {
        if (isFinite(thumb.duration) && thumb.duration > 0) {
          tcEl.textContent = formatTc(thumb.duration);
        }
      });
      el.insertBefore(thumb, el.firstChild);
      el.addEventListener('mouseenter', function () {
        if (!reduced) thumb.play().catch(function () {});
      });
      el.addEventListener('mouseleave', function () {
        thumb.pause();
        thumb.currentTime = 0;
      });
      el.addEventListener('click', function () {
        thumb.pause();
        modalTitle.textContent = r.title;
        modalPlayer.src = r.video;
        modal.showModal();
        modalPlayer.play().catch(function () {});
      });
    }

    grid.appendChild(el);
  });

  /* Timeline clips (deterministic pseudo-random) */
  function rng(seed) { var s = seed * 9301 + 49297; return function () { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
  document.querySelectorAll('.track').forEach(function (t, i) {
    var rand = rng(+t.dataset.seed + 3), used = 0, kind = ['v', 'v', 'a'][i];
    while (used < 100) {
      var w = Math.min(100 - used, 6 + rand() * 18);
      var c = document.createElement('div');
      c.className = 'clip ' + kind + (rand() > 0.88 && kind === 'v' ? ' hot' : '');
      c.style.width = 'calc(' + w + '% - 4px)';
      t.appendChild(c);
      used += w;
      if (rand() > 0.8 && used < 96) { var g = document.createElement('div'); g.className = 'gap'; g.style.width = '2%'; t.appendChild(g); used += 2; }
    }
  });

  /* Playhead + timecode */
  var tracks = document.getElementById('tracks'), ph = document.getElementById('playhead'), tc = document.getElementById('tc');
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var DUR = 14000, FPS = 24;
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function set(p) {
    ph.style.left = (p * 100) + '%';
    var f = Math.floor(p * 30 * FPS);
    tc.textContent = '00:00:' + pad(Math.floor(f / FPS)) + ':' + pad(f % FPS);
  }
  if (reduced) { set(0.36); }
  else {
    var t0 = performance.now();
    (function tick(now) { set(((now - t0) % DUR) / DUR); requestAnimationFrame(tick); })(t0);
  }

  /* Copy contact details */
  var out = document.getElementById('copied');
  function bindCopy(btnId, textId, label) {
    var btn = document.getElementById(btnId), el = document.getElementById(textId);
    if (!btn || !el) return;
    btn.addEventListener('click', function () {
      function fallback() {
        var r = document.createRange(); r.selectNodeContents(el);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        out.textContent = 'Press copy on your keyboard to copy the ' + label.toLowerCase() + '.';
      }
      try {
        navigator.clipboard.writeText(el.textContent).then(function () { out.textContent = label + ' copied.'; }, fallback);
      } catch (e) { fallback(); }
    });
  }
  bindCopy('copyBtn', 'mailText', 'Email');
  bindCopy('copyPhoneBtn', 'phoneText', 'Phone number');

  /* Mobile hamburger menu */
  var nav = document.getElementById('siteNav');
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');
  if (nav && navToggle && navMenu) {
    function setMenu(open) {
      nav.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    navToggle.addEventListener('click', function () {
      setMenu(!nav.classList.contains('open'));
    });
    navMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) setMenu(false);
    });
  }

  /* Scroll reveal */
  var reveals = document.querySelectorAll('.reveal');
  if (!reduced && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    reveals.forEach(function (sec) { io.observe(sec); });
  } else {
    reveals.forEach(function (sec) { sec.classList.add('in'); });
  }
})();
