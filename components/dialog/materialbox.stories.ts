import type { Meta, StoryObj } from '@storybook/html-vite';
import { Materialbox } from './materialbox';
import { renderAndInit } from '../storyInit';

export default {
  title: 'Components/Materialbox'
} satisfies Meta;

const image =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='650' height='400'%3E%3Crect width='650' height='400' fill='%2381c784'/%3E%3C/svg%3E";

export const Basic: StoryObj = {
  render: renderAndInit(
    `<div id="materialbox-basic">
  <img class="materialboxed" width="650" src="${image}">
</div>`,
    (root) => {
      Materialbox.init(root.querySelectorAll<HTMLElement>('.materialboxed'), {
        inDuration: 275,
        outDuration: 200
      });
    }
  )
};
