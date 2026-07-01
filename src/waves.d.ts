export class Waves {
  /**
   * Renders the Material ripple ("wave") effect on the target element.
   * @param targetElement Element to render the effect on.
   * @param position Optional origin position; when null the ripple is centered.
   * @param color Optional ripple color.
   */
  static renderWaveEffect(
    targetElement: HTMLElement,
    position?: { x: number; y: number } | null,
    color?: string | null
  ): void;

  /**
   * Initializes the global click handler that triggers wave effects.
   */
  static Init(): void;
}
