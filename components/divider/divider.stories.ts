import type { Meta, StoryObj } from '@storybook/html-vite';

export default {
  title: 'Components/Divider'
} satisfies Meta;

export const Basic: StoryObj = {
  render: () => `
    <div class="row">
      <div class="col s12">
        <p>Content above the divider.</p>
        <div class="divider"></div>
        <p>Content below the divider.</p>
      </div>
    </div>
  `
};
