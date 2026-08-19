export {};

declare global {
  interface Window {
    ncTrack?: (eventName: string, parameters?: Record<string, string>) => void;
  }
}

if (!document.documentElement.dataset.addonAudioReady) {
  document.documentElement.dataset.addonAudioReady = 'true';
  let activeAudio: HTMLAudioElement | null = null;

  const setPlaying = (root: HTMLElement, playing: boolean) => {
    const button = root.querySelector<HTMLButtonElement>('[data-addon-audio-toggle]');
    const label = root.querySelector<HTMLElement>('[data-addon-audio-label]');
    button?.setAttribute('aria-pressed', String(playing));
    button?.setAttribute('aria-label', `${playing ? 'Pause' : 'Play'} ${root.dataset.addonName ?? 'addon'} commentary`);
    if (label) label.textContent = playing ? 'Pause commentary' : 'Play commentary';
    root.dataset.playing = String(playing);
  };

  document.addEventListener('click', async (event) => {
    const button = event.target instanceof Element
      ? event.target.closest<HTMLButtonElement>('[data-addon-audio-toggle]')
      : null;
    const root = button?.closest<HTMLElement>('[data-addon-audio]');
    const audio = root?.querySelector<HTMLAudioElement>('[data-addon-audio-element]');
    if (!button || !root || !audio) return;

    if (activeAudio && activeAudio !== audio) {
      activeAudio.pause();
      const previousRoot = activeAudio.closest<HTMLElement>('[data-addon-audio]');
      if (previousRoot) setPlaying(previousRoot, false);
    }

    if (audio.paused) {
      try {
        await audio.play();
        activeAudio = audio;
        setPlaying(root, true);
        window.ncTrack?.('addon_audio_play', {
          addon_name: root.dataset.addonName ?? 'unknown',
          page_path: window.location.pathname,
        });
      } catch {
        setPlaying(root, false);
      }
    } else {
      audio.pause();
      setPlaying(root, false);
    }
  });

  document.addEventListener('ended', (event) => {
    const audio = event.target instanceof HTMLAudioElement ? event.target : null;
    const root = audio?.closest<HTMLElement>('[data-addon-audio]');
    if (root) setPlaying(root, false);
    if (audio === activeAudio) activeAudio = null;
  }, true);

  document.addEventListener('loadedmetadata', (event) => {
    const audio = event.target instanceof HTMLAudioElement ? event.target : null;
    const root = audio?.closest<HTMLElement>('[data-addon-audio]');
    const label = root?.querySelector<HTMLElement>('[data-addon-audio-duration]');
    if (!audio || !label || !Number.isFinite(audio.duration)) return;
    const seconds = Math.round(audio.duration);
    label.textContent = seconds < 60 ? `${seconds} seconds` : `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  }, true);

  document.addEventListener('astro:before-swap', () => activeAudio?.pause());
}
