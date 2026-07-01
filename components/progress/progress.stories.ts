import type { Meta, StoryObj } from '@storybook/html-vite';

export default {
  title: 'Components/Progress'
} satisfies Meta;

export const Determinate: StoryObj = {
  render: () => `
    <div class="progress">
      <div class="determinate" style="width: 70%"></div>
    </div>
  `
};

export const Indeterminate: StoryObj = {
  render: () => `
    <div class="progress">
      <div class="indeterminate"></div>
    </div>
  `
};
