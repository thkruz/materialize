import type { Meta, StoryObj } from '@storybook/html-vite';

export default {
  title: 'Components/Badge'
} satisfies Meta;

export const Basic: StoryObj = {
  render: () => `
    <ul class="collection">
      <li class="collection-item">
        Inbox<span class="badge">4</span>
      </li>
      <li class="collection-item">
        Spam<span class="badge">1</span>
      </li>
    </ul>
  `
};

export const New: StoryObj = {
  render: () => `
    <ul class="collection">
      <li class="collection-item">
        Notifications<span class="badge new">4</span>
      </li>
      <li class="collection-item">
        Messages<span class="badge new" data-badge-caption="unread">7</span>
      </li>
    </ul>
  `
};
