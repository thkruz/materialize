import type { Meta, StoryObj } from '@storybook/html-vite';
import { Timepicker } from './timepicker';
import { renderAndInit } from '../storyInit';

export default {
  title: 'Components/Timepicker'
} satisfies Meta;

export const Basic: StoryObj = {
  render: renderAndInit(
    `
<div class="row">
  <div class="input-field col s12">
    <input type="text" class="timepicker" id="timepicker-basic">
    <label for="timepicker-basic">Pick a time</label>
  </div>
</div>`,
    (root) => {
      Timepicker.init(root.querySelector<HTMLInputElement>('.timepicker')!, {
        displayPlugin: 'modal'
      });
    }
  )
};
