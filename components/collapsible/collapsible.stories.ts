import type { Meta, StoryObj } from '@storybook/html-vite';
import { Collapsible } from './collapsible';
import { renderAndInit } from '../storyInit';

export default {
  title: 'Components/Collapsible'
} satisfies Meta;

const items = `
  <li>
    <div class="collapsible-header"><i class="material-icons">filter_drama</i>First</div>
    <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
  </li>
  <li class="active">
    <div class="collapsible-header"><i class="material-icons">place</i>Second</div>
    <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
  </li>
  <li>
    <div class="collapsible-header"><i class="material-icons">whatshot</i>Third</div>
    <div class="collapsible-body"><p>Lorem ipsum dolor sit amet.</p></div>
  </li>`;

export const Accordion: StoryObj = {
  render: renderAndInit(`<ul class="collapsible">${items}</ul>`, (root) => {
    Collapsible.init(root.querySelector<HTMLElement>('.collapsible')!, { accordion: true });
  })
};

export const Expandable: StoryObj = {
  render: renderAndInit(
    `<ul class="collapsible expandable" data-collapsible="expandable">${items}</ul>`,
    (root) => {
      Collapsible.init(root.querySelector<HTMLElement>('.collapsible')!, { accordion: false });
    }
  )
};
