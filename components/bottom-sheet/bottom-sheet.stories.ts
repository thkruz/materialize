import type { Meta, StoryObj } from '@storybook/html-vite';

export default {
  title: 'Components/Bottom Sheet'
} satisfies Meta;

const list = `
  <ul class="collection" style="margin:0;border:none">
    <li class="collection-item"><i class="material-icons" style="vertical-align:middle;margin-right:12px">share</i>Share</li>
    <li class="collection-item"><i class="material-icons" style="vertical-align:middle;margin-right:12px">link</i>Get link</li>
    <li class="collection-item"><i class="material-icons" style="vertical-align:middle;margin-right:12px">edit</i>Edit name</li>
    <li class="collection-item"><i class="material-icons" style="vertical-align:middle;margin-right:12px">delete</i>Delete</li>
  </ul>`;

const frame = (inner: string) => `
  <div style="position:relative;height:420px;overflow:hidden;border:1px dashed var(--md-sys-color-outline-variant)">
    ${inner}
  </div>`;

export const Standard: StoryObj = {
  render: () =>
    frame(`
      <div class="bottom-sheet open">
        <div class="bottom-sheet__handle"></div>
        ${list}
      </div>`)
};

export const Modal: StoryObj = {
  render: () =>
    frame(`
      <div class="bottom-sheet__scrim open"></div>
      <div class="bottom-sheet bottom-sheet--modal open">
        <div class="bottom-sheet__handle"></div>
        ${list}
      </div>`)
};
