import type { Meta, StoryObj } from '@storybook/html-vite';

export default {
  title: 'Components/Switch'
} satisfies Meta;

export const Basic: StoryObj = {
  render: () => `
    <div class="switch">
      <label>
        Off
        <input type="checkbox">
        <span class="lever"></span>
        On
      </label>
    </div>
  `
};

export const Checked: StoryObj = {
  render: () => `
    <div class="switch">
      <label>
        Off
        <input type="checkbox" checked>
        <span class="lever"></span>
        On
      </label>
    </div>
  `
};

export const Disabled: StoryObj = {
  render: () => `
    <div class="switch">
      <label>
        Off
        <input type="checkbox" disabled>
        <span class="lever"></span>
        On
      </label>
    </div>
  `
};
