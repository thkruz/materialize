import type { Meta, StoryObj } from '@storybook/html-vite';

export default {
  title: 'Components/Breadcrumb'
} satisfies Meta;

export const Basic: StoryObj = {
  render: () => `
    <nav>
      <div class="nav-wrapper">
        <div class="col s12">
          <a href="#!" class="breadcrumb">First</a>
          <a href="#!" class="breadcrumb">Second</a>
          <a href="#!" class="breadcrumb">Third</a>
        </div>
      </div>
    </nav>
  `
};
