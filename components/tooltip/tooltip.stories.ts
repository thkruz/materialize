import type { Meta, StoryObj } from '@storybook/html-vite';
import { Tooltip } from './tooltip';
import { renderAndInit } from '../storyInit';

export default {
  title: 'Components/Tooltip'
} satisfies Meta;

export const Positions: StoryObj = {
  render: renderAndInit(
    `
<div style="padding: 4rem; display: flex; gap: 1rem; flex-wrap: wrap;">
  <a class="btn tooltipped" data-position="top" data-tooltip="Top tooltip">Top</a>
  <a class="btn tooltipped" data-position="right" data-tooltip="Right tooltip">Right</a>
  <a class="btn tooltipped" data-position="bottom" data-tooltip="Bottom tooltip">Bottom</a>
  <a class="btn tooltipped" data-position="left" data-tooltip="Left tooltip">Left</a>
</div>`,
    (root) => {
      Tooltip.init(root.querySelectorAll<HTMLElement>('.tooltipped'));
    }
  )
};
