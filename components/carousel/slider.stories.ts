import type { Meta, StoryObj } from '@storybook/html-vite';
import { Slider } from './slider';
import { renderAndInit } from '../storyInit';

export default {
  title: 'Components/Slider'
} satisfies Meta;

// Encode the whole SVG so the data URI is valid (the `#` in the fill and the
// markup's spaces/quotes must all be encoded, not just the angle brackets).
const solidImage = (color: string) =>
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400"><rect width="800" height="400" fill="${color}"/></svg>`
  );

const slide = (label: string, color: string, align: string, tagline: string) =>
  `<li>
    <img src="${solidImage(color)}" alt="${label}">
    <div class="caption ${align}">
      <h3 class="white-text">${tagline}</h3>
      <h5 class="light grey-text text-lighten-3">Here's our small slogan.</h5>
    </div>
  </li>`;

// Darker fills so the white caption text stays legible in both themes.
const slides = [
  slide('First slide', '#b71c1c', 'center-align', 'This is our big Tagline!'),
  slide('Second slide', '#0d47a1', 'left-align', 'Left Aligned Caption'),
  slide('Third slide', '#1b5e20', 'right-align', 'Right Aligned Caption'),
  slide('Fourth slide', '#e65100', 'center-align', 'This is our big Tagline!')
].join('');

export const Basic: StoryObj = {
  render: renderAndInit(
    `<div id="slider-basic" class="slider simple-slider">
  <ul class="slides">
    ${slides}
  </ul>
</div>`,
    (root) => {
      Slider.init(root.querySelector<HTMLElement>('.slider')!, {
        pauseOnFocus: true,
        indicatorLabelFunc: (idx) => 'Slide ' + idx
      });
    }
  )
};
