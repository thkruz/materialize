describe('Materialbox:', () => {
  const fixture = `<div id="transformTest" style="transform: translate3d(1px,1px,1px)">
  <img
    class="materialboxed"
    width="650"
    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==">
</div>`;

  beforeEach(() => XloadHtml(fixture));
  afterEach(() => XunloadFixtures());

  describe('Materialbox opens correctly with transformed ancestor', () => {
    it('Opens a correctly placed overlay when clicked', () => {
      const transformMaterialbox = document.querySelector('#transformTest');
      M.Materialbox.init(document.querySelector('.materialboxed'), {
        inDuration: 0,
        outDuration: 0
      });
      // Mouse click
      click(transformMaterialbox.querySelector('.materialboxed'));

      // The overlay is created and positioned synchronously by open(), so it is
      // inspected here without waiting. Materialbox registers a window 'scroll'
      // handler that closes the overlay on any scroll; a stray scroll from an
      // earlier spec (e.g. scrollspy's smooth scrollIntoView) firing during an
      // async wait would otherwise close it first, making this spec fail
      // depending on run order.
      const overlay = transformMaterialbox.querySelector('#materialbox-overlay');
      const overlayRect = overlay.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      expect(overlay).toExist('because it is generated on init');
      expect(overlay).toBeVisible('because materialbox was clicked');
      expect(overlayRect.top).toEqual(0);
      expect(overlayRect.left).toEqual(0);
      expect(overlayRect.width).toEqual(windowWidth);
      expect(overlayRect.height).toEqual(windowHeight);
    });
  });
});
