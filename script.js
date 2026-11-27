/* ===== Edit these to personalise the site ===== */
var ADMIN_EMAILS = ["komreganesh338@gmail.com"];
var CLOUDINARY_CLOUD = "py7yievr";
var CLOUDINARY_PRESET = "bablu-reels";
var firebaseConfig = {
  apiKey: "AIzaSyAgALqr6RtT9cmeFQ4ZavMaubsJLop1cYs",
  authDomain: "bablu-editzz.firebaseapp.com",
  projectId: "bablu-editzz",
  storageBucket: "bablu-editzz.firebasestorage.app",
  messagingSenderId: "676770700175",
  appId: "1:676770700175:web:fd125929dd686d208a49fa"
};
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

  function renderReel(r, opts) {
    var wrap = document.createElement('div');
    wrap.style.position = 'relative';
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
    el.style.setProperty('--g', r.g || 'linear-gradient(160deg,#3a1c2e,#16182a 70%)');
    el.innerHTML =
      '<span class="tc"></span>' +
      '<span class="play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4l14 8-14 8z"/></svg></span>' +
      '<span class="meta"><h3></h3><span></span></span>';
    var tcEl = el.querySelector('.tc');
    tcEl.textContent = r.time || '00:00:00:00';
    el.querySelector('h3').textContent = r.title;
    el.querySelector('.meta span').textContent = r.tag || 'Edited Reel';

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

    if (opts && opts.onRemove) {
      var rm = document.createElement('button');
      rm.type = 'button';
      rm.className = 'reel-remove';
      rm.textContent = 'Remove';
      rm.hidden = !isAdmin();
      rm.addEventListener('click', function (e) {
        e.stopPropagation();
        opts.onRemove(wrap);
      });
      wrap.appendChild(rm);
    }

    wrap.appendChild(el);
    if (opts && opts.prepend && grid.firstChild) {
      grid.insertBefore(wrap, grid.firstChild);
    } else {
      grid.appendChild(wrap);
    }
    return wrap;
  }

  var adminActive = false;
  function isAdmin() { return adminActive; }

  REELS.forEach(function (r) { renderReel(r); });

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

  /* Firebase Auth + Firestore live reels (admin-only upload, visible to all visitors) */
  var adminBar = document.getElementById('adminBar');
  var addVideoBtn = document.getElementById('addVideoBtn');
  var lockAdminBtn = document.getElementById('lockAdminBtn');
  var adminModal = document.getElementById('adminModal');
  var adminModalClose = document.getElementById('adminModalClose');
  var adminForm = document.getElementById('adminForm');
  var adminError = document.getElementById('adminError');
  var adminSubmitBtn = document.getElementById('adminSubmitBtn');

  function syncAdminUi() {
    if (adminBar) adminBar.hidden = !adminActive;
    document.querySelectorAll('.reel-remove').forEach(function (btn) { btn.hidden = !adminActive; });
  }

  function isAuthorizedEmail(email) {
    if (!email) return false;
    var lower = email.toLowerCase();
    return ADMIN_EMAILS.some(function (a) { return a.toLowerCase() === lower; });
  }

  var signInAdmin = function () {
    if (window.location.protocol === 'file:') {
      window.alert('Google Sign-In cannot run on file:///. Open the site with Live Server (http://localhost:5500) or your GitHub Pages URL.');
      return;
    }
    window.alert('Firebase did not finish loading. Check your internet connection and refresh the page.');
  };

  var adminTrigger = document.getElementById('adminTrigger');
  if (adminTrigger) {
    adminTrigger.addEventListener('click', function () {
      if (adminActive) {
        var reelsSec = document.getElementById('reels');
        if (reelsSec) reelsSec.scrollIntoView({ behavior: 'smooth' });
        if (addVideoBtn) addVideoBtn.focus();
      } else {
        signInAdmin();
      }
    });
  }

  if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    var auth = firebase.auth();
    var db = firebase.firestore();
    var cloudNodes = [];

    auth.getRedirectResult().catch(function (err) {
      if (err && err.message) window.alert('Sign-in failed: ' + err.message);
    });

    function clearCloudReels() {
      cloudNodes.forEach(function (n) { n.remove(); });
      cloudNodes = [];
    }

    db.collection('reels').orderBy('createdAt', 'asc').onSnapshot(function (snap) {
      clearCloudReels();
      snap.forEach(function (doc) {
        var data = doc.data() || {};
        var node = renderReel({
          title: data.title || 'New Edit',
          tag: data.tag || 'Edited Reel',
          time: '00:00:00:00',
          video: data.video || undefined,
          url: data.url || undefined,
          g: data.g
        }, {
          prepend: true,
          onRemove: function () {
            if (!adminActive) return;
            if (!window.confirm('Remove "' + (data.title || 'this reel') + '" for all visitors?')) return;
            db.collection('reels').doc(doc.id).delete().catch(function (err) {
              window.alert('Could not delete: ' + err.message);
            });
          }
        });
        cloudNodes.push(node);
      });
      syncAdminUi();
    }, function () {
      /* Firestore unavailable or rules not set yet — keep static REELS visible */
    });

    signInAdmin = function () {
      if (window.location.protocol === 'file:') {
        window.alert('Google Sign-In cannot run on file:///. Open the site via http://localhost:5500 or GitHub Pages.');
        return;
      }
      var provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      auth.signInWithPopup(provider).catch(function (err) {
        if (!err) return;
        if (err.code === 'auth/popup-blocked') {
          if (window.self === window.top) {
            auth.signInWithRedirect(provider);
          } else {
            window.alert('Popup was blocked inside the preview pane. Open http://localhost:5500 in Chrome or Edge to sign in.');
          }
        } else if (err.code === 'auth/operation-not-supported-in-this-environment') {
          window.alert('Google Sign-In is blocked in this preview browser. Open http://localhost:5500 directly in Chrome or Edge.');
        } else if (err.code !== 'auth/popup-closed-by-user') {
          window.alert('Sign-in failed (' + err.code + '): ' + err.message);
        }
      });
    };

    auth.onAuthStateChanged(function (user) {
      if (user) {
        if (isAuthorizedEmail(user.email)) {
          adminActive = true;
          syncAdminUi();
        } else {
          adminActive = false;
          syncAdminUi();
          auth.signOut();
          window.alert('Access denied: ' + user.email + ' is not an authorized admin.');
        }
      } else {
        adminActive = false;
        syncAdminUi();
        if (window.location.search.indexOf('admin') !== -1) {
          signInAdmin();
        }
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        if (!adminActive) signInAdmin();
      }
    });

    if (lockAdminBtn) {
      lockAdminBtn.addEventListener('click', function () {
        auth.signOut();
      });
    }

    if (addVideoBtn && adminModal) {
      addVideoBtn.addEventListener('click', function () {
        adminError.textContent = '';
        adminForm.reset();
        adminSubmitBtn.disabled = false;
        adminModal.showModal();
      });
    }

    if (adminModalClose && adminModal) {
      adminModalClose.addEventListener('click', function () { adminModal.close(); });
      adminModal.addEventListener('click', function (e) {
        if (e.target === adminModal) adminModal.close();
      });
    }

    if (adminForm) {
      adminForm.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!adminActive) { adminError.textContent = 'Please sign in as admin first.'; return; }

        var title = document.getElementById('newVideoTitle').value.trim();
        var tag = document.getElementById('newVideoTag').value.trim() || 'Edited Reel';
        var fileInput = document.getElementById('newVideoFile');
        var url = document.getElementById('newVideoUrl').value.trim();
        var file = fileInput.files && fileInput.files[0];

        if (!title) { adminError.textContent = 'Please enter a video title.'; return; }
        if (!file && !url) { adminError.textContent = 'Choose a video file or paste an Instagram/video URL.'; return; }

        adminSubmitBtn.disabled = true;
        adminError.textContent = file ? 'Uploading video...' : 'Saving reel...';

        function saveDoc(docData) {
          docData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
          db.collection('reels').add(docData).then(function () {
            adminSubmitBtn.disabled = false;
            adminModal.close();
          }).catch(function (err) {
            adminSubmitBtn.disabled = false;
            adminError.textContent = 'Save failed: ' + err.message;
          });
        }

        if (file) {
          var form = new FormData();
          form.append('file', file);
          form.append('upload_preset', CLOUDINARY_PRESET);

          var xhr = new XMLHttpRequest();
          xhr.open('POST', 'https://api.cloudinary.com/v1_1/' + CLOUDINARY_CLOUD + '/video/upload');
          xhr.upload.onprogress = function (evt) {
            if (evt.lengthComputable) {
              var pct = Math.round((evt.loaded / evt.total) * 100);
              adminError.textContent = 'Uploading video... ' + pct + '%';
            }
          };
          xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                var res = JSON.parse(xhr.responseText);
                saveDoc({ title: title, tag: tag, video: res.secure_url });
              } catch (err) {
                adminSubmitBtn.disabled = false;
                adminError.textContent = 'Upload error: invalid server response.';
              }
            } else {
              adminSubmitBtn.disabled = false;
              var msg = 'Upload failed (' + xhr.status + ').';
              try {
                var errJson = JSON.parse(xhr.responseText);
                if (errJson.error && errJson.error.message) msg = errJson.error.message;
              } catch (e) {}
              adminError.textContent = msg;
            }
          };
          xhr.onerror = function () {
            adminSubmitBtn.disabled = false;
            adminError.textContent = 'Network error while uploading video.';
          };
          xhr.send(form);
        } else {
          var isDirectVideo = /\.(mp4|mov|webm)(\?|$)/i.test(url);
          var payload = { title: title, tag: tag };
          if (isDirectVideo) payload.video = url;
          else payload.url = url;
          saveDoc(payload);
        }
      });
    }
  }
})();
