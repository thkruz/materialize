import type { Meta, StoryObj } from '@storybook/html-vite';

export default {
  title: 'Components/Side Sheet'
} satisfies Meta;

const header = `
  <header class="side-sheet__header">
    <span class="side-sheet__title">Details</span>
    <button class="icon-button" aria-label="Close"><i class="material-icons">close</i></button>
  </header>`;

const body = `
  <p class="body-medium">Supplementary content and actions live in the side sheet, docked to the trailing edge of the screen.</p>
  <ul class="collection" style="border:none">
    <li class="collection-item">Item one</li>
    <li class="collection-item">Item two</li>
    <li class="collection-item">Item three</li>
  </ul>`;

const frame = (inner: string) => `
  <div style="position:relative;height:420px;overflow:hidden;border:1px dashed var(--md-sys-color-outline-variant)">
    ${inner}
  </div>`;

export const Standard: StoryObj = {
  render: () => frame(`<div class="side-sheet open" style="position:absolute">${header}${body}</div>`)
};

export const Modal: StoryObj = {
  render: () =>
    frame(`
      <div class="side-sheet__scrim open"></div>
      <div class="side-sheet side-sheet--modal open" style="position:absolute">${header}${body}</div>`)
};

export const LeftDocked: StoryObj = {
  name: 'Leading-edge dock',
  render: () => frame(`<div class="side-sheet side-sheet--left open" style="position:absolute">${header}${body}</div>`)
};
