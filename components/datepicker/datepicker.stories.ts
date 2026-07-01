import type { Meta, StoryObj } from '@storybook/html-vite';
import { Datepicker } from './datepicker';
import { renderAndInit } from '../storyInit';

export default {
  title: 'Components/Datepicker'
} satisfies Meta;

export const Basic: StoryObj = {
  render: renderAndInit(
    `
<div class="row">
  <div class="input-field col s12">
    <input type="text" class="datepicker" id="datepicker-basic">
    <label for="datepicker-basic">Pick a date</label>
  </div>
</div>`,
    (root) => {
      Datepicker.init(root.querySelector<HTMLInputElement>('.datepicker')!, {
        displayPlugin: 'modal'
      });
    }
  )
};

export const StringFormat: StoryObj = {
  render: renderAndInit(
    `
<div class="row">
  <div class="input-field col s12">
    <input type="text" class="datepicker" id="datepicker-format">
    <label for="datepicker-format">Pick a date (mm/dd/yyyy)</label>
  </div>
</div>`,
    (root) => {
      Datepicker.init(root.querySelector<HTMLInputElement>('.datepicker')!, {
        format: 'mm/dd/yyyy',
        displayPlugin: 'modal'
      });
    }
  )
};
