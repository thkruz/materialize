import type { Meta, StoryObj } from '@storybook/html-vite';
import { Range } from './range';
import { renderAndInit } from '../storyInit';

export default {
  title: 'Components/Range'
} satisfies Meta;

export const Basic: StoryObj = {
  render: renderAndInit(
    `<form action="#">
  <p class="range-field">
    <input type="range" id="range-basic" min="0" max="100" value="30" />
  </p>
</form>`,
    (root) => {
      Range.init(root.querySelector<HTMLInputElement>('input[type=range]')!);
    }
  )
};
