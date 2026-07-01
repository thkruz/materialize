import type { Meta, StoryObj } from '@storybook/html-vite';

export default {
  title: 'Components/Navigation Bar'
} satisfies Meta;

const item = (icon: string, label: string, active = false) => `
  <a class="navigation-bar__item${active ? ' active' : ''}">
    <span class="navigation-bar__indicator"><i class="navigation-bar__icon material-icons">${icon}</i></span>
    <span class="navigation-bar__label">${label}</span>
  </a>`;

// The navigation bar is position:fixed to the bottom, so wrap it in a
// relatively-positioned box so it renders inside the story canvas.
const frame = (items: string) => `
  <div style="position:relative;height:120px">
    <nav class="navigation-bar">
      ${items}
    </nav>
  </div>`;

export const ThreeDestinations: StoryObj = {
  render: () =>
    frame(
      [
        item('home', 'Home', true),
        item('search', 'Search'),
        item('person', 'Profile')
      ].join('')
    )
};

export const FiveDestinations: StoryObj = {
  render: () =>
    frame(
      [
        item('home', 'Home', true),
        item('search', 'Search'),
        item('favorite', 'Favorites'),
        item('notifications', 'Alerts'),
        item('person', 'Profile')
      ].join('')
    )
};
