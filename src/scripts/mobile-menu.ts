const initializeMobileMenus = () => {
  document.querySelectorAll<HTMLElement>('[data-site-header]').forEach((header) => {
    if (header.dataset.menuReady === 'true') return;
    header.dataset.menuReady = 'true';
    const toggle = header.querySelector<HTMLButtonElement>('[data-mobile-menu-toggle]');
    const menu = header.querySelector<HTMLElement>('[data-mobile-menu]');
    if (!toggle || !menu) return;

    const close = () => {
      header.dataset.menuOpen = 'false';
      toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', () => {
      const open = header.dataset.menuOpen !== 'true';
      header.dataset.menuOpen = String(open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    menu.addEventListener('click', (event) => {
      if (event.target instanceof HTMLAnchorElement) close();
    });
    window.matchMedia('(min-width: 861px)').addEventListener('change', close);
  });
};

document.addEventListener('astro:page-load', initializeMobileMenus);
initializeMobileMenus();
