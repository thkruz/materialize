import type { Meta, StoryObj } from '@storybook/html-vite';
import { Sidenav } from './sidenav';
import { renderAndInit } from '../storyInit';

export default {
  title: 'Components/Sidenav'
} satisfies Meta;

export const Basic: StoryObj = {
  render: renderAndInit(
    `
<a href="#" data-target="sidenav-basic" class="sidenav-trigger btn">
  <i class="material-icons">menu</i>
</a>
<ul id="sidenav-basic" class="sidenav">
  <li><a href="#!"><i class="material-icons">cloud</i>First Link With Icon</a></li>
  <li><a href="#!">Second Link</a></li>
  <li><div class="divider"></div></li>
  <li><a class="subheader">Subheader</a></li>
  <li><a class="waves-effect" href="#!">Third Link With Waves</a></li>
</ul>`,
    (root) => {
      Sidenav.init(root.querySelector<HTMLElement>('.sidenav')!);
    }
  )
};
