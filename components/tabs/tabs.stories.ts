import type { Meta, StoryObj } from '@storybook/html-vite';
import { Tabs } from './tabs';
import { renderAndInit } from '../storyInit';

export default {
  title: 'Components/Tabs'
} satisfies Meta;

export const Basic: StoryObj = {
  render: renderAndInit(
    `
<div class="row">
  <div class="col s12">
    <ul class="tabs">
      <li class="tab col s3"><a class="active" href="#tabs-basic-1">Tab 1</a></li>
      <li class="tab col s3"><a href="#tabs-basic-2">Tab 2</a></li>
      <li class="tab col s3 disabled"><a href="#tabs-basic-3">Disabled</a></li>
      <li class="tab col s3"><a href="#tabs-basic-4">Tab 4</a></li>
    </ul>
  </div>
  <div id="tabs-basic-1" class="col s12">Content of Tab 1</div>
  <div id="tabs-basic-2" class="col s12">Content of Tab 2</div>
  <div id="tabs-basic-3" class="col s12">Content of Tab 3</div>
  <div id="tabs-basic-4" class="col s12">Content of Tab 4</div>
</div>`,
    (root) => {
      Tabs.init(root.querySelector<HTMLElement>('.tabs')!, { duration: 300 });
    }
  )
};
