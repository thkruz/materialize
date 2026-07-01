type RGBColor = {
  r: number;
  g: number;
  b: number;
};

type Position = {
  x: number;
  y: number;
};

class Waves {
  static #offset(el: HTMLElement): { top: number; left: number } {
    const box = el.getBoundingClientRect();
    const docElem = document.documentElement;
    return {
      top: box.top + window.pageYOffset - docElem.clientTop,
      left: box.left + window.pageXOffset - docElem.clientLeft
    };
  }

  // https://phoenix-dx.com/css-techniques-for-material-ripple-effect/

  /**
   * Renders the Material ripple ("wave") effect on the target element.
   * @param targetElement Element to render the effect on.
   * @param position Optional origin position; when null the ripple is centered.
   * @param color Optional ripple color.
   */
  static renderWaveEffect(
    targetElement: HTMLElement,
    position: Position | null = null,
    color: RGBColor | null = null
  ): void {
    const isCentered = position === null;
    const duration = 500;
    let animationFrame: number;
    let animationStart: number | undefined;

    const animationStep = (timestamp: number): void => {
      if (!animationStart) animationStart = timestamp;
      const frame = timestamp - animationStart;
      if (frame < duration) {
        const easing = (frame / duration) * (2 - frame / duration);
        const circle = isCentered
          ? 'circle at 50% 50%'
          : `circle at ${position.x}px ${position.y}px`;
        const waveColor = `rgba(${color?.r || 0}, ${color?.g || 0}, ${color?.b || 0}, ${0.3 * (1 - easing)})`;
        const stop = 90 * easing + '%';
        targetElement.style.backgroundImage =
          'radial-gradient(' +
          circle +
          ', ' +
          waveColor +
          ' ' +
          stop +
          ', transparent ' +
          stop +
          ')';
        animationFrame = window.requestAnimationFrame(animationStep);
      } else {
        targetElement.style.backgroundImage = 'none';
        window.cancelAnimationFrame(animationFrame);
      }
    };

    animationFrame = window.requestAnimationFrame(animationStep);
  }

  static Init(): void {
    if (typeof document !== 'undefined')
      document?.addEventListener('DOMContentLoaded', () => {
        document.body.addEventListener('click', (e: MouseEvent) => {
          const trigger = e.target as Element | null;
          const el = trigger?.closest('.waves-effect') as HTMLElement | null;
          if (el && trigger && el.contains(trigger)) {
            const isCircular = el.classList.contains('waves-circle');
            const x = e.pageX - this.#offset(el).left;
            const y = e.pageY - this.#offset(el).top;
            let color: RGBColor | null = null;
            if (el.classList.contains('waves-light')) color = { r: 255, g: 255, b: 255 };
            this.renderWaveEffect(el, isCircular ? null : { x, y }, color);
          }
        });
      });
  }
}

export { Waves };
