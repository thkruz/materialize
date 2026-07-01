import type { Meta, StoryObj } from '@storybook/html-vite';
import { Carousel } from './carousel';
import { renderAndInit } from '../storyInit';

export default {
  title: 'Components/Carousel'
} satisfies Meta;

const panel = (label: string, color: string) =>
  `<a class="carousel-item" href="#!"><div style="width:200px;height:200px;display:flex;align-items:center;justify-content:center;background:${color};color:#fff;font-size:3rem;">${label}</div></a>`;

const panels = [
  panel('1', '#e57373'),
  panel('2', '#64b5f6'),
  panel('3', '#81c784'),
  panel('4', '#ffb74d'),
  panel('5', '#ba68c8')
].join('');

export const Basic: StoryObj = {
  render: renderAndInit(`<div class="carousel">${panels}</div>`, (root) => {
    Carousel.init(root.querySelector<HTMLElement>('.carousel')!);
  })
};

export const NoWrap: StoryObj = {
  render: renderAndInit(`<div class="carousel">${panels}</div>`, (root) => {
    Carousel.init(root.querySelector<HTMLElement>('.carousel')!, { noWrap: true });
  })
};
