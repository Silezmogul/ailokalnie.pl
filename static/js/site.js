(() => {
  'use strict';

  // Dropdown menu (fresh implementation)
  const navToggleBtn = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('#navmenu');
  const body = document.body;

  const setMenuOpen = (open) => {
    if (!navToggleBtn || !navMenu) return;
    body.classList.toggle('nav-open', open);
    navToggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  };

  const toggleMenu = () => {
    const open = body.classList.contains('nav-open');
    setMenuOpen(!open);
  };

  if (navToggleBtn && navMenu) {
    navToggleBtn.addEventListener('click', toggleMenu);

    navMenu.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    });

    document.addEventListener('click', (e) => {
      if (!body.classList.contains('nav-open')) return;
      const t = e.target;
      if (t instanceof Element && (t.closest('#navmenu') || t.closest('.mobile-nav-toggle'))) return;
      setMenuOpen(false);
    });
  }

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

  // Correct scrolling position upon page load for URLs containing hash links.
  window.addEventListener('load', () => {
    if (!window.location.hash) return;
    if (!document.querySelector(window.location.hash)) return;
    setTimeout(() => {
      const section = document.querySelector(window.location.hash);
      if (!section) return;
      const scrollMarginTop = getComputedStyle(section).scrollMarginTop;
      window.scrollTo({
        top: section.offsetTop - parseInt(scrollMarginTop, 10),
        behavior: 'smooth',
      });
    }, 100);
  });

  // Navmenu Scrollspy
  const navmenulinks = document.querySelectorAll('.navmenu a');
  const navmenuScrollspy = () => {
    navmenulinks.forEach((navmenulink) => {
      if (!navmenulink.hash) return;
      const section = document.querySelector(navmenulink.hash);
      if (!section) return;
      const position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight) {
        document.querySelectorAll('.navmenu a.active').forEach((link) => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    });
  };
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);
})();
