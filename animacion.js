const navToggle = document.querySelector('.nav-toggle');
const primaryNavigation = document.querySelector('#primary-navigation');

if (navToggle && primaryNavigation) {
  const reducedMotionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  let menuAnimation;

  primaryNavigation.setAttribute('aria-hidden', 'true');
  primaryNavigation.inert = true;

  function setNavigationOpen(isOpen) {
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    primaryNavigation.setAttribute('aria-hidden', String(!isOpen));
    primaryNavigation.inert = !isOpen;

    if (isOpen) {
      primaryNavigation.classList.add('is-open');

      if (reducedMotionPreference.matches || typeof primaryNavigation.animate !== 'function') {
        menuAnimation?.cancel();
        menuAnimation = undefined;
        return;
      }

      const startStyles = menuAnimation
        ? getComputedStyle(primaryNavigation)
        : { opacity: '0', transform: 'translateY(-8px)' };
      const from = { opacity: startStyles.opacity, transform: startStyles.transform };
      menuAnimation?.cancel();
      menuAnimation = primaryNavigation.animate(
        [from, { opacity: 1, transform: 'translateY(0)' }],
        { duration: 220, easing: 'ease-out' }
      );
      const openingAnimation = menuAnimation;
      openingAnimation.onfinish = () => {
        if (menuAnimation === openingAnimation) {
          menuAnimation = undefined;
        }
      };
      return;
    }

    if (!primaryNavigation.classList.contains('is-open')) {
      return;
    }

    if (reducedMotionPreference.matches || typeof primaryNavigation.animate !== 'function') {
      menuAnimation?.cancel();
      menuAnimation = undefined;
      primaryNavigation.classList.remove('is-open');
      return;
    }

    const startStyles = getComputedStyle(primaryNavigation);
    const from = { opacity: startStyles.opacity, transform: startStyles.transform };
    menuAnimation?.cancel();
    menuAnimation = primaryNavigation.animate(
      [from, { opacity: 0, transform: 'translateY(-8px)' }],
      { duration: 160, easing: 'ease-in' }
    );
    const closingAnimation = menuAnimation;
    closingAnimation.onfinish = () => {
      if (menuAnimation === closingAnimation && navToggle.getAttribute('aria-expanded') === 'false') {
        primaryNavigation.classList.remove('is-open');
        menuAnimation = undefined;
      }
    };
  }

  navToggle.addEventListener('click', () => {
    setNavigationOpen(navToggle.getAttribute('aria-expanded') !== 'true');
  });

  primaryNavigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setNavigationOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navToggle.getAttribute('aria-expanded') === 'true') {
      setNavigationOpen(false);
      navToggle.focus();
    }
  });

  reducedMotionPreference.addEventListener('change', (event) => {
    if (event.matches && menuAnimation) {
      menuAnimation.cancel();
      menuAnimation = undefined;
      primaryNavigation.classList.toggle('is-open', navToggle.getAttribute('aria-expanded') === 'true');
    }
  });
}
