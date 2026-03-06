(() => {
  'use strict';

  // Apply .scrolled class to the body as the page is scrolled down
  // (MinimalFolio behavior used by header/nav styling)
  const toggleScrolled = () => {
    const header = document.querySelector('#header');
    if (!header) return;

    // Only apply if header is configured as a sticky-like header.
    if (!header.classList.contains('scroll-up-sticky') && !header.classList.contains('sticky-top') && !header.classList.contains('fixed-top')) {
      return;
    }

    window.scrollY > 100 ? document.body.classList.add('scrolled') : document.body.classList.remove('scrolled');
  };

  // Mobile nav toggle (Bootstrap icons)
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');
  const body = document.body;

  const toggleMobileNav = () => {
    body.classList.toggle('mobile-nav-active');
    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.classList.toggle('bi-list');
      mobileNavToggleBtn.classList.toggle('bi-x');
    }
  };

  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', toggleMobileNav);
  }

  // Hide mobile nav on same-page/hash links
  document.querySelectorAll('#navmenu a').forEach((a) => {
    a.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        toggleMobileNav();
      }
    });
  });

  document.addEventListener('scroll', toggleScrolled, { passive: true });
  window.addEventListener('load', toggleScrolled);

  // AOS init (if loaded)
  window.addEventListener('load', () => {
    if (window.AOS && typeof window.AOS.init === 'function') {
      window.AOS.init({ duration: 600, easing: 'ease-in-out', once: true, mirror: false });
    }
  });

  // Smooth anchor scroll with mid-viewport landing + view arrows behavior
  (function () {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const id = href.slice(1);
      const el = document.getElementById(id);
      if (!el) return;

      e.preventDefault();

      const r = el.getBoundingClientRect();
      const absoluteTop = window.scrollY + r.top;
      const targetY = Math.max(0, absoluteTop - window.innerHeight * 0.25);
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });

    const update = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const what = document.getElementById('what');
      const how = document.getElementById('how');
      const arrow = what ? what.querySelector('.what-arrow') : null;
      if (!what || !how || !arrow) return;

      const wr = what.getBoundingClientRect();
      const hr = how.getBoundingClientRect();

      const centerY = vh * 0.45;
      const centerInWhat = wr.top <= centerY && wr.bottom >= centerY;
      const howEntering = hr.top <= vh * 1.15;

      const show = centerInWhat && !howEntering;
      arrow.style.opacity = show ? '1' : '0';
      arrow.style.pointerEvents = show ? 'auto' : 'none';

      const hero = document.getElementById('hero');
      const heroArrow = hero ? hero.querySelector('.hero-arrow') : null;
      if (hero && heroArrow) {
        const hr = hero.getBoundingClientRect();
        const heroVisible = hr.bottom > 0 && hr.top < vh;
        const scrolledPx = Math.max(0, -hr.top);
        const fadeEnd = 10;
        const showHero = heroVisible && scrolledPx < fadeEnd;
        heroArrow.style.opacity = showHero ? '1' : '0';
        heroArrow.style.pointerEvents = showHero ? 'auto' : 'none';
      }
    };

    const what = document.getElementById('what');
    const how = document.getElementById('how');
    const arrow = what ? what.querySelector('.what-arrow') : null;
    if (arrow && how) {
      arrow.addEventListener('click', (e) => {
        e.preventDefault();
        how.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    const hero = document.getElementById('hero');
    const heroArrow = hero ? hero.querySelector('.hero-arrow') : null;
    if (heroArrow && what) {
      heroArrow.addEventListener('click', (e) => {
        e.preventDefault();
        what.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    let raf = 0;
    const schedule = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    schedule();
  })();
})();
