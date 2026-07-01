import type { Meta, StoryObj } from '@storybook/html-vite';
import { Dropdown } from './dropdown';
import { renderAndInit } from '../storyInit';

export default {
  title: 'Components/Dropdown'
} satisfies Meta;

export const Basic: StoryObj = {
  render: renderAndInit(
    `
<a class="dropdown-trigger btn" href="#" data-target="dropdown-basic">Drop Me!</a>
<ul id="dropdown-basic" class="dropdown-content">
  <li><a href="#!">one</a></li>
  <li><a href="#!">two</a></li>
  <li class="divider"></li>
  <li><a href="#!">three</a></li>
</ul>`,
    (root) => {
      Dropdown.init(root.querySelectorAll<HTMLElement>('.dropdown-trigger'));
    }
  )
};

export const WithIcons: StoryObj = {
  render: renderAndInit(
    `
<a class="dropdown-trigger btn" href="#" data-target="dropdown-icons">
  <i class="material-icons left">arrow_drop_down</i>Drop Me!
</a>
<ul id="dropdown-icons" class="dropdown-content">
  <li><a href="#!"><i class="material-icons">cloud</i>one</a></li>
  <li><a href="#!"><i class="material-icons">person</i>two</a></li>
  <li class="divider"></li>
  <li><a href="#!"><i class="material-icons">settings</i>three</a></li>
</ul>`,
    (root) => {
      Dropdown.init(root.querySelectorAll<HTMLElement>('.dropdown-trigger'), {
        coverTrigger: false
      });
    }
  )
};
