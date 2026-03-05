(() => {
  'use strict';

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

  // Close mobile nav on in-page links
  document.querySelectorAll('#navmenu a[href^="#"]').forEach((a) => {
    a.addEventListener('click', () => {
      if (body.classList.contains('mobile-nav-active')) toggleMobileNav();
    });
  });

  // AOS init (if loaded)
  window.addEventListener('load', () => {
    if (window.AOS && typeof window.AOS.init === 'function') {
      window.AOS.init({ duration: 600, easing: 'ease-in-out', once: true, mirror: false });
    }
  });
})();
