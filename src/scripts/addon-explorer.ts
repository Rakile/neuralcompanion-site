const initializeAddonExplorers = () => {
  document.querySelectorAll<HTMLElement>('[data-addon-explorer]').forEach((explorer) => {
    if (explorer.dataset.ready === 'true') return;
    explorer.dataset.ready = 'true';

    const search = explorer.querySelector<HTMLInputElement>('[data-addon-search]');
    const filters = [...explorer.querySelectorAll<HTMLButtonElement>('[data-addon-filter]')];
    const cards = [...explorer.querySelectorAll<HTMLElement>('[data-addon-entry]')];
    const count = explorer.querySelector<HTMLElement>('[data-addon-count]');
    let category = 'all';

    const update = () => {
      const query = search?.value.trim().toLocaleLowerCase() ?? '';
      let visible = 0;
      cards.forEach((card) => {
        const matchesCategory = category === 'all' || card.dataset.category === category;
        const haystack = card.dataset.search ?? '';
        const matchesQuery = !query || haystack.includes(query);
        card.hidden = !(matchesCategory && matchesQuery);
        if (!card.hidden) visible += 1;
      });
      if (count) count.textContent = `${visible} addon${visible === 1 ? '' : 's'}`;
    };

    search?.addEventListener('input', update);
    filters.forEach((filter) => {
      filter.addEventListener('click', () => {
        category = filter.dataset.addonFilter ?? 'all';
        filters.forEach((item) => item.setAttribute('aria-pressed', String(item === filter)));
        update();
      });
    });
    update();
  });
};

document.addEventListener('astro:page-load', initializeAddonExplorers);
initializeAddonExplorers();
