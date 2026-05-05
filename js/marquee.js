// Trust-strip marquee behavior: hover the strip to slow to ~25%; leave to restore.
// Per-logo "lights up while siblings dim" is handled in CSS via :has().
const SLOW_DURATION = '160s';
const FAST_DURATION = '40s';

export function initMarquee() {
  const tracks = document.querySelectorAll('.marquee-track');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    tracks.forEach((t) => t.style.animation = 'none');
    return;
  }
  tracks.forEach((track) => {
    const wrapper = track.closest('.marquee-mask') || track.parentElement;
    if (!wrapper) return;
    wrapper.addEventListener('mouseenter', () => {
      track.style.animationDuration = SLOW_DURATION;
    });
    wrapper.addEventListener('mouseleave', () => {
      track.style.animationDuration = FAST_DURATION;
    });
  });
}
