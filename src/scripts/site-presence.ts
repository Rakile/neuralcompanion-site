const PARK_DELAY_MS = 2500;
const ORB_MARGIN = 16;
const ORB_OFFSET = 22;

interface Point { x: number; y: number }

const clampPosition = (position: Point, viewport: Point, size: number): Point => ({
  x: Math.min(Math.max(position.x, ORB_MARGIN), Math.max(ORB_MARGIN, viewport.x - size - ORB_MARGIN)),
  y: Math.min(Math.max(position.y, ORB_MARGIN), Math.max(ORB_MARGIN, viewport.y - size - ORB_MARGIN)),
});

if (!document.documentElement.dataset.presenceReady) {
  document.documentElement.dataset.presenceReady = 'true';
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarsePointer = window.matchMedia('(pointer: coarse)');
  let tracker: HTMLElement | null = null;
  let target = { x: window.innerWidth - 112, y: window.innerHeight - 128 };
  let current = { ...target };
  let parkTimer = 0;
  let animationFrame = 0;

  const applyPosition = () => {
    if (tracker) tracker.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0)`;
  };

  const animate = () => {
    const deltaX = target.x - current.x;
    const deltaY = target.y - current.y;
    current.x += deltaX * 0.12;
    current.y += deltaY * 0.12;
    applyPosition();
    if (Math.abs(deltaX) > 0.25 || Math.abs(deltaY) > 0.25) {
      animationFrame = window.requestAnimationFrame(animate);
    } else {
      current = { ...target };
      applyPosition();
      animationFrame = 0;
    }
  };

  const moveToTarget = () => {
    if (reducedMotion.matches || coarsePointer.matches) {
      current = { ...target };
      applyPosition();
      return;
    }
    if (!animationFrame) animationFrame = window.requestAnimationFrame(animate);
  };

  const parkOrb = () => {
    const size = tracker?.getBoundingClientRect().width || 84;
    target = clampPosition(
      { x: window.innerWidth - size - 24, y: window.innerHeight - size - 24 },
      { x: window.innerWidth, y: window.innerHeight },
      size,
    );
    if (tracker) tracker.dataset.state = 'idle';
    moveToTarget();
  };

  const refreshPage = () => {
    tracker = document.querySelector<HTMLElement>('[data-orb-tracker]');
    parkOrb();
  };

  document.addEventListener('pointermove', (event) => {
    if (reducedMotion.matches || coarsePointer.matches || !tracker) return;
    const size = tracker.getBoundingClientRect().width || 84;
    target = clampPosition(
      { x: event.clientX + ORB_OFFSET, y: event.clientY + ORB_OFFSET },
      { x: window.innerWidth, y: window.innerHeight },
      size,
    );
    tracker.dataset.state = 'tracking';
    moveToTarget();
    window.clearTimeout(parkTimer);
    parkTimer = window.setTimeout(parkOrb, PARK_DELAY_MS);
  }, { passive: true });

  reducedMotion.addEventListener('change', parkOrb);
  coarsePointer.addEventListener('change', parkOrb);
  window.addEventListener('resize', parkOrb, { passive: true });
  document.addEventListener('astro:page-load', refreshPage);
  window.addEventListener('pagehide', () => window.cancelAnimationFrame(animationFrame), { once: true });
  refreshPage();
}
