(function () {
  document.documentElement.classList.add('js');

  var navToggle = document.querySelector('.nav-toggle');
  var siteNav = document.getElementById('site-nav');

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var isOpen = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    siteNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    siteNav.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && siteNav.classList.contains('is-open')) {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });
  }

  var revealTargets = document.querySelectorAll('.reveal');

  if (revealTargets.length && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealTargets.forEach(function (target) {
      revealObserver.observe(target);
    });
  } else {
    revealTargets.forEach(function (target) {
      target.classList.add('is-visible');
    });
  }

  // Videos play only while visible, and never when the visitor asked for less
  // motion. Without JS they keep their controls and stay paused.
  var autoplayVideos = document.querySelectorAll('video.js-autoplay-in-view');
  var prefersReducedMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  if (autoplayVideos.length && !prefersReducedMotion && 'IntersectionObserver' in window) {
    var videoObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var video = entry.target;

        if (entry.isIntersecting) {
          var attempt = video.play();

          // Browsers reject autoplay in some contexts; the controls still work.
          if (attempt && typeof attempt.catch === 'function') {
            attempt.catch(function () {});
          }
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.4 });

    autoplayVideos.forEach(function (video) {
      videoObserver.observe(video);
    });
  }

  var filterButtons = document.querySelectorAll('.filter-btn');
  var miniCards = document.querySelectorAll('.mini-card');

  if (filterButtons.length && miniCards.length) {
    filterButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var filter = button.getAttribute('data-filter');

        filterButtons.forEach(function (btn) {
          btn.setAttribute('aria-pressed', String(btn === button));
        });

        miniCards.forEach(function (card) {
          var matches = filter === 'all' || card.getAttribute('data-domain') === filter;
          card.hidden = !matches;
        });
      });
    });
  }
})();
