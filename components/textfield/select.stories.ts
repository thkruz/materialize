import type { Meta, StoryObj } from '@storybook/html-vite';
import { FormSelect } from './select';
import { renderAndInit } from '../storyInit';

export default {
  title: 'Components/Select'
} satisfies Meta;

export const Basic: StoryObj = {
  render: renderAndInit(
    `
<div class="row">
  <div class="input-field col s12">
    <select id="select-basic">
      <option value="" disabled selected>Choose your option</option>
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
      <option value="3">Option 3</option>
    </select>
    <label for="select-basic">Materialize Select</label>
  </div>
</div>`,
    (root) => {
      FormSelect.init(root.querySelector<HTMLSelectElement>('select')!);
    }
  )
};

export const Multiple: StoryObj = {
  render: renderAndInit(
    `
<div class="row">
  <div class="input-field col s12">
    <select id="select-multiple" multiple>
      <option value="" disabled>Choose your options</option>
      <option value="1">Option 1</option>
      <option value="2" selected>Option 2</option>
      <option value="3" selected>Option 3</option>
    </select>
    <label for="select-multiple">Materialize Multiple Select</label>
  </div>
</div>`,
    (root) => {
      FormSelect.init(root.querySelector<HTMLSelectElement>('select')!);
    }
  )
};

export const OptionGroups: StoryObj = {
  render: renderAndInit(
    `
<div class="row">
  <div class="input-field col s12">
    <select id="select-optgroup">
      <option value="" disabled selected>Choose your option</option>
      <optgroup label="Team 1">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </optgroup>
      <optgroup label="Team 2">
        <option value="3">Option 3</option>
        <option value="4">Option 4</option>
      </optgroup>
    </select>
    <label for="select-optgroup">Materialize Select</label>
  </div>
</div>`,
    (root) => {
      FormSelect.init(root.querySelector<HTMLSelectElement>('select')!);
    }
  )
};

// `browser-default` selects are intentionally left as native controls — FormSelect
// skips them — so they use a plain label rather than a floating `.input-field` one.
export const BrowserDefault: StoryObj = {
  render: () => `
<div class="row">
  <div class="col s12">
    <label for="select-browser-default">Browser Default Select</label>
    <select id="select-browser-default" class="browser-default">
      <option value="" disabled selected>Choose your option</option>
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
      <option value="3">Option 3</option>
    </select>
  </div>
</div>`
};
